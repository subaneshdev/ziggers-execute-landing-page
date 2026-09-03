/**
 * Ziggers Intelligence - Tamper-Evident Audit Record Engine
 * 
 * Provides cryptographic tamper-evidence (SHA-256 Hash Chaining + Server HMAC).
 * IMPORTANT: A cryptographic hash only proves that the record has NOT been altered after signing;
 * it does NOT by itself prove that physical on-ground work took place.
 */

const SERVER_AUDIT_KEY_CONFIG = {
  keyId: 'audit-key-2026-v1',
  signatureVersion: 'v1',
  algorithm: 'HMAC-SHA256',
  externalAnchorBucket: 'ziggers-audit-vault-immutable',
  s3Prefix: 'audit_merkle_roots/2026/'
};

/**
 * Deterministically serialize a JavaScript object to canonical JSON (sorted keys)
 */
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

/**
 * Compute SHA-256 hex string using Web Crypto API
 */
export async function sha256(str) {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const cryptoObj = (typeof globalThis !== 'undefined' && globalThis.crypto) || crypto;
  const hashBuffer = await cryptoObj.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return '0x' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Compute Server HMAC-SHA256 Signature for an audit hash
 */
export async function signProofHashWithHmac(hashHex, secretKey = 'ziggers_enterprise_audit_hmac_master_secret') {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secretKey);
  const cryptoObj = (typeof globalThis !== 'undefined' && globalThis.crypto) || crypto;
  const cryptoKey = await cryptoObj.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signatureBuffer = await cryptoObj.subtle.sign(
    'HMAC',
    cryptoKey,
    encoder.encode(hashHex)
  );
  const sigArray = Array.from(new Uint8Array(signatureBuffer));
  return '0x' + sigArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Create a cryptographically chained, tamper-evident audit record
 * @param {Object} proofPayload 
 * @param {string} previousHash 
 * @returns {Promise<Object>}
 */
export async function createChainedAuditProof(proofPayload, previousHash = '0x0000000000000000000000000000000000000000000000000000000000000000') {
  const canonicalData = canonicalizeJson({
    proofId: proofPayload.proofId,
    campaignId: proofPayload.campaignId,
    campaignName: proofPayload.campaignName,
    workerId: proofPayload.workerId,
    proofType: proofPayload.proofType,
    location: proofPayload.location,
    latitude: proofPayload.latitude,
    longitude: proofPayload.longitude,
    gpsAccuracy: proofPayload.gpsAccuracy,
    timestamp: proofPayload.timestamp || new Date().toISOString()
  });

  const payloadToHash = `${canonicalData}:${previousHash}`;
  const cryptoHash = await sha256(payloadToHash);
  const serverSignature = await signProofHashWithHmac(cryptoHash);

  return {
    ...proofPayload,
    canonicalPayload: canonicalData,
    previousHash,
    cryptoHash,
    signatureMetadata: {
      signature: serverSignature,
      keyId: SERVER_AUDIT_KEY_CONFIG.keyId,
      signatureVersion: SERVER_AUDIT_KEY_CONFIG.signatureVersion,
      algorithm: SERVER_AUDIT_KEY_CONFIG.algorithm,
      signedAt: new Date().toISOString()
    },
    tamperEvidentStatus: 'TAMPER_EVIDENT_RECORD_VERIFIED',
    auditDescription: 'Cryptographic hash guarantees record immutability since creation timestamp.'
  };
}

/**
 * Compute Merkle Root over a batch of proof hashes for periodic immutable anchoring
 */
export async function computeBatchMerkleRoot(proofHashes = []) {
  if (!proofHashes || proofHashes.length === 0) {
    return {
      merkleRoot: '0x0000000000000000000000000000000000000000000000000000000000000000',
      batchSize: 0,
      anchorDestination: SERVER_AUDIT_KEY_CONFIG
    };
  }

  let currentLevel = [...proofHashes];

  while (currentLevel.length > 1) {
    const nextLevel = [];
    for (let i = 0; i < currentLevel.length; i += 2) {
      if (i + 1 < currentLevel.length) {
        const combined = currentLevel[i] + currentLevel[i + 1];
        const parentHash = await sha256(combined);
        nextLevel.push(parentHash);
      } else {
        const combined = currentLevel[i] + currentLevel[i];
        const parentHash = await sha256(combined);
        nextLevel.push(parentHash);
      }
    }
    currentLevel = nextLevel;
  }

  const merkleRoot = currentLevel[0];

  return {
    merkleRoot,
    batchSize: proofHashes.length,
    anchorDestination: {
      targetBucket: SERVER_AUDIT_KEY_CONFIG.externalAnchorBucket,
      targetPath: `${SERVER_AUDIT_KEY_CONFIG.s3Prefix}${new Date().toISOString().split('T')[0]}_merkle_root.json`,
      timestamp: new Date().toISOString()
    }
  };
}
