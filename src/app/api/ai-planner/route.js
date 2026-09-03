import { NextResponse } from 'next/server';
import { generateCampaignForecast, rankLocations } from '@/lib/intelligence/index';

export const runtime = 'edge';

/**
 * Call Gemini 1.5 securely server-side for contextual offline campaign planning
 */
async function callGeminiPlanner({ objective, budget, targetAudience, location, durationDays, shiftHours, forecastData }) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return {
      status: 'AI_UNAVAILABLE',
      reason: 'GEMINI_API_KEY is not configured in server environment.'
    };
  }

  const prompt = `You are the lead Offline Campaign Strategist for Ziggers India.
Generate a structured, strategic, factual activation plan based on the following real location intelligence and budget parameters.
Do NOT invent numbers not provided in the parameters. Distinguish clearly between OBSERVED DATA, MODELLED ESTIMATE, and AI RECOMMENDATIONS.

Campaign Parameters:
- Objective: ${objective}
- Budget: ₹${budget} (Inclusive of GST & minimum escrow reserve)
- Target Audience: ${targetAudience}
- Target Location: ${location}
- Campaign Duration: ${durationDays} days (${shiftHours} hours/day)
- Intelligence Forecast Samples: ${forecastData.forecast?.samples || 0}
- Intelligence Forecast Leads: ${forecastData.forecast?.leads || 0}
- Intelligence Forecast Footfall Reach: ${forecastData.forecast?.reach || 0}
- Recommended Promoters: ${forecastData.capacity?.promoterCount || 0}
- Recommended Supervisors: ${forecastData.capacity?.supervisorCount || 0}

Respond ONLY with a valid JSON object matching this exact schema:
{
  "summary": "Concise executive overview of activation strategy",
  "recommendedStrategy": "Step-by-step physical engagement approach for promoters",
  "staffingRecommendation": "Promoter & supervisor placement guidelines",
  "timingRecommendation": "Peak hour engagement time slots",
  "locationInsights": "Why this venue matches the audience and footfall profile",
  "risks": ["Risk 1", "Risk 2"],
  "assumptions": ["Assumption 1", "Assumption 2"],
  "dataLimitations": "Data confidence and geographic observation constraints",
  "nextActions": ["Action 1", "Action 2", "Action 3"]
}`;

  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          response_mime_type: "application/json",
          temperature: 0.2
        }
      })
    });

    if (!res.ok) {
      return {
        status: 'AI_UNAVAILABLE',
        reason: `Gemini API returned status ${res.status}`
      };
    }

    const data = await res.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) {
      return { status: 'AI_UNAVAILABLE', reason: 'Empty response candidate from Gemini' };
    }

    const parsed = JSON.parse(rawText);
    return {
      status: 'SUCCESS',
      aiOutput: parsed
    };
  } catch (err) {
    return {
      status: 'AI_UNAVAILABLE',
      reason: err.message
    };
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { 
      objective = 'Product Sampling', 
      budget = 50000, 
      targetAudience = 'Urban Shoppers & Footfall', 
      location = 'Connaught Place, New Delhi',
      cities = ['New Delhi'], 
      promoterCount = null,
      durationDays = 7,
      shiftHours = 5,
      startHour = 16,
      radiusKm = 2.5,
      selectedInterests = ['foodies', 'fitness']
    } = body;

    const primaryLocation = location || (cities[0] ? `${cities[0]} Central Hub` : 'Central Activation Node');

    // 1. Generate Unified Campaign Forecast via Ziggers Intelligence Engine
    const forecast = generateCampaignForecast({
      targetLocations: [primaryLocation],
      radiusKm: Number(radiusKm) || 2.5,
      ageMin: Number(body.ageMin) || 18,
      ageMax: Number(body.ageMax) || 35,
      gender: body.gender || 'All',
      selectedInterests,
      objective,
      promoterCount,
      shiftHours: Number(shiftHours) || 5,
      startHour: Number(startHour) || 16,
      campaignDays: Number(durationDays) || 7,
      budgetInr: Number(budget) || 50000,
      isGstInclusive: true
    });

    // 2. Rank candidate clusters dynamically
    const targetCity = cities[0] || primaryLocation.split(',')[1]?.trim() || 'Metro';
    const rankedCandidates = rankLocations({
      city: targetCity,
      objective,
      budgetInr: Number(budget) || 50000,
      campaignDays: Number(durationDays) || 7,
      shiftHours: Number(shiftHours) || 5
    });

    const recommendedLocations = rankedCandidates.slice(0, 5).map(r => r.locationName);

    // 3. Call Server-Side Gemini AI Planner
    const geminiResult = await callGeminiPlanner({
      objective,
      budget,
      targetAudience,
      location: primaryLocation,
      durationDays,
      shiftHours,
      forecastData: forecast
    });

    const plan = {
      planId: 'plan_' + (globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID().slice(0, 10) : Date.now().toString(36)),
      name: `${primaryLocation} ${objective} Strategy`,
      objective,
      budget: `₹${Number(budget).toLocaleString('en-IN')}`,
      targetAudience,
      location: primaryLocation,
      cities,
      headcount: forecast.capacity.promoterCount,
      supervisorCount: forecast.capacity.supervisorCount,
      durationDays: Number(durationDays) || 7,
      shiftHours: Number(shiftHours) || 5,
      operatingWindow: forecast.footfall.operatingWindow,
      peakHour: forecast.footfall.peakHour,
      
      // Explicitly Modelled Metrics with Provenance Metadata
      metrics: {
        totalSamplesProjected: forecast.forecast.samples,
        projectedInteractions: forecast.forecast.interactions,
        projectedReach: forecast.forecast.reach,
        projectedLeads: forecast.forecast.leads,
        projectedAppInstalls: forecast.forecast.appInstalls,
        projectedQrScans: forecast.forecast.qrScans,
        estimatedCostPerSample: forecast.forecast.cpsFormatted,
        estimatedCpl: forecast.forecast.cplFormatted,
        estimatedCac: forecast.forecast.cacFormatted,
        projectedRoi: forecast.forecast.projectedRoi
      },
      ranges: forecast.ranges,
      scores: forecast.scores,
      financials: forecast.financials,
      staffingStrategy: forecast.capacity.staffingStrategy,
      recommendedLocations,
      rankedLocationDetails: rankedCandidates.slice(0, 4),
      
      // Structured AI response
      aiStatus: geminiResult.status,
      aiPlan: geminiResult.status === 'SUCCESS' ? geminiResult.aiOutput : null,
      aiNotice: geminiResult.status !== 'SUCCESS' ? 'AI planning assistant is offline. Standard intelligence model forecast generated.' : null,

      auditParameters: [
        'Biometric check-in with GPS tolerance capped at 20m',
        'Physical sampling count verification with stock photos',
        'Phone OTP verification for customer leads',
        'HMAC-SHA256 tamper-evident proof chaining',
        'Merkle root external ledger anchoring'
      ],
      modelMetadata: forecast.modelMetadata
    };

    return NextResponse.json({
      success: true,
      plan
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
