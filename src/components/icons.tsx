import {
  ShoppingCart,
  Zap,
  Home,
  Car,
  Ticket,
  Utensils,
  ShoppingBag,
  HeartPulse,
  Plane,
  BookOpen,
  Smile,
  Gift,
  MoreHorizontal,
  Landmark,
  Briefcase,
  TrendingUp,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";
import type { Category } from "@/lib/types";

export const categoryIcons: Record<Category, LucideIcon> = {
  // Expenses
  Groceries: ShoppingCart,
  Utilities: Zap,
  Rent: Home,
  Transportation: Car,
  Entertainment: Ticket,
  "Eating Out": Utensils,
  Shopping: ShoppingBag,
  Health: HeartPulse,
  Travel: Plane,
  Education: BookOpen,
  "Personal Care": Smile,
  Gifts: Gift,
  Other: MoreHorizontal,
  // Income
  Salary: Landmark,
  Freelance: Briefcase,
  Investment: TrendingUp,
};

export const CategoryIcon = ({ category, ...props }: { category: Category } & LucideProps) => {
  const Icon = categoryIcons[category] || MoreHorizontal;
  return <Icon {...props} />;
};
