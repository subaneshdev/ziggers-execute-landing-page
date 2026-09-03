/**
 * Ziggers Signal Sync - Digital Signal Provider Base Interface
 * File: src/lib/intelligence/signals/signalProvider.js
 *
 * Defines the abstract interface and provider registry for external digital advertising platforms.
 * Decouples Ziggers core intelligence from specific ad network implementations.
 */

export class SignalProvider {
  constructor(name, config = {}) {
    if (new.target === SignalProvider) {
      throw new TypeError("Cannot instantiate abstract class SignalProvider directly.");
    }
    this.name = name;
    this.config = config;
  }

  /**
   * Verify credentials or connectivity
   * @returns {Promise<{success: boolean, status: string, accountInfo?: Object, error?: string}>}
   */
  async verifyConnection() {
    throw new Error("verifyConnection() must be implemented by subclass.");
  }

  /**
   * List available advertiser ad accounts
   * @returns {Promise<Array<{accountId: string, accountName: string, currency: string, timezone: string}>>}
   */
  async listAdAccounts() {
    throw new Error("listAdAccounts() must be implemented by subclass.");
  }

  /**
   * List active campaigns for an ad account
   * @param {string} accountId 
   * @returns {Promise<Array<{campaignId: string, name: string, objective: string, status: string, spend: number, reach: number}>>}
   */
  async listCampaigns(accountId) {
    throw new Error("listCampaigns() must be implemented by subclass.");
  }

  /**
   * Fetch aggregate campaign insights and breakdowns (age, gender, geo, hourly, placement)
   * @param {string} campaignId 
   * @param {Object} options 
   * @returns {Promise<Object>}
   */
  async getCampaignInsights(campaignId, options = {}) {
    throw new Error("getCampaignInsights() must be implemented by subclass.");
  }
}

/**
 * Global Signal Provider Registry
 */
class SignalProviderRegistry {
  constructor() {
    this.providers = new Map();
  }

  register(providerInstance) {
    this.providers.set(providerInstance.name.toUpperCase(), providerInstance);
  }

  get(name) {
    return this.providers.get(name.toUpperCase()) || null;
  }

  listAvailable() {
    return Array.from(this.providers.keys()).map(name => {
      const provider = this.providers.get(name);
      return {
        id: name.toLowerCase(),
        name,
        isConfigured: !!provider
      };
    });
  }
}

export const signalProviderRegistry = new SignalProviderRegistry();
