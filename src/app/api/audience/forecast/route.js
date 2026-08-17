import { NextResponse } from 'next/server';
import { calculateAudiencePrediction } from '@/lib/audienceEngine';

export const runtime = 'edge';

export async function POST(request) {
  try {
    const body = await request.json();
    const baseForecast = calculateAudiencePrediction(body);

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const targetCity = body.targetLocations?.[0] || 'T. Nagar & Ranganathan Street';
        const promptText = `You are the Ziggers AI Offline Audience Intelligence Engine for India. Analyze the following campaign targeting setup for the Indian city/node "${targetCity}" and generate hyper-local demographic, POI, and economic affluence intelligence:

Campaign Parameters:
- Location / Node: ${targetCity}
- Radius: ${body.radiusKm || 3} KM
- Target Age: ${body.ageMin || 18} to ${body.ageMax || 35} Years
- Gender: ${body.gender || 'All'}
- Objective: ${body.objective || 'Product Sampling'}
- Interests: ${(body.selectedInterests || []).join(', ')}
- Promoters: ${body.promoterCount || 10} Ziggers
- Budget: ₹${body.budgetInr || 35000} INR

Respond ONLY with valid JSON matching this exact structure:
{
  "affluenceScore": 85,
  "mpceIncomeEstimate": "₹82,000 / mo",
  "recommendations": [
    "string specific campaign optimization suggestion 1",
    "string specific campaign optimization suggestion 2",
    "string specific campaign optimization suggestion 3"
  ],
  "audienceExplanation": [
    "string rationale point 1",
    "string rationale point 2",
    "string rationale point 3"
  ],
  "aiLocationInsight": "string concise location intelligence summary for this city"
}`;

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{
                parts: [{ text: promptText }]
              }]
            })
          }
        );

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '';
          const cleanedJson = rawText.replace(/```json|```/g, '').trim();
          const parsedAi = JSON.parse(cleanedJson);

          if (parsedAi.affluenceScore && typeof parsedAi.affluenceScore === 'number') {
            baseForecast.affluenceScore = parsedAi.affluenceScore;
          }
          if (parsedAi.mpceIncomeEstimate) {
            baseForecast.mpceIncomeEstimate = parsedAi.mpceIncomeEstimate;
          }
          if (Array.isArray(parsedAi.recommendations) && parsedAi.recommendations.length > 0) {
            baseForecast.recommendations = parsedAi.recommendations;
          }
          if (Array.isArray(parsedAi.audienceExplanation) && parsedAi.audienceExplanation.length > 0) {
            baseForecast.audienceExplanation = parsedAi.audienceExplanation;
          }
          if (parsedAi.aiLocationInsight) {
            baseForecast.aiLocationInsight = parsedAi.aiLocationInsight;
          }
          baseForecast.modelLabel = `Powered by Ziggers Audience Engine + Google Gemini AI (${targetCity})`;
        }
      } catch (geminiErr) {
        console.warn('Gemini API notice: using calibrated baseline:', geminiErr.message);
      }
    }

    return NextResponse.json({
      success: true,
      forecast: baseForecast
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
