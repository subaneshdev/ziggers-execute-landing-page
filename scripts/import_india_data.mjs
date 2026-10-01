/**
 * Ziggers Execute - Data Import CLI
 * File: scripts/import_india_data.mjs
 * 
 * Usage: node scripts/import_india_data.mjs [--file=path/to/data.json]
 */

import { importDataPackage, getImportedDataSummary, resolveDataPackagePath } from '../src/lib/data/import/dataPackageImporter.js';

console.log('===================================================================');
console.log('📥 ZIGGERS EXECUTE — EXTERNAL INDIA DATA PACKAGE IMPORTER');
console.log('===================================================================\n');

try {
  let customFile = null;
  for (const arg of process.argv.slice(2)) {
    if (arg.startsWith('--file=')) {
      customFile = arg.substring('--file='.length);
    }
  }

  const targetPath = customFile || resolveDataPackagePath();
  console.log(`📂 Package Location: ${targetPath}`);

  const summary = importDataPackage({ filePath: targetPath });

  console.log(`\n✅ Import Batch Created: ${summary.batchId}`);
  console.log(`📦 Package Version: ${summary.packageVersion} (Checked: ${summary.checkedOn})`);
  console.log(`🔒 File SHA-256: ${summary.checksum.substring(0, 16)}...`);

  console.log('\n--- Ingestion Breakdown ---');
  console.log(`1. Data Sources:     ${summary.dataSources.accepted} accepted, ${summary.dataSources.unchanged} unchanged, ${summary.dataSources.rejected} rejected (of ${summary.dataSources.processed})`);
  console.log(`2. Market Context:   ${summary.marketContext.accepted} accepted, ${summary.marketContext.unchanged} unchanged, ${summary.marketContext.rejected} rejected (of ${summary.marketContext.processed})`);
  console.log(`3. Transit Context:  ${summary.transitContext.accepted} accepted, ${summary.transitContext.unchanged} unchanged, ${summary.transitContext.rejected} rejected (of ${summary.transitContext.processed})`);
  console.log(`4. Venue Directory:  ${summary.venueDirectory.accepted} accepted, ${summary.venueDirectory.unchanged} unchanged, ${summary.venueDirectory.rejected} rejected (of ${summary.venueDirectory.processed})`);

  const totals = getImportedDataSummary();
  console.log('\n--- Current Database Totals ---');
  console.log(`Total Master Sources:       ${totals.sourcesCount}`);
  console.log(`Total Market Context Rows:  ${totals.marketCount} (Rural & Urban state estimates)`);
  console.log(`Total Transit Flow Rows:    ${totals.transitCount} (Monthly CMRL network flow)`);
  console.log(`Total Venue Directory Rows: ${totals.venueCount} (NIRF institutional directory)`);
  console.log(`Total Import Batches:       ${totals.batchesCount}`);
  console.log('\n===================================================================');
  console.log('🎉 DATA INGESTION COMPLETED SUCCESSFULLY');
  console.log('===================================================================');
} catch (err) {
  console.error('\n❌ IMPORT FAILED:', err.message);
  process.exit(1);
}
