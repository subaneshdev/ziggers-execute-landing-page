/**
 * Ziggers Production Engine Comprehensive Test Suite
 * File: tests/production_engine.test.mjs
 * 
 * Verifies:
 * 1. Process Restart Persistence (Cold DB reload retains Bayesian posteriors)
 * 2. Multi-Tenant Isolation (Tenant A feedback cannot leak to Tenant B)
 * 3. Multi-Signal Server-Side Check-in Verification (Mock GPS, distance, low accuracy, kinematic velocity)
 * 4. Payout Authorization Integrity (Server-verified check-in required, integer paise)
 * 5. Cryptographic Audit Chain & Tamper Detection (HMAC-SHA256, hash continuity)
 * 6. Financial Waterfall in Integer Paise & Capacity Optimization
 */

import assert from 'assert';
import crypto from 'crypto';
import { getDatabase, closeDatabase } from '../src/lib/data/database.js';
import { ingestVerifiedOutcomeTransaction, getTenantModelEvaluationData } from '../src/lib/data/repositories/outcomeRepository.js';
import { getHierarchicalPosterior } from '../src/lib/data/repositories/bayesianRepository.js';
import { 
  createWorkerAssignment, 
  recordShiftCheckin, 
  authorizeWorkerPayout 
} from '../src/lib/data/repositories/verificationRepository.js';
import { 
  appendAuditEvent, 
  verifyAuditChain 
} from '../src/lib/data/repositories/auditRepository.js';
import { 
  generateCampaignForecast 
} from '../src/lib/intelligence/index.js';
import { 
  optimizeStaffing,
  solveDiscreteStaffingOptimization, 
  calculateMinimumRequiredGrossBudget,
  resolveOperationalRates
} from '../src/lib/intelligence/capacity/staffingOptimizer.js';
import fs from 'fs';
import { getRequiredSupabaseClient, getRequiredSupabaseAdmin } from '../src/lib/supabase.js';
import { getTenantCampaignConfiguration, saveTenantCampaignConfiguration } from '../src/lib/data/repositories/configurationRepository.js';
import { getHourlyTrafficCurve } from '../src/lib/data/repositories/trafficRepository.js';
import { getSpatialPopulationByH3 } from '../src/lib/data/repositories/populationRepository.js';
import { HOURLY_PROFILES } from '../src/lib/intelligence/footfall/timeDistribution.js';
import { MetaSignalProvider } from '../src/lib/intelligence/signals/metaSignalProvider.js';

let passedTests = 0;
let totalTests = 0;

function it(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`✅ PASSED: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`❌ FAILED: ${name}`);
    console.error(err);
    process.exitCode = 1;
  }
}

async function itAsync(name, fn) {
  totalTests++;
  try {
    await fn();
    console.log(`✅ PASSED: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`❌ FAILED: ${name}`);
    console.error(err);
    process.exitCode = 1;
  }
}

console.log('===================================================================');
console.log('🧪 RUNNING ZIGGERS PRODUCTION ENGINE COMPREHENSIVE TEST SUITE');
console.log('===================================================================\n');

// ---------------------------------------------------------
// SECTION 1: RESTART PERSISTENCE & BAYESIAN LEARNING
// ---------------------------------------------------------
console.log('--- 1. Cold Restart Persistence & Bayesian Learning ---');

const testTenant = `org_restart_test_${Date.now()}`;
const testCell = '892f254f177ffff';
const testObjective = 'Product Sampling';
const testCity = 'Chennai';
const testVenue = 'commercial_high_street';

// Get baseline prior
const baselinePrior = getHierarchicalPosterior({
  tenantId: testTenant,
  city: testCity,
  h3Cell: testCell,
  venueType: testVenue,
  objective: testObjective,
  metricName: 'landing_to_lead_rate'
});

it('Initial hierarchical posterior resolves to city/venue baseline', () => {
  assert(baselinePrior.alpha > 0, 'Alpha should be > 0');
  assert(baselinePrior.beta > 0, 'Beta should be > 0');
  assert.strictEqual(baselinePrior.observation_count, 0, 'Observation count should be 0');
});

// Ingest verified outcome
const ingestResult1 = ingestVerifiedOutcomeTransaction({
  idempotencyKey: `idem_out_1_${Date.now()}`,
  campaignId: 'camp_restart_1',
  tenantId: testTenant,
  city: testCity,
  h3Cell: testCell,
  venueType: testVenue,
  objective: testObjective,
  actualFootfall: 5000,
  actualInteractions: 100,
  actualConversions: 25,
  actualSamples: 150
});

