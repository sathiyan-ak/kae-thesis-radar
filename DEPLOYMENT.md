# Deployment Guide

## Kae Thesis Radar - Production Deployment

### Prerequisites

- Vercel account (free tier sufficient for demo)
- Supabase account (free tier: 500 MB DB, 50k realtime messages/month)
- Tavily API account (optional, for live search)
- GitHub repository (for CI/CD)

### Step 1: Supabase Setup

```bash
# Create new Supabase project
# Copy credentials to .env.local
export NEXT_PUBLIC_SUPABASE_URL="https://YOUR_PROJECT.supabase.co"
export NEXT_PUBLIC_SUPABASE_ANON_KEY="YOUR_ANON_KEY"
export SUPABASE_SERVICE_ROLE_KEY="YOUR_SERVICE_ROLE_KEY"

# Apply migrations
npx supabase link --project-ref YOUR_PROJECT_ID
npx supabase db push

# Seed data
psql "postgresql://postgres:[PASSWORD]@YOUR_PROJECT.supabase.co:5432/postgres" < supabase/seed.sql
```

### Step 2: Environment Variables

Create `.env.local` in repo root:

```env
# App
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY

# Providers (optional)
TAVILY_API_KEY=tvly-...
OLLAMA_API_URL=http://localhost:11434
OPENAI_API_KEY=...
```

### Step 3: Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel deploy --prod

# Set environment variables in Vercel dashboard
# Project Settings → Environment Variables → Add all from .env.local
```

### Step 4: Post-Deploy Checklist

- [ ] /login page renders without errors
- [ ] Sign up with email works
- [ ] Redirect to /app after auth
- [ ] /app/dealflow loads 12 seeded companies
- [ ] /app/companies/[id] shows company detail
- [ ] /api/health returns 200
- [ ] /api/health/providers shows Tavily + GitHub status
- [ ] Security headers present (inspect via curl -i)

### Step 5: GitHub Actions CI/CD

Repository includes GitHub Actions workflow (`.github/workflows/ci.yml`).

Runs on push to main:
- Install dependencies
- ESLint
- TypeScript typecheck
- Unit tests (Vitest)
- Production build
- Deploy to Vercel

### Monitoring

**Health Checks**

- `/api/health` — service availability
- `/api/health/providers` — provider configuration

**Logs**

- Vercel: real-time logs in dashboard
- Supabase: log explorer for DB queries, RLS violations
- Sentry (when configured): error tracking

### Scaling Considerations

**Current Limits**

- Supabase free tier: 500 MB, 50k realtime messages/month
- Vercel free tier: 100 GB bandwidth/month

**When to Upgrade**

- >1000 research runs/month → Supabase Pro ($25/month)
- >500k pageviews/month → Vercel Pro ($20/month)
- Tavily: rate limits 120 requests/min on free tier

### Trigger.dev Setup (Optional)

For async research job orchestration:

```bash
# Install Trigger.dev
npm install -g trigger.dev

# Create account and project
trigger.dev auth

# Configure in .env
TRIGGER_API_KEY=...
TRIGGER_API_URL=https://api.trigger.dev
```

Update `lib/research/orchestrator.ts` to enqueue Trigger.dev tasks (currently placeholder).

### Backup & Disaster Recovery

**Database Backups**

```bash
# Supabase auto-backups (7 days free tier)
# Manual backup:
pg_dump postgresql://postgres:[PASSWORD]@YOUR_PROJECT.supabase.co:5432/postgres > backup.sql
```

**Configuration Backup**

```bash
# Save .env.local (DO NOT commit)
# Keep Vercel env vars documented
# Document Supabase RLS policies (in migrations/)
```

### Cost Estimate (Monthly)

| Service | Free | Minimum Paid |
|---------|------|-------------|
| Supabase | $0 | $25 (Pro) |
| Vercel | $0 | $20 (Pro) |
| Tavily | $0 | $5 (100 req/day) |
| **Total** | **$0** | **$50** |

### Support

- Supabase: https://supabase.com/docs
- Vercel: https://vercel.com/docs
- Tavily: https://docs.tavily.com
- This repo: See README.md and CLAUDE.md

---

**Deployment Date**: [Your Date]  
**Last Updated**: 2026-07-29
