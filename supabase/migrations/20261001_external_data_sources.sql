-- Migration: External Data Sources, Dataset Versions, and Provenance Architecture
-- Timestamp: 2026-10-01
-- Purpose: Introduces structured, source-aware tables for externally verified India data starter pack
--          (MoSPI HCES consumption spending, CMRL transit passenger flows, NIRF college directory),
--          audit batches, dataset versions, rejection logs, and flags legacy seed data as UNVERIFIED_SEED.

-- 1. Master Data Sources Registry
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
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Versioned Dataset Packages
CREATE TABLE IF NOT EXISTS dataset_versions (
  id TEXT PRIMARY KEY,
  source_id TEXT NOT NULL REFERENCES data_sources(source_id),
  version_tag TEXT NOT NULL,
  package_version TEXT NOT NULL DEFAULT '1.0',
  checked_on DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'APPROVED', -- 'PENDING_REVIEW', 'APPROVED', 'REJECTED', 'SUPERSEDED'
  checksum_sha256 TEXT NOT NULL,
  raw_file_uri TEXT NOT NULL,
  records_count INTEGER NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(source_id, version_tag)
);

-- 3. Import Batches & Review Status
CREATE TABLE IF NOT EXISTS import_batches (
  id TEXT PRIMARY KEY,
  dataset_version_id TEXT REFERENCES dataset_versions(id),
  source_id TEXT NOT NULL REFERENCES data_sources(source_id),
  batch_number INTEGER NOT NULL,
  records_processed INTEGER NOT NULL DEFAULT 0,
  records_accepted INTEGER NOT NULL DEFAULT 0,
  records_rejected INTEGER NOT NULL DEFAULT 0,
  records_unchanged INTEGER NOT NULL DEFAULT 0,
  review_status TEXT NOT NULL DEFAULT 'APPROVED', -- 'PENDING_REVIEW', 'APPROVED', 'REJECTED', 'SUPERSEDED'
  rejection_log_json JSONB DEFAULT '[]'::jsonb,
  imported_by TEXT NOT NULL DEFAULT 'system_importer',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  approved_at TIMESTAMPTZ
);

-- 4. Market Context (State/UT Rural & Urban Consumption Expenditure)
CREATE TABLE IF NOT EXISTS market_context (
  id TEXT PRIMARY KEY,
  batch_id TEXT REFERENCES import_batches(id),
  dataset_version_id TEXT REFERENCES dataset_versions(id),
  source_id TEXT NOT NULL REFERENCES data_sources(source_id),
  area_name TEXT NOT NULL,
  area_level TEXT NOT NULL, -- 'State', 'Union Territory', 'National'
  sector TEXT NOT NULL CHECK(sector IN ('Rural', 'Urban', 'All')),
  metric TEXT NOT NULL,
  value NUMERIC(12, 2) NOT NULL,
  unit TEXT NOT NULL,
  period TEXT NOT NULL,
  evidence_type TEXT NOT NULL DEFAULT 'SURVEY_ESTIMATE',
  allowed_use TEXT NOT NULL DEFAULT 'MARKET_CONTEXT_ONLY',
  quality_note TEXT,
  review_status TEXT NOT NULL DEFAULT 'APPROVED',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(area_name, sector, metric, period, source_id)
);

-- 5. Transit Network Context
CREATE TABLE IF NOT EXISTS transit_context (
  id TEXT PRIMARY KEY,
  batch_id TEXT REFERENCES import_batches(id),
  dataset_version_id TEXT REFERENCES dataset_versions(id),
  source_id TEXT NOT NULL REFERENCES data_sources(source_id),
  city TEXT NOT NULL,
  geographic_scope TEXT NOT NULL,
  month TEXT NOT NULL, -- 'YYYY-MM'
  value BIGINT NOT NULL,
  metric TEXT NOT NULL,
  unit TEXT NOT NULL DEFAULT 'passenger_flow_count',
  evidence_type TEXT NOT NULL DEFAULT 'OPERATOR_REPORTED',
  allowed_use TEXT NOT NULL DEFAULT 'NETWORK_CONTEXT_ONLY',
  review_status TEXT NOT NULL DEFAULT 'APPROVED',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(city, month, metric, source_id)
);