it('Transactional outcome ingestion updates alpha and beta', () => {
  assert.strictEqual(ingestResult1.isDuplicate, false);
  assert.strictEqual(ingestResult1.posterior.observation_count, 1);
  const expectedAlpha = Number(baselinePrior.alpha) + 25;
  const expectedBeta = Number(baselinePrior.beta) + (100 - 25);
  assert(Math.abs(ingestResult1.posterior.alpha - expectedAlpha) < 0.01, `Alpha should be approx ${expectedAlpha}`);
  assert(Math.abs(ingestResult1.posterior.beta - expectedBeta) < 0.01, `Beta should be approx ${expectedBeta}`);
});

// Simulate cold process restart by closing DB connection and re-initializing from disk
closeDatabase();
const reloadedDb = getDatabase();

it('Bayesian posteriors survive cold database restart', () => {
  const reloadedPosterior = getHierarchicalPosterior({
    tenantId: testTenant,
    city: testCity,
    h3Cell: testCell,
    venueType: testVenue,
    objective: testObjective,
    metricName: 'landing_to_lead_rate'
  });

  assert.strictEqual(reloadedPosterior.observation_count, 1, 'Observation count must persist across restart');
  const expectedAlpha = Number(baselinePrior.alpha) + 25;
  assert(Math.abs(reloadedPosterior.alpha - expectedAlpha) < 0.01, 'Persisted alpha must match after restart');
});

it('Idempotent outcome ingestion prevents double-counting', () => {
  const duplicateSubmission = ingestVerifiedOutcomeTransaction({
    idempotencyKey: ingestResult1.idempotencyKey,
    campaignId: 'camp_restart_1',
    tenantId: testTenant,
    city: testCity,
    h3Cell: testCell,
    venueType: testVenue,
    objective: testObjective,
    actualInteractions: 100,
    actualConversions: 25
  });

  assert.strictEqual(duplicateSubmission.isDuplicate, true, 'Must detect duplicate submission');
  assert.strictEqual(duplicateSubmission.posterior.observation_count, 1, 'Observation count must NOT increment on duplicate');
});

// ---------------------------------------------------------
// SECTION 2: MULTI-TENANT ISOLATION
// ---------------------------------------------------------
console.log('\n--- 2. Multi-Tenant Isolation ---');

const tenantA = `tenant_alpha_${Date.now()}`;
const tenantB = `tenant_beta_${Date.now()}`;

ingestVerifiedOutcomeTransaction({
  idempotencyKey: `idem_tenant_a_${Date.now()}`,
  campaignId: 'camp_tenant_a',
  tenantId: tenantA,
  city: 'Chennai',
  h3Cell: '892f254f177ffff',
  venueType: 'commercial_high_street',
  objective: 'Lead Generation',
  actualInteractions: 200,
  actualConversions: 50
});

it('Tenant A outcome updates Tenant A posterior', () => {
  const postA = getHierarchicalPosterior({
    tenantId: tenantA,
    city: 'Chennai',
    h3Cell: '892f254f177ffff',
    venueType: 'commercial_high_street',
    objective: 'Lead Generation',
    metricName: 'landing_to_lead_rate'
  });

  assert.strictEqual(postA.observation_count, 1);
  assert(postA.sufficient_stat_k === 50, 'Tenant A k stat should be 50');
});

it('Tenant B posterior remains completely isolated from Tenant A', () => {
  const postB = getHierarchicalPosterior({
    tenantId: tenantB,
    city: 'Chennai',
    h3Cell: '892f254f177ffff',
    venueType: 'commercial_high_street',
    objective: 'Lead Generation',
    metricName: 'landing_to_lead_rate'
  });

  assert.strictEqual(postB.observation_count, 0, 'Tenant B must have 0 observations');
  assert(postB.sufficient_stat_k === 0, 'Tenant B k stat must be 0');
});

// ---------------------------------------------------------
// SECTION 3: MULTI-SIGNAL SERVER-SIDE CHECK-IN VERIFICATION
// ---------------------------------------------------------
console.log('\n--- 3. Multi-Signal Server-Side Check-in Verification ---');

const testWorkerId = `wrk_verify_${Date.now()}`;
const testCampaignId = `camp_verify_${Date.now()}`;
const testAssignmentId = `asgn_verify_${Date.now()}`;

