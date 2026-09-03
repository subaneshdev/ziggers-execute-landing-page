import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabase';
import { validateGeofenceCheckin } from '@/lib/intelligence/index';

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

    // Accuracy-aware geofence validation
    const validation = validateGeofenceCheckin({
      targetLat: Number(body.targetLatitude) || 13.0418,
      targetLng: Number(body.targetLongitude) || 80.2341,
      actualLat: Number(body.latitude) || 13.0419,
      actualLng: Number(body.longitude) || 80.2342,
      gpsAccuracyMeters: Number(body.gpsAccuracy) || 10,
      allowedRadiusMeters: Number(body.allowedRadiusMeters) || 50
    });

    const checkinUuid = globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : `chk_${Date.now().toString(36)}`;
    const workerUuid = body.worker_id || (globalThis.crypto?.randomUUID ? `wrk_${globalThis.crypto.randomUUID().slice(0, 8)}` : `wrk_${Date.now().toString(36)}`);

    const newCheckin = {
      checkin_id: checkinUuid,
      assignment_id: body.assignment_id || `asgn_${Date.now().toString(36)}`,
      campaign_id: body.campaign_id,
      worker_id: workerUuid,
      worker_name: body.worker_name || 'Promoter',
      checkin_timestamp: new Date().toISOString(),
      checkin_latitude: Number(body.latitude) || 13.0419,
      checkin_longitude: Number(body.longitude) || 80.2342,
      distance_from_centroid_meters: validation.distanceToCentroidMeters,
      is_within_geofence: validation.isWithinGeofence,
      gps_accuracy_meters: validation.gpsAccuracyMeters,
      verification_status: validation.verificationStatus,
      checkin_selfie_url: body.selfie_url || null,
      supervisor_verified: validation.isWithinGeofence
    };

    try {
      await supabaseAdmin.from('shift_checkins').insert([newCheckin]);
    } catch (_) {}

    edgeCheckinsStore.unshift(newCheckin);

    return NextResponse.json({ success: true, checkin: newCheckin, validation }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
