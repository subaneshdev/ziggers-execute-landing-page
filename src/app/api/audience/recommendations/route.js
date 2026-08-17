import { NextResponse } from 'next/server';
import { rankLocationCandidates } from '@/lib/audienceEngine';

export const runtime = 'edge';

export async function POST(request) {
  try {
    const body = await request.json();
    const rankedLocations = rankLocationCandidates(body);

    return NextResponse.json({
      success: true,
      rankedLocations
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
