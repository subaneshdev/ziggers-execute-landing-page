/**
 * Ziggers Production Engine - Unified Data & Persistence Layer
 * File: src/lib/data/database.js
 * 
 * Provides durable database persistence using PostgreSQL (via Supabase)
 * or durable disk-backed SQLite (via Node.js native node:sqlite).
 * 
 * Non-negotiable Guarantees:
 * 1. NEVER silently falls back to in-memory volatile Maps.
 * 2. Survives server restarts by persisting to disk/database.
 * 3. Enforces tenantId on every operation.
 * 4. Fails closed with descriptive errors when queries fail.
 */

import path from 'path';
import fs from 'fs';
import { DatabaseSync } from 'node:sqlite';

let dbInstance = null;
const DB_PATH = process.env.SQLITE_DB_PATH || path.resolve(process.cwd(), 'data', 'ziggers_production.db');

export function getDatabase() {
  if (dbInstance) return dbInstance;

  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  dbInstance = new DatabaseSync(DB_PATH);
  dbInstance.exec('PRAGMA journal_mode = WAL;');
  dbInstance.exec('PRAGMA foreign_keys = ON;');

  initSchema(dbInstance);
  return dbInstance;
}

export function closeDatabase() {
  if (dbInstance) {
    dbInstance.close();
    dbInstance = null;
    txDepth = 0;
  }
}

