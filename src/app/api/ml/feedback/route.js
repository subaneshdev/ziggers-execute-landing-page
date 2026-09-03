import { NextResponse } from 'next/server';
import { mlFeedbackEngine } from '@/lib/intelligence/index';

export const runtime = 'edge';

export async function GET() {
  try {
    const summary = mlFeedbackEngine.getModelPerformanceSummary();
    return NextResponse.json({
      success: true,
      summary
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    if (!body.campaignId || !body.locationName) {
      return NextResponse.json({ success: false, error: 'campaignId and locationName are required.' }, { status: 400 });
    }

    const recorded = mlFeedbackEngine.recordCampaignFeedback({
      campaignId: body.campaignId,
      locationName: body.locationName,
      h3Cell: body.h3Cell || '892f254f177ffff',
      objective: body.objective || 'Product Sampling',
      predicted: body.predicted || {},
      actual: body.actual || {}
    });

    return NextResponse.json({
      success: true,
      feedbackRecord: recorded,
      message: 'Campaign outcome recorded for continuous LightGBM / Ridge model retraining.'
    }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
