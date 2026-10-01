-- ===================================================================
-- Rollback Migration: 20261001_playbook_decision_layer_rollback.sql
-- Description: Completely reverses the Playbook Decision Layer schema
-- ===================================================================

DROP TABLE IF EXISTS playbook_recommendation_snapshots CASCADE;
DROP TABLE IF EXISTS playbook_admin_edits CASCADE;
DROP TABLE IF EXISTS playbook_evidence_links CASCADE;
DROP TABLE IF EXISTS playbooks CASCADE;
DROP TABLE IF EXISTS playbook_families CASCADE;
DROP TABLE IF EXISTS evidence_sources CASCADE;
DROP TABLE IF EXISTS playbook_import_batches CASCADE;
DROP TABLE IF EXISTS playbook_versions CASCADE;
