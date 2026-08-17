-- Migration File: 20260817_h3_audience_engine.sql
-- Ziggers Enterprise Offline Audience Intelligence Engine Schema

-- Enable PostGIS Extension if available
CREATE EXTENSION IF NOT EXISTS postgis;

-- 1. H3 Spatial Geo Cells
CREATE TABLE IF NOT EXISTS geo_cells (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  h3_index VARCHAR(20) UNIQUE NOT NULL, -- e.g. '8861892601fffff' H3 Index Resolution 8/9
  cell_name VARCHAR(100) NOT NULL,
  city VARCHAR(100) NOT NULL,
  district VARCHAR(100),
  latitude NUMERIC(10, 7) NOT NULL,
  longitude NUMERIC(10, 7) NOT NULL,
  area_sq_km NUMERIC(6, 3) DEFAULT 0.737,
  population INT DEFAULT 0,
  population_density INT DEFAULT 0, -- per sq km
  economic_score INT CHECK (economic_score BETWEEN 0 AND 100) DEFAULT 75,
  commercial_density NUMERIC(4, 2) DEFAULT 0.00,
  residential_density NUMERIC(4, 2) DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Demographic Profiles (Census C-14 5-Year Age Bands)
CREATE TABLE IF NOT EXISTS demographic_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cell_id UUID REFERENCES geo_cells(id) ON DELETE CASCADE,
  total_population INT NOT NULL DEFAULT 0,
  male_population INT NOT NULL DEFAULT 0,
  female_population INT NOT NULL DEFAULT 0,
  households INT NOT NULL DEFAULT 0,
  literacy_rate NUMERIC(5, 2) DEFAULT 0.00,
  worker_population INT DEFAULT 0,
  non_worker_population INT DEFAULT 0,
  -- 5-Year Age Bands (Census C-14)
  age_0_17 INT DEFAULT 0,
  age_18_24 INT DEFAULT 0,
  age_25_34 INT DEFAULT 0,
  age_35_44 INT DEFAULT 0,
  age_45_54 INT DEFAULT 0,
  age_55_64 INT DEFAULT 0,
  age_65_plus INT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Economic Affluence Profiles (MOSPI MPCE Calibrated 0-100 Score)
CREATE TABLE IF NOT EXISTS economic_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cell_id UUID REFERENCES geo_cells(id) ON DELETE CASCADE,
  affluence_score INT CHECK (affluence_score BETWEEN 0 AND 100) DEFAULT 75,
  mpce_urban_inr NUMERIC(10, 2) DEFAULT 6996.00,
  sec_classification VARCHAR(50) DEFAULT 'SEC A/B',
  avg_monthly_income_inr INT,
  vehicle_ownership_rate NUMERIC(5, 2) DEFAULT 0.00,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. POI Categories & Locations
CREATE TABLE IF NOT EXISTS poi_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_key VARCHAR(100) UNIQUE NOT NULL, -- 'schools', 'colleges', 'malls', 'offices', 'restaurants', 'gyms', 'hospitals', 'hotels', 'transit'
  category_name VARCHAR(100) NOT NULL,
  icon_name VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS poi_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cell_id UUID REFERENCES geo_cells(id) ON DELETE CASCADE,
  category_key VARCHAR(100) REFERENCES poi_categories(category_key) ON DELETE CASCADE,
  place_name VARCHAR(255) NOT NULL,
  latitude NUMERIC(10, 7),
  longitude NUMERIC(10, 7),
  daily_estimated_footfall INT DEFAULT 0,
  rating NUMERIC(3, 2),
  source VARCHAR(100) DEFAULT 'Google Places API / Mappls'
);

-- 5. Footfall Profiles & Hourly Curves
CREATE TABLE IF NOT EXISTS footfall_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cell_id UUID REFERENCES geo_cells(id) ON DELETE CASCADE,
  base_daily_footfall INT NOT NULL DEFAULT 50000,
  weekday_footfall INT NOT NULL DEFAULT 45000,
  weekend_footfall INT NOT NULL DEFAULT 65000,
  male_share NUMERIC(4, 3) DEFAULT 0.510,
  female_share NUMERIC(4, 3) DEFAULT 0.490,
  confidence_score NUMERIC(3, 2) DEFAULT 0.85,
  source VARCHAR(100) DEFAULT 'Ziggers Footfall Intelligence Engine'
);

