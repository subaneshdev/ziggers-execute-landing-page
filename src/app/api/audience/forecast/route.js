import { NextResponse } from 'next/server';
import { calculateAudiencePrediction } from '@/lib/audienceEngine';

export const runtime = 'edge';

export async function POST(request) {
  try {
    const body = await request.json();
    const forecast = calculateAudiencePrediction(body);

    return NextResponse.json({
      success: true,
      forecast
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
