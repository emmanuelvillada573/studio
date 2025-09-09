'use server';

import {googleAI} from '@genkit-ai/googleai';
import {genkit, type GenkitOptions} from 'genkit';
import {firebase} from '@genkit-ai/firebase/plugin';

const genkitOptions: GenkitOptions = {
  plugins: [
    firebase(),
    googleAI({
      apiVersion: ['v1beta'],
    }),
  ],
  logSinks: ['firebase'],
  traceStore: 'firebase',
  flowStateStore: 'firebase',
  cacheStore: 'firebase',
};

export const ai = genkit(genkitOptions);
