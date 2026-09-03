/**
 * Ziggers Offline Physical Vendor Domain
 * Defines execution vendors: Manpower Agencies, Printers, Fabricators, Logistics Providers, AV/Production, and Venue Liaisons.
 */

export type VendorCategory = 
  | 'MANPOWER'
  | 'PRINTING'
  | 'FABRICATION'
  | 'LOGISTICS'
  | 'AV_PRODUCTION'
  | 'VENUE_PERMISSION'
  | 'PHOTOGRAPHY'
  | 'OTHER';

export type KycStatus = 
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'VERIFIED'
  | 'REJECTED'
  | 'SUSPENDED';

export type UnitMetric = 
  | 'SHIFT'
  | 'HOUR'
  | 'DAY'
  | 'PERSON'
  | 'UNIT'
  | 'SQ_FT'
  | 'SQ_METER'
  | 'KG'
  | 'KM'
  | 'TRIP'
  | 'EVENT'
  | 'PACKAGE';

export interface VendorRateCard {
  id?: string;
  serviceName: string;
  category: VendorCategory;
  unitMetric: UnitMetric;
  baseRateInr: number;
  minOrderQuantity: number;
  city: string;
  conditions?: string;
}

export interface Vendor {
  id: string;
  legalBusinessName: string;
  tradeName?: string;
  businessType: 'PROPRIETORSHIP' | 'PARTNERSHIP' | 'LLP' | 'PVT_LTD' | 'PUBLIC_LTD' | 'INDIVIDUAL_FREELANCER';
  gstin?: string;
  pan: string;
  msmeRegistrationNo?: string;
  contactEmail: string;
  contactPhone: string;
  city: string;
  state: string;
  pincode: string;
  categories: VendorCategory[];
  serviceableCities: string[];
  rateCards: VendorRateCard[];
  kycStatus: KycStatus;
  verifiedAt?: string;
  rating: number | null; // null until verified completed campaigns exist
  completedCampaignsCount: number;
  active: boolean;
}

export function validateVendorProfile(vendor: Partial<Vendor>): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!vendor.legalBusinessName || vendor.legalBusinessName.trim().length === 0) {
    errors.push('Legal business name is required');
  }
  if (!vendor.pan || vendor.pan.trim().length !== 10) {
    errors.push('Valid 10-character PAN is required');
  }
  if (!vendor.contactEmail || !vendor.contactEmail.includes('@')) {
    errors.push('Valid business contact email is required');
  }
  if (!vendor.contactPhone || vendor.contactPhone.trim().length < 10) {
    errors.push('Valid contact phone number is required');
  }
  if (!vendor.categories || vendor.categories.length === 0) {
    errors.push('At least one operational service category must be selected');
  }
  if (!vendor.city || vendor.city.trim().length === 0) {
    errors.push('Primary operating city is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