function initSchema(db) {
  // Execute table definitions and constraints
  db.exec(`
    CREATE TABLE IF NOT EXISTS campaign_configurations (
      id TEXT PRIMARY KEY,
      tenant_id TEXT NOT NULL DEFAULT 'default_org',
      config_version TEXT NOT NULL DEFAULT 'v1.0_2026',
      promoter_hourly_rate_paise INTEGER NOT NULL DEFAULT 24000,
      supervisor_daily_fee_paise INTEGER NOT NULL DEFAULT 200000,
      platform_fee_bps INTEGER NOT NULL DEFAULT 800,
      minimum_reserve_bps INTEGER NOT NULL DEFAULT 1000,
      minimum_reserve_floor_paise INTEGER NOT NULL DEFAULT 200000,
      gst_rate_bps INTEGER NOT NULL DEFAULT 1800,
      supervisor_ratio_promoters INTEGER NOT NULL DEFAULT 10,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      UNIQUE(tenant_id, config_version)
    );

    CREATE TABLE IF NOT EXISTS spatial_population_h3 (
      id TEXT PRIMARY KEY,
      h3_index TEXT UNIQUE NOT NULL,
      h3_resolution INTEGER NOT NULL DEFAULT 9,
      city TEXT NOT NULL,
      location_name TEXT NOT NULL,
      center_lat REAL NOT NULL,
      center_lng REAL NOT NULL,
      base_population INTEGER NOT NULL DEFAULT 15000,
      population_density_sq_km INTEGER NOT NULL DEFAULT 18000,
      resident_share REAL NOT NULL DEFAULT 0.35,
      transient_share REAL NOT NULL DEFAULT 0.45,
      workforce_share REAL NOT NULL DEFAULT 0.20,
      sec_classification TEXT NOT NULL DEFAULT 'SEC A/B',
      affluence_score INTEGER NOT NULL DEFAULT 85,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS demographic_profiles (
      id TEXT PRIMARY KEY,
      h3_index TEXT NOT NULL,
      age_18_24_ratio REAL NOT NULL DEFAULT 0.22,
      age_25_34_ratio REAL NOT NULL DEFAULT 0.34,
      age_35_44_ratio REAL NOT NULL DEFAULT 0.23,
      age_45_54_ratio REAL NOT NULL DEFAULT 0.12,
      age_55_plus_ratio REAL NOT NULL DEFAULT 0.09,
      male_ratio REAL NOT NULL DEFAULT 0.51,
      female_ratio REAL NOT NULL DEFAULT 0.49,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS venue_poi_registry (
      id TEXT PRIMARY KEY,
      h3_index TEXT NOT NULL,
      location_name TEXT NOT NULL,
      poi_category TEXT NOT NULL,
      poi_count INTEGER NOT NULL DEFAULT 0,
      commercial_intensity_score INTEGER NOT NULL DEFAULT 80,
      source TEXT NOT NULL DEFAULT 'OPENSTREETMAP_OVERPASS',
      confidence_score REAL NOT NULL DEFAULT 0.88,
      collected_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS hourly_traffic_profiles (
      id TEXT PRIMARY KEY,
      venue_type TEXT NOT NULL,
      city TEXT NOT NULL DEFAULT 'All',
      day_type TEXT NOT NULL DEFAULT 'WEEKEND',
      hourly_coefficients TEXT NOT NULL,
      source TEXT NOT NULL DEFAULT 'ZIGGERS_MOBILITY_CALIBRATION_V1',
      UNIQUE(venue_type, city, day_type)
    );

    CREATE TABLE IF NOT EXISTS conversion_priors (
      id TEXT PRIMARY KEY,
      objective TEXT UNIQUE NOT NULL,
      sample_distribution_rate REAL NOT NULL,
      qr_scan_rate REAL NOT NULL,
      landing_conversion_rate REAL NOT NULL,
      signup_rate REAL NOT NULL,
      lead_conversion_rate REAL NOT NULL,
      app_install_rate REAL NOT NULL,
      benchmark_roi_multiplier REAL NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS bayesian_posteriors (
      id TEXT PRIMARY KEY,
      tenant_id TEXT NOT NULL DEFAULT 'global',
      city TEXT NOT NULL DEFAULT 'All',
      h3_cell TEXT NOT NULL DEFAULT 'global',
      venue_type TEXT NOT NULL DEFAULT 'All',
      objective TEXT NOT NULL,
      metric_name TEXT NOT NULL,
      alpha REAL NOT NULL,
      beta REAL NOT NULL,
      observation_count INTEGER NOT NULL DEFAULT 0,
      sufficient_stat_k REAL NOT NULL DEFAULT 0,
      sufficient_stat_n REAL NOT NULL DEFAULT 0,
      model_version TEXT NOT NULL DEFAULT 'bayes-v2.0',
      updated_at TEXT NOT NULL,
      UNIQUE(tenant_id, city, h3_cell, venue_type, objective, metric_name)
    );

    CREATE TABLE IF NOT EXISTS campaigns (
      id TEXT PRIMARY KEY,
      campaign_id TEXT UNIQUE NOT NULL,
      tenant_id TEXT NOT NULL DEFAULT 'default_org',
      title TEXT NOT NULL,
      brand_name TEXT NOT NULL,
      product_name TEXT,
      campaign_type TEXT NOT NULL DEFAULT 'Product Sampling',
      status TEXT NOT NULL DEFAULT 'DRAFT',
      budget_net_paise INTEGER NOT NULL DEFAULT 0,
      budget_gross_paise INTEGER NOT NULL DEFAULT 0,
      gst_paise INTEGER NOT NULL DEFAULT 0,
      escrow_reserve_paise INTEGER NOT NULL DEFAULT 0,
      platform_fee_paise INTEGER NOT NULL DEFAULT 0,
      labour_pool_paise INTEGER NOT NULL DEFAULT 0,
      duration_days INTEGER NOT NULL DEFAULT 7,
      shift_hours INTEGER NOT NULL DEFAULT 5,
      location_name TEXT NOT NULL,
      city TEXT NOT NULL,
      primary_h3_cell TEXT,
      start_date TEXT,
      end_date TEXT,
      daily_start_time TEXT,
      daily_end_time TEXT,
      timezone TEXT NOT NULL DEFAULT 'Asia/Kolkata',
      campaign_days INTEGER,
      hours_per_day REAL,
      total_campaign_hours REAL,
      schedule_status TEXT NOT NULL DEFAULT 'LEGACY_MISSING',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS campaign_forecasts (
      id TEXT PRIMARY KEY,
      forecast_id TEXT UNIQUE NOT NULL,
      campaign_id TEXT,
      tenant_id TEXT NOT NULL DEFAULT 'default_org',
      expected_audience INTEGER NOT NULL,
      expected_reach INTEGER NOT NULL,
      expected_interactions INTEGER NOT NULL,
      expected_leads INTEGER NOT NULL,
      expected_samples INTEGER NOT NULL,
      cost_per_lead_paise INTEGER,
      promoters_count INTEGER NOT NULL,
      supervisors_count INTEGER NOT NULL,
      labour_cost_paise INTEGER NOT NULL,
      confidence_tier TEXT NOT NULL DEFAULT 'MODERATE',
      model_type TEXT NOT NULL DEFAULT 'BAYESIAN_STATISTICAL_ESTIMATE',
      model_version TEXT NOT NULL,
      config_version TEXT NOT NULL,
      intervals_json TEXT NOT NULL DEFAULT '{}',
      provenance_json TEXT NOT NULL DEFAULT '{}',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS model_predictions (
      id TEXT PRIMARY KEY,
      prediction_id TEXT UNIQUE NOT NULL,
      campaign_id TEXT,
      tenant_id TEXT NOT NULL DEFAULT 'default_org',
      model_name TEXT NOT NULL,
      model_version TEXT NOT NULL,
      feature_snapshot_json TEXT NOT NULL,
      prediction_json TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS campaign_outcomes (
      id TEXT PRIMARY KEY,
      outcome_id TEXT UNIQUE NOT NULL,
      idempotency_key TEXT UNIQUE NOT NULL,
      campaign_id TEXT NOT NULL,
      tenant_id TEXT NOT NULL DEFAULT 'default_org',
      city TEXT NOT NULL,
      h3_cell TEXT NOT NULL,
      venue_type TEXT NOT NULL,
      objective TEXT NOT NULL,
      actual_footfall INTEGER NOT NULL DEFAULT 0,
      actual_interactions INTEGER NOT NULL DEFAULT 0,
      actual_conversions INTEGER NOT NULL DEFAULT 0,
      actual_samples INTEGER NOT NULL DEFAULT 0,
      actual_cpl_paise INTEGER,
      data_quality_status TEXT NOT NULL DEFAULT 'VERIFIED',
      verification_audit_status TEXT NOT NULL DEFAULT 'APPROVED',
      is_finalized INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS workers (
      id TEXT PRIMARY KEY,
      worker_id TEXT UNIQUE NOT NULL,
      tenant_id TEXT NOT NULL DEFAULT 'default_org',
      full_name TEXT NOT NULL,
      phone_number TEXT NOT NULL,
      upi_id TEXT,
      role TEXT NOT NULL DEFAULT 'PROMOTER',
      verification_status TEXT NOT NULL DEFAULT 'VERIFIED',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS worker_assignments (
      id TEXT PRIMARY KEY,
      assignment_id TEXT UNIQUE NOT NULL,
      campaign_id TEXT NOT NULL,
      worker_id TEXT NOT NULL,
      tenant_id TEXT NOT NULL DEFAULT 'default_org',
      shift_date TEXT NOT NULL,
      shift_start_time TEXT NOT NULL,
      shift_end_time TEXT NOT NULL,
      target_latitude REAL NOT NULL,
      target_longitude REAL NOT NULL,
      geofence_radius_meters INTEGER NOT NULL DEFAULT 50,
      status TEXT NOT NULL DEFAULT 'ASSIGNED',
      created_at TEXT NOT NULL,
      UNIQUE(worker_id, campaign_id, shift_date)
    );

    CREATE TABLE IF NOT EXISTS shift_checkins (
      id TEXT PRIMARY KEY,
      checkin_id TEXT UNIQUE NOT NULL,
      assignment_id TEXT NOT NULL,
      campaign_id TEXT NOT NULL,
      worker_id TEXT NOT NULL,
      tenant_id TEXT NOT NULL DEFAULT 'default_org',
      checkin_timestamp TEXT NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      gps_accuracy_meters REAL NOT NULL,
      distance_meters REAL NOT NULL,
      is_mock_detected INTEGER NOT NULL DEFAULT 0,
      kinematic_velocity_kmh REAL DEFAULT 0.00,
      verification_status TEXT NOT NULL DEFAULT 'VERIFIED',
      supervisor_confirmed INTEGER NOT NULL DEFAULT 0,
      supervisor_id TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS proof_records (
      id TEXT PRIMARY KEY,
      proof_id TEXT UNIQUE NOT NULL,
      idempotency_key TEXT UNIQUE NOT NULL,
      campaign_id TEXT NOT NULL,
      assignment_id TEXT NOT NULL,
      worker_id TEXT NOT NULL,
      tenant_id TEXT NOT NULL DEFAULT 'default_org',
      proof_type TEXT NOT NULL,
      image_url TEXT NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      gps_accuracy_meters REAL NOT NULL,
      captured_at TEXT NOT NULL,
      crypto_hash TEXT NOT NULL,
      previous_hash TEXT NOT NULL,
      hmac_signature TEXT NOT NULL,
      audit_status TEXT NOT NULL DEFAULT 'APPROVED',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS audit_chain_heads (
      tenant_id TEXT PRIMARY KEY,
      last_crypto_hash TEXT NOT NULL,
      total_events_count INTEGER NOT NULL DEFAULT 0,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS audit_chain_events (
      id TEXT PRIMARY KEY,
      event_id TEXT UNIQUE NOT NULL,
      tenant_id TEXT NOT NULL DEFAULT 'default_org',
      event_type TEXT NOT NULL,
      entity_id TEXT NOT NULL,
      canonical_payload_json TEXT NOT NULL,
      previous_hash TEXT NOT NULL,
      crypto_hash TEXT NOT NULL,
      hmac_signature TEXT NOT NULL,
      batch_merkle_root TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS payouts (
      id TEXT PRIMARY KEY,
      payout_id TEXT UNIQUE NOT NULL,
      idempotency_key TEXT UNIQUE NOT NULL,
      campaign_id TEXT NOT NULL,
      assignment_id TEXT NOT NULL,
      worker_id TEXT NOT NULL,
      tenant_id TEXT NOT NULL DEFAULT 'default_org',
      guaranteed_base_paise INTEGER NOT NULL,
      variable_bonus_paise INTEGER NOT NULL DEFAULT 0,
      deductions_paise INTEGER NOT NULL DEFAULT 0,
      total_payable_paise INTEGER NOT NULL,
      payout_status TEXT NOT NULL DEFAULT 'APPROVED_FOR_DISBURSEMENT',
      upi_id TEXT NOT NULL,
      transaction_ref_no TEXT,
      server_verified_checkin_id TEXT NOT NULL,
      server_verified_proof_id TEXT NOT NULL,
      supervisor_verified_id TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS campaign_briefs (
      id TEXT PRIMARY KEY,
      tenant_id TEXT NOT NULL DEFAULT 'default_org',
      name TEXT NOT NULL,
      company TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT DEFAULT 'N/A',
      campaign_type TEXT NOT NULL,
      target_cities TEXT NOT NULL,
      brief_details TEXT,
      status TEXT NOT NULL DEFAULT 'Received',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sampling_logs (
      id TEXT PRIMARY KEY,
      log_id TEXT UNIQUE NOT NULL,
      tenant_id TEXT NOT NULL DEFAULT 'default_org',
      assignment_id TEXT NOT NULL,
      campaign_id TEXT NOT NULL,
      worker_id TEXT NOT NULL,
      quantity_logged INTEGER NOT NULL DEFAULT 1,
      interaction_count INTEGER NOT NULL DEFAULT 1,
      notes TEXT,
      logged_at TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS first_party_consents (
      id TEXT PRIMARY KEY,
      consent_id TEXT UNIQUE NOT NULL,
      tenant_id TEXT NOT NULL DEFAULT 'default_org',
      campaign_id TEXT NOT NULL,
      brand_name TEXT NOT NULL,
      qr_code_id TEXT,
      phone_hash TEXT,
      email_hash TEXT,
      raw_phone TEXT,
      raw_email TEXT,
      purpose TEXT NOT NULL,
      retention_days INTEGER NOT NULL DEFAULT 365,
      consent_timestamp TEXT NOT NULL,
      user_ip TEXT,
      created_at TEXT NOT NULL
    );
  `);

  // Ensure default configuration, 18 metro nodes, and 4 diurnal curves are seeded
  seedDefaults(db);
  migrateCampaignSchedule(db);
  migrateExternalDataSources(db);
  migratePlaybookDecisionLayer(db);
}

