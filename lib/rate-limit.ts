import 'server-only'
import { supabaseAdmin } from './supabase-admin'

/**
 * Durable, cross-instance rate limiting backed by a Supabase `rate_limits`
 * table + `rl_hit` RPC (see supabase/migrations/0001_rate_limit.sql).
 *
 * On serverless (Vercel), each lambda has its own memory, so a purely in-memory
 * limiter can be bypassed by hitting different instances and resets on every
 * cold start. This talks to the shared database instead.
 *
 * If the table/RPC aren't present yet (migration not run) or Supabase is
 * unreachable, every function degrades gracefully to an in-memory limiter —
 * identical to the previous behaviour — so the app never breaks.
 */

type MemRec = { count: number; windowStart: number }
const mem = new Map<string, MemRec>()

function memHit(key: string, windowSeconds: number): number {
  const now = Date.now()
  const rec = mem.get(key)
  if (rec && now - rec.windowStart < windowSeconds * 1000) {
    rec.count++
    return rec.count
  }
  mem.set(key, { count: 1, windowStart: now })
  return 1
}

/** Read the current count within the window without incrementing. */
export async function getLimit(
  key: string,
  windowSeconds: number,
): Promise<{ count: number; resetAtMs: number }> {
  try {
    const { data, error } = await supabaseAdmin
      .from('rate_limits')
      .select('count, window_start')
      .eq('key', key)
      .maybeSingle()
    if (error) throw error
    if (!data) return { count: 0, resetAtMs: 0 }
    const resetAtMs = new Date(data.window_start as string).getTime() + windowSeconds * 1000
    if (Date.now() >= resetAtMs) return { count: 0, resetAtMs: 0 }
    return { count: data.count as number, resetAtMs }
  } catch {
    const rec = mem.get(key)
    if (!rec) return { count: 0, resetAtMs: 0 }
    const resetAtMs = rec.windowStart + windowSeconds * 1000
    if (Date.now() >= resetAtMs) return { count: 0, resetAtMs: 0 }
    return { count: rec.count, resetAtMs }
  }
}

/** Atomically record a hit in the sliding window; returns the new count. */
export async function recordHit(key: string, windowSeconds: number): Promise<number> {
  try {
    const { data, error } = await supabaseAdmin.rpc('rl_hit', {
      p_key: key,
      p_window_seconds: windowSeconds,
    })
    if (error) throw error
    if (typeof data === 'number') return data
    throw new Error('rl_hit: unexpected response')
  } catch {
    return memHit(key, windowSeconds)
  }
}

/** Clear a key (e.g. after a successful admin login). */
export async function resetKey(key: string): Promise<void> {
  try {
    await supabaseAdmin.from('rate_limits').delete().eq('key', key)
  } catch {
    /* ignore — fall through to clearing memory */
  }
  mem.delete(key)
}
