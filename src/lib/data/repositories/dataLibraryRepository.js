/**
 * Ziggers Production Engine - Data Library & Provenance Repository
 * File: src/lib/data/repositories/dataLibraryRepository.js
 * 
 * Provides validated, source-aware queries for external market context,
 * transit passenger flows, venue directories, and import audit batches.
 */

import { getDatabase } from '../database.js';

export function getAllDataSources() {
  const db = getDatabase();
  return db.prepare(`
    SELECT source_id, publisher, url, licence_url, api_docs, data_period,
           published_on, status, is_connected, kind, allowed_use, restriction,
           created_at, updated_at
    FROM data_sources
    ORDER BY source_id ASC
  `).all();
}

export function getDataSourceById(sourceId) {
  const db = getDatabase();
  return db.prepare(`
    SELECT * FROM data_sources WHERE source_id = ?
  `).get(sourceId);
}

export function getImportBatches() {
  const db = getDatabase();
  return db.prepare(`
    SELECT b.*, v.version_tag, v.package_version, v.checked_on, v.checksum_sha256,
           s.publisher as source_publisher
    FROM import_batches b
    LEFT JOIN dataset_versions v ON b.dataset_version_id = v.id
    LEFT JOIN data_sources s ON b.source_id = s.source_id
    ORDER BY b.created_at DESC
  `).all();
}

export function getMarketContextForStateOrCity(stateOrCity) {
  if (!stateOrCity) return null;
  const db = getDatabase();
  const normalized = normalizeLocationToState(stateOrCity);

  const rows = db.prepare(`
    SELECT m.*, s.publisher, s.url, s.data_period, s.restriction
    FROM market_context m
    JOIN data_sources s ON m.source_id = s.source_id
    WHERE LOWER(m.area_name) = LOWER(?)
    ORDER BY m.sector ASC
  `).all(normalized);

  if (rows && rows.length > 0) {
    const rural = rows.find(r => r.sector === 'Rural');
    const urban = rows.find(r => r.sector === 'Urban');
    return {
      areaName: rows[0].area_name,
      areaLevel: rows[0].area_level,
      period: rows[0].period,
      unit: rows[0].unit,
      evidenceType: rows[0].evidence_type,
      allowedUse: rows[0].allowed_use,
      qualityNote: rows[0].quality_note,
      rural: rural ? { value: rural.value, unit: rural.unit } : null,
      urban: urban ? { value: urban.value, unit: urban.unit } : null,
      publisher: rows[0].publisher,
      sourceUrl: rows[0].url,
      restriction: rows[0].restriction,
      disclaimer: `Official MoSPI survey estimate (Table 1, Aug 2023-Jul 2024). This is state ${urban ? 'urban' : 'general'} consumption expenditure, not personal income or venue spending.`
    };
  }

  // Fallback to All-India national benchmark if state not directly matched
  const nationalRows = db.prepare(`
    SELECT m.*, s.publisher, s.url, s.data_period, s.restriction
    FROM market_context m
    JOIN data_sources s ON m.source_id = s.source_id
    WHERE m.area_name = 'All-India'
  `).all();

  if (nationalRows && nationalRows.length > 0) {
    const rural = nationalRows.find(r => r.sector === 'Rural');
    const urban = nationalRows.find(r => r.sector === 'Urban');
    return {
      areaName: 'All-India (National Benchmark)',
      areaLevel: 'National',
      period: nationalRows[0].period,
      unit: nationalRows[0].unit,
      evidenceType: nationalRows[0].evidence_type,
      allowedUse: nationalRows[0].allowed_use,
      qualityNote: nationalRows[0].quality_note,
      rural: rural ? { value: rural.value, unit: rural.unit } : null,
      urban: urban ? { value: urban.value, unit: urban.unit } : null,
      publisher: nationalRows[0].publisher,
      sourceUrl: nationalRows[0].url,
      restriction: nationalRows[0].restriction,
      disclaimer: 'All-India national aggregate consumption expenditure; state-specific data not matched.'
    };
  }

  return null;
}

export function getTransitContextForCity(city) {
  if (!city) return null;
  const db = getDatabase();

  const rows = db.prepare(`
    SELECT t.*, s.publisher, s.url, s.data_period, s.restriction
    FROM transit_context t
    JOIN data_sources s ON t.source_id = s.source_id
    WHERE LOWER(t.city) = LOWER(?)
    ORDER BY t.month DESC
  `).all(city);

  if (rows && rows.length > 0) {
    return {
      city: rows[0].city,
      geographicScope: rows[0].geographic_scope,
      metric: rows[0].metric,
      unit: rows[0].unit,
      evidenceType: rows[0].evidence_type,
      allowedUse: rows[0].allowed_use,
      publisher: rows[0].publisher,
      sourceUrl: rows[0].url,
      restriction: rows[0].restriction,
      monthlyObservations: rows.map(r => ({ month: r.month, value: r.value })),
      latestMonth: rows[0].month,
      latestValue: rows[0].value,
      disclaimer: 'Network-wide total passenger flow from operator reports. This is NOT station, venue, or promotional stall footfall.'
    };
  }

  return {
    city,
    status: 'DATA_UNAVAILABLE',
    notice: `No public transit flow records connected for ${city}. CMRL transit records currently available for Chennai only.`
  };
}

