import { NextResponse } from 'next/server';
import { ConsentEngine } from '@/lib/intelligence/index';

export const runtime = 'edge';

// Global memory store for consented audience records
let consentsStore = [
  ConsentEngine.recordConsent({
    campaignId: 'meta_camp_redbull_sampling_01',
    brandName: 'Red Bull India',
    qrCodeId: 'qr_redbull_sampling_omr_p482',
    phone: '9840123456',
    email: 'karthik.s@gmail.com',
    purpose: 'PRODUCT_SAMPLING_FEEDBACK_AND_OFFERS'
  }),
  ConsentEngine.recordConsent({
    campaignId: 'meta_camp_redbull_sampling_01',
    brandName: 'Red Bull India',
    qrCodeId: 'qr_redbull_sampling_omr_p482',
    phone: '9791098765',
    email: 'priya.fitness@outlook.com',
    purpose: 'PRODUCT_SAMPLING_FEEDBACK_AND_OFFERS'
  }),
  ConsentEngine.recordConsent({
    campaignId: 'meta_camp_cult_fit_pass_02',
    brandName: 'Cult.Fit',
    qrCodeId: 'qr_cultfit_pass_velachery_p104',
    phone: '9940211223',
    email: 'rahul.dev@zoho.com',
    purpose: 'GYM_TRIAL_PASS_ACTIVATION'
  })
];

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const campaignId = searchParams.get('campaignId');
    const format = searchParams.get('format') || 'JSON'; // 'JSON', 'CSV', 'META_CAPI'

    let records = consentsStore;
    if (campaignId) {
      records = records.filter(c => c.campaignId === campaignId);
    }

    if (format === 'CSV') {
      const csvContent = ConsentEngine.formatForCrmExport(records, 'CSV');
      return new Response(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename=Ziggers_FirstParty_Consented_Audience_${Date.now()}.csv`
        }
      });
    }

    if (format === 'META_CAPI') {
      const capiPayload = ConsentEngine.formatForCrmExport(records, 'META_CAPI');
      return NextResponse.json({
        success: true,
        protocol: 'META_OFFLINE_CONVERSIONS_API_V19',
        totalEvents: capiPayload.length,
        events: capiPayload
      });
    }

    return NextResponse.json({
      success: true,
      totalConsents: records.length,
      consents: records
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    if (!body.campaignId || !body.brandName) {
      return NextResponse.json({ success: false, error: 'campaignId and brandName are required.' }, { status: 400 });
    }

    const consentRecord = ConsentEngine.recordConsent({
      campaignId: body.campaignId,
      brandName: body.brandName,
      qrCodeId: body.qrCodeId || null,
      phone: body.phone || null,
      email: body.email || null,
      purpose: body.purpose || 'PRODUCT_SAMPLING_FEEDBACK_AND_OFFERS',
      retentionDays: body.retentionDays || 365,
      userIp: request.headers.get('x-forwarded-for') || '127.0.0.1'
    });

    consentsStore.unshift(consentRecord);

    return NextResponse.json({
      success: true,
      consent: consentRecord,
      message: 'Explicit first-party consent recorded with DPDP/GDPR compliance metadata.'
    }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
