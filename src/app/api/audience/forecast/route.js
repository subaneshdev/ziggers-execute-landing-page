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
        const promptText = `You are the Ziggers AI Offline Audience Intelligence Engine. Analyze the following offline campaign setup and provide intelligence recommendations and audience rationale:
Location: ${body.targetLocations?.[0] || 'T. Nagar'}
Radius: ${body.radiusKm || 3} KM
Age Range: ${body.ageMin || 18} - ${body.ageMax || 35} Years
Gender: ${body.gender || 'All'}
Objective: ${body.objective || 'Product Sampling'}
Interests: ${(body.selectedInterests || []).join(', ')}
Promoters: ${body.promoterCount || 10}
Budget: ₹${body.budgetInr || 35000}

Respond ONLY with valid JSON in this exact structure:
{
  "recommendations": [
    "string concise optimization recommendation 1",
    "string concise optimization recommendation 2",
    "string concise optimization recommendation 3"
  ],
  "audienceExplanation": [
    "string rationale point 1",
    "string rationale point 2",
    "string rationale point 3"
  ],
  "aiLocationInsight": "string concise location intelligence summary"
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

          if (Array.isArray(parsedAi.recommendations) && parsedAi.recommendations.length > 0) {
            baseForecast.recommendations = parsedAi.recommendations;
          }
          if (Array.isArray(parsedAi.audienceExplanation) && parsedAi.audienceExplanation.length > 0) {
            baseForecast.audienceExplanation = parsedAi.audienceExplanation;
          }
          if (parsedAi.aiLocationInsight) {
            baseForecast.aiLocationInsight = parsedAi.aiLocationInsight;
          }
          baseForecast.modelLabel = 'Powered by Ziggers Audience Engine + Google Gemini AI (Live)';
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
