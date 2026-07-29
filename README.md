# Kae Thesis Radar

Private investment-research operating system for venture analysts.

## Overview

Kae Thesis Radar is a SaaS work sample that allows analysts to:

1. Browse Kae's 20 healthtech opportunity areas
2. Add or discover companies
3. Launch repeatable research runs across 15 research stages
4. Review claim-level evidence with source attribution
5. Produce deterministic, versioned investment scores
6. Override scores with audit trails
7. Export company screens

## Quick Start

```bash
npm install
cp .env.example .env.local
# Add Supabase credentials to .env.local
npx supabase db push  # Apply migrations
npx supabase db seed  # Load 20 opportunities + 12 demo companies
npm run dev
```

Visit http://localhost:3000/login and sign up.

## Architecture

**Tech Stack**
- Next.js 15.5+ (App Router, React Server Components)
- Supabase (Postgres, RLS, Auth, Realtime)
- Tavily (search), GitHub (founder research)
- Trigger.dev (async research orchestration — optional)

**Database** (12 tables with RLS)
- workspaces, profiles, thesis_opportunities, companies
- research_runs, provider_runs, sources, source_snapshots
- claims, scorecards, analyst_notes, diligence_questions
- audit_events

**Routes**
- `/login` → email/OAuth
- `/app` → dashboard
- `/app/dealflow` → company pipeline
- `/app/companies/[id]` → detail + research history
- `/app/research/[runId]` → progress with provider stages
- `/app/methodology` → documentation

**Research Pipeline**
1. Analyst enqueues research run (POST /api/research/enqueue)
2. Frontend polls progress (GET /api/research/[runId]/progress)
3. Stages execute: Tavily search → claim extraction → scoring
4. Analyst reviews run, overrides score (with audit log), exports screen

**Scoring Rubric** (6 weighted dimensions)
- Thesis Fit (24%), Founder-Market Fit (18%), Market Timing (16%)
- Distribution (16%), Defensibility (14%), Capital Efficiency (12%)
- Recommendation: Meet (≥75), Monitor (50–74), Pass (<50)

**Source Tiers**
- Tier 1: official pages, registries, peer-reviewed papers (required for material claims)
- Tier 2: publications, investor announcements
- Tier 3: databases, sector directories
- Tier 4: search snippets, social posts

## Environment Variables

```
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://...supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

TAVILY_API_KEY=tvly-...
OLLAMA_API_URL=http://localhost:11434 (optional)
```

## Development

```bash
npm run dev       # localhost:3000
npm run build     # production build
npm run lint      # ESLint
npm run test      # Vitest unit tests
```

## Deployment

Push to GitHub → Actions runs lint/test/build → Vercel deploys.

```bash
git push origin main
vercel deploy --prod
# Set env vars in Vercel dashboard
# Push migrations: supabase db push --remote
```

## Limitations

- No payment paths (internal tool only)
- Optional providers degrade gracefully if unconfigured
- Trigger.dev integration requires account setup
- No multi-workspace team collaboration (single analyst per workspace)

## Demo Data

20 Kae healthtech opportunities + 12 companies (seeded on init):
Qure.ai, Niramai, Dozee, Augnito, Eka Care, BeatO, Wysa, MedGenome, Arpit Health, Fortis Hospital, Pristyn Care, MedTech Innovations.

---

**Disclaimer**: Independent research work sample. Not affiliated with Kae Capital. Not an investment recommendation.
