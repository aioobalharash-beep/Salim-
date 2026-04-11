import { kv } from "@vercel/kv";

// Static imports ensure Next.js file tracer bundles seed data
// into serverless functions. Dynamic fs.readFile paths are invisible
// to the tracer and get excluded from the Vercel deployment.
import heroSeed from "../../content/hero.json";
import articlesSeed from "../../content/articles.json";
import aboutSeed from "../../content/about.json";
import leadsSeed from "../../content/leads.json";

const seeds: Record<string, unknown> = {
  hero: heroSeed,
  articles: articlesSeed,
  about: aboutSeed,
  leads: leadsSeed,
};

/**
 * Read a value from Vercel KV. If the key doesn't exist in KV
 * or KV is unavailable, fall back to the bundled seed data
 * so the site never goes blank.
 */
export async function kvGet<T>(key: string): Promise<T> {
  try {
    const data = await kv.get<T>(key);
    if (data !== null && data !== undefined) {
      return data;
    }
  } catch {
    // KV unavailable (local dev, missing env vars, parse error)
  }

  // Fallback: return bundled seed data
  const seed = seeds[key];
  if (seed !== undefined) {
    return seed as T;
  }

  // Final fallback: return empty array (for unknown keys like leads)
  return [] as unknown as T;
}

/**
 * Write a value to Vercel KV.
 */
export async function kvSet<T>(key: string, value: T): Promise<void> {
  try {
    await kv.set(key, value);
  } catch {
    // KV unavailable — silent fail (local dev without KV)
  }
}
