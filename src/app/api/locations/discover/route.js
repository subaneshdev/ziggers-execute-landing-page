import { NextResponse } from 'next/server';

async function fetchWithTimeout(url, options = {}, timeoutMs = 5000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(id);
  }
}

/**
 * Calculates straight line distance in meters between two lat/lng pairs
 */
function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
  const R = 6371e3; // Earth radius in meters
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { 
      lat = 13.0418, 
      lng = 80.2341, 
      radiusMeters = 3000, 
      placeTypes = ['shopping_mall', 'gym', 'university', 'transit_station'],
      keyword = '',
      city = ''
    } = body;

    const apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'GOOGLE_MAPS_API_KEY is not configured in server environment.'
      }, { status: 500 });
    }

    // Query Google Places NearbySearch
    const typeParam = placeTypes && placeTypes.length > 0 ? placeTypes[0] : 'point_of_interest';
    let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radiusMeters}&key=${apiKey}`;
    
    if (keyword) {
      url += `&keyword=${encodeURIComponent(keyword)}`;
    } else if (typeParam) {
      url += `&type=${typeParam}`;
    }

    const res = await fetchWithTimeout(url, {}, 5000);
    if (!res.ok) {
      return NextResponse.json({
        success: false,
        error: `Google Places API request failed with HTTP ${res.status}`
      }, { status: res.status });
    }

    const data = await res.json();
    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      return NextResponse.json({
        success: false,
        error: data.error_message || `Google Places API status: ${data.status}`
      }, { status: 502 });
    }

    const places = (data.results || []).map(p => {
      const pLat = p.geometry?.location?.lat;
      const pLng = p.geometry?.location?.lng;
      const distance = getDistanceFromLatLonInMeters(lat, lng, pLat, pLng);

      return {
        placeId: p.place_id,
        name: p.name,
        formattedAddress: p.vicinity || p.formatted_address || 'India',
        lat: pLat,
        lng: pLng,
        rating: p.rating || null,
        userRatingsTotal: p.user_ratings_total || 0,
        distanceMeters: distance,
        distanceText: distance >= 1000 ? `${(distance / 1000).toFixed(1)} km away` : `${distance} m away`,
        locationType: p.types?.[0]?.replace(/_/g, ' ') || 'Point of Interest',
        types: p.types || []
      };
    });

    // Sort by proximity
    places.sort((a, b) => a.distanceMeters - b.distanceMeters);

    return NextResponse.json({
      success: true,
      center: { lat, lng },
      radiusMeters,
      totalDiscovered: places.length,
      places
    });

  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
