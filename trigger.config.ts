import { defineConfig } from "@trigger.dev/sdk";

export default defineConfig({
  project: "kae-thesis-radar",
  maxDuration: 3600,
  triggerDirectories: ["./trigger"],
});
