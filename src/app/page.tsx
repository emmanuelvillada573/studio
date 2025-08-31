"use client";

import * as React from "react";
import { Header } from "@/components/dashboard/header";
import { SummaryCard } from "@/components/dashboard/summary-card";
import { TransactionForm } from "@/components/dashboard/transaction-form";
import { TransactionsTable } from "@/components/dashboard/transactions-table";
import { BudgetTracker } from "@/components/dashboard/budget-tracker";
import { Charts } from "@/components/dashboard/charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { exportToCsv } from "@/lib/utils";
import type { Transaction, Budget, Category } from "@/lib/types";
import { ArrowDown, ArrowUp, Wallet, ArrowRightLeft } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { getTransactions, addTransaction } from "@/services/transactions";
import { getBudgets, setBudget } from "@/services/budgets";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [budgets, setBudgets] = React.useState<Budget[]>([]);
  const [dataLoading, setDataLoading] = React.useState(true);

  React.useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if(user) {
      const fetch_data = async () => {
        setDataLoading(true);
        const [transactionsData, budgetsData] = await Promise.all([
          getTransactions(user.uid),
          getBudgets(user.uid)
        ]);
        setTransactions(transactionsData);
        setBudgets(budgetsData);
        setDataLoading(false);
      };
      fetch_data();
    }
  }, [user, loading, router]);


  if (loading || dataLoading || !user) {
    return <div>Loading...</div>;
  }

  const handleAddTransaction = async (transaction: Omit<Transaction, "id" | "date">) => {
    const newTransaction = {
      ...transaction,
      date: new Date(),
    };
    const addedTransaction = await addTransaction(user.uid, newTransaction);
    setTransactions((prev) => [addedTransaction, ...prev]);
  };

  const handleSetBudget = async (category: Category, amount: number) => {
    await setBudget(user.uid, { category, amount });
    setBudgets((prev) => {
      const existingBudget = prev.find((b) => b.category === category);
      if (existingBudget) {
        return prev.map((b) =>
          b.category === category ? { ...b, amount } : b
        );
      }
      return [...prev, { category, amount }];
    });
  };

  const handleExport = () => {
    const dataToExport = transactions.map(t => ({
      date: t.date.toISOString().split('T')[0],
      description: t.description,
      amount: t.amount,
      type: t.type,
      category: t.category,
    }));
    exportToCsv("transactions.csv", dataToExport);
  };

  const summary = React.useMemo(() => {
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((acc, t) => acc + t.amount, 0);
    const expenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((acc, t) => acc + t.amount, 0);
    const savings = income - expenses;
    return { income, expenses, savings, total: transactions.length };
  }, [transactions]);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Header onExport={handleExport} />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <SummaryCard
            title="Total Income"
            value={summary.income}
            icon={ArrowUp}
            isCurrency
          />
          <SummaryCard
            title="Total Expenses"
            value={summary.expenses}
            icon={ArrowDown}
            isCurrency
          />
          <SummaryCard
            title="Savings"
            value={summary.savings}
            icon={Wallet}
            isCurrency
          />
           <SummaryCard
            title="Transactions"
            value={summary.total}
            icon={ArrowRightLeft}
          />
        </div>
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          <Card className="xl:col-span-2">
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <TransactionsTable transactions={transactions.slice(0, 10)} />
            </CardContent>
          </Card>
          <div className="flex flex-col gap-4">
            <TransactionForm onAddTransaction={handleAddTransaction} />
            <BudgetTracker
              budgets={budgets}
              transactions={transactions}
              onSetBudget={handleSetBudget}
            />
          </div>
        </div>
        <Charts transactions={transactions} />
      </main>
    </div>
  );
}
