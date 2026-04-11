import { kv } from "@vercel/kv";
import fs from "fs/promises";
import path from "path";

/**
 * Read a value from Vercel KV. If the key doesn't exist in KV,
 * fall back to the local seed JSON file so the site never goes blank.
 */
export async function kvGet<T>(key: string, seedFile: string): Promise<T> {
  try {
    const data = await kv.get<T>(key);
    if (data !== null && data !== undefined) {
      return data;
    }
  } catch {
    // KV unavailable (local dev, missing env vars) — fall through to seed
  }

  // Fallback: read from local seed file
  const filePath = path.join(process.cwd(), "content", seedFile);
  const raw = await fs.readFile(filePath, "utf-8");
  return JSON.parse(raw) as T;
}

/**
 * Write a value to Vercel KV. Also writes to local JSON as a
 * best-effort fallback for local development.
 */
export async function kvSet<T>(key: string, value: T, seedFile: string): Promise<void> {
  // Always try KV first
  try {
    await kv.set(key, value);
  } catch {
    // KV unavailable — fall through to local write
  }

  // Best-effort local write (works in dev, silently fails on Vercel)
  try {
    const filePath = path.join(process.cwd(), "content", seedFile);
    await fs.writeFile(filePath, JSON.stringify(value, null, 2), "utf-8");
  } catch {
    // Read-only filesystem on Vercel — expected, no action needed
  }
}
