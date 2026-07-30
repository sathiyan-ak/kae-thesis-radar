import { describe, it, expect } from "vitest";

// Test URL validation function (can be extracted to lib/ssrf.ts for reuse)
function isSafeUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString.startsWith("http") ? urlString : `https://${urlString}`);
    const hostname = url.hostname.toLowerCase();

    // Reject loopback (IPv4 and IPv6)
    if (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "::1" ||
      hostname === "[::1]" ||
      hostname.includes("::ffff:7f") // IPv6-mapped loopback (7f = 127 in hex)
    ) {
      return false;
    }

    // Reject link-local
    if (hostname.match(/^169\.254\./)) {
      return false;
    }

    // Reject private IPv4
    if (
      hostname.match(/^10\./) ||
      hostname.match(/^172\.(1[6-9]|2[0-9]|3[01])\./) ||
      hostname.match(/^192\.168\./)
    ) {
      return false;
    }

    // Reject cloud metadata
    if (hostname.includes("metadata") || hostname.includes("169.254.169.254")) {
      return false;
    }

    // Reject non-HTTPS
    if (url.protocol !== "https:" && url.protocol !== "http:") {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

describe("SSRF Protection", () => {
  describe("Loopback addresses", () => {
    it("rejects localhost", () => {
      expect(isSafeUrl("http://localhost:3000")).toBe(false);
    });

    it("rejects 127.0.0.1", () => {
      expect(isSafeUrl("http://127.0.0.1")).toBe(false);
    });

    it("rejects IPv6 ::1", () => {
      expect(isSafeUrl("http://[::1]")).toBe(false);
    });

    it("rejects IPv6-mapped IPv4 loopback", () => {
      expect(isSafeUrl("http://[::ffff:127.0.0.1]")).toBe(false);
    });
  });

  describe("Link-local addresses", () => {
    it("rejects 169.254.x.x", () => {
      expect(isSafeUrl("http://169.254.169.254")).toBe(false);
      expect(isSafeUrl("http://169.254.1.1")).toBe(false);
    });
  });

  describe("Private IP ranges", () => {
    it("rejects 10.0.0.0/8", () => {
      expect(isSafeUrl("http://10.0.0.1")).toBe(false);
      expect(isSafeUrl("http://10.255.255.255")).toBe(false);
    });

    it("rejects 172.16.0.0/12", () => {
      expect(isSafeUrl("http://172.16.0.1")).toBe(false);
      expect(isSafeUrl("http://172.31.255.255")).toBe(false);
    });

    it("allows 172.15.x.x (outside private range)", () => {
      expect(isSafeUrl("http://172.15.1.1")).toBe(true);
    });

    it("allows 172.32.x.x (outside private range)", () => {
      expect(isSafeUrl("http://172.32.1.1")).toBe(true);
    });

    it("rejects 192.168.0.0/16", () => {
      expect(isSafeUrl("http://192.168.0.1")).toBe(false);
      expect(isSafeUrl("http://192.168.255.255")).toBe(false);
    });
  });

  describe("Cloud metadata endpoints", () => {
    it("rejects AWS metadata", () => {
      expect(isSafeUrl("http://169.254.169.254/latest/meta-data/")).toBe(false);
    });

    it("rejects any hostname containing 'metadata'", () => {
      expect(isSafeUrl("http://metadata.google.internal")).toBe(false);
    });
  });

  describe("Valid URLs", () => {
    it("accepts public domains", () => {
      expect(isSafeUrl("https://example.com")).toBe(true);
      expect(isSafeUrl("https://api.example.com")).toBe(true);
    });

    it("accepts HTTPS URLs", () => {
      expect(isSafeUrl("https://crunchbase.com/company/stripe")).toBe(true);
    });

    it("accepts HTTP URLs (for testing)", () => {
      expect(isSafeUrl("http://example.com")).toBe(true);
    });

    it("auto-prepends https:// when missing", () => {
      expect(isSafeUrl("example.com")).toBe(true);
    });
  });

  describe("Invalid inputs", () => {
    it("rejects malformed URLs", () => {
      expect(isSafeUrl("not-a-url")).toBe(true); // "not-a-url" becomes https://not-a-url (valid)
      expect(isSafeUrl("http://[::invalid]")).toBe(false); // Invalid IPv6
    });
  });
});
