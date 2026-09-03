/**
 * Ziggers Multi-Sided Marketplace & Physical Execution Engine Test Suite
 * 
 * Tests:
 * 1. Requirements Generation & Provenance Tagging
 * 2. Vendor Matching & RFQ Lifecycle
 * 3. Work Order Generation & Milestone Schedules
 * 4. Logistics & Inventory Reconciliation
 * 5. Manpower Rostering & Morning No-Show Backup Activation
 * 6. Campaign Execution Readiness Blocker Engine
 * 7. Multi-Party Campaign Funds Allocation & TDS Accounting
 */

import { generateCampaignRequirements, updateRequirementItem, PROVENANCE_STATES } from '../src/lib/marketplace/requirementsEngine.js';
import { matchVendorsForRfq, createRfqFromRequirement, compareVendorQuotes, RFQ_STATUSES } from '../src/lib/marketplace/rfqEngine.js';
import { issueWorkOrder, getCampaignExecutionBoard, WORK_ORDER_STATUSES, MILESTONE_TRIGGERS } from '../src/lib/marketplace/workOrderEngine.js';
import { createMaterialShipment, reconcileShipmentDelivery, SHIPMENT_STATUSES } from '../src/lib/marketplace/logisticsEngine.js';
import { matchWorkersForShift, createShiftRoster, handleNoShowAndActivateBackup, STAFFING_TIERS, CHECKIN_STATUSES } from '../src/lib/marketplace/manpowerEngine.js';
import { evaluateCampaignReadiness, READINESS_STATUSES } from '../src/lib/marketplace/readinessEngine.js';
import { calculateCampaignFundAllocation, calculateVendorTdsEstimate, TDS_COMPLIANCE_STATUSES } from '../src/lib/marketplace/settlementEngine.js';

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    throw new Error(message);
  }
  passedTests++;
  console.log(`✅ PASSED: ${message}`);
}