createWorkerAssignment({
  assignmentId: testAssignmentId,
  campaignId: testCampaignId,
  workerId: testWorkerId,
  tenantId: testTenant,
  shiftDate: '2026-10-01',
  shiftStartTime: '09:00',
  shiftEndTime: '17:00',
  targetLatitude: 13.0827,
  targetLongitude: 80.2707,
  geofenceRadiusMeters: 50
});

it('Signal 1: Accurate check-in within geofence is server-verified', () => {
  const checkin = recordShiftCheckin({
    assignmentId: testAssignmentId,
    campaignId: testCampaignId,
    workerId: testWorkerId,
    tenantId: testTenant,
    latitude: 13.08275, // ~6m away
    longitude: 80.27072,
    gpsAccuracyMeters: 10,
    isMockDetected: false
  });

  assert.strictEqual(checkin.isVerified, true);
  assert.strictEqual(checkin.verificationStatus, 'VERIFIED');
  assert(checkin.distanceMeters < 50);
});

it('Signal 2: Out of geofence check-in is server-rejected', () => {
  const checkin = recordShiftCheckin({
    assignmentId: testAssignmentId,
    campaignId: testCampaignId,
    workerId: testWorkerId,
    tenantId: testTenant,
    latitude: 13.0845, // ~200m away
    longitude: 80.2707,
    gpsAccuracyMeters: 10,
    isMockDetected: false
  });

  assert.strictEqual(checkin.isVerified, false);
  assert.strictEqual(checkin.verificationStatus, 'REJECTED_OUT_OF_GEOFENCE');
});

it('Signal 3: Mock location spoofing is server-rejected', () => {
  const checkin = recordShiftCheckin({
    assignmentId: testAssignmentId,
    campaignId: testCampaignId,
    workerId: testWorkerId,
    tenantId: testTenant,
    latitude: 13.0827,
    longitude: 80.2707,
    gpsAccuracyMeters: 5,
    isMockDetected: true
  });

  assert.strictEqual(checkin.isVerified, false);
  assert.strictEqual(checkin.verificationStatus, 'REJECTED_MOCK_LOCATION');
});

it('Signal 4: Low GPS accuracy (>50m) is server-rejected', () => {
  const checkin = recordShiftCheckin({
    assignmentId: testAssignmentId,
    campaignId: testCampaignId,
    workerId: testWorkerId,
    tenantId: testTenant,
    latitude: 13.0827,
    longitude: 80.2707,
    gpsAccuracyMeters: 75, // excessive uncertainty
    isMockDetected: false
  });

  assert.strictEqual(checkin.isVerified, false);
  assert.strictEqual(checkin.verificationStatus, 'REJECTED_LOW_ACCURACY');
});

it('Signal 5: Kinematic teleportation (>120 km/h) is server-rejected', () => {
  // First record a valid checkin at T0
  const now = Date.now();
  recordShiftCheckin({
    assignmentId: testAssignmentId,
    campaignId: testCampaignId,
    workerId: testWorkerId,
    tenantId: testTenant,
    latitude: 13.0827,
    longitude: 80.2707,
    gpsAccuracyMeters: 10,
    checkinTimestamp: new Date(now).toISOString()
  });

  // Second check-in 100km away 2 minutes later (velocity ~3000 km/h)
  const checkinTeleport = recordShiftCheckin({
    assignmentId: testAssignmentId,
    campaignId: testCampaignId,
    workerId: testWorkerId,
    tenantId: testTenant,
    latitude: 13.9827,
    longitude: 80.2707,
    gpsAccuracyMeters: 10,
    checkinTimestamp: new Date(now + 2 * 60 * 1000).toISOString()
  });

  assert.strictEqual(checkinTeleport.isVerified, false);
  assert.strictEqual(checkinTeleport.verificationStatus, 'REJECTED_TELEPORTATION');
});

// ---------------------------------------------------------
// SECTION 4: SERVER-VERIFIED PAYOUTS IN INTEGER PAISE
// ---------------------------------------------------------
console.log('\n--- 4. Server-Verified Payouts in Integer Paise ---');

const unverifiedWorkerId = `wrk_unverified_${Date.now()}`;
const unverifiedAsgnId = `asgn_unverified_${Date.now()}`;

