/**
 * Ziggers Decision Engine - Playbook Decision Layer Repository
 * File: src/lib/data/repositories/playbookRepository.js
 * 
 * Provides database access for versioned product playbooks, planning families,
 * evidence sources, administrative reviews, and recommendation snapshots.
 */

import { getDatabase, withTransaction } from '../database.js';

/**
 * Retrieves all registered planning families
 */
export function getAllPlaybookFamilies() {
  const db = getDatabase();
  return db.prepare(`
    SELECT f.*, COUNT(p.id) as playbooks_count
    FROM playbook_families f
    LEFT JOIN playbooks p ON f.name = p.family
    GROUP BY f.family_id
    ORDER BY f.name ASC
  `).all();
}

/**
 * Retrieves all evidence sources
 */
export function getAllEvidenceSources() {
  const db = getDatabase();
  return db.prepare(`
    SELECT source_id, publisher, title, url, supports, does_not_support, created_at, updated_at
    FROM evidence_sources
    ORDER BY source_id ASC
  `).all();
}

/**
 * Retrieves a single evidence source by ID
 */
export function getEvidenceSourceById(sourceId) {
  const db = getDatabase();
  return db.prepare('SELECT * FROM evidence_sources WHERE source_id = ?').get(sourceId);
}

/**
 * Retrieves all playbooks matching optional filters
 */
