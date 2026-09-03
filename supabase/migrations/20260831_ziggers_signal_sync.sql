-- =========================================================================
-- ZIGGERS SIGNAL SYNC DATABASE MIGRATION
-- Enterprise Digital-to-Physical Campaign Intelligence & Attribution Layer
-- =========================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. SIGNAL PROVIDERS (Meta, Google, TikTok, LinkedIn)
CREATE TABLE IF NOT EXISTS signal_providers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID,
    provider_name VARCHAR(64) NOT NULL, -- 'META_ADS', 'GOOGLE_ADS', 'TIKTOK_ADS'
    account_id VARCHAR(128) NOT NULL,
    account_name VARCHAR(255) NOT NULL,
    auth_status VARCHAR(32) NOT NULL DEFAULT 'CONNECTED', -- 'CONNECTED', 'EXPIRED', 'SANDBOX_DEMO'
    access_token_encrypted TEXT,
    refresh_token_encrypted TEXT,
    token_expires_at TIMESTAMPTZ,
    scopes TEXT[] DEFAULT ARRAY['ads_read', 'insights_read'],
    is_sandbox BOOLEAN DEFAULT FALSE,
    last_synced_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. DIGITAL CAMPAIGN IMPORTS (Cached Aggregate Ad Account & Campaign Breakdowns)
CREATE TABLE IF NOT EXISTS digital_campaign_imports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id UUID REFERENCES signal_providers(id) ON DELETE CASCADE,
    external_campaign_id VARCHAR(128) NOT NULL,
    external_account_id VARCHAR(128) NOT NULL,
    campaign_name VARCHAR(255) NOT NULL,
    objective VARCHAR(64) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
    currency VARCHAR(16) DEFAULT 'INR',
    spend NUMERIC(12,2) DEFAULT 0.00,
    impressions BIGINT DEFAULT 0,
    reach BIGINT DEFAULT 0,
    clicks BIGINT DEFAULT 0,
    ctr NUMERIC(6,4) DEFAULT 0.0000,
    cpc NUMERIC(10,2) DEFAULT 0.00,
    cpm NUMERIC(10,2) DEFAULT 0.00,
    conversions BIGINT DEFAULT 0,
    cost_per_result NUMERIC(10,2) DEFAULT 0.00,
    result_type VARCHAR(64),
    date_start DATE,
    date_stop DATE,
    breakdowns_json JSONB DEFAULT '{}'::jsonb, -- { age: [], gender: [], geo: [], hourly: [], placement: [] }
    is_demo_data BOOLEAN DEFAULT FALSE,
    imported_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. DIGITAL SIGNAL PROFILES (Normalized Ziggers Internal Signal Representation)
CREATE TABLE IF NOT EXISTS digital_signal_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_import_id UUID REFERENCES digital_campaign_imports(id) ON DELETE SET NULL,
    campaign_id VARCHAR(128) NOT NULL,
    objective VARCHAR(64) NOT NULL,
    brand_context VARCHAR(128),
    top_age_ranges JSONB NOT NULL DEFAULT '[]'::jsonb, -- [{ range: '18-24', performance_score: 0.92 }]
    top_genders JSONB NOT NULL DEFAULT '[]'::jsonb,    -- [{ gender: 'ALL', performance_score: 0.88 }]
    top_geographies JSONB NOT NULL DEFAULT '[]'::jsonb,-- [{ location: 'Chennai', region: 'South Chennai', performance_score: 0.91 }]
    top_time_windows JSONB NOT NULL DEFAULT '[]'::jsonb,-- [{ time_window: '18:00-22:00', performance_score: 0.87 }]
    audience_interests JSONB NOT NULL DEFAULT '[]'::jsonb,-- ['fitness', 'sports', 'energy_drinks']
    performance_metrics JSONB NOT NULL DEFAULT '{}'::jsonb, -- { ctr: 0.034, cpa: 42.5, conversion_rate: 0.082 }
    provenance JSONB DEFAULT '{"source": "AGGREGATE_META_INSIGHTS", "confidence": 0.91, "is_modeled": false}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. OFFLINE CONTEXT EVALUATIONS (H3 Spatial Cluster Matching Scores)
CREATE TABLE IF NOT EXISTS offline_context_evaluations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    signal_profile_id UUID REFERENCES digital_signal_profiles(id) ON DELETE CASCADE,
    city VARCHAR(64) NOT NULL,
    location_name VARCHAR(255) NOT NULL,
    h3_resolution INT DEFAULT 9,
    h3_center_index VARCHAR(64),
    h3_cells_json JSONB DEFAULT '[]'::jsonb,
    offline_context_score NUMERIC(5,2) NOT NULL, -- 0 to 100
    sub_scores JSONB NOT NULL, -- { age_match: 92, fitness_affinity: 94, sports_affinity: 87, footfall: 89, time_match: 91, historical: 88 }
    estimated_relevant_audience BIGINT NOT NULL,
    expected_interactions BIGINT NOT NULL,
    expected_conversions BIGINT NOT NULL,
    confidence_level VARCHAR(32) DEFAULT 'HIGH',
    explanation_reasons TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. HIERARCHICAL QR ATTRIBUTION NODES
