create extension if not exists pgcrypto;

create table if not exists public.screened_companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  website text,
  thesis_id text not null,
  recommendation text not null check (recommendation in ('Meet', 'Monitor', 'Pass')),
  total_score integer not null check (total_score between 0 and 100),
  score_breakdown jsonb not null default '{}'::jsonb,
  evidence jsonb not null default '[]'::jsonb,
  risks jsonb not null default '[]'::jsonb,
  diligence_questions jsonb not null default '[]'::jsonb,
  analyst_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(name, thesis_id)
);

alter table public.screened_companies enable row level security;

-- The MVP writes only through a server-side service-role client.
-- Add authenticated-user policies before exposing direct browser writes.
