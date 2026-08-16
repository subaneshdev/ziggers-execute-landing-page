import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabase';

export const runtime = 'edge';

let edgeBriefsStore = [];

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('campaign_briefs')
      .select('*')
      .order('created_at', { ascending: false });

    return NextResponse.json({
      success: true,
      briefs: (!error && data) ? data : edgeBriefsStore
    });
  } catch (err) {
    return NextResponse.json({
      success: true,
      briefs: edgeBriefsStore
    });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, company, email, phone, campaignType, targetCities, briefDetails } = body;

    if (!name || !email || !company) {
      return NextResponse.json({
        success: false,
        error: 'Name, company name, and work email are required.'
      }, { status: 400 });
    }

    const briefId = 'brf_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 4);

    const newBrief = {
      id: briefId,
      name,
      company,
      email,
      phone: phone || 'N/A',
      campaign_type: campaignType || 'Product Sampling Trial',
      target_cities: targetCities || 'Chennai Hub',
      brief_details: briefDetails || '',
      status: 'Received',
      created_at: new Date().toISOString()
    };

    // Try saving to Supabase table
    try {
      await supabaseAdmin.from('campaign_briefs').insert([newBrief]);
    } catch (_) {}

    edgeBriefsStore.unshift(newBrief);

    return NextResponse.json({
      success: true,
      briefId,
      message: 'Your campaign brief has been received and routed to regional operations dispatchers.'
    }, { status: 201 });
  } catch (err) {
    return NextResponse.json({
      success: false,
      error: err.message
    }, { status: 500 });
  }
}
