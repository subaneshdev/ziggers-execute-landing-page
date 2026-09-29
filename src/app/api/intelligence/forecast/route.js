import { NextResponse } from 'next/server';
import { generateCampaignForecast } from '@/lib/intelligence/index';

export const runtime = 'nodejs';

/**
 * POST /api/intelligence/forecast
 * Centralized Server-Side Intelligence Pipeline Endpoint
 * Computes spatial aggregation, capacity, conversion planning, and Bayesian posteriors.
 */
export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const tenantId = request.headers.get('x-tenant-id') || body.tenantId || 'default_org';

    const forecast = generateCampaignForecast({
      tenantId,
      targetLocations: body.targetLocations || (body.location ? [body.location] : ['T. Nagar & Ranganathan Street']),
      radiusKm: Number(body.radiusKm) || 3.0,
      ageMin: Number(body.ageMin) || 18,
      ageMax: Number(body.ageMax) || 35,
      gender: body.gender || 'All',
      selectedInterests: Array.isArray(body.selectedInterests) ? body.selectedInterests : ['fitness', 'foodies', 'fashion'],
      objective: body.objective || 'Product Sampling',
      promoterCount: body.promoterCount ? Number(body.promoterCount) : null,
      shiftHours: Number(body.shiftHours) || 5,
      startHour: Number(body.startHour) || 16,
      campaignDays: Number(body.campaignDays) || 7,
      budgetInr: (body.budgetInr !== undefined && body.budgetInr !== null && body.budgetInr !== '')
        ? Number(body.budgetInr)
        : ((body.estimatedBudget !== undefined && body.estimatedBudget !== null && body.estimatedBudget !== '')
            ? Number(body.estimatedBudget)
            : (Number(body.budget) || 75000)),
      isGstInclusive: body.isGstInclusive !== undefined ? Boolean(body.isGstInclusive) : true,
      h3Resolution: body.h3Resolution ? Number(body.h3Resolution) : null,
      inventoryCap: body.inventoryCap ? Number(body.inventoryCap) : null,
      venueType: body.venueType || 'commercial_high_street',
      city: body.city || 'Chennai',
      startDate: body.startDate || body.start_date || null,
      endDate: body.endDate || body.end_date || null,
      dailyStartTime: body.dailyStartTime || body.daily_start_time || null,
      dailyEndTime: body.dailyEndTime || body.daily_end_time || null,
      timezone: body.timezone || null,
      schedule: body.schedule || null
    });

    return NextResponse.json({
      success: true,
      forecast
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to generate campaign forecast'
      },
      { status: 500 }
    );
  }
}
