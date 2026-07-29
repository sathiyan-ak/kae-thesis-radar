import {
  SearchProvider,
  SearchResult,
  ProviderHealthStatus,
} from "@/lib/providers/types";

const TAVILY_API = "https://api.tavily.com";

export class TavilyProvider implements SearchProvider {
  id = "tavily";
  private apiKey = process.env.TAVILY_API_KEY;

  async search(
    query: string,
    options?: { limit?: number; domain?: string; date_from?: Date }
  ): Promise<SearchResult[]> {
    if (!this.apiKey) {
      throw new Error("Tavily API key not configured");
    }

    const response = await fetch(`${TAVILY_API}/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        query,
        search_depth: "advanced",
        topic: "general",
        include_answer: false,
        include_raw_content: true,
        max_results: options?.limit || 10,
        country: "india",
        include_domains: options?.domain ? [options.domain] : undefined,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Tavily error: ${response.status} ${error}`);
    }

    const data = await response.json();

    return (data.results || []).map(
      (result: { title: string; url: string; content: string; score?: number }) => ({
        title: result.title,
        url: result.url,
        content: result.content,
        score: result.score,
      })
    );
  }

  async health(): Promise<ProviderHealthStatus> {
    if (!this.apiKey) {
      return {
        provider: this.id,
        configured: false,
        status: "unconfigured",
      };
    }

    try {
      const response = await fetch(`${TAVILY_API}/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          query: "test",
          max_results: 1,
        }),
      });

      return {
        provider: this.id,
        configured: true,
        status: response.ok ? "healthy" : "error",
        lastError: !response.ok ? await response.text() : undefined,
      };
    } catch (error) {
      return {
        provider: this.id,
        configured: true,
        status: "error",
        lastError: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}
