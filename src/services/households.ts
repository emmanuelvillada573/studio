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
} from "firebase/firestore";
import type { Household, Invite } from "@/lib/types";

// Get a user's household
export const getHousehold = async (userId: string): Promise<Household | null> => {
    const userDocRef = doc(db, "users", userId);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
        const householdId = userDocSnap.data().householdId;
        if (householdId) {
            const householdDocRef = doc(db, "households", householdId);
            const householdDocSnap = await getDoc(householdDocRef);
            if (householdDocSnap.exists()) {
                return { id: householdDocSnap.id, ...householdDocSnap.data() } as Household;
            }
        }
    }
    return null;
};

// Create a new household for a user
export const createHousehold = async (userId: string, householdName: string): Promise<string> => {
  const householdRef = doc(collection(db, "households"));
  const newHousehold: Household = {
    id: householdRef.id,
    name: householdName,
    owner: userId,
    members: [userId],
  };
  
  const batch = writeBatch(db);
  batch.set(householdRef, newHousehold);
  
  const userRef = doc(db, "users", userId);
  batch.update(userRef, { householdId: householdRef.id });

  await batch.commit();
  
  return householdRef.id;
};

// Invite a user to a household
export const inviteUserToHousehold = async (email: string, invite: Omit<Invite, 'id'>) => {
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