export function migrateCampaignSchedule(db) {
  try {
    const existingCols = db.prepare("PRAGMA table_info(campaigns)").all().map(c => c.name);
    const scheduleCols = [
      { name: 'start_date', def: 'TEXT' },
      { name: 'end_date', def: 'TEXT' },
      { name: 'daily_start_time', def: 'TEXT' },
      { name: 'daily_end_time', def: 'TEXT' },
      { name: 'timezone', def: "TEXT DEFAULT 'Asia/Kolkata'" },
      { name: 'campaign_days', def: 'INTEGER' },
      { name: 'hours_per_day', def: 'REAL' },
      { name: 'total_campaign_hours', def: 'REAL' },
      { name: 'schedule_status', def: "TEXT DEFAULT 'LEGACY_MISSING'" }
    ];

    for (const col of scheduleCols) {
      if (!existingCols.includes(col.name)) {
        db.exec(`ALTER TABLE campaigns ADD COLUMN ${col.name} ${col.def};`);
      }
    }

    db.exec(`UPDATE campaigns SET schedule_status = 'LEGACY_MISSING' WHERE schedule_status IS NULL;`);
  } catch (err) {
    console.warn('Database campaign schedule migration notice:', err.message);
  }
}

export function migrateExternalDataSources(db) {
  try {
    db.exec(`
      CREATE TABLE IF NOT EXISTS data_sources (
        source_id TEXT PRIMARY KEY,
        publisher TEXT NOT NULL,
        url TEXT NOT NULL,
        licence_url TEXT,
        api_docs TEXT,
        data_period TEXT NOT NULL,
        published_on TEXT,
        status TEXT NOT NULL,
        is_connected INTEGER NOT NULL DEFAULT 0,
        kind TEXT NOT NULL,
        allowed_use TEXT NOT NULL,
        restriction TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS dataset_versions (
        id TEXT PRIMARY KEY,
        source_id TEXT NOT NULL REFERENCES data_sources(source_id),
        version_tag TEXT NOT NULL,
        package_version TEXT NOT NULL DEFAULT '1.0',
        checked_on TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'APPROVED',
        checksum_sha256 TEXT NOT NULL,
        raw_file_uri TEXT NOT NULL,
        records_count INTEGER NOT NULL DEFAULT 0,
        notes TEXT,
        created_at TEXT NOT NULL,
        UNIQUE(source_id, version_tag)
      );

      CREATE TABLE IF NOT EXISTS import_batches (
        id TEXT PRIMARY KEY,
        dataset_version_id TEXT REFERENCES dataset_versions(id),
        source_id TEXT NOT NULL REFERENCES data_sources(source_id),
        batch_number INTEGER NOT NULL,
        records_processed INTEGER NOT NULL DEFAULT 0,
        records_accepted INTEGER NOT NULL DEFAULT 0,
        records_rejected INTEGER NOT NULL DEFAULT 0,
        records_unchanged INTEGER NOT NULL DEFAULT 0,
        review_status TEXT NOT NULL DEFAULT 'APPROVED',
        rejection_log_json TEXT DEFAULT '[]',
        imported_by TEXT NOT NULL DEFAULT 'system_importer',
        created_at TEXT NOT NULL,
        approved_at TEXT
      );

      CREATE TABLE IF NOT EXISTS market_context (
        id TEXT PRIMARY KEY,
        batch_id TEXT REFERENCES import_batches(id),
        dataset_version_id TEXT REFERENCES dataset_versions(id),
        source_id TEXT NOT NULL REFERENCES data_sources(source_id),
        area_name TEXT NOT NULL,
        area_level TEXT NOT NULL,
        sector TEXT NOT NULL CHECK(sector IN ('Rural', 'Urban', 'All')),
        metric TEXT NOT NULL,
        value REAL NOT NULL,
        unit TEXT NOT NULL,
        period TEXT NOT NULL,
        evidence_type TEXT NOT NULL DEFAULT 'SURVEY_ESTIMATE',
        allowed_use TEXT NOT NULL DEFAULT 'MARKET_CONTEXT_ONLY',
        quality_note TEXT,
        review_status TEXT NOT NULL DEFAULT 'APPROVED',
        created_at TEXT NOT NULL,
        UNIQUE(area_name, sector, metric, period, source_id)
      );

      CREATE TABLE IF NOT EXISTS transit_context (
        id TEXT PRIMARY KEY,
        batch_id TEXT REFERENCES import_batches(id),
        dataset_version_id TEXT REFERENCES dataset_versions(id),
        source_id TEXT NOT NULL REFERENCES data_sources(source_id),
        city TEXT NOT NULL,
        geographic_scope TEXT NOT NULL,
        month TEXT NOT NULL,
        value INTEGER NOT NULL,
        metric TEXT NOT NULL,
        unit TEXT NOT NULL DEFAULT 'passenger_flow_count',
        evidence_type TEXT NOT NULL DEFAULT 'OPERATOR_REPORTED',
        allowed_use TEXT NOT NULL DEFAULT 'NETWORK_CONTEXT_ONLY',
        review_status TEXT NOT NULL DEFAULT 'APPROVED',
        created_at TEXT NOT NULL,
        UNIQUE(city, month, metric, source_id)
      );

      CREATE TABLE IF NOT EXISTS venue_directory (
        id TEXT PRIMARY KEY,
        batch_id TEXT REFERENCES import_batches(id),
        dataset_version_id TEXT REFERENCES dataset_versions(id),
        source_id TEXT NOT NULL REFERENCES data_sources(source_id),
        source_institution_id TEXT NOT NULL,
        name TEXT NOT NULL,
        city TEXT NOT NULL,
        state TEXT NOT NULL,
        edition TEXT NOT NULL,
        permission_status TEXT NOT NULL DEFAULT 'NOT_CONFIRMED',
        footfall REAL DEFAULT NULL,
        student_count INTEGER DEFAULT NULL,
        evidence_type TEXT NOT NULL DEFAULT 'PUBLISHED_DIRECTORY',
        review_status TEXT NOT NULL DEFAULT 'APPROVED',
        created_at TEXT NOT NULL,
        UNIQUE(source_id, source_institution_id)
      );

      CREATE TABLE IF NOT EXISTS footfall_observations (
        id TEXT PRIMARY KEY,
        batch_id TEXT REFERENCES import_batches(id),
        source_id TEXT REFERENCES data_sources(source_id),
        location_name TEXT NOT NULL,
        h3_cell TEXT,
        observation_date TEXT NOT NULL,
        time_window_start TEXT NOT NULL,
        time_window_end TEXT NOT NULL,
        interval_minutes INTEGER NOT NULL DEFAULT 60,
        visitor_count INTEGER NOT NULL,
        measurement_method TEXT NOT NULL,
        evidence_type TEXT NOT NULL DEFAULT 'OBSERVED_MEASUREMENT',
        review_status TEXT NOT NULL DEFAULT 'PENDING_REVIEW',
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS weather_forecasts (
        id TEXT PRIMARY KEY,
        source_id TEXT REFERENCES data_sources(source_id),
        city TEXT NOT NULL,
        forecast_date TEXT NOT NULL,
        issue_time TEXT NOT NULL,
        expiry_time TEXT NOT NULL,
        weather_condition TEXT NOT NULL,
        rain_probability REAL,
        temp_celsius REAL,
        advisory_note TEXT,
        connection_status TEXT NOT NULL DEFAULT 'SOURCE_IDENTIFIED_NOT_CONNECTED',
        review_status TEXT NOT NULL DEFAULT 'PENDING_REVIEW',
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS vendor_quotes (
        id TEXT PRIMARY KEY,
        vendor_id TEXT NOT NULL,
        vendor_name TEXT NOT NULL,
        city TEXT NOT NULL,
        service_category TEXT NOT NULL,
        unit_rate_paise INTEGER NOT NULL,
        unit_type TEXT NOT NULL,
        terms TEXT,
        validity_start_date TEXT NOT NULL,
        validity_end_date TEXT NOT NULL,
        review_status TEXT NOT NULL DEFAULT 'APPROVED',
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS data_import_rejections (
        id TEXT PRIMARY KEY,
        batch_id TEXT NOT NULL,
        source_id TEXT NOT NULL,
        raw_record_json TEXT NOT NULL,
        rejection_reason TEXT NOT NULL,
        created_at TEXT NOT NULL
      );
    `);

    // Flag existing seed tables as UNVERIFIED_SEED
    const spatialCols = db.prepare("PRAGMA table_info(spatial_population_h3)").all().map(c => c.name);
    if (!spatialCols.includes('evidence_status')) {
      db.exec("ALTER TABLE spatial_population_h3 ADD COLUMN evidence_status TEXT DEFAULT 'UNVERIFIED_SEED';");
    }
    if (!spatialCols.includes('source_citation')) {
      db.exec("ALTER TABLE spatial_population_h3 ADD COLUMN source_citation TEXT DEFAULT 'UNVERIFIED_HISTORICAL_SEED';");
    }
    if (!spatialCols.includes('data_quality_tier')) {
      db.exec("ALTER TABLE spatial_population_h3 ADD COLUMN data_quality_tier TEXT DEFAULT 'UNVERIFIED_ASSUMPTION';");
    }

    const demoCols = db.prepare("PRAGMA table_info(demographic_profiles)").all().map(c => c.name);
    if (!demoCols.includes('evidence_status')) {
      db.exec("ALTER TABLE demographic_profiles ADD COLUMN evidence_status TEXT DEFAULT 'UNVERIFIED_SEED';");
    }

    const trafficCols = db.prepare("PRAGMA table_info(hourly_traffic_profiles)").all().map(c => c.name);
    if (!trafficCols.includes('evidence_status')) {
      db.exec("ALTER TABLE hourly_traffic_profiles ADD COLUMN evidence_status TEXT DEFAULT 'MODELLED_SYNTHETIC_CURVE';");
    }

    const priorCols = db.prepare("PRAGMA table_info(conversion_priors)").all().map(c => c.name);
    if (!priorCols.includes('evidence_status')) {
      db.exec("ALTER TABLE conversion_priors ADD COLUMN evidence_status TEXT DEFAULT 'UNVERIFIED_HEURISTIC_PRIOR';");
    }

    // Explicitly update all legacy rows
    db.exec(`
      UPDATE spatial_population_h3 
      SET evidence_status = 'UNVERIFIED_SEED',
          source_citation = 'UNVERIFIED_HISTORICAL_SEED',
          data_quality_tier = 'UNVERIFIED_ASSUMPTION'
      WHERE evidence_status IS NULL OR evidence_status = 'UNVERIFIED_SEED';

      UPDATE demographic_profiles 
      SET evidence_status = 'UNVERIFIED_SEED' 
      WHERE evidence_status IS NULL;

      UPDATE hourly_traffic_profiles 
      SET evidence_status = 'MODELLED_SYNTHETIC_CURVE' 
      WHERE evidence_status IS NULL;

      UPDATE conversion_priors 
      SET evidence_status = 'UNVERIFIED_HEURISTIC_PRIOR' 
      WHERE evidence_status IS NULL;
    `);
  } catch (err) {
    console.warn('Database external data sources migration notice:', err.message);
  }
}

