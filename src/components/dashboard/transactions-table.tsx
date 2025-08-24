import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Transaction } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { CategoryIcon } from "@/components/icons";
import { Badge } from "@/components/ui/badge";

interface TransactionsTableProps {
  transactions: Transaction[];
}

export function TransactionsTable({ transactions }: TransactionsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Category</TableHead>
          <TableHead>Description</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead className="hidden md:table-cell text-right">Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => (
          <TableRow key={transaction.id}>
            <TableCell>
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline">
                  <CategoryIcon category={transaction.category} className="h-5 w-5 text-muted-foreground" />
                </span>
                <span className="font-medium">{transaction.category}</span>
              </div>
            </TableCell>
            <TableCell>
                <div className="font-medium">{transaction.description}</div>
            </TableCell>
            <TableCell className={`text-right font-medium ${transaction.type === 'income' ? 'text-emerald-500' : 'text-destructive'}`}>
              {transaction.type === 'income' ? '+' : '-'}
              {formatCurrency(transaction.amount)}
            </TableCell>
            <TableCell className="hidden md:table-cell text-right text-muted-foreground">
                {transaction.date.toLocaleDateString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric' })}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
