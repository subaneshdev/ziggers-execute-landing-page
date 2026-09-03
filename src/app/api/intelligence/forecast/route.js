import { NextResponse } from 'next/server';
import { generateCampaignForecast } from '@/lib/intelligence/index';

export const runtime = 'nodejs';

/**
 * POST /api/intelligence/forecast
 * Centralized Server-Side Intelligence Pipeline Endpoint
 * Computes spatial aggregation, capacity, conversion planning, and permission checks server-side.
 */
export async function POST(request) {
  try {
    const body = await request.json();

    const forecast = generateCampaignForecast({
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
      budgetInr: Number(body.budgetInr) || 250000,
      isGstInclusive: body.isGstInclusive !== undefined ? Boolean(body.isGstInclusive) : true,
      h3Resolution: body.h3Resolution ? Number(body.h3Resolution) : null,
      inventoryCap: body.inventoryCap ? Number(body.inventoryCap) : null,
      venueType: body.venueType || 'COMMERCIAL_STREET'
    });

    return NextResponse.json({
      success: true,
      data: forecast
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