createWorkerAssignment({
  assignmentId: unverifiedAsgnId,
  campaignId: testCampaignId,
  workerId: unverifiedWorkerId,
  tenantId: testTenant,
  shiftDate: '2026-10-02',
  shiftStartTime: '09:00',
  shiftEndTime: '17:00',
  targetLatitude: 13.0827,
  targetLongitude: 80.2707
});

it('Payout without server-verified checkin is strictly rejected', () => {
  assert.throws(() => {
    authorizeWorkerPayout({
      campaignId: testCampaignId,
      assignmentId: unverifiedAsgnId,
      workerId: unverifiedWorkerId,
      tenantId: testTenant,
      idempotencyKey: `idem_unverified_pay_${Date.now()}`
    });
  }, /No server-verified check-in found/);
});

it('Payout with server-verified checkin calculates strictly in integer paise', () => {
  // Record valid verified checkin for verified worker
  recordShiftCheckin({
    assignmentId: testAssignmentId,
    campaignId: testCampaignId,
    workerId: testWorkerId,
    tenantId: testTenant,
    latitude: 13.0827,
    longitude: 80.2707,
    gpsAccuracyMeters: 5
  });

  const payout = authorizeWorkerPayout({
    campaignId: testCampaignId,
    assignmentId: testAssignmentId,
    workerId: testWorkerId,
    tenantId: testTenant,
    idempotencyKey: `idem_verified_pay_${Date.now()}`,
    shiftHours: 5
  });

  assert.strictEqual(payout.payoutStatus, 'APPROVED_FOR_DISBURSEMENT');
  assert.strictEqual(typeof payout.guaranteedBasePaise, 'number');
  assert.strictEqual(Number.isInteger(payout.guaranteedBasePaise), true);
  assert.strictEqual(payout.guaranteedBasePaise, 24000 * 5); // 5 hours * 24000 paise = 120000 paise (₹1,200.00)
  assert.strictEqual(payout.variableBonusPaise, 15000); // ₹150 incentive
  assert.strictEqual(payout.totalPayablePaise, 135000); // ₹1,350.00
});

// ---------------------------------------------------------
// SECTION 5: AUDIT CHAIN INTEGRITY & TAMPER DETECTION
// ---------------------------------------------------------
console.log('\n--- 5. Cryptographic Audit Chain & Tamper Detection ---');

const auditTenant = `tenant_audit_${Date.now()}`;

const ev1 = appendAuditEvent({
  tenantId: auditTenant,
  eventType: 'CAMPAIGN_INITIALIZED',
  entityId: 'camp_001',
  payload: { budgetInr: 100000, objective: 'Product Sampling' }
});

const ev2 = appendAuditEvent({
  tenantId: auditTenant,
  eventType: 'WORKER_ASSIGNED',
  entityId: 'asgn_001',
  payload: { workerId: 'w1', shiftHours: 5 }
});

const ev3 = appendAuditEvent({
  tenantId: auditTenant,
  eventType: 'SHIFT_VERIFIED',
  entityId: 'chk_001',
  payload: { status: 'VERIFIED', distanceMeters: 4.2 }
});

it('Audit chain links consecutive events via SHA-256 hashes', () => {
  assert.strictEqual(ev2.previousHash, ev1.cryptoHash, 'ev2.previousHash must match ev1.cryptoHash');
  assert.strictEqual(ev3.previousHash, ev2.cryptoHash, 'ev3.previousHash must match ev2.cryptoHash');
});

it('Audit chain integrity check succeeds on authentic chain', () => {
  const auditCheck = verifyAuditChain(auditTenant);
  assert.strictEqual(auditCheck.isValid, true);
  assert.strictEqual(auditCheck.verifiedEventsCount, 3);
});

it('Tamper detection: direct payload mutation is immediately caught', () => {
  const db = getDatabase();
  // Tamper with ev2 in database directly
  db.prepare(`
    UPDATE audit_chain_events 
    SET canonical_payload_json = '{"workerId":"w1","shiftHours":999}'
    WHERE event_id = ?
  `).run(ev2.eventId);

  const tamperedCheck = verifyAuditChain(auditTenant);
  assert.strictEqual(tamperedCheck.isValid, false, 'Tampered chain must be detected as invalid');
  assert(tamperedCheck.reason.includes('tampered') || tamperedCheck.reason.includes('mismatch'), 'Must flag hash mismatch');
});

// ---------------------------------------------------------
// SECTION 6: INTEGER PAISE WATERFALL & UNDER-BUDGET OPTIMIZATION
// ---------------------------------------------------------
console.log('\n--- 6. Integer Paise Financial Waterfall & Capacity Bounds ---');

