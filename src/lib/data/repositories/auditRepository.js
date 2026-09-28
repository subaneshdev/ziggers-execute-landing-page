/**
 * Ziggers Production Engine - Cryptographic Audit Ledger Repository
 * File: src/lib/data/repositories/auditRepository.js
 * 
 * Provides server-side SHA-256 hash chaining and HMAC attestation.
 * Guarantees:
 * - Reads secret ONLY from server environment (AUDIT_HMAC_MASTER_SECRET).
 * - Fails closed if secret is missing.
 * - Deterministic JSON canonicalization.
 * - Detects tampering, record deletion, and head forgery.
 */

import crypto from 'crypto';
import { getDatabase, withTransaction } from '../database.js';

function getAuditHmacSecret() {
  const secret = process.env.AUDIT_HMAC_MASTER_SECRET;
  if (!secret) {
    throw new Error('FATAL SECURITY FAILURE: AUDIT_HMAC_MASTER_SECRET is not configured in server environment. Audit engine failed closed.');
  }
  return secret;
}

export function canonicalizeJson(obj) {
  if (obj === null || typeof obj !== 'object') {
    return JSON.stringify(obj);
  }
  if (Array.isArray(obj)) {
    return '[' + obj.map(canonicalizeJson).join(',') + ']';
  }
  const sortedKeys = Object.keys(obj).sort();
  const keyValues = sortedKeys.map(key => `${JSON.stringify(key)}:${canonicalizeJson(obj[key])}`);
  return '{' + keyValues.join(',') + '}';
}

export function sha256Hex(content) {
  return '0x' + crypto.createHash('sha256').update(content).digest('hex');
}

export function hmacSha256Hex(content, secret) {
  return '0x' + crypto.createHmac('sha256', secret).update(content).digest('hex');
}

/**
 * Append an immutable event to the tenant's cryptographic audit chain
 */
export function appendAuditEvent({
  tenantId = 'default_org',
  eventType,
  entityId,
  payload
}) {
  const secret = getAuditHmacSecret();
  const db = getDatabase();

  return withTransaction((tx) => {
    // 1. Get current chain head
    const headRow = tx.prepare('SELECT * FROM audit_chain_heads WHERE tenant_id = ?').get(tenantId);
    const previousHash = headRow ? headRow.last_crypto_hash : '0x0000000000000000000000000000000000000000000000000000000000000000';
    const totalCount = headRow ? headRow.total_events_count : 0;

    const eventId = `evt_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const now = new Date().toISOString();

    const recordPayload = {
      eventId,
      tenantId,
      eventType,
      entityId,
      payload,
      previousHash,
      timestamp: now
    };

    const canonicalJson = canonicalizeJson(recordPayload);
    const cryptoHash = sha256Hex(canonicalJson);
    const hmacSignature = hmacSha256Hex(cryptoHash, secret);

    // 2. Insert event
    tx.prepare(`
      INSERT INTO audit_chain_events (
        id, event_id, tenant_id, event_type, entity_id, canonical_payload_json,
        previous_hash, crypto_hash, hmac_signature, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      eventId, eventId, tenantId, eventType, entityId, canonicalJson,
      previousHash, cryptoHash, hmacSignature, now
    );

    // 3. Update head
    tx.prepare(`
      INSERT INTO audit_chain_heads (tenant_id, last_crypto_hash, total_events_count, updated_at)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(tenant_id) DO UPDATE SET
        last_crypto_hash = excluded.last_crypto_hash,
        total_events_count = excluded.total_events_count,
        updated_at = excluded.updated_at
    `).run(tenantId, cryptoHash, totalCount + 1, now);

    return {
      eventId,
      tenantId,
      eventType,
      previousHash,
      cryptoHash,
      hmacSignature,
      timestamp: now
    };
  });
}

/**
 * Verify cryptographic integrity of a tenant's audit chain
 */
export function verifyAuditChain(tenantId = 'default_org') {
  const secret = getAuditHmacSecret();
  const db = getDatabase();

  const events = db.prepare(`
    SELECT * FROM audit_chain_events
    WHERE tenant_id = ?
    ORDER BY created_at ASC
  `).all(tenantId);

  if (!events || events.length === 0) {
    return { isValid: true, verifiedEventsCount: 0, message: 'Chain is empty.' };
  }

  let expectedPreviousHash = '0x0000000000000000000000000000000000000000000000000000000000000000';

  for (let i = 0; i < events.length; i++) {
    const evt = events[i];

    // Check link to previous
    if (evt.previous_hash !== expectedPreviousHash) {
      return {
        isValid: false,
        brokenEventId: evt.event_id,
        index: i,
        reason: `Broken chain link. Expected previous hash ${expectedPreviousHash}, got ${evt.previous_hash}`
      };
    }

    // Recompute payload hash
    const recomputedHash = sha256Hex(evt.canonical_payload_json);
    if (recomputedHash !== evt.crypto_hash) {
      return {
        isValid: false,
        brokenEventId: evt.event_id,
        index: i,
        reason: `Hash mismatch. Payload has been tampered with.`
      };
    }

    // Recompute HMAC signature
    const recomputedHmac = hmacSha256Hex(evt.crypto_hash, secret);
    if (recomputedHmac !== evt.hmac_signature) {
      return {
        isValid: false,
        brokenEventId: evt.event_id,
        index: i,
        reason: `Invalid HMAC signature. Attestation failure.`
      };
    }

    expectedPreviousHash = evt.crypto_hash;
  }

  const headRow = db.prepare('SELECT * FROM audit_chain_heads WHERE tenant_id = ?').get(tenantId);
  if (!headRow || headRow.last_crypto_hash !== expectedPreviousHash) {
    return {
      isValid: false,
      reason: 'Audit chain head pointer does not match final event hash.'
    };
  }

  return {
    isValid: true,
    verifiedEventsCount: events.length,
    finalCryptoHash: expectedPreviousHash
  };
}

/**
 * Get current audit chain head hash for a tenant
 */
export function getAuditHead(tenantId = 'default_org') {
  const db = getDatabase();
  const row = db.prepare('SELECT * FROM audit_chain_heads WHERE tenant_id = ?').get(tenantId);
  return row ? row.last_crypto_hash : '0x0000000000000000000000000000000000000000000000000000000000000000';
}
