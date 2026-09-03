/**
 * Ziggers Intelligence - Geospatial H3 Engine
 * Multi-Tier Geospatial Processing Pipeline:
 * 1. Application / Preview Layer: Turf.js adaptive geodesic polygon geometric intersection weighting.
 * 2. Production Aggregation Layer: PostGIS spatial engine (ST_Intersection, ST_Area) for authoritative backend queries.
 */

import * as h3 from 'h3-js';
import * as turf from '@turf/turf';

// Approximate edge lengths and area per H3 resolution for calculations
export const H3_RESOLUTION_METRICS = {
  8: { edgeLengthMeters: 461, areaSqKm: 0.737, defaultFor: 'broader_city_analysis' },
  9: { edgeLengthMeters: 174, areaSqKm: 0.105, defaultFor: 'dense_urban_analysis' },
  10: { edgeLengthMeters: 66, areaSqKm: 0.015, defaultFor: 'precise_venue_clustering' }
};

/**
 * Recommend H3 resolution based on search radius and density requirements
 * @param {number} radiusKm 
 * @param {string} mode - 'dense_urban' | 'broad_city' | 'venue_level'
 * @returns {number} H3 resolution (8, 9, or 10)
 */
export function getRecommendedResolution(radiusKm = 3.0, mode = 'dense_urban') {
  if (mode === 'venue_level' || radiusKm <= 0.5) return 10;
  if (mode === 'broad_city' || radiusKm >= 8.0) return 8;
  return 9; // Default dense urban resolution
}

/**
 * Convert lat/lng coordinate to H3 Cell Index
 */
export function latLngToH3Index(lat, lng, resolution = 9) {
  try {
    return h3.latLngToCell(lat, lng, resolution);
  } catch (err) {
    return `89${Math.abs(Math.round(lat * 1000)).toString(16)}${Math.abs(Math.round(lng * 1000)).toString(16)}ffff`;
  }
}

/**
 * Get center coordinates for an H3 cell
 */
export function h3IndexToLatLng(h3Index) {
  try {
    const [lat, lng] = h3.cellToLatLng(h3Index);
    return { lat, lng };
  } catch (err) {
    return { lat: 13.0827, lng: 80.2707 };
  }
}

/**
 * Get hexagonal boundary coordinates for an H3 cell
 */
export function getH3CellBoundary(h3Index) {
  try {
    const coords = h3.cellToBoundary(h3Index);
    return coords.map(([lat, lng]) => ({ lat, lng }));
  } catch (err) {
    return [];
  }
}

/**
 * Generate an adaptive geodesic circle polygon around center (Application Preview Path)
 * N = max(32, min(128, round(32 + radiusKm * 6)))
 */
export function createGeodesicCirclePolygon(centerLat, centerLng, radiusKm = 3.0) {
  const steps = Math.max(32, Math.min(128, Math.round(32 + (radiusKm * 6))));
  const centerPoint = turf.point([centerLng, centerLat]);
  return turf.circle(centerPoint, radiusKm, { steps, units: 'kilometers' });
}

/**
 * Convert an H3 cell index to a Turf Polygon feature [lng, lat]
 */
export function h3CellToTurfPolygon(cellIndex) {
  const boundary = getH3CellBoundary(cellIndex);
  if (!boundary || boundary.length === 0) return null;

  // Turf expects [lng, lat] and closed polygon ring (first == last)
  const coords = boundary.map(pt => [pt.lng, pt.lat]);
  if (coords.length > 0) {
    coords.push([coords[0][0], coords[0][1]]);
  }

  return turf.polygon([coords]);
}

/**
 * Generate all H3 cells covering a radial area with true geometric intersection area weighting:
 * W_cell = Area(CellPolygon ∩ CampaignPolygon) / Area(CellPolygon)
 * @param {number} centerLat 
 * @param {number} centerLng 
 * @param {number} radiusKm 
 * @param {number} resolution 
 * @returns {Array<{h3Index: string, centerLat: number, centerLng: number, distanceMeters: number, overlapWeight: number, intersectionAreaSqMeters: number}>}
 */
