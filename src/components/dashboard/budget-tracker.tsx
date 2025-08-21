"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Budget, Transaction, Category } from "@/lib/types";
import { expenseCategories } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { CategoryIcon } from "@/components/icons";

interface BudgetTrackerProps {
  budgets: Budget[];
  transactions: Transaction[];
  onSetBudget: (category: Category, amount: number) => void;
}

export function BudgetTracker({ budgets, transactions, onSetBudget }: BudgetTrackerProps) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const expensesByCategory = React.useMemo(() => {
    return transactions
      .filter((t) => t.type === "expense")
      .reduce((acc, t) => {
        if (!acc[t.category]) {
          acc[t.category] = 0;
        }
        acc[t.category] += t.amount;
        return acc;
      }, {} as Record<Category, number>);
  }, [transactions]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Goals</CardTitle>
        <CardDescription>Track your spending against your goals.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {budgets.map((budget) => {
            const spent = expensesByCategory[budget.category] || 0;
            const progress = (spent / budget.amount) * 100;
            return (
              <div key={budget.category} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 font-medium">
                     <CategoryIcon category={budget.category} className="h-4 w-4 text-muted-foreground" />
                     <span>{budget.category}</span>
                  </div>
                  <span className="text-muted-foreground">
                    {formatCurrency(spent)} / {formatCurrency(budget.amount)}
                  </span>
                </div>
                <Progress value={progress} />
              </div>
            );
          })}
        </div>
        <SetBudgetDialog onSetBudget={onSetBudget} onOpenChange={setIsDialogOpen} open={isDialogOpen}>
          <Button className="mt-6 w-full">Set Budget</Button>
        </SetBudgetDialog>
      </CardContent>
    </Card>
  );
}

interface SetBudgetDialogProps {
    children: React.ReactNode;
    onSetBudget: (category: Category, amount: number) => void;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

function SetBudgetDialog({ children, onSetBudget, open, onOpenChange }: SetBudgetDialogProps) {
  const [category, setCategory] = React.useState<Category | "">("");
  const [amount, setAmount] = React.useState("");

  const handleSave = () => {
    const numericAmount = parseFloat(amount);
    if (category && !isNaN(numericAmount) && numericAmount > 0) {
      onSetBudget(category as Category, numericAmount);
      setCategory("");
      setAmount("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set or Update Budget</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <Select onValueChange={(value) => setCategory(value as Category)} value={category}>
                <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                    {expenseCategories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Amount
            </Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="col-span-3"
              placeholder="e.g. 500"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
