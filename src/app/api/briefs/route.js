import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getDatabase } from '@/lib/data/database';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId') || 'default_org';

    // 1. Fetch from durable database
    const db = getDatabase();
    const briefs = db.prepare('SELECT * FROM campaign_briefs WHERE tenant_id = ? ORDER BY created_at DESC').all(tenantId);

    // If Supabase is active and has records, we can merge or use Supabase
    if (briefs.length === 0 && supabaseAdmin) {
      try {
        const { data, error } = await supabaseAdmin
          .from('campaign_briefs')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data && data.length > 0) {
          return NextResponse.json({ success: true, briefs: data });
        }
      } catch (_) {}
    }

    return NextResponse.json({
      success: true,
      briefs
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, company, email, phone, campaignType, targetCities, briefDetails, tenantId = 'default_org' } = body;

    if (!name || !email || !company) {
      return NextResponse.json({
        success: false,
        error: 'Name, company name, and work email are required.'
      }, { status: 400 });
    }

    const briefId = 'brf_' + (globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID().replace(/-/g, '').slice(0, 10) : Date.now().toString(36));
    const now = new Date().toISOString();

    const newBrief = {
      id: briefId,
      tenant_id: tenantId,
      name,
      company,
      email,
      phone: phone || 'N/A',
      campaign_type: campaignType || 'Product Sampling Trial',
      target_cities: targetCities || 'Chennai Hub',
      brief_details: briefDetails || '',
      status: 'Received',
      created_at: now
    };

    // Durable SQLite persistence - fails closed if insertion fails
    const db = getDatabase();
    db.prepare(`
      INSERT INTO campaign_briefs (
        id, tenant_id, name, company, email, phone, campaign_type, target_cities, brief_details, status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      newBrief.id, newBrief.tenant_id, newBrief.name, newBrief.company,
      newBrief.email, newBrief.phone, newBrief.campaign_type,
      newBrief.target_cities, newBrief.brief_details, newBrief.status, newBrief.created_at
    );

    // Optional Supabase sync if credentials exist
    if (supabaseAdmin) {
      try {
        await supabaseAdmin.from('campaign_briefs').insert([newBrief]);
      } catch (_) {}
    }

    return NextResponse.json({
      success: true,
      brief: newBrief,
      message: 'Campaign brief received and durably persisted.'
    }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
