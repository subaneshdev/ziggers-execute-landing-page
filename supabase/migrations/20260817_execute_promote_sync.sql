-- Migration File: 20260817_execute_promote_sync.sql
-- Ziggers Execute <-> Ziggers Promote Sync Architecture

-- Enable PostGIS & UUID extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS postgis;

-- ============================================================================
-- 1. 🏢 CAMPAIGN DEFINITION & PUBLISHING SCHEMA (Execute -> Promote)
-- ============================================================================
CREATE TABLE IF NOT EXISTS campaigns (
  campaign_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Campaign Identity
  title VARCHAR(255) NOT NULL,
  description TEXT,
  brand_name VARCHAR(150) NOT NULL,
  brand_logo_url TEXT,
  campaign_cover_url TEXT,
  
  -- Category & Type
  campaign_type VARCHAR(50) NOT NULL CHECK (
    campaign_type IN ('Sampling', 'Brand Ambassador', 'Retail', 'Surveys', 'Roadshows', 'Mystery Shopping', 'Event Activation')
  ),
  
  -- Compensation
  guaranteed_payout NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  variable_bonus NUMERIC(10, 2) DEFAULT 0.00,
  currency VARCHAR(10) DEFAULT 'INR',
  payout_frequency VARCHAR(50) DEFAULT 'DAILY_UPON_VERIFICATION', -- 'DAILY_UPON_VERIFICATION', 'WEEKLY', 'CAMPAIGN_END'
  
  -- Location & Geofencing
  location_name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100),
  postal_code VARCHAR(20),
  latitude NUMERIC(10, 7) NOT NULL,
  longitude NUMERIC(10, 7) NOT NULL,
  geofence_radius_meters INT NOT NULL DEFAULT 200, -- e.g., 200 meters check-in radius
  
  -- Timing & Schedule
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  shift_start_time TIME NOT NULL,
  shift_end_time TIME NOT NULL,
  break_schedule JSONB DEFAULT '{"lunch_break": "30 mins", "tea_break": "15 mins"}',
  
  -- Requirements & Protocols
  dress_code TEXT DEFAULT 'Black Ziggers T-Shirt, Dark Jeans, Closed Shoes',
  travel_expectations TEXT DEFAULT 'Self-commute to assigned geofenced venue',
  safety_rules JSONB DEFAULT '["Stay hydrated", "Report any harassment to supervisor immediately", "Wear safety ID badge"]',
  skills_required TEXT[] DEFAULT ARRAY['Fluent Communication', 'Product Demo', 'Customer Engagement'],
  language_requirements TEXT[] DEFAULT ARRAY['English', 'Hindi', 'Tamil'],
  headcount_required INT NOT NULL DEFAULT 5,
  headcount_assigned INT DEFAULT 0,
  
  -- Supervisor / Point of Contact
  supervisor_name VARCHAR(150) NOT NULL,
  supervisor_phone VARCHAR(20) NOT NULL,
  supervisor_email VARCHAR(150),
  
  -- Status Lifecycle
  status VARCHAR(30) NOT NULL DEFAULT 'DRAFT' CHECK (
    status IN ('DRAFT', 'PUBLISHED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')
  ),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexing for spatial geofence and city filtering
CREATE INDEX IF NOT EXISTS idx_campaigns_city_status ON campaigns(city, status);
CREATE INDEX IF NOT EXISTS idx_campaigns_dates ON campaigns(start_date, end_date);


