"use client";

import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  Timestamp,
  orderBy,
} from "firebase/firestore";
import type { Transaction } from "@/lib/types";

const getTransactionsCollection = (userId: string) => {
  return collection(db, "users", userId, "transactions");
};

export const getTransactions = async (userId: string): Promise<Transaction[]> => {
  const transactionsCol = getTransactionsCollection(userId);
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
  userId: string,
  transaction: Omit<Transaction, "id">
): Promise<Transaction> => {
  const transactionsCol = getTransactionsCollection(userId);
  const docRef = await addDoc(transactionsCol, {
    ...transaction,
    date: Timestamp.fromDate(transaction.date),
  });
  return {
    id: docRef.id,
    ...transaction,
  };
};
