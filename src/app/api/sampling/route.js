import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getDatabase } from '@/lib/data/database';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const campaignId = searchParams.get('campaignId') || searchParams.get('campaign_id');
    const tenantId = searchParams.get('tenantId') || 'default_org';

    const db = getDatabase();
    let query = 'SELECT * FROM sampling_logs WHERE tenant_id = ?';
    const params = [tenantId];

    if (campaignId) {
      query += ' AND campaign_id = ?';
      params.push(campaignId);
    }

    query += ' ORDER BY logged_at DESC LIMIT 200';
    const logs = db.prepare(query).all(...params);

    const totalQuantity = logs.reduce((acc, l) => acc + (l.quantity_logged || 1), 0);
    const totalInteractions = logs.reduce((acc, l) => acc + (l.interaction_count || 1), 0);

    return NextResponse.json({
      success: true,
      logs,
      totalQuantity,
      totalInteractions
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const tenantId = body.tenantId || body.tenant_id || 'default_org';
    const now = new Date().toISOString();
    const logId = 'smp_' + (globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID().replace(/-/g, '').slice(0, 10) : Date.now().toString(36));

    const newLog = {
      id: logId,
      log_id: logId,
      tenant_id: tenantId,
      assignment_id: body.assignment_id || 'asgn_1',
      campaign_id: body.campaign_id || body.campaignId || 'camp_1',
      worker_id: body.worker_id || body.workerId || 'wrk_1',
      quantity_logged: parseInt(body.quantity || body.quantity_logged, 10) || 1,
      interaction_count: parseInt(body.interactions || body.interaction_count, 10) || 1,
      notes: body.notes || 'Product Sample Distributed',
      logged_at: body.logged_at || now,
      created_at: now
    };

    const db = getDatabase();
    db.prepare(`
      INSERT INTO sampling_logs (
        id, log_id, tenant_id, assignment_id, campaign_id, worker_id, quantity_logged, interaction_count, notes, logged_at, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      newLog.id, newLog.log_id, newLog.tenant_id, newLog.assignment_id, newLog.campaign_id,
      newLog.worker_id, newLog.quantity_logged, newLog.interaction_count,
      newLog.notes, newLog.logged_at, newLog.created_at
    );

    if (supabaseAdmin) {
      try {
        await supabaseAdmin.from('sampling_logs').insert([newLog]);
      } catch (_) {}
    }

    return NextResponse.json({ success: true, log: newLog }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
