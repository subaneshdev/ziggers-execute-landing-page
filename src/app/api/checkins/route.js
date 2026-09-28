import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getDatabase } from '@/lib/data/database';
import { recordShiftCheckin, createWorkerAssignment } from '@/lib/data/repositories/verificationRepository';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const campaignId = searchParams.get('campaignId') || searchParams.get('campaign_id');
    const workerId = searchParams.get('workerId') || searchParams.get('worker_id');
    const tenantId = searchParams.get('tenantId') || 'default_org';

    const db = getDatabase();
    let query = 'SELECT * FROM shift_checkins WHERE tenant_id = ?';
    const params = [tenantId];

    if (campaignId) {
      query += ' AND campaign_id = ?';
      params.push(campaignId);
    }
    if (workerId) {
      query += ' AND worker_id = ?';
      params.push(workerId);
    }

    query += ' ORDER BY checkin_timestamp DESC LIMIT 100';

    const checkins = db.prepare(query).all(...params);

    return NextResponse.json({
      success: true,
      checkins,
      count: checkins.length
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    const campaignId = body.campaignId || body.campaign_id || 'camp_1';
    const workerId = body.workerId || body.worker_id || `wrk_${crypto.randomBytes(3).toString('hex')}`;
    let assignmentId = body.assignmentId || body.assignment_id;
    const tenantId = body.tenantId || body.tenant_id || 'default_org';

    const db = getDatabase();

    // If assignmentId is not specified or does not exist, ensure one is registered
    if (!assignmentId) {
      assignmentId = `asgn_${campaignId}_${workerId}_${Date.now().toString(36)}`;
    }

    const existingAssignment = db.prepare('SELECT * FROM worker_assignments WHERE assignment_id = ? AND worker_id = ?').get(assignmentId, workerId);
    if (!existingAssignment) {
      createWorkerAssignment({
        assignmentId,
        campaignId,
        workerId,
        tenantId,
        shiftDate: new Date().toISOString().split('T')[0],
        shiftStartTime: '09:00',
        shiftEndTime: '18:00',
        targetLatitude: Number(body.targetLatitude || body.target_latitude) || 13.0418,
        targetLongitude: Number(body.targetLongitude || body.target_longitude) || 80.2341,
        geofenceRadiusMeters: Number(body.allowedRadiusMeters || body.geofenceRadiusMeters) || 50
      });
    }

    // Call server-side verification repository.
    // Client-side 'proof_verified' or 'is_within_geofence' flags are IGNORED.
    const checkinResult = recordShiftCheckin({
      assignmentId,
      campaignId,
      workerId,
      tenantId,
      latitude: Number(body.latitude || body.checkin_latitude) || 13.0419,
      longitude: Number(body.longitude || body.checkin_longitude) || 80.2342,
      gpsAccuracyMeters: Number(body.gpsAccuracy || body.gpsAccuracyMeters || body.gps_accuracy) || 10,
      isMockDetected: Boolean(body.isMockDetected || body.is_mock_detected || body.isMockGpsDetected),
      checkinTimestamp: body.checkinTimestamp || new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      checkin: checkinResult,
      isVerified: checkinResult.isVerified,
      verificationStatus: checkinResult.verificationStatus
    }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
