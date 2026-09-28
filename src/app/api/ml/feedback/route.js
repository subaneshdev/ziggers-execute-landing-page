import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { 
  mlFeedbackEngine, 
  recordCampaignObservation, 
  getLearningEngineStats 
} from '@/lib/intelligence/index';
import { ingestVerifiedOutcomeTransaction } from '@/lib/data/repositories/outcomeRepository';
import { getDatabase } from '@/lib/data/database';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId') || 'default_org';
    const db = getDatabase();

    const outcomes = db.prepare(`
      SELECT * FROM campaign_outcomes 
      WHERE tenant_id = ? 
      ORDER BY created_at DESC LIMIT 50
    `).all(tenantId);

    const posteriors = db.prepare(`
      SELECT * FROM bayesian_posteriors 
      WHERE tenant_id = ? OR tenant_id = 'global'
      ORDER BY updated_at DESC LIMIT 50
    `).all(tenantId);

    const summary = mlFeedbackEngine.getModelPerformanceSummary();
    const stats = getLearningEngineStats();

    return NextResponse.json({
      success: true,
      tenantId,
      outcomesCount: outcomes.length,
      outcomes,
      posteriors,
      summary,
      stats
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    if (!body.campaignId || (!body.locationName && !body.h3Cell)) {
      return NextResponse.json({ 
        success: false, 
        error: 'campaignId and either locationName or h3Cell are required.' 
      }, { status: 400 });
    }

    const tenantId = body.tenantId || 'default_org';
    const city = body.city || 'Chennai';
    const h3Cell = body.h3Cell || '892f254f177ffff';
    const venueType = body.venueType || 'commercial_high_street';
    const objective = body.objective || 'Product Sampling';
    const predicted = body.predicted || {};
    const actual = body.actual || {};
    const idempotencyKey = body.idempotencyKey || `idem_${body.campaignId}_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;

    const actualInteractions = Number(actual.interactions) || 0;
    const actualConversions = Number(actual.leads || actual.conversions) || 0;
    const actualFootfall = Number(actual.reach || actual.footfall) || 0;
    const actualSamples = Number(actual.samples) || 0;

    // 1. Transactional Database Ingestion & Bayesian Posterior Update
    const ingestionResult = ingestVerifiedOutcomeTransaction({
      idempotencyKey,
      campaignId: body.campaignId,
      tenantId,
      city,
      h3Cell,
      venueType,
      objective,
      actualFootfall,
      actualInteractions,
      actualConversions,
      actualSamples,
      dataQualityStatus: body.dataQualityStatus || 'VERIFIED'
    });

    // 2. Record in Legacy ML Feedback Engine for telemetry compatibility
    const recorded = mlFeedbackEngine.recordCampaignFeedback({
      campaignId: body.campaignId,
      locationName: body.locationName || city,
      h3Cell,
      objective,
      predicted,
      actual
    });

    // 3. Ingest into Multi-Dimensional Observation Aggregator
    recordCampaignObservation({
      campaignId: body.campaignId,
      h3Cell,
      locationType: body.locationName || venueType,
      campaignObjective: objective,
      predictedInteractions: Number(predicted.interactions) || 0,
      predictedConversions: Number(predicted.leads || predicted.conversions) || 0,
      predictedFootfall: Number(predicted.reach || predicted.footfall) || 0,
      actualInteractions,
      actualConversions,
      actualFootfall
    });

    return NextResponse.json({
      success: true,
      ingestionResult,
      feedbackRecord: recorded,
      message: ingestionResult.isDuplicate 
        ? 'Duplicate outcome submission ignored via idempotency.' 
        : 'Campaign outcome recorded. Durable Bayesian posteriors and audit hash chain updated.'
    }, { status: ingestionResult.isDuplicate ? 200 : 201 });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
