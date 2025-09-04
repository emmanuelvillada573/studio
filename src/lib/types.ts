export type Transaction = {
  id: string;
  date: Date;
  description: string;
  amount: number;
  type: "income" | "expense";
  category: Category;
};

export type Category =
  | "Groceries"
  | "Utilities"
  | "Rent"
  | "Transportation"
  | "Entertainment"
  | "Eating Out"
  | "Shopping"
  | "Health"
  | "Travel"
  | "Education"
  | "Personal Care"
  | "Gifts"
  | "Other"
  | "Salary"
  | "Freelance"
  | "Investment";

export const expenseCategories: Category[] = [
  "Groceries",
  "Utilities",
  "Rent",
  "Transportation",
  "Entertainment",
  "Eating Out",
  "Shopping",
  "Health",
  "Travel",
  "Education",
  "Personal Care",
  "Gifts",
  "Other",
];

export const incomeCategories: Category[] = [
  "Salary",
  "Freelance",
  "Investment",
  "Gifts",
  "Other",
];

export type Budget = {
  category: Category;
  amount: number;
};

export type Household = {
  id: string;
  name: string;
  members: string[]; // array of user UIDs
  owner: string; // UID of the owner
};

export type Invite = {
  id: string;
  householdId: string;
  invitedBy: string; // user email
  status: 'pending' | 'accepted' | 'declined';
};
