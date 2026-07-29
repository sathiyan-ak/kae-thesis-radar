export const SCORING_RUBRIC = {
  thesisFit: { weight: 0.24, label: "Thesis Fit" },
  founderMarketFit: { weight: 0.18, label: "Founder-Market Fit" },
  marketTiming: { weight: 0.16, label: "Market Timing" },
  distribution: { weight: 0.16, label: "Distribution" },
  defensibility: { weight: 0.14, label: "Defensibility" },
  capitalEfficiency: { weight: 0.12, label: "Capital Efficiency" },
};

export function calculateScore(
  scores: Record<string, number>
): { total: number; recommendation: string } {
  let total = 0;
  let count = 0;

  for (const [dimension, weight] of Object.entries(SCORING_RUBRIC)) {
    const score = scores[dimension] || 0;
    total += score * weight.weight;
    count++;
  }

  const avg = count > 0 ? total / 1.0 : 0;

  let recommendation = "Pass";
  if (avg >= 75) {
    recommendation = "Meet";
  } else if (avg >= 50) {
    recommendation = "Monitor";
  } else {
    recommendation = "Pass";
  }

  return { total: Math.round(avg * 100) / 100, recommendation };
}

export function calculateScoreWithMissingData(
  claims: any[],
  dimensions: string[]
): Record<string, number> {
  const scores: Record<string, number> = {};

  for (const dim of dimensions) {
    const dimensionClaims = claims.filter((c) => c.claim_type === dim);
    const verifiedCount = dimensionClaims.filter(
      (c) => c.claim_status === "verified"
    ).length;
    const totalCount = dimensionClaims.length;

    // Simple heuristic: score based on claim verification ratio
    scores[dim] = totalCount > 0 ? (verifiedCount / totalCount) * 100 : 30; // 30% penalty for missing data
  }

  return scores;
}
