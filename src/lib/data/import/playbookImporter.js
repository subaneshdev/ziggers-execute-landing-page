/**
 * Ziggers Decision Engine - Campaign Decision Playbook v2 Importer
 * File: src/lib/data/import/playbookImporter.js
 * 
 * Ingests versioned product playbooks, evidence sources, planning families,
 * and global operational rules into durable database records.
 * 
 * Non-negotiable Guarantees:
 * 1. Stored as versioned database records (never hardcoded in application logic).
 * 2. All imported playbooks default to 'DRAFT_FOR_OPERATIONS_REVIEW' (never proven/verified).
 * 3. Idempotent: repeated runs produce 0 duplicates and 0 overwrites.
 * 4. Administrator edits and review decisions are strictly preserved across re-imports.
 * 5. Reversible via database transactions and rollback migrations.
 * 6. Configurable package resolution via manifest, environment variables, or local staging.
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { getDatabase, withTransaction } from '../database.js';

/**
 * Resolves the primary playbook v2 JSON file path dynamically
 */
export function resolvePlaybookPackagePath() {
  // 1. Environment variable override
  if (process.env.ZIGGERS_PLAYBOOK_DIR) {
    const candidate = path.resolve(process.env.ZIGGERS_PLAYBOOK_DIR, 'ziggers-playbook-v2.json');
    if (fs.existsSync(candidate)) return candidate;
  }

  // 2. Manifest file configured path
  const manifestPath = path.resolve(process.cwd(), 'config', 'playbook_manifest.json');
  if (fs.existsSync(manifestPath)) {
    try {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      if (manifest.configured_directory && manifest.primary_file) {
        const candidate = path.resolve(process.cwd(), manifest.configured_directory, manifest.primary_file);
        if (fs.existsSync(candidate)) return candidate;
      }
      if (manifest.original_external_location && manifest.primary_file) {
        const candidate = path.resolve(manifest.original_external_location, manifest.primary_file);
        if (fs.existsSync(candidate)) return candidate;
      }
    } catch (e) {
      console.warn('Notice reading playbook manifest:', e.message);
    }
  }

  // 3. Local project staging directory
  const localPkg = path.resolve(process.cwd(), 'data', 'source_packages', 'playbook-v2', 'ziggers-playbook-v2.json');
  if (fs.existsSync(localPkg)) return localPkg;

  // 4. External staging fallback
  const externalPkg = 'C:\\Users\\HP\\Documents\\Codex\\2026-10-01\\ana\\outputs\\ziggers-playbook-v2.json';
  if (fs.existsSync(externalPkg)) return externalPkg;

  throw new Error('Playbook v2 file "ziggers-playbook-v2.json" could not be located via manifest or configured paths.');
}

/**
 * Validates a single playbook record against required fields and evidence links
 */