-- 6. Venue & Campus Directory
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
  footfall NUMERIC(10, 2) DEFAULT NULL, -- Explicit NULL: missing is not zero
  student_count INTEGER DEFAULT NULL,
  evidence_type TEXT NOT NULL DEFAULT 'PUBLISHED_DIRECTORY',
  review_status TEXT NOT NULL DEFAULT 'APPROVED',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(source_id, source_institution_id)
);

-- 7. Spot Footfall Observations (Physical Measurements)
CREATE TABLE IF NOT EXISTS footfall_observations (
  id TEXT PRIMARY KEY,
  batch_id TEXT REFERENCES import_batches(id),
  source_id TEXT REFERENCES data_sources(source_id),
  location_name TEXT NOT NULL,
  h3_cell TEXT,
  observation_date DATE NOT NULL,
  time_window_start TIME NOT NULL,
  time_window_end TIME NOT NULL,
  interval_minutes INTEGER NOT NULL DEFAULT 60,
  visitor_count INTEGER NOT NULL,
  measurement_method TEXT NOT NULL, -- 'CAMERA_PEOPLE_COUNTER', 'MANUAL_TALLY', 'WIFI_SNIFFER'
  evidence_type TEXT NOT NULL DEFAULT 'OBSERVED_MEASUREMENT',
  review_status TEXT NOT NULL DEFAULT 'PENDING_REVIEW',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Weather Forecasts & Outdoor Risk
CREATE TABLE IF NOT EXISTS weather_forecasts (
  id TEXT PRIMARY KEY,
  source_id TEXT REFERENCES data_sources(source_id),
  city TEXT NOT NULL,
  forecast_date DATE NOT NULL,
  issue_time TIMESTAMPTZ NOT NULL,
  expiry_time TIMESTAMPTZ NOT NULL,
  weather_condition TEXT NOT NULL,
  rain_probability NUMERIC(4, 2),
  temp_celsius NUMERIC(4, 1),
  advisory_note TEXT,
  connection_status TEXT NOT NULL DEFAULT 'SOURCE_IDENTIFIED_NOT_CONNECTED',
  review_status TEXT NOT NULL DEFAULT 'PENDING_REVIEW',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Commercial Vendor Quotes
CREATE TABLE IF NOT EXISTS vendor_quotes (
  id TEXT PRIMARY KEY,
  vendor_id TEXT NOT NULL,
  vendor_name TEXT NOT NULL,
  city TEXT NOT NULL,
  service_category TEXT NOT NULL, -- 'PROMOTER_MANPOWER', 'SUPERVISOR', 'PRINTING_POSM', 'LOGISTICS'
  unit_rate_paise BIGINT NOT NULL,
  unit_type TEXT NOT NULL, -- 'PER_HOUR', 'PER_SHIFT', 'PER_UNIT'
  terms TEXT,
  validity_start_date DATE NOT NULL,
  validity_end_date DATE NOT NULL,
  review_status TEXT NOT NULL DEFAULT 'APPROVED',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. Rejected Records Staging for Human Review
CREATE TABLE IF NOT EXISTS data_import_rejections (
  id TEXT PRIMARY KEY,
  batch_id TEXT NOT NULL,
  source_id TEXT NOT NULL,
  raw_record_json JSONB NOT NULL,
  rejection_reason TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. Flag existing unsupported seed records as UNVERIFIED_SEED
ALTER TABLE spatial_population_h3 
ADD COLUMN IF NOT EXISTS evidence_status TEXT DEFAULT 'UNVERIFIED_SEED',
ADD COLUMN IF NOT EXISTS source_citation TEXT DEFAULT 'UNVERIFIED_HISTORICAL_SEED',
ADD COLUMN IF NOT EXISTS data_quality_tier TEXT DEFAULT 'UNVERIFIED_ASSUMPTION';

ALTER TABLE demographic_profiles 
ADD COLUMN IF NOT EXISTS evidence_status TEXT DEFAULT 'UNVERIFIED_SEED';

ALTER TABLE hourly_traffic_profiles 
ADD COLUMN IF NOT EXISTS evidence_status TEXT DEFAULT 'MODELLED_SYNTHETIC_CURVE';

ALTER TABLE conversion_priors 
ADD COLUMN IF NOT EXISTS evidence_status TEXT DEFAULT 'UNVERIFIED_HEURISTIC_PRIOR';

-- Ensure all existing legacy rows are explicitly flagged
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
