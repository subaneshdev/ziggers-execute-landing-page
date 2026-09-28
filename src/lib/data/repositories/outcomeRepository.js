/**
 * Ziggers Production Engine - Campaign Outcome & Learning Loop Repository
 * File: src/lib/data/repositories/outcomeRepository.js
 * 
 * Provides atomic, transactional feedback ingestion:
 * - Idempotency rejection
 * - Write to campaign_outcomes
 * - Transactional Beta-Binomial posterior update
 * - Append to audit chain
 * - Multi-tier hierarchical indexing:
 *   (tenant_id, city, h3_cell, venue_type, objective, metric)
 */

import crypto from 'crypto';
import { getDatabase, withTransaction } from '../database.js';
import { appendAuditEvent } from './auditRepository.js';
import { getHierarchicalPosterior } from './bayesianRepository.js';
import { getTenantCampaignConfiguration } from './configurationRepository.js';

export function ingestVerifiedOutcomeTransaction({
  idempotencyKey,
  campaignId,
  tenantId = 'default_org',
  city = 'Chennai',
  h3Cell = 'global',
  venueType = 'commercial_high_street',
  objective = 'Product Sampling',
  actualFootfall = 0,
  actualInteractions = 0,
  actualConversions = 0,
  actualSamples = 0,
  dataQualityStatus = 'VERIFIED'
}) {
  const db = getDatabase();

  return withTransaction((tx) => {
    // 1. Idempotency Check
    const existing = tx.prepare('SELECT * FROM campaign_outcomes WHERE idempotency_key = ?').get(idempotencyKey);
    if (existing) {
      const currentPosterior = getHierarchicalPosterior({ tenantId, city, h3Cell, venueType, objective, metricName: 'landing_to_lead_rate' });
      return {
        outcome: existing,
        posterior: currentPosterior,
        isDuplicate: true,
        message: 'Duplicate outcome submission ignored via idempotency key.'
      };
    }

    // 2. Insert verified outcome
    const outcomeId = `out_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
    const now = new Date().toISOString();

    tx.prepare(`
      INSERT INTO campaign_outcomes (
        id, outcome_id, idempotency_key, campaign_id, tenant_id, city, h3_cell,
        venue_type, objective, actual_footfall, actual_interactions, actual_conversions,
        actual_samples, data_quality_status, verification_audit_status, is_finalized, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'APPROVED', 1, ?)
    `).run(
      outcomeId, outcomeId, idempotencyKey, campaignId, tenantId, city, h3Cell,
      venueType, objective, actualFootfall, actualInteractions, actualConversions,
      actualSamples, dataQualityStatus, now
    );

    // 3. Update Beta-Binomial Posterior for landing_to_lead_rate
    const metricName = 'landing_to_lead_rate';
    const prior = getHierarchicalPosterior({ tenantId, city, h3Cell, venueType, objective, metricName });

    const k = Number(actualConversions) || 0;
    const n = Math.max(k, Number(actualInteractions) || 0);

    const newAlpha = parseFloat((Number(prior.alpha) + k).toFixed(3));
    const newBeta = parseFloat((Number(prior.beta) + (n - k)).toFixed(3));
    const newObs = Number(prior.observation_count || 0) + 1;

    // Upsert exact H3 cell posterior for tenant
    const postCellId = `post_${tenantId}_${city}_${h3Cell}_${metricName}`;
    tx.prepare(`
      INSERT INTO bayesian_posteriors (
        id, tenant_id, city, h3_cell, venue_type, objective, metric_name,
        alpha, beta, observation_count, sufficient_stat_k, sufficient_stat_n,
        model_version, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'bayes-v2.0', ?)
      ON CONFLICT(tenant_id, city, h3_cell, venue_type, objective, metric_name)
      DO UPDATE SET
        alpha = excluded.alpha,
        beta = excluded.beta,
        observation_count = excluded.observation_count,
        sufficient_stat_k = bayesian_posteriors.sufficient_stat_k + excluded.sufficient_stat_k,
        sufficient_stat_n = bayesian_posteriors.sufficient_stat_n + excluded.sufficient_stat_n,
        updated_at = excluded.updated_at
    `).run(
      postCellId, tenantId, city, h3Cell, venueType, objective, metricName,
      newAlpha, newBeta, newObs, k, n, now
    );

    // Also update venue scope for tenant
    const postVenueId = `post_${tenantId}_${city}_global_${venueType}_${metricName}`;
    tx.prepare(`
      INSERT INTO bayesian_posteriors (
        id, tenant_id, city, h3_cell, venue_type, objective, metric_name,
        alpha, beta, observation_count, sufficient_stat_k, sufficient_stat_n,
        model_version, updated_at
      ) VALUES (?, ?, ?, 'global', ?, ?, ?, ?, ?, ?, ?, ?, 'bayes-v2.0', ?)
      ON CONFLICT(tenant_id, city, h3_cell, venue_type, objective, metric_name)
      DO UPDATE SET
        alpha = excluded.alpha,
        beta = excluded.beta,
        observation_count = excluded.observation_count,
        sufficient_stat_k = bayesian_posteriors.sufficient_stat_k + excluded.sufficient_stat_k,
        sufficient_stat_n = bayesian_posteriors.sufficient_stat_n + excluded.sufficient_stat_n,
        updated_at = excluded.updated_at
    `).run(
      postVenueId, tenantId, city, venueType, objective, metricName,
      newAlpha, newBeta, newObs, k, n, now
    );

    // 4. Append audit event
    const auditRecord = appendAuditEvent({
      tenantId,
      eventType: 'POSTERIOR_UPDATED',
      entityId: outcomeId,
      payload: {
        campaignId,
        h3Cell,
        objective,
        metricName,
        actualInteractions: n,
        actualConversions: k,
        posteriorAlpha: newAlpha,
        posteriorBeta: newBeta,
        observationCount: newObs
      }
    });

    const updatedPosterior = getHierarchicalPosterior({ tenantId, city, h3Cell, venueType, objective, metricName });

    return {
      outcomeId,
      idempotencyKey,
      tenantId,
      isDuplicate: false,
      posterior: updatedPosterior,
      auditEventId: auditRecord.eventId
    };
  });
}

export function getTenantModelEvaluationData({ tenantId = 'default_org', metric = 'samples' } = {}) {
  const db = getDatabase();
  const tenantConfig = getTenantCampaignConfiguration(tenantId);

  const rows = db.prepare(`
    SELECT 
      co.outcome_id,
      co.campaign_id,
      co.tenant_id,
      co.city,
      co.h3_cell,
      co.venue_type,
      co.objective,
      co.actual_footfall,
      co.actual_interactions,
      co.actual_conversions,
      co.actual_samples,
      co.actual_cpl_paise,
      co.data_quality_status,
      co.verification_audit_status,
      co.is_finalized,
      co.created_at as outcome_created_at,
      cf.forecast_id,
      cf.expected_audience,
      cf.expected_reach,
      cf.expected_interactions,
      cf.expected_leads,
      cf.expected_samples,
      cf.cost_per_lead_paise,
      cf.confidence_tier,
      cf.model_version,
      cf.config_version,
      cf.intervals_json,
      c.title as campaign_name,
      c.status as campaign_status
    FROM campaign_outcomes co
    LEFT JOIN campaign_forecasts cf ON co.campaign_id = cf.campaign_id AND co.tenant_id = cf.tenant_id
    LEFT JOIN campaigns c ON co.campaign_id = c.campaign_id AND co.tenant_id = c.tenant_id
    WHERE co.tenant_id = ?
      AND co.data_quality_status = 'VERIFIED'
      AND co.verification_audit_status = 'APPROVED'
      AND co.is_finalized = 1
      AND (c.status IS NULL OR c.status NOT IN ('DRAFT', 'Draft', 'CANCELLED', 'FAILED', 'UNVERIFIED'))
    ORDER BY co.created_at DESC
  `).all(tenantId);

  const pairs = rows.map((r) => {
    let predictedVal = 0;
    let actualVal = 0;
    let intervals = {};
    try {
      intervals = r.intervals_json ? JSON.parse(r.intervals_json) : {};
    } catch (_) {}

    let lowerBound = null;
    let upperBound = null;

    if (metric === 'footfall' || metric === 'reach') {
      predictedVal = r.expected_reach || r.expected_audience || 0;
      actualVal = r.actual_footfall || 0;
      lowerBound = intervals.reach?.lower ?? Math.round(predictedVal * 0.8);
      upperBound = intervals.reach?.upper ?? Math.round(predictedVal * 1.2);
    } else if (metric === 'qrScans' || metric === 'interactions') {
      predictedVal = r.expected_interactions || 0;
      actualVal = r.actual_interactions || 0;
      lowerBound = intervals.interactions?.lower ?? Math.round(predictedVal * 0.75);
      upperBound = intervals.interactions?.upper ?? Math.round(predictedVal * 1.25);
    } else if (metric === 'leads' || metric === 'conversions') {
      predictedVal = r.expected_leads || 0;
      actualVal = r.actual_conversions || 0;
      lowerBound = intervals.leads?.lower ?? Math.round(predictedVal * 0.7);
      upperBound = intervals.leads?.upper ?? Math.round(predictedVal * 1.3);
    } else {
      // default: samples
      predictedVal = r.expected_samples || 0;
      actualVal = r.actual_samples || 0;
      lowerBound = intervals.samples?.lower ?? Math.round(predictedVal * 0.85);
      upperBound = intervals.samples?.upper ?? Math.round(predictedVal * 1.15);
    }

    return {
      campaignId: r.campaign_id,
      campaignName: r.campaign_name || `Campaign ${r.campaign_id}`,
      city: r.city,
      locationType: r.venue_type || 'Commercial',
      objective: r.objective || 'Product Sampling',
      date: (r.outcome_created_at || '').substring(0, 10),
      predicted: predictedVal,
      actual: actualVal,
      lowerBound,
      upperBound
    };
  });

  const observationCount = pairs.length;
  const minimumRequired = 10;
  const isSufficient = observationCount >= minimumRequired;

  // Compute metrics from actual database pairs
  let sumAbsoluteError = 0;
  let sumSquaredError = 0;
  let sumActual = 0;
  let sumPredictedMinusActual = 0;
  let sumSmape = 0;
  let inRangeCount = 0;

  pairs.forEach(p => {
    const act = Math.max(0, Number(p.actual) || 0);
    const pred = Math.max(0, Number(p.predicted) || 0);
    const absError = Math.abs(act - pred);

    sumAbsoluteError += absError;
    sumSquaredError += Math.pow(act - pred, 2);
    sumActual += act;
    sumPredictedMinusActual += (pred - act);

    const denom = (Math.abs(act) + Math.abs(pred)) / 2;
    if (denom > 0) {
      sumSmape += (absError / denom);
    }

    const low = p.lowerBound !== null ? p.lowerBound : pred * 0.80;
    const high = p.upperBound !== null ? p.upperBound : pred * 1.20;
    if (act >= low && act <= high) {
      inRangeCount++;
    }
  });

  const wape = sumActual > 0 ? parseFloat(((sumAbsoluteError / sumActual) * 100).toFixed(2)) : null;
  const smape = observationCount > 0 ? parseFloat(((sumSmape / observationCount) * 100).toFixed(2)) : null;
  const mae = observationCount > 0 ? parseFloat((sumAbsoluteError / observationCount).toFixed(1)) : null;
  const rmse = observationCount > 0 ? parseFloat(Math.sqrt(sumSquaredError / observationCount).toFixed(1)) : null;
  const predictionBias = sumActual > 0 ? parseFloat(((sumPredictedMinusActual / sumActual) * 100).toFixed(2)) : null;
  const nominalRangeCoverage = observationCount > 0 ? parseFloat(((inRangeCount / observationCount) * 100).toFixed(1)) : null;
  const calibrationError = nominalRangeCoverage !== null ? parseFloat(Math.abs(nominalRangeCoverage - 90.0).toFixed(1)) : null;

  let maturityTier = 'INSUFFICIENT';
  if (observationCount >= 2000) maturityTier = 'HIGH_CONFIDENCE';
  else if (observationCount >= 500) maturityTier = 'ESTABLISHED';
  else if (observationCount >= 100) maturityTier = 'CALIBRATING';
  else if (observationCount >= 30) maturityTier = 'PRELIMINARY';
  else if (observationCount >= 10) maturityTier = 'EARLY_SIGNAL';

  return {
    tenantId,
    metric,
    observationCount,
    minimumRequired,
    isSufficient,
    maturityTier,
    dataSource: 'ZIGGERS_WAL_SQLITE_AUDITED',
    modelVersion: 'bayes-v2.0',
    configurationVersion: tenantConfig.config_version,
    calculatedAt: new Date().toISOString(),
    message: isSufficient 
      ? 'Sufficient verified telemetry available for statistical validation.'
      : 'Not enough verified campaign data for evaluation. Complete more campaigns to unlock reliable model metrics.',
    metrics: {
      wape,
      smape,
      mae,
      rmse,
      predictionBias,
      nominalRangeCoverage,
      calibrationError
    },
    pairs
  };
}