export function getPlaybooks(filters = {}) {
  const db = getDatabase();
  const conditions = [];
  const params = [];

  if (filters.family) {
    conditions.push('p.family = ?');
    params.push(filters.family);
  }

  if (filters.reviewStatus) {
    conditions.push('p.review_status = ?');
    params.push(filters.reviewStatus);
  }

  if (filters.isPublished !== undefined) {
    conditions.push('p.is_published = ?');
    params.push(filters.isPublished ? 1 : 0);
  }

  if (filters.search) {
    conditions.push('(p.name LIKE ? OR p.buyer_need LIKE ? OR p.objective LIKE ? OR p.id LIKE ?)');
    const term = `%${filters.search}%`;
    params.push(term, term, term, term);
  }

  if (filters.version) {
    conditions.push('p.version = ?');
    params.push(filters.version);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const rows = db.prepare(`
    SELECT p.id, p.version, p.family, p.name, p.objective, p.buyer_need,
           p.format, p.bottleneck, p.followup, p.pilot_question,
           p.review_status, p.recommendation_basis, p.is_published,
           p.reviewer, p.reviewed_at, p.quote_backed_cost,
           p.created_at, p.updated_at
    FROM playbooks p
    ${whereClause}
    ORDER BY p.id ASC
  `).all(...params);

  return rows;
}

/**
 * Retrieves a single playbook by ID (and optional version)
 */
export function getPlaybookById(id, version = null) {
  const db = getDatabase();
  let query = 'SELECT * FROM playbooks WHERE id = ?';
  const params = [id];

  if (version) {
    query += ' AND version = ?';
    params.push(version);
  } else {
    query += ' ORDER BY created_at DESC LIMIT 1';
  }

  const row = db.prepare(query).get(...params);
  if (!row) return null;

  // Retrieve linked evidence sources
  const links = db.prepare(`
    SELECT s.*
    FROM playbook_evidence_links l
    JOIN evidence_sources s ON l.source_id = s.source_id
    WHERE l.playbook_id = ? AND l.version = ?
    ORDER BY s.source_id ASC
  `).all(row.id, row.version);

  return {
    ...row,
    ask: JSON.parse(row.ask_json || '[]'),
    sequence: JSON.parse(row.sequence_json || '[]'),
    locations: JSON.parse(row.locations_json || '[]'),
    avoid: JSON.parse(row.avoid_json || '[]'),
    needs: JSON.parse(row.needs_json || '[]'),
    outcomes: JSON.parse(row.outcomes_json || '[]'),
    performance_benchmarks: row.performance_benchmarks_json ? JSON.parse(row.performance_benchmarks_json) : null,
    actual_venue_ids: JSON.parse(row.actual_venue_ids_json || '[]'),
    required_brief_fields: JSON.parse(row.required_brief_fields_json || '[]'),
    content: JSON.parse(row.content_json || '{}'),
    evidenceSources: links
  };
}

/**
 * Retrieves active playbook version metadata and policies
 */
export function getPlaybookVersionPolicy(versionTag = '2.0-draft') {
  const db = getDatabase();
  const row = db.prepare('SELECT * FROM playbook_versions WHERE version = ?').get(versionTag);
  if (!row) return null;

  return {
    version: row.version,
    title: row.title,
    preparedOn: row.prepared_on,
    publicationStatus: row.publication_status,
    integrationStatus: row.integration_status,
    evidencePolicy: row.evidence_policy,
    rankingPolicy: JSON.parse(row.ranking_policy_json || '{}'),
    globalRules: JSON.parse(row.global_rules_json || '{}'),
    sharedBriefFields: JSON.parse(row.shared_brief_fields_json || '[]')
  };
}

/**
 * Updates a playbook's review status or content with audit logging
 */
export function updatePlaybookReviewStatus({
  playbookId,
  version = '2.0-draft',
  newStatus,
  reviewerName,
  reviewNotes = '',
  isPublished = false
}) {
  const db = getDatabase();
  const now = new Date().toISOString();

  return withTransaction(() => {
    const existing = db.prepare('SELECT * FROM playbooks WHERE id = ? AND version = ?').get(playbookId, version);
    if (!existing) {
      throw new Error(`Playbook ${playbookId} (version: ${version}) not found`);
    }

    const editId = `edit_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const changeType = isPublished ? 'PUBLISH' : 'STATUS_CHANGE';
    const changeSummary = `Changed status from ${existing.review_status} to ${newStatus}${isPublished ? ' (PUBLISHED)' : ''} by ${reviewerName}: ${reviewNotes}`;

    // Record audit edit
    db.prepare(`
      INSERT INTO playbook_admin_edits (
        id, playbook_id, version, edited_by, change_type, change_summary,
        previous_status, new_status, previous_content_json, new_content_json, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      editId,
      playbookId,
      version,
      reviewerName,
      changeType,
      changeSummary,
      existing.review_status,
      newStatus,
      existing.content_json,
      existing.content_json,
      now
    );

    // Update playbook
    db.prepare(`
      UPDATE playbooks SET
        review_status = ?,
        reviewer = ?,
        review_notes = ?,
        reviewed_at = ?,
        is_published = ?,
        updated_at = ?
      WHERE id = ? AND version = ?
    `).run(
      newStatus,
      reviewerName,
      reviewNotes,
      now,
      isPublished ? 1 : 0,
      now,
      playbookId,
      version
    );

    return {
      success: true,
      playbookId,
      version,
      newStatus,
      isPublished: isPublished ? 1 : 0,
      reviewerName,
      reviewedAt: now,
      editId
    };
  });
}

/**
 * Restores a previous version of a playbook from admin edit history
 */
export function restorePlaybookFromAudit(editId, restoredBy) {
  const db = getDatabase();
  const now = new Date().toISOString();

  return withTransaction(() => {
    const edit = db.prepare('SELECT * FROM playbook_admin_edits WHERE id = ?').get(editId);
    if (!edit) throw new Error(`Audit edit log ${editId} not found`);

    const prevContent = JSON.parse(edit.previous_content_json);
    const existing = db.prepare('SELECT * FROM playbooks WHERE id = ? AND version = ?').get(edit.playbook_id, edit.version);

    // Log restore action
    const restoreEditId = `restore_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    db.prepare(`
      INSERT INTO playbook_admin_edits (
        id, playbook_id, version, edited_by, change_type, change_summary,
        previous_status, new_status, previous_content_json, new_content_json, created_at
      ) VALUES (?, ?, ?, ?, 'RESTORE', ?, ?, ?, ?, ?, ?)
    `).run(
      restoreEditId,
      edit.playbook_id,
      edit.version,
      restoredBy,
      `Restored state prior to edit ${editId} by ${restoredBy}`,
      existing?.review_status || 'UNKNOWN',
      edit.previous_status || 'DRAFT_FOR_OPERATIONS_REVIEW',
      existing?.content_json || '{}',
      edit.previous_content_json,
      now
    );

    // Revert record in playbooks table
    db.prepare(`
      UPDATE playbooks SET
        review_status = ?,
        reviewer = ?,
        review_notes = ?,
        content_json = ?,
        is_published = ?,
        updated_at = ?
      WHERE id = ? AND version = ?
    `).run(
      edit.previous_status || 'DRAFT_FOR_OPERATIONS_REVIEW',
      restoredBy,
      `Restored from edit log ${editId}`,
      edit.previous_content_json,
      edit.previous_status === 'PUBLISHED' ? 1 : 0,
      now,
      edit.playbook_id,
      edit.version
    );

    return {
      success: true,
      restoredEditId: editId,
      newAuditId: restoreEditId,
      playbookId: edit.playbook_id
    };
  });
}

/**
 * Retrieves audit edit history for a playbook
 */
export function getPlaybookAuditHistory(playbookId, version = '2.0-draft') {
  const db = getDatabase();
  return db.prepare(`
    SELECT * FROM playbook_admin_edits
    WHERE playbook_id = ? AND version = ?
    ORDER BY created_at DESC
  `).all(playbookId, version);
}

/**
 * Stores a recommendation snapshot
 */
export function saveRecommendationSnapshot({
  campaignId = null,
  brief,
  selectedPlaybookId,
  playbookVersion,
  options,
  feasibilityReport
}) {
  const db = getDatabase();
  const id = `snap_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO playbook_recommendation_snapshots (
      id, campaign_id, brief_json, selected_playbook_id, playbook_version,
      options_json, feasibility_report_json, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    campaignId,
    JSON.stringify(brief || {}),
    selectedPlaybookId,
    playbookVersion,
    JSON.stringify(options || []),
    JSON.stringify(feasibilityReport || {}),
    now
  );

  return id;
}
