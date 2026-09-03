import { NextResponse } from 'next/server';
import { generateCampaignForecast } from '@/lib/intelligence/index';

export const runtime = 'edge';

export async function POST(request) {
  try {
    const body = await request.json();
    const { 
      locations = [], 
      campaignObjective = 'Product Sampling', 
      audience = {}, 
      schedule = {},
      budgetInr = 50000 
    } = body;

    if (!Array.isArray(locations) || locations.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Please provide at least one campaign location to analyze.'
      }, { status: 400 });
    }

    const analyzedLocations = locations.map((loc, idx) => {
      const radius = Number(loc.radiusKm) || (Number(loc.radius_meters) ? loc.radius_meters / 1000 : 0.5);
      
      const forecast = generateCampaignForecast({
        targetLocations: [loc.name],
        radiusKm: radius,
        ageMin: Number(audience.ageMin || audience.ageRange?.[0]) || 18,
        ageMax: Number(audience.ageMax || audience.ageRange?.[1]) || 35,
        gender: audience.gender || 'All',
        selectedInterests: audience.interests || audience.selectedInterests || ['foodies'],
        objective: campaignObjective,
        shiftHours: Number(schedule.shiftHours) || 5,
        campaignDays: Number(schedule.campaignDays) || 7,
        budgetInr: Math.round(Number(budgetInr) / Math.max(1, locations.length)),
        isGstInclusive: true
      });

      return {
        placeId: loc.placeId || loc.google_place_id || `loc_${idx}`,
        name: loc.name,
        formattedAddress: loc.formattedAddress || loc.formatted_address || loc.name,
        lat: loc.lat || loc.latitude,
        lng: loc.lng || loc.longitude,
        radiusKm: radius,
        radiusMeters: Math.round(radius * 1000),
        locationType: loc.locationType || loc.location_type || 'Activation Venue',

        // Intelligence Outputs
        analyzed: true,
        populationEstimate: forecast.geographicAnalysis?.totalAggregatedPopulation || 25000,
        audienceMatchScore: forecast.scores?.audienceQualityScore || 85,
        audienceMatchLabel: forecast.scores?.audienceQualityScore > 80 ? 'HIGH' : forecast.scores?.audienceQualityScore > 60 ? 'MEDIUM' : 'LOW',
        interestAffinityScore: Math.round((forecast.scores?.subScores?.interestAffinity || 0.85) * 100),
        estimatedReach: forecast.forecast?.reach || 12000,
        reachRange: forecast.ranges?.reach ? {
          lower: forecast.ranges.reach.lower,
          expected: forecast.ranges.reach.expected,
          upper: forecast.ranges.reach.upper,
          text: `${forecast.ranges.reach.lower.toLocaleString('en-IN')} – ${forecast.ranges.reach.upper.toLocaleString('en-IN')}`
        } : null,
        footfallOpportunity: forecast.footfall?.shiftFootfallExposure > 15000 ? 'HIGH' : 'MEDIUM',
        bestActivationWindow: forecast.footfall?.operatingWindow || '4:00 PM – 9:00 PM (Evening Peak)',
        dataConfidence: forecast.scores?.confidencePercent ? `${forecast.scores.confidencePercent}% Confidence` : 'High Confidence',
        confidenceScore: forecast.scores?.confidenceScore || 0.88,
        h3CellCount: forecast.geographicAnalysis?.h3CellCount || 7,
        
        whyThisLocation: `High demographic alignment (${forecast.scores?.audienceQualityScore || 85}% AQS) in ${loc.name} with ${forecast.geographicAnalysis?.h3CellCount || 7} H3 hexagon cells covering high pedestrian dwell corridors.`,
        dataSources: [
          'Census 2011 + WorldPop high-resolution spatial base',
          '24h commercial footfall time profile',
          'Google Places POI density signals'
        ],
        modelMetadata: forecast.modelMetadata
      };
    });

    return NextResponse.json({
      success: true,
      totalAnalyzed: analyzedLocations.length,
      analyzedLocations
    });

  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