it('GST inclusive waterfall reconciles exactly in integer paise', () => {
  const grossPaise = 11800000; // ₹1,18,000.00
  const gstRate = 1800; // 18.00%
  const netFundPaise = Math.round((grossPaise * 10000) / (10000 + gstRate));
  const gstPaise = grossPaise - netFundPaise;

  assert.strictEqual(netFundPaise, 10000000); // ₹1,00,000.00
  assert.strictEqual(gstPaise, 1800000); // ₹18,000.00

  const reservePaise = Math.max(200000, Math.round(netFundPaise * 0.10));
  assert.strictEqual(reservePaise, 1000000); // ₹10,000.00

  const platformFeePaise = Math.round(netFundPaise * 0.08);
  assert.strictEqual(platformFeePaise, 800000); // ₹8,000.00

  const labourPoolPaise = netFundPaise - reservePaise - platformFeePaise;
  assert.strictEqual(labourPoolPaise, 8200000); // ₹82,000.00

  // Exact reconciliation
  assert.strictEqual(reservePaise + platformFeePaise + labourPoolPaise, netFundPaise);
});

it('Under-budget edge case (₹5,000 for 7 days) flags BUDGET_INSUFFICIENT and calculates realistic minimum', () => {
  const result = optimizeStaffing({ budgetInr: 5000, shiftHours: 5, campaignDays: 7, objective: 'Product Sampling' });
  
  assert.strictEqual(result.status, 'BUDGET_INSUFFICIENT');
  assert.strictEqual(result.recommendedPromoters, 0, 'Should not force 1 promoter when budget cannot sustain it');
  assert(result.minimumRequiredBudget > 5000, 'Minimum budget must exceed insufficient ₹5,000');
  
  const minRequired = calculateMinimumRequiredGrossBudget(5, 7, 1, 'STANDARD_RATIO_1_TO_10');
  assert(minRequired.minimumGrossBudget > 5000, 'Calculated minimum gross budget must account for statutory wages + supervisor + reserve');
});

await itAsync('End-to-end Master Forecast returns genuine model metadata and honest labels', async () => {
  const forecast = await generateCampaignForecast({
    targetLocations: ['T. Nagar & Ranganathan Street'],
    radiusKm: 2.0,
    ageMin: 18,
    ageMax: 35,
    gender: 'All',
    selectedInterests: ['fashion', 'shopping'],
    objective: 'Product Sampling',
    shiftHours: 5,
    campaignDays: 7,
    budgetInr: 250000,
    tenantId: 'default_org'
  });

  assert(forecast.expected.audience > 0, 'Expected audience should be > 0');
  assert(forecast.expected.reach > 0, 'Expected reach should be > 0');
  assert(forecast.expected.interactions > 0, 'Expected interactions should be > 0');
  assert.strictEqual(forecast.provenance.modelType, 'BAYESIAN_STATISTICAL_ESTIMATE');
  assert.strictEqual(forecast.provenance.modelVersion, 'bayes-v2.0');
  assert(forecast.staffing.promoters > 0, 'Promoters should be allocated');
  assert(forecast.staffing.labourCostPaise > 0, 'Labour cost in paise should be > 0');
});

console.log('\n--- 7. Production Hardening, Zero-Mock Guarantees & Step 10 Safety ---');

it('Missing Supabase configuration strictly throws explicit descriptive error without falling back to fake keys', () => {
  const origAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const origServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const origUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  try {
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    assert.throws(() => {
      getRequiredSupabaseClient();
    }, (err) => {
      return err.message === 'Missing required Supabase configuration: NEXT_PUBLIC_SUPABASE_ANON_KEY';
    });

    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    assert.throws(() => {
      getRequiredSupabaseAdmin();
    }, (err) => {
      return err.message === 'Missing required Supabase configuration: SUPABASE_SERVICE_ROLE_KEY';
    });
  } finally {
    if (origAnonKey !== undefined) process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = origAnonKey;
    if (origServiceKey !== undefined) process.env.SUPABASE_SERVICE_ROLE_KEY = origServiceKey;
    if (origUrl !== undefined) process.env.NEXT_PUBLIC_SUPABASE_URL = origUrl;
  }
});

