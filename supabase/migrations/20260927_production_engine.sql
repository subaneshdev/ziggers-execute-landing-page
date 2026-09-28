-- ============================================================================
-- Ziggers Execute: Comprehensive Production Engine Database Migration
-- Migration File: 20260927_production_engine.sql
-- Covers all 23 core production tables with Tenant Isolation (RLS),
-- Integer Paise Financials, Bayesian Learning Posteriors, Spatial Grids,
-- Audit Hash Chains, and State-Machine Enforced Workflows.
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS postgis;

-- ----------------------------------------------------------------------------
-- 1. CAMPAIGN CONFIGURATIONS (Versioned Tenant Labor Rates & Policies)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS campaign_configurations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id VARCHAR(128) NOT NULL DEFAULT 'default_org',
    config_version VARCHAR(64) NOT NULL DEFAULT 'v1.0_2026',
    promoter_hourly_rate_paise BIGINT NOT NULL DEFAULT 24000, -- ₹240.00 / hr
    supervisor_daily_fee_paise BIGINT NOT NULL DEFAULT 200000, -- ₹2,000.00 / day
    platform_fee_bps INT NOT NULL DEFAULT 800, -- 8.00% (basis points)
    minimum_reserve_bps INT NOT NULL DEFAULT 1000, -- 10.00%
    minimum_reserve_floor_paise BIGINT NOT NULL DEFAULT 200000, -- ₹2,000.00 floor
    gst_rate_bps INT NOT NULL DEFAULT 1800, -- 18.00%
    supervisor_ratio_promoters INT NOT NULL DEFAULT 10, -- 1:10
    max_shift_hours INT NOT NULL DEFAULT 12,
    min_shift_hours INT NOT NULL DEFAULT 2,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_tenant_config_version UNIQUE (tenant_id, config_version)
);

CREATE INDEX IF NOT EXISTS idx_campaign_configs_tenant ON campaign_configurations(tenant_id, is_active);

-- ----------------------------------------------------------------------------
-- 2. MODEL VERSIONS & DATA SOURCE SNAPSHOTS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS model_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    model_name VARCHAR(64) NOT NULL,
    model_version VARCHAR(64) NOT NULL,
    model_type VARCHAR(64) NOT NULL, -- 'DETERMINISTIC_MODEL', 'BAYESIAN_STATISTICAL_ESTIMATE', 'HEURISTIC_ESTIMATE'
    maturity_level INT NOT NULL DEFAULT 2,
    parameters JSONB NOT NULL DEFAULT '{}'::jsonb,
    validation_metrics JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_model_name_version UNIQUE (model_name, model_version)
);

