-- Rollback Migration for: 20261001_external_data_sources.sql
-- Timestamp: 2026-10-01
-- Purpose: Safely rolls back external data sources tables and restores previous state.

DROP TABLE IF EXISTS data_import_rejections;
DROP TABLE IF EXISTS vendor_quotes;
DROP TABLE IF EXISTS weather_forecasts;
DROP TABLE IF EXISTS footfall_observations;
DROP TABLE IF EXISTS venue_directory;
DROP TABLE IF EXISTS transit_context;
DROP TABLE IF EXISTS market_context;
DROP TABLE IF EXISTS import_batches;
DROP TABLE IF EXISTS dataset_versions;
DROP TABLE IF EXISTS data_sources;

-- Note: Columns added to legacy tables (evidence_status, source_citation, data_quality_tier)
-- can remain harmlessly or be dropped if strict schema rollback is desired:
-- ALTER TABLE spatial_population_h3 DROP COLUMN IF EXISTS evidence_status;
-- ALTER TABLE spatial_population_h3 DROP COLUMN IF EXISTS source_citation;
-- ALTER TABLE spatial_population_h3 DROP COLUMN IF EXISTS data_quality_tier;
-- ALTER TABLE demographic_profiles DROP COLUMN IF EXISTS evidence_status;
-- ALTER TABLE hourly_traffic_profiles DROP COLUMN IF EXISTS evidence_status;
-- ALTER TABLE conversion_priors DROP COLUMN IF EXISTS evidence_status;