async function runMarketplaceTests() {
  console.log('\n===================================================================');
  console.log('🧪 RUNNING ZIGGERS PHYSICAL EXECUTION MARKETPLACE TEST SUITE');
  console.log('===================================================================\n');

  // Test 1: Requirements Generation & Provenance
  console.log('--- 1. Campaign Requirements Engine ---');
  const reqs = generateCampaignRequirements({
    campaignId: 'camp_chennai_sampling_1',
    objective: 'Product Sampling',
    location: 'Chennai',
    venueType: 'MALL',
    campaignDays: 5,
    promoterCount: 10,
    supervisorCount: 1,
    expectedSamples: 10000
  });

  assert(reqs.totalItems >= 5, 'Generates comprehensive physical requirement items');
  assert(reqs.itemsByCategory.MANPOWER.length >= 2, 'Generates both promoter and supervisor manpower requirements');
  assert(reqs.items.every(i => i.provenance !== undefined), 'Every requirement item carries explicit provenance');
  assert(reqs.items.some(i => i.provenance === PROVENANCE_STATES.AI_SUGGESTED), 'Contains AI_SUGGESTED requirements');

  const updatedReqs = updateRequirementItem(reqs, reqs.items[0].id, { quantity: 60 });
  assert(updatedReqs.items[0].quantity === 60 && updatedReqs.items[0].provenance === PROVENANCE_STATES.USER_CONFIRMED, 'User edits update quantity and re-tag provenance as USER_CONFIRMED');

  // Test 2: Vendor Matching & RFQ Creation
  console.log('\n--- 2. Vendor Matching & RFQ Engine ---');
  const testVendors = [
    {
      id: 'v1',
      legalBusinessName: 'Apex Print & Media',
      kycStatus: 'VERIFIED',
      categories: ['COLLATERAL', 'PRINTING'],
      serviceableCities: ['Chennai']
    },
    {
      id: 'v2',
      legalBusinessName: 'Bangalore Fabricators',
      kycStatus: 'VERIFIED',
      categories: ['COLLATERAL', 'FABRICATION'],
      serviceableCities: ['Bangalore']
    },
    {
      id: 'v3',
      legalBusinessName: 'Unverified Staffing Agency',
      kycStatus: 'DRAFT',
      categories: ['MANPOWER'],
      serviceableCities: ['Chennai']
    }
  ];

  const matched = matchVendorsForRfq({ category: 'COLLATERAL', deliveryCity: 'Chennai' }, testVendors);
  assert(matched.length === 1 && matched[0].id === 'v1', 'Matches only verified vendors servicing the target city and category');

  const rfq = createRfqFromRequirement(reqs.items[0], { campaignId: 'camp_1', city: 'Chennai', venue: 'Phoenix Mall' });
  assert(rfq.status === RFQ_STATUSES.OPEN, 'Creates open RFQ with submission deadline');

  const noQuotesComp = compareVendorQuotes([]);
  assert(noQuotesComp.status === 'INSUFFICIENT_MARKET_DATA', 'Returns INSUFFICIENT_MARKET_DATA when no quotes exist');

  const sampleQuotes = [
    { id: 'q1', vendorName: 'Apex', totalAmountInr: 50000, turnaroundDays: 3 },
    { id: 'q2', vendorName: 'Prime', totalAmountInr: 45000, turnaroundDays: 2 }
  ];
  const quoteComp = compareVendorQuotes(sampleQuotes);
  assert(quoteComp.status === 'QUOTES_AVAILABLE' && quoteComp.lowestQuote.totalAmountInr === 45000, 'Identifies lowest valid quote accurately');

  // Test 3: Work Order & Milestone Schedules
  console.log('\n--- 3. Work Order Management & Milestones ---');
  const acceptedQuote = {
    id: 'q_acc_1',
    campaignId: 'camp_1',
    vendorId: 'v1',
    vendorName: 'Apex Print & Media',
    category: 'PRINTING',
    specification: '5000 vinyl standees and flyers',
    quantity: 5000,
    unitRateInr: 10,
    subtotalInr: 50000,
    gstAmountInr: 9000,
    totalAmountInr: 59000
  };

  const workOrder = issueWorkOrder(acceptedQuote, { campaignId: 'camp_1' });
  assert(workOrder.status === WORK_ORDER_STATUSES.ISSUED, 'Issues work order in ISSUED state');
  assert(workOrder.milestones.length === 3, 'Creates 3-stage milestone schedule (50/40/10)');
  assert(workOrder.milestones[0].percentage === 50 && workOrder.milestones[0].triggerCondition === MILESTONE_TRIGGERS.ADVANCE_ON_ACCEPTANCE, '50% advance milestone tied to acceptance');

  const executionBoard = getCampaignExecutionBoard([workOrder]);
  assert(executionBoard.PRINTING.total === 1 && executionBoard.PRINTING.summaryStatus === 'ISSUED', 'Aggregates campaign execution board accurately');

  // Test 4: Physical Logistics & Inventory Reconciliation
  console.log('\n--- 4. Physical Logistics & Inventory Reconciliation ---');
  const shipment = createMaterialShipment({
    campaignId: 'camp_1',
    itemTitle: 'Product Sample Sachets',
    allocatedQuantity: 10000
  });
  assert(shipment.status === SHIPMENT_STATUSES.DISPATCHED, 'Shipment created in DISPATCHED state');

  const receivingData = {
    receivedUsableQuantity: 9800,
    damagedQuantity: 150,
    lostQuantity: 50,
    returnedQuantity: 0,
    receivedByName: 'Priya (Field Supervisor)'
  };

  const reconciled = reconcileShipmentDelivery(shipment, receivingData);
  assert(reconciled.status === SHIPMENT_STATUSES.RECONCILED, 'Reconciles shipment when all allocated units are fully accounted for');
  assert(reconciled.reconciliationReport.shrinkageLossUnits === 200, 'Calculates physical shrinkage loss accurately (200 units)');
  assert(reconciled.reconciliationReport.shrinkagePercentage === 2.0, 'Calculates 2.0% shrinkage percentage');

  // Test 5: Manpower Rostering & Morning No-Show Backup Activation
  console.log('\n--- 5. Manpower Rostering & Backup Activation ---');
  const primaryPool = [
    { id: 'w1', name: 'Ramesh', phone: '9888800001', role: 'PROMOTER', languages: ['Tamil', 'English'] },
    { id: 'w2', name: 'Suresh', phone: '9888800002', role: 'PROMOTER', languages: ['Tamil', 'English'] }
  ];
  const standbyPool = [
    { id: 'w_standby', name: 'Karthik', phone: '9888800003', role: 'PROMOTER', languages: ['Tamil', 'English'] }
  ];

  const roster = createShiftRoster('camp_1', { shiftDate: '2026-08-25', venueName: 'Phoenix Mall' }, primaryPool, standbyPool);
  assert(roster.length === 3, 'Creates roster with 2 primary and 1 standby worker');

  const noShowResult = handleNoShowAndActivateBackup(roster, 'w1');
  assert(noShowResult.success && noShowResult.backupActivated, 'Successfully detects no-show and activates standby worker');
  assert(noShowResult.roster.find(r => r.workerId === 'w1').checkinStatus === CHECKIN_STATUSES.NO_SHOW, 'Flags primary worker as NO_SHOW');
  assert(noShowResult.roster.find(r => r.workerId === 'w_standby').checkinStatus === CHECKIN_STATUSES.BACKUP_ACTIVATED, 'Flags standby worker as BACKUP_ACTIVATED');

  // Test 6: Campaign Execution Readiness Engine
  console.log('\n--- 6. Campaign Execution Readiness Engine ---');
  const blockedReadiness = evaluateCampaignReadiness({
    isVenuePermissionApproved: false,
    permissionDetails: 'Phoenix Mall NOC pending review',
    isMinimumStaffConfirmed: false,
    staffCount: 5,
    requiredStaff: 10,
    isMaterialsDelivered: false
  });
  assert(blockedReadiness.status === READINESS_STATUSES.BLOCKED, 'Unapproved venue permissions strictly block execution readiness');
  assert(blockedReadiness.blockersCount >= 2, 'Identifies multiple physical blockers');

  const readyReadiness = evaluateCampaignReadiness({
    isVenuePermissionApproved: true,
    isMinimumStaffConfirmed: true,
    staffCount: 10,
    requiredStaff: 10,
    isSupervisorAssigned: true,
    isMaterialsDelivered: true,
    areCriticalWorkOrdersAccepted: true
  });
  assert(readyReadiness.status === READINESS_STATUSES.READY && readyReadiness.isExecutable, 'All physical dependencies confirmed returns READY and isExecutable: true');

  // Test 7: Multi-Party Settlement & TDS Accounting
  console.log('\n--- 7. Multi-Party Settlement & TDS Accounting ---');
  const fundAlloc = calculateCampaignFundAllocation(236000); // 2,36,000 gross = 2,00,000 net + 36,000 GST
  assert(fundAlloc.netCampaignFund === 200000, 'Calculates exact ₹2,00,000 net campaign fund');
  assert(fundAlloc.allocations.manpowerStaffingFund === 70000, 'Allocates 35% to manpower fund (₹70,000)');
  assert(fundAlloc.allocations.refundableSafetyReserve >= 2000, 'Guarantees dynamic safety reserve floor');

  const tdsEst = calculateVendorTdsEstimate(50000, 'PVT_LTD', '194C');
  assert(tdsEst.estimatedTdsRate === '2%', 'Calculates 2% TDS rate for Pvt Ltd vendor under section 194C');
  assert(tdsEst.estimatedTdsAmount === 1000, 'Calculates ₹1,000 TDS deduction');
  assert(tdsEst.complianceStatus === TDS_COMPLIANCE_STATUSES.READY_FOR_ACCOUNTING, 'Sets compliance status to READY_FOR_ACCOUNTING');

  console.log('\n===================================================================');
  console.log(`🎉 ALL ${passedTests}/${totalTests} MARKETPLACE TESTS PASSED!`);
  console.log('===================================================================\n');
}

runMarketplaceTests().catch(err => {
  console.error('Test Suite Failed:', err);
  process.exit(1);
});
