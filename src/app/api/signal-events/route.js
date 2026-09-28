import { NextResponse } from 'next/server';


// Memory event stream store for edge runtime
let signalEventsStore = [
  {
    signal_event_id: 'ev_init_01',
    campaign_id: 'meta_camp_redbull_sampling_01',
    event_type: 'CAMPAIGN_STARTED',
    timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
    geo_cell: '892f254f177ffff',
    latitude: 12.9815,
    longitude: 80.2482,
    promoter_id: 'PROMOTER_482',
    promoter_name: 'Vikas R.',
    interaction_type: 'SYSTEM_ACTIVATION',
    metadata: { location: 'OMR IT Corridor & Tidel Park', status: 'GEOFENCE_VERIFIED' }
  },
  {
    signal_event_id: 'ev_init_02',
    campaign_id: 'meta_camp_redbull_sampling_01',
    event_type: 'PROMOTER_CHECKIN',
    timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
    geo_cell: '892f254f177ffff',
    latitude: 12.9818,
    longitude: 80.2485,
    promoter_id: 'PROMOTER_482',
    promoter_name: 'Vikas R.',
    interaction_type: 'GPS_BIOMETRIC_CHECKIN',
    metadata: { accuracy_meters: 8.5 }
  },
  {
    signal_event_id: 'ev_init_03',
    campaign_id: 'meta_camp_redbull_sampling_01',
    event_type: 'SAMPLE_DISTRIBUTED',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    geo_cell: '892f254f177ffff',
    latitude: 12.9815,
    longitude: 80.2482,
    promoter_id: 'PROMOTER_482',
    promoter_name: 'Vikas R.',
    interaction_type: 'PRODUCT_CAN_HANDOUT',
    metadata: { product: 'Red Bull Energy Can 250ml', stock_remaining: 340 }
  },
  {
    signal_event_id: 'ev_init_04',
    campaign_id: 'meta_camp_redbull_sampling_01',
    event_type: 'QR_SCAN',
    timestamp: new Date(Date.now() - 3600000 * 1.5).toISOString(),
    geo_cell: '892f254f177ffff',
    latitude: 12.9815,
    longitude: 80.2482,
    promoter_id: 'PROMOTER_482',
    promoter_name: 'Vikas R.',
    interaction_type: 'PHYSICAL_SCAN',
    qr_code_id: 'qr_redbull_sampling_omr_p482',
    metadata: { browser: 'Mobile Safari', time_window: '19:42' }
  },
  {
    signal_event_id: 'ev_init_05',
    campaign_id: 'meta_camp_redbull_sampling_01',
    event_type: 'LEAD_CAPTURED',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    geo_cell: '892f254f177ffff',
    latitude: 12.9815,
    longitude: 80.2482,
    promoter_id: 'PROMOTER_482',
    promoter_name: 'Vikas R.',
    interaction_type: 'FORM_CONSENT_OPT_IN',
    conversion_id: 'cnv_891238',
    metadata: { consent_purpose: 'PRODUCT_SAMPLING_FEEDBACK_AND_OFFERS', verified_otp: true }
  }
];

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const campaignId = searchParams.get('campaignId');
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    let events = signalEventsStore;
    if (campaignId) {
      events = events.filter(e => e.campaign_id === campaignId);
    }

    const countsByType = {};
    events.forEach(e => {
      countsByType[e.event_type] = (countsByType[e.event_type] || 0) + 1;
    });

    return NextResponse.json({
      success: true,
      totalEvents: events.length,
      countsByType,
      events: events.slice(0, limit)
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    if (!body.campaign_id || !body.event_type) {
      return NextResponse.json({ success: false, error: 'campaign_id and event_type are required.' }, { status: 400 });
    }

    const newEvent = {
      signal_event_id: `ev_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
      campaign_id: body.campaign_id,
      event_type: body.event_type,
      timestamp: body.timestamp || new Date().toISOString(),
      geo_cell: body.geo_cell || '892f254f177ffff',
      latitude: body.latitude || 13.0418,
      longitude: body.longitude || 80.2341,
      promoter_id: body.promoter_id || 'PROMOTER_POOL',
      promoter_name: body.promoter_name || 'Promoter Team',
      interaction_type: body.interaction_type || 'FIELD_EVENT',
      qr_code_id: body.qr_code_id || null,
      conversion_id: body.conversion_id || null,
      metadata: body.metadata || {}
    };

    signalEventsStore.unshift(newEvent);

    return NextResponse.json({
      success: true,
      event: newEvent
    }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
