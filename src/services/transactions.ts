"use client";

import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  Timestamp,
  orderBy,
} from "firebase/firestore";
import type { Transaction } from "@/lib/types";

// Transactions are now subcollections of a household
const getTransactionsCollection = (householdId: string) => {
  return collection(db, "households", householdId, "transactions");
};

export const getTransactions = async (householdId: string): Promise<Transaction[]> => {
  const transactionsCol = getTransactionsCollection(householdId);
  const q = query(transactionsCol, orderBy("date", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      description: data.description,
      amount: data.amount,
      type: data.type,
      category: data.category,
      date: (data.date as Timestamp).toDate(),
    };
  }) as Transaction[];
};

export const addTransaction = async (
  householdId: string,
  transaction: Omit<Transaction, "id">
): Promise<Transaction> => {
  const transactionsCol = getTransactionsCollection(householdId);
  const docRef = await addDoc(transactionsCol, {
    ...transaction,
    date: Timestamp.fromDate(transaction.date),
  });
  return {
    id: docRef.id,
    ...transaction,
  };
};
