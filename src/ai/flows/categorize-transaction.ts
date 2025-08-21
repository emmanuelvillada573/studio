'use server';

/**
 * @fileOverview AI-powered transaction categorization.
 *
 * - categorizeTransaction - Suggests expense categories based on the transaction description using AI.
 * - CategorizeTransactionInput - The input type for the categorizeTransaction function.
 * - CategorizeTransactionOutput - The return type for the categorizeTransaction function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CategorizeTransactionInputSchema = z.object({
  transactionDescription: z
    .string()
    .describe('The description of the transaction to categorize.'),
});
export type CategorizeTransactionInput = z.infer<typeof CategorizeTransactionInputSchema>;

const CategorizeTransactionOutputSchema = z.object({
  category: z
    .string()
    .describe('The predicted category for the transaction, chosen from: Groceries, Utilities, Rent, Transportation, Entertainment, Eating Out, Shopping, Health, Travel, Education, Personal Care, Gifts, Other.'),
  confidence: z
    .number()
    .describe('A number between 0 and 1 indicating the confidence level of the category prediction.'),
});
export type CategorizeTransactionOutput = z.infer<typeof CategorizeTransactionOutputSchema>;

export async function categorizeTransaction(input: CategorizeTransactionInput): Promise<CategorizeTransactionOutput> {
  return categorizeTransactionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'categorizeTransactionPrompt',
  input: {schema: CategorizeTransactionInputSchema},
  output: {schema: CategorizeTransactionOutputSchema},
  prompt: `Given the following transaction description, predict the most likely expense category.

Transaction Description: {{{transactionDescription}}}

Categories: Groceries, Utilities, Rent, Transportation, Entertainment, Eating Out, Shopping, Health, Travel, Education, Personal Care, Gifts, Other.

Return the category and your confidence level in the prediction.`,
});

const categorizeTransactionFlow = ai.defineFlow(
  {
    name: 'categorizeTransactionFlow',
    inputSchema: CategorizeTransactionInputSchema,
    outputSchema: CategorizeTransactionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
