import { NextResponse } from 'next/server';
import { createRfqFromRequirement, matchVendorsForRfq, compareVendorQuotes } from '@/lib/marketplace/rfqEngine';
import { activationService } from '@/services/activationService';

export const runtime = 'nodejs';

let inMemoryRfqStore = [];

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const campaignId = searchParams.get('campaignId');

    let rfqs = inMemoryRfqStore;
    if (campaignId) {
      rfqs = rfqs.filter(r => r.campaignId === campaignId);
    }

    return NextResponse.json({
      success: true,
      rfqs,
      totalCount: rfqs.length
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { requirementItem, campaignContext } = body;

    const newRfq = createRfqFromRequirement(requirementItem, campaignContext);
    
    // Auto-match eligible physical vendors
    const vendorPool = await activationService.getVendors(requirementItem.category, campaignContext?.city);
    const matchedVendors = matchVendorsForRfq({ category: requirementItem.category, deliveryCity: campaignContext?.city || 'Chennai' }, vendorPool);

    newRfq.matchedVendorCount = matchedVendors.length;
    newRfq.matchedVendors = matchedVendors.map(v => ({ id: v.id, name: v.legalBusinessName, rating: v.rating }));

    inMemoryRfqStore.unshift(newRfq);

    return NextResponse.json({
      success: true,
      rfq: newRfq,
      matchedVendorsCount: matchedVendors.length
    }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
