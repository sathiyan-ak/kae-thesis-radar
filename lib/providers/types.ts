export interface SearchResult {
  title: string;
  url: string;
  content: string;
  publishedAt?: Date;
  score?: number;
}

export interface ExtractionResult {
  text: string;
  structured?: Record<string, unknown>;
}

export interface CompanyIdentity {
  domain?: string;
  incorporation_date?: Date;
  legal_name?: string;
  founders?: string[];
  headquarters?: string;
}

export interface ProviderHealthStatus {
  provider: string;
  configured: boolean;
  status: "healthy" | "error" | "unconfigured";
  lastError?: string;
  lastSuccessAt?: Date;
}

export interface SearchProvider {
  id: string;
  search(
    query: string,
    options?: { limit?: number; domain?: string; date_from?: Date }
  ): Promise<SearchResult[]>;
  health(): Promise<ProviderHealthStatus>;
}

export interface ExtractionProvider {
  id: string;
  extract(url: string, html?: string): Promise<ExtractionResult>;
  health(): Promise<ProviderHealthStatus>;
}

export interface CompanyIdentityProvider {
  id: string;
  resolve(name: string, domain?: string): Promise<CompanyIdentity>;
  health(): Promise<ProviderHealthStatus>;
}
