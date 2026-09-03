/**
 * Ziggers Physical Logistics & Inventory Reconciliation Engine
 * 
 * Tracks movement of physical marketing collateral from Brand Warehouse to On-Ground Promoters.
 * Never assumes 100% arrival: calculates transit loss, damage, and post-campaign returns.
 */

export const SHIPMENT_STATUSES = {
  PENDING_PICKUP: 'PENDING_PICKUP',
  DISPATCHED: 'DISPATCHED',
  IN_TRANSIT: 'IN_TRANSIT',
  DELIVERED_ON_SITE: 'DELIVERED_ON_SITE',
  RECONCILED: 'RECONCILED',
  DISPUTED: 'DISPUTED'
};

/**
 * Base Pluggable Logistics Provider Interface
 */
export class LogisticsProviderInterface {
  async trackShipment(trackingNumber) {
    throw new Error('trackShipment must be implemented by provider adapter');
  }
}

/**
 * Default Manual / Direct Courier Logistics Adapter
 */
export class ManualLogisticsProvider extends LogisticsProviderInterface {
  async trackShipment(trackingNumber) {
    return {
      provider: 'MANUAL_OR_LOCAL_FLEET',
      trackingNumber,
      status: 'TRACKING_VIA_FIELD_SUPERVISOR',
      note: 'Location updates recorded via on-site supervisor check-in.'
    };
  }
}

/**
 * Creates a structured shipment manifest
 */
export function createMaterialShipment(shipmentParams) {
  const {
    campaignId,
    itemTitle = 'Product Sample Sachets',
    allocatedQuantity = 10000,
    originAddress = 'Brand Central Distribution Warehouse',
    destinationVenue = 'Phoenix Marketcity Mall, Chennai',
    logisticsPartner = 'Local Dedicated Fleet',
    trackingNumber = `TRK-${Date.now().toString().slice(-6)}`
  } = shipmentParams;

  const shipmentId = `shp_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 4)}`;

  return {
    id: shipmentId,
    shipmentNumber: `SHP-${new Date().getFullYear()}-${Date.now().toString().slice(-5)}`,
    campaignId,
    itemTitle,
    originAddress,
    destinationVenue,
    logisticsPartner,
    trackingNumber,
    allocatedQuantity,
    receivedUsableQuantity: 0,
    damagedQuantity: 0,
    lostQuantity: 0,
    status: SHIPMENT_STATUSES.DISPATCHED,
    dispatchedAt: new Date().toISOString(),
    deliveredAt: null,
    receivedByName: null,
    reconciliationReport: null
  };
}

/**
 * Reconciles received physical shipment on-ground
 * Equation: Allocated = Usable + Damaged + Lost + Returned + Remaining
 */
export function reconcileShipmentDelivery(shipment, receivingData) {
  const {
    receivedUsableQuantity,
    damagedQuantity = 0,
    lostQuantity = 0,
    returnedQuantity = 0,
    receivedByName,
    proofOfDeliveryUrl = null
  } = receivingData;

  const totalAccounted = receivedUsableQuantity + damagedQuantity + lostQuantity + returnedQuantity;
  const isFullyAccounted = totalAccounted === shipment.allocatedQuantity;

  const reconciliationReport = {
    allocatedQuantity: shipment.allocatedQuantity,
    receivedUsableQuantity,
    damagedQuantity,
    lostQuantity,
    returnedQuantity,
    totalAccounted,
    shrinkageLossUnits: shipment.allocatedQuantity - receivedUsableQuantity,
    shrinkagePercentage: parseFloat((((shipment.allocatedQuantity - receivedUsableQuantity) / shipment.allocatedQuantity) * 100).toFixed(2)),
    isReconciled: isFullyAccounted,
    reconciledAt: new Date().toISOString()
  };

  return {
    ...shipment,
    receivedUsableQuantity,
    damagedQuantity,
    lostQuantity,
    status: isFullyAccounted ? SHIPMENT_STATUSES.RECONCILED : SHIPMENT_STATUSES.DISPUTED,
    deliveredAt: new Date().toISOString(),
    receivedByName,
    proofOfDeliveryUrl,
    reconciliationReport
  };
}