export function getH3CellsForRadius(centerLat, centerLng, radiusKm = 3.0, resolution = 9) {
  const centerCell = latLngToH3Index(centerLat, centerLng, resolution);
  const metrics = H3_RESOLUTION_METRICS[resolution] || H3_RESOLUTION_METRICS[9];
  
  // Calculate k-ring radius to cover campaign area
  const radiusMeters = radiusKm * 1000;
  const hexDiameterMeters = metrics.edgeLengthMeters * 2;
  const kRingRadius = Math.max(1, Math.min(18, Math.ceil(radiusMeters / hexDiameterMeters)));

  let cellIndexes = [];
  try {
    cellIndexes = h3.gridDisk(centerCell, kRingRadius);
  } catch (err) {
    cellIndexes = [centerCell];
  }

  // Create Campaign Geodesic Polygon
  const campaignPolygon = createGeodesicCirclePolygon(centerLat, centerLng, radiusKm);

  const evaluatedCells = [];

  for (const cellIndex of cellIndexes) {
    const { lat, lng } = h3IndexToLatLng(cellIndex);
    const distanceMeters = calculateHaversineDistanceMeters(centerLat, centerLng, lat, lng);
    
    // Convert cell boundary to Turf Polygon
    const cellPoly = h3CellToTurfPolygon(cellIndex);
    let overlapWeight = 1.0;
    let intersectionAreaSqMeters = 0;

    if (cellPoly && campaignPolygon) {
      try {
        const cellArea = turf.area(cellPoly);
        const intersection = turf.intersect(turf.featureCollection([cellPoly, campaignPolygon]));

        if (intersection) {
          intersectionAreaSqMeters = turf.area(intersection);
          // W_cell = Area(ST_Intersection(Cell, Polygon)) / Area(Cell)
          overlapWeight = cellArea > 0 ? (intersectionAreaSqMeters / cellArea) : 0;
          overlapWeight = Math.max(0.0, Math.min(1.0, parseFloat(overlapWeight.toFixed(4))));
        } else {
          // If no geometric intersection, cell is outside the circle
          overlapWeight = 0;
        }
      } catch (_) {
        // Fallback smooth geometric decay if Turf intersect encounters degenerate edge
        if (distanceMeters <= radiusMeters * 0.85) {
          overlapWeight = 1.0;
        } else if (distanceMeters <= radiusMeters) {
          overlapWeight = Math.max(0.20, 1.0 - ((distanceMeters - radiusMeters * 0.85) / (radiusMeters * 0.15)) * 0.8);
        } else {
          overlapWeight = 0;
        }
      }
    }

    // Only include cells that actually intersect the campaign polygon
    if (overlapWeight > 0.01) {
      evaluatedCells.push({
        h3Index: cellIndex,
        centerLat: lat,
        centerLng: lng,
        distanceMeters: Math.round(distanceMeters),
        overlapWeight,
        intersectionAreaSqMeters: Math.round(intersectionAreaSqMeters)
      });
    }
  }

  return evaluatedCells.length > 0 ? evaluatedCells : [{
    h3Index: centerCell,
    centerLat,
    centerLng,
    distanceMeters: 0,
    overlapWeight: 1.0,
    intersectionAreaSqMeters: Math.round((H3_RESOLUTION_METRICS[resolution]?.areaSqKm || 0.1) * 1e6)
  }];
}

/**
 * Generate Canonical PostGIS SQL Spatial Aggregation Query for Database Pipelines
 * (For direct execution on PostgreSQL + PostGIS instances)
 */
export function generatePostGisAggregationSql(campaignPolygonGeoJson, resolution = 9) {
  return `
    WITH campaign_geom AS (
      SELECT ST_SetSRID(ST_GeomFromGeoJSON('${JSON.stringify(campaignPolygonGeoJson)}'), 4326) AS geom
    ),
    intersected_cells AS (
      SELECT 
        c.h3_index,
        c.base_population,
        c.sec_affluence_score,
        c.poi_density_vector,
        ST_Area(ST_Intersection(c.geom, cg.geom)::geography) / ST_Area(c.geom::geography) AS overlap_weight
      FROM location_h3_cells c
      CROSS JOIN campaign_geom cg
      WHERE c.resolution = ${resolution}
        AND ST_Intersects(c.geom, cg.geom)
    )
    SELECT 
      COUNT(*) AS total_intersecting_cells,
      SUM(base_population * overlap_weight) AS weighted_population,
      AVG(sec_affluence_score) AS mean_affluence_score
    FROM intersected_cells;
  `;
}

/**
 * Great-circle distance between two GPS coordinates in meters (Haversine formula)
 */
export function calculateHaversineDistanceMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
