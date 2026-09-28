import { NextResponse } from 'next/server';
import { 
  createDigitalSignalProfile, 
  matchDigitalToOfflineContext, 
  generateCampaignRecommendation 
} from '@/lib/intelligence/index';


export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    
    // Construct or extract digital profile
    const digitalProfile = body.digitalProfile || createDigitalSignalProfile({
      campaignId: body.campaignId || 'meta_direct_input',
      brand: body.brand || 'Enterprise Brand',
      objective: body.objective || 'Product Sampling',
      breakdowns: {
        age: [{ ageRange: body.ageRange || '18-24', sharePct: 60, performanceScore: 0.92 }],
        gender: [{ gender: body.gender || 'ALL', sharePct: 100, performanceScore: 0.88 }],
        geography: [{ location: body.city || 'Chennai', region: `${body.city || 'Chennai'} South`, performanceScore: 0.91 }],
        hourlyDistribution: [{ hourWindow: body.timeWindow || '18:00-22:00', performanceScore: 0.88 }],
        interests: body.interests || ['fitness', 'sports']
      }
    });

    const rawBudget = body.budgetInr ?? body.budget;
    const resolvedBudget = rawBudget !== undefined && rawBudget !== null && rawBudget !== ''
      ? (Number(rawBudget) || 75000)
      : 75000;

    const contextMatches = matchDigitalToOfflineContext(digitalProfile, {
      city: body.city || 'Chennai',
      radiusKm: Number(body.radiusKm) || 3.0,
      budgetInr: resolvedBudget
    });

    const recommendation = generateCampaignRecommendation(digitalProfile, contextMatches, {
      budgetInr: resolvedBudget,
      campaignDurationDays: Number(body.durationDays) || 3,
      shiftHours: Number(body.shiftHours) || 5
    });

    return NextResponse.json({
      success: true,
      recommendation,
      topLocations: contextMatches.rankedLocations?.slice(0, 5)
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