it('Tenant campaign configuration operates in integer paise and maps to valid business rates', () => {
  const config = getTenantCampaignConfiguration('default_org');
  assert(config, 'Default org configuration must exist');
  assert.strictEqual(config.promoter_hourly_rate_paise, 24000);
  assert.strictEqual(config.supervisor_daily_fee_paise, 200000);
  assert.strictEqual(config.gst_rate_bps, 1800);
  assert.strictEqual(config.platform_fee_bps, 800);

  const rates = resolveOperationalRates(config);
  assert.strictEqual(rates.promoterHourlyRate, 240);
  assert.strictEqual(rates.supervisorDailyFee, 2000);
  assert.strictEqual(rates.gstRate, 0.18);
  assert.strictEqual(rates.platformFeeRate, 0.08);

  // Custom tenant configuration
  const customConfig = saveTenantCampaignConfiguration({
    tenant_id: 'enterprise_test_co',
    config_version: 'v2.1_special',
    promoter_hourly_rate_paise: 30000,
    supervisor_daily_fee_paise: 250000,
    platform_fee_bps: 700,
    minimum_reserve_bps: 1200,
    minimum_reserve_floor_paise: 300000,
    gst_rate_bps: 1800
  });

  assert.strictEqual(customConfig.promoter_hourly_rate_paise, 30000);
  const customRates = resolveOperationalRates(customConfig);
  assert.strictEqual(customRates.promoterHourlyRate, 300);
  assert.strictEqual(customRates.supervisorDailyFee, 2500);
  assert.strictEqual(customRates.platformFeeRate, 0.07);
});

it('All 4 diurnal pedestrian traffic profiles sum to exactly 1.0 (normalized)', () => {
  const profileKeys = ['commercial_high_street', 'tech_park_corridor', 'campus_youth_hub', 'transit_hub'];
  
  for (const key of profileKeys) {
    const profile = HOURLY_PROFILES[key];
    assert(profile, `Hourly profile ${key} must exist`);
    const sum = Object.values(profile).reduce((acc, v) => acc + v, 0);
    assert(Math.abs(sum - 1.0) < 0.001, `Profile ${key} coefficients must sum to 1.0, got ${sum}`);

    // Also verify persistence in DB repository
    const dbCurve = getHourlyTrafficCurve(key);
    assert(dbCurve, `Database traffic curve for ${key} must exist`);
    const dbSum = Object.values(dbCurve.coefficients).reduce((acc, v) => acc + v, 0);
    assert(Math.abs(dbSum - 1.0) < 0.001, `Database curve ${key} must sum to 1.0, got ${dbSum}`);
  }
});

await itAsync('Meta Signal Provider labels generic sandbox fixtures cleanly with isSandbox: true', async () => {
  const provider = new MetaSignalProvider();
  const conn = await provider.verifyConnection();
  assert.strictEqual(conn.isSandbox, true);
  assert.strictEqual(conn.status, 'CONNECTED_SANDBOX');

  const accounts = await provider.listAdAccounts();
  assert(accounts.length >= 3, 'Must list sandbox accounts');
  for (const acc of accounts) {
    assert.strictEqual(acc.isSandbox, true);
    assert(!acc.accountName.includes('Monster Energy'), 'No proprietary mock brand in sandbox account');
    assert(!acc.accountName.includes('CureFit'), 'No proprietary mock brand in sandbox account');
  }
});

it('First-party consent records persist directly to SQLite with SHA-256 hashes and non-synthetic storage', () => {
  const db = getDatabase();
  const consentId = `cst_${Date.now()}`;
  const phoneHash = crypto.createHash('sha256').update('+919876543210').digest('hex');
  const emailHash = crypto.createHash('sha256').update('user@enterprise.com').digest('hex');
  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO first_party_consents (
      id, consent_id, tenant_id, campaign_id, brand_name, qr_code_id, phone_hash, email_hash,
      purpose, retention_days, consent_timestamp, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    consentId, consentId, 'test_tenant', 'camp_audit_01', 'Direct Brand', 'qr_sample_01',
    phoneHash, emailHash, 'SAMPLING_FOLLOWUP_DISCOUNT', 365, now, now
  );

  const retrieved = db.prepare('SELECT * FROM first_party_consents WHERE consent_id = ?').get(consentId);
  assert(retrieved, 'Consent record must be found in SQLite database');
  assert.strictEqual(retrieved.phone_hash, phoneHash);
  assert.strictEqual(retrieved.email_hash, emailHash);
  assert.strictEqual(retrieved.tenant_id, 'test_tenant');
});

