"use client";

import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  addDoc,
  query,
  where,
  getDocs,
  writeBatch,
  arrayUnion,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import type { Household, Invite, InviteWithId } from "@/lib/types";

// Get all households a user is a member of
export const getUserHouseholds = async (userId: string): Promise<Household[]> => {
    const householdsRef = collection(db, "households");
    const q = query(householdsRef, where("members", "array-contains", userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Household));
};

// Create a new household for a user
export const createHousehold = async (userId: string, householdName: string): Promise<string> => {
  const householdRef = doc(collection(db, "households"));
  const newHousehold: Omit<Household, 'id'> = {
    name: householdName,
    owner: userId,
    members: [userId],
  };

  const batch = writeBatch(db);
  batch.set(householdRef, newHousehold);

  const userRef = doc(db, "users", userId);
  // This update is not strictly necessary if we query by array-contains,
  // but can be useful for quickly knowing a user's primary/default household.
  // For now, we will let the user choose from a list.
  // batch.update(userRef, { householdId: householdRef.id });

  await batch.commit();

  return householdRef.id;
};

// Invite a user to a household
export const inviteUserToHousehold = async (email: string, invite: Invite) => {
    // 1. Find the user by email
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        throw new Error("User with that email does not exist.");
    }

    const userDoc = querySnapshot.docs[0];
    const userId = userDoc.id;

    // 2. Add an invite to the invited user's subcollection
    const invitesRef = collection(db, "users", userId, "invites");
    await addDoc(invitesRef, invite);
};

// Get pending invites for a user
export const getInvites = async (userId: string): Promise<InviteWithId[]> => {
    const invitesRef = collection(db, "users", userId, "invites");
    const q = query(invitesRef, where("status", "==", "pending"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as InviteWithId));
};

// Accept an invitation
export const acceptInvite = async (userId: string, inviteId: string, householdId: string) => {
    const batch = writeBatch(db);

    // 1. Add user to the household's members list
    const householdRef = doc(db, "households", householdId);
    batch.update(householdRef, {
        members: arrayUnion(userId)
    });

    // 2. Update the invite status to 'accepted'
    const inviteRef = doc(db, "users", userId, "invites", inviteId);
    batch.update(inviteRef, { status: 'accepted' });

    await batch.commit();
};

// Decline an invitation
export const declineInvite = async (userId: string, inviteId: string) => {
    // We can either update status to 'declined' or just delete it.
    // Deleting is cleaner if we don't need a history of declined invites.
    const inviteRef = doc(db, "users", userId, "invites", inviteId);
    await deleteDoc(inviteRef);
};
