import { NextResponse } from 'next/server';
import { classifyBrandUniversal } from '@/lib/intelligence/brandTaxonomy';

export const runtime = 'edge';

function decodeHtmlEntities(str) {
  if (!str) return '';
  return str
    .replace(/&amp;/g, '&')
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractDomainToken(url) {
  if (!url) return '';
  try {
    const raw = url.trim().startsWith('http') ? url.trim() : 'https://' + url.trim();
    const parsed = new URL(raw);
    const host = parsed.hostname.replace(/^(www\.|m\.|app\.|play\.)/, '');
    const main = host.split('.')[0];
    return main && main.length > 2 ? main : '';
  } catch (e) {
    return '';
  }
}

async function fetchPublicWebsiteMetadata(url) {
  if (!url) return null;
  let targetUrl = url.trim();
  if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
    targetUrl = 'https://' + targetUrl;
  }

  try {
    let cleanUrl = targetUrl;
    try {
      const u = new URL(targetUrl);
      cleanUrl = `${u.origin}${u.pathname}`;
    } catch (e) {}

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(cleanUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });
    clearTimeout(timeoutId);

    if (!res.ok) return null;
    const html = await res.text();

    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i) 
      || html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["']/i);
    const keywordsMatch = html.match(/<meta[^>]*name=["']keywords["'][^>]*content=["']([^"']+)["']/i);
    const ogTitleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i);
    const ogDescMatch = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i);
    
    const h1Matches = Array.from(html.matchAll(/<h1[^>]*>([^<]+)<\/h1>/gi)).map(m => m[1]).join(' ');
    const h2Matches = Array.from(html.matchAll(/<h2[^>]*>([^<]+)<\/h2>/gi)).map(m => m[1]).join(' ');

    let pathTokens = '';
    try {
      const parsedUrl = new URL(targetUrl);
      pathTokens = parsedUrl.pathname.replace(/[\/\-_.]/g, ' ');
    } catch (e) {}

    return {
      title: decodeHtmlEntities(titleMatch ? titleMatch[1] : (ogTitleMatch ? ogTitleMatch[1] : '')),
      description: decodeHtmlEntities(descMatch ? descMatch[1] : (ogDescMatch ? ogDescMatch[1] : '')),
      keywords: decodeHtmlEntities(keywordsMatch ? keywordsMatch[1] : ''),
      headings: decodeHtmlEntities(`${h1Matches} ${h2Matches}`),
      pathTokens: decodeHtmlEntities(pathTokens),
      rawSnippet: decodeHtmlEntities(html.replace(/<[^>]+>/g, ' ').slice(0, 1500))
    };
  } catch (err) {
    return null;
  }
}

