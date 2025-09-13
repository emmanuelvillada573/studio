// app/api/genkit/route.ts
export const dynamic = 'force-dynamic';

import { categorizeTransactionFlow } from '@/ai/flows/categorize-transaction';
import nextHandler from '@genkit-ai/next';

const handler = nextHandler(categorizeTransactionFlow) as unknown as {
  GET: (req: Request) => Promise<Response>;
  POST: (req: Request) => Promise<Response>;
};

export const GET = handler.GET;
export const POST = handler.POST;