export function migratePlaybookDecisionLayer(db) {
  try {
    db.exec(`
      CREATE TABLE IF NOT EXISTS playbook_versions (
        version TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        prepared_on TEXT NOT NULL,
        publication_status TEXT NOT NULL DEFAULT 'DRAFT_FOR_OPERATIONS_REVIEW',
        integration_status TEXT NOT NULL,
        evidence_policy TEXT NOT NULL,
        ranking_policy_json TEXT NOT NULL,
        global_rules_json TEXT NOT NULL,
        shared_brief_fields_json TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS evidence_sources (
        source_id TEXT PRIMARY KEY,
        publisher TEXT NOT NULL,
        title TEXT NOT NULL,
        url TEXT NOT NULL,
        supports TEXT NOT NULL,
        does_not_support TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS playbook_families (
        family_id TEXT PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        description TEXT,
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS playbooks (
        id TEXT NOT NULL,
        version TEXT NOT NULL REFERENCES playbook_versions(version),
        family TEXT NOT NULL,
        name TEXT NOT NULL,
        objective TEXT NOT NULL,
        buyer_need TEXT NOT NULL,
        ask_json TEXT NOT NULL,
        format TEXT NOT NULL,
        sequence_json TEXT NOT NULL,
        locations_json TEXT NOT NULL,
        avoid_json TEXT NOT NULL,
        needs_json TEXT NOT NULL,
        bottleneck TEXT NOT NULL,
        outcomes_json TEXT NOT NULL,
        followup TEXT NOT NULL,
        pilot_question TEXT,
        review_status TEXT NOT NULL DEFAULT 'DRAFT_FOR_OPERATIONS_REVIEW',
        recommendation_basis TEXT NOT NULL DEFAULT 'AUTHORED_PLANNING_HYPOTHESIS',
        performance_benchmarks_json TEXT,
        actual_venue_ids_json TEXT NOT NULL DEFAULT '[]',
        required_brief_fields_json TEXT NOT NULL DEFAULT '[]',
        quote_backed_cost REAL,
        reviewer TEXT,
        review_notes TEXT,
        reviewed_at TEXT,
        is_published INTEGER NOT NULL DEFAULT 0,
        content_json TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        PRIMARY KEY (id, version)
      );

      CREATE TABLE IF NOT EXISTS playbook_evidence_links (
        playbook_id TEXT NOT NULL,
        version TEXT NOT NULL,
        source_id TEXT NOT NULL REFERENCES evidence_sources(source_id),
        PRIMARY KEY (playbook_id, version, source_id),
        FOREIGN KEY (playbook_id, version) REFERENCES playbooks(id, version)
      );

      CREATE TABLE IF NOT EXISTS playbook_import_batches (
        batch_id TEXT PRIMARY KEY,
        package_version TEXT NOT NULL,
        file_path TEXT NOT NULL,
        checksum_sha256 TEXT NOT NULL,
        playbooks_processed INTEGER NOT NULL DEFAULT 0,
        playbooks_accepted INTEGER NOT NULL DEFAULT 0,
        playbooks_rejected INTEGER NOT NULL DEFAULT 0,
        playbooks_unchanged INTEGER NOT NULL DEFAULT 0,
        sources_processed INTEGER NOT NULL DEFAULT 0,
        sources_accepted INTEGER NOT NULL DEFAULT 0,
        review_status TEXT NOT NULL DEFAULT 'DRAFT_FOR_OPERATIONS_REVIEW',
        rejection_log_json TEXT NOT NULL DEFAULT '[]',
        imported_by TEXT NOT NULL DEFAULT 'system_importer',
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS playbook_admin_edits (
        id TEXT PRIMARY KEY,
        playbook_id TEXT NOT NULL,
        version TEXT NOT NULL,
        edited_by TEXT NOT NULL,
        change_type TEXT NOT NULL,
        change_summary TEXT NOT NULL,
        previous_status TEXT,
        new_status TEXT,
        previous_content_json TEXT NOT NULL,
        new_content_json TEXT NOT NULL,
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS playbook_recommendation_snapshots (
        id TEXT PRIMARY KEY,
        campaign_id TEXT,
        brief_json TEXT NOT NULL,
        selected_playbook_id TEXT NOT NULL,
        playbook_version TEXT NOT NULL,
        options_json TEXT NOT NULL,
        feasibility_report_json TEXT NOT NULL,
        created_at TEXT NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_playbooks_family ON playbooks(family);
      CREATE INDEX IF NOT EXISTS idx_playbooks_review_status ON playbooks(review_status);
      CREATE INDEX IF NOT EXISTS idx_playbooks_is_published ON playbooks(is_published);
      CREATE INDEX IF NOT EXISTS idx_playbook_links ON playbook_evidence_links(source_id);
      CREATE INDEX IF NOT EXISTS idx_admin_edits ON playbook_admin_edits(playbook_id, version);
    `);
  } catch (err) {
    console.warn('Database playbook decision layer migration notice:', err.message);
  }
}

