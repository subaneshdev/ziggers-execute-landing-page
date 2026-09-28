/**
 * Ziggers Production Engine - Venue POI Repository
 * File: src/lib/data/repositories/poiRepository.js
 * 
 * Queries POI counts from database registry with data source confidence.
 */

import { getDatabase } from '../database.js';

export function getPoiCountsForH3(h3Index) {
  const db = getDatabase();

  const rows = db.prepare('SELECT * FROM venue_poi_registry WHERE h3_index = ?').all(h3Index);

  const poiCounts = {};
  let totalPois = 0;
  let source = 'DATABASE_POI_REGISTRY';
  let confidenceScore = 0.88;

  if (rows && rows.length > 0) {
    for (const r of rows) {
      poiCounts[r.poi_category] = r.poi_count;
      totalPois += r.poi_count;
      source = r.source;
      confidenceScore = r.confidence_score;
    }
  } else {
    // Sparse node fallback with lower confidence tag
    poiCounts.fitness = 10;
    poiCounts.food = 35;
    poiCounts.fashion = 20;
    poiCounts.technology = 15;
    totalPois = 80;
    source = 'FALLBACK_DATA_SPARSE_ESTIMATE';
    confidenceScore = 0.60;
  }

  return {
    poiCounts,
    totalPois,
    source,
    confidenceScore,
    isFallback: !rows || rows.length === 0,
    collectedAt: new Date().toISOString()
  };
}
