/**
 * Ziggers Production Engine - Spatial Population & Demographics Repository
 * File: src/lib/data/repositories/populationRepository.js
 * 
 * Provides gridded Census & WorldPop spatial population layers from database.
 */

import { getDatabase } from '../database.js';

export function getSpatialPopulationByH3(h3Index) {
  const db = getDatabase();

  const spatialRow = db.prepare('SELECT * FROM spatial_population_h3 WHERE h3_index = ?').get(h3Index);
  if (!spatialRow) {
    return {
      h3_index: h3Index,
      base_population: 0,
      status: 'DATA_UNAVAILABLE',
      isFallback: true,
      provenance: {
        source: 'FALLBACK_DATA',
        status: 'DATA_UNAVAILABLE',
        notice: `No spatial population layer available for H3 index ${h3Index}`,
        confidenceTier: 'LOW',
        retrievedAt: new Date().toISOString()
      }
    };
  }

  const demoRow = db.prepare('SELECT * FROM demographic_profiles WHERE h3_index = ?').get(h3Index);

  return {
    ...spatialRow,
    demographics: demoRow || {
      age_18_24_ratio: 0.22,
      age_25_34_ratio: 0.34,
      age_35_44_ratio: 0.23,
      age_45_54_ratio: 0.12,
      age_55_plus_ratio: 0.09,
      male_ratio: 0.51,
      female_ratio: 0.49
    },
    provenance: {
      source: 'DATABASE_SPATIAL_POPULATION_H3',
      layer: 'CENSUS_2011_PROJECTED_WORLDPOP',
      confidenceTier: 'UNVERIFIED_SEED',
      evidenceStatus: spatialRow.evidence_status || 'UNVERIFIED_SEED',
      sourceCitation: spatialRow.source_citation || 'UNVERIFIED_HISTORICAL_SEED',
      dataQualityTier: spatialRow.data_quality_tier || 'UNVERIFIED_ASSUMPTION',
      notice: 'Historical metropolitan seed node; raw Census/WorldPop raster row unverified.',
      retrievedAt: new Date().toISOString()
    }
  };
}

export function findNearestSpatialNode(centerLat, centerLng, cityHint = null) {
  const db = getDatabase();

  let query = 'SELECT * FROM spatial_population_h3';
  let params = [];

  if (cityHint) {
    query += ' WHERE LOWER(city) = LOWER(?)';
    params.push(cityHint);
  }

  const nodes = db.prepare(query).all(...params);
  if (!nodes || nodes.length === 0) {
    // If no city match, query all nodes
    const allNodes = db.prepare('SELECT * FROM spatial_population_h3').all();
    if (!allNodes || allNodes.length === 0) return null;
    return getSpatialPopulationByH3(allNodes[0].h3_index);
  }

  // Find node with minimum Euclidean distance (squared)
  let bestNode = null;
  let minDistance = Infinity;

  for (const node of nodes) {
    const dLat = node.center_lat - centerLat;
    const dLng = node.center_lng - centerLng;
    const distSq = (dLat * dLat) + (dLng * dLng);
    if (distSq < minDistance) {
      minDistance = distSq;
      bestNode = node;
    }
  }

  return bestNode ? getSpatialPopulationByH3(bestNode.h3_index) : null;
}
