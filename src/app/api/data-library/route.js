import { NextResponse } from 'next/server';
import { 
  getAllDataSources, 
  getImportBatches, 
  getMarketContextForStateOrCity, 
  getTransitContextForCity, 
  getVenuesByLocation,
  getComprehensiveEvidenceContext
} from '../../../lib/data/repositories/dataLibraryRepository.js';
import { importDataPackage, getImportedDataSummary } from '../../../lib/data/import/dataPackageImporter.js';
import { 
  getPlaybooks, 
  getPlaybookById, 
  getAllPlaybookFamilies, 
  getAllEvidenceSources,
  getPlaybookVersionPolicy,
  updatePlaybookReviewStatus,
  restorePlaybookFromAudit,
  getPlaybookAuditHistory
} from '../../../lib/data/repositories/playbookRepository.js';
import { 
  importPlaybookPackage, 
  getPlaybookLibrarySummary 
} from '../../../lib/data/import/playbookImporter.js';
import { generatePlaybookRecommendations } from '../../../lib/intelligence/playbook/playbookDecisionEngine.js';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'summary';
    const city = searchParams.get('city') || '';
    const state = searchParams.get('state') || '';
    const family = searchParams.get('family') || '';
    const reviewStatus = searchParams.get('reviewStatus') || '';
    const search = searchParams.get('search') || '';
    const id = searchParams.get('id') || '';

    switch (action) {
      // --- Playbook Decision Layer Actions ---
      case 'playbooks': {
        const playbooks = getPlaybooks({ family, reviewStatus, search });
        return NextResponse.json({ success: true, count: playbooks.length, playbooks });
      }

      case 'playbook_detail': {
        if (!id) return NextResponse.json({ success: false, error: 'Playbook ID is required' }, { status: 400 });
        const playbook = getPlaybookById(id);
        if (!playbook) return NextResponse.json({ success: false, error: 'Playbook not found' }, { status: 404 });
        return NextResponse.json({ success: true, playbook });
      }

      case 'playbook_families': {
        const families = getAllPlaybookFamilies();
        return NextResponse.json({ success: true, count: families.length, families });
      }

      case 'playbook_sources': {
        const sources = getAllEvidenceSources();
        return NextResponse.json({ success: true, count: sources.length, sources });
      }

      case 'playbook_summary': {
        const summary = getPlaybookLibrarySummary();
        const policy = getPlaybookVersionPolicy();
        return NextResponse.json({ success: true, summary, policy });
      }

      case 'playbook_history': {
        if (!id) return NextResponse.json({ success: false, error: 'Playbook ID is required' }, { status: 400 });
        const history = getPlaybookAuditHistory(id);
        return NextResponse.json({ success: true, count: history.length, history });
      }

      case 'playbook_preview': {
        const sampleBrief = {
          brand: searchParams.get('brand') || 'Sample Brand',
          productOrService: searchParams.get('product') || 'Family Car',
          subcategory: searchParams.get('subcategory') || '',
          objective: searchParams.get('objective') || 'Completed qualified test drives',
          city: city || 'Chennai'
        };
        const rec = generatePlaybookRecommendations(sampleBrief);
        return NextResponse.json({ success: true, recommendation: rec });
      }

      // --- Existing External Data Library Actions ---
      case 'sources': {
        const sources = getAllDataSources();
        return NextResponse.json({ success: true, count: sources.length, sources });
      }

      case 'batches': {
        const batches = getImportBatches();
        return NextResponse.json({ success: true, count: batches.length, batches });
      }

      case 'market': {
        const market = getMarketContextForStateOrCity(state || city);
        return NextResponse.json({ success: true, marketContext: market });
      }

      case 'transit': {
        const transit = getTransitContextForCity(city);
        return NextResponse.json({ success: true, transitContext: transit });
      }

      case 'venues': {
        const venues = getVenuesByLocation(city || state);
        return NextResponse.json({ success: true, count: venues.length, venues });
      }

      case 'evidence': {
        const evidence = getComprehensiveEvidenceContext({ city, state });
        return NextResponse.json({ success: true, evidence });
      }

      case 'summary':
      default: {
        const totals = getImportedDataSummary();
        const sources = getAllDataSources();
        const playbookSummary = getPlaybookLibrarySummary();
        return NextResponse.json({
          success: true,
          packageVersion: '1.0',
          totals,
          sources,
          playbookSummary
        });
      }
    }
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const action = body.action || 'import_data_package';

    if (action === 'import_playbooks') {
      const summary = importPlaybookPackage();
      return NextResponse.json({
        success: true,
        message: 'Campaign Decision Playbook v2 imported successfully',
        summary
      });
    }

    if (action === 'update_playbook_status') {
      const { playbookId, version, newStatus, reviewerName, reviewNotes, isPublished } = body;
      if (!playbookId || !newStatus || !reviewerName) {
        return NextResponse.json({
          success: false,
          error: 'playbookId, newStatus, and reviewerName are required'
        }, { status: 400 });
      }

      const result = updatePlaybookReviewStatus({
        playbookId,
        version: version || '2.0-draft',
        newStatus,
        reviewerName,
        reviewNotes: reviewNotes || '',
        isPublished: !!isPublished
      });

      return NextResponse.json({ success: true, result });
    }

    if (action === 'restore_playbook') {
      const { editId, restoredBy } = body;
      if (!editId || !restoredBy) {
        return NextResponse.json({ success: false, error: 'editId and restoredBy are required' }, { status: 400 });
      }
      const result = restorePlaybookFromAudit(editId, restoredBy);
      return NextResponse.json({ success: true, result });
    }

    // Default: import external data package
    const summary = importDataPackage();
    return NextResponse.json({
      success: true,
      message: 'External data package imported successfully',
      summary
    });
  } catch (err) {
    return NextResponse.json({
      success: false,
      error: `Operation failed: ${err.message}`
    }, { status: 500 });
  }
}
