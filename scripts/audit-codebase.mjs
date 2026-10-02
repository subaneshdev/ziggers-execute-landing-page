import fs from 'node:fs';
import path from 'node:path';

const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(`${dir}/${e.name}`) : [`${dir}/${e.name}`]);
const files = walk('src').filter(f => /\.(js|jsx|ts|tsx)$/.test(f));
const graph = new Map();
for (const file of files) {
  const text = fs.readFileSync(file, 'utf8');
  const refs = [...text.matchAll(/(?:from\s*|import\s*\(\s*|import\s*|require\s*\(\s*)['"]([^'"]+)['"]/g)].map(m => m[1]);
  graph.set(file, refs.flatMap(ref => {
    if (!ref.startsWith('.') && !ref.startsWith('@/')) return [];
    const base = ref.startsWith('@/') ? `src/${ref.slice(2)}` : path.posix.normalize(`${path.posix.dirname(file)}/${ref}`);
    return [base, ...['.js','.jsx','.ts','.tsx','/index.js','/index.ts'].map(ext => base + ext)].filter(p => files.includes(p));
  }));
}
const entries = files.filter(f => /^src\/app\//.test(f) && /\/(page|layout|route|loading|error|not-found|sitemap|robots|global-error|template|default)\.[jt]sx?$/.test(f));
const reachable = new Set();
function visit(f) { if (reachable.has(f)) return; reachable.add(f); for (const dep of graph.get(f) || []) visit(dep); }
entries.forEach(visit);
const candidates = files.filter(f => !reachable.has(f));
const external = [...walk('test'), ...walk('tests'), ...walk('scripts')].filter(f => /\.[cm]?[jt]sx?$/.test(f) && !f.endsWith('audit-codebase.mjs'));
const allRootsReachable = new Set(reachable);
function visitAll(file) {
  if (allRootsReachable.has(file)) return;
  allRootsReachable.add(file);
  for (const dependency of graph.get(file) || []) visitAll(dependency);
}
for (const file of [...external, ...walk('supabase').filter(f => /\.[jt]s$/.test(f))]) {
  const refs = [...fs.readFileSync(file, 'utf8').matchAll(/(?:from\s*|import\s*\(\s*|import\s*|require\s*\(\s*)['"]([^'"]+)['"]/g)].map(m => m[1]);
  for (const ref of refs) {
    const base = ref.startsWith('@/') ? `src/${ref.slice(2)}` : path.posix.normalize(`${path.posix.dirname(file)}/${ref}`);
    for (const candidate of [base, ...['.js', '.jsx', '.ts', '.tsx', '/index.js', '/index.ts'].map(ext => base + ext)]) {
      if (files.includes(candidate)) visitAll(candidate);
    }
  }
}
const result = {
  sourceFiles: files.length, nextEntries: entries.length, reachableFiles: reachable.size,
  candidateCount: candidates.length,
  unusedByAppTestsAndScripts: files.filter(file => !allRootsReachable.has(file)),
  candidates: candidates.map(file => ({ file, referencesOutsideApp: external.filter(f => {
    const refs = [...fs.readFileSync(f,'utf8').matchAll(/(?:from\s*|import\s*\(\s*|import\s*|require\s*\(\s*)['"]([^'"]+)['"]/g)].map(m => m[1]);
    return refs.some(ref => {
      const base = path.posix.normalize(`${path.posix.dirname(f)}/${ref}`);
      return base === file || `${base}.ts` === file || `${base}.js` === file;
    });
  }) })),
  largestFiles: files.map(file => ({file, lines: fs.readFileSync(file,'utf8').split('\n').length})).sort((a,b)=>b.lines-a.lines).slice(0,12),
  method: 'Static local import graph rooted at Next.js convention entrypoints; candidates require review, not automatic deletion. External references are direct static imports in tests/scripts; indirect test dependencies are not listed.'
};
fs.mkdirSync('docs/audit', { recursive: true });
fs.writeFileSync('docs/audit/dependency-audit.json', JSON.stringify(result, null, 2));
console.log(JSON.stringify(result, null, 2));
