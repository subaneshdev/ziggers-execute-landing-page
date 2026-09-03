import { Campaign, CreateCampaignInput, validateCampaign, canTransitionCampaignStatus, CampaignStatus } from '../domain/campaign';
import { Brand } from '../domain/brand';
import { AudienceSegment } from '../domain/audience';
import { Location } from '../domain/location';

// In-memory mock database seed data for domain services
const MOCK_BRANDS: Brand[] = [
  { id: 'b_1', name: 'Acme Retail', code: 'ACME', industry: 'Ecommerce', active: true, createdAt: '2026-01-01T00:00:00Z' },
  { id: 'b_2', name: 'Apex Motors', code: 'APEX', industry: 'Automotive', active: true, createdAt: '2026-01-02T00:00:00Z' },
];

const MOCK_AUDIENCES: AudienceSegment[] = [
  { id: 'aud_1', brandId: 'b_1', name: 'High-Value Shoppers', description: 'Customers with LTV > $500', sizeEstimate: 125000, tags: ['vip', 'retail'] },
  { id: 'aud_2', brandId: 'b_1', name: 'Cart Abandoners 30d', description: 'Users who left items in cart within last 30 days', sizeEstimate: 45000, tags: ['retargeting'] },
  { id: 'aud_3', brandId: 'b_2', name: 'EV Enthusiasts', description: 'Users interested in electric vehicles', sizeEstimate: 210000, tags: ['auto', 'ev'] },
];

const MOCK_LOCATIONS: Location[] = [
  { id: 'loc_1', name: 'New York Metro', region: 'NY', countryCode: 'US', postalCode: '10001' },
  { id: 'loc_2', name: 'Greater London', region: 'ENG', countryCode: 'GB', postalCode: 'EC1A' },
  { id: 'loc_3', name: 'Tokyo North', region: 'TK', countryCode: 'JP', postalCode: '100-0001' },
];

let campaignsStore: Campaign[] = [
  {
    id: 'cmp_101',
    brandId: 'b_1',
    name: 'Spring Clearance 2026',
    budget: 50000,
    currency: 'USD',
    startDate: '2026-03-01',
    endDate: '2026-03-31',
    status: 'DRAFT',
    targetAudienceIds: ['aud_1', 'aud_2'],
    targetLocationIds: ['loc_1'],
    createdAt: '2026-02-15T10:00:00Z',
    updatedAt: '2026-02-15T10:00:00Z',
  },
  {
    id: 'cmp_102',
    brandId: 'b_2',
    name: 'EV Model Launch',
    budget: 150000,
    currency: 'USD',
    startDate: '2026-04-01',
    endDate: '2026-05-15',
    status: 'SCHEDULED',
    targetAudienceIds: ['aud_3'],
    targetLocationIds: ['loc_1', 'loc_2'],
    createdAt: '2026-02-18T14:00:00Z',
    updatedAt: '2026-02-18T14:00:00Z',
  },
];

export class CampaignService {
  async getBrands(): Promise<Brand[]> {
    return Promise.resolve([...MOCK_BRANDS]);
  }

  async getAudiencesByBrand(brandId: string): Promise<AudienceSegment[]> {
    return Promise.resolve(MOCK_AUDIENCES.filter(a => a.brandId === brandId));
  }

  async getLocations(): Promise<Location[]> {
    return Promise.resolve([...MOCK_LOCATIONS]);
  }

  async getCampaigns(brandId?: string): Promise<Campaign[]> {
    if (brandId) {
      return Promise.resolve(campaignsStore.filter(c => c.brandId === brandId));
    }
    return Promise.resolve([...campaignsStore]);
  }

  async getCampaignById(id: string): Promise<Campaign | null> {
    const found = campaignsStore.find(c => c.id === id);
    return Promise.resolve(found ? { ...found } : null);
  }

  async createCampaign(input: CreateCampaignInput): Promise<Campaign> {
    const validation = validateCampaign(input);
    if (!validation.isValid) {
      throw new Error(`Campaign validation failed: ${validation.errors.join('; ')}`);
    }

    const now = new Date().toISOString();
    const newCampaign: Campaign = {
      ...input,
      id: `cmp_${Math.random().toString(36).substring(2, 9)}`,
      status: 'DRAFT',
      createdAt: now,
      updatedAt: now,
    };

    campaignsStore.push(newCampaign);
    return Promise.resolve({ ...newCampaign });
  }

  async updateCampaignStatus(campaignId: string, nextStatus: CampaignStatus): Promise<Campaign> {
    const campaign = campaignsStore.find(c => c.id === campaignId);
    if (!campaign) {
      throw new Error(`Campaign with ID ${campaignId} not found`);
    }

    if (!canTransitionCampaignStatus(campaign.status, nextStatus)) {
      throw new Error(`Invalid status transition from ${campaign.status} to ${nextStatus}`);
    }

    campaign.status = nextStatus;
    campaign.updatedAt = new Date().toISOString();
    return Promise.resolve({ ...campaign });
  }
}

export const campaignService = new CampaignService();
