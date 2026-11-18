export type ResearchUnitType = "openalex_topics" | "keyphrases" | "clusters";

export type ResearchSignal = {
  id: string;
  type: ResearchUnitType;
  label: string;
  lifecycle: "New" | "Peaking" | "Saturated";
  score: number;
  papers90d: number;
  fit: number;
  gap: number;
};

export const researchSnapshot = {
  asOf: "18 Nov 2026",
  totalPapers: 311_181,
  inScopePapers: 154_543,
  eligibleUnits: 3_189,
  baselineLimited: 2_468,
  missingAbstracts: 127_755,
  missingDates: 53,
  dateProxies: 25_153,
};

export const unitTypeLabels: Record<ResearchUnitType, string> = {
  openalex_topics: "Research topics",
  keyphrases: "Keyphrases",
  clusters: "Paper clusters",
};

export const researchSignals: ResearchSignal[] = [
  { id: "ot:T14281", type: "openalex_topics", label: "Islamic Finance and Communication", lifecycle: "New", score: 1.694, papers90d: 22, fit: 0.49, gap: 0.207 },
  { id: "ot:T12303", type: "openalex_topics", label: "Tensor decomposition and applications", lifecycle: "New", score: 1.448, papers90d: 8, fit: 0.375, gap: 0.278 },
  { id: "ot:T12404", type: "openalex_topics", label: "Mathematical Approximation and Integration", lifecycle: "New", score: 1.389, papers90d: 12, fit: 0.387, gap: 0.217 },
  { id: "ot:T10906", type: "openalex_topics", label: "AI-based Problem Solving and Planning", lifecycle: "New", score: 1.302, papers90d: 19, fit: 0.321, gap: 0.202 },
  { id: "ot:T11206", type: "openalex_topics", label: "Model Reduction and Neural Networks", lifecycle: "New", score: 0.993, papers90d: 26, fit: 0.38, gap: 0.113 },
  { id: "ot:T11596", type: "openalex_topics", label: "Constraint Satisfaction and Optimization", lifecycle: "Peaking", score: 0.958, papers90d: 77, fit: 0.341, gap: 0.093 },
  { id: "ot:T12056", type: "openalex_topics", label: "Markov Chains and Monte Carlo Methods", lifecycle: "New", score: 0.899, papers90d: 23, fit: 0.335, gap: 0.142 },
  { id: "ot:T11182", type: "openalex_topics", label: "Auction Theory and Applications", lifecycle: "Peaking", score: 0.891, papers90d: 412, fit: 0.388, gap: 0.016 },
  { id: "kp:rough heston", type: "keyphrases", label: "rough heston", lifecycle: "New", score: 1.613, papers90d: 8, fit: 0.243, gap: 0.105 },
  { id: "kp:firms in nigeria", type: "keyphrases", label: "firms in nigeria", lifecycle: "New", score: 1.395, papers90d: 18, fit: 0.338, gap: 0.059 },
  { id: "kp:sources consulted", type: "keyphrases", label: "sources consulted", lifecycle: "New", score: 1.356, papers90d: 9, fit: 0.307, gap: 0.14 },
  { id: "kp:financial", type: "keyphrases", label: "financial", lifecycle: "Peaking", score: 1.226, papers90d: 368, fit: 0.445, gap: 0.0001 },
  { id: "kp:mechanism design", type: "keyphrases", label: "mechanism design", lifecycle: "New", score: 1.207, papers90d: 21, fit: 0.504, gap: 0.02 },
  { id: "kp:trade", type: "keyphrases", label: "trade", lifecycle: "Peaking", score: 1.154, papers90d: 118, fit: 0.7, gap: 0.0006 },
  { id: "kp:capital markets", type: "keyphrases", label: "capital markets", lifecycle: "New", score: 1.146, papers90d: 20, fit: 0.445, gap: 0.009 },
  { id: "kp:equity markets", type: "keyphrases", label: "equity markets", lifecycle: "New", score: 1.144, papers90d: 28, fit: 0.467, gap: 0.01 },
  { id: "cl:c_20261114_201", type: "clusters", label: "Strategyproof facility location", lifecycle: "New", score: 1.236, papers90d: 13, fit: 0.289, gap: 0.4 },
  { id: "cl:c_20261114_121", type: "clusters", label: "Nigeria government expenditure", lifecycle: "New", score: 1.108, papers90d: 21, fit: 0.284, gap: 0.362 },
  { id: "cl:c_20261114_107", type: "clusters", label: "Bilateral trade and gains from trade", lifecycle: "New", score: 1.092, papers90d: 27, fit: 0.295, gap: 0.286 },
  { id: "cl:c_20261114_178", type: "clusters", label: "Audit committees and board size", lifecycle: "New", score: 1.08, papers90d: 47, fit: 0.326, gap: 0.247 },
  { id: "cl:c_20261114_45", type: "clusters", label: "Stable matching", lifecycle: "Peaking", score: 0.966, papers90d: 46, fit: 0.335, gap: 0.152 },
  { id: "cl:c_20261115_82", type: "clusters", label: "Remanufacturing and e-waste", lifecycle: "New", score: 0.93, papers90d: 20, fit: 0.269, gap: 0.318 },
  { id: "cl:c_20261114_230", type: "clusters", label: "Inventory execution and RFQs", lifecycle: "Peaking", score: 0.854, papers90d: 63, fit: 0.273, gap: 0.162 },
  { id: "cl:c_20261114_277", type: "clusters", label: "API subscriptions and providers", lifecycle: "Peaking", score: 0.83, papers90d: 40, fit: 0.265, gap: 0.23 },
];

export const sourceCoverage = [
  { source: "SSRN · Crossref", papers: 240_023, inScope: 101_373, status: "Passing", items: 939 },
  { source: "OpenAlex", papers: 70_324, inScope: 52_748, status: "Passing", items: 623 },
  { source: "arXiv", papers: 645, inScope: 378, status: "Passing", items: 106 },
  { source: "RSS feeds", papers: 189, inScope: 44, status: "Passing", items: 60 },
  { source: "Semantic Scholar", papers: 0, inScope: 0, status: "Not running", items: 0 },
] as const;
