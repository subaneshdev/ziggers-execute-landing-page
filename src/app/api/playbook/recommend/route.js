import { NextResponse } from 'next/server';
import { generatePlaybookRecommendations } from '../../../../lib/intelligence/playbook/playbookDecisionEngine.js';

/**
 * Call Gemini 1.5 to explain and contextualize retrieved playbook recommendations
 * strictly grounded in the database records.
 */
async function callGeminiPlaybookExplainer({ brief, playbookRecommendation }) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return {
      status: 'AI_UNAVAILABLE',
      reason: 'GEMINI_API_KEY is not configured. Falling back to deterministic template recommendation.'
    };
  }

  const prompt = `You are the lead Operations Strategist for Ziggers Execute.
Review the following retrieved database playbook and campaign brief facts.
Ground your response STRICTLY in the supplied playbook facts.
DO NOT invent conversion benchmarks, synthetic footfall numbers, ROI percentages, or unconfirmed partner verification.
Distinguish clearly between:
- Published practices (external business examples)
- Authored planning hypotheses (awaiting campaign trial)
- Venue-confirmed facts (actual capabilities)
- Measured campaign outcomes

Campaign Brief:
- Brand: ${brief.brand || 'Unspecified'}
- Product / Service: ${brief.productOrService || brief.subcategory || 'General'}
- Objective: ${brief.objective || 'Product sampling / trial'}
- City: ${brief.city || 'Metro'}
- Budget: ₹${brief.budgetInr || brief.budget || 50000}

Retrieved Database Playbook (${playbookRecommendation.playbookId}):
- Name: ${playbookRecommendation.playbookName}
- Family: ${playbookRecommendation.family}
- Stated Buyer Need: ${playbookRecommendation.buyerNeed}
- Primary Objective: ${playbookRecommendation.objective}
- Bottleneck / Capacity Constraint: ${playbookRecommendation.bottleneck}
- Follow-up Responsibility: ${playbookRecommendation.followup}
- Avoid Rules: ${JSON.stringify(playbookRecommendation.avoidRules || [])}
- Questions That Change The Plan: ${JSON.stringify(playbookRecommendation.questionsThatChangeThePlan || [])}
- Evidence Basis: ${playbookRecommendation.evidencePolicy || 'Authored planning hypothesis for operations review'}

Respond ONLY with a valid JSON object matching this schema:
{
  "strategicOverview": "2-3 sentences explaining why this specific playbook fits the product journey and stated buyer need",
  "operationalGuardrails": ["Rule 1 from avoid list", "Rule 2 on capacity or permissions"],
  "recommendedVariantFocus": "Guidance on choosing between core trial, appointment desk, or immersive zone",
  "criticalMissingChecks": ["Fact 1 that needs confirmation before launch", "Fact 2 on quotes or permissions"],
  "followUpHandoverAdvice": "How the follow-up owner should track verified outcomes vs raw leads"
}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      signal: controller.signal,
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
        reason: `Gemini returned HTTP ${res.status}`
      };
    }

    const data = await res.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) {
      return { status: 'AI_UNAVAILABLE', reason: 'Empty candidate from Gemini' };
    }

    const parsed = JSON.parse(rawText);
    return {
      status: 'SUCCESS',
      aiExplanation: parsed
    };
  } catch (err) {
    return {
      status: err.name === 'AbortError' ? 'AI_TIMEOUT' : 'AI_UNAVAILABLE',
      reason: err.name === 'AbortError' ? 'Gemini AI request timed out after 8s.' : err.message
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function POST(request) {
  try {
    const brief = await request.json();

    // 1. Generate deterministic database-backed recommendations
    let recommendations = generatePlaybookRecommendations(brief);

    // 2. If clarification is triggered, auto-resolve dynamically using the brief's product, brand, or industry
    if (recommendations.status === 'NEEDS_CLARIFICATION') {
      const fallbackTerm = brief.productOrService || brief.subcategory || brief.brandProductLine || brief.brandIndustry || 'Product Experience';
      recommendations = generatePlaybookRecommendations({
        ...brief,
        productOrService: fallbackTerm,
        subcategory: brief.subcategory || fallbackTerm
      });

      // If still unresolved, default to general apparel/retail trial rather than packaged snacks
      if (recommendations.status === 'NEEDS_CLARIFICATION') {
        recommendations = generatePlaybookRecommendations({
          ...brief,
          productOrService: fallbackTerm,
          subcategory: 'apparel'
        });
      }
    }

    // 3. Optional contextualization via Gemini
    let aiResult = { status: 'SKIPPED' };
    if (brief.useAi !== false) {
      aiResult = await callGeminiPlaybookExplainer({
        brief,
        playbookRecommendation: recommendations
      });
    }

    return NextResponse.json({
      success: true,
      ...recommendations,
      aiStatus: aiResult.status,
      aiExplanation: aiResult.status === 'SUCCESS' ? aiResult.aiExplanation : null,
      aiNotice: aiResult.status !== 'SUCCESS' ? 'Deterministic template recommendation active (AI unavailable or skipped).' : null
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