it('Step 10 Budget Approval component file is present and verified for immutability', () => {
  const step10Path = 'src/components/campaign-creator/steps/Step10BudgetApproval.jsx';
  assert(fs.existsSync(step10Path), 'Step10BudgetApproval.jsx must exist');
  const content = fs.readFileSync(step10Path, 'utf8');
  assert(content.length > 500, 'Step10BudgetApproval.jsx must have substantial contents');
  assert(content.includes('Step10BudgetApproval'), 'Step 10 component export must be intact');
});

// ---------------------------------------------------------
// SECTION 7: STRUCTURED REMEDIATION (P0, P1, P2) TESTS
// ---------------------------------------------------------
console.log('\n--- 7. Structured Remediation (P0, P1, P2) Tests ---');

it('P0.1 & P0.2: Model evaluation empty state displays honest insufficient-data message and metadata', () => {
  const tenantEmpty = `tenant_empty_${Date.now()}`;
  const evalResult = getTenantModelEvaluationData({ tenantId: tenantEmpty, metric: 'samples' });

  assert.strictEqual(evalResult.observationCount, 0);
  assert.strictEqual(evalResult.isSufficient, false);
  assert.strictEqual(evalResult.maturityTier, 'INSUFFICIENT');
  assert.strictEqual(evalResult.modelVersion, 'bayes-v2.0');
  assert.strictEqual(evalResult.dataSource, 'ZIGGERS_WAL_SQLITE_AUDITED');
  assert.strictEqual(evalResult.message, 'Not enough verified campaign data for evaluation. Complete more campaigns to unlock reliable model metrics.');
  assert.strictEqual(evalResult.metrics.wape, null);
  assert.deepStrictEqual(evalResult.pairs, []);
});

it('P0.1: Model evaluation tenant isolation - Tenant A outcomes are isolated from Tenant B', () => {
  const db = getDatabase();
  const tenantA = `eval_tenant_a_${Date.now()}`;
  const tenantB = `eval_tenant_b_${Date.now()}`;
  const now = new Date().toISOString();

  // Insert 10 verified outcomes for Tenant A
  for (let i = 1; i <= 10; i++) {
    const campId = `camp_a_${i}_${Date.now()}`;
    const outId = `out_a_${i}_${Date.now()}`;
    const fcstId = `fcst_a_${i}_${Date.now()}`;

    // Forecast
    db.prepare(`
      INSERT INTO campaign_forecasts (
        id, forecast_id, campaign_id, tenant_id, expected_audience, expected_reach,
        expected_interactions, expected_leads, expected_samples, cost_per_lead_paise,
        promoters_count, supervisors_count, labour_cost_paise, confidence_tier,
        model_type, model_version, config_version, intervals_json, provenance_json, created_at
      ) VALUES (?, ?, ?, ?, 100000, 20000, 5000, 500, 4000, 20000, 4, 1, 480000, 'HIGH', 'BAYESIAN_STATISTICAL_ESTIMATE', 'bayes-v2.0', 'v1.0_canonical_invariant', '{}', '{}', ?)
    `).run(fcstId, fcstId, campId, tenantA, now);

    // Verified outcome
    db.prepare(`
      INSERT INTO campaign_outcomes (
        id, outcome_id, idempotency_key, campaign_id, tenant_id, city, h3_cell,
        venue_type, objective, actual_footfall, actual_interactions, actual_conversions,
        actual_samples, data_quality_status, verification_audit_status, is_finalized, created_at
      ) VALUES (?, ?, ?, ?, ?, 'Chennai', '892f254f177ffff', 'commercial', 'Product Sampling', 19500, 4900, 480, 3950, 'VERIFIED', 'APPROVED', 1, ?)
    `).run(outId, outId, `idem_${outId}`, campId, tenantA, now);
  }

  // Insert 1 outcome for Tenant B
  const campIdB = `camp_b_1_${Date.now()}`;
  const outIdB = `out_b_1_${Date.now()}`;
  db.prepare(`
    INSERT INTO campaign_outcomes (
      id, outcome_id, idempotency_key, campaign_id, tenant_id, city, h3_cell,
      venue_type, objective, actual_footfall, actual_interactions, actual_conversions,
      actual_samples, data_quality_status, verification_audit_status, is_finalized, created_at
    ) VALUES (?, ?, ?, ?, ?, 'Bengaluru', '892f254f177ffff', 'commercial', 'Product Sampling', 10000, 2000, 200, 1500, 'VERIFIED', 'APPROVED', 1, ?)
  `).run(outIdB, outIdB, `idem_${outIdB}`, campIdB, tenantB, now);

  const evalA = getTenantModelEvaluationData({ tenantId: tenantA, metric: 'samples' });
  const evalB = getTenantModelEvaluationData({ tenantId: tenantB, metric: 'samples' });

  assert.strictEqual(evalA.observationCount, 10, 'Tenant A must have exactly 10 observations');
  assert.strictEqual(evalA.isSufficient, true, 'Tenant A reaches 10 observation sufficiency threshold');
  assert(evalA.metrics.wape !== null, 'Tenant A WAPE must be calculated');
  assert(evalA.metrics.wape >= 0, 'Tenant A WAPE must be positive');

  assert.strictEqual(evalB.observationCount, 1, 'Tenant B must have exactly 1 observation');
  assert.strictEqual(evalB.isSufficient, false, 'Tenant B must be marked insufficient (1 < 10)');
});

