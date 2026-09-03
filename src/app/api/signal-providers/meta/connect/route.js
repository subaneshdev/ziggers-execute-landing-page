import { NextResponse } from 'next/server';
import { metaSignalProvider } from '@/lib/intelligence/index';

export const runtime = 'edge';

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const connectionRes = await metaSignalProvider.verifyConnection();

    return NextResponse.json({
      success: connectionRes.success,
      status: connectionRes.status,
      isSandbox: connectionRes.isSandbox,
      accountInfo: connectionRes.accountInfo,
      notice: connectionRes.notice || 'Meta Ads signal stream connected with advertiser authorization.',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
