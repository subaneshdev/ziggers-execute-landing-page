import { NextResponse } from 'next/server';
import { ConsentEngine } from '@/lib/intelligence/index';
import { getDatabase } from '@/lib/data/database';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const campaignId = searchParams.get('campaignId') || searchParams.get('campaign_id');
    const tenantId = searchParams.get('tenantId') || 'default_org';
    const format = searchParams.get('format') || 'JSON'; // 'JSON', 'CSV', 'META_CAPI'

    const db = getDatabase();
    let query = 'SELECT * FROM first_party_consents WHERE tenant_id = ?';
    const params = [tenantId];

    if (campaignId) {
      query += ' AND campaign_id = ?';
      params.push(campaignId);
    }

    query += ' ORDER BY created_at DESC';
    const rows = db.prepare(query).all(...params);

    const records = rows.map(r => ({
      consentId: r.consent_id,
      campaignId: r.campaign_id,
      brandName: r.brand_name,
      qrCodeId: r.qr_code_id,
      hashedPhone: r.phone_hash,
      hashedEmail: r.email_hash,
      purpose: r.purpose,
      retentionDays: r.retention_days,
      timestamp: r.consent_timestamp,
      userIp: r.user_ip
    }));

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
    const tenantId = body.tenantId || body.tenant_id || 'default_org';

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

    const now = new Date().toISOString();
    const db = getDatabase();
    db.prepare(`
      INSERT INTO first_party_consents (
        id, consent_id, tenant_id, campaign_id, brand_name, qr_code_id,
        phone_hash, email_hash, raw_phone, raw_email, purpose, retention_days,
        consent_timestamp, user_ip, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      consentRecord.consentId, consentRecord.consentId, tenantId, consentRecord.campaignId,
      consentRecord.brandName, consentRecord.qrCodeId, consentRecord.hashedPhone,
      consentRecord.hashedEmail, null, null, consentRecord.purpose,
      consentRecord.retentionDays, consentRecord.timestamp, consentRecord.userIp, now
    );

    return NextResponse.json({
      success: true,
      consent: consentRecord,
      message: 'Explicit first-party consent recorded with DPDP/GDPR compliance metadata and database persistence.'
    }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
