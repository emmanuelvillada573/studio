import {ai} from '@/ai/genkit';
import {nextHandler} from '@genkit-ai/next';

export const {GET, POST} = nextHandler(ai);