CREATE TABLE IF NOT EXISTS qr_attribution_nodes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    qr_code_id VARCHAR(64) UNIQUE NOT NULL,
    brand_name VARCHAR(128) NOT NULL,
    campaign_id VARCHAR(128) NOT NULL,
    location_name VARCHAR(255) NOT NULL,
    h3_cell VARCHAR(64),
    promoter_id VARCHAR(64),
    promoter_name VARCHAR(128),
    creative_id VARCHAR(64) DEFAULT 'DEFAULT_CAN_SAMPLING',
    destination_url TEXT NOT NULL,
    scan_count BIGINT DEFAULT 0,
    lead_count BIGINT DEFAULT 0,
    conversion_count BIGINT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ZIGGERS SIGNAL EVENTS (Structured Telemetry Store)
CREATE TABLE IF NOT EXISTS signal_events (
    signal_event_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id VARCHAR(128) NOT NULL,
    event_type VARCHAR(64) NOT NULL, -- 'CAMPAIGN_STARTED', 'PROMOTER_CHECKIN', 'INTERACTION', 'SAMPLE_DISTRIBUTED', 'QR_SCAN', 'LANDING_PAGE_VIEW', 'LEAD_CAPTURED', 'COUPON_REDEEMED', 'APP_INSTALL', 'STORE_VISIT', 'PURCHASE_CONFIRMED', 'CAMPAIGN_COMPLETED'
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    geo_cell VARCHAR(64),
    latitude NUMERIC(10,7),
    longitude NUMERIC(10,7),
    promoter_id VARCHAR(64),
    promoter_name VARCHAR(128),
    interaction_type VARCHAR(64),
    device_session_hash VARCHAR(128),
    qr_code_id VARCHAR(64) REFERENCES qr_attribution_nodes(qr_code_id) ON DELETE SET NULL,
    conversion_id VARCHAR(128),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- 7. FIRST-PARTY CONSENT RECORDS (Privacy-by-Design Consent Architecture)
CREATE TABLE IF NOT EXISTS first_party_consents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    consent_id VARCHAR(64) UNIQUE NOT NULL,
    campaign_id VARCHAR(128) NOT NULL,
    brand_name VARCHAR(128) NOT NULL,
    qr_code_id VARCHAR(64),
    contact_phone_hash VARCHAR(128),
    contact_email_hash VARCHAR(128),
    consent_purpose TEXT NOT NULL, -- e.g. 'PRODUCT_OFFERS_AND_SAMPLING_FEEDBACK'
    consent_timestamp TIMESTAMPTZ DEFAULT NOW(),
    consent_status VARCHAR(32) DEFAULT 'GRANTED', -- 'GRANTED', 'REVOKED'
    consent_ip_pseudonym VARCHAR(64),
    retention_expiry_date DATE NOT NULL,
    revocation_timestamp TIMESTAMPTZ,
    crm_synced BOOLEAN DEFAULT FALSE,
    crm_sync_timestamp TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- 8. ML PREDICTION FEEDBACK & CALIBRATION STORE
CREATE TABLE IF NOT EXISTS ml_prediction_feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id VARCHAR(128) NOT NULL,
    location_name VARCHAR(255) NOT NULL,
    h3_cell VARCHAR(64),
    objective VARCHAR(64) NOT NULL,
    model_version VARCHAR(32) NOT NULL DEFAULT 'v1.2',
    prediction_timestamp TIMESTAMPTZ NOT NULL,
    
    -- Predictions
    predicted_reach BIGINT NOT NULL,
    predicted_interactions BIGINT NOT NULL,
    predicted_leads BIGINT NOT NULL,
    predicted_samples BIGINT NOT NULL,
    predicted_qr_scans BIGINT NOT NULL,
    predicted_cpl NUMERIC(10,2),
    
    -- Actual Observed Results
    actual_reach BIGINT DEFAULT 0,
    actual_interactions BIGINT DEFAULT 0,
    actual_leads BIGINT DEFAULT 0,
    actual_samples BIGINT DEFAULT 0,
    actual_qr_scans BIGINT DEFAULT 0,
    actual_cpl NUMERIC(10,2),
    
    -- Error Computation
    reach_error_pct NUMERIC(6,3),
    interactions_error_pct NUMERIC(6,3),
    leads_error_pct NUMERIC(6,3),
    samples_error_pct NUMERIC(6,3),
    
    is_training_sample BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexing for high-throughput spatial and analytical lookups
CREATE INDEX IF NOT EXISTS idx_signal_events_campaign ON signal_events(campaign_id);
CREATE INDEX IF NOT EXISTS idx_signal_events_type ON signal_events(event_type);
CREATE INDEX IF NOT EXISTS idx_signal_events_time ON signal_events(timestamp);
CREATE INDEX IF NOT EXISTS idx_qr_nodes_campaign ON qr_attribution_nodes(campaign_id);
CREATE INDEX IF NOT EXISTS idx_first_party_consents_camp ON first_party_consents(campaign_id);
CREATE INDEX IF NOT EXISTS idx_ml_feedback_camp ON ml_prediction_feedback(campaign_id);
