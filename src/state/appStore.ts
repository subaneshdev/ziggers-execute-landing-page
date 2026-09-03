import { Brand } from '../domain/brand';
import { Campaign, CampaignStatus, CreateCampaignInput } from '../domain/campaign';
import { AudienceSegment } from '../domain/audience';
import { Location } from '../domain/location';
import { Vendor } from '../domain/vendor';
import { Activation, CreateActivationInput } from '../domain/activation';
import { campaignService } from '../services/campaignService';
import { activationService } from '../services/activationService';

export interface AppState {
  brands: Brand[];
  selectedBrandId: string | null;
  campaigns: Campaign[];
  selectedCampaignId: string | null;
  audiences: AudienceSegment[];
  locations: Location[];
  vendors: Vendor[];
  activations: Activation[];
  isLoading: boolean;
  error: string | null;
}

export type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_BRANDS'; payload: Brand[] }
  | { type: 'SELECT_BRAND'; payload: string }
  | { type: 'SET_CAMPAIGNS'; payload: Campaign[] }
  | { type: 'SELECT_CAMPAIGN'; payload: string | null }
  | { type: 'SET_AUDIENCES'; payload: AudienceSegment[] }
  | { type: 'SET_LOCATIONS'; payload: Location[] }
  | { type: 'SET_VENDORS'; payload: Vendor[] }
  | { type: 'SET_ACTIVATIONS'; payload: Activation[] }
  | { type: 'ADD_CAMPAIGN'; payload: Campaign }
  | { type: 'UPDATE_CAMPAIGN'; payload: Campaign }
  | { type: 'ADD_ACTIVATION'; payload: Activation };

export const initialAppState: AppState = {
  brands: [],
  selectedBrandId: null,
  campaigns: [],
  selectedCampaignId: null,
  audiences: [],
  locations: [],
  vendors: [],
  activations: [],
  isLoading: false,
  error: null,
};

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };

    case 'SET_BRANDS': {
      const selectedBrandId = state.selectedBrandId || (action.payload[0]?.id ?? null);
      return { ...state, brands: action.payload, selectedBrandId };
    }

    case 'SELECT_BRAND':
      return { ...state, selectedBrandId: action.payload, selectedCampaignId: null };

    case 'SET_CAMPAIGNS':
      return { ...state, campaigns: action.payload };

    case 'SELECT_CAMPAIGN':
      return { ...state, selectedCampaignId: action.payload };

    case 'SET_AUDIENCES':
      return { ...state, audiences: action.payload };

    case 'SET_LOCATIONS':
      return { ...state, locations: action.payload };

    case 'SET_VENDORS':
      return { ...state, vendors: action.payload };

    case 'SET_ACTIVATIONS':
      return { ...state, activations: action.payload };

    case 'ADD_CAMPAIGN':
      return { ...state, campaigns: [action.payload, ...state.campaigns] };

    case 'UPDATE_CAMPAIGN':
      return {
        ...state,
        campaigns: state.campaigns.map(c => (c.id === action.payload.id ? action.payload : c)),
      };

    case 'ADD_ACTIVATION':
      return { ...state, activations: [action.payload, ...state.activations] };

    default:
      return state;
  }
}

export class AppStoreController {
  constructor(private dispatch: React.Dispatch<AppAction>) {}

  async initializeApp(): Promise<void> {
    this.dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const [brands, locations, vendors] = await Promise.all([
        campaignService.getBrands(),
        campaignService.getLocations(),
        activationService.getVendors(),
      ]);

      this.dispatch({ type: 'SET_BRANDS', payload: brands });
      this.dispatch({ type: 'SET_LOCATIONS', payload: locations });
      this.dispatch({ type: 'SET_VENDORS', payload: vendors });

      const defaultBrandId = brands[0]?.id;
      if (defaultBrandId) {
        await this.loadBrandData(defaultBrandId);
      }
    } catch (err) {
      this.dispatch({ type: 'SET_ERROR', payload: (err as Error).message });
    } finally {
      this.dispatch({ type: 'SET_LOADING', payload: false });
    }
  }

  async selectBrand(brandId: string): Promise<void> {
    this.dispatch({ type: 'SELECT_BRAND', payload: brandId });
    await this.loadBrandData(brandId);
  }

  private async loadBrandData(brandId: string): Promise<void> {
    try {
      const [campaigns, audiences] = await Promise.all([
        campaignService.getCampaigns(brandId),
        campaignService.getAudiencesByBrand(brandId),
      ]);
      this.dispatch({ type: 'SET_CAMPAIGNS', payload: campaigns });
      this.dispatch({ type: 'SET_AUDIENCES', payload: audiences });
    } catch (err) {
      this.dispatch({ type: 'SET_ERROR', payload: (err as Error).message });
    }
  }

  async selectCampaign(campaignId: string | null): Promise<void> {
    this.dispatch({ type: 'SELECT_CAMPAIGN', payload: campaignId });
    if (campaignId) {
      try {
        const activations = await activationService.getActivationsByCampaign(campaignId);
        this.dispatch({ type: 'SET_ACTIVATIONS', payload: activations });
      } catch (err) {
        this.dispatch({ type: 'SET_ERROR', payload: (err as Error).message });
      }
    } else {
      this.dispatch({ type: 'SET_ACTIVATIONS', payload: [] });
    }
  }

  async createCampaign(input: CreateCampaignInput): Promise<Campaign | void> {
    try {
      const created = await campaignService.createCampaign(input);
      this.dispatch({ type: 'ADD_CAMPAIGN', payload: created });
      return created;
    } catch (err) {
      this.dispatch({ type: 'SET_ERROR', payload: (err as Error).message });
    }
  }

  async updateCampaignStatus(campaignId: string, status: CampaignStatus): Promise<void> {
    try {
      const updated = await campaignService.updateCampaignStatus(campaignId, status);
      this.dispatch({ type: 'UPDATE_CAMPAIGN', payload: updated });
    } catch (err) {
      this.dispatch({ type: 'SET_ERROR', payload: (err as Error).message });
    }
  }

  async triggerActivation(input: CreateActivationInput): Promise<void> {
    try {
      const activation = await activationService.triggerActivation(input);
      this.dispatch({ type: 'ADD_ACTIVATION', payload: activation });
    } catch (err) {
      this.dispatch({ type: 'SET_ERROR', payload: (err as Error).message });
    }
  }
}
