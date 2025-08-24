// DeepLX TypeScript Implementation
// Utility functions

import { PostData } from './types';

// getICount returns the number of 'i' characters in the text
export function getICount(translateText: string): number {
  return (translateText.match(/i/g) || []).length;
}

// getRandomNumber generates a random number for request ID
export function getRandomNumber(): number {
  const min = 100000;
  const max = 999999;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// getTimeStamp generates timestamp for request based on i count
export function getTimeStamp(iCount: number): number {
  const ts = Date.now();
  if (iCount !== 0) {
    const remainder = iCount + 1;
    return ts - (ts % remainder) + remainder;
  }
  return ts;
}

// formatPostString formats the request JSON string with specific spacing rules
export function formatPostString(postData: PostData): string {
  return JSON.stringify(postData);
}

// handlerBodyMethod manipulates the request body based on random number calculation
export function handlerBodyMethod(random: number, body: string): string {
  const calc = (random + 5) % 29 === 0 || (random + 3) % 13 === 0;
  if (calc) {
    return body.replace('"method":"', '"method" : "');
  }
  return body.replace('"method":"', '"method": "');
}