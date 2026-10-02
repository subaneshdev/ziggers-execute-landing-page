import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync } from 'node:fs';
import path from 'node:path';

const suites = {
  intelligence: 'test/intelligenceEngine.test.mjs',
  marketplace: 'test/marketplaceEngine.test.mjs',
  production: 'tests/production_engine.test.mjs',
  playbook: 'tests/playbook_engine.test.mjs',
  preview: 'tests/client_forecast.test.mjs',
  geometry: 'tests/geometry_cache.test.mjs',
};
const requested = process.argv.slice(2);
const selected = requested.length ? requested : Object.keys(suites);
if (selected.some(name => !Object.hasOwn(suites, name))) {
  console.error(`Unknown suite. Choose: ${Object.keys(suites).join(', ')}`);
  process.exit(1);
}

// Never let test fixtures overwrite the application's configured SQLite database.
const testRoot = path.resolve('data', 'test-runs');
mkdirSync(testRoot, { recursive: true });
const runDirectory = mkdtempSync(path.join(testRoot, 'run-'));
const env = { ...process.env, SQLITE_DB_PATH: path.join(runDirectory, 'tests.db') };
console.log(`Isolated test database: ${env.SQLITE_DB_PATH}`);
for (const name of selected) {
  const result = spawnSync(process.execPath, ['--env-file-if-exists=.env.local', suites[name]], {
    env, stdio: 'inherit', shell: false,
  });
  if (result.error) console.error(result.error.message);
  if (result.status !== 0) process.exit(result.status || 1);
}
