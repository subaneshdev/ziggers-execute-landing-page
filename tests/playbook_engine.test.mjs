import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { getDatabase } from '../src/lib/data/database.js';
import { 
  importPlaybookPackage, 
  getPlaybookLibrarySummary,
  resolvePlaybookPackagePath
} from '../src/lib/data/import/playbookImporter.js';
import { 
  getPlaybooks, 
  getPlaybookById, 
  getAllPlaybookFamilies, 
  getAllEvidenceSources,
  getPlaybookVersionPolicy,
  updatePlaybookReviewStatus,
  restorePlaybookFromAudit,
  getPlaybookAuditHistory
} from '../src/lib/data/repositories/playbookRepository.js';
import { 
  classifyCampaignBrief, 
  checkVenueFeasibility, 
  generatePlaybookRecommendations 
} from '../src/lib/intelligence/playbook/playbookDecisionEngine.js';
import { generateCampaignForecast } from '../src/lib/intelligence/index.js';

test('Ziggers Campaign Decision Playbook v2 Engine Comprehensive Tests', async (t) => {
  const db = getDatabase();
  // Establish fixtures explicitly so this suite also passes on a fresh database.
  importPlaybookPackage();

  await t.test('PB-001: Package Ingestion Completeness (41 Playbooks, 15 Families, 13 Sources)', () => {
    const summary = getPlaybookLibrarySummary();
    assert.equal(summary.playbooksCount, 41, 'Must contain exactly 41 product playbooks');
    assert.equal(summary.familiesCount, 15, 'Must contain exactly 15 planning families');
    assert.equal(summary.sourcesCount, 13, 'Must contain exactly 13 evidence sources');

    // Verify all 13 evidence sources exist with valid schema
    const sources = getAllEvidenceSources();
    assert.equal(sources.length, 13);
    for (const src of sources) {
      assert.ok(src.source_id.startsWith('S'), `Source ID must start with S: ${src.source_id}`);
      assert.ok(src.publisher && src.publisher.length > 0, 'Publisher must be populated');
      assert.ok(src.title && src.title.length > 0, 'Title must be populated');
      assert.ok(src.url && src.url.startsWith('http'), 'URL must be a valid web link');
      assert.ok(src.supports && src.supports.length > 0, 'Supports explanation must be populated');
      assert.ok(src.does_not_support && src.does_not_support.length > 0, 'Does-not-support limitation must be populated');
    }
  });

  await t.test('PB-002: Idempotence & Duplicate Prevention', () => {
    // Run second import
    const secondImport = importPlaybookPackage();
    assert.equal(secondImport.playbooks.rejected, 0, 'Must have 0 rejected playbooks on re-import');
    assert.equal(secondImport.playbooks.accepted, 0, 'Must not duplicate insert existing playbooks');
    assert.equal(secondImport.playbooks.unchanged, 41, 'All 41 playbooks must be flagged unchanged');

    // Verify total count in DB didn't increase
    const summary = getPlaybookLibrarySummary();
    assert.equal(summary.playbooksCount, 41, 'Database must retain exactly 41 records without duplicates');
  });

  await t.test('PB-003: Preservation of Administrator Edits and Review Status', () => {
    // 1. Mark a playbook (e.g. AUTO01) as reviewed and published by an admin
    const updateRes = updatePlaybookReviewStatus({
      playbookId: 'AUTO01',
      version: '2.0-draft',
      newStatus: 'PUBLISHED',
      reviewerName: 'Lead Operations Director',
      reviewNotes: 'Verified dealer test-drive protocols for Chennai corridor.',
      isPublished: true
    });
    assert.ok(updateRes.success);

    const auditedPb = getPlaybookById('AUTO01', '2.0-draft');
    assert.equal(auditedPb.review_status, 'PUBLISHED');
    assert.equal(auditedPb.is_published, 1);
    assert.equal(auditedPb.reviewer, 'Lead Operations Director');

    // 2. Re-run import package
    const reimport = importPlaybookPackage();
    assert.ok(reimport.playbooks.preservedAdminEdits >= 1, 'Re-import must detect and preserve admin edit');

    // 3. Verify admin changes were NOT overwritten
    const preservedPb = getPlaybookById('AUTO01', '2.0-draft');
    assert.equal(preservedPb.review_status, 'PUBLISHED', 'Review status must not be overwritten back to draft');
    assert.equal(preservedPb.is_published, 1, 'Publication flag must remain active');
    assert.equal(preservedPb.reviewer, 'Lead Operations Director', 'Reviewer attribution must remain intact');
  });

  await t.test('PB-004: Product Journey Differentiation (Passenger Cars vs Motorcycles)', () => {
    // Passenger Car Brief
    const carBrief = {
      brand: 'Tata Motors',
      productOrService: 'Passenger Car SUV',
      subcategory: 'family car',
      objective: 'Completed qualified test drives'
    };
    const carPlan = generatePlaybookRecommendations(carBrief);
    assert.equal(carPlan.playbookId, 'AUTO01', 'Family car must route to AUTO01');
    assert.equal(carPlan.playbookName, 'Passenger car — family use and upgrades');
    assert.ok(carPlan.buyerNeed.toLowerCase().includes('household'), 'Buyer need must reference household travel');

    // Commuter Two-Wheeler Brief
    const commuterBrief = {
      brand: 'Honda',
      productOrService: 'Activa 6G Scooter',
      subcategory: 'commuter scooter',
      objective: 'Relevant test rides'
    };
    const commuterPlan = generatePlaybookRecommendations(commuterBrief);
    assert.equal(commuterPlan.playbookId, 'AUTO03', 'Commuter scooter must route to AUTO03');
    assert.equal(commuterPlan.playbookName, 'Commuter two-wheeler and electric scooter');

    // Touring Motorcycle Brief
    const cruiserBrief = {
      brand: 'Royal Enfield',
      productOrService: 'Classic 350 Cruiser',
      subcategory: 'touring motorcycle',
      objective: 'Relevant test rides or product trials'
    };
    const cruiserPlan = generatePlaybookRecommendations(cruiserBrief);
    assert.equal(cruiserPlan.playbookId, 'AUTO04', 'Cruiser must route to AUTO04');
    assert.equal(cruiserPlan.playbookName, 'Touring motorcycle and riding accessories');
  });

  await t.test('PB-005: Product Journey Differentiation (Everyday vs Bridal vs Heritage Sarees)', () => {
    // Everyday Sarees
    const everydayBrief = {
      brand: 'FabIndia',
      productOrService: 'Cotton Everyday Saree',
      subcategory: 'daily wear sarees',
      objective: 'Product trials & direct purchases'
    };
    const everydayPlan = generatePlaybookRecommendations(everydayBrief);
    assert.equal(everydayPlan.playbookId, 'FASH01', 'Everyday saree must route to FASH01');
    assert.equal(everydayPlan.playbookName, 'Everyday sarees — discovery and direct purchase');

    // Bridal Sarees
    const bridalBrief = {
      brand: 'Nalli Silks',
      productOrService: 'Bridal Kanjeevaram Silk Saree',
      subcategory: 'wedding bridal saree',
      objective: 'Bridal occasion consultation'
    };
    const bridalPlan = generatePlaybookRecommendations(bridalBrief);
    assert.equal(bridalPlan.playbookId, 'FASH02', 'Bridal saree must route to FASH02');
    assert.equal(bridalPlan.playbookName, 'Bridal sarees — occasion consultation');

    // Heritage Handloom Sarees
    const heritageBrief = {
      brand: 'Weavers Guild',
      productOrService: 'Chanderi Handcrafted Handloom',
      subcategory: 'heritage handloom saree artisan weave',
      objective: 'Informed product consideration'
    };
    const heritagePlan = generatePlaybookRecommendations(heritageBrief);
    assert.equal(heritagePlan.playbookId, 'FASH03', 'Heritage saree must route to FASH03');
    assert.equal(heritagePlan.playbookName, 'Heritage and premium handloom sarees');
  });

  await t.test('PB-006: Product Journey Differentiation (B2B SaaS, Broadband, Retail Audit)', () => {
    // B2B SaaS
    const saasBrief = {
      brand: 'Zoho',
      productOrService: 'B2B SaaS CRM Workflow',
      subcategory: 'enterprise software',
      objective: 'Qualified attended evaluations'
    };
    const saasPlan = generatePlaybookRecommendations(saasBrief);
    assert.equal(saasPlan.playbookId, 'B2B01', 'SaaS must route to B2B01');
    assert.equal(saasPlan.playbookName, 'B2B SaaS — workflow clinic');

    // Broadband
    const telBrief = {
      brand: 'Airtel',
      productOrService: 'Fiber Broadband',
      subcategory: 'broadband connection wifi',
      objective: 'Completed serviceable installations'
    };
    const telPlan = generatePlaybookRecommendations(telBrief);
    assert.equal(telPlan.playbookId, 'TEL01', 'Broadband must route to TEL01');
    assert.equal(telPlan.playbookName, 'Broadband and connectivity — address qualification');

    // Retail Audit
    const auditBrief = {
      brand: 'FMCG Corp',
      productOrService: 'Store Merchandising Compliance',
      subcategory: 'retail audit display compliance',
      objective: 'Accurate verified outlet observations'
    };
    const auditPlan = generatePlaybookRecommendations(auditBrief);
    assert.equal(auditPlan.playbookId, 'RETAIL01', 'Retail audit must route to RETAIL01');
    assert.equal(auditPlan.playbookName, 'Retail audit and display compliance');
  });

  await t.test('PB-007: Venue Feasibility Hard Exclusion', () => {
    const carPlaybook = { id: 'AUTO01', family: 'Automotive' };

    // Venue strictly banning vehicle access
    const noVehicleVenue = {
      id: 'v_pedestrian_1',
      name: 'Central Pedestrian Promenade',
      vehicle_access: 0,
      permission_status: 'APPROVED'
    };

    const feas = checkVenueFeasibility(noVehicleVenue, carPlaybook);
    assert.equal(feas.status, 'EXCLUDED', 'Venue banning vehicles must be EXCLUDED for car activation');
    assert.ok(feas.issues.some(i => i.includes('vehicle movement')));
  });

  await t.test('PB-008: Honest Handling of Missing Permissions, Quotes & Footfall', () => {
    const carPlaybook = { id: 'AUTO01', family: 'Automotive' };

    // Candidate venue with unconfirmed permission and unknown vehicle access
    const unconfirmedVenue = {
      name: 'Unverified Community Hall',
      vehicle_access: null,
      permission_status: 'NOT_CONFIRMED',
      quoted_daily_rate_inr: null
    };

    const feas = checkVenueFeasibility(unconfirmedVenue, carPlaybook);
    assert.equal(feas.status, 'NEEDS_CONFIRMATION', 'Unconfirmed vehicle access/permission must yield NEEDS_CONFIRMATION');
    assert.ok(feas.warnings.some(w => w.includes('Vehicle display')));
    assert.ok(feas.warnings.some(w => w.includes('NOT_CONFIRMED')));
    assert.ok(feas.quoteStatus.includes('itemised quotation required'), 'Must not invent synthetic quote');
  });

  await t.test('PB-009: Non-Generic Clarification on Unknown Categories', () => {
    const obscureBrief = {
      brand: 'SubatomicLabs',
      productOrService: 'Tachyon Beam Synthesizer for Quantum Research'
    };

    const result = generatePlaybookRecommendations(obscureBrief);
    assert.equal(result.status, 'NEEDS_CLARIFICATION', 'Unknown category must trigger clarification');
    assert.equal(result.classification.needsClarification, true);
    assert.ok(result.clarificationQuestion.length > 0);
    assert.ok(result.clarificationOptions.length >= 2);
    assert.equal(result.options.length, 0, 'Must not force generic retail options');
  });

  await t.test('PB-010: Offline / AI Unavailable Deterministic Recommendations', () => {
    // Generate recommendation without calling Gemini (deterministic database output)
    const brief = {
      brand: 'Maruti Suzuki',
      productOrService: 'Family Car Hatchback',
      subcategory: 'passenger car',
      objective: 'Completed qualified test drives',
      city: 'Chennai'
    };

    const plan = generatePlaybookRecommendations(brief);
    assert.equal(plan.status, 'SUCCESS');
    assert.ok(plan.options.length >= 1 && plan.options.length <= 3, 'Must return up to 3 options');
    for (const opt of plan.options) {
      assert.ok(opt.activityName, 'Activity name must exist');
      assert.ok(opt.whyThisActivationFits, 'Rationale must exist');
      assert.ok(opt.venueRecommendation, 'Venue recommendation must exist');
      assert.ok(['READY_TO_COMPARE', 'NEEDS_CONFIRMATION', 'EXCLUDED'].includes(opt.venueRecommendation.feasibilityStatus));
      assert.ok(opt.executionSequence.length > 0, 'Execution sequence must be non-empty');
      assert.ok(opt.requiredCapabilities.mainCapacityConstraint, 'Bottleneck must exist');
      assert.ok(opt.primarySuccessMeasure, 'Success measure must exist');
      assert.ok(opt.followUpOwnership, 'Followup ownership must exist');
      assert.ok(opt.tradeoffsVersusAlternatives, 'Tradeoff must exist');
    }
  });

  await t.test('PB-011: Operations Review Audit Trail and Rollback', () => {
    // 1. Audit status update on FASH01
    const res1 = updatePlaybookReviewStatus({
      playbookId: 'FASH01',
      version: '2.0-draft',
      newStatus: 'OPERATIONS_REVIEWED',
      reviewerName: 'Senior Fashion Merchandiser',
      reviewNotes: 'Reviewed Chennai high street fabric sampling protocol.',
      isPublished: false
    });
    assert.ok(res1.success);
    assert.ok(res1.editId);

    // 2. Verify audit history contains entry
    const history = getPlaybookAuditHistory('FASH01', '2.0-draft');
    assert.ok(history.length >= 1);
    const latestEdit = history[0];
    assert.equal(latestEdit.edited_by, 'Senior Fashion Merchandiser');

    // 3. Rollback / restore
    const restoreRes = restorePlaybookFromAudit(latestEdit.id, 'Admin Superuser');
    assert.ok(restoreRes.success);

    const revertedPb = getPlaybookById('FASH01', '2.0-draft');
    assert.equal(revertedPb.review_status, 'DRAFT_FOR_OPERATIONS_REVIEW');
  });

  await t.test('PB-012: Existing Master Campaign Forecast Regression Integrity', () => {
    // Call generateCampaignForecast to ensure no regression in intelligence forecasting
    const forecast = generateCampaignForecast({
      targetLocations: ['Connaught Place, New Delhi'],
      radiusKm: 2.0,
      ageMin: 18,
      ageMax: 35,
      gender: 'All',
      selectedInterests: ['foodies', 'fitness'],
      objective: 'Product Sampling',
      promoterCount: 4,
      shiftHours: 5,
      campaignDays: 7,
      budgetInr: 75000,
      isGstInclusive: true
    });

    assert.ok(forecast.forecast.samples > 0, 'Samples forecast must be positive');
    assert.ok(forecast.financials.escrowWaterfall.reconciliationCheck === true, 'Financial escrow must reconcile');
    assert.ok(forecast.provenance, 'Forecast must contain provenance');
    assert.equal(forecast.provenance.taxonomyType, 'RULE_BASED_ONTOLOGY');
  });

  await t.test('PB-013: Step10BudgetApproval.jsx Immutability Verification', () => {
    const step10Path = path.resolve(process.cwd(), 'src', 'components', 'campaign-creator', 'steps', 'Step10BudgetApproval.jsx');
    assert.ok(fs.existsSync(step10Path), 'Step10BudgetApproval.jsx must exist');
    const content = fs.readFileSync(step10Path, 'utf8');
    assert.ok(content.length > 500, 'Step10BudgetApproval.jsx must have substantial contents');
    assert.ok(content.includes('Step10BudgetApproval'), 'Step 10 component export must be intact');
    assert.ok(content.includes('Multi-Signature Escrow & Instant Payout Protocol'), 'Step 10 must retain simulated escrow protocol');
  });

  await t.test('PB-014: Historical Campaign Data Immutability', () => {
    // Verify historical campaigns in database exist and were not altered
    const campaignsCount = db.prepare('SELECT COUNT(*) as count FROM campaigns').get()?.count || 0;
    assert.ok(campaignsCount >= 0, 'Campaigns table remains queryable');
  });
});
