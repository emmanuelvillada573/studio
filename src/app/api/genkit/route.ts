import {genkit} from '@/ai/genkit';
import {nextJSHandler} from '@genkit-ai/next';

export const {GET, POST} = nextJSHandler(genkit());
