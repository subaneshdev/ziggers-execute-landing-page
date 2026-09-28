/**
 * Ziggers Production Engine - Bayesian Posteriors Repository
 * File: src/lib/data/repositories/bayesianRepository.js
 * 
 * Provides durable database persistence for Beta-Binomial conjugate posteriors.
 * Features:
 * - Persistent storage surviving server restarts
 * - Strict tenant isolation
 * - 4-Tier Hierarchical Fallback (Cell -> Venue -> City -> Global)
 * - Atomic database updates
 */

import { getDatabase, withTransaction } from '../database.js';

export function getBayesianPosterior({
  tenantId = 'default_org',
  city = 'All',
  h3Cell = 'global',
  venueType = 'All',
  objective,
  metricName
}) {
  const db = getDatabase();
  const stmt = db.prepare(`
    SELECT * FROM bayesian_posteriors
    WHERE tenant_id = ? AND city = ? AND h3_cell = ? AND venue_type = ? AND objective = ? AND metric_name = ?
  `);

  return stmt.get(tenantId, city, h3Cell, venueType, objective, metricName) || null;
}

export function upsertBayesianPosterior({
  tenantId = 'default_org',
  city = 'All',
  h3Cell = 'global',
  venueType = 'All',
  objective,
  metricName,
  alpha,
  beta,
  observationCount = 1,
  sufficientStatK = 0,
  sufficientStatN = 0,
  modelVersion = 'bayes-v2.0'
}) {
  const db = getDatabase();
  const now = new Date().toISOString();
  const id = `post_${tenantId}_${city}_${h3Cell}_${metricName}_${Date.now()}`;

  const stmt = db.prepare(`
    INSERT INTO bayesian_posteriors (
      id, tenant_id, city, h3_cell, venue_type, objective, metric_name,
      alpha, beta, observation_count, sufficient_stat_k, sufficient_stat_n,
      model_version, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT (tenant_id, city, h3_cell, venue_type, objective, metric_name)
    DO UPDATE SET
      alpha = excluded.alpha,
      beta = excluded.beta,
      observation_count = excluded.observation_count,
      sufficient_stat_k = excluded.sufficient_stat_k,
      sufficient_stat_n = excluded.sufficient_stat_n,
      model_version = excluded.model_version,
      updated_at = excluded.updated_at
  `);

  stmt.run(
    id, tenantId, city, h3Cell, venueType, objective, metricName,
    Number(alpha), Number(beta), Number(observationCount),
    Number(sufficientStatK), Number(sufficientStatN),
    modelVersion, now
  );

  return getBayesianPosterior({ tenantId, city, h3Cell, venueType, objective, metricName });
}

/**
 * 4-Tier Hierarchical Bayesian Posterior Resolution:
 * Tier 1: Exact Tenant + City + H3 Cell + Venue + Objective
 * Tier 2: Tenant + City + Venue + Objective (Aggregate venue scope)
 * Tier 3: Tenant + City + Objective (City scope)
 * Tier 4: Global Benchmark Prior from conversion_priors
 */
export function getHierarchicalPosterior({
  tenantId = 'default_org',
  city = 'Chennai',
  h3Cell = 'global',
  venueType = 'commercial_high_street',
  objective = 'Product Sampling',
  metricName = 'landing_to_lead_rate'
}) {
  const db = getDatabase();

  // Tier 1: Exact H3 Cell
  if (h3Cell && h3Cell !== 'global') {
    const p1 = getBayesianPosterior({ tenantId, city, h3Cell, venueType, objective, metricName });
    if (p1 && p1.observation_count >= 1) {
      return { ...p1, hierarchyTier: 'H3_CELL_GROUND_TRUTH', source: `h3_cell:${h3Cell}` };
    }
  }

  // Tier 2: Venue Type Scope
  const p2 = getBayesianPosterior({ tenantId, city, h3Cell: 'global', venueType, objective, metricName });
  if (p2 && p2.observation_count >= 1) {
    return { ...p2, hierarchyTier: 'VENUE_TYPE_AGGREGATE', source: `venue_type:${venueType}` };
  }

  // Tier 3: City Scope
  const p3 = getBayesianPosterior({ tenantId, city, h3Cell: 'global', venueType: 'All', objective, metricName });
  if (p3 && p3.observation_count >= 1) {
    return { ...p3, hierarchyTier: 'CITY_HISTORICAL_DATA', source: `city:${city}` };
  }

  // Tier 4: Global Objective Prior from conversion_priors table
  const priorStmt = db.prepare('SELECT * FROM conversion_priors WHERE objective = ?');
  const priorRow = priorStmt.get(objective) || priorStmt.get('Product Sampling');

  if (priorRow) {
    let rate = priorRow.lead_conversion_rate;
    if (metricName === 'sample_distribution_rate') rate = priorRow.sample_distribution_rate;
    if (metricName === 'qr_scan_rate') rate = priorRow.qr_scan_rate;
    if (metricName === 'landing_to_lead_rate') rate = priorRow.lead_conversion_rate;
    if (metricName === 'app_install_rate') rate = priorRow.app_install_rate;

    const pseudoN = 20; // Default prior strength
    const alpha = parseFloat((rate * pseudoN).toFixed(3));
    const beta = parseFloat(((1 - rate) * pseudoN).toFixed(3));

    return {
      tenant_id: 'global',
      city: 'All',
      h3_cell: 'global',
      venue_type: 'All',
      objective,
      metric_name: metricName,
      alpha,
      beta,
      observation_count: 0,
      sufficient_stat_k: 0,
      sufficient_stat_n: 0,
      hierarchyTier: 'GLOBAL_BENCHMARK_PRIOR',
      source: 'database:conversion_priors'
    };
  }

  // Fallback invariant default
  return {
    tenant_id: 'global',
    city: 'All',
    h3_cell: 'global',
    venue_type: 'All',
    objective,
    metric_name: metricName,
    alpha: 2.8,
    beta: 17.2,
    observation_count: 0,
    hierarchyTier: 'CANONICAL_INVARIANT',
    source: 'system:fallback_prior'
  };
}
