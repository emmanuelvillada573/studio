"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import type { Transaction, Category } from "@/lib/types";
import { expenseCategories, incomeCategories } from "@/lib/types";
import { categorizeTransaction } from "@/ai/flows/categorize-transaction";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles } from "lucide-react";

const formSchema = z.object({
  description: z.string().min(2, { message: "Description must be at least 2 characters." }),
  amount: z.coerce.number().positive({ message: "Amount must be a positive number." }),
  type: z.enum(["expense", "income"]),
  category: z.string().min(1, { message: "Please select a category." }),
});

type FormValues = z.infer<typeof formSchema>;

interface TransactionFormProps {
  onAddTransaction: (data: Omit<Transaction, "id" | "date">) => void;
}

export function TransactionForm({ onAddTransaction }: TransactionFormProps) {
  const [isCategorizing, setIsCategorizing] = React.useState(false);
  const { toast } = useToast();
  const debounceTimeout = React.useRef<NodeJS.Timeout | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      amount: 0,
      type: "expense",
      category: "",
    },
  });

  const transactionType = form.watch("type");
  const description = form.watch("description");

  React.useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    if (description.length > 3 && transactionType === 'expense') {
      debounceTimeout.current = setTimeout(async () => {
        setIsCategorizing(true);
        try {
          const result = await categorizeTransaction({ transactionDescription: description });
          if (result && result.category) {
            const validCategory = expenseCategories.find(c => c.toLowerCase() === result.category.toLowerCase());
            if(validCategory) {
              form.setValue("category", validCategory, { shouldValidate: true });
            }
          }
        } catch (error) {
          console.error("AI categorization failed:", error);
          toast({
            variant: "destructive",
            title: "AI Suggestion Failed",
            description: "Could not get an AI category suggestion.",
          });
        } finally {
          setIsCategorizing(false);
        }
      }, 1000);
    }
  }, [description, transactionType, form, toast]);


  function onSubmit(values: FormValues) {
    onAddTransaction({
      ...values,
      category: values.category as Category,
    });
    form.reset();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Transaction</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Coffee with friends" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value) => {
                        field.onChange(value);
                        form.setValue("category", "");
                      }}
                      defaultValue={field.value}
                      className="flex space-x-4"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="expense" />
                        </FormControl>
                        <FormLabel className="font-normal">Expense</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="income" />
                        </FormControl>
                        <FormLabel className="font-normal">Income</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    Category
                    {isCategorizing ? (
                       <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    ) : (
                      <Sparkles className="h-4 w-4 text-primary/70" />
                    )}
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {(transactionType === "expense" ? expenseCategories : incomeCategories).map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">Add Transaction</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
