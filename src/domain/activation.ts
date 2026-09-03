import { VendorChannel } from './vendor';

export type ActivationStatus = 'PENDING' | 'DISPATCHED' | 'FAILED' | 'REJECTED';

export interface Activation {
  id: string;
  campaignId: string;
  vendorId: string;
  channel: VendorChannel;
  payload: Record<string, unknown>;
  status: ActivationStatus;
  dispatchedAt?: string;
  errorMessage?: string;
}

export interface CreateActivationInput {
  campaignId: string;
  vendorId: string;
  channel: VendorChannel;
  payload: Record<string, unknown>;
}

export function validateActivationInput(input: CreateActivationInput): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!input.campaignId) {
    errors.push('Campaign ID is required for activation');
  }

  if (!input.vendorId) {
    errors.push('Vendor ID is required for activation');
  }

  if (!input.channel) {
    errors.push('Activation channel is required');
  }

  if (!input.payload || Object.keys(input.payload).length === 0) {
    errors.push('Activation payload cannot be empty');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function createActivationEntity(input: CreateActivationInput): Activation {
  const validation = validateActivationInput(input);
  if (!validation.isValid) {
    throw new Error(`Invalid activation input: ${validation.errors.join(', ')}`);
  }

  return {
    id: `act_${Math.random().toString(36).substring(2, 9)}`,
    campaignId: input.campaignId,
    vendorId: input.vendorId,
    channel: input.channel,
    payload: input.payload,
    status: 'PENDING',
  };
}
