import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(request) {
  try {
    const body = await request.json();
    const { 
      objective = 'Product Sampling', 
      budget = 250000, 
      targetAudience = 'Youth & College Students', 
      cities = ['Chennai'], 
      promoterCount = 10,
      durationDays = 7
    } = body;

    const numBudget = Number(budget) || 250000;
    const numPromoters = Number(promoterCount) || 10;
    const numDays = Number(durationDays) || 7;

    // Edge computational logic based on Indian offline activation benchmarks
    const samplesPerPromoterPerDay = objective.toLowerCase().includes('sample') ? 120 : 40;
    const totalSamplesProjected = numPromoters * numDays * samplesPerPromoterPerDay;
    const projectedLeads = Math.round(totalSamplesProjected * 0.12);
    const estimatedCostPerSample = totalSamplesProjected > 0 ? (numBudget / totalSamplesProjected).toFixed(2) : '0.00';
    const estimatedCpl = projectedLeads > 0 ? Math.round(numBudget / projectedLeads) : 0;
    const projectedRoi = (objective.toLowerCase().includes('retail') ? 3.4 : 2.8).toFixed(1) + 'x';

    const recommendedLocations = cities.map(c => {
      if (c.toLowerCase().includes('chennai')) {
        return ['Phoenix Marketcity, Velachery', 'Express Avenue, Royapettah', 'Besant Nagar Promenade', 'T. Nagar Ranganathan St'];
      } else if (c.toLowerCase().includes('bangalore')) {
        return ['Koramangala 80ft Road', 'Indiranagar 100ft Road', 'Nexus Koramangala', 'Brigade Road Junction'];
      } else if (c.toLowerCase().includes('mumbai')) {
        return ['Bandra Bandstand & Carter Rd', 'Phoenix Palladium Lower Parel', 'R-City Mall Ghatkopar', 'Juhu Beach Walk'];
      }
      return [`${c} Central Mall`, `${c} Metro Hub`, `${c} Tech Park Corridor`];
    }).flat();

    const plan = {
      planId: 'plan_' + Date.now().toString(36),
      name: `${cities.join('/')} ${objective} Blueprint`,
      objective,
      budget: `₹${numBudget.toLocaleString('en-IN')}`,
      targetAudience,
      cities,
      headcount: numPromoters,
      durationDays: numDays,
      metrics: {
        totalSamplesProjected,
        projectedLeads,
        estimatedCostPerSample: `₹${estimatedCostPerSample}`,
        estimatedCpl: `₹${estimatedCpl}`,
        projectedRoi
      },
      recommendedLocations: recommendedLocations.slice(0, 6),
      staffingStrategy: `Wave 1: Deploy ${Math.ceil(numPromoters * 0.7)} core tier-1 promoters. Wave 2: Dispatch ${Math.floor(numPromoters * 0.3)} floating inventory specialists with instant geofence fallback.`,
      auditParameters: [
        'Biometric Aadhaar verified check-in within 25m radius',
        'Hourly stock count submission with photo verification',
        'Customer feedback & phone OTP verification',
        'POSM shelf share before & after audit'
      ]
    };

    return NextResponse.json({
      success: true,
      plan
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
