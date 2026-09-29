-- Migration: Add campaign schedule fields to campaigns table
-- Timestamp: 2026-09-29
-- Purpose: Adds canonical scheduling columns (start_date, end_date, daily_start_time, daily_end_time, timezone, campaign_days, hours_per_day, total_campaign_hours, schedule_status)

ALTER TABLE campaigns 
ADD COLUMN IF NOT EXISTS start_date DATE,
ADD COLUMN IF NOT EXISTS end_date DATE,
ADD COLUMN IF NOT EXISTS daily_start_time TIME,
ADD COLUMN IF NOT EXISTS daily_end_time TIME,
ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'Asia/Kolkata',
ADD COLUMN IF NOT EXISTS campaign_days INTEGER,
ADD COLUMN IF NOT EXISTS hours_per_day NUMERIC(4,2),
ADD COLUMN IF NOT EXISTS total_campaign_hours NUMERIC(6,2),
ADD COLUMN IF NOT EXISTS schedule_status TEXT DEFAULT 'LEGACY_MISSING';

-- Mark any historical records that lack schedule data as LEGACY_MISSING
UPDATE campaigns 
SET schedule_status = 'LEGACY_MISSING' 
WHERE schedule_status IS NULL;

COMMENT ON COLUMN campaigns.start_date IS 'Canonical start date (inclusive) in campaign timezone';
COMMENT ON COLUMN campaigns.end_date IS 'Canonical end date (inclusive) in campaign timezone';
COMMENT ON COLUMN campaigns.daily_start_time IS 'Daily shift start time (HH:mm)';
COMMENT ON COLUMN campaigns.daily_end_time IS 'Daily shift end time (HH:mm)';
COMMENT ON COLUMN campaigns.timezone IS 'IANA timezone identifier (e.g. Asia/Kolkata)';
COMMENT ON COLUMN campaigns.campaign_days IS 'Number of calendar days from start through end inclusive';
COMMENT ON COLUMN campaigns.hours_per_day IS 'Shift duration in hours per day';
COMMENT ON COLUMN campaigns.total_campaign_hours IS 'Total campaign activation hours (campaign_days * hours_per_day)';
COMMENT ON COLUMN campaigns.schedule_status IS 'Schedule state: CONFIRMED, PROVISIONAL, or LEGACY_MISSING';
