import assert from "node:assert/strict";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${path}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("renders the independent healthtech work sample at the flattened app route", async () => {
  const response = await render("/app");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Opportunity Radar/);
  assert.match(html, /Independent work sample/);
  assert.match(html, /not affiliated with or endorsed by Kae Capital/i);
  assert.match(html, /What this demonstrates/);
  assert.doesNotMatch(html, /Kae Radar|All systems operational|142|chatbot/i);
});

test("renders consistent dealflow and methodology disclosures", async () => {
  const [dealflow, methodology] = await Promise.all([
    (await render("/app/dealflow")).text(),
    (await render("/app/methodology")).text(),
  ]);
  assert.match(dealflow, /Tata 1mg/);
  assert.match(dealflow, /NIRAMAI/);
  assert.match(dealflow, /Demo analyst recommendation/);
  assert.match(methodology, /Not Kae Capital’s investment thesis/i);
  assert.doesNotMatch(`${dealflow}${methodology}`, /NorthGrid agreement|Grid flexibility|Industrial carbon|Kae Radar|All systems operational|chatbot/i);
});