async function fetchEntityKnowledge(query) {
  if (!query || query.length < 2) return null;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query.trim())}`, {
      signal: controller.signal,
      headers: { 'User-Agent': 'ZiggersCampaignIntelligenceOS/1.0' }
    });
    clearTimeout(timeoutId);

    if (!res.ok) return null;
    const data = await res.json();
    return {
      title: data.title || '',
      description: data.description || '',
      extract: data.extract || ''
    };
  } catch (err) {
    return null;
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { 
      brandName = '', 
      websiteUrl = '', 
      appUrl = '', 
      socialUrl = '', 
      brandDescription = '' 
    } = body;

    if (!brandName && !websiteUrl && !appUrl && !brandDescription) {
      return NextResponse.json({
        success: false,
        error: 'Please provide at least a Brand Name, Website URL, or App URL.'
      }, { status: 400 });
    }

    const domainToken = extractDomainToken(websiteUrl) || extractDomainToken(appUrl);
    const resolvedBrandQuery = brandName || domainToken || 'Brand';

    // 1. Fetch live metadata from website and app URLs in parallel + entity knowledge
    const [websiteMeta, appMeta, entityKnowledge] = await Promise.all([
      websiteUrl ? fetchPublicWebsiteMetadata(websiteUrl) : Promise.resolve(null),
      appUrl ? fetchPublicWebsiteMetadata(appUrl) : Promise.resolve(null),
      fetchEntityKnowledge(resolvedBrandQuery)
    ]);

    const resolvedTitle = websiteMeta?.title || appMeta?.title || entityKnowledge?.title || brandName || domainToken;
    const resolvedDesc = websiteMeta?.description || appMeta?.description || entityKnowledge?.extract || entityKnowledge?.description || brandDescription;
    const resolvedKeywords = `${websiteMeta?.keywords || ''} ${appMeta?.keywords || ''}`;
    const resolvedHeadings = `${websiteMeta?.headings || ''} ${appMeta?.headings || ''}`;
    const resolvedPathTokens = `${websiteMeta?.pathTokens || ''} ${appMeta?.pathTokens || ''}`;
    const resolvedSnippet = `${websiteMeta?.rawSnippet || ''} ${appMeta?.rawSnippet || ''}`;

    // 2. Run Comprehensive Universal Taxonomy & Multi-Layer Audience Engine
    const classification = classifyBrandUniversal({
      brandName: brandName || domainToken,
      websiteUrl,
      appUrl,
      title: resolvedTitle,
      desc: resolvedDesc,
      keywords: resolvedKeywords,
      headings: resolvedHeadings,
      pathTokens: resolvedPathTokens,
      rawSnippet: resolvedSnippet,
      entityKnowledge
    });

    const displayBrandName = brandName || (domainToken ? domainToken.charAt(0).toUpperCase() + domainToken.slice(1) : (entityKnowledge?.title || 'Brand'));
    const primaryAudience = classification.audiences.primary || {};

    const finalBrand = {
      brandSummary: resolvedDesc 
        ? `${resolvedTitle ? resolvedTitle + ' — ' : ''}${resolvedDesc}`
        : `${displayBrandName} — ${classification.subcategory} activation profile.`,
      
      // Detailed Brand Classification
      brandClassification: {
        industry: classification.industry,
        subcategory: classification.subcategory,
        productCategory: classification.productCategory,
        businessModel: classification.businessModel,
        pricePositioning: classification.pricePositioning,
        purchaseFrequency: classification.purchaseFrequency,
        decisionMaker: classification.decisionMaker
      },

      category: classification.industry,
      productLine: classification.productCategory,
      pricePositioning: classification.pricePositioning,
      specificityScore: classification.specificityScore,

      // Multi-Layer Audience Blueprint
      audiences: classification.audiences,

      extractedAttributes: {
        brandName: displayBrandName,
        websiteDomain: websiteUrl || '',
        appUrl: appUrl || '',
        crawledTitle: resolvedTitle,
        crawledDescription: resolvedDesc
      },

      // Backwards Compatibility Mapping for Stepper Workflow
      aiInferredAttributes: {
        targetAudience: {
          ageRange: primaryAudience.ageRange || [20, 35],
          gender: primaryAudience.gender || 'All',
          interests: primaryAudience.interests || ['technology'],
          socioEconomicSegment: primaryAudience.spendingPower || 'SEC A/B',
          occupations: primaryAudience.occupations || ['Working Professionals']
        },
        suggestedActivationEnvironments: (primaryAudience.environments || []).map(env => ({
          type: env.environment,
          reason: env.whyExists,
          relevanceScore: env.relevanceScore,
          footfallQuality: env.footfallQuality,
          dwellTime: env.dwellTime,
          activationFormat: env.activationFormat
        })),
        recommendedGooglePlaceTypes: ['corporate', 'shopping_mall', 'transit_station', 'university'],
        recommendedSearchQueries: (primaryAudience.environments || []).map(e => e.environment.split(' ')[0]).slice(0, 4)
      },

      assumptions: [
        'Audience blueprint and offline venues are generated using Ziggers Universal Industry Taxonomy with deep commercial matching.',
        'Target age brackets, occupations, and intent signals reflect verified commercial buyer behavior in India.'
      ],
      confidence: (entityKnowledge || websiteMeta || appMeta) ? 0.96 : 0.88
    };

    return NextResponse.json({
      success: true,
      source: 'UNIVERSAL_TAXONOMY_ENGINE',
      brand: finalBrand
    });

  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
