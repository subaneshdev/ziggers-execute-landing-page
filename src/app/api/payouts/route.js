import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabase';
import { calculateWorkerShiftPayout } from '@/lib/intelligence/index';

export const runtime = 'edge';

let edgePayoutStore = [];

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const campaignId = searchParams.get('campaignId');

    let query = supabaseAdmin.from('payout_ledger').select('*').order('created_at', { ascending: false });
    const { data, error } = await query;
    const payouts = (!error && data) ? data : edgePayoutStore;

    const totalCalculated = payouts.reduce((acc, p) => acc + (parseFloat(p.total_payable_amount) || 0), 0);

    return NextResponse.json({
      success: true,
      payouts,
      totalCalculated,
      gatewayIntegrationStatus: 'MANUAL_OR_ESCROW_BATCH_ONLY',
      notice: 'Direct real-time UPI disbursement gateway is pending production banking clearance.'
    });
  } catch (err) {
    return NextResponse.json({ success: true, payouts: edgePayoutStore, totalCalculated: 0 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    const payoutCalc = calculateWorkerShiftPayout({
      campaignId: body.campaign_id || 'camp_1',
      workerId: body.worker_id || 'wrk_1',
      shiftId: body.assignment_id || 'asgn_1',
      guaranteedBase: body.guaranteed_amount || 1200.00,
      variableBonus: body.bonus_amount || 150.00,
      deductions: body.deductions || 0.00,
      proofVerified: body.proof_verified !== undefined ? body.proof_verified : true,
      attendanceVerified: body.attendance_verified !== undefined ? body.attendance_verified : true
    });

    const isAuditPassed = payoutCalc.status === 'APPROVED_FOR_UPI_DISBURSEMENT';

    const newPayout = {
      payout_id: 'pay_' + Date.now().toString(36),
      assignment_id: body.assignment_id || 'asgn_1',
      campaign_id: body.campaign_id || 'camp_1',
      worker_id: body.worker_id || 'wrk_1',
      guaranteed_amount: payoutCalc.baseAmount,
      variable_bonus_amount: payoutCalc.bonusAmount,
      deductions_amount: payoutCalc.deductionsAmount,
      total_payable_amount: payoutCalc.totalPayableAmount,
      payout_status: isAuditPassed ? 'QUEUED_FOR_BANK_BATCH' : 'PENDING_SUPERVISOR_AUDIT',
      upi_id: body.upi_id || 'promoter@upi',
      transaction_ref_no: null, // No fake UTR numbers generated
      settlementMode: 'ESCROW_BATCH_DISBURSEMENT',
      created_at: new Date().toISOString()
    };

    try {
      await supabaseAdmin.from('payout_ledger').insert([newPayout]);
    } catch (_) {}

    edgePayoutStore.unshift(newPayout);

    return NextResponse.json({ 
      success: true, 
      payout: newPayout, 
      calculation: payoutCalc,
      settlementNotice: 'Shift payable calculated. Queued for scheduled escrow batch disbursement.' 
    }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
