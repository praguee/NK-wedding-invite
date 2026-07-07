-- ============================================================================
-- Durable rate limiting + case-insensitive RSVP uniqueness + poll cleanup
-- Run this in the Supabase SQL editor (Dashboard → SQL Editor → New query).
-- Safe to run once. Until it is run, the app falls back to in-memory limiting.
-- ============================================================================

-- 1. Shared counter table for cross-instance rate limiting -------------------
create table if not exists public.rate_limits (
  key          text primary key,
  count        integer     not null default 0,
  window_start timestamptz not null default now()
);

-- Lock the table down: only the service_role (which bypasses RLS) may touch it.
alter table public.rate_limits enable row level security;

-- 2. Atomic "record a hit" function ------------------------------------------
--    Increments the counter for a key, resetting the window when it expires.
--    Returns the new count so the caller can decide whether to block.
create or replace function public.rl_hit(p_key text, p_window_seconds integer)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count integer;
begin
  insert into public.rate_limits as rl (key, count, window_start)
  values (p_key, 1, now())
  on conflict (key) do update
    set count = case
                  when rl.window_start < now() - make_interval(secs => p_window_seconds)
                  then 1
                  else rl.count + 1
                end,
        window_start = case
                  when rl.window_start < now() - make_interval(secs => p_window_seconds)
                  then now()
                  else rl.window_start
                end
  returning rl.count into v_count;
  return v_count;
end;
$$;

-- Do NOT expose the RPC to anonymous callers (they must not be able to inflate
-- the limiter via /rest/v1/rpc/rl_hit). Only the server's service key may call it.
revoke all on function public.rl_hit(text, integer) from public, anon, authenticated;
grant execute on function public.rl_hit(text, integer) to service_role;

-- 3. Case-insensitive uniqueness for RSVP names ------------------------------
--    Prevents "Parag", "parag", and "Parag " from all registering separately.
--    NOTE: this will error if you already have rows that collide once trimmed
--    and lower-cased — dedupe those first, then re-run.
create unique index if not exists rsvps_name_ci_idx
  on public.rsvps (lower(btrim(name)));

-- 4. Remove the retired poll feature -----------------------------------------
--    The poll route returns 404 and the UI is gone; drop the leftover table so
--    the public anon key can no longer read vote tallies.
drop table if exists public.poll_votes;
