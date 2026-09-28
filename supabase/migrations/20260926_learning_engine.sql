-- =========================================================================
-- ZIGGERS LEARNING ENGINE DATABASE MIGRATION
-- Durable Ground-Truth Storage, Model Predictions, & Bayesian Posteriors
-- Migration: 20260926_learning_engine.sql
-- =========================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. CAMPAIGN EXECUTION EVENTS
-- Logs individual verified on-ground events from promoter apps and sensor telemetry
CREATE TABLE IF NOT EXISTS campaign_execution_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id VARCHAR(128) DEFAULT 'default_org',
    campaign_id VARCHAR(128) NOT NULL,
    venue_id VARCHAR(128),
    h3_cell VARCHAR(32) NOT NULL,
    promoter_id VARCHAR(128),
    event_type VARCHAR(64) NOT NULL, -- 'check_in', 'verified_interaction', 'sample_distributed', 'qr_scan', 'lead_submitted', 'app_install', 'merchant_onboarded', 'supervisor_approved', 'fraud_rejected'
    event_timestamp TIMESTAMPTZ DEFAULT NOW(),
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    gps_accuracy_meters NUMERIC(6, 2),
    verification_status VARCHAR(64) DEFAULT 'VERIFIED', -- 'VERIFIED', 'FLAGGED', 'REJECTED'
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_exec_events_campaign ON campaign_execution_events(campaign_id);
CREATE INDEX IF NOT EXISTS idx_exec_events_h3_cell ON campaign_execution_events(h3_cell);
CREATE INDEX IF NOT EXISTS idx_exec_events_type ON campaign_execution_events(event_type);
CREATE INDEX IF NOT EXISTS idx_exec_events_timestamp ON campaign_execution_events(event_timestamp);

-- 2. CAMPAIGN OUTCOMES (Observation Units for Calibration & Retraining)
-- Stores aggregated ground-truth actuals vs initial predictions per campaign shift
CREATE TABLE IF NOT EXISTS campaign_outcomes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id VARCHAR(128) NOT NULL,
    tenant_id VARCHAR(128) DEFAULT 'default_org',
    h3_cell VARCHAR(32) NOT NULL,
    location_name VARCHAR(255),
    objective VARCHAR(64) NOT NULL,
    venue_type VARCHAR(64) DEFAULT 'COMMERCIAL',
    campaign_date DATE DEFAULT CURRENT_DATE,
    shift_start VARCHAR(32),
    shift_end VARCHAR(32),
    promoter_count INTEGER DEFAULT 1,
    supervisor_count INTEGER DEFAULT 1,
    budget_net NUMERIC(12, 2) DEFAULT 0.00,
    weather_features JSONB DEFAULT '{"weather": "CLEAR"}'::jsonb,
    audience_features JSONB DEFAULT '{}'::jsonb,
    predicted_footfall INTEGER DEFAULT 0,
    predicted_interactions INTEGER DEFAULT 0,
    predicted_conversions INTEGER DEFAULT 0,
    actual_verified_footfall INTEGER DEFAULT 0,
    actual_verified_interactions INTEGER DEFAULT 0,
    actual_conversions INTEGER DEFAULT 0,
    data_quality_status VARCHAR(32) DEFAULT 'VERIFIED', -- 'VERIFIED', 'MODERATE', 'LOW'
    model_version VARCHAR(64) DEFAULT 'v1.0',
    label_finalized_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_outcomes_h3_cell ON campaign_outcomes(h3_cell);
CREATE INDEX IF NOT EXISTS idx_outcomes_objective ON campaign_outcomes(objective);
CREATE INDEX IF NOT EXISTS idx_outcomes_campaign_date ON campaign_outcomes(campaign_date);

-- 3. MODEL PREDICTIONS
-- Immutable snapshot of every forecast before physical campaign execution
CREATE TABLE IF NOT EXISTS model_predictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prediction_id VARCHAR(128) UNIQUE NOT NULL,
    campaign_id VARCHAR(128),
    tenant_id VARCHAR(128) DEFAULT 'default_org',
    model_name VARCHAR(64) NOT NULL,
    model_version VARCHAR(64) NOT NULL,
    feature_snapshot JSONB NOT NULL DEFAULT '{}'::jsonb,
    prediction JSONB NOT NULL DEFAULT '{}'::jsonb,
    lower_bound JSONB DEFAULT '{}'::jsonb,
    upper_bound JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_predictions_campaign ON model_predictions(campaign_id);
CREATE INDEX IF NOT EXISTS idx_predictions_created ON model_predictions(created_at);

-- 4. BAYESIAN POSTERIORS
-- Tracks Beta-Binomial conjugate parameters (alpha, beta) across hierarchical scopes
CREATE TABLE IF NOT EXISTS bayesian_posteriors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id VARCHAR(128) DEFAULT 'global',
    scope_type VARCHAR(32) NOT NULL, -- 'h3_cell_objective', 'venue_objective', 'city_objective', 'global_objective'
    scope_key VARCHAR(128) NOT NULL,  -- e.g. '892f254f177ffff:product_sampling'
    metric_name VARCHAR(64) NOT NULL, -- 'qr_scan_rate', 'landing_to_lead_rate', 'footfall_interaction_rate'
    alpha NUMERIC(12, 4) NOT NULL,
    beta NUMERIC(12, 4) NOT NULL,
    observation_count INTEGER NOT NULL DEFAULT 0,
    model_version VARCHAR(64) NOT NULL DEFAULT 'bayes-v1.0',
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_bayesian_posteriors UNIQUE (tenant_id, scope_type, scope_key, metric_name)
);

CREATE INDEX IF NOT EXISTS idx_posteriors_lookup ON bayesian_posteriors(tenant_id, scope_type, scope_key, metric_name);
