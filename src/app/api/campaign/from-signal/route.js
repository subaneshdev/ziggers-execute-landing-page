import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { QrAttributionEngine } from '@/lib/intelligence/index';


// Global memory cache for edge deployments
let liveSignalCampaigns = [];

export async function POST(request) {
  try {
    const body = await request.json();
    const execution = body.executionPayload || body;

    if (!execution.name || !execution.brand) {
      return NextResponse.json({ success: false, error: 'Campaign name and brand are required.' }, { status: 400 });
    }

    const rawBudget = execution.budgetInr ?? execution.estimatedBudget ?? execution.budget ?? execution.guaranteed_payout ?? execution.spend;
    const parsedBudget = rawBudget !== undefined && rawBudget !== null && rawBudget !== ''
      ? parseInt(String(rawBudget).replace(/[^0-9]/g, ''), 10)
      : 75000;
    const budgetNum = isNaN(parsedBudget) ? 75000 : parsedBudget;
    const workersNum = parseInt(execution.workers, 10) || 12;
    const targetCity = execution.city || 'Chennai';
    const primaryLocation = execution.location || `${targetCity} Central Hub`;

    // 1. Generate Hierarchical QR Attribution Node
    const qrNode = QrAttributionEngine.generateAttributionNode({
      brandName: execution.brand,
      campaignId,
      locationName: primaryLocation,
      h3Cell: execution.h3Zones?.[0] || '892f254f177ffff',
      promoterId: 'FIELD_LEAD_01',
      promoterName: 'Field Execution Lead'
    });

    const campaignRecord = {
      id: campaignId,
      campaign_id: campaignId,
      title: execution.name,
      name: execution.name,
      brand: execution.brand,
      brand_name: execution.brand,
      objective: execution.objective || 'Product Sampling',
      campaign_type: execution.objective || 'Product Sampling',
      city: targetCity,
      location: primaryLocation,
      location_name: primaryLocation,
      workers: workersNum,
      headcount_required: workersNum,
      stage: 'Live',
      status: true,
      attendance: '100%',
      locations: Array.isArray(execution.targetLocations) ? execution.targetLocations.length : 1,
      spend: `₹${budgetNum.toLocaleString('en-IN')}`,
      totalBudget: `₹${budgetNum.toLocaleString('en-IN')}`,
      budget: `₹${budgetNum.toLocaleString('en-IN')}`,
      guaranteed_payout: budgetNum,
      samples: 0,
      leads: 0,
      reach: 0,
      photos: 0,
      videos: 0,
      qrScans: 0,
      targetSamples: execution.targetSamples || 4800,
      targetLeads: execution.targetLeads || 1600,
      targetCpl: execution.targetCpl || '₹31',
      schedule: `Active (${execution.campaignDays || 3} Days Shift)`,
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date(Date.now() + (execution.campaignDays || 3) * 86400000).toISOString().split('T')[0],
      supervisor_name: 'Ziggers Certified Field Lead',
      supervisor_phone: '+91 98401 22890',
      supervisor_email: 'field.lead@ziggers.com',
      created_at: new Date().toISOString(),
      qrAttribution: qrNode,
      sourceSignal: 'SIGNAL_SYNC_META_BRIDGE'
    };

    // Save to Supabase table if accessible
    try {
      await supabaseAdmin.from('campaigns').insert([{
        campaign_id: campaignId,
        title: campaignRecord.name,
        brand_name: campaignRecord.brand,
        campaign_type: campaignRecord.objective,
        city: targetCity,
        location_name: primaryLocation,
        headcount_required: workersNum,
        guaranteed_payout: budgetNum,
        status: 'Live',
        created_at: new Date().toISOString()
      }]);
    } catch (_) {}

    liveSignalCampaigns.unshift(campaignRecord);

    return NextResponse.json({
      success: true,
      campaign: campaignRecord,
      qrAttribution: qrNode,
      message: 'Campaign launched into Ziggers Execute with live H3 Geofences and QR Attribution.'
    }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
