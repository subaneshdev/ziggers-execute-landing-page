-- ===================================================================
-- Migration: 20261001_playbook_decision_layer.sql
-- Description: Ziggers Campaign Decision Playbook v2 Layer
-- Provides schema for versioned product playbooks, planning families,
-- evidence sources, admin reviews, and recommendation snapshots.
-- ===================================================================

CREATE TABLE IF NOT EXISTS playbook_versions (
  version TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  prepared_on TEXT NOT NULL,
  publication_status TEXT NOT NULL DEFAULT 'DRAFT_FOR_OPERATIONS_REVIEW',
  integration_status TEXT NOT NULL,
  evidence_policy TEXT NOT NULL,
  ranking_policy_json TEXT NOT NULL,
  global_rules_json TEXT NOT NULL,
  shared_brief_fields_json TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS evidence_sources (
  source_id TEXT PRIMARY KEY,
  publisher TEXT NOT NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  supports TEXT NOT NULL,
  does_not_support TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS playbook_families (
  family_id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS playbooks (
  id TEXT NOT NULL,
  version TEXT NOT NULL REFERENCES playbook_versions(version) ON DELETE CASCADE,
  family TEXT NOT NULL,
  name TEXT NOT NULL,
  objective TEXT NOT NULL,
  buyer_need TEXT NOT NULL,
  ask_json TEXT NOT NULL,
  format TEXT NOT NULL,
  sequence_json TEXT NOT NULL,
  locations_json TEXT NOT NULL,
  avoid_json TEXT NOT NULL,
  needs_json TEXT NOT NULL,
  bottleneck TEXT NOT NULL,
  outcomes_json TEXT NOT NULL,
  followup TEXT NOT NULL,
  pilot_question TEXT,
  review_status TEXT NOT NULL DEFAULT 'DRAFT_FOR_OPERATIONS_REVIEW',
  recommendation_basis TEXT NOT NULL DEFAULT 'AUTHORED_PLANNING_HYPOTHESIS',
  performance_benchmarks_json TEXT,
  actual_venue_ids_json TEXT NOT NULL DEFAULT '[]',
  required_brief_fields_json TEXT NOT NULL DEFAULT '[]',
  quote_backed_cost NUMERIC,
  reviewer TEXT,
  review_notes TEXT,
  reviewed_at TIMESTAMPTZ,
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  content_json TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id, version)
);

CREATE TABLE IF NOT EXISTS playbook_evidence_links (
  playbook_id TEXT NOT NULL,
  version TEXT NOT NULL,
  source_id TEXT NOT NULL REFERENCES evidence_sources(source_id) ON DELETE CASCADE,
  PRIMARY KEY (playbook_id, version, source_id),
  FOREIGN KEY (playbook_id, version) REFERENCES playbooks(id, version) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS playbook_import_batches (
  batch_id TEXT PRIMARY KEY,
  package_version TEXT NOT NULL,
  file_path TEXT NOT NULL,
  checksum_sha256 TEXT NOT NULL,
  playbooks_processed INTEGER NOT NULL DEFAULT 0,
  playbooks_accepted INTEGER NOT NULL DEFAULT 0,
  playbooks_rejected INTEGER NOT NULL DEFAULT 0,
  playbooks_unchanged INTEGER NOT NULL DEFAULT 0,
  sources_processed INTEGER NOT NULL DEFAULT 0,
  sources_accepted INTEGER NOT NULL DEFAULT 0,
  review_status TEXT NOT NULL DEFAULT 'DRAFT_FOR_OPERATIONS_REVIEW',
  rejection_log_json TEXT NOT NULL DEFAULT '[]',
  imported_by TEXT NOT NULL DEFAULT 'system_importer',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS playbook_admin_edits (
  id TEXT PRIMARY KEY,
  playbook_id TEXT NOT NULL,
  version TEXT NOT NULL,
  edited_by TEXT NOT NULL,
  change_type TEXT NOT NULL,
  change_summary TEXT NOT NULL,
  previous_status TEXT,
  new_status TEXT,
  previous_content_json TEXT NOT NULL,
  new_content_json TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS playbook_recommendation_snapshots (
  id TEXT PRIMARY KEY,
  campaign_id TEXT,
  brief_json TEXT NOT NULL,
  selected_playbook_id TEXT NOT NULL,
  playbook_version TEXT NOT NULL,
  options_json TEXT NOT NULL,
  feasibility_report_json TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_playbooks_family ON playbooks(family);
CREATE INDEX IF NOT EXISTS idx_playbooks_review_status ON playbooks(review_status);
CREATE INDEX IF NOT EXISTS idx_playbooks_is_published ON playbooks(is_published);
CREATE INDEX IF NOT EXISTS idx_playbook_links ON playbook_evidence_links(source_id);
CREATE INDEX IF NOT EXISTS idx_admin_edits ON playbook_admin_edits(playbook_id, version);