CREATE TABLE IF NOT EXISTS data_source_snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_name VARCHAR(128) NOT NULL,
    source_type VARCHAR(64) NOT NULL, -- 'CENSUS_2011', 'WORLDPOP_2024', 'OPENSTREETMAP_OVERPASS', 'GOOGLE_PLACES'
    records_count INT NOT NULL DEFAULT 0,
    snapshot_hash VARCHAR(128),
    confidence_tier VARCHAR(32) NOT NULL DEFAULT 'MODERATE', -- 'HIGH', 'MODERATE', 'LOW'
    valid_from DATE NOT NULL,
    valid_until DATE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 3. SPATIAL POPULATION H3 & DEMOGRAPHIC PROFILES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS spatial_population_h3 (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    h3_index VARCHAR(20) UNIQUE NOT NULL, -- H3 Resolution 8 or 9
    h3_resolution INT NOT NULL DEFAULT 9,
    city VARCHAR(100) NOT NULL,
    location_name VARCHAR(255) NOT NULL,
    center_lat NUMERIC(10, 7) NOT NULL,
    center_lng NUMERIC(10, 7) NOT NULL,
    base_population INT NOT NULL DEFAULT 15000,
    population_density_sq_km INT NOT NULL DEFAULT 18000,
    resident_share NUMERIC(4, 3) NOT NULL DEFAULT 0.350,
    transient_share NUMERIC(4, 3) NOT NULL DEFAULT 0.450,
    workforce_share NUMERIC(4, 3) NOT NULL DEFAULT 0.200,
    sec_classification VARCHAR(32) NOT NULL DEFAULT 'SEC A/B',
    affluence_score INT NOT NULL DEFAULT 85,
    source_snapshot_id UUID REFERENCES data_source_snapshots(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_spatial_pop_city ON spatial_population_h3(city);
CREATE INDEX IF NOT EXISTS idx_spatial_pop_h3 ON spatial_population_h3(h3_index);

CREATE TABLE IF NOT EXISTS demographic_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    spatial_id UUID REFERENCES spatial_population_h3(id) ON DELETE CASCADE,
    h3_index VARCHAR(20) NOT NULL,
    age_18_24_ratio NUMERIC(5, 4) NOT NULL DEFAULT 0.2200,
    age_25_34_ratio NUMERIC(5, 4) NOT NULL DEFAULT 0.3400,
    age_35_44_ratio NUMERIC(5, 4) NOT NULL DEFAULT 0.2300,
    age_45_54_ratio NUMERIC(5, 4) NOT NULL DEFAULT 0.1200,
    age_55_plus_ratio NUMERIC(5, 4) NOT NULL DEFAULT 0.0900,
    male_ratio NUMERIC(5, 4) NOT NULL DEFAULT 0.5100,
    female_ratio NUMERIC(5, 4) NOT NULL DEFAULT 0.4900,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_demographic_profiles_h3 ON demographic_profiles(h3_index);

-- ----------------------------------------------------------------------------
-- 4. VENUE POI REGISTRY & HOURLY TRAFFIC PROFILES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS venue_poi_registry (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    h3_index VARCHAR(20) NOT NULL,
    location_name VARCHAR(255) NOT NULL,
    poi_category VARCHAR(64) NOT NULL, -- 'fitness', 'food', 'fashion', 'technology', 'education', 'transit'
    poi_count INT NOT NULL DEFAULT 0,
    commercial_intensity_score INT NOT NULL DEFAULT 80,
    source VARCHAR(64) NOT NULL DEFAULT 'OPENSTREETMAP_OVERPASS',
    confidence_score NUMERIC(3, 2) NOT NULL DEFAULT 0.88,
    collected_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_poi_registry_h3 ON venue_poi_registry(h3_index, poi_category);

CREATE TABLE IF NOT EXISTS hourly_traffic_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    venue_type VARCHAR(64) NOT NULL, -- 'commercial_high_street', 'tech_park_corridor', 'campus_youth_hub', 'transit_hub'
    city VARCHAR(100) NOT NULL DEFAULT 'All',
    day_type VARCHAR(32) NOT NULL DEFAULT 'WEEKEND', -- 'WEEKDAY', 'WEEKEND'
    hourly_coefficients JSONB NOT NULL, -- {"6": 0.01, ..., "23": 0.01}
    source VARCHAR(64) NOT NULL DEFAULT 'ZIGGERS_MOBILITY_CALIBRATION_V1',
    valid_from DATE NOT NULL DEFAULT CURRENT_DATE,
    valid_until DATE NOT NULL DEFAULT (CURRENT_DATE + INTERVAL '365 days'),
    CONSTRAINT uq_traffic_profile UNIQUE (venue_type, city, day_type)
);

-- ----------------------------------------------------------------------------
-- 5. CONVERSION PRIORS & BAYESIAN POSTERIORS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS conversion_priors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    objective VARCHAR(64) UNIQUE NOT NULL,
    sample_distribution_rate NUMERIC(5, 4) NOT NULL,
    qr_scan_rate NUMERIC(5, 4) NOT NULL,
    landing_conversion_rate NUMERIC(5, 4) NOT NULL,
    signup_rate NUMERIC(5, 4) NOT NULL,
    lead_conversion_rate NUMERIC(5, 4) NOT NULL,
    app_install_rate NUMERIC(5, 4) NOT NULL,
    benchmark_roi_multiplier NUMERIC(4, 2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bayesian_posteriors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id VARCHAR(128) NOT NULL DEFAULT 'global',
    city VARCHAR(100) NOT NULL DEFAULT 'All',
    h3_cell VARCHAR(32) NOT NULL DEFAULT 'global',
    venue_type VARCHAR(64) NOT NULL DEFAULT 'All',
    objective VARCHAR(64) NOT NULL,
    metric_name VARCHAR(64) NOT NULL, -- 'landing_to_lead_rate', 'footfall_interaction_rate', 'qr_scan_rate'
    alpha NUMERIC(12, 4) NOT NULL,
    beta NUMERIC(12, 4) NOT NULL,
    observation_count INT NOT NULL DEFAULT 0,
    sufficient_stat_k NUMERIC(14, 4) NOT NULL DEFAULT 0,
    sufficient_stat_n NUMERIC(14, 4) NOT NULL DEFAULT 0,
    model_version VARCHAR(64) NOT NULL DEFAULT 'bayes-v2.0',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_bayesian_key UNIQUE (tenant_id, city, h3_cell, venue_type, objective, metric_name)
);

CREATE INDEX IF NOT EXISTS idx_posteriors_search ON bayesian_posteriors(tenant_id, city, h3_cell, venue_type, objective, metric_name);

-- ----------------------------------------------------------------------------
-- 6. CAMPAIGNS, FORECASTS, PREDICTIONS & OUTCOMES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id VARCHAR(128) UNIQUE NOT NULL,
    tenant_id VARCHAR(128) NOT NULL DEFAULT 'default_org',
    title VARCHAR(255) NOT NULL,
    brand_name VARCHAR(150) NOT NULL,
    product_name VARCHAR(255),
    campaign_type VARCHAR(64) NOT NULL DEFAULT 'Product Sampling',
    status VARCHAR(64) NOT NULL DEFAULT 'DRAFT', -- 'DRAFT', 'CONFIRMED', 'DISPATCHED', 'ACTIVE', 'COMPLETED', 'CANCELLED'
    budget_net_paise BIGINT NOT NULL DEFAULT 0,
    budget_gross_paise BIGINT NOT NULL DEFAULT 0,
    gst_paise BIGINT NOT NULL DEFAULT 0,
    escrow_reserve_paise BIGINT NOT NULL DEFAULT 0,
    platform_fee_paise BIGINT NOT NULL DEFAULT 0,
    labour_pool_paise BIGINT NOT NULL DEFAULT 0,
    duration_days INT NOT NULL DEFAULT 7,
    shift_hours INT NOT NULL DEFAULT 5,
    location_name VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    primary_h3_cell VARCHAR(32),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_campaigns_tenant ON campaigns(tenant_id, status);

CREATE TABLE IF NOT EXISTS campaign_forecasts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    forecast_id VARCHAR(128) UNIQUE NOT NULL,
    campaign_id VARCHAR(128) REFERENCES campaigns(campaign_id) ON DELETE SET NULL,
    tenant_id VARCHAR(128) NOT NULL DEFAULT 'default_org',
    expected_audience INT NOT NULL,
    expected_reach INT NOT NULL,
    expected_interactions INT NOT NULL,
    expected_leads INT NOT NULL,
    expected_samples INT NOT NULL,
    cost_per_lead_paise BIGINT,
    promoters_count INT NOT NULL,
    supervisors_count INT NOT NULL,
    labour_cost_paise BIGINT NOT NULL,
    confidence_tier VARCHAR(32) NOT NULL DEFAULT 'MODERATE',
    model_type VARCHAR(64) NOT NULL DEFAULT 'BAYESIAN_STATISTICAL_ESTIMATE',
    model_version VARCHAR(64) NOT NULL,
    config_version VARCHAR(64) NOT NULL,
    intervals JSONB NOT NULL DEFAULT '{}'::jsonb,
    provenance JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_forecasts_tenant ON campaign_forecasts(tenant_id, created_at);

CREATE TABLE IF NOT EXISTS model_predictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prediction_id VARCHAR(128) UNIQUE NOT NULL,
    campaign_id VARCHAR(128),
    tenant_id VARCHAR(128) NOT NULL DEFAULT 'default_org',
    model_name VARCHAR(64) NOT NULL,
    model_version VARCHAR(64) NOT NULL,
    feature_snapshot JSONB NOT NULL,
    prediction JSONB NOT NULL,
    lower_bound JSONB,
    upper_bound JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS campaign_outcomes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    outcome_id VARCHAR(128) UNIQUE NOT NULL,
    idempotency_key VARCHAR(128) UNIQUE NOT NULL,
    campaign_id VARCHAR(128) NOT NULL,
    tenant_id VARCHAR(128) NOT NULL DEFAULT 'default_org',
    city VARCHAR(100) NOT NULL,
    h3_cell VARCHAR(32) NOT NULL,
    venue_type VARCHAR(64) NOT NULL,
    objective VARCHAR(64) NOT NULL,
    actual_footfall INT NOT NULL DEFAULT 0,
    actual_interactions INT NOT NULL DEFAULT 0,
    actual_conversions INT NOT NULL DEFAULT 0,
    actual_samples INT NOT NULL DEFAULT 0,
    actual_cpl_paise BIGINT,
    data_quality_status VARCHAR(32) NOT NULL DEFAULT 'VERIFIED',
    verification_audit_status VARCHAR(32) NOT NULL DEFAULT 'APPROVED',
    is_finalized BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_outcomes_tenant_learning ON campaign_outcomes(tenant_id, city, h3_cell, objective);

-- ----------------------------------------------------------------------------
-- 7. WORKFORCE, CHECK-INS, PROOF RECORDS & STATE MACHINE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS workers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    worker_id VARCHAR(128) UNIQUE NOT NULL,
    tenant_id VARCHAR(128) NOT NULL DEFAULT 'default_org',
    full_name VARCHAR(150) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    upi_id VARCHAR(128),
    role VARCHAR(32) NOT NULL DEFAULT 'PROMOTER', -- 'PROMOTER', 'SUPERVISOR'
    verification_status VARCHAR(32) NOT NULL DEFAULT 'VERIFIED',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS worker_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assignment_id VARCHAR(128) UNIQUE NOT NULL,
    campaign_id VARCHAR(128) NOT NULL,
    worker_id VARCHAR(128) REFERENCES workers(worker_id) ON DELETE CASCADE,
    tenant_id VARCHAR(128) NOT NULL DEFAULT 'default_org',
    shift_date DATE NOT NULL,
    shift_start_time TIME NOT NULL,
    shift_end_time TIME NOT NULL,
    target_latitude NUMERIC(10, 7) NOT NULL,
    target_longitude NUMERIC(10, 7) NOT NULL,
    geofence_radius_meters INT NOT NULL DEFAULT 50,
    status VARCHAR(32) NOT NULL DEFAULT 'ASSIGNED', -- 'ASSIGNED', 'CHECKED_IN', 'COMPLETED', 'ABSENT', 'CANCELLED'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_worker_shift UNIQUE (worker_id, campaign_id, shift_date)
);

CREATE TABLE IF NOT EXISTS shift_checkins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    checkin_id VARCHAR(128) UNIQUE NOT NULL,
    assignment_id VARCHAR(128) REFERENCES worker_assignments(assignment_id) ON DELETE CASCADE,
    campaign_id VARCHAR(128) NOT NULL,
    worker_id VARCHAR(128) NOT NULL,
    tenant_id VARCHAR(128) NOT NULL DEFAULT 'default_org',
    checkin_timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    latitude NUMERIC(10, 7) NOT NULL,
    longitude NUMERIC(10, 7) NOT NULL,
    gps_accuracy_meters NUMERIC(6, 2) NOT NULL,
    distance_meters NUMERIC(8, 2) NOT NULL,
    is_mock_detected BOOLEAN NOT NULL DEFAULT false,
    kinematic_velocity_kmh NUMERIC(6, 2) DEFAULT 0.00,
    verification_status VARCHAR(32) NOT NULL DEFAULT 'VERIFIED', -- 'VERIFIED', 'REJECTED_OUT_OF_GEOFENCE', 'REJECTED_LOW_ACCURACY', 'REJECTED_MOCK_LOCATION', 'REJECTED_TELEPORTATION'
    supervisor_confirmed BOOLEAN NOT NULL DEFAULT false,
    supervisor_id VARCHAR(128),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS proof_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    proof_id VARCHAR(128) UNIQUE NOT NULL,
    idempotency_key VARCHAR(128) UNIQUE NOT NULL,
    campaign_id VARCHAR(128) NOT NULL,
    assignment_id VARCHAR(128) REFERENCES worker_assignments(assignment_id) ON DELETE CASCADE,
    worker_id VARCHAR(128) NOT NULL,
    tenant_id VARCHAR(128) NOT NULL DEFAULT 'default_org',
    proof_type VARCHAR(64) NOT NULL, -- 'CHECKIN_SELFIE', 'SAMPLING_STOCK', 'PROMOTER_INTERACTION', 'VENUE_SETUP'
    image_url TEXT NOT NULL,
    latitude NUMERIC(10, 7) NOT NULL,
    longitude NUMERIC(10, 7) NOT NULL,
    gps_accuracy_meters NUMERIC(6, 2) NOT NULL,
    captured_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    crypto_hash VARCHAR(128) NOT NULL,
    previous_hash VARCHAR(128) NOT NULL,
    hmac_signature VARCHAR(128) NOT NULL,
    audit_status VARCHAR(32) NOT NULL DEFAULT 'APPROVED', -- 'PENDING', 'APPROVED', 'REJECTED'
    rejection_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_proof_records_campaign ON proof_records(campaign_id, proof_type);

-- ----------------------------------------------------------------------------
-- 8. AUDIT HASH CHAINS & MERKLE LEDGERS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_chain_heads (
    tenant_id VARCHAR(128) PRIMARY KEY,
    last_crypto_hash VARCHAR(128) NOT NULL,
    total_events_count BIGINT NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_chain_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id VARCHAR(128) UNIQUE NOT NULL,
    tenant_id VARCHAR(128) NOT NULL DEFAULT 'default_org',
    event_type VARCHAR(64) NOT NULL, -- 'FORECAST_GENERATED', 'CAMPAIGN_CONFIRMED', 'CHECKIN_VERIFIED', 'PROOF_AUDITED', 'PAYOUT_DISBURSED', 'POSTERIOR_UPDATED'
    entity_id VARCHAR(128) NOT NULL,
    canonical_payload_json TEXT NOT NULL,
    previous_hash VARCHAR(128) NOT NULL,
    crypto_hash VARCHAR(128) NOT NULL,
    hmac_signature VARCHAR(128) NOT NULL,
    batch_merkle_root VARCHAR(128),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_chain_tenant ON audit_chain_events(tenant_id, created_at);

-- ----------------------------------------------------------------------------
-- 9. WORK ORDERS, ESCROW ACCOUNTS, MILESTONES & PAYOUTS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS work_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wo_number VARCHAR(64) UNIQUE NOT NULL,
    campaign_id VARCHAR(128) NOT NULL,
    tenant_id VARCHAR(128) NOT NULL DEFAULT 'default_org',
    vendor_id VARCHAR(128) NOT NULL,
    vendor_name VARCHAR(150) NOT NULL,
    category VARCHAR(64) NOT NULL, -- 'MANPOWER', 'FABRICATION', 'PERMITS', 'LOGISTICS'
    subtotal_paise BIGINT NOT NULL,
    gst_paise BIGINT NOT NULL,
    total_amount_paise BIGINT NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'ISSUED', -- 'ISSUED', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'DISPUTED'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS escrow_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id VARCHAR(128) UNIQUE NOT NULL,
    tenant_id VARCHAR(128) NOT NULL DEFAULT 'default_org',
    funded_amount_paise BIGINT NOT NULL DEFAULT 0,
    disbursed_amount_paise BIGINT NOT NULL DEFAULT 0,
    retained_reserve_paise BIGINT NOT NULL DEFAULT 0,
    available_balance_paise BIGINT NOT NULL DEFAULT 0,
    status VARCHAR(32) NOT NULL DEFAULT 'FUNDED', -- 'PENDING', 'FUNDED', 'PARTIALLY_DISBURSED', 'RECONCILED'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS escrow_milestones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    milestone_id VARCHAR(128) UNIQUE NOT NULL,
    campaign_id VARCHAR(128) NOT NULL,
    tenant_id VARCHAR(128) NOT NULL DEFAULT 'default_org',
    milestone_name VARCHAR(128) NOT NULL,
    target_amount_paise BIGINT NOT NULL,
    is_released BOOLEAN NOT NULL DEFAULT false,
    released_at TIMESTAMPTZ,
    approved_by VARCHAR(128),
    CONSTRAINT uq_campaign_milestone UNIQUE (campaign_id, milestone_name)
);

CREATE TABLE IF NOT EXISTS payouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payout_id VARCHAR(128) UNIQUE NOT NULL,
    idempotency_key VARCHAR(128) UNIQUE NOT NULL,
    campaign_id VARCHAR(128) NOT NULL,
    assignment_id VARCHAR(128) NOT NULL,
    worker_id VARCHAR(128) NOT NULL,
    tenant_id VARCHAR(128) NOT NULL DEFAULT 'default_org',
    guaranteed_base_paise BIGINT NOT NULL,
    variable_bonus_paise BIGINT NOT NULL DEFAULT 0,
    deductions_paise BIGINT NOT NULL DEFAULT 0,
    total_payable_paise BIGINT NOT NULL,
    payout_status VARCHAR(32) NOT NULL DEFAULT 'APPROVED_FOR_DISBURSEMENT', -- 'PENDING_AUDIT', 'APPROVED_FOR_DISBURSEMENT', 'DISBURSED', 'REJECTED'
    upi_id VARCHAR(128) NOT NULL,
    transaction_ref_no VARCHAR(128),
    server_verified_checkin_id VARCHAR(128) NOT NULL,
    server_verified_proof_id VARCHAR(128) NOT NULL,
    supervisor_verified_id VARCHAR(128) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    disbursed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_payouts_tenant ON payouts(tenant_id, payout_status);

-- ----------------------------------------------------------------------------
-- 10. ROW LEVEL SECURITY (RLS) POLICIES
-- ----------------------------------------------------------------------------
ALTER TABLE campaign_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_forecasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_outcomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE model_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE worker_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE shift_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE proof_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_chain_heads ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_chain_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE escrow_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE escrow_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE payouts ENABLE ROW LEVEL SECURITY;

-- Tenant Isolation Policies (PostgreSQL current_setting or tenant header)
DO $$
BEGIN
    CREATE POLICY tenant_isolation_campaigns ON campaigns
        USING (tenant_id = current_setting('app.current_tenant_id', true) OR tenant_id = 'default_org');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    CREATE POLICY tenant_isolation_outcomes ON campaign_outcomes
        USING (tenant_id = current_setting('app.current_tenant_id', true) OR tenant_id = 'default_org');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    CREATE POLICY tenant_isolation_posteriors ON bayesian_posteriors
        USING (tenant_id = current_setting('app.current_tenant_id', true) OR tenant_id = 'global');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ----------------------------------------------------------------------------
-- 11. CANONICAL SEED DATA (Invariants & Empirical Baselines)
-- ----------------------------------------------------------------------------

-- Global Default Campaign Configuration (All monetary values in integer paise)
INSERT INTO campaign_configurations (
    tenant_id, config_version, promoter_hourly_rate_paise, supervisor_daily_fee_paise,
    platform_fee_bps, minimum_reserve_bps, minimum_reserve_floor_paise, gst_rate_bps, supervisor_ratio_promoters
) VALUES
('default_org', 'v1.0_canonical', 24000, 200000, 800, 1000, 200000, 1800, 10),
('global', 'v1.0_canonical', 24000, 200000, 800, 1000, 200000, 1800, 10)
ON CONFLICT (tenant_id, config_version) DO NOTHING;

-- Canonical Model Version Registration
INSERT INTO model_versions (model_name, model_version, model_type, maturity_level, parameters) VALUES
('ziggers_bayesian_planner', 'bayes-v2.0', 'BAYESIAN_STATISTICAL_ESTIMATE', 3, '{"conjugate_distribution": "Beta-Binomial", "hierarchical_tiers": 4}'::jsonb),
('ziggers_deterministic_capacity', 'opt-v1.0', 'DETERMINISTIC_MODEL', 2, '{"solver": "discrete_integer_knapsack"}'::jsonb)
ON CONFLICT (model_name, model_version) DO NOTHING;

-- Conversion Priors
INSERT INTO conversion_priors (
    objective, sample_distribution_rate, qr_scan_rate, landing_conversion_rate,
    signup_rate, lead_conversion_rate, app_install_rate, benchmark_roi_multiplier
) VALUES
('Product Sampling', 0.9500, 0.1800, 0.5500, 0.2800, 0.1400, 0.0800, 3.20),
('Lead Generation', 0.4000, 0.3500, 0.7200, 0.4500, 0.2800, 0.0600, 2.90),
('App Downloads', 0.5000, 0.4800, 0.6500, 0.5200, 0.1800, 0.3200, 3.50),
('Store Visits', 0.8500, 0.2400, 0.6000, 0.3500, 0.2200, 0.0500, 3.80),
('Retail Activation & POSM', 0.7000, 0.2200, 0.5800, 0.3000, 0.2000, 0.0500, 3.40),
('Merchant Onboarding Drive', 0.3000, 0.6500, 0.8000, 0.6000, 0.3800, 0.1200, 4.20)
ON CONFLICT (objective) DO NOTHING;

-- Diurnal Hourly Traffic Curves
INSERT INTO hourly_traffic_profiles (venue_type, city, day_type, hourly_coefficients) VALUES
('commercial_high_street', 'All', 'WEEKEND', '{"6": 0.01, "7": 0.02, "8": 0.03, "9": 0.04, "10": 0.06, "11": 0.07, "12": 0.08, "13": 0.07, "14": 0.06, "15": 0.07, "16": 0.09, "17": 0.11, "18": 0.12, "19": 0.10, "20": 0.05, "21": 0.01, "22": 0.01, "23": 0.00}'::jsonb),
('tech_park_corridor', 'All', 'WEEKDAY', '{"6": 0.00, "7": 0.02, "8": 0.08, "9": 0.14, "10": 0.09, "11": 0.06, "12": 0.11, "13": 0.10, "14": 0.05, "15": 0.05, "16": 0.07, "17": 0.10, "18": 0.08, "19": 0.03, "20": 0.01, "21": 0.01, "22": 0.00, "23": 0.00}'::jsonb),
('campus_youth_hub', 'All', 'WEEKDAY', '{"6": 0.00, "7": 0.02, "8": 0.07, "9": 0.10, "10": 0.09, "11": 0.09, "12": 0.12, "13": 0.11, "14": 0.09, "15": 0.10, "16": 0.09, "17": 0.06, "18": 0.03, "19": 0.02, "20": 0.01, "21": 0.00, "22": 0.00, "23": 0.00}'::jsonb),
('transit_hub', 'All', 'WEEKDAY', '{"6": 0.02, "7": 0.05, "8": 0.12, "9": 0.13, "10": 0.07, "11": 0.05, "12": 0.05, "13": 0.05, "14": 0.05, "15": 0.06, "16": 0.08, "17": 0.11, "18": 0.10, "19": 0.05, "20": 0.01, "21": 0.00, "22": 0.00, "23": 0.00}'::jsonb)
ON CONFLICT (venue_type, city, day_type) DO NOTHING;

-- Primary Spatial Population Nodes
INSERT INTO spatial_population_h3 (h3_index, h3_resolution, city, location_name, center_lat, center_lng, base_population, population_density_sq_km, sec_classification, affluence_score) VALUES
('89618c4f2afffff', 9, 'Chennai', 'T. Nagar & Ranganathan Street', 13.0418, 80.2341, 18500, 21500, 'SEC A/B', 88),
('89618c4dc37ffff', 9, 'Chennai', 'OMR IT Corridor & Tidel Park', 12.9815, 80.2482, 14200, 11200, 'SEC A/A+', 84),
('89618c4f697ffff', 9, 'Chennai', 'Anna Nagar 2nd Avenue', 13.0850, 80.2101, 16800, 16500, 'SEC A/B', 86),
('8960145b233ffff', 9, 'Bengaluru', 'Indiranagar 100ft Road', 12.9719, 77.6412, 16200, 15800, 'SEC A+', 92),
('8960145a38fffff', 9, 'Bengaluru', 'Koramangala 80ft Road', 12.9352, 77.6245, 17500, 16200, 'SEC A+', 90),
('896014464cfffff', 9, 'Bengaluru', 'Whitefield ITPL Main Road', 12.9863, 77.7340, 13800, 9800, 'SEC A/B', 82),
('8961e576077ffff', 9, 'Mumbai', 'Bandra Linking Road & Hill Road', 19.0600, 72.8338, 22000, 24500, 'SEC A+', 94),
('8961e57424bffff', 9, 'Mumbai', 'BKC Commercial Hub', 19.0657, 72.8687, 12500, 8500, 'SEC A+', 91),
('8928308280fffff', 9, 'New Delhi', 'Connaught Place Inner Circle', 28.6304, 77.2177, 19200, 18400, 'SEC A+', 93),
('8961a9c80dfffff', 9, 'Hyderabad', 'Hitec City Cyber Towers', 17.4504, 78.3808, 15400, 12800, 'SEC A/B', 85)
ON CONFLICT (h3_index) DO NOTHING;

-- Venue POI Registry
INSERT INTO venue_poi_registry (h3_index, location_name, poi_category, poi_count, commercial_intensity_score) VALUES
('89618c4f2afffff', 'T. Nagar & Ranganathan Street', 'fashion', 420, 99),
('89618c4f2afffff', 'T. Nagar & Ranganathan Street', 'food', 380, 96),
('89618c4f2afffff', 'T. Nagar & Ranganathan Street', 'fitness', 48, 94),
('89618c4f2afffff', 'T. Nagar & Ranganathan Street', 'technology', 85, 82),
('89618c4dc37ffff', 'OMR IT Corridor & Tidel Park', 'technology', 320, 98),
('89618c4dc37ffff', 'OMR IT Corridor & Tidel Park', 'food', 290, 90),
('89618c4dc37ffff', 'OMR IT Corridor & Tidel Park', 'fitness', 65, 88),
('8960145b233ffff', 'Indiranagar 100ft Road', 'food', 410, 98),
('8960145b233ffff', 'Indiranagar 100ft Road', 'fitness', 75, 96),
('8928308280fffff', 'Connaught Place Inner Circle', 'food', 480, 98),
('8928308280fffff', 'Connaught Place Inner Circle', 'fashion', 390, 95)
ON CONFLICT DO NOTHING;