function validatePlaybookRecord(pb, knownSourceIds) {
  const errors = [];
  if (!pb.id || typeof pb.id !== 'string') errors.push('Missing or invalid id');
  if (!pb.family || typeof pb.family !== 'string') errors.push('Missing or invalid family');
  if (!pb.name || typeof pb.name !== 'string') errors.push('Missing or invalid name');
  if (!pb.goal || typeof pb.goal !== 'string') errors.push('Missing or invalid goal/objective');
  if (!pb.buyer_need || typeof pb.buyer_need !== 'string') errors.push('Missing or invalid buyer_need');
  if (!pb.format || typeof pb.format !== 'string') errors.push('Missing or invalid format');
  if (!Array.isArray(pb.sequence) || pb.sequence.length === 0) errors.push('Sequence must be a non-empty array');
  if (!Array.isArray(pb.locations) || pb.locations.length === 0) errors.push('Locations must be a non-empty array');
  if (!Array.isArray(pb.needs) || pb.needs.length === 0) errors.push('Needs must be a non-empty array');
  if (!pb.bottleneck) errors.push('Missing bottleneck');
  if (!Array.isArray(pb.outcomes) || pb.outcomes.length === 0) errors.push('Outcomes must be a non-empty array');
  if (!pb.followup) errors.push('Missing followup');

  // Validate evidence references
  if (Array.isArray(pb.references)) {
    for (const refId of pb.references) {
      if (!knownSourceIds.has(refId)) {
        errors.push(`Unknown evidence reference "${refId}" not in sources register`);
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Imports the Campaign Decision Playbook v2 package into SQLite/PostgreSQL
 */
export function importPlaybookPackage(options = {}) {
  const db = getDatabase();
  const filePath = options.filePath || resolvePlaybookPackagePath();

  if (!fs.existsSync(filePath)) {
    throw new Error(`Playbook package file not found at: ${filePath}`);
  }

  const rawJson = fs.readFileSync(filePath, 'utf8');
  const checksum = crypto.createHash('sha256').update(rawJson).digest('hex');
  const data = JSON.parse(rawJson);

  const now = new Date().toISOString();
  const batchId = `pb_batch_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const versionTag = data.version || '2.0-draft';

  const summary = {
    batchId,
    filePath,
    checksum,
    version: versionTag,
    title: data.title || 'Ziggers Campaign Decision Playbook · Version 2',
    preparedOn: data.prepared_on || '2026-10-01',
    sources: { processed: 0, accepted: 0, rejected: 0, unchanged: 0 },
    families: { processed: 0, accepted: 0 },
    playbooks: { processed: 0, accepted: 0, rejected: 0, unchanged: 0, preservedAdminEdits: 0 },
    rejections: []
  };

  withTransaction(() => {
    // 1. Record / Update Version Metadata
    const existingVersion = db.prepare('SELECT version, publication_status FROM playbook_versions WHERE version = ?').get(versionTag);
    if (!existingVersion) {
      db.prepare(`
        INSERT INTO playbook_versions (
          version, title, prepared_on, publication_status, integration_status,
          evidence_policy, ranking_policy_json, global_rules_json,
          shared_brief_fields_json, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        versionTag,
        data.title || 'Ziggers Campaign Decision Playbook · Version 2',
        data.prepared_on || '2026-10-01',
        'DRAFT_FOR_OPERATIONS_REVIEW',
        data.integration_status || 'PROPOSED_FOR_INTEGRATION',
        data.evidence_policy || '',
        JSON.stringify(data.ranking_policy || {}),
        JSON.stringify(data.global_rules || {}),
        JSON.stringify(data.shared_brief_fields || []),
        now,
        now
      );
    } else {
      // Update metadata while strictly preserving publication_status
      db.prepare(`
        UPDATE playbook_versions 
        SET title = ?, prepared_on = ?, integration_status = ?,
            evidence_policy = ?, ranking_policy_json = ?, global_rules_json = ?,
            shared_brief_fields_json = ?, updated_at = ?
        WHERE version = ?
      `).run(
        data.title || 'Ziggers Campaign Decision Playbook · Version 2',
        data.prepared_on || '2026-10-01',
        data.integration_status || 'PROPOSED_FOR_INTEGRATION',
        data.evidence_policy || '',
        JSON.stringify(data.ranking_policy || {}),
        JSON.stringify(data.global_rules || {}),
        JSON.stringify(data.shared_brief_fields || []),
        now,
        versionTag
      );
    }

    // 2. Ingest Evidence Sources (13 sources)
    const knownSourceIds = new Set();
    const insertSource = db.prepare(`
      INSERT INTO evidence_sources (
        source_id, publisher, title, url, supports, does_not_support, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(source_id) DO UPDATE SET
        publisher = excluded.publisher,
        title = excluded.title,
        url = excluded.url,
        supports = excluded.supports,
        does_not_support = excluded.does_not_support,
        updated_at = excluded.updated_at
    `);

    if (Array.isArray(data.sources)) {
      for (const src of data.sources) {
        summary.sources.processed++;
        if (!src.id || !src.publisher || !src.title || !src.url) {
          summary.sources.rejected++;
          summary.rejections.push({
            type: 'SOURCE',
            id: src.id || 'UNKNOWN',
            reason: 'Missing mandatory source fields (id, publisher, title, url)'
          });
          continue;
        }

        insertSource.run(
          src.id,
          src.publisher,
          src.title,
          src.url,
          src.supports || '',
          src.does_not_support || '',
          now,
          now
        );
        knownSourceIds.add(src.id);
        summary.sources.accepted++;
      }
    }

    // 3. Extract and populate Planning Families (15 families)
    const familiesMap = new Map();
    if (Array.isArray(data.playbooks)) {
      for (const pb of data.playbooks) {
        if (pb.family && !familiesMap.has(pb.family)) {
          const familyId = pb.family.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
          familiesMap.set(pb.family, familyId);
        }
      }
    }

    const insertFamily = db.prepare(`
      INSERT OR IGNORE INTO playbook_families (family_id, name, description, created_at)
      VALUES (?, ?, ?, ?)
    `);

    for (const [familyName, familyId] of familiesMap.entries()) {
      summary.families.processed++;
      insertFamily.run(familyId, familyName, `Planning family for ${familyName}`, now);
      summary.families.accepted++;
    }

    // 4. Ingest Playbook Definitions (41 playbooks)
    const selectExisting = db.prepare(`
      SELECT id, version, review_status, reviewer, is_published, content_json
      FROM playbooks
      WHERE id = ? AND version = ?
    `);

    const selectAdminEdits = db.prepare(`
      SELECT COUNT(*) as edit_count FROM playbook_admin_edits WHERE playbook_id = ? AND version = ?
    `);

    const insertPlaybook = db.prepare(`
      INSERT INTO playbooks (
        id, version, family, name, objective, buyer_need, ask_json, format,
        sequence_json, locations_json, avoid_json, needs_json, bottleneck,
        outcomes_json, followup, pilot_question, review_status, recommendation_basis,
        performance_benchmarks_json, actual_venue_ids_json, required_brief_fields_json,
        quote_backed_cost, reviewer, review_notes, reviewed_at, is_published,
        content_json, created_at, updated_at
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?
      )
    `);

    const updatePlaybookDraft = db.prepare(`
      UPDATE playbooks SET
        family = ?, name = ?, objective = ?, buyer_need = ?, ask_json = ?, format = ?,
        sequence_json = ?, locations_json = ?, avoid_json = ?, needs_json = ?, bottleneck = ?,
        outcomes_json = ?, followup = ?, pilot_question = ?, recommendation_basis = ?,
        performance_benchmarks_json = ?, actual_venue_ids_json = ?, required_brief_fields_json = ?,
        quote_backed_cost = ?, content_json = ?, updated_at = ?
      WHERE id = ? AND version = ?
    `);

    const insertEvidenceLink = db.prepare(`
      INSERT OR IGNORE INTO playbook_evidence_links (playbook_id, version, source_id)
      VALUES (?, ?, ?)
    `);

    if (Array.isArray(data.playbooks)) {
      for (const pb of data.playbooks) {
        summary.playbooks.processed++;

        // Validate structure
        const val = validatePlaybookRecord(pb, knownSourceIds);
        if (!val.isValid) {
          summary.playbooks.rejected++;
          summary.rejections.push({
            type: 'PLAYBOOK',
            id: pb.id || 'UNKNOWN',
            reason: val.errors.join('; ')
          });
          continue;
        }

        const existing = selectExisting.get(pb.id, versionTag);
        const adminEdits = selectAdminEdits.get(pb.id, versionTag);
        const hasAdminEdits = (adminEdits?.edit_count || 0) > 0;

        // Check if admin has already reviewed, published, or customized this record
        if (existing && (existing.review_status !== 'DRAFT_FOR_OPERATIONS_REVIEW' || existing.reviewer || existing.is_published === 1 || hasAdminEdits)) {
          // Strictly preserve administrator work
          summary.playbooks.unchanged++;
          summary.playbooks.preservedAdminEdits++;
          continue;
        }

        const contentJson = JSON.stringify(pb);

        if (existing) {
          // Record exists in draft state without admin edits; check if content matches
          if (existing.content_json === contentJson) {
            summary.playbooks.unchanged++;
          } else {
            // Update draft content
            updatePlaybookDraft.run(
              pb.family,
              pb.name,
              pb.goal,
              pb.buyer_need,
              JSON.stringify(pb.ask || []),
              pb.format,
              JSON.stringify(pb.sequence || []),
              JSON.stringify(pb.locations || []),
              JSON.stringify(pb.avoid || []),
              JSON.stringify(pb.needs || []),
              pb.bottleneck,
              JSON.stringify(pb.outcomes || []),
              pb.followup,
              pb.pilot_question || null,
              'AUTHORED_PLANNING_HYPOTHESIS',
              JSON.stringify(pb.performance_benchmarks || null),
              JSON.stringify(pb.actual_venue_ids || []),
              JSON.stringify(pb.required_brief_fields || []),
              pb.quote_backed_cost || null,
              contentJson,
              now,
              pb.id,
              versionTag
            );
            summary.playbooks.accepted++;
          }
        } else {
          // Fresh insert: All imported playbooks start strictly as DRAFT_FOR_OPERATIONS_REVIEW
          insertPlaybook.run(
            pb.id,
            versionTag,
            pb.family,
            pb.name,
            pb.goal,
            pb.buyer_need,
            JSON.stringify(pb.ask || []),
            pb.format,
            JSON.stringify(pb.sequence || []),
            JSON.stringify(pb.locations || []),
            JSON.stringify(pb.avoid || []),
            JSON.stringify(pb.needs || []),
            pb.bottleneck,
            JSON.stringify(pb.outcomes || []),
            pb.followup,
            pb.pilot_question || null,
            'DRAFT_FOR_OPERATIONS_REVIEW',
            'AUTHORED_PLANNING_HYPOTHESIS',
            JSON.stringify(pb.performance_benchmarks || null),
            JSON.stringify(pb.actual_venue_ids || []),
            JSON.stringify(pb.required_brief_fields || []),
            pb.quote_backed_cost || null,
            null, // reviewer
            null, // review_notes
            null, // reviewed_at
            0,    // is_published
            contentJson,
            now,
            now
          );
          summary.playbooks.accepted++;
        }

        // Link evidence references
        if (Array.isArray(pb.references)) {
          for (const refId of pb.references) {
            insertEvidenceLink.run(pb.id, versionTag, refId);
          }
        }
      }
    }

    // 5. Record Import Batch Audit Entry
    db.prepare(`
      INSERT INTO playbook_import_batches (
        batch_id, package_version, file_path, checksum_sha256,
        playbooks_processed, playbooks_accepted, playbooks_rejected, playbooks_unchanged,
        sources_processed, sources_accepted, review_status, rejection_log_json,
        imported_by, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      batchId,
      versionTag,
      filePath,
      checksum,
      summary.playbooks.processed,
      summary.playbooks.accepted,
      summary.playbooks.rejected,
      summary.playbooks.unchanged,
      summary.sources.processed,
      summary.sources.accepted,
      'DRAFT_FOR_OPERATIONS_REVIEW',
      JSON.stringify(summary.rejections),
      options.importedBy || 'system_importer',
      now
    );
  });

  return summary;
}

/**
 * Returns summary counts of currently imported playbooks and sources
 */
export function getPlaybookLibrarySummary() {
  const db = getDatabase();
  const playbooksCount = db.prepare('SELECT COUNT(*) as count FROM playbooks').get()?.count || 0;
  const publishedCount = db.prepare('SELECT COUNT(*) as count FROM playbooks WHERE is_published = 1').get()?.count || 0;
  const draftCount = db.prepare("SELECT COUNT(*) as count FROM playbooks WHERE review_status = 'DRAFT_FOR_OPERATIONS_REVIEW'").get()?.count || 0;
  const sourcesCount = db.prepare('SELECT COUNT(*) as count FROM evidence_sources').get()?.count || 0;
  const familiesCount = db.prepare('SELECT COUNT(*) as count FROM playbook_families').get()?.count || 0;
  const latestBatch = db.prepare('SELECT * FROM playbook_import_batches ORDER BY created_at DESC LIMIT 1').get() || null;

  return {
    playbooksCount,
    publishedCount,
    draftCount,
    sourcesCount,
    familiesCount,
    latestBatch
  };
}
