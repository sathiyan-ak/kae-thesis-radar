import {
  CompanyIdentityProvider,
  CompanyIdentity,
  ProviderHealthStatus,
} from "@/lib/providers/types";

const GITHUB_API = "https://api.github.com";

export class GitHubProvider implements CompanyIdentityProvider {
  id = "github";

  async resolve(name: string): Promise<CompanyIdentity> {
    try {
      const response = await fetch(
        `${GITHUB_API}/search/users?q=${encodeURIComponent(name)} company:${encodeURIComponent(name)}&per_page=5`,
        {
          headers: {
            Accept: "application/vnd.github.v3+json",
            "User-Agent": "kae-thesis-radar",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const data = await response.json();

      return {
        domain: undefined,
        founders: data.items?.map((item: { login: string }) => item.login) || [],
      };
    } catch (error) {
      throw new Error(`GitHub provider error: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  async health(): Promise<ProviderHealthStatus> {
    try {
      const response = await fetch(`${GITHUB_API}/rate_limit`, {
        headers: {
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "kae-thesis-radar",
        },
      });

      return {
        provider: this.id,
        configured: true,
        status: response.ok ? "healthy" : "error",
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
