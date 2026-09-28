import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getDatabase } from '@/lib/data/database';
import { authorizeWorkerPayout } from '@/lib/data/repositories/verificationRepository';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const campaignId = searchParams.get('campaignId') || searchParams.get('campaign_id');
    const tenantId = searchParams.get('tenantId') || 'default_org';

    const db = getDatabase();
    let query = 'SELECT * FROM payouts WHERE tenant_id = ?';
    const params = [tenantId];

    if (campaignId) {
      query += ' AND campaign_id = ?';
      params.push(campaignId);
    }

    query += ' ORDER BY created_at DESC LIMIT 100';

    const payouts = db.prepare(query).all(...params);
    const totalPaise = payouts.reduce((acc, p) => acc + (p.total_payable_paise || 0), 0);

    return NextResponse.json({
      success: true,
      tenantId,
      payouts,
      totalPayablePaise: totalPaise,
      totalPayableInr: (totalPaise / 100).toFixed(2),
      gatewayIntegrationStatus: 'ESCROW_BATCH_DISBURSEMENT_READY',
      accountingStandard: 'INTEGER_PAISE_STRICT'
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    const campaignId = body.campaignId || body.campaign_id;
    const assignmentId = body.assignmentId || body.assignment_id;
    const workerId = body.workerId || body.worker_id;
    const tenantId = body.tenantId || body.tenant_id || 'default_org';
    const shiftHours = Number(body.shiftHours || body.shift_hours) || 5;
    const upiId = body.upiId || body.upi_id || 'promoter@upi';
    const idempotencyKey = body.idempotencyKey || body.idempotency_key || `idem_pay_${campaignId}_${assignmentId}_${workerId}`;

    if (!campaignId || !assignmentId || !workerId) {
      return NextResponse.json({
        success: false,
        error: 'campaignId, assignmentId, and workerId are required for payout authorization.'
      }, { status: 400 });
    }

    // Call server-side verified payout authorization.
    // Client boolean flags (e.g. proof_verified: true) are IGNORED.
    const payoutResult = authorizeWorkerPayout({
      campaignId,
      assignmentId,
      workerId,
      tenantId,
      idempotencyKey,
      shiftHours,
      upiId
    });

    return NextResponse.json({
      success: true,
      payout: payoutResult,
      isDuplicate: Boolean(payoutResult.isDuplicate),
      accountingStandard: 'INTEGER_PAISE_STRICT',
      message: payoutResult.isDuplicate 
        ? 'Duplicate payout authorization ignored via idempotency.' 
        : 'Worker payout authorized from server-verified check-in records.'
    }, { status: payoutResult.isDuplicate ? 200 : 201 });
  } catch (err) {
    return NextResponse.json({ 
      success: false, 
      error: err.message 
    }, { status: 422 });
  }
}
