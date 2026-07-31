import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const files = [
  "app/app/page.tsx",
  "app/app/dealflow/page.tsx",
  "components/app-shell.tsx",
  "components/views.tsx",
  "lib/healthtech-data.ts",
];

describe("approved Opportunity Radar source", () => {
  const source = files.map((file) => readFileSync(file, "utf8")).join("\n");

  it("contains the approved product markers", () => {
    expect(source).toContain("Opportunity Radar");
    expect(source).toContain("Kae Healthtech Edition");
    expect(source).toContain("Independent work sample");
    expect(source).toContain("Seeded demonstration");
    expect(source).toContain("Demo Analyst");
    expect(source).toContain("Tata 1mg");
    expect(source).toContain("CureSkin");
    expect(source).toContain("Dozee");
  });

  it("does not contain stale dashboard markers", () => {
    const forbidden = [
      `Kae ${"Radar"}`,
      `Deals Awaiting ${"Review"}`,
      `Screens This ${"Week"}`,
      `All systems ${"operational"}`,
      `Completed ${"142"}`,
      `mas${"cot"}`,
      `chat${"bot"}`,
    ];

    for (const marker of forbidden) {
      expect(source).not.toContain(marker);
    }
  });
});
