import type { Recommendation, ScoreBreakdown } from "./types";

export const SCORE_WEIGHTS: Record<keyof ScoreBreakdown, number> = {
  thesisFit: 0.24,
  founderMarketFit: 0.18,
  marketTiming: 0.16,
  distribution: 0.16,
  defensibility: 0.14,
  capitalEfficiency: 0.12,
};

export function calculateTotalScore(scores: ScoreBreakdown): number {
  return Math.round(
    Object.entries(SCORE_WEIGHTS).reduce((total, [key, weight]) => {
      return total + scores[key as keyof ScoreBreakdown] * weight;
    }, 0),
  );
}

export function recommendationFromScore(score: number, riskCount = 0): Recommendation {
  if (score >= 76 && riskCount <= 3) return "Meet";
  if (score >= 58) return "Monitor";
  return "Pass";
}

export function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}
