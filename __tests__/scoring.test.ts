import { describe, it, expect } from "vitest";
import { calculateScore, SCORING_RUBRIC } from "@/lib/research/scoring";

describe("Scoring", () => {
  it("calculates total score from weighted dimensions", () => {
    const scores = {
      thesisFit: 80,
      founderMarketFit: 70,
      marketTiming: 60,
      distribution: 75,
      defensibility: 65,
      capitalEfficiency: 85,
    };

    const { total, recommendation } = calculateScore(scores);

    expect(total).toBeGreaterThan(0);
    expect(total).toBeLessThanOrEqual(100);
    expect(["Meet", "Monitor", "Pass"]).toContain(recommendation);
  });

  it("recommends Meet for high scores", () => {
    const scores = {
      thesisFit: 90,
      founderMarketFit: 85,
      marketTiming: 80,
      distribution: 85,
      defensibility: 80,
      capitalEfficiency: 90,
    };

    const { recommendation } = calculateScore(scores);
    expect(recommendation).toBe("Meet");
  });

  it("recommends Pass for low scores", () => {
    const scores = {
      thesisFit: 20,
      founderMarketFit: 30,
      marketTiming: 25,
      distribution: 20,
      defensibility: 15,
      capitalEfficiency: 25,
    };

    const { recommendation } = calculateScore(scores);
    expect(recommendation).toBe("Pass");
  });

  it("weights dimensions correctly", () => {
    const weights = Object.values(SCORING_RUBRIC).map((r) => r.weight);
    const sum = weights.reduce((a, b) => a + b, 0);
    expect(Math.abs(sum - 1.0)).toBeLessThan(0.01);
  });
});
