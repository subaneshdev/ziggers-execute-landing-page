export type CampaignStatus = 'DRAFT' | 'SCHEDULED' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'CANCELLED';

export interface Campaign {
  id: string;
  brandId: string;
  name: string;
  budget: number;
  currency: string;
  startDate: string;
  endDate: string;
  status: CampaignStatus;
  targetAudienceIds: string[];
  targetLocationIds: string[];
  createdAt: string;
  updatedAt: string;
}

export type CreateCampaignInput = Omit<Campaign, 'id' | 'createdAt' | 'updatedAt' | 'status'>;

export function validateCampaign(campaign: Partial<Campaign>): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!campaign.brandId) {
    errors.push('Brand ID is required');
  }

  if (!campaign.name || campaign.name.trim().length === 0) {
    errors.push('Campaign name is required');
  }

  if (campaign.budget === undefined || campaign.budget <= 0) {
    errors.push('Campaign budget must be greater than zero');
  }

  if (!campaign.startDate || !campaign.endDate) {
    errors.push('Start date and end date are required');
  } else if (new Date(campaign.startDate) >= new Date(campaign.endDate)) {
    errors.push('Start date must be before end date');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function canTransitionCampaignStatus(current: CampaignStatus, next: CampaignStatus): boolean {
  const validTransitions: Record<CampaignStatus, CampaignStatus[]> = {
    DRAFT: ['SCHEDULED', 'CANCELLED'],
    SCHEDULED: ['ACTIVE', 'CANCELLED', 'PAUSED'],
    ACTIVE: ['PAUSED', 'COMPLETED', 'CANCELLED'],
    PAUSED: ['ACTIVE', 'CANCELLED'],
    COMPLETED: [],
    CANCELLED: [],
  };

  return validTransitions[current]?.includes(next) ?? false;
}

export function isCampaignActive(campaign: Campaign): boolean {
  return campaign.status === 'ACTIVE';
}
