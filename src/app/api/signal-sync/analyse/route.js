import { NextResponse } from 'next/server';
import { 
  metaSignalProvider, 
  createDigitalSignalProfile, 
  matchDigitalToOfflineContext, 
  generateCampaignRecommendation 
} from '@/lib/intelligence/index';


export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    let insights = body.insights;

    const campaignPayload = body.campaign || null;
    const campaignId = body.campaignId || campaignPayload?.id || campaignPayload?.campaign_id;

    if (!insights && campaignPayload) {
      insights = await metaSignalProvider.getCampaignInsights(campaignId, {
        campaign: campaignPayload,
        city: body.city || campaignPayload.city,
        budgetInr: body.budgetInr || campaignPayload.spend || campaignPayload.guaranteed_payout,
        durationDays: body.durationDays
      });
    } else if (!insights && campaignId) {
      insights = await metaSignalProvider.getCampaignInsights(campaignId, {
        brand: body.brand,
        campaignName: body.campaignName,
        objective: body.objective,
        city: body.city,
        budgetInr: body.budgetInr,
        durationDays: body.durationDays
      });
    }

    if (!insights) {
      insights = await metaSignalProvider.getCampaignInsights('meta_camp_re_himalayan_01', {
        city: body.city || 'Chennai',
        budgetInr: body.budgetInr || 250000
      });
    }

    // 1. Generate Normalized Digital Signal Profile
    const digitalProfile = createDigitalSignalProfile(insights);

    // 2. Perform Digital → Offline Context Matching across H3 Spatial Clusters
    const targetCity = body.city || campaignPayload?.city || digitalProfile.top_geographies?.[0]?.location || 'Chennai';
    const rawBudget = body.budgetInr ?? body.budget ?? (campaignPayload ? (campaignPayload.budgetInr ?? campaignPayload.estimatedBudget ?? campaignPayload.budget ?? campaignPayload.spend ?? campaignPayload.guaranteed_payout) : null);
    const resolvedBudget = rawBudget !== undefined && rawBudget !== null && rawBudget !== ''
      ? (Number(String(rawBudget).replace(/[^0-9]/g, '')) || 75000)
      : 75000;

    const contextMatches = matchDigitalToOfflineContext(digitalProfile, {
      city: targetCity,
      radiusKm: Number(body.radiusKm) || 3.0,
      budgetInr: resolvedBudget
    });

    // 3. Generate Explainable Offline Campaign Recommendation
    const recommendation = generateCampaignRecommendation(digitalProfile, contextMatches, {
      budgetInr: resolvedBudget,
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
          offline: `${contextMatches.topLocation?.subScores?.ageMatch || 92}/100 Density Match in ${contextMatches.topLocation?.locationName || 'Central Hub'}`
        },
        {
          signal: 'Top Geography',
          digital: `${targetCity} (${digitalProfile.top_geographies?.[0]?.region || 'Central Zone'})`,
          offline: `${contextMatches.topLocation?.locationName || 'Central Hub'} (${contextMatches.topLocation?.secClassification || 'SEC A/B'})`
        },
        {
          signal: 'Peak Performance Time',
          digital: `${digitalProfile.top_time_windows?.[0]?.time_window || '17:30 – 21:30'} (Highest CVR)`,
          offline: `${recommendation.recommendedTimeWindow} (Peak Diurnal Footfall Window)`
        },
        {
          signal: 'Audience Interest Context',
          digital: digitalProfile.audience_context,
          offline: `Audience Affinity ${contextMatches.topLocation?.subScores?.interestAffinity || 94}/100 with ${contextMatches.topLocation?.locationType}`
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
