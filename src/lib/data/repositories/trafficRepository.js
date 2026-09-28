/**
 * Ziggers Production Engine - Diurnal Traffic Repository
 * File: src/lib/data/repositories/trafficRepository.js
 * 
 * Provides hourly traffic curves from database with source and validity metadata.
 */

import { getDatabase } from '../database.js';

export function getHourlyTrafficCurve(venueType = 'commercial_high_street', city = 'All', dayType = 'WEEKEND') {
  const db = getDatabase();

  let row = db.prepare(`
    SELECT * FROM hourly_traffic_profiles
    WHERE venue_type = ? AND city = ? AND day_type = ?
  `).get(venueType, city, dayType);

  if (!row) {
    row = db.prepare(`
      SELECT * FROM hourly_traffic_profiles
      WHERE venue_type = ? AND city = 'All' AND day_type = ?
    `).get(venueType, dayType);
  }

  if (!row) {
    row = db.prepare(`
      SELECT * FROM hourly_traffic_profiles
      WHERE venue_type = 'commercial_high_street' AND city = 'All' LIMIT 1
    `).get();
  }

  if (!row) {
    return {
      venueType,
      city,
      dayType,
      coefficients: null,
      status: 'DATA_UNAVAILABLE',
      isFallback: true,
      source: 'FALLBACK_DATA',
      notice: 'No hourly traffic profile available in database for this configuration.'
    };
  }

  const coefficients = typeof row.hourly_coefficients === 'string'
    ? JSON.parse(row.hourly_coefficients)
    : row.hourly_coefficients;

  return {
    venueType: row.venue_type,
    city: row.city,
    dayType: row.day_type,
    coefficients,
    source: row.source,
    validUntil: row.valid_until
  };
}
