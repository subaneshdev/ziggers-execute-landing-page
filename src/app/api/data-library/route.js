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

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'summary';
    const city = searchParams.get('city') || '';
    const state = searchParams.get('state') || '';

    switch (action) {
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
        return NextResponse.json({
          success: true,
          packageVersion: '1.0',
          totals,
          sources
        });
      }
    }
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    // Execute atomic safe package import
    const summary = importDataPackage();
    return NextResponse.json({
      success: true,
      message: 'External data package imported successfully',
      summary
    });
  } catch (err) {
    return NextResponse.json({
      success: false,
      error: `Data import failed: ${err.message}`
    }, { status: 500 });
  }
}
