import { NextResponse } from 'next/server';
import { issueWorkOrder, getCampaignExecutionBoard, WORK_ORDER_STATUSES } from '@/lib/marketplace/workOrderEngine';

export const runtime = 'nodejs';

let inMemoryWorkOrderStore = [];

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const campaignId = searchParams.get('campaignId');

    let workOrders = inMemoryWorkOrderStore;
    if (campaignId) {
      workOrders = workOrders.filter(w => w.campaignId === campaignId);
    }

    const executionBoard = getCampaignExecutionBoard(workOrders);

    return NextResponse.json({
      success: true,
      workOrders,
      executionBoard,
      totalCount: workOrders.length
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { acceptedQuote, campaignContext } = body;

    const workOrder = issueWorkOrder(acceptedQuote, campaignContext);
    inMemoryWorkOrderStore.unshift(workOrder);

    return NextResponse.json({
      success: true,
      workOrder
    }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
