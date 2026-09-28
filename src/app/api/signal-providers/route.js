import { NextResponse } from 'next/server';
import { metaSignalProvider } from '@/lib/intelligence/index';


export async function GET() {
  try {
    const metaStatus = await metaSignalProvider.verifyConnection();

    const providers = [
      {
        id: 'meta',
        name: 'Meta Ads (Facebook & Instagram)',
        type: 'META_ADS',
        status: metaStatus.status || 'CONNECTED_SANDBOX',
        isConnected: true,
        isSandbox: metaStatus.isSandbox,
        accountName: metaStatus.accountInfo?.accountName || 'Meta Ads Sandbox Environment',
        accountId: metaStatus.accountInfo?.accountId || null,
        campaignsAvailable: metaStatus.accountInfo?.campaignCount || 0,
        lastSync: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        supportedBreakdowns: ['Age', 'Gender', 'Geography/Region', 'Hourly Diurnal', 'Placement'],
        notice: metaStatus.notice
      },
      {
        id: 'google',
        name: 'Google Ads (Search & Performance Max)',
        type: 'GOOGLE_ADS',
        status: 'AVAILABLE_TO_CONNECT',
        isConnected: false,
        isSandbox: false,
        accountName: null,
        accountId: null,
        campaignsAvailable: 0,
        lastSync: 'Never',
        supportedBreakdowns: ['Geo Target', 'Demographics', 'Device', 'Dayparting']
      },
      {
        id: 'tiktok',
        name: 'TikTok Ads Manager',
        type: 'TIKTOK_ADS',
        status: 'AVAILABLE_TO_CONNECT',
        isConnected: false,
        isSandbox: false,
        accountName: null,
        accountId: null,
        campaignsAvailable: 0,
        lastSync: 'Never',
        supportedBreakdowns: ['Audience Interests', 'Age', 'Region', 'Video Engagement']
      },
      {
        id: 'linkedin',
        name: 'LinkedIn Campaign Manager',
        type: 'LINKEDIN_ADS',
        status: 'AVAILABLE_TO_CONNECT',
        isConnected: false,
        isSandbox: false,
        accountName: null,
        accountId: null,
        campaignsAvailable: 0,
        lastSync: 'Never',
        supportedBreakdowns: ['Industry', 'Job Function', 'Seniority', 'Company Size']
      }
    ];

    return NextResponse.json({
      success: true,
      providers,
      totalConnected: 1,
      totalAvailable: providers.length
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