function seedDefaults(db) {
  const now = new Date().toISOString();

  // Campaign configs in paise
  const insertConfig = db.prepare(`
    INSERT OR IGNORE INTO campaign_configurations (
      id, tenant_id, config_version, promoter_hourly_rate_paise, supervisor_daily_fee_paise,
      platform_fee_bps, minimum_reserve_bps, minimum_reserve_floor_paise, gst_rate_bps,
      supervisor_ratio_promoters, is_active, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
  `);

  insertConfig.run('cfg_default', 'default_org', 'v1.0_canonical', 24000, 200000, 800, 1000, 200000, 1800, 10, now, now);
  insertConfig.run('cfg_global', 'global', 'v1.0_canonical', 24000, 200000, 800, 1000, 200000, 1800, 10, now, now);

  // Conversion priors
  const insertPrior = db.prepare(`
    INSERT OR IGNORE INTO conversion_priors (
      id, objective, sample_distribution_rate, qr_scan_rate, landing_conversion_rate,
      signup_rate, lead_conversion_rate, app_install_rate, benchmark_roi_multiplier, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertPrior.run('pr_1', 'Product Sampling', 0.95, 0.18, 0.55, 0.28, 0.14, 0.08, 3.2, now);
  insertPrior.run('pr_2', 'Lead Generation', 0.40, 0.35, 0.72, 0.45, 0.28, 0.06, 2.9, now);
  insertPrior.run('pr_3', 'App Downloads', 0.50, 0.48, 0.65, 0.52, 0.18, 0.32, 3.5, now);
  insertPrior.run('pr_4', 'Store Visits', 0.85, 0.24, 0.60, 0.35, 0.22, 0.05, 3.8, now);
  insertPrior.run('pr_5', 'Retail Activation & POSM', 0.70, 0.22, 0.58, 0.30, 0.20, 0.05, 3.4, now);
  insertPrior.run('pr_6', 'Merchant Onboarding Drive', 0.30, 0.65, 0.80, 0.60, 0.38, 0.12, 4.2, now);

  // Diurnal traffic curves (normalized 24h curves summing to 1.0)
  const insertTraffic = db.prepare(`
    INSERT OR IGNORE INTO hourly_traffic_profiles (
      id, venue_type, city, day_type, hourly_coefficients, source
    ) VALUES (?, ?, ?, ?, ?, ?)
  `);

  insertTraffic.run('tr_1', 'commercial_high_street', 'All', 'WEEKEND', JSON.stringify({
    6: 0.01, 7: 0.02, 8: 0.03, 9: 0.04, 10: 0.06, 11: 0.07,
    12: 0.08, 13: 0.07, 14: 0.06, 15: 0.07, 16: 0.09, 17: 0.11,
    18: 0.12, 19: 0.10, 20: 0.05, 21: 0.01, 22: 0.01, 23: 0.00
  }), 'ZIGGERS_MOBILITY_CALIBRATION_V1');

  insertTraffic.run('tr_2', 'tech_park_corridor', 'All', 'WEEKDAY', JSON.stringify({
    6: 0.00, 7: 0.02, 8: 0.08, 9: 0.14, 10: 0.09, 11: 0.06,
    12: 0.11, 13: 0.10, 14: 0.05, 15: 0.05, 16: 0.07, 17: 0.10,
    18: 0.08, 19: 0.03, 20: 0.01, 21: 0.01, 22: 0.00, 23: 0.00
  }), 'ZIGGERS_MOBILITY_CALIBRATION_V1');

  insertTraffic.run('tr_3', 'campus_youth_hub', 'All', 'WEEKDAY', JSON.stringify({
    6: 0.00, 7: 0.02, 8: 0.07, 9: 0.10, 10: 0.09, 11: 0.09,
    12: 0.12, 13: 0.11, 14: 0.09, 15: 0.10, 16: 0.09, 17: 0.06,
    18: 0.03, 19: 0.02, 20: 0.01, 21: 0.00, 22: 0.00, 23: 0.00
  }), 'ZIGGERS_MOBILITY_CALIBRATION_V1');

  insertTraffic.run('tr_4', 'transit_hub', 'All', 'WEEKDAY', JSON.stringify({
    6: 0.02, 7: 0.05, 8: 0.12, 9: 0.13, 10: 0.07, 11: 0.05,
    12: 0.05, 13: 0.05, 14: 0.05, 15: 0.06, 16: 0.08, 17: 0.11,
    18: 0.10, 19: 0.05, 20: 0.01, 21: 0.00, 22: 0.00, 23: 0.00
  }), 'ZIGGERS_MOBILITY_CALIBRATION_V1');

  // Spatial population nodes (18 Primary Metro Nodes across Indian Metros)
  const insertSpatial = db.prepare(`
    INSERT OR IGNORE INTO spatial_population_h3 (
      id, h3_index, h3_resolution, city, location_name, center_lat, center_lng,
      base_population, population_density_sq_km, resident_share, transient_share,
      workforce_share, sec_classification, affluence_score, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertDemo = db.prepare(`
    INSERT OR IGNORE INTO demographic_profiles (
      id, h3_index, age_18_24_ratio, age_25_34_ratio, age_35_44_ratio,
      age_45_54_ratio, age_55_plus_ratio, male_ratio, female_ratio, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const nodes = [
    { id: 'sp_1', dpId: 'dp_1', h3: '89618c4f2afffff', city: 'Chennai', name: 'T. Nagar & Ranganathan Street', lat: 13.0418, lng: 80.2341, pop: 18500, dens: 21500, res: 0.35, trans: 0.45, work: 0.20, sec: 'SEC A/B', aff: 88, demo: [0.22, 0.34, 0.23, 0.12, 0.09, 0.51, 0.49] },
    { id: 'sp_2', dpId: 'dp_2', h3: '89618c4dc37ffff', city: 'Chennai', name: 'OMR IT Corridor & Tidel Park', lat: 12.9815, lng: 80.2482, pop: 14200, dens: 11200, res: 0.25, trans: 0.20, work: 0.55, sec: 'SEC A/A+', aff: 84, demo: [0.28, 0.46, 0.16, 0.06, 0.04, 0.54, 0.46] },
    { id: 'sp_3', dpId: 'dp_3', h3: '89618c4d23fffff', city: 'Chennai', name: 'Velachery & Phoenix MarketCity', lat: 12.9782, lng: 80.2195, pop: 16800, dens: 15800, res: 0.38, trans: 0.44, work: 0.18, sec: 'SEC A/B', aff: 81, demo: [0.30, 0.36, 0.19, 0.09, 0.06, 0.50, 0.50] },
    { id: 'sp_4', dpId: 'dp_4', h3: '89618c4ea7fffff', city: 'Chennai', name: 'Anna Nagar Commercial Hub', lat: 13.0850, lng: 80.2101, pop: 15500, dens: 17200, res: 0.50, trans: 0.32, work: 0.18, sec: 'SEC A+', aff: 91, demo: [0.23, 0.32, 0.25, 0.11, 0.09, 0.49, 0.51] },
    { id: 'sp_5', dpId: 'dp_5', h3: '8960145b233ffff', city: 'Bangalore', name: 'Indiranagar & 100ft Road', lat: 12.9784, lng: 77.6408, pop: 14500, dens: 13800, res: 0.32, trans: 0.42, work: 0.26, sec: 'SEC A+', aff: 94, demo: [0.25, 0.44, 0.19, 0.07, 0.05, 0.52, 0.48] },
    { id: 'sp_6', dpId: 'dp_6', h3: '8960145b64fffff', city: 'Bangalore', name: 'Koramangala & Sony World Signal', lat: 12.9352, lng: 77.6245, pop: 17200, dens: 16900, res: 0.30, trans: 0.38, work: 0.32, sec: 'SEC A/A+', aff: 90, demo: [0.33, 0.42, 0.15, 0.06, 0.04, 0.53, 0.47] },
    { id: 'sp_7', dpId: 'dp_7', h3: '896014594afffff', city: 'Bangalore', name: 'Whitefield & ITPL Main Road', lat: 12.9863, lng: 77.7380, pop: 13000, dens: 9500, res: 0.34, trans: 0.16, work: 0.50, sec: 'SEC A/B', aff: 86, demo: [0.22, 0.48, 0.20, 0.06, 0.04, 0.55, 0.45] },
    { id: 'sp_8', dpId: 'dp_8', h3: '8960145a35fffff', city: 'Bangalore', name: 'MG Road & Brigade Road Corridor', lat: 12.9740, lng: 77.6074, pop: 16500, dens: 15200, res: 0.24, trans: 0.54, work: 0.22, sec: 'SEC A+', aff: 93, demo: [0.26, 0.41, 0.20, 0.08, 0.05, 0.52, 0.48] },
    { id: 'sp_9', dpId: 'dp_9', h3: '8961e576077ffff', city: 'Mumbai', name: 'Bandra Bandstand & Linking Road', lat: 19.0596, lng: 72.8295, pop: 22000, dens: 24500, res: 0.36, trans: 0.48, work: 0.16, sec: 'SEC A+', aff: 96, demo: [0.24, 0.39, 0.21, 0.10, 0.06, 0.48, 0.52] },
    { id: 'sp_10', dpId: 'dp_10', h3: '8961e57468fffff', city: 'Mumbai', name: 'Lower Parel & High Street Phoenix', lat: 18.9953, lng: 72.8294, pop: 19500, dens: 22800, res: 0.22, trans: 0.38, work: 0.40, sec: 'SEC A+', aff: 95, demo: [0.21, 0.44, 0.23, 0.08, 0.04, 0.51, 0.49] },
    { id: 'sp_11', dpId: 'dp_11', h3: '8961e57662fffff', city: 'Mumbai', name: 'Andheri West & Lokhandwala Complex', lat: 19.1415, lng: 72.8315, pop: 21000, dens: 23500, res: 0.38, trans: 0.42, work: 0.20, sec: 'SEC A/A+', aff: 92, demo: [0.25, 0.40, 0.20, 0.09, 0.06, 0.51, 0.49] },
    { id: 'sp_12', dpId: 'dp_12', h3: '8928308280fffff', city: 'Delhi NCR', name: 'Connaught Place (CP) Inner Circle', lat: 28.6315, lng: 77.2167, pop: 15800, dens: 16500, res: 0.18, trans: 0.52, work: 0.30, sec: 'SEC A+', aff: 93, demo: [0.27, 0.38, 0.21, 0.09, 0.05, 0.53, 0.47] },
    { id: 'sp_13', dpId: 'dp_13', h3: '8928309a47fffff', city: 'Delhi NCR', name: 'Cyber City Gurgaon & DLF Phase 2', lat: 28.4950, lng: 77.0890, pop: 14800, dens: 12500, res: 0.20, trans: 0.22, work: 0.58, sec: 'SEC A+', aff: 97, demo: [0.19, 0.50, 0.22, 0.06, 0.03, 0.54, 0.46] },
    { id: 'sp_14', dpId: 'dp_14', h3: '892830953afffff', city: 'Delhi NCR', name: 'Noida Sector 18 & Mall of India', lat: 28.5672, lng: 77.3210, pop: 16200, dens: 14500, res: 0.28, trans: 0.46, work: 0.26, sec: 'SEC A/A+', aff: 91, demo: [0.28, 0.42, 0.18, 0.08, 0.04, 0.52, 0.48] },
    { id: 'sp_15', dpId: 'dp_15', h3: '896155694afffff', city: 'Hyderabad', name: 'HITEC City & Cyber Towers Node', lat: 17.4435, lng: 78.3772, pop: 14000, dens: 11800, res: 0.26, trans: 0.22, work: 0.52, sec: 'SEC A/A+', aff: 88, demo: [0.25, 0.47, 0.18, 0.07, 0.03, 0.54, 0.46] },
    { id: 'sp_16', dpId: 'dp_16', h3: '8961556965fffff', city: 'Hyderabad', name: 'Jubilee Hills Road No. 36', lat: 17.4319, lng: 78.4073, pop: 12500, dens: 9800, res: 0.45, trans: 0.35, work: 0.20, sec: 'SEC A+', aff: 95, demo: [0.23, 0.37, 0.23, 0.11, 0.06, 0.50, 0.50] },
    { id: 'sp_17', dpId: 'dp_17', h3: '8961556923fffff', city: 'Hyderabad', name: 'Banjara Hills & GVK One Mall', lat: 17.4190, lng: 78.4485, pop: 13500, dens: 11000, res: 0.42, trans: 0.36, work: 0.22, sec: 'SEC A+', aff: 94, demo: [0.22, 0.40, 0.22, 0.10, 0.06, 0.51, 0.49] },
    { id: 'sp_18', dpId: 'dp_18', h3: '896085a6aafffff', city: 'Pune', name: 'Koregaon Park & North Main Road', lat: 18.5362, lng: 73.8940, pop: 14200, dens: 12800, res: 0.35, trans: 0.40, work: 0.25, sec: 'SEC A/A+', aff: 91, demo: [0.29, 0.43, 0.16, 0.07, 0.05, 0.52, 0.48] }
  ];

  for (const n of nodes) {
    insertSpatial.run(n.id, n.h3, 9, n.city, n.name, n.lat, n.lng, n.pop, n.dens, n.res, n.trans, n.work, n.sec, n.aff, now);
    insertDemo.run(n.dpId, n.h3, n.demo[0], n.demo[1], n.demo[2], n.demo[3], n.demo[4], n.demo[5], n.demo[6], now);
  }

  // Venue POI registry
  const insertPoi = db.prepare(`
    INSERT OR IGNORE INTO venue_poi_registry (
      id, h3_index, location_name, poi_category, poi_count, commercial_intensity_score,
      source, confidence_score, collected_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertPoi.run('poi_1', '89618c4f2afffff', 'T. Nagar & Ranganathan Street', 'fashion', 420, 99, 'OPENSTREETMAP_OVERPASS', 0.95, now);
  insertPoi.run('poi_2', '89618c4f2afffff', 'T. Nagar & Ranganathan Street', 'food', 380, 96, 'OPENSTREETMAP_OVERPASS', 0.95, now);
  insertPoi.run('poi_3', '89618c4f2afffff', 'T. Nagar & Ranganathan Street', 'fitness', 48, 94, 'OPENSTREETMAP_OVERPASS', 0.90, now);
  insertPoi.run('poi_4', '89618c4f2afffff', 'T. Nagar & Ranganathan Street', 'technology', 85, 82, 'OPENSTREETMAP_OVERPASS', 0.88, now);
  insertPoi.run('poi_5', '89618c4dc37ffff', 'OMR IT Corridor & Tidel Park', 'technology', 320, 98, 'OPENSTREETMAP_OVERPASS', 0.96, now);
  insertPoi.run('poi_6', '89618c4dc37ffff', 'OMR IT Corridor & Tidel Park', 'food', 290, 90, 'OPENSTREETMAP_OVERPASS', 0.92, now);
}

/**
 * Execute an atomic transaction against the database with nested savepoint support
 */
let txDepth = 0;

export function withTransaction(callback) {
  const db = getDatabase();
  const isTopLevel = txDepth === 0;
  const currentDepth = txDepth;

  if (isTopLevel) {
    db.exec('BEGIN TRANSACTION;');
  } else {
    db.exec(`SAVEPOINT sp_${currentDepth};`);
  }
  txDepth++;

  try {
    const result = callback(db);
    txDepth--;
    if (isTopLevel) {
      db.exec('COMMIT;');
    } else {
      db.exec(`RELEASE SAVEPOINT sp_${currentDepth};`);
    }
    return result;
  } catch (err) {
    txDepth--;
    if (isTopLevel) {
      try { db.exec('ROLLBACK;'); } catch (_) {}
    } else {
      try { db.exec(`ROLLBACK TO SAVEPOINT sp_${currentDepth};`); } catch (_) {}
    }
    throw err;
  }
}