CREATE TABLE IF NOT EXISTS footfall_hourly (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  footfall_profile_id UUID REFERENCES footfall_profiles(id) ON DELETE CASCADE,
  hour_of_day INT CHECK (hour_of_day BETWEEN 0 AND 23),
  hourly_share NUMERIC(5, 4) NOT NULL -- e.g. 0.0850 for 8.5% of daily footfall at 18:00
);

-- 6. Hierarchical Persona & Interest Taxonomy
CREATE TABLE IF NOT EXISTS persona_taxonomy (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  persona_key VARCHAR(100) UNIQUE NOT NULL,
  persona_name VARCHAR(100) NOT NULL,
  parent_category VARCHAR(100), -- 'SPORTS', 'FOOD', 'SHOPPING', 'LIFESTYLE', 'DEMOGRAPHIC'
  description TEXT
);

CREATE TABLE IF NOT EXISTS interest_taxonomy (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  interest_key VARCHAR(100) UNIQUE NOT NULL,
  interest_name VARCHAR(100) NOT NULL,
  persona_key VARCHAR(100) REFERENCES persona_taxonomy(persona_key) ON DELETE CASCADE,
  description TEXT
);

-- 7. Campaign Targeting, Predictions & Feedback Calibration Loop
CREATE TABLE IF NOT EXISTS campaign_targeting (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID,
  objective VARCHAR(100) NOT NULL,
  target_locations JSONB NOT NULL, -- Array of selected location node keys
  radius_km NUMERIC(4, 1) NOT NULL DEFAULT 3.0,
  age_min INT NOT NULL DEFAULT 18,
  age_max INT NOT NULL DEFAULT 35,
  gender VARCHAR(20) NOT NULL DEFAULT 'All',
  sec_classification VARCHAR(50) NOT NULL DEFAULT 'SEC A/B',
  selected_interests JSONB DEFAULT '[]',
  promoter_count INT NOT NULL DEFAULT 10,
  shift_hours INT NOT NULL DEFAULT 5,
  campaign_days INT NOT NULL DEFAULT 1,
  budget_inr NUMERIC(12, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audience_predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  targeting_id UUID REFERENCES campaign_targeting(id) ON DELETE CASCADE,
  potential_audience INT NOT NULL,
  qualified_audience INT NOT NULL,
  estimated_exposure INT NOT NULL,
  estimated_reach INT NOT NULL,
  expected_interactions INT NOT NULL,
  expected_leads INT NOT NULL,
  expected_app_installs INT NOT NULL,
  estimated_cpl NUMERIC(10, 2) NOT NULL,
  audience_quality_score INT NOT NULL,
  confidence_min_range INT NOT NULL,
  confidence_max_range INT NOT NULL,
  confidence_percentage INT NOT NULL DEFAULT 85,
  model_version VARCHAR(50) DEFAULT 'v1.0_baseline_calibrated',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS campaign_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prediction_id UUID REFERENCES audience_predictions(id) ON DELETE CASCADE,
  actual_reach INT,
  actual_interactions INT,
  actual_leads INT,
  actual_app_installs INT,
  actual_cpl NUMERIC(10, 2),
  error_reach_mape NUMERIC(5, 2),
  error_leads_mape NUMERIC(5, 2),
  verified_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS model_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  version_name VARCHAR(100) UNIQUE NOT NULL, -- 'v1.0_baseline_calibrated', 'v2.0_lightgbm_trained'
  model_type VARCHAR(50) NOT NULL DEFAULT 'rule_based_calibrated', -- 'rule_based_calibrated', 'lightgbm'
  training_dataset_size INT DEFAULT 0,
  mae NUMERIC(10, 2),
  rmse NUMERIC(10, 2),
  mape NUMERIC(5, 2),
  status VARCHAR(20) DEFAULT 'ACTIVE',
  deployed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed Model Version Registry
INSERT INTO model_versions (version_name, model_type, training_dataset_size, mape, status) VALUES
  ('v1.0_baseline_calibrated', 'rule_based_calibrated', 120, 8.45, 'ACTIVE')
ON CONFLICT (version_name) DO NOTHING;
