-- =========================================================================
-- ZIGGERS DATABASE DATA PURGE: CAMPAIGNS & RELATED RUNTIME DATA
-- Clears all campaign rows while preserving table structures, indexes, and schemas.
-- =========================================================================

-- 1. Clear core campaigns
DELETE FROM campaigns;

-- 2. Clear learning engine events and outcomes
DELETE FROM campaign_outcomes;
DELETE FROM campaign_execution_events;
DELETE FROM model_predictions;

-- 3. Clear campaign briefs and imported ad signals
DELETE FROM campaign_briefs;
DELETE FROM digital_campaign_imports;
DELETE FROM digital_signal_profiles;
