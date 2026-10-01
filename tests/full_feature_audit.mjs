/**
 * Ziggers Execute - Comprehensive Full-Feature System Audit & Verification
 * File: tests/full_feature_audit.mjs
 * 
 * Systematically tests every subsystem:
 * 1. Geospatial & H3 Engine
 * 2. Demographic Matching & Interest Affinity
 * 3. Diurnal Pedestrian Traffic & Exposure Funnel
 * 4. Staffing Optimizer & Integer Paise Finance Waterfall
 * 5. Bayesian Conversion Learning & Uncertainty Intervals
 * 6. 5-Signal Server-Side Verification & Anti-Spoofing
 * 7. Cryptographic SHA-256 Audit Chain & Tamper Detection
 * 8. External Data Library, Provenance & Non-Substitution
 * 9. Marketplace Ecosystem (Readiness, Requirements, Work Orders, Payouts)
 * 10. Live HTTP API Endpoints on Dev Server Port 3001
 * 11. Immutability Guarantee Check on Step 10
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Set required HMAC secret for audit attestation tests
process.env.AUDIT_HMAC_MASTER_SECRET = 'audit_secret_key_1234567890123456';

// Subsystem Imports
import { getDatabase } from '../src/lib/data/database.js';
import { getRecommendedResolution, getH3CellsForRadius, createGeodesicCirclePolygon, calculateHaversineDistanceMeters } from '../src/lib/intelligence/geo/h3Engine.js';
import { calculateAgeEligibility, calculateGenderAvailability } from '../src/lib/intelligence/audience/demographicMatcher.js';
import { calculateInterestAffinity } from '../src/lib/intelligence/audience/interestAffinityEngine.js';
import { estimateFootfallAndAudience } from '../src/lib/intelligence/footfall/footfallEstimator.js';
import { calculateTimeWindowExposure } from '../src/lib/intelligence/footfall/timeDistribution.js';
import { calculatePhysicalFunnel } from '../src/lib/intelligence/forecast/exposureForecast.js';
import { forecastConversions } from '../src/lib/intelligence/forecast/conversionForecast.js';
import { calculateForecastRange } from '../src/lib/intelligence/forecast/uncertaintyEngine.js';
import { optimizeStaffing, solveDiscreteStaffingOptimization, getRequiredSupervisors } from '../src/lib/intelligence/capacity/staffingOptimizer.js';
import { calculateGstBreakdown } from '../src/lib/intelligence/finance/gstCalculator.js';
import { allocateCampaignEscrow, allocateActualCampaignEscrow, calculateWorkerShiftPayout } from '../src/lib/intelligence/finance/campaignAllocator.js';
import { validateGeofenceCheckin } from '../src/lib/intelligence/verification/geofenceValidator.js';
import { createChainedAuditProof, computeBatchMerkleRoot, canonicalizeJson, sha256 } from '../src/lib/intelligence/verification/proofHashChain.js';
import { updateBetaBinomialRate, betaQuantile } from '../src/lib/intelligence/learning/bayesianEngine.js';
import { calculateAudienceQualityScore, calculateCampaignSuitabilityScore } from '../src/lib/intelligence/ranking/campaignScoring.js';
import { calculateScheduleMetrics, validateCampaignSchedule } from '../src/lib/intelligence/schedule/scheduleEngine.js';
import { generateCampaignForecast, rankLocations } from '../src/lib/intelligence/index.js';
import { getAllDataSources, getMarketContextForStateOrCity, getTransitContextForCity, getVenuesByLocation, getDataLibrarySummary } from '../src/lib/data/repositories/dataLibraryRepository.js';
import { evaluateCampaignReadiness } from '../src/lib/marketplace/readinessEngine.js';
import { generateCampaignRequirements } from '../src/lib/marketplace/requirementsEngine.js';
import { issueWorkOrder } from '../src/lib/marketplace/workOrderEngine.js';

describe('Ziggers Execute - Complete Feature Matrix Audit', () => {
  const db = getDatabase();

  // --- 1. Geospatial & H3 Engine ---
  it('FEATURE-01: Geospatial & H3 Engine functions correctly', () => {
    assert.equal(getRecommendedResolution(0.5), 10);
    assert.equal(getRecommendedResolution(2.0), 9);
    assert.equal(getRecommendedResolution(8.0), 8);

    const cells = getH3CellsForRadius(13.0827, 80.2707, 2.0, 9);
    assert.ok(cells.length > 0, 'Should generate H3 cells');
    assert.ok(cells[0].h3Index, 'Cell should have valid H3 index');
    assert.ok(cells[0].overlapWeight > 0 && cells[0].overlapWeight <= 1.0);

    const dist = calculateHaversineDistanceMeters(13.0827, 80.2707, 13.0837, 80.2707);
    assert.ok(dist > 100 && dist < 120, `Distance should be ~111m, got ${dist}`);
  });

  // --- 2. Demographic Matching & Interest Affinity ---
  it('FEATURE-02: Demographic Matcher & Interest Affinity Engine calculate exact bounds', () => {
    const ageDist = { '18-24': 0.20, '25-34': 0.30, '35-44': 0.21, '45-54': 0.10, '55-64': 0.05, '65+': 0.03 };
    const ageRes = calculateAgeEligibility(18, 34, ageDist);
    assert.ok(Math.abs(ageRes.ageEligibilityRatio - 0.50) < 0.01, '18-34 eligibility should equal 0.50');

    const genderRes = calculateGenderAvailability('Male', { male: 0.52, female: 0.48 });
    assert.equal(genderRes.genderAvailabilityRatio, 0.52);

    const affinity = calculateInterestAffinity(['fitness', 'foodies'], { gym: 12, restaurant: 45, cafe: 20 });
    assert.ok(affinity.weightedAffinityScore >= 0.50 && affinity.weightedAffinityScore <= 0.98);
  });

  // --- 3. Diurnal Pedestrian Traffic & Exposure Funnel ---
  it('FEATURE-03: Diurnal Pedestrian Traffic & Physical Exposure Funnel enforce physics', () => {
    const timeExp = calculateTimeWindowExposure('commercial_high_street', 16, 5);
    assert.ok(timeExp.activeHourFraction > 0.20 && timeExp.activeHourFraction < 0.60);
    assert.ok(timeExp.peakHour.includes('PM'), 'Peak hour should format in 12h PM');
    assert.ok(timeExp.operatingWindow.includes('4:00 PM'));

    // Funnel bottleneck test
    const funnel = calculatePhysicalFunnel({
      shiftFootfallExposure: 20000,
      ageEligibilityRatio: 0.50,
      genderAvailabilityRatio: 0.80,
      weightedInterestAffinity: 0.60,
      campaignDays: 3,
      physicalCapacity: 500
    });

    assert.ok(funnel.totalCampaignReach > 0);
    // Interactions bottlenecked by promoter physical capacity
    assert.ok(funnel.interactions.expected <= 500, 'Interactions must strictly respect physical capacity limit');
  });

  // --- 4. Staffing Optimizer & Integer Paise Finance Waterfall ---
  it('FEATURE-04: Staffing Optimizer & Integer Paise Escrow Waterfall reconcile to zero paise leak', () => {
    const grossBudget = 118000;
    const gstBreakdown = calculateGstBreakdown(grossBudget, true);
    assert.equal(gstBreakdown.taxableBase, 100000);
    assert.equal(gstBreakdown.gstAmount, 18000);
    assert.equal(gstBreakdown.cgst, 9000);
    assert.equal(gstBreakdown.sgst, 9000);

    const escrow = allocateCampaignEscrow(grossBudget, true);
    assert.equal(escrow.escrowWaterfall.reconciliationCheck, true, 'Escrow waterfall must reconcile 100%');
    assert.equal(
      escrow.escrowWaterfall.promoterWagePool +
      escrow.escrowWaterfall.supervisorLeadFee +
      escrow.escrowWaterfall.platformOsFee +
      escrow.escrowWaterfall.instantEscrowReserve,
      escrow.netCampaignFund,
      'Paise allocations must equal net campaign fund exactly'
    );

    // Supervisor stepping ratio
    assert.equal(getRequiredSupervisors(5), 1);
    assert.equal(getRequiredSupervisors(10), 1);
    assert.equal(getRequiredSupervisors(11), 2);
    assert.equal(getRequiredSupervisors(21), 3);
  });

  // --- 5. Bayesian Conversion Learning & Uncertainty Engine ---
  it('FEATURE-05: Bayesian Engine updates posteriors and generates bounded credible intervals', () => {
    const result = updateBetaBinomialRate({
      metricKey: 'landing_to_lead_rate',
      successCount: 15,
      opportunityCount: 50,
      priorMean: 0.10,
      customPriorN0: 20
    });

    assert.ok(result.posterior.posteriorMean > 0.10, 'Posterior mean should rise with 30% sample success rate');
    assert.ok(result.posterior.credibleInterval95[0] < result.posterior.posteriorMean);
    assert.ok(result.posterior.credibleInterval95[1] > result.posterior.posteriorMean);

    const range = calculateForecastRange(1000, { confidenceScore: 0.85, historicalSampleCount: 10 });
    assert.ok(range.lower < 1000);
    assert.ok(range.upper > 1000);
    assert.ok(range.lower < range.upper);
  });

  // --- 6. 5-Signal Server-Side Verification ---
  it('FEATURE-06: 5-Signal Check-in Verification rejects anomalies and approves valid worker shifts', () => {
    const target = { targetLat: 13.0827, targetLng: 80.2707 };

    // Valid checkin within 20m
    const valid = validateGeofenceCheckin({ ...target, actualLat: 13.0828, actualLng: 80.2707, gpsAccuracyMeters: 10 });
    assert.equal(valid.isWithinGeofence, true);

    // Signal 1: Geofence violation (150m away)
    const outOfFence = validateGeofenceCheckin({ ...target, actualLat: 13.0845, actualLng: 80.2707, gpsAccuracyMeters: 10 });
    assert.equal(outOfFence.isWithinGeofence, false);

    // Signal 2: Mock location spoofing
    const mockSpoof = validateGeofenceCheckin({ ...target, actualLat: 13.0827, actualLng: 80.2707, isMockGpsDetected: true });
    assert.equal(mockSpoof.isWithinGeofence, false);
    assert.equal(mockSpoof.verificationStatus, 'REJECTED_MOCK_LOCATION');

    // Signal 3: GPS inaccuracy (> 50m)
    const badGps = validateGeofenceCheckin({ ...target, actualLat: 13.0827, actualLng: 80.2707, gpsAccuracyMeters: 65 });
    assert.equal(badGps.isWithinGeofence, false);
    assert.equal(badGps.verificationStatus, 'REJECTED_LOW_ACCURACY_DRIFT');

    // Signal 4: Kinematic teleportation (Mumbai to Chennai in 5 minutes)
    const teleport = validateGeofenceCheckin({
      ...target,
      actualLat: 19.0760, actualLng: 72.8777,
      lastCheckinLat: 13.0827, lastCheckinLng: 80.2707,
      lastCheckinTime: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      gpsAccuracyMeters: 10
    });
    assert.equal(teleport.isWithinGeofence, false);
    assert.equal(teleport.verificationStatus, 'FLAGGED_TELEPORTATION_ANOMALY');
  });

  // --- 7. Cryptographic Proof Chain & Merkle Tree ---
  it('FEATURE-07: Cryptographic Proof Chain detects data mutations and builds Merkle tree', async () => {
    const proof1 = await createChainedAuditProof({ workerId: 'w1', shiftId: 's1', lat: 13.08 }, '0000000000000000');
    assert.ok(proof1.cryptoHash);
    assert.equal(proof1.previousHash, '0000000000000000');

    const proof2 = await createChainedAuditProof({ workerId: 'w2', shiftId: 's2', lat: 13.09 }, proof1.cryptoHash);
    assert.equal(proof2.previousHash, proof1.cryptoHash);

    // Merkle tree stability
    const root1 = await computeBatchMerkleRoot([proof1.cryptoHash, proof2.cryptoHash]);
    const root2 = await computeBatchMerkleRoot([proof1.cryptoHash, proof2.cryptoHash]);
    assert.equal(root1.merkleRoot, root2.merkleRoot, 'Merkle root must be deterministic and identical');

    // Mutation detection
    const tamperedHash = await sha256('tampered_proof');
    const mutated = await computeBatchMerkleRoot([proof1.cryptoHash, tamperedHash]);
    assert.notEqual(root1.merkleRoot, mutated.merkleRoot, 'Merkle root must change upon data modification');
  });

  // --- 8. External Data Package, Provenance & Non-Substitution ---
  it('FEATURE-08: External Data Package preserves exact source facts and prevents substitution', () => {
    const summary = getDataLibrarySummary();
    assert.ok(summary.dataSourcesCount >= 9);
    assert.ok(summary.marketContextCount >= 74);
    assert.ok(summary.transitObservationsCount >= 11);
    assert.ok(summary.venueDirectoryCount >= 8);

    // Discrepancy preservation
    const haryana = getMarketContextForStateOrCity('Haryana');
    assert.equal(haryana.urban.value, 8427, 'Haryana Urban MPCE must be 8427 from Table 1');

    // Missing value integrity: campus footfall must be NULL
    const venues = getVenuesByLocation('Chennai');
    assert.ok(venues.length > 0);
    assert.strictEqual(venues[0].footfall, null, 'Campus footfall must be explicitly NULL, not 0');

    // Full forecast non-substitution check
    const forecast = generateCampaignForecast({
      targetLocations: ['T. Nagar & Ranganathan Street'],
      budgetInr: 250000,
      campaignDays: 7,
      shiftHours: 5,
      objective: 'Product Sampling'
    });

    assert.ok(forecast.estimatedReach > 0);
    assert.ok(forecast.evidenceContext, 'Evidence context must be attached');
    assert.equal(forecast.evidenceContext.marketContext.urban.value, 8165); // Tamil Nadu Table 1
    assert.ok(forecast.footfall.shiftFootfallExposure < 8000000, 'Footfall must never adopt 8.46M transit total');
  });

  // --- 9. Marketplace Ecosystem ---
  it('FEATURE-09: Marketplace Readiness, Requirements, Work Orders & Payouts execute seamlessly', () => {
    // Readiness Gate
    const blocked = evaluateCampaignReadiness({ isVenuePermissionApproved: false });
    assert.equal(blocked.isExecutable, false);

    const ready = evaluateCampaignReadiness({
      isVenuePermissionApproved: true,
      isMinimumStaffConfirmed: true,
      isMaterialsDelivered: true,
      areCriticalWorkOrdersAccepted: true,
      staffCount: 5,
      requiredStaff: 5,
      isSupervisorAssigned: true
    });
    assert.equal(ready.isExecutable, true);

    // Requirements Generator
    const reqs = generateCampaignRequirements({ objective: 'Product Sampling', campaignDays: 3, promoterCount: 6 });
    assert.ok(reqs.totalItems > 0);
    assert.ok(reqs.itemsByCategory.MANPOWER.length > 0);

    // Work Order Issuance
    const wo = issueWorkOrder({
      id: 'quote_test_01',
      vendorId: 'v_chennai_01',
      vendorName: 'Apex Activations Chennai',
      totalAmountInr: 59000,
      unitRateInr: 590,
      quantity: 100,
      campaignId: 'camp_001'
    });
    assert.equal(wo.status, 'ISSUED');
    assert.equal(wo.milestones.reduce((s, m) => s + m.percentage, 0), 100);

    // Worker Shift Payout
    const payout = calculateWorkerShiftPayout({
      shiftHours: 5,
      attendanceScore: 1.0,
      verifiedSamplesDelivered: 120,
      targetSamples: 100,
      supervisorApproval: true
    });
    assert.equal(payout.payoutApproved, true);
    assert.ok(payout.disbursedAmount > 0);
    assert.ok(payout.performanceIncentive > 0);
  });

  // --- 10. Live HTTP API Endpoints ---
  it('FEATURE-10: Live HTTP API Endpoints respond with HTTP 200 OK', async () => {
    const port = process.env.PORT || 3000;
    const baseUrl = `http://127.0.0.1:${port}`;

    // 1. Data Library Summary
    const summaryRes = await fetch(`${baseUrl}/api/data-library?action=summary`);
    assert.equal(summaryRes.status, 200);
    const summaryData = await summaryRes.json();
    assert.equal(summaryData.success, true);
    assert.ok(summaryData.totals.sourcesCount >= 9);

    // 2. Data Library Market Context
    const marketRes = await fetch(`${baseUrl}/api/data-library?action=market&state=Tamil%20Nadu`);
    assert.equal(marketRes.status, 200);
    const marketData = await marketRes.json();
    assert.equal(marketData.marketContext.urban.value, 8165);

    // 3. Data Library Transit Context
    const transitRes = await fetch(`${baseUrl}/api/data-library?action=transit&city=Chennai`);
    assert.equal(transitRes.status, 200);
    const transitData = await transitRes.json();
    assert.equal(transitData.transitContext.city, 'Chennai');

    // 4. Intelligence Forecast Endpoint
    const forecastRes = await fetch(`${baseUrl}/api/intelligence/forecast`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        targetLocations: ['T. Nagar & Ranganathan Street'],
        budgetInr: 250000,
        campaignDays: 5,
        shiftHours: 5,
        objective: 'Product Sampling'
      })
    });
    assert.equal(forecastRes.status, 200);
    const forecastData = await forecastRes.json();
    assert.equal(forecastData.success, true);
    assert.ok(forecastData.forecast.estimatedReach > 0);
    assert.ok(forecastData.forecast.evidenceContext);

    // 5. Locations Search Endpoint
    const searchRes = await fetch(`${baseUrl}/api/locations/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: 'Phoenix Marketcity', city: 'Chennai' })
    });
    assert.equal(searchRes.status, 200);
    const searchData = await searchRes.json();
    assert.equal(searchData.success, true);
    assert.ok(searchData.places.length > 0);

    // 6. Locations Discover Endpoint
    const discoverRes = await fetch(`${baseUrl}/api/locations/discover`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lat: 13.0827, lng: 80.2707, radiusMeters: 2000, type: 'commercial' })
    });
    assert.equal(discoverRes.status, 200);
    const discoverData = await discoverRes.json();
    assert.equal(discoverData.success, true);
    assert.ok(discoverData.places.length > 0);
  });

  // --- 11. Immutability Guarantee Check on Step 10 ---
  it('FEATURE-11: Step 10 Budget Approval remains 100% untouched', () => {
    const diff = execSync('git diff -- src/components/campaign-creator/steps/Step10BudgetApproval.jsx', {
      cwd: projectRoot,
      encoding: 'utf8'
    });
    assert.equal(diff.trim(), '', 'Step 10 Budget Approval must have zero lines of git diff');
  });
});
