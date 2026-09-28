import { NextResponse } from 'next/server';
import { getTenantModelEvaluationData } from '@/lib/data/repositories/outcomeRepository';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId') || 'default_org';
    const metric = searchParams.get('metric') || 'samples';

    const evaluationData = getTenantModelEvaluationData({ tenantId, metric });

    return NextResponse.json({
      success: true,
      ...evaluationData
    });
  } catch (err) {
    return NextResponse.json({
      success: false,
      error: err.message
    }, { status: 500 });
  }
}
