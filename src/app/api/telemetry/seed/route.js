import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase';

export const runtime = 'edge';

export async function POST(request) {
  // Sandbox-only endpoint: Guard against accidental production execution
  if (process.env.NODE_ENV === 'production' && process.env.ALLOW_TELEMETRY_SEED !== 'true') {
    return NextResponse.json({
      success: false,
      error: 'Telemetry seed endpoint is disabled in production environment. All telemetry must originate from verified on-ground mobile check-in APIs.'
    }, { status: 403 });
  }

  try {
    const body = await request.json();
    const campaignId = body.campaignId;
    const campaignTitle = body.campaignTitle || 'Brand Activation';
    const city = body.city || 'Chennai';
    const headcount = Math.min(20, parseInt(body.headcount, 10) || 5);

    const checkins = [];
    const samplingLogs = [];
    const proofPhotos = [];
    const payouts = [];

    for (let i = 0; i < headcount; i++) {
      const workerId = `wrk_${100 + i}`;
      const workerName = `Promoter ${i + 1}`;
      const asgnId = `asgn_${Date.now().toString(36)}_${i}`;

      checkins.push({
        checkin_id: `chk_${Date.now().toString(36)}_${i}`,
        assignment_id: asgnId,
        campaign_id: campaignId || null,
        worker_id: workerId,
        worker_name: workerName,
        checkin_timestamp: new Date().toISOString(),
        checkin_latitude: 13.0827 + (i * 0.002),
        checkin_longitude: 80.2707 + (i * 0.002),
        distance_from_centroid_meters: 12 + (i * 2),
        is_within_geofence: true,
        checkin_selfie_url: null,
        supervisor_verified: true
      });

      samplingLogs.push({
        log_id: `smp_${Date.now().toString(36)}_${i}`,
        assignment_id: asgnId,
        campaign_id: campaignId || null,
        worker_id: workerId,
        quantity_logged: 40,
        interaction_count: 50,
        notes: `Telemetry recorded at ${city} node ${i + 1}`,
        logged_at: new Date().toISOString()
      });

      proofPhotos.push({
        proof_id: `prf_${Date.now().toString(36)}_${i}`,
        assignment_id: asgnId,
        campaign_id: campaignId || null,
        worker_id: workerId,
        storage_bucket: 'proof_photos',
        image_url: null,
        latitude: 13.0827 + (i * 0.002),
        longitude: 80.2707 + (i * 0.002),
        verification_status: 'APPROVED',
        reviewed_by: 'Supervisor Desk',
        reviewed_at: new Date().toISOString()
      });

      payouts.push({
        payout_id: `pay_${Date.now().toString(36)}_${i}`,
        assignment_id: asgnId,
        worker_id: workerId,
        guaranteed_amount: 1200.00,
        variable_bonus_amount: 150.00,
        deductions_amount: 0.00,
        total_payable_amount: 1350.00,
        payout_status: 'DISBURSED_UPI',
        upi_id: `worker${i + 1}@upi`,
        transaction_ref_no: `UTR-${Date.now()}-${i}`,
        disbursed_at: new Date().toISOString()
      });
    }

    // Try inserting into Supabase
    try {
      await supabaseAdmin.from('shift_checkins').insert(checkins);
      await supabaseAdmin.from('sampling_logs').insert(samplingLogs);
      await supabaseAdmin.from('proof_photos').insert(proofPhotos);
      await supabaseAdmin.from('payout_ledger').insert(payouts);
    } catch (_) {}

    return NextResponse.json({
      success: true,
      message: `Sandbox telemetry logged for campaign "${campaignTitle}".`,
      summary: {
        checkinsSeeded: checkins.length,
        samplingLogsSeeded: samplingLogs.length,
        proofPhotosSeeded: proofPhotos.length,
        payoutsSeeded: payouts.length
      }
    }, { status: 201 });

  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
