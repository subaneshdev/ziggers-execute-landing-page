import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabase';

export const runtime = 'edge';

let edgeSamplingStore = [];

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const campaignId = searchParams.get('campaignId');

    let query = supabaseAdmin.from('sampling_logs').select('*').order('logged_at', { ascending: false });
    if (campaignId) {
      query = query.eq('campaign_id', campaignId);
    }

    const { data, error } = await query;
    const logs = (!error && data) ? data : (campaignId ? edgeSamplingStore.filter(s => s.campaign_id === campaignId) : edgeSamplingStore);

    const totalQuantity = logs.reduce((acc, l) => acc + (l.quantity_logged || 1), 0);
    const totalInteractions = logs.reduce((acc, l) => acc + (l.interaction_count || 1), 0);

    return NextResponse.json({
      success: true,
      logs,
      totalQuantity,
      totalInteractions
    });
  } catch (err) {
    return NextResponse.json({ success: true, logs: edgeSamplingStore, totalQuantity: 0, totalInteractions: 0 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    const newLog = {
      log_id: 'smp_' + Date.now().toString(36),
      assignment_id: body.assignment_id || 'asgn_1',
      campaign_id: body.campaign_id,
      worker_id: body.worker_id || 'wrk_1',
      quantity_logged: parseInt(body.quantity) || 1,
      interaction_count: parseInt(body.interactions) || 1,
      notes: body.notes || 'Product Sample Distributed',
      logged_at: new Date().toISOString()
    };

    try {
      await supabaseAdmin.from('sampling_logs').insert([newLog]);
    } catch (_) {}

    edgeSamplingStore.unshift(newLog);

    return NextResponse.json({ success: true, log: newLog }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
