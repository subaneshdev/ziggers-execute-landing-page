import fs from 'node:fs';
import path from 'node:path';
import { performance } from 'node:perf_hooks';
process.env.SQLITE_DB_PATH = path.resolve('data/audit-benchmark.db');
const { generateCampaignForecast: preview } = await import('../src/lib/intelligence/clientForecast.js');
const { generateCampaignForecast: server } = await import('../src/lib/intelligence/index.js');
const results = [];
for (const [name, fn] of [['preview', preview], ['server', server]]) {
  for (const radiusKm of [0.5, 3, 8]) {
    const params = { radiusKm, budgetInr: 75000, campaignDays: 3, shiftHours: 5, objective: 'Brand Awareness' };
    const coldStart = performance.now();
    fn(params);
    const firstCallMs = performance.now() - coldStart;
    const times = [];
    for (let i = 0; i < 20; i++) {
      const start = performance.now(); fn(params); times.push(performance.now() - start);
    }
    times.sort((a,b) => a-b);
    results.push({ name, radiusKm, firstCallMs: +firstCallMs.toFixed(2), medianMs: +times[10].toFixed(2), p95Ms: +times[18].toFixed(2), iterations: 20 });
  }
}
fs.writeFileSync('docs/audit/engine-benchmark.json', JSON.stringify({ node: process.version, notes: 'Local synchronous calls; isolated fresh SQLite database; no network or concurrency. Server calls include forecast inserts. Measurements are not production latency.', results }, null, 2));
console.log(JSON.stringify(results, null, 2));
