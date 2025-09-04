"use client";

import { db } from "@/lib/firebase";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import type { Budget } from "@/lib/types";

// Budgets are now subcollections of a household
const getBudgetsCollection = (householdId: string) => {
  return collection(db, "households", householdId, "budgets");
};

export const getBudgets = async (householdId: string): Promise<Budget[]> => {
  const budgetsCol = getBudgetsCollection(householdId);
  const querySnapshot = await getDocs(budgetsCol);
  return querySnapshot.docs.map((doc) => doc.data() as Budget);
};

export const setBudget = async (householdId: string, budget: Budget): Promise<void> => {
  const budgetsCol = getBudgetsCollection(householdId);
  const budgetRef = doc(budgetsCol, budget.category);
  await setDoc(budgetRef, budget, { merge: true });
};
