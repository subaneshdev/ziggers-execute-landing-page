/**
 * Ziggers Execute - Google Places API Test Suite
 * Verifies live Google Places API connectivity, response parsing, and server endpoint integration.
 */

import fs from 'fs';
import path from 'path';

// 1. Load Environment Configuration
function loadEnv() {
  const env = {};
  if (fs.existsSync('.env.local')) {
    const lines = fs.readFileSync('.env.local', 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const idx = trimmed.indexOf('=');
        if (idx !== -1) {
          env[trimmed.substring(0, idx).trim()] = trimmed.substring(idx + 1).trim();
        }
      }
    }
  }
  return env;
}

const env = loadEnv();
const API_KEY = env.GOOGLE_MAPS_API_KEY || env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_API_KEY;
const BASE_URL = process.env.BASE_URL || (process.env.PORT ? `http://127.0.0.1:${process.env.PORT}` : 'http://127.0.0.1:3000');

let passed = 0;
let failed = 0;

function assert(condition, testId, message) {
  if (condition) {
    console.log(`✅ PASSED [${testId}]: ${message}`);
    passed++;
  } else {
    console.error(`❌ FAILED [${testId}]: ${message}`);
    failed++;
  }
}

async function runGooglePlacesTests() {
  console.log('===================================================================');
  console.log('🧪 RUNNING GOOGLE PLACES API VERIFICATION TEST SUITE');
  console.log('===================================================================');
  console.log(`🔑 Key Configured: ${API_KEY ? `${API_KEY.substring(0, 10)}... (Length: ${API_KEY.length})` : 'NOT FOUND'}\n`);

  // --- Test 1: Direct Google Places Text Search ---
  try {
    const query = 'Phoenix Marketcity, Chennai';
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();

    assert(res.status === 200, 'PLACES-001', 'Direct Places Text Search returns HTTP 200');
    assert(data.status === 'OK', 'PLACES-002', `Google API status is "OK" (Received: ${data.status})`);
    assert(Array.isArray(data.results) && data.results.length > 0, 'PLACES-003', `Found ${data.results?.length} matching places`);
    
    const first = data.results?.[0];
    assert(first && first.name.includes('Phoenix Marketcity'), 'PLACES-004', `First result matches target: "${first?.name}"`);
    assert(typeof first?.geometry?.location?.lat === 'number' && typeof first?.geometry?.location?.lng === 'number', 'PLACES-005', `Coordinates parsed: { lat: ${first?.geometry?.location?.lat}, lng: ${first?.geometry?.location?.lng} }`);
  } catch (err) {
    assert(false, 'PLACES-001-ERR', `Direct Places Text Search threw error: ${err.message}`);
  }

  // --- Test 2: Direct Google Places Nearby Search ---
  try {
    const lat = 13.0418;
    const lng = 80.2341; // T. Nagar, Chennai
    const radiusMeters = 1500;
    const nearbyUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radiusMeters}&type=shopping_mall&key=${API_KEY}`;
    const res = await fetch(nearbyUrl);
    const data = await res.json();

    assert(res.status === 200, 'PLACES-006', 'Direct Nearby Search returns HTTP 200');
    assert(data.status === 'OK', 'PLACES-007', `Nearby Search status is "OK"`);
    assert(Array.isArray(data.results) && data.results.length > 0, 'PLACES-008', `Discovered ${data.results?.length} POIs in 1.5km radius around T. Nagar`);
  } catch (err) {
    assert(false, 'PLACES-006-ERR', `Nearby Search threw error: ${err.message}`);
  }

  // --- Test 3: Local Application Endpoint POST /api/locations/search ---
  try {
    const res = await fetch(`${BASE_URL}/api/locations/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: 'Forum Vijaya Mall', city: 'Chennai' })
    });
    const data = await res.json();

    assert(res.status === 200, 'ENDPOINT-001', 'POST /api/locations/search returns HTTP 200');
    assert(data.success === true, 'ENDPOINT-002', 'API response reports success: true');
    assert(Array.isArray(data.places) && data.places.length > 0, 'ENDPOINT-003', `Endpoint returned ${data.places?.length} places`);
    
    const place = data.places?.[0];
    assert(place?.placeId && place?.name && place?.lat && place?.lng, 'ENDPOINT-004', `Sanitized place object has placeId, name, lat, lng: "${place?.name}"`);
    assert(place?.rating !== undefined, 'ENDPOINT-005', `Place user rating extracted: ${place?.rating} (Reviews: ${place?.userRatingsTotal})`);
  } catch (err) {
    assert(false, 'ENDPOINT-001-ERR', `POST /api/locations/search error: ${err.message}`);
  }

  // --- Test 4: Local Application Endpoint POST /api/locations/discover ---
  try {
    const res = await fetch(`${BASE_URL}/api/locations/discover`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lat: 12.9716, lng: 77.5946, radiusMeters: 2000, type: 'commercial' }) // Bangalore Central
    });
    const data = await res.json();

    assert(res.status === 200, 'ENDPOINT-006', 'POST /api/locations/discover returns HTTP 200');
    assert(data.success === true, 'ENDPOINT-007', 'Discovery response reports success: true');
    assert(Array.isArray(data.places) && data.places.length > 0, 'ENDPOINT-008', `Discovered ${data.places?.length} commercial POIs in Bangalore Hub`);
  } catch (err) {
    assert(false, 'ENDPOINT-006-ERR', `POST /api/locations/discover error: ${err.message}`);
  }

  // --- Test 5: Validation Handling for Empty Search ---
  try {
    const res = await fetch(`${BASE_URL}/api/locations/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: '   ', city: '' })
    });
    const data = await res.json();

    assert(res.status === 400, 'VALIDATION-001', 'Rejects empty search query with HTTP 400');
    assert(data.success === false, 'VALIDATION-002', 'Error response reports success: false');
  } catch (err) {
    assert(false, 'VALIDATION-001-ERR', `Validation check error: ${err.message}`);
  }

  console.log('\n===================================================================');
  console.log(`📊 RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log('===================================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runGooglePlacesTests();
