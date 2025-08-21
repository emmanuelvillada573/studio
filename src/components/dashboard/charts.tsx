"use client"

import * as React from "react"
import { Bar, BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer, Donut, Pie, PieChart } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import type { Transaction } from "@/lib/types"
import { ChartContainer, ChartTooltipContent, ChartConfig } from "@/components/ui/chart"
import { formatCurrency } from "@/lib/utils"

interface ChartsProps {
  transactions: Transaction[]
}

const barChartConfig = {
  income: { label: "Income", color: "hsl(var(--chart-1))" },
  expenses: { label: "Expenses", color: "hsl(var(--chart-2))" },
} satisfies ChartConfig

const pieChartConfig = {
  Groceries: { label: "Groceries", color: "hsl(var(--chart-1))" },
  Utilities: { label: "Utilities", color: "hsl(var(--chart-2))" },
  Rent: { label: "Rent", color: "hsl(var(--chart-3))" },
  Transportation: { label: "Transportation", color: "hsl(var(--chart-4))" },
  Entertainment: { label: "Entertainment", color: "hsl(var(--chart-5))" },
  'Eating Out': { label: "Eating Out", color: "hsl(var(--chart-1))" },
  Shopping: { label: "Shopping", color: "hsl(var(--chart-2))" },
  Health: { label: "Health", color: "hsl(var(--chart-3))" },
  Travel: { label: "Travel", color: "hsl(var(--chart-4))" },
  Other: { label: "Other", color: "hsl(var(--chart-5))" },
} satisfies ChartConfig

export function Charts({ transactions }: ChartsProps) {
  const barChartData = React.useMemo(() => {
    const dataByMonth: { [key: string]: { month: string; income: number; expenses: number } } = {}
    transactions.forEach(t => {
      const month = t.date.toLocaleString('default', { month: 'short' });
      if (!dataByMonth[month]) {
        dataByMonth[month] = { month, income: 0, expenses: 0 };
      }
      if (t.type === 'income') {
        dataByMonth[month].income += t.amount;
      } else {
        dataByMonth[month].expenses += t.amount;
      }
    });
    return Object.values(dataByMonth).reverse();
  }, [transactions]);

  const pieChartData = React.useMemo(() => {
    const expenseData: { [key: string]: number } = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
      if (!expenseData[t.category]) {
        expenseData[t.category] = 0;
      }
      expenseData[t.category] += t.amount;
    });
    return Object.entries(expenseData).map(([category, value]) => ({
      name: category,
      value,
      fill: pieChartConfig[category as keyof typeof pieChartConfig]?.color || 'hsl(var(--muted))'
    }));
  }, [transactions]);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Income vs Expenses</CardTitle>
          <CardDescription>A monthly overview of your cash flow.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={barChartConfig} className="h-[300px] w-full">
            <BarChart data={barChartData} accessibilityLayer>
              <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis tickFormatter={(value) => formatCurrency(value as number).slice(0, -3)} />
              <Tooltip cursor={false} content={<ChartTooltipContent formatter={(value) => formatCurrency(value as number)} />} />
              <Bar dataKey="income" fill="var(--color-income)" radius={4} />
              <Bar dataKey="expenses" fill="var(--color-expenses)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Expense Breakdown</CardTitle>
          <CardDescription>How you're spending your money.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
            <ChartContainer config={pieChartConfig} className="h-[300px] w-full">
                <PieChart>
                <Tooltip cursor={false} content={<ChartTooltipContent hideLabel formatter={(value) => formatCurrency(value as number)} />} />
                <Pie data={pieChartData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} strokeWidth={2}>
                </Pie>
                </PieChart>
            </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
