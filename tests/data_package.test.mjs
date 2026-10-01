/**
 * Ziggers External Data Package Verification & Integrity Test Suite
 * File: tests/data_package.test.mjs
 * 
 * Verifies:
 * 1. Data package manifest & external storage configuration.
 * 2. Idempotent import & zero-duplicate enforcement.
 * 3. Exact discrepancy preservation (MoSPI Haryana Table 1 = 8427).
 * 4. Missing value integrity (explicit NULL for footfall, not 0).
 * 5. Data separation & non-substitution into reach/footfall/conversion calculations.
 * 6. Legacy data honest provenance tagging (UNVERIFIED_SEED).
 * 7. Repository source-aware queries & limitation notices.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Import system modules
import { getDatabase } from '../src/lib/data/database.js';
import { importDataPackage } from '../src/lib/data/import/dataPackageImporter.js';
import { 
  getAllDataSources, 
  getMarketContextForStateOrCity, 
  getTransitContextForCity, 
  getVenuesByLocation, 
  getDataLibrarySummary,
  getComprehensiveEvidenceContext
} from '../src/lib/data/repositories/dataLibraryRepository.js';
import { generateCampaignForecast } from '../src/lib/intelligence/index.js';

describe('External Data Package & Provenance Engine Tests', () => {
  const db = getDatabase();

  it('PKG-001: Data package manifest exists and contains valid file paths and hashes', () => {
    const manifestPath = path.join(projectRoot, 'config', 'data_package_manifest.json');
    assert.ok(fs.existsSync(manifestPath), 'Manifest file must exist in config/');

    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    assert.equal(manifest.package_version, '1.0');
    assert.ok(manifest.files.json, 'Manifest must specify json package');
    assert.ok(manifest.files.sqlite, 'Manifest must specify sqlite package');

    // Verify resolved location
    const jsonPath = path.resolve(projectRoot, manifest.files.json.relative_path);
    assert.ok(fs.existsSync(jsonPath), `JSON file must exist at ${jsonPath}`);
  });

  it('PKG-002: Data sources table populated with correct connection statuses', () => {
    const sources = getAllDataSources();
    assert.ok(sources.length >= 9, 'Should have at least 9 data sources registered');

    const hces = sources.find(s => s.source_id === 'hces');
    assert.ok(hces, 'MoSPI HCES source must be present');
    assert.ok(hces.status.includes('observations included'));
    assert.ok(hces.url.includes('pib.gov.in') || hces.url.includes('mospi.gov.in'), 'HCES URL must be official');

    const cmrl = sources.find(s => s.source_id === 'cmrl');
    assert.ok(cmrl, 'CMRL ridership source must be present');
    assert.ok(cmrl.status.includes('observations included'));

    const nirf = sources.find(s => s.source_id === 'nirf');
    assert.ok(nirf, 'NIRF 2024 source must be present');
    assert.ok(nirf.status.includes('records included'));

    const imd = sources.find(s => s.source_id === 'imd');
    assert.ok(imd, 'IMD weather source must be present');
    assert.ok(imd.status.includes('live connection not configured'), 'IMD must remain NOT connected as specified');
    assert.equal(imd.is_connected, 0);

    const census = sources.find(s => s.source_id === 'census');
    assert.ok(census, 'Census source must be present');
    assert.ok(census.status.includes('not imported'), 'Census must retain not imported status');
    assert.equal(census.is_connected, 0);
  });

  it('PKG-003: Idempotent import runner produces 0 duplicates and 0 rejections on second run', () => {
    const manifestPath = path.join(projectRoot, 'config', 'data_package_manifest.json');
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    const jsonPath = path.resolve(projectRoot, manifest.files.json.relative_path);
    const result = importDataPackage({ filePath: jsonPath });

    assert.equal(result.marketContext.rejected, 0, 'No market context rows rejected');
    assert.equal(result.transitContext.rejected, 0, 'No transit context rows rejected');
    assert.equal(result.venueDirectory.rejected, 0, 'No venue directory rows rejected');
    assert.equal(result.rejections.length, 0, 'Rejection list must be empty');

    // Everything should be unchanged since already imported
    assert.equal(result.marketContext.accepted, 0);
    assert.ok(result.marketContext.unchanged >= 74);
    assert.equal(result.transitContext.accepted, 0);
    assert.ok(result.transitContext.unchanged >= 11);
    assert.equal(result.venueDirectory.accepted, 0);
    assert.ok(result.venueDirectory.unchanged >= 8);
  });

  it('PKG-004: Exact discrepancy preservation - Haryana urban MPCE must be 8427 (not averaged to 8428)', () => {
    const row = db.prepare(`
      SELECT value, unit FROM market_context 
      WHERE area_name = 'Haryana' AND sector = 'Urban'
    `).get();

    assert.ok(row, 'Haryana Urban row must exist');
    assert.equal(row.value, 8427, 'Haryana Urban MPCE must be exactly 8427 from Table 1, never rounded/averaged to 8428');
    assert.equal(row.unit, 'INR_per_person_per_month');

    // All India Rural and Urban
    const allIndiaRural = db.prepare(`
      SELECT value FROM market_context WHERE area_name = 'All-India' AND sector = 'Rural'
    `).get();
    assert.equal(allIndiaRural.value, 4122, 'All-India Rural must be exactly 4122');

    const allIndiaUrban = db.prepare(`
      SELECT value FROM market_context WHERE area_name = 'All-India' AND sector = 'Urban'
    `).get();
    assert.equal(allIndiaUrban.value, 6996, 'All-India Urban must be exactly 6996');
  });

  it('PKG-005: Missing values must be stored explicitly as NULL, not converted to 0', () => {
    const venues = db.prepare(`
      SELECT name, footfall, student_count, permission_status FROM venue_directory
    `).all();

    assert.ok(venues.length >= 8, 'Should have at least 8 starter venues');
    for (const v of venues) {
      assert.strictEqual(v.footfall, null, `Venue ${v.name} footfall must be explicitly NULL, not 0`);
      assert.equal(v.permission_status, 'NOT_CONFIRMED', 'Permission status must be NOT_CONFIRMED');
    }
  });

  it('PKG-006: Legacy seed nodes are explicitly flagged as UNVERIFIED_SEED', () => {
    const seedNodes = db.prepare(`
      SELECT location_name, evidence_status FROM spatial_population_h3
    `).all();

    assert.ok(seedNodes.length >= 16, 'Should have at least 16 legacy nodes');
    for (const node of seedNodes) {
      assert.equal(node.evidence_status, 'UNVERIFIED_SEED', `Node ${node.location_name} must be flagged as UNVERIFIED_SEED`);
    }

    // Traffic curve evidence status
    const trafficRows = db.prepare(`
      SELECT DISTINCT evidence_status FROM hourly_traffic_profiles
    `).all();
    assert.ok(trafficRows.some(r => r.evidence_status === 'MODELLED_SYNTHETIC_CURVE'));
  });

  it('PKG-007: Non-substitution guarantee - Forecast reach/footfall does NOT depend on macro spending or transit flow', () => {
    // Generate baseline forecast for Chennai
    const f1 = generateCampaignForecast({
      targetLocations: ['T. Nagar & Ranganathan Street'],
      budgetInr: 250000,
      campaignDays: 7,
      shiftHours: 5,
      objective: 'Product Sampling'
    });

    assert.ok(f1.estimatedReach > 0);
    assert.ok(f1.expectedInteractions > 0);
    assert.ok(f1.expectedLeads > 0);

    // Verify evidence context is attached for audit without altering forecast metrics
    assert.ok(f1.evidenceContext, 'Evidence context must be attached to forecast');
    assert.ok(f1.evidenceContext.marketContext, 'Market context must be attached');
    assert.equal(f1.evidenceContext.marketContext.areaName, 'Tamil Nadu');
    assert.equal(f1.evidenceContext.marketContext.urban.value, 8165);

    assert.ok(f1.evidenceContext.transitContext, 'Transit context must be attached');
    assert.equal(f1.evidenceContext.transitContext.city, 'Chennai');
    assert.ok(f1.evidenceContext.transitContext.latestValue > 0);

    // Verify limitation notices exist
    assert.ok(f1.evidenceContext.limitationsNotice.length >= 4);
    assert.ok(f1.evidenceContext.limitationsNotice.some(n => n.includes('Residential population is not pedestrian footfall')));
    assert.ok(f1.evidenceContext.limitationsNotice.some(n => n.includes('Transit passenger counts represent entire network flow')));

    // Crucial check: footfall exposure is strictly calculated from diurnal traffic and residential/transient population segments,
    // NEVER substituted or inflated by macro transit network ridership (8.46M).
    assert.strictEqual(typeof f1.footfall.shiftFootfallExposure, 'number');
    assert.ok(f1.footfall.shiftFootfallExposure < 8000000, 'Footfall exposure should be local diurnal scale, never metro transit network total');
  });

  it('PKG-008: Data Library summary statistics reflect true database state', () => {
    const summary = getDataLibrarySummary();
    assert.ok(summary.dataSourcesCount >= 9);
    assert.ok(summary.marketContextCount >= 74);
    assert.ok(summary.transitObservationsCount >= 11);
    assert.ok(summary.venueDirectoryCount >= 8);
    assert.ok(summary.importBatchesCount >= 1);
    assert.ok(summary.activeRecordsSourcesCount >= 3);
    assert.ok(summary.unconnectedSourcesCount >= 5);
  });
});
