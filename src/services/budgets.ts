"use client";

import { db } from "@/lib/firebase";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import type { Budget } from "@/lib/types";

const getBudgetsCollection = (userId: string) => {
  return collection(db, "users", userId, "budgets");
};

export const getBudgets = async (userId: string): Promise<Budget[]> => {
  const budgetsCol = getBudgetsCollection(userId);
  const querySnapshot = await getDocs(budgetsCol);
  return querySnapshot.docs.map((doc) => doc.data() as Budget);
};

export const setBudget = async (userId: string, budget: Budget): Promise<void> => {
  const budgetsCol = getBudgetsCollection(userId);
  // Use the category as the document ID for easy lookup and update.
  const budgetRef = doc(budgetsCol, budget.category);
  await setDoc(budgetRef, budget, { merge: true });
};
