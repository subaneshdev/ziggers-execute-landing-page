import { NextResponse } from 'next/server';
import { generateCampaignRequirements, updateRequirementItem } from '@/lib/marketplace/requirementsEngine';

export const runtime = 'nodejs';

export async function POST(request) {
  try {
    const body = await request.json();
    const requirements = generateCampaignRequirements(body);

    return NextResponse.json({
      success: true,
      data: requirements
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { requirementsPackage, itemId, updates } = await request.json();
    const updated = updateRequirementItem(requirementsPackage, itemId, updates);

    return NextResponse.json({
      success: true,
      data: updated
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
