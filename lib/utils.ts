import { clsx, type ClassValue } from "clsx"
import { toFile } from "openai";
import { twMerge } from "tailwind-merge"
import { v4 as uuidv4 } from 'uuid';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const fetcher = async (url: string) => {
  const response = await fetch(url);

  if (!response.ok) {
    const { code, cause } = await response.json();
    throw new Error(code, { cause });
  }

  return response.json();
};

export const generateUUID = (): string => uuidv4();

export function getLocalStorage(key: string): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(key);
  }
  return null;
}

export function generateUserID() {
  return generateUUID();
}


/**
 * Fetches an image from a URL and converts it to a file for OpenAI.
 * @param imageUrl - The URL of the image to fetch.
 * @returns A file object that can be used as an image input for OpenAI.
 */
export async function fetchImageToFile(imageUrl: string) {
  const res = await fetch(imageUrl);
  if (!res.ok) throw new Error("Failed to fetch image from URL");
  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return await toFile(buffer, "input.png", { type: "image/png" });
}
