import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(request) {
  try {
    const body = await request.json();
    const { query = '', city = '', lat = null, lng = null, radiusMeters = 5000 } = body;

    if (!query.trim() && !city.trim()) {
      return NextResponse.json({
        success: false,
        error: 'Search query or city parameter is required.'
      }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'GOOGLE_MAPS_API_KEY is not configured in server environment.'
      }, { status: 500 });
    }

    const fullQuery = city && !query.toLowerCase().includes(city.toLowerCase()) 
      ? `${query} ${city}, India` 
      : `${query}, India`;

    let url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(fullQuery)}&region=in&key=${apiKey}`;
    if (lat && lng) {
      url += `&location=${lat},${lng}&radius=${radiusMeters}`;
    }

    const res = await fetch(url);
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

    const results = (data.results || []).map(place => ({
      placeId: place.place_id,
      name: place.name,
      formattedAddress: place.formatted_address || place.vicinity || 'India',
      lat: place.geometry?.location?.lat,
      lng: place.geometry?.location?.lng,
      rating: place.rating || null,
      userRatingsTotal: place.user_ratings_total || 0,
      locationType: place.types?.[0]?.replace(/_/g, ' ') || 'Point of Interest',
      types: place.types || [],
      businessStatus: place.business_status || 'OPERATIONAL'
    }));

    return NextResponse.json({
      success: true,
      query: fullQuery,
      totalResults: results.length,
      places: results
    });

  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