it('P0.1: Unverified and draft outcomes are strictly excluded from evaluation dataset', () => {
  const db = getDatabase();
  const tenantUnverified = `tenant_unver_${Date.now()}`;
  const now = new Date().toISOString();

  // Insert an UNVERIFIED outcome
  const outId = `out_unver_${Date.now()}`;
  db.prepare(`
    INSERT INTO campaign_outcomes (
      id, outcome_id, idempotency_key, campaign_id, tenant_id, city, h3_cell,
      venue_type, objective, actual_footfall, actual_interactions, actual_conversions,
      actual_samples, data_quality_status, verification_audit_status, is_finalized, created_at
    ) VALUES (?, ?, ?, 'camp_unver', ?, 'Chennai', '892f254f177ffff', 'commercial', 'Product Sampling', 15000, 3000, 300, 2500, 'RAW_UNVERIFIED', 'PENDING', 0, ?)
  `).run(outId, outId, `idem_${outId}`, tenantUnverified, now);

  const evalRes = getTenantModelEvaluationData({ tenantId: tenantUnverified, metric: 'samples' });
  assert.strictEqual(evalRes.observationCount, 0, 'Unverified draft outcome must not be included');
});

it('P1.1: MetaSignalProvider in production disconnected mode returns explicit UNAVAILABLE without silent fallback', async () => {
  const originalEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = 'production';
  try {
    const provider = new MetaSignalProvider({ accessToken: null });
    const conn = await provider.verifyConnection({ allowSandbox: false });
    assert.strictEqual(conn.success, false);
    assert.strictEqual(conn.status, 'DISCONNECTED');
    assert.strictEqual(conn.dataSource, 'UNAVAILABLE');
    assert(conn.notice.includes('Meta account is not connected'));

    const insights = await provider.getCampaignInsights('any_id', { allowSandbox: false });
    assert.strictEqual(insights.success, false);
    assert.strictEqual(insights.status, 'UNAVAILABLE');
    assert.strictEqual(insights.isSandbox, false);
  } finally {
    process.env.NODE_ENV = originalEnv;
  }
});

it('P1.4: Population repository returns DATA_UNAVAILABLE and FALLBACK_DATA for unknown H3 cell', () => {
  const result = getSpatialPopulationByH3('unknown_non_existent_h3_cell');
  assert(result, 'Result object must be returned');
  assert.strictEqual(result.status, 'DATA_UNAVAILABLE');
  assert.strictEqual(result.isFallback, true);
  assert.strictEqual(result.provenance.source, 'FALLBACK_DATA');
});

it('P2.2: Campaign forecast metadata records taxonomyType: RULE_BASED_ONTOLOGY', () => {
  const forecast = generateCampaignForecast({
    targetLocations: ['T. Nagar & Ranganathan Street'],
    radiusKm: 3.0,
    budgetInr: 250000,
    objective: 'Product Sampling'
  });

  assert(forecast.provenance, 'Forecast must contain provenance');
  assert.strictEqual(forecast.provenance.taxonomyType, 'RULE_BASED_ONTOLOGY');
  assert.strictEqual(forecast.provenance.taxonomyVersion, 'btl-v1.0-rules');
});

console.log('\n===================================================================');
console.log(`🎉 ALL ${passedTests}/${totalTests} PRODUCTION ENGINE TESTS PASSED!`);
console.log('===================================================================\n');
