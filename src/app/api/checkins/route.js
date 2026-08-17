import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabase';

export const runtime = 'edge';

let edgeCheckinsStore = [];

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const campaignId = searchParams.get('campaignId');

    let query = supabaseAdmin.from('shift_checkins').select('*').order('checkin_timestamp', { ascending: false });
    if (campaignId) {
      query = query.eq('campaign_id', campaignId);
    }

    const { data, error } = await query;
    const checkins = (!error && data) ? data : (campaignId ? edgeCheckinsStore.filter(c => c.campaign_id === campaignId) : edgeCheckinsStore);

    return NextResponse.json({
      success: true,
      checkins,
      count: checkins.length
    });
  } catch (err) {
    return NextResponse.json({ success: true, checkins: edgeCheckinsStore, count: edgeCheckinsStore.length });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    const newCheckin = {
      checkin_id: 'chk_' + Date.now().toString(36),
      assignment_id: body.assignment_id || 'asgn_' + Date.now().toString(36),
      campaign_id: body.campaign_id,
      worker_id: body.worker_id || 'wrk_' + Math.random().toString(36).substr(2, 6),
      worker_name: body.worker_name || 'Promoter',
      checkin_timestamp: new Date().toISOString(),
      checkin_latitude: body.latitude || 12.9716,
      checkin_longitude: body.longitude || 77.5946,
      distance_from_centroid_meters: body.distance_meters || 12,
      is_within_geofence: body.is_within_geofence !== undefined ? body.is_within_geofence : true,
      checkin_selfie_url: body.selfie_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      supervisor_verified: true
    };

    try {
      await supabaseAdmin.from('shift_checkins').insert([newCheckin]);
    } catch (_) {}

    edgeCheckinsStore.unshift(newCheckin);

    return NextResponse.json({ success: true, checkin: newCheckin }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
