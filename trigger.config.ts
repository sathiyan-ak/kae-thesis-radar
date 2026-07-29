import { defineConfig } from "@trigger.dev/sdk/v3";

export default defineConfig({
  project: "kae-thesis-radar",
  maxDuration: 3600,
  triggerDirectories: ["./trigger"],
});
