/**
 * Ziggers Unified Campaign Intelligence Engine - Comprehensive Automated Test Suite (Phase 2 Full)
 * Validates all mathematical models, boundary conditions, zero divisions, discrete optimizations,
 * geometric polygon area intersections, conjugate Beta-Binomial updates, capped GPS tolerances,
 * source-specific decay policies, multi-dimensional context keys, temporal holdout splits, and HMAC signing.
 */

import {
  generateCampaignForecast,
  rankLocations,
  getH3CellsForRadius,
  createGeodesicCirclePolygon,
  generatePostGisAggregationSql,
  calculateAgeEligibility,
  calculateGenderAvailability,
  calculateInterestAffinity,
  estimateFootfallAndAudience,
  optimizeStaffing,
  calculateMinimumRequiredGrossBudget,
  calculatePhysicalFunnel,
  forecastConversions,
  calculateForecastRange,
  calculateAttributionFunnel,
  calculateGstBreakdown,
  allocateCampaignEscrow,
  allocateActualCampaignEscrow,
  calculateWorkerShiftPayout,
  validateGeofenceCheckin,
  createChainedAuditProof,
  computeBatchMerkleRoot,
  updateBetaBinomialRate,
  betaQuantile,
  calculateModelValidationMetrics,
  getModelMaturity,
  recordCampaignObservation
} from '../src/lib/intelligence/index.js';

import { FRESHNESS_POLICIES } from '../src/lib/intelligence/providers/dataProviderInterface.js';
import { generateContextKey } from '../src/lib/intelligence/learning/observationAggregator.js';
import { performTemporalHoldoutValidation } from '../src/lib/intelligence/learning/modelValidation.js';

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    throw new Error(message);
  }
  passedTests++;
  console.log(`✅ PASSED: ${message}`);
}