-- ============================================================================
-- 2. 📝 IN-SHIFT EXECUTION TASKS & CHECKLISTS SCHEMA
-- ============================================================================
CREATE TABLE IF NOT EXISTS campaign_tasks (
  task_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES campaigns(campaign_id) ON DELETE CASCADE,
  
  task_title VARCHAR(255) NOT NULL,
  instruction TEXT NOT NULL,
  target_count INT DEFAULT 1, -- e.g., 150 cans sampled, 40 leads captured
  proof_type VARCHAR(30) NOT NULL CHECK (
    proof_type IN ('PHOTO', 'COUNT', 'VIDEO', 'BARCODE', 'SIGNATURE', 'SURVEY_OTP')
  ),
  is_mandatory BOOLEAN DEFAULT true,
  sequence_order INT DEFAULT 1,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_campaign_tasks_campaign_id ON campaign_tasks(campaign_id);


-- ============================================================================
-- 3. 🎓 BRAND TRAINING, BRIEFING & QUIZ MODULE SCHEMA
-- ============================================================================
CREATE TABLE IF NOT EXISTS campaign_briefings (
  briefing_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL UNIQUE REFERENCES campaigns(campaign_id) ON DELETE CASCADE,
  
  brand_overview TEXT NOT NULL,
  product_pitch_script TEXT NOT NULL,
  briefing_video_url TEXT,
  dos_list JSONB DEFAULT '["Smile & greet customers enthusiastically", "Verify product expiration dates", "Ensure booth cleanliness"]',
  donts_list JSONB DEFAULT '["Do not sit down during shift", "Do not eat inside activation zone", "Do not force customer surveys"]',
  faqs JSONB DEFAULT '[{"q": "What if a customer asks for a discount?", "a": "Direct them to scan the QR code on the promo banner."}]',
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS campaign_quizzes (
  quiz_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES campaigns(campaign_id) ON DELETE CASCADE,
  
  question_text TEXT NOT NULL,
  options JSONB NOT NULL, -- e.g., ["100% Organic", "Gluten-Free", "Contains Sugar", "Both A & B"]
  correct_option_index INT NOT NULL,
  explanation TEXT,
  
  passing_score_percentage INT DEFAULT 80,
  max_attempts INT DEFAULT 3,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS campaign_certifications (
  cert_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  badge_name VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL, -- e.g., 'FMCG Sampling Specialist', 'Lead Gen Expert'
  badge_icon_url TEXT,
  validity_period_days INT DEFAULT 180, -- 6 months
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS worker_certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id UUID NOT NULL, -- References worker/user ID in auth system
  cert_id UUID NOT NULL REFERENCES campaign_certifications(cert_id) ON DELETE CASCADE,
  quiz_score_achieved INT NOT NULL,
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL
);


-- ============================================================================
-- 4. 📍 SHIFT EXECUTION, CHECK-IN & PROOF SUBMISSION SCHEMA (Promote -> Execute)
-- ============================================================================
CREATE TABLE IF NOT EXISTS campaign_assignments (
  assignment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES campaigns(campaign_id) ON DELETE CASCADE,
  worker_id UUID NOT NULL, -- Worker ID from Promote App
  worker_name VARCHAR(150) NOT NULL,
  worker_phone VARCHAR(20) NOT NULL,
  worker_photo_url TEXT,
  
  status VARCHAR(30) DEFAULT 'APPLIED' CHECK (
    status IN ('APPLIED', 'ACCEPTED', 'CHECKED_IN', 'SHIFT_COMPLETED', 'REJECTED', 'NO_SHOW')
  ),
  applied_at TIMESTAMPTZ DEFAULT NOW(),
  assigned_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS shift_checkins (
  checkin_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID NOT NULL REFERENCES campaign_assignments(assignment_id) ON DELETE CASCADE,
  campaign_id UUID NOT NULL REFERENCES campaigns(campaign_id) ON DELETE CASCADE,
  worker_id UUID NOT NULL,
  
  checkin_timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  checkin_latitude NUMERIC(10, 7) NOT NULL,
  checkin_longitude NUMERIC(10, 7) NOT NULL,
  distance_from_centroid_meters NUMERIC(8, 2),
  is_within_geofence BOOLEAN NOT NULL DEFAULT true,
  checkin_selfie_url TEXT NOT NULL,
  
  checkout_timestamp TIMESTAMPTZ,
  checkout_latitude NUMERIC(10, 7),
  checkout_longitude NUMERIC(10, 7),
  checkout_photo_url TEXT,
  
  supervisor_verified BOOLEAN DEFAULT false,
  verified_by VARCHAR(150),
  verified_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS sampling_logs (
  log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID NOT NULL REFERENCES campaign_assignments(assignment_id) ON DELETE CASCADE,
  campaign_id UUID NOT NULL REFERENCES campaigns(campaign_id) ON DELETE CASCADE,
  worker_id UUID NOT NULL,
  
  quantity_logged INT NOT NULL DEFAULT 1,
  interaction_count INT NOT NULL DEFAULT 1,
  customer_phone_hash VARCHAR(64), -- Hashed phone number for OTP verified lead
  notes TEXT,
  logged_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS proof_photos (
  proof_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID NOT NULL REFERENCES campaign_assignments(assignment_id) ON DELETE CASCADE,
  task_id UUID REFERENCES campaign_tasks(task_id) ON DELETE SET NULL,
  campaign_id UUID NOT NULL REFERENCES campaigns(campaign_id) ON DELETE CASCADE,
  worker_id UUID NOT NULL,
  
  storage_bucket VARCHAR(100) DEFAULT 'proof_photos',
  image_url TEXT NOT NULL,
  latitude NUMERIC(10, 7),
  longitude NUMERIC(10, 7),
  watermark_timestamp TIMESTAMPTZ DEFAULT NOW(),
  
  verification_status VARCHAR(30) DEFAULT 'PENDING' CHECK (
    verification_status IN ('PENDING', 'APPROVED', 'REJECTED')
  ),
  rejection_reason TEXT,
  reviewed_by VARCHAR(150),
  reviewed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS incident_reports (
  incident_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID REFERENCES campaign_assignments(assignment_id) ON DELETE SET NULL,
  campaign_id UUID NOT NULL REFERENCES campaigns(campaign_id) ON DELETE CASCADE,
  worker_id UUID NOT NULL,
  
  category VARCHAR(50) NOT NULL CHECK (
    category IN ('STOCK_SHORTAGE', 'WEATHER_INTERRUPTION', 'SAFETY_CONCERN', 'VENUE_DISPUTE', 'EQUIPMENT_DAMAGE', 'HEALTH_EMERGENCY')
  ),
  description TEXT NOT NULL,
  photo_proof_url TEXT,
  severity VARCHAR(20) DEFAULT 'MEDIUM' CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL_SOS')),
  supervisor_notes TEXT,
  status VARCHAR(30) DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'UNDER_REVIEW', 'RESOLVED')),
  
  reported_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 5. 💰 PAYOUT LEDGER SCHEMA
-- ============================================================================
CREATE TABLE IF NOT EXISTS payout_ledger (
  payout_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID NOT NULL REFERENCES campaign_assignments(assignment_id) ON DELETE CASCADE,
  worker_id UUID NOT NULL,
  
  guaranteed_amount NUMERIC(10, 2) NOT NULL,
  variable_bonus_amount NUMERIC(10, 2) DEFAULT 0.00,
  deductions_amount NUMERIC(10, 2) DEFAULT 0.00,
  total_payable_amount NUMERIC(10, 2) NOT NULL,
  
  payout_status VARCHAR(30) DEFAULT 'PROCESSING' CHECK (
    payout_status IN ('PENDING_APPROVAL', 'PROCESSING', 'DISBURSED_UPI', 'FAILED')
  ),
  upi_id VARCHAR(100),
  transaction_ref_no VARCHAR(100),
  disbursed_at TIMESTAMPTZ
);
