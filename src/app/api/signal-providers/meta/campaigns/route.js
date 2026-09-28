import { NextResponse } from 'next/server';
import { metaSignalProvider } from '@/lib/intelligence/index';


export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get('accountId');

    const accounts = await metaSignalProvider.listAdAccounts();
    const campaigns = await metaSignalProvider.listCampaigns(accountId);

    return NextResponse.json({
      success: true,
      selectedAccountId: accountId || accounts[0]?.accountId || null,
      accounts,
      campaigns,
      totalCampaigns: campaigns.length,
      provenance: {
        source: metaSignalProvider.isLiveConfigured() ? 'OFFICIAL_META_GRAPH_API' : 'SANDBOX_ADVERTISER_AUTHORIZED',
        isSandbox: !metaSignalProvider.isLiveConfigured(),
        confidenceScore: 0.95
      }
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
