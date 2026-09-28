import { NextResponse } from 'next/server';
import { metaSignalProvider } from '@/lib/intelligence/index';


export async function GET(request, { params }) {
  try {
    const resolvedParams = await params;
    const campaignId = resolvedParams?.id || 'meta_camp_redbull_sampling_01';
    
    const { searchParams } = new URL(request.url);
    const datePreset = searchParams.get('date_preset') || 'last_30d';

    const insights = await metaSignalProvider.getCampaignInsights(campaignId, { datePreset });

    return NextResponse.json({
      success: true,
      campaignId,
      insights
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
