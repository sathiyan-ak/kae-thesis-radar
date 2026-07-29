export const RESEARCH_STAGES = [
  { id: 1, name: "identity_resolution", label: "Company Identity" },
  { id: 2, name: "founder_research", label: "Founder Research" },
  { id: 3, name: "product_positioning", label: "Product & Market" },
  { id: 4, name: "regulatory_legal", label: "Regulatory & Legal" },
  { id: 5, name: "clinical_evidence", label: "Clinical Evidence" },
  { id: 6, name: "academic_validation", label: "Academic Validation" },
  { id: 7, name: "technology_stack", label: "Technology Stack" },
  { id: 8, name: "funding_traction", label: "Funding & Traction" },
  { id: 9, name: "competitive_positioning", label: "Competitive Landscape" },
  { id: 10, name: "distribution_channels", label: "Distribution" },
  { id: 11, name: "defensibility", label: "Defensibility & IP" },
  { id: 12, name: "capital_efficiency", label: "Capital Efficiency" },
  { id: 13, name: "risk_factors", label: "Risk Factors" },
  { id: 14, name: "missing_evidence", label: "Missing Evidence" },
  { id: 15, name: "scoring_synthesis", label: "Scoring Synthesis" },
];

export async function storSourceSnapshot(
  supabase: any,
  sourceId: string,
  researchRunId: string,
  content: string,
  provider: string
) {
  const contentHash = Buffer.from(content).toString("base64").substring(0, 32);

  return supabase.from("source_snapshots").insert({
    source_id: sourceId,
    research_run_id: researchRunId,
    content_hash: contentHash,
    extracted_text: content.substring(0, 10000),
    extraction_provider: provider,
    retrieved_at: new Date().toISOString(),
  });
}

export async function extractClaims(
  supabase: any,
  researchRunId: string,
  companyId: string,
  sources: Array<{ snapshot_id: string; text: string }>
) {
  // Placeholder: extract claims from source text
  // In Phase 6, this calls LLM for structured extraction
  const claims = [];

  for (const source of sources) {
    // Simple heuristic: if source mentions funding, extract as claim
    if (
      source.text.toLowerCase().includes("raised") ||
      source.text.toLowerCase().includes("series")
    ) {
      claims.push({
        research_run_id: researchRunId,
        company_id: companyId,
        claim_type: "funding",
        statement: "Company has disclosed funding",
        claim_status: "inferred",
        confidence: 0.6,
      });
    }
  }

  return supabase.from("claims").insert(claims);
}
