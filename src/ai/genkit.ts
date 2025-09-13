
import {googleAI} from '@genkit-ai/googleai';
import {genkit, type GenkitOptions} from 'genkit';

const genkitOptions: GenkitOptions = {
  plugins: [
    googleAI({
      apiVersion: ['v1beta'],
    }),
  ],

};

export const ai = genkit(genkitOptions);