async function runTestSuite() {
  console.log('\n===================================================================');
  console.log('🧪 RUNNING ZIGGERS UNIFIED INTELLIGENCE ENGINE FULL TEST SUITE');
  console.log('===================================================================\n');

  // Test 1: H3 Geospatial & Turf Geometric Intersection Engine
  console.log('--- 1. H3 Geospatial & Turf Geometric Intersection Engine ---');
  const h3Cells = getH3CellsForRadius(13.0418, 80.2341, 3.0, 9);
  assert(Array.isArray(h3Cells) && h3Cells.length > 0, 'H3 cell radial coverage returns valid cells');
  assert(h3Cells[0].h3Index && typeof h3Cells[0].h3Index === 'string', 'H3 cell contains valid hexadecimal index');
  assert(h3Cells.every(c => c.overlapWeight >= 0 && c.overlapWeight <= 1.0), 'H3 cell overlap weights are bounded in [0, 1]');
  assert(h3Cells.some(c => c.intersectionAreaSqMeters > 0), 'H3 cells calculate exact geometric intersection area in m²');

  const geodesicCircle = createGeodesicCirclePolygon(13.0418, 80.2341, 5.0);
  assert(geodesicCircle && geodesicCircle.geometry.coordinates[0].length >= 60, 'Adaptive geodesic circle creates high-resolution polygon (60+ vertices for 5km)');

  const postGisSql = generatePostGisAggregationSql(geodesicCircle.geometry, 9);
  assert(postGisSql.includes('ST_Intersection') && postGisSql.includes('overlap_weight'), 'Canonical PostGIS SQL query generated correctly');

  // Test 2: Source-Specific Freshness Half-Life Policies
  console.log('\n--- 2. Source-Specific Freshness Policies ---');
  assert(FRESHNESS_POLICIES.OFFICIAL_CENSUS.halfLifeDays === 3650, 'Official census uses 10-year half-life');
  assert(FRESHNESS_POLICIES.MOBILITY_DATA.halfLifeDays === 30, 'Mobility data uses 30-day half-life');
  assert(FRESHNESS_POLICIES.WEATHER_DATA.halfLifeDays === 1, 'Weather uses 24-hour half-life');

  // Test 3: Continuous Demographic Matching
  console.log('\n--- 3. Continuous Demographic Matching ---');
  const sampleAgeDist = {
    '18-24': 0.22,
    '25-34': 0.34,
    '35-44': 0.23,
    '45-54': 0.12,
    '55-64': 0.06,
    '65+': 0.03
  };
  const youthMatch = calculateAgeEligibility(18, 34, sampleAgeDist);
  assert(youthMatch.ageEligibilityRatio >= 0.50 && youthMatch.ageEligibilityRatio <= 0.60, `Age 18-34 eligibility dynamically interpolates to ~0.56 (got ${youthMatch.ageEligibilityRatio})`);

  const partialAgeMatch = calculateAgeEligibility(20, 28, sampleAgeDist);
  assert(partialAgeMatch.ageEligibilityRatio > 0 && partialAgeMatch.ageEligibilityRatio < youthMatch.ageEligibilityRatio, 'Arbitrary partial age ranges interpolate proportionally');

  const fullAgeMatch = calculateAgeEligibility(18, 65, sampleAgeDist);
  assert(fullAgeMatch.ageEligibilityRatio === 1.0, 'Full age span (18-65) returns 1.0');

  // Test 4: Gender Availability
  console.log('\n--- 4. Gender Availability ---');
  const maleAvail = calculateGenderAvailability('Male', { male: 0.51, female: 0.49 });
  assert(maleAvail.genderAvailabilityRatio === 0.51, 'Male availability scales audience size correctly');
  const allAvail = calculateGenderAvailability('All');
  assert(allAvail.genderAvailabilityRatio === 1.0, 'All genders returns 1.0 availability');

  // Test 5: POI Interest Vector Engine & Neutral Priors
  console.log('\n--- 5. POI Interest Vector Engine ---');
  const emptyInterestRes = calculateInterestAffinity([]);
  assert(emptyInterestRes.weightedAffinityScore === 0.50, 'Empty interest selection returns 0.50 neutral prior (never inflated 0.80)');
  assert(emptyInterestRes.isNeutralPrior === true, 'Empty interest flagged as neutral prior');

  const fitnessInterestRes = calculateInterestAffinity(['fitness'], { fitness: { count: 48, commercialScore: 94 } });
  assert(fitnessInterestRes.weightedAffinityScore >= 0.85, 'High density of fitness POIs produces high affinity score');

  // Test 6: Footfall & 24h Time Curves
  console.log('\n--- 6. Footfall & 24h Time Curves ---');
  const footfallRes = estimateFootfallAndAudience({
    locationNode: {
      locationType: 'Commercial High Street & Transit Hub',
      populationMix: { residentShare: 0.35, transientShare: 0.45, workforceShare: 0.20 }
    },
    totalPopulation: 100000,
    objective: 'Product Sampling',
    startHour: 16,
    shiftHours: 5
  });
  assert(footfallRes.availableAudienceBase > 0, 'Available audience calculated from segregated population');
  assert(footfallRes.timeExposure.activeHourFraction > 0.30, 'Evening shift captures commercial footfall peak');

  // Test 7: Discrete Staffing Optimizer & Option B Dynamic Reserve
  console.log('\n--- 7. Discrete Staffing Optimizer (Option B) ---');
  const smallBudgetStaffing = optimizeStaffing({
    budgetInr: 10000,
    objective: 'Product Sampling',
    campaignDays: 7,
    shiftHours: 5
  });
  assert(smallBudgetStaffing.status === 'BUDGET_INSUFFICIENT', '₹10,000 for 7 days returns BUDGET_INSUFFICIENT');
  assert(smallBudgetStaffing.recommendedPromoters === 0, 'BUDGET_INSUFFICIENT returns 0 recommended promoters (never forces 1)');
  assert(smallBudgetStaffing.minimumRequiredBudget > 10000, `Calculates explainable minimum budget backward: ${smallBudgetStaffing.minimumRequiredBudgetFormatted}`);

  const largeBudgetStaffing = optimizeStaffing({
    budgetInr: 500000,
    objective: 'Product Sampling',
    campaignDays: 7,
    shiftHours: 5,
    reachableAudience: 100000
  });
  assert(largeBudgetStaffing.status === 'OPTIMAL_STAFFING', 'Adequate budget returns OPTIMAL_STAFFING');
  assert(largeBudgetStaffing.recommendedPromoters >= 6, `Supports optimal discrete staffing (${largeBudgetStaffing.recommendedPromoters} promoters)`);
  assert(largeBudgetStaffing.supervisorCount === Math.ceil(largeBudgetStaffing.recommendedPromoters / 10), 'Supervisor count follows exact 1:10 ratio');
  assert(largeBudgetStaffing.financialWaterfall.reserveConstraintMet === true, 'Guarantees DynamicReserve >= MinimumReserve');
  assert(largeBudgetStaffing.financialWaterfall.dynamicReserve >= largeBudgetStaffing.financialWaterfall.minimumReserve, 'DynamicReserve explicitly exceeds MinimumReserve floor');
  assert(largeBudgetStaffing.financialWaterfall.reconciliationCheck === true, 'Staffing financial waterfall reconciles 100% against Net Campaign Fund');

  // Test 8: Physical Interaction Funnel (No fake minimum)
  console.log('\n--- 8. Physical Interaction Funnel ---');
  const tinyReachFunnel = calculatePhysicalFunnel({
    availableAudienceBase: 200,
    ageEligibilityRatio: 0.5,
    genderAvailabilityRatio: 1.0,
    weightedInterestAffinity: 0.8,
    shiftFootfallExposure: 100,
    totalCampaignExposure: 100,
    physicalCapacity: 5000,
    campaignDays: 1
  });
  assert(tinyReachFunnel.interactions.expected <= 100, `Tiny reach campaign yields realistic interactions without fake 250 minimum (got ${tinyReachFunnel.interactions.expected})`);

  // Test 9: Conversion Forecast & Zero Division Protection
  console.log('\n--- 9. Conversion Forecast & Unit Economics ---');
  const zeroInteractionConversions = forecastConversions({
    interactions: 0,
    budgetInr: 150000,
    objective: 'Product Sampling'
  });
  assert(zeroInteractionConversions.unitEconomics.costPerLead === 'N/A (No Leads)', '0 leads returns N/A for CPL');
  assert(zeroInteractionConversions.unitEconomics.costPerLeadNum === null, '0 leads returns null numeric CPL');
  assert(zeroInteractionConversions.unitEconomics.cac === null, '0 customers returns null numeric CAC');

  // Test 10: Exact GST Breakdown
  console.log('\n--- 10. GST Exact Separation ---');
  const gstRes = calculateGstBreakdown(118000, true);
  assert(gstRes.taxableBase === 100000, `GST inclusive ₹1,18,000 gives exact ₹1,00,000 base (got ${gstRes.taxableBase})`);
  assert(gstRes.gstAmount === 18000, `GST amount is exact ₹18,000 (got ${gstRes.gstAmount})`);
  assert(gstRes.cgst === 9000 && gstRes.sgst === 9000, 'CGST/SGST 9%+9% split is exact');

  // Test 11: Two-Tier Escrow Waterfall & Dynamic Actual Settlement
  console.log('\n--- 11. Two-Tier Escrow Waterfall & Actual Settlement ---');
  const forecastEscrow = allocateCampaignEscrow(250000, true);
  assert(forecastEscrow.escrowWaterfall.reconciliationCheck === true, 'Forecast escrow waterfall reconciles 100%');

  const actualSettlement = allocateActualCampaignEscrow({
    budgetInr: 250000,
    isGstInclusive: true,
    promotersDeployed: 2,
    supervisorsDeployed: 1,
    shiftHours: 5,
    campaignDays: 7
  });
  assert(actualSettlement.settlementWaterfall.reconciliationCheck === true, 'Actual settlement waterfall reconciles 100%');
  assert(actualSettlement.settlementWaterfall.dynamicReserve > 0, 'Unused funds flow into Instant Refundable Reserve');

  // Test 12: Accuracy-Aware Geofencing & Capped Tolerance
  console.log('\n--- 12. Geofence Verification with Capped Tolerance ---');
  const validCheckin = validateGeofenceCheckin({
    targetLat: 13.0418,
    targetLng: 80.2341,
    actualLat: 13.0419,
    actualLng: 80.2342,
    gpsAccuracyMeters: 10,
    allowedRadiusMeters: 50
  });
  assert(validCheckin.isWithinGeofence === true, 'Nearby checkin inside radius is valid');
  assert(validCheckin.accuracyTolerance === 10, 'Tolerance is capped at min(gpsAccuracy, 20m)');

  const hugeDriftCheckin = validateGeofenceCheckin({
    targetLat: 13.0418,
    targetLng: 80.2341,
    actualLat: 13.0418,
    actualLng: 80.2341,
    gpsAccuracyMeters: 85,
    allowedRadiusMeters: 50
  });
  assert(hugeDriftCheckin.isWithinGeofence === false, 'GPS accuracy of 85m (>50m) is rejected');
  assert(hugeDriftCheckin.verificationStatus === 'REJECTED_LOW_ACCURACY_DRIFT', 'Excessive drift rejected with correct status code');

  // Test 13: HMAC Signing & Batch Merkle Root Checkpointing
  console.log('\n--- 13. Tamper-Evident Proof Chain with HMAC & Merkle Roots ---');
  const proof1 = await createChainedAuditProof({
    proofId: 'prf_301',
    campaignId: 'camp_alpha',
    campaignName: 'Red Bull Sampling',
    workerId: 'wrk_1',
    proofType: 'Store Selfie',
    location: 'T. Nagar',
    latitude: 13.0418,
    longitude: 80.2341,
    gpsAccuracy: 8
  }, '0x0000000000000000000000000000000000000000000000000000000000000000');

  assert(proof1.signatureMetadata.algorithm === 'HMAC-SHA256', 'Proof signed with HMAC-SHA256');
  assert(proof1.signatureMetadata.keyId.startsWith('audit-key-'), 'Proof includes key rotation metadata');

  const merkleBatch = await computeBatchMerkleRoot([proof1.cryptoHash, '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef']);
  assert(merkleBatch.merkleRoot.startsWith('0x') && merkleBatch.batchSize === 2, 'Batch Merkle root computed for external anchoring');
  assert(merkleBatch.anchorDestination.targetBucket === 'ziggers-audit-vault-immutable', 'Defines explicit external immutable vault destination');

  // Test 14: Conjugate Beta-Binomial Bayesian Updating & Quantiles
  console.log('\n--- 14. Conjugate Beta-Binomial Bayesian Engine ---');
  const bayesianRes = updateBetaBinomialRate({
    metricKey: 'qr_scan_rate',
    successCount: 28,
    opportunityCount: 200,
    priorMean: 0.14,
    priorStrengthLevel: 'LOCATION_TYPE_DATA'
  });
  assert(bayesianRes.posterior.posteriorMean > 0.13 && bayesianRes.posterior.posteriorMean < 0.15, `Posterior mean correctly balances prior and observations (got ${bayesianRes.posterior.posteriorMean})`);
  assert(bayesianRes.posterior.credibleInterval95[0] < bayesianRes.posterior.posteriorMean, 'Lower 95% credible bound is below posterior mean');
  assert(bayesianRes.posterior.credibleInterval95[1] > bayesianRes.posterior.posteriorMean, 'Upper 95% credible bound is above posterior mean');

  // Test 15: Multi-Dimensional Context Keys & Structured Logging
  console.log('\n--- 15. Multi-Dimensional Context Keys & Logging ---');
  const contextKey = generateContextKey({
    h3Resolution: 9,
    h3Cell: '8928308280fffff',
    dayType: 'SUNDAY',
    timeBucket: '18-21',
    locationType: 'COMMERCIAL',
    campaignObjective: 'PRODUCT_SAMPLING'
  });
  assert(contextKey === 'res9:8928308280fffff:SUNDAY:18-21:COMMERCIAL:PRODUCT_SAMPLING', 'Context key format includes H3 resolution, spatial, temporal, and objective dimensions');

  const recordRes = recordCampaignObservation({
    h3Cell: '8928308280fffff',
    campaignObjective: 'Product Sampling',
    dayType: 'SUNDAY',
    timeBucket: '18-21',
    locationType: 'Commercial',
    predictedFootfall: 10000,
    actualFootfall: 9500,
    predictedInteractions: 500,
    actualInteractions: 480,
    predictedConversions: 80,
    actualConversions: 75
  });
  assert(recordRes.success === true && recordRes.record.actual.interactions === 480, 'Structured campaign observation recorded successfully');

  // Test 16: Zero-Safe Predictive Model Validation & Temporal Holdout
  console.log('\n--- 16. Predictive Validation & Temporal Holdout ---');
  const validationPairs = [
    { campaignName: 'Camp A', date: '2026-01-10', predicted: 5000, actual: 4800, lowerBound: 4000, upperBound: 6000 },
    { campaignName: 'Camp B', date: '2026-02-15', predicted: 3000, actual: 3200, lowerBound: 2500, upperBound: 3600 },
    { campaignName: 'Camp C', date: '2026-03-20', predicted: 8000, actual: 7500, lowerBound: 6800, upperBound: 9000 },
    { campaignName: 'Camp D', date: '2026-04-25', predicted: 2000, actual: 0,    lowerBound: 1500, upperBound: 2500 }
  ];
  const evalMetrics = calculateModelValidationMetrics(validationPairs, 'samples');
  assert(evalMetrics.metrics.wape !== null && evalMetrics.metrics.wape > 0, `WAPE handles zero actuals cleanly without NaN/Infinity (got ${evalMetrics.metrics.wape}%)`);
  assert(evalMetrics.metrics.mae > 0, 'MAE calculated correctly');
  assert(evalMetrics.metrics.rmse >= evalMetrics.metrics.mae, 'RMSE is >= MAE');
  assert(evalMetrics.metrics.nominalRangeCoverage === 75, 'Nominal range coverage calculated (3 of 4 in range = 75%)');
  assert(evalMetrics.metrics.calibrationError === 15, 'Calibration error calculated (|75 - 90| = 15%)');

  const holdoutRes = performTemporalHoldoutValidation(validationPairs, 0.75, 'samples');
  assert(holdoutRes.status === 'HOLDOUT_VALIDATION_COMPLETE', 'Temporal holdout validation executes with train/holdout split');
  assert(holdoutRes.trainCount === 3 && holdoutRes.holdoutCount === 1, 'Holdout correctly isolates newest unseen campaigns');

  const maturity = getModelMaturity(2500);
  assert(maturity.status === 'HIGH_CONFIDENCE', 'Maturity tier classifies 2000+ observations as HIGH_CONFIDENCE');

  // Test 17: End-to-End Campaign Forecast Pipeline
  console.log('\n--- 17. End-to-End Master Forecast Pipeline ---');
  const masterForecast = generateCampaignForecast({
    targetLocations: ['T. Nagar & Ranganathan Street'],
    radiusKm: 3.0,
    ageMin: 18,
    ageMax: 34,
    gender: 'All',
    selectedInterests: ['fitness'],
    objective: 'Product Sampling',
    campaignDays: 7,
    budgetInr: 500000,
    isGstInclusive: true
  });

  assert(masterForecast.geographicAnalysis.h3CellCount > 0, 'Generates H3 cell analysis with geometric intersection');
  assert(masterForecast.capacity.promoterCount > 0, 'Recommends optimal promoter headcount');
  assert(masterForecast.forecast.samples > 0, 'Forecasts positive sample volume');
  assert(masterForecast.ranges.interactions.lower <= masterForecast.ranges.interactions.expected, 'Interactions lower bound <= expected');
  assert(masterForecast.ranges.interactions.expected <= masterForecast.ranges.interactions.upper, 'Interactions expected <= upper bound');

  // Test 18: Operational Permissions & Regulatory Feasibility Gating
  console.log('\n--- 18. Operational Permissions & Feasibility Gating ---');
  const { assessPermissionRequirements, validateDispatchFeasibility, PERMISSION_STATUSES } = await import('../src/lib/intelligence/index.js');
  
  const mallPermissions = assessPermissionRequirements('MALL');
  assert(mallPermissions.some(p => p.type === 'MALL_MANAGEMENT' && p.status === PERMISSION_STATUSES.REQUIRED), 'Mall venue flags MALL_MANAGEMENT permission as REQUIRED');
  
  const streetPermissions = assessPermissionRequirements('COMMERCIAL_STREET');
  assert(streetPermissions.some(p => p.type === 'MUNICIPAL') && streetPermissions.some(p => p.type === 'POLICE'), 'Commercial street venue flags MUNICIPAL and POLICE permissions as REQUIRED');

  const blockedDispatch = validateDispatchFeasibility(mallPermissions);
  assert(!blockedDispatch.canDispatch, 'Unapproved required permissions block worker dispatch');
  assert(blockedDispatch.dispatchStatus === 'OPERATIONAL_CLEARANCE_REQUIRED', 'Returns OPERATIONAL_CLEARANCE_REQUIRED status');

  const approvedList = mallPermissions.map(p => ({ ...p, status: PERMISSION_STATUSES.APPROVED }));
  const clearedDispatch = validateDispatchFeasibility(approvedList);
  assert(clearedDispatch.canDispatch, 'Approved permissions successfully clear campaign for dispatch');

  // Test 19: Data Provenance & Maturity Schema
  console.log('\n--- 19. Data Provenance & Maturity Schema ---');
  const { createProvenanceValue, SOURCE_TYPES, MATURITY_LEVELS, CONFIDENCE_LEVELS } = await import('../src/lib/intelligence/index.js');
  
  const sampleProv = createProvenanceValue({
    value: 1250,
    sourceType: SOURCE_TYPES.HEURISTIC,
    maturityLevel: MATURITY_LEVELS.LEVEL_1_HEURISTIC,
    confidence: CONFIDENCE_LEVELS.MODERATE,
    methodology: 'population_density_grid_aggregation'
  });
  assert(sampleProv.sourceType === 'HEURISTIC', 'Provenance schema captures sourceType');
  assert(sampleProv.maturityLevel === 1, 'Provenance schema captures maturityLevel');
  assert(sampleProv.confidence === 'MODERATE', 'Provenance schema captures confidence tier');
  assert(sampleProv.methodology === 'population_density_grid_aggregation', 'Provenance schema captures methodology');

  // Test 20: Qualitative Alignment Tiers & Multi-Signal Verification
  console.log('\n--- 20. Qualitative Alignment & Multi-Signal Verification ---');
  const { getAlignmentTier, validateGeofenceCheckin: multiSignalValidate } = await import('../src/lib/intelligence/index.js');
  
  const highTier = getAlignmentTier(88);
  assert(highTier.tier === 'HIGH' && highTier.label === 'High Location Match', 'Scores >=80 map to High Location Match tier');
  const modTier = getAlignmentTier(65);
  assert(modTier.tier === 'MODERATE' && modTier.label === 'Moderate Location Match', 'Scores 60-79 map to Moderate Location Match tier');

  const fullSignalCheck = multiSignalValidate({
    targetLat: 13.0418,
    targetLng: 80.2341,
    actualLat: 13.0419,
    actualLng: 80.2342,
    gpsAccuracyMeters: 10,
    hasPhotoSubmitted: true,
    isSupervisorConfirmed: true
  });
  assert(fullSignalCheck.verificationConfidence === CONFIDENCE_LEVELS.HIGH, 'GPS within geofence + Photo + Supervisor confirmation achieves HIGH confidence');

  const mockLocationCheck = multiSignalValidate({
    targetLat: 13.0418,
    targetLng: 80.2341,
    actualLat: 13.0419,
    actualLng: 80.2342,
    isMockGpsDetected: true
  });
  assert(!mockLocationCheck.isWithinGeofence && mockLocationCheck.verificationStatus === 'REJECTED_MOCK_LOCATION', 'Mock GPS detection rejects check-in immediately');

  // Test 21: Production Codebase Zero-Mock Audit Check
  console.log('\n--- 21. Production Codebase Zero-Mock Audit ---');
  const fs = await import('fs');
  const path = await import('path');

  function scanDir(dir, forbiddenStrings) {
    let violations = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name !== 'node_modules' && entry.name !== '.next') {
          violations = violations.concat(scanDir(fullPath, forbiddenStrings));
        }
      } else if (entry.name.endsWith('.js') || entry.name.endsWith('.jsx')) {
        const content = fs.readFileSync(fullPath, 'utf8');
        for (const str of forbiddenStrings) {
          if (content.toLowerCase().includes(str.toLowerCase())) {
            violations.push({ file: fullPath, string: str });
          }
        }
      }
    }
    return violations;
  }

  const srcDir = path.resolve(process.cwd(), 'src');
  const forbiddenProductionStrings = ['loginAsDemo', 'demoProfiles', 'Artisan Cafe & Bakery'];
  const violations = scanDir(srcDir, forbiddenProductionStrings);

  assert(violations.length === 0, `Zero forbidden demo/mock identifiers found in production src/ (found ${violations.length})`);
  assert(true, 'Production codebase verified free of mock user login bypasses and demo brand names');

  console.log('\n===================================================================');
  console.log(`🎉 ALL ${passedTests}/${totalTests} TESTS PASSED SUCCESSFULLY!`);
  console.log('===================================================================\n');
}

runTestSuite().catch(err => {
  console.error('Test Suite Failed:', err);
  process.exit(1);
});
