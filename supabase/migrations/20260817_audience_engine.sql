-- Ziggers Offline Audience Intelligence Engine & Location Data Layers Schema
-- Migration File: 20260817_audience_engine.sql

-- 1. Geo Nodes & Administrative Boundaries
CREATE TABLE IF NOT EXISTS geo_nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  node_key VARCHAR(100) UNIQUE NOT NULL, -- e.g. 'chennai_tnagar', 'chennai_omr'
  node_name VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL DEFAULT 'Tamil Nadu',
  district VARCHAR(100),
  sub_district VARCHAR(100),
  latitude NUMERIC(10, 7) NOT NULL,
  longitude NUMERIC(10, 7) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Demographic Baseline (Census C-14 & Projections)
CREATE TABLE IF NOT EXISTS demographic_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  node_id UUID REFERENCES geo_nodes(id) ON DELETE CASCADE,
  total_population INT NOT NULL DEFAULT 0,
  male_population INT NOT NULL DEFAULT 0,
  female_population INT NOT NULL DEFAULT 0,
  households INT NOT NULL DEFAULT 0,
  literacy_rate NUMERIC(5, 2) DEFAULT 0.00,
  worker_population INT DEFAULT 0,
  non_worker_population INT DEFAULT 0,
  -- Census C-14 5-Year Age Bands
  age_0_4 INT DEFAULT 0,
  age_5_9 INT DEFAULT 0,
  age_10_14 INT DEFAULT 0,
  age_15_19 INT DEFAULT 0,
  age_20_24 INT DEFAULT 0,
  age_25_29 INT DEFAULT 0,
  age_30_34 INT DEFAULT 0,
  age_35_39 INT DEFAULT 0,
  age_40_44 INT DEFAULT 0,
  age_45_49 INT DEFAULT 0,
  age_50_54 INT DEFAULT 0,
  age_55_59 INT DEFAULT 0,
  age_60_64 INT DEFAULT 0,
  age_65_plus INT DEFAULT 0,
  data_source VARCHAR(100) DEFAULT 'Census C-14 + 2026 Projections',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Economic Affluence & Purchasing Power Profile (MOSPI HCES MPCE Calibrated 0-100 Score)
CREATE TABLE IF NOT EXISTS economic_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  node_id UUID REFERENCES geo_nodes(id) ON DELETE CASCADE,
  mpce_urban_inr NUMERIC(10, 2) DEFAULT 6996.00, -- MOSPI HCES 2023-24 Urban Baseline
  affluence_score INT CHECK (affluence_score BETWEEN 0 AND 100) DEFAULT 75, -- Ziggers Economic Affluence Score
  sec_classification VARCHAR(50) DEFAULT 'SEC A/B', -- 'SEC A+', 'SEC A/B', 'SEC B/C'
  avg_household_monthly_income VARCHAR(100),
  vehicle_ownership_rate NUMERIC(5, 2) DEFAULT 0.00,
  commercial_density_rating NUMERIC(4, 2) DEFAULT 0.00,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. POI Categories & Physical Infrastructure (Google Places / Mappls Data)
CREATE TABLE IF NOT EXISTS poi_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_key VARCHAR(100) UNIQUE NOT NULL, -- 'schools', 'colleges', 'malls', 'offices', 'restaurants'
  category_name VARCHAR(100) NOT NULL,
  icon_name VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS poi_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  node_id UUID REFERENCES geo_nodes(id) ON DELETE CASCADE,
  category_key VARCHAR(100) REFERENCES poi_categories(category_key) ON DELETE CASCADE,
  place_name VARCHAR(255) NOT NULL,
  latitude NUMERIC(10, 7),
  longitude NUMERIC(10, 7),
  daily_estimated_footfall INT DEFAULT 0,
  rating NUMERIC(3, 2),
  source VARCHAR(50) DEFAULT 'Google Places API / Mappls'
);

