import { NextResponse } from 'next/server';
import { calculateAudiencePrediction } from '@/lib/audienceEngine';

export const runtime = 'edge';

export async function POST(request) {
  try {
    const body = await request.json();
    const baseForecast = calculateAudiencePrediction(body);

    const mapsApiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    const geminiApiKey = process.env.GEMINI_API_KEY;
    const targetCity = body.targetLocations?.[0] || 'T. Nagar & Ranganathan Street';

    // 1. Google Maps Geocoding & Places API Real-Time POI Intelligence
    if (mapsApiKey) {
      try {
        const geocodeRes = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(targetCity + ', India')}&key=${mapsApiKey}`
        );
        if (geocodeRes.ok) {
          const geocodeData = await geocodeRes.json();
          const location = geocodeData.results?.[0]?.geometry?.location;
          if (location && location.lat && location.lng) {
            baseForecast.centerLat = location.lat;
            baseForecast.centerLng = location.lng;
            
            // Query Google Places Nearby Search API
            const radiusMeters = Math.min(5000, Math.max(1000, Math.round((body.radiusKm || 3) * 1000)));
            const placesRes = await fetch(
              `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.lat},${location.lng}&radius=${radiusMeters}&key=${mapsApiKey}`
            );
            if (placesRes.ok) {
              const placesData = await placesRes.json();
              if (Array.isArray(placesData.results) && placesData.results.length > 0) {
                // Count real Google Places POIs by type
                let restaurantCount = 0;
                let mallCount = 0;
                let schoolCount = 0;
                let officeCount = 0;
                let gymCount = 0;
                let hotelCount = 0;
                let transitCount = 0;

                placesData.results.forEach(place => {
                  const types = place.types || [];
                  if (types.includes('restaurant') || types.includes('food') || types.includes('cafe')) restaurantCount++;
                  if (types.includes('shopping_mall') || types.includes('department_store')) mallCount++;
                  if (types.includes('school') || types.includes('university')) schoolCount++;
                  if (types.includes('point_of_interest') || types.includes('establishment')) officeCount++;
                  if (types.includes('gym')) gymCount++;
                  if (types.includes('lodging')) hotelCount++;
                  if (types.includes('transit_station') || types.includes('bus_station') || types.includes('subway_station')) transitCount++;
                });

                baseForecast.poiDensities = {
                  schools: Math.max(schoolCount, baseForecast.poiDensities.schools),
                  colleges: Math.max(Math.round(schoolCount / 3), baseForecast.poiDensities.colleges),
                  malls: Math.max(mallCount, baseForecast.poiDensities.malls),
                  offices: Math.max(officeCount * 8, baseForecast.poiDensities.offices),
                  restaurants: Math.max(restaurantCount * 12, baseForecast.poiDensities.restaurants),
                  gyms: Math.max(gymCount, baseForecast.poiDensities.gyms),
                  hospitals: baseForecast.poiDensities.hospitals,
                  hotels: Math.max(hotelCount, baseForecast.poiDensities.hotels),
                  transit: Math.max(transitCount, baseForecast.poiDensities.transit),
                  commercialScore: baseForecast.poiDensities.commercialScore,
                  residentialScore: baseForecast.poiDensities.residentialScore
                };
              }
            }
          }
        }
      } catch (mapsErr) {
        console.warn('Google Maps API notice:', mapsErr.message);
      }
    }

    // 2. Google Gemini AI Audience & Recommendation Engine
    if (geminiApiKey) {
      try {
        const promptText = `You are the Ziggers AI Offline Audience Intelligence Engine for India. Analyze the following campaign targeting setup for the Indian city/node "${targetCity}" and generate hyper-local demographic, POI, and economic affluence intelligence:

Campaign Parameters:
- Location / Node: ${targetCity}
- Radius: ${body.radiusKm || 3} KM
- Target Age: ${body.ageMin || 18} to ${body.ageMax || 35} Years
- Gender: ${body.gender || 'All'}
- Objective: ${body.objective || 'Product Sampling'}
- Interests: ${(body.selectedInterests || []).join(', ')}
- Promoters: ${body.promoterCount || 10} Ziggers
- Budget: ₹${body.budgetInr || 35000} INR

Respond ONLY with valid JSON matching this exact structure:
{
  "affluenceScore": 85,
  "mpceIncomeEstimate": "₹82,000 / mo",
  "recommendations": [
    "string specific campaign optimization suggestion 1",
    "string specific campaign optimization suggestion 2",
    "string specific campaign optimization suggestion 3"
  ],
  "audienceExplanation": [
    "string rationale point 1",
    "string rationale point 2",
    "string rationale point 3"
  ],
  "aiLocationInsight": "string concise location intelligence summary for this city"
}`;

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{
                parts: [{ text: promptText }]
              }]
            })
          }
        );

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '';
          const cleanedJson = rawText.replace(/```json|```/g, '').trim();
          const parsedAi = JSON.parse(cleanedJson);

          if (parsedAi.affluenceScore && typeof parsedAi.affluenceScore === 'number') {
            baseForecast.affluenceScore = parsedAi.affluenceScore;
          }
          if (parsedAi.mpceIncomeEstimate) {
            baseForecast.mpceIncomeEstimate = parsedAi.mpceIncomeEstimate;
          }
          if (Array.isArray(parsedAi.recommendations) && parsedAi.recommendations.length > 0) {
            baseForecast.recommendations = parsedAi.recommendations;
          }
          if (Array.isArray(parsedAi.audienceExplanation) && parsedAi.audienceExplanation.length > 0) {
            baseForecast.audienceExplanation = parsedAi.audienceExplanation;
          }
          if (parsedAi.aiLocationInsight) {
            baseForecast.aiLocationInsight = parsedAi.aiLocationInsight;
          }
          baseForecast.modelLabel = `Powered by Google Maps Places API + Gemini AI (${targetCity})`;
        }
      } catch (geminiErr) {
        console.warn('Gemini API notice:', geminiErr.message);
      }
    }

    return NextResponse.json({
      success: true,
      forecast: baseForecast
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
