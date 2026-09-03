import { Activation, CreateActivationInput, createActivationEntity } from '../domain/activation';
import { Vendor, VendorCategory } from '../domain/vendor';
import { supabaseAdmin } from '../lib/supabase';

let activationsStore: Activation[] = [];

export class ActivationService {
  /**
   * Retrieves verified physical execution vendors filtered by category or city
   */
  async getVendors(category?: VendorCategory, city?: string): Promise<Vendor[]> {
    try {
      let query = supabaseAdmin.from('vendors').select('*, vendor_rate_cards(*), vendor_coverage(*)');
      
      if (city) {
        query = query.eq('city', city);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data.map(v => ({
          id: v.id,
          legalBusinessName: v.legal_business_name,
          tradeName: v.trade_name,
          businessType: v.business_type,
          gstin: v.gstin,
          pan: v.pan,
          msmeRegistrationNo: v.msme_registration_no,
          contactEmail: v.contact_email,
          contactPhone: v.contact_phone,
          city: v.city,
          state: v.state,
          pincode: v.pincode,
          categories: v.vendor_services ? v.vendor_services.map((s: any) => s.category) : ['MANPOWER'],
          serviceableCities: v.vendor_coverage ? v.vendor_coverage.map((c: any) => c.coverage_value) : [v.city],
          rateCards: v.vendor_rate_cards || [],
          kycStatus: v.kyc_status,
          verifiedAt: v.verified_at,
          rating: v.rating,
          completedCampaignsCount: v.completed_campaigns_count || 0,
          active: v.kyc_status === 'VERIFIED'
        }));
      }

      return [];
    } catch (err) {
      return [];
    }
  }

  async getActivationsByCampaign(campaignId: string): Promise<Activation[]> {
    return Promise.resolve(activationsStore.filter(a => a.campaignId === campaignId));
  }

  async triggerActivation(input: CreateActivationInput): Promise<Activation> {
    const newActivation = createActivationEntity(input);
    activationsStore.push(newActivation);
    return Promise.resolve({ ...newActivation });
  }
}

export const activationService = new ActivationService();
