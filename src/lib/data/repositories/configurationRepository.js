/**
 * Ziggers Production Engine - Campaign Configuration Repository
 * File: src/lib/data/repositories/configurationRepository.js
 * 
 * Provides versioned business parameters and statutory rates in integer paise.
 * Never uses floating point for financial calculations.
 */

import { getDatabase } from '../database.js';

export function getTenantCampaignConfiguration(tenantId = 'default_org', configVersion = null) {
  const db = getDatabase();

  let query = 'SELECT * FROM campaign_configurations WHERE tenant_id = ? AND is_active = 1';
  let params = [tenantId];

  if (configVersion) {
    query += ' AND config_version = ?';
    params.push(configVersion);
  } else {
    query += ' ORDER BY created_at DESC LIMIT 1';
  }

  let row = db.prepare(query).get(...params);

  // Fallback to default_org or global if tenant has no custom configuration
  if (!row && tenantId !== 'default_org') {
    row = db.prepare("SELECT * FROM campaign_configurations WHERE tenant_id = 'default_org' AND is_active = 1 LIMIT 1").get();
  }

  if (!row) {
    // Invariant baseline defaults (in paise)
    return {
      tenant_id: tenantId,
      config_version: 'v1.0_canonical_invariant',
      promoter_hourly_rate_paise: 24000, // ₹240
      supervisor_daily_fee_paise: 200000, // ₹2,000
      platform_fee_bps: 800, // 8%
      minimum_reserve_bps: 1000, // 10%
      minimum_reserve_floor_paise: 200000, // ₹2,000
      gst_rate_bps: 1800, // 18% statutory
      supervisor_ratio_promoters: 10
    };
  }

  return row;
}

export function saveTenantCampaignConfiguration(config) {
  const db = getDatabase();
  const now = new Date().toISOString();
  const id = `cfg_${config.tenant_id}_${Date.now()}`;

  const stmt = db.prepare(`
    INSERT INTO campaign_configurations (
      id, tenant_id, config_version, promoter_hourly_rate_paise, supervisor_daily_fee_paise,
      platform_fee_bps, minimum_reserve_bps, minimum_reserve_floor_paise, gst_rate_bps,
      supervisor_ratio_promoters, is_active, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
    ON CONFLICT (tenant_id, config_version) DO UPDATE SET
      promoter_hourly_rate_paise = excluded.promoter_hourly_rate_paise,
      supervisor_daily_fee_paise = excluded.supervisor_daily_fee_paise,
      platform_fee_bps = excluded.platform_fee_bps,
      minimum_reserve_bps = excluded.minimum_reserve_bps,
      minimum_reserve_floor_paise = excluded.minimum_reserve_floor_paise,
      gst_rate_bps = excluded.gst_rate_bps,
      supervisor_ratio_promoters = excluded.supervisor_ratio_promoters,
      updated_at = excluded.updated_at
  `);

  stmt.run(
    id,
    config.tenant_id || 'default_org',
    config.config_version || `v${Date.now()}`,
    Number(config.promoter_hourly_rate_paise || 24000),
    Number(config.supervisor_daily_fee_paise || 200000),
    Number(config.platform_fee_bps || 800),
    Number(config.minimum_reserve_bps || 1000),
    Number(config.minimum_reserve_floor_paise || 200000),
    Number(config.gst_rate_bps || 1800),
    Number(config.supervisor_ratio_promoters || 10),
    now,
    now
  );

  return getTenantCampaignConfiguration(config.tenant_id, config.config_version);
}
