import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// 1. Create recoverable backup of current database
const backupDir = path.resolve(process.cwd(), 'data', 'backups');
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

const srcDb = path.resolve(process.cwd(), 'data', 'ziggers_production.db');
if (fs.existsSync(srcDb)) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFile = path.resolve(backupDir, `ziggers_production_pre_playbook_v2_${timestamp}.db`);
  fs.copyFileSync(srcDb, backupFile);
  console.log(`[Backup] Successfully created database backup at: ${backupFile}`);
} else {
  console.log('[Backup] No existing SQLite database found at data/ziggers_production.db.');
}

// 2. Stage playbook v2 files in data/source_packages/playbook-v2
const stageDir = path.resolve(process.cwd(), 'data', 'source_packages', 'playbook-v2');
if (!fs.existsSync(stageDir)) {
  fs.mkdirSync(stageDir, { recursive: true });
}

const extDir = 'C:\\Users\\HP\\Documents\\Codex\\2026-10-01\\ana\\outputs';
const filesToStage = [
  'ziggers-playbook-v2.json',
  'ziggers-playbook-v2.sqlite',
  'Ziggers-Campaign-Playbook-v2.md'
];

for (const fileName of filesToStage) {
  const extFile = path.resolve(extDir, fileName);
  const targetFile = path.resolve(stageDir, fileName);
  if (fs.existsSync(extFile)) {
    fs.copyFileSync(extFile, targetFile);
    console.log(`[Staging] Staged ${fileName} -> ${targetFile}`);
  } else {
    console.warn(`[Staging] Source file ${extFile} not found!`);
  }
}

// 3. Generate playbook manifest
const jsonPath = path.resolve(stageDir, 'ziggers-playbook-v2.json');
if (fs.existsSync(jsonPath)) {
  const rawJson = fs.readFileSync(jsonPath, 'utf8');
  const hash = crypto.createHash('sha256').update(rawJson).digest('hex');
  const parsed = JSON.parse(rawJson);

  const manifest = {
    package_name: 'ziggers-campaign-playbook-v2',
    package_version: parsed.version || '2.0-draft',
    title: parsed.title || 'Ziggers Campaign Decision Playbook · Version 2',
    prepared_on: parsed.prepared_on || '2026-10-01',
    publication_status: parsed.publication_status || 'DRAFT_FOR_OPERATIONS_REVIEW',
    configured_directory: 'data/source_packages/playbook-v2',
    primary_file: 'ziggers-playbook-v2.json',
    reference_sqlite_file: 'ziggers-playbook-v2.sqlite',
    reference_markdown_file: 'Ziggers-Campaign-Playbook-v2.md',
    sha256_checksum: hash,
    total_playbooks: parsed.playbooks ? parsed.playbooks.length : 0,
    total_sources: parsed.sources ? parsed.sources.length : 0,
    evidence_policy: parsed.evidence_policy || '',
    original_external_location: extDir,
    staged_at: new Date().toISOString()
  };

  const configDir = path.resolve(process.cwd(), 'config');
  if (!fs.existsSync(configDir)) fs.mkdirSync(configDir, { recursive: true });

  const manifestPath = path.resolve(configDir, 'playbook_manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
  console.log(`[Manifest] Created playbook manifest at: ${manifestPath}`);
}
