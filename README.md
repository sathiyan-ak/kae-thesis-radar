# Kae Thesis Radar

A deployable investment-research work sample that converts Kae Capital’s public **“What To Build: Healthtech”** article into a repeatable startup-sourcing and first-pass diligence workflow.

> Independent project. Not affiliated with or endorsed by Kae Capital. Kae explicitly describes the article as a thought piece rather than an investment thesis; the product preserves that distinction.

## What it proves

- **Research judgement:** 20 public opportunity areas are converted into structured fields: buyer, business model, founder-market fit, timing, regulation and failure mode.
- **Investment workflow:** startup screens separate positive evidence, bear-case risks, missing facts and diligence questions.
- **Transparent scoring:** six disclosed dimensions and weights; no hidden LLM score.
- **Shipping ability:** Next.js App Router UI, Tavily-powered live research, optional Supabase persistence and print-ready company screens.

## Product surfaces

1. **Overview** — opportunity, pipeline and recommendation scorecard.
2. **Thesis map** — all 20 healthtech ideas with density and regulatory filters.
3. **Startup pipeline** — 12 seeded Indian healthtech screens with source links.
4. **Live screen** — search any company through Tavily and score it against one opportunity.
5. **Company screen** — evidence, bear case, score breakdown and five meeting questions.
6. **Methodology** — weights, guardrails and analyst loop.

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

The app works without keys using the 12 seed records. In **Live screen**, enter a seeded name such as `Qure.ai`, `Niramai`, `Dozee`, `Augnito`, `Eka Care`, `BeatO`, `Healthians`, `Redcliffe Labs`, `Wysa`, `Zyla Health`, `Tata 1mg` or `MedGenome`.

## Enable live Tavily research

Add to `.env.local`:

```env
TAVILY_API_KEY=tvly-your-key
```

The server route sends one advanced Tavily search, retains the returned sources and calculates a deterministic score from visible signals. The API key never reaches the browser.

## Enable Supabase persistence

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the SQL editor.
3. Add:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-publishable-or-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-server-secret
```

The service-role key is used only inside server route handlers. Do not expose it in client code.

## Deploy on Vercel

```bash
npm run build
```

Then import the repository into Vercel and add the environment variables under **Project Settings → Environment Variables**. The project does not require Supabase to deploy; Supabase only adds persistent saved screens.

## Scoring rubric

| Dimension | Weight |
|---|---:|
| Thesis fit | 24% |
| Founder-market fit | 18% |
| Market timing | 16% |
| Distribution | 16% |
| Defensibility | 14% |
| Capital efficiency | 12% |

Decision thresholds:

- **Meet:** 76+
- **Monitor:** 58–75
- **Pass:** below 58

A score is only a research prioritisation device. The investment decision remains human.

## Suggested 90-second demo

1. Open Overview and explain that the public article has been converted into 20 searchable opportunity records.
2. Open Thesis map and show a white-space card, including founder fit and the failure mode.
3. Open Startup pipeline and select a high-scoring company.
4. Show the bear case and five diligence questions—not only the positive case.
5. Return to Live screen, enter a new startup, select the closest opportunity and run Tavily research.
6. End on Methodology to show that the score is transparent and challengeable.

## Data policy

- Seed records are deliberately labelled as work-sample research and should be refreshed.
- The product does not invent revenue, valuation, market size or unit economics.
- Unknown facts are converted into diligence questions.
- Primary company and regulatory sources should replace search summaries before real investment use.
