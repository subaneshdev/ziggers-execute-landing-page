/**
 * Ziggers Binding Work Order & Milestone Management Engine
 * 
 * Issues legal Work Orders from approved vendor quotes with milestone payment schedules.
 */

export const WORK_ORDER_STATUSES = {
  DRAFT: 'DRAFT',
  ISSUED: 'ISSUED',
  ACCEPTED: 'ACCEPTED',
  IN_PROGRESS: 'IN_PROGRESS',
  AWAITING_QA: 'AWAITING_QA',
  COMPLETED: 'COMPLETED',
  DISPUTED: 'DISPUTED',
  CANCELLED: 'CANCELLED'
};

export const MILESTONE_TRIGGERS = {
  ADVANCE_ON_ACCEPTANCE: 'ADVANCE_ON_ACCEPTANCE',
  MATERIAL_PRODUCED: 'MATERIAL_PRODUCED',
  DELIVERED_TO_VENUE: 'DELIVERED_TO_VENUE',
  QA_VERIFIED: 'QA_VERIFIED',
  FINAL_RECONCILIATION: 'FINAL_RECONCILIATION'
};

/**
 * Creates a binding Work Order from an accepted vendor quote
 * @param {Object} acceptedQuote 
 * @param {Object} campaignContext 
 * @returns {Object} Structured Work Order with milestone schedule
 */
export function issueWorkOrder(acceptedQuote, campaignContext = {}) {
  const woId = `wo_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 4)}`;
  const woNumber = `WO-${new Date().getFullYear()}-${Date.now().toString().slice(-5)}`;

  const totalAmount = acceptedQuote.totalAmountInr;
  
  // Standard 50% Production / 40% Delivery / 10% Final QA milestone schedule
  const milestones = [
    {
      id: `ms_1_${woId}`,
      milestoneName: 'Production & Material Mobilization Advance',
      percentage: 50,
      amountInr: Math.round(totalAmount * 0.50),
      triggerCondition: MILESTONE_TRIGGERS.ADVANCE_ON_ACCEPTANCE,
      status: 'PENDING'
    },
    {
      id: `ms_2_${woId}`,
      milestoneName: 'On-Site Delivery & Setup Verification',
      percentage: 40,
      amountInr: Math.round(totalAmount * 0.40),
      triggerCondition: MILESTONE_TRIGGERS.DELIVERED_TO_VENUE,
      status: 'PENDING'
    },
    {
      id: `ms_3_${woId}`,
      milestoneName: 'Final Reconciliation & Quality Sign-Off',
      percentage: 10,
      amountInr: totalAmount - Math.round(totalAmount * 0.50) - Math.round(totalAmount * 0.40),
      triggerCondition: MILESTONE_TRIGGERS.FINAL_RECONCILIATION,
      status: 'PENDING'
    }
  ];

  return {
    id: woId,
    woNumber,
    campaignId: campaignContext.campaignId || acceptedQuote.campaignId,
    quoteId: acceptedQuote.id,
    vendorId: acceptedQuote.vendorId,
    vendorName: acceptedQuote.vendorName,
    serviceCategory: acceptedQuote.category || 'COLLATERAL',
    scopeOfWork: acceptedQuote.specification || 'Physical campaign deliverables execution',
    quantity: acceptedQuote.quantity,
    unitPricingInr: acceptedQuote.unitRateInr,
    subtotalInr: acceptedQuote.subtotalInr,
    taxAmountInr: acceptedQuote.gstAmountInr,
    totalAmountInr: totalAmount,
    milestones,
    status: WORK_ORDER_STATUSES.ISSUED,
    issuedAt: new Date().toISOString(),
    acceptedAt: null,
    completedAt: null
  };
}

/**
 * Generates an aggregated Campaign Execution Board across all work orders
 * @param {Array} workOrders 
 * @returns {Object} Execution board categories summary
 */
export function getCampaignExecutionBoard(workOrders = []) {
  const categories = ['MANPOWER', 'PRINTING', 'FABRICATION', 'LOGISTICS', 'VENUE'];
  
  const board = {};

  categories.forEach(cat => {
    const matching = workOrders.filter(wo => (wo.serviceCategory || '').toUpperCase().includes(cat));
    const total = matching.length;
    const completed = matching.filter(wo => wo.status === WORK_ORDER_STATUSES.COMPLETED).length;
    const inProgress = matching.filter(wo => wo.status === WORK_ORDER_STATUSES.IN_PROGRESS || wo.status === WORK_ORDER_STATUSES.ACCEPTED).length;
    const qaPending = matching.filter(wo => wo.status === WORK_ORDER_STATUSES.AWAITING_QA).length;
    
    let summaryStatus = 'NOT_REQUIRED';
    if (total > 0) {
      if (completed === total) summaryStatus = 'COMPLETED';
      else if (qaPending > 0) summaryStatus = 'QA_PENDING';
      else if (inProgress > 0) summaryStatus = 'IN_PROGRESS';
      else summaryStatus = 'ISSUED';
    }

    board[cat] = {
      total,
      completed,
      inProgress,
      qaPending,
      summaryStatus,
      badgeText: `${cat}: ${completed}/${total} ${summaryStatus}`
    };
  });

  return board;
}