-- 5. Footfall Intelligence Nodes (Independent Footfall & Time-of-Day Distributions)
CREATE TABLE IF NOT EXISTS footfall_nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  node_id UUID REFERENCES geo_nodes(id) ON DELETE CASCADE,
  base_daily_footfall INT NOT NULL DEFAULT 50000,
  weekday_daily_footfall INT NOT NULL DEFAULT 45000,
  weekend_daily_footfall INT NOT NULL DEFAULT 65000,
  -- Time-of-day Footfall Shares
  morning_share NUMERIC(4, 3) DEFAULT 0.200,   -- 08:00 AM - 12:00 PM
  afternoon_share NUMERIC(4, 3) DEFAULT 0.250, -- 12:00 PM - 04:00 PM
  evening_share NUMERIC(4, 3) DEFAULT 0.400,   -- 04:00 PM - 09:00 PM
  night_share NUMERIC(4, 3) DEFAULT 0.150,     -- 09:00 PM - 12:00 AM
  -- Demographics in Footfall Stream
  male_share NUMERIC(4, 3) DEFAULT 0.520,
  female_share NUMERIC(4, 3) DEFAULT 0.480,
  confidence_score NUMERIC(3, 2) DEFAULT 0.85, -- e.g. 0.85 (85%)
  source VARCHAR(100) DEFAULT 'Ziggers Footfall Intelligence Model',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Location-Intent Personas (POI-Derived Intent Affinities)
CREATE TABLE IF NOT EXISTS persona_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  persona_key VARCHAR(100) UNIQUE NOT NULL, -- 'shoppers', 'foodies', 'young_pros', 'students', 'luxury', 'families'
  persona_name VARCHAR(100) NOT NULL,
  description TEXT
);

CREATE TABLE IF NOT EXISTS location_intent_personas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  node_id UUID REFERENCES geo_nodes(id) ON DELETE CASCADE,
  persona_key VARCHAR(100) REFERENCES persona_profiles(persona_key) ON DELETE CASCADE,
  affinity_score INT CHECK (affinity_score BETWEEN 0 AND 100) DEFAULT 70,
  ai_explanation TEXT,
  PRIMARY KEY (node_id, persona_key)
);

-- 7. Campaign Predictions & Actuals Calibration Loop
CREATE TABLE IF NOT EXISTS campaign_predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID,
  node_id UUID REFERENCES geo_nodes(id) ON DELETE CASCADE,
  predicted_potential_audience INT NOT NULL,
  predicted_exposure INT NOT NULL,
  predicted_reachable INT NOT NULL,
  predicted_leads INT NOT NULL,
  predicted_cpl NUMERIC(10, 2) NOT NULL,
  confidence_percentage INT NOT NULL DEFAULT 85,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS campaign_actuals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prediction_id UUID REFERENCES campaign_predictions(id) ON DELETE CASCADE,
  actual_verified_engagements INT,
  actual_verified_leads INT,
  actual_cpl NUMERIC(10, 2),
  model_variance_percentage NUMERIC(5, 2),
  verified_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed Default Category Types
INSERT INTO poi_categories (category_key, category_name, icon_name) VALUES
  ('schools', 'Schools & K-12', 'School'),
  ('colleges', 'Colleges & Universities', 'GraduationCap'),
  ('malls', 'Shopping Malls & Arcades', 'ShoppingBag'),
  ('offices', 'Corporate Offices & Tech Parks', 'Building'),
  ('restaurants', 'Restaurants & Cafes', 'Utensils'),
  ('hotels', 'Hotels & Hospitality', 'Hotel'),
  ('gyms', 'Gyms & Fitness Centers', 'Dumbbell'),
  ('transit', 'Transit Nodes & Metro Stations', 'Train')
ON CONFLICT (category_key) DO NOTHING;

-- Seed Default Personas
INSERT INTO persona_profiles (persona_key, persona_name, description) VALUES
  ('shoppers', 'High-Street & Mall Shoppers', 'Active buyers visiting retail stores, fashion boutiques, and malls'),
  ('foodies', 'Food & Dining Enthusiasts', 'Dinning out crowds, cafe visitors, and beverage samplers'),
  ('young_pros', 'IT & Corporate Young Professionals', 'Tech employees, office workers, and corporate executives'),
  ('students', 'College & Campus Youth', 'University students, Gen-Z youth, and exam aspirants'),
  ('luxury', 'Luxury & Premium Consumers', 'High net worth buyers interested in gourmet, luxury D2C, and premium tier'),
  ('families', 'Family & Household Buyers', 'Parents, children, and multigenerational weekend shoppers')
ON CONFLICT (persona_key) DO NOTHING;
