import { NextResponse } from 'next/server';
import { 
  metaSignalProvider, 
  createDigitalSignalProfile, 
  matchDigitalToOfflineContext, 
  generateCampaignRecommendation 
} from '@/lib/intelligence/index';

export const runtime = 'edge';

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    let insights = body.insights;

    if (!insights && body.campaignId) {
      insights = await metaSignalProvider.getCampaignInsights(body.campaignId);
    }

    if (!insights) {
      // Default to premier Red Bull sampling cohort
      insights = await metaSignalProvider.getCampaignInsights('meta_camp_redbull_sampling_01');
    }

    // 1. Generate Normalized Digital Signal Profile
    const digitalProfile = createDigitalSignalProfile(insights);

    // 2. Perform Digital → Offline Context Matching across H3 Spatial Clusters
    const targetCity = body.city || digitalProfile.top_geographies?.[0]?.location || 'Chennai';
    const contextMatches = matchDigitalToOfflineContext(digitalProfile, {
      city: targetCity,
      radiusKm: Number(body.radiusKm) || 3.0,
      budgetInr: Number(body.budgetInr) || 150000
    });

    // 3. Generate Explainable Offline Campaign Recommendation
    const recommendation = generateCampaignRecommendation(digitalProfile, contextMatches, {
      budgetInr: Number(body.budgetInr) || 150000,
      campaignDurationDays: Number(body.durationDays) || 3,
      shiftHours: Number(body.shiftHours) || 5,
      isGstInclusive: true
    });

    // 4. Digital vs Offline Side-by-Side Comparison Matrix
    const digitalVsOffline = {
      brand: digitalProfile.brand,
      objective: digitalProfile.objective,
      metrics: [
        {
          signal: 'Best Age Cohort',
          digital: `${digitalProfile.top_age_ranges?.[0]?.range || '18-24'} (Top CTR)`,
          offline: `${contextMatches.topLocation?.subScores?.ageMatch || 92}/100 Density Match in ${contextMatches.topLocation?.locationName || 'OMR'}`
        },
        {
          signal: 'Top Geography',
          digital: `${targetCity} (${digitalProfile.top_geographies?.[0]?.region || 'South Zone'})`,
          offline: `${contextMatches.topLocation?.locationName || 'OMR IT Corridor'} (${contextMatches.topLocation?.secClassification || 'SEC A/B'})`
        },
        {
          signal: 'Peak Performance Time',
          digital: `${digitalProfile.top_time_windows?.[0]?.time_window || '18:00 – 22:00'} (Highest CVR)`,
          offline: `${recommendation.recommendedTimeWindow} (Peak Diurnal Footfall Window)`
        },
        {
          signal: 'Audience Interest Context',
          digital: digitalProfile.audience_context,
          offline: `Fitness Affinity ${contextMatches.topLocation?.subScores?.fitnessAffinity || 94}/100 with ${contextMatches.topLocation?.locationType}`
        },
        {
          signal: 'Cost Efficiency Metric',
          digital: `Digital CPA ₹${digitalProfile.performance_metrics?.cpa?.toFixed(2)}`,
          offline: `Expected Physical CPL ${recommendation.expectedCpl}`
        }
      ]
    };

    return NextResponse.json({
      success: true,
      digitalProfile,
      contextMatches,
      recommendation,
      digitalVsOffline,
      provenance: {
        engine: 'Ziggers Unified Context Matching Engine v1.2',
        spatialResolution: 'H3 Res 9 (0.105 sq.km)',
        analyzedAt: new Date().toISOString()
      }
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
