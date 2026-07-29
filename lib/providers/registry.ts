import { TavilyProvider } from "@/lib/providers/tavily";
import { GitHubProvider } from "@/lib/providers/github";
import type {
  SearchProvider,
  ExtractionProvider,
  CompanyIdentityProvider,
  ProviderHealthStatus,
} from "@/lib/providers/types";

export class ProviderRegistry {
  private searchProviders: Map<string, SearchProvider> = new Map();
  private extractionProviders: Map<string, ExtractionProvider> = new Map();
  private identityProviders: Map<string, CompanyIdentityProvider> = new Map();

  constructor() {
    // Register built-in providers
    const tavily = new TavilyProvider();
    this.searchProviders.set(tavily.id, tavily);

    const github = new GitHubProvider();
    this.identityProviders.set(github.id, github);

    // TODO: Add more providers:
    // - OpenCorporates (company identity)
    // - GLEIF (legal entity data)
    // - ClinicalTrials.gov (clinical evidence)
    // - NCBI/PubMed (medical research)
    // - Crossref (academic citations)
    // - openFDA (regulatory data)
    // - Product Hunt (launch evidence)
    // - BuiltWith (tech stack)
    // - Firecrawl (extraction fallback)
  }

  getSearchProvider(id: string): SearchProvider | undefined {
    return this.searchProviders.get(id);
  }

  getExtractionProvider(id: string): ExtractionProvider | undefined {
    return this.extractionProviders.get(id);
  }

  getIdentityProvider(id: string): CompanyIdentityProvider | undefined {
    return this.identityProviders.get(id);
  }

  getSearchProviders(): SearchProvider[] {
    return Array.from(this.searchProviders.values());
  }

  getExtractionProviders(): ExtractionProvider[] {
    return Array.from(this.extractionProviders.values());
  }

  getIdentityProviders(): CompanyIdentityProvider[] {
    return Array.from(this.identityProviders.values());
  }

  async getHealth(): Promise<ProviderHealthStatus[]> {
    const health: ProviderHealthStatus[] = [];

    for (const provider of this.getSearchProviders()) {
      health.push(await provider.health());
    }

    for (const provider of this.getExtractionProviders()) {
      health.push(await provider.health());
    }

    for (const provider of this.getIdentityProviders()) {
      health.push(await provider.health());
    }

    return health;
  }
}

export const registry = new ProviderRegistry();
