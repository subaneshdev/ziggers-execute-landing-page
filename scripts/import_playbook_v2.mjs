import { importPlaybookPackage, getPlaybookLibrarySummary } from '../src/lib/data/import/playbookImporter.js';

console.log('===================================================================');
console.log('🚀 INGESTING ZIGGERS CAMPAIGN DECISION PLAYBOOK V2 PACKAGE');
console.log('===================================================================');

try {
  const result = importPlaybookPackage();
  console.log(`\nBatch ID: ${result.batchId}`);
  console.log(`File: ${result.filePath}`);
  console.log(`SHA-256: ${result.checksum.slice(0, 16)}...`);
  console.log(`Version: ${result.version}`);
  console.log(`Prepared On: ${result.preparedOn}`);
  console.log(`\nSources: ${result.sources.accepted}/${result.sources.processed} accepted (${result.sources.rejected} rejected, ${result.sources.unchanged} unchanged)`);
  console.log(`Families: ${result.families.accepted}/${result.families.processed} registered`);
  console.log(`Playbooks: ${result.playbooks.accepted}/${result.playbooks.processed} accepted (${result.playbooks.rejected} rejected, ${result.playbooks.unchanged} unchanged, ${result.playbooks.preservedAdminEdits} preserved admin edits)`);

  if (result.rejections.length > 0) {
    console.log(`\nRejections (${result.rejections.length}):`);
    result.rejections.forEach(r => console.log(`  - [${r.type}] ${r.id}: ${r.reason}`));
  }

  const summary = getPlaybookLibrarySummary();
  console.log('\nCurrent Library Totals in Database:');
  console.log(`  - Total Playbooks: ${summary.playbooksCount}`);
  console.log(`  - Drafts for Operations Review: ${summary.draftCount}`);
  console.log(`  - Published Playbooks: ${summary.publishedCount}`);
  console.log(`  - Planning Families: ${summary.familiesCount}`);
  console.log(`  - Evidence Sources: ${summary.sourcesCount}`);
  console.log('\n===================================================================');
  console.log('✅ PLAYBOOK V2 IMPORT COMPLETED SUCCESSFULLY');
  console.log('===================================================================');
} catch (err) {
  console.error('\n❌ IMPORT FAILED:', err.message);
  process.exit(1);
}
