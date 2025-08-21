import type { Transaction, Budget } from "./types";

export const initialTransactions: Transaction[] = [
  {
    id: "1",
    date: new Date("2024-07-15"),
    description: "Monthly Salary",
    amount: 5000,
    type: "income",
    category: "Salary",
  },
  {
    id: "2",
    date: new Date("2024-07-20"),
    description: "Grocery shopping at Walmart",
    amount: 150.75,
    type: "expense",
    category: "Groceries",
  },
  {
    id: "3",
    date: new Date("2024-07-18"),
    description: "Electricity Bill",
    amount: 75.2,
    type: "expense",
    category: "Utilities",
  },
  {
    id: "4",
    date: new Date("2024-07-01"),
    description: "Rent for July",
    amount: 1200,
    type: "expense",
    category: "Rent",
  },
  {
    id: "5",
    date: new Date("2024-07-22"),
    description: "Dinner with friends",
    amount: 65.5,
    type: "expense",
    category: "Eating Out",
  },
  {
    id: "6",
    date: new Date("2024-07-10"),
    description: "Gas for car",
    amount: 45.0,
    type: "expense",
    category: "Transportation",
  },
  {
    id: "7",
    date: new Date("2024-06-25"),
    description: "Freelance Project",
    amount: 750,
    type: "income",
    category: "Freelance",
  },
  {
    id: "8",
    date: new Date("2024-06-28"),
    description: "New shoes from Nike",
    amount: 120.0,
    type: "expense",
    category: "Shopping",
  },
];

export const initialBudgets: Budget[] = [
  { category: "Groceries", amount: 400 },
  { category: "Eating Out", amount: 150 },
  { category: "Shopping", amount: 200 },
  { category: "Transportation", amount: 100 },
  { category: "Entertainment", amount: 100 },
];
