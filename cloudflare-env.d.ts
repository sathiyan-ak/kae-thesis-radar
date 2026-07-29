declare module "cloudflare:workers" {
  export const env: { DB?: D1Database };
  export class WorkerEntrypoint<Env = unknown> {
    env: Env;
  }
}

interface Fetcher {
  fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
}

type D1Database = Record<string, unknown>;
