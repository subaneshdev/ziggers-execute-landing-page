import { NextResponse } from 'next/server';
import { evaluateCampaignReadiness } from '@/lib/marketplace/readinessEngine';

export const runtime = 'nodejs';

export async function POST(request) {
  try {
    const body = await request.json();
    const readiness = evaluateCampaignReadiness(body);

    return NextResponse.json({
      success: true,
      data: readiness
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