export function getVenuesByLocation(cityOrState) {
  const db = getDatabase();
  const query = cityOrState ? `
    SELECT v.*, s.publisher, s.url, s.data_period
    FROM venue_directory v
    JOIN data_sources s ON v.source_id = s.source_id
    WHERE LOWER(v.city) LIKE LOWER(?) OR LOWER(v.state) LIKE LOWER(?)
    ORDER BY v.name ASC
  ` : `
    SELECT v.*, s.publisher, s.url, s.data_period
    FROM venue_directory v
    JOIN data_sources s ON v.source_id = s.source_id
    ORDER BY v.name ASC
  `;

  const params = cityOrState ? [`%${cityOrState}%`, `%${cityOrState}%`] : [];
  const rows = db.prepare(query).all(...params);

  return rows.map(r => ({
    institutionId: r.source_institution_id,
    name: r.name,
    city: r.city,
    state: r.state,
    edition: r.edition,
    permissionStatus: r.permission_status,
    footfall: r.footfall, // Explicit null if unmeasured
    studentCount: r.student_count,
    evidenceType: r.evidence_type,
    publisher: r.publisher,
    sourceUrl: r.url,
    disclaimer: 'Published institutional directory subset. Campus permission is NOT confirmed and daily footfall is NOT measured.'
  }));
}

export function getComprehensiveEvidenceContext(params = {}) {
  const { city = 'Chennai', state = null, locationName = null, objective = 'Product Sampling' } = params;

  const market = getMarketContextForStateOrCity(state || city);
  const transit = getTransitContextForCity(city);
  const venues = getVenuesByLocation(city);

  return {
    marketContext: market,
    transitContext: transit,
    venueContext: venues.length > 0 ? venues.slice(0, 3) : null,
    weatherContext: {
      provider: 'India Meteorological Department (IMD)',
      status: 'SOURCE_IDENTIFIED_NOT_CONNECTED',
      notice: 'Live IMD weather connection not configured; outdoor weather risk assessment requires live API key.'
    },
    vendorQuotesContext: {
      status: 'DEFAULT_CONTRACT_RATES',
      promoterHourlyRatePaise: 24000, // ₹240/hr
      supervisorDailyFeePaise: 200000, // ₹2,000/shift
      notice: 'Using canonical contracted enterprise rates. Local vendor quotes must be refreshed per campaign city.'
    },
    limitationsNotice: [
      'Residential population is not pedestrian footfall.',
      'State spending is average consumption expenditure, not disposable income or venue spending.',
      'Transit passenger counts represent entire network flow, never stall reach.',
      'College directory listings do not establish venue permission or attendance.'
    ]
  };
}

function normalizeLocationToState(name) {
  if (!name) return 'All-India';
  const clean = String(name).trim().toLowerCase();

  const cityToState = {
    'chennai': 'Tamil Nadu',
    'coimbatore': 'Tamil Nadu',
    'madurai': 'Tamil Nadu',
    'bangalore': 'Karnataka',
    'bengaluru': 'Karnataka',
    'mysore': 'Karnataka',
    'mumbai': 'Maharashtra',
    'pune': 'Maharashtra',
    'nagpur': 'Maharashtra',
    'delhi': 'Delhi',
    'new delhi': 'Delhi',
    'noida': 'Uttar Pradesh',
    'gurgaon': 'Haryana',
    'gurugram': 'Haryana',
    'hyderabad': 'Telangana',
    'secunderabad': 'Telangana',
    'kolkata': 'West Bengal',
    'chandigarh': 'Chandigarh',
    'kochi': 'Kerala',
    'ernakulam': 'Kerala',
    'thiruvananthapuram': 'Kerala',
    'ahmedabad': 'Gujarat',
    'jaipur': 'Rajasthan',
    'lucknow': 'Uttar Pradesh'
  };

  if (cityToState[clean]) {
    return cityToState[clean];
  }

  // Capitalize title
  return name.charAt(0).toUpperCase() + name.slice(1);
}

export function getDataLibrarySummary() {
  const db = getDatabase();
  const sourcesCount = db.prepare('SELECT COUNT(*) as c FROM data_sources').get().c;
  const marketCount = db.prepare('SELECT COUNT(*) as c FROM market_context').get().c;
  const transitCount = db.prepare('SELECT COUNT(*) as c FROM transit_context').get().c;
  const venueCount = db.prepare('SELECT COUNT(*) as c FROM venue_directory').get().c;
  const batchesCount = db.prepare('SELECT COUNT(*) as c FROM import_batches').get().c;
  const activeRecordsSourcesCount = db.prepare("SELECT COUNT(*) as c FROM data_sources WHERE status LIKE '%included%' OR is_connected = 1").get().c;
  const unconnectedSourcesCount = db.prepare("SELECT COUNT(*) as c FROM data_sources WHERE status NOT LIKE '%included%' AND is_connected = 0").get().c;

  return {
    dataSourcesCount: sourcesCount,
    marketContextCount: marketCount,
    transitObservationsCount: transitCount,
    venueDirectoryCount: venueCount,
    importBatchesCount: batchesCount,
    activeRecordsSourcesCount,
    unconnectedSourcesCount
  };
}
