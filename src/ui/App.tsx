import React, { useState } from 'react';
import { useAppStore } from '../state/appContext';
import { BrandHeader } from './BrandHeader';
import { CampaignList } from './CampaignList';
import { CampaignDetail } from './CampaignDetail';
import { ActivationForm } from './ActivationForm';
import { AudienceSelector } from './AudienceSelector';
import { LocationSelector } from './LocationSelector';
import { CreateCampaignInput, CampaignStatus } from '../domain/campaign';

export const MainAppContent: React.FC = () => {
  const { state, actions } = useAppStore();
  const [isCreatingCampaign, setIsCreatingCampaign] = useState<boolean>(false);
  const [isActivationModalOpen, setIsActivationModalOpen] = useState<boolean>(false);

  // New Campaign Form State
  const [newCampaignName, setNewCampaignName] = useState<string>('');
  const [newCampaignBudget, setNewCampaignBudget] = useState<number>(10000);
  const [newCampaignCurrency, setNewCampaignCurrency] = useState<string>('USD');
  const [newStartDate, setNewStartDate] = useState<string>('2026-06-01');
  const [newEndDate, setNewEndDate] = useState<string>('2026-06-30');
  const [selectedAudienceIds, setSelectedAudienceIds] = useState<string[]>([]);
  const [selectedLocationIds, setSelectedLocationIds] = useState<string[]>([]);

  const selectedCampaign = state.campaigns.find(c => c.id === state.selectedCampaignId);

  const handleCreateCampaignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.selectedBrandId) return;

    const input: CreateCampaignInput = {
      brandId: state.selectedBrandId,
      name: newCampaignName,
      budget: newCampaignBudget,
      currency: newCampaignCurrency,
      startDate: newStartDate,
      endDate: newEndDate,
      targetAudienceIds: selectedAudienceIds,
      targetLocationIds: selectedLocationIds,
    };

    const created = await actions.createCampaign(input);
    if (created) {
      setIsCreatingCampaign(false);
      setNewCampaignName('');
      setSelectedAudienceIds([]);
      setSelectedLocationIds([]);
      await actions.selectCampaign(created.id);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      <BrandHeader
        brands={state.brands}
        selectedBrandId={state.selectedBrandId}
        onSelectBrand={(brandId) => actions.selectBrand(brandId)}
      />

      {state.error && (
        <div style={{ backgroundColor: '#fef2f2', color: '#991b1b', padding: '12px 16px', borderBottom: '1px solid #fca5a5' }}>
          <strong>Error:</strong> {state.error}
        </div>
      )}

      {state.isLoading ? (
        <div style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>Loading system data...</div>
      ) : (
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          <CampaignList
            campaigns={state.campaigns}
            selectedCampaignId={state.selectedCampaignId}
            onSelectCampaign={(id) => {
              setIsCreatingCampaign(false);
              actions.selectCampaign(id);
            }}
            onCreateNew={() => setIsCreatingCampaign(true)}
          />

          {isCreatingCampaign ? (
            <div style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
              <h2>Create New Campaign</h2>
              <form onSubmit={handleCreateCampaignSubmit} style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '4px' }}>Campaign Name</label>
                  <input
                    type="text"
                    value={newCampaignName}
                    onChange={(e) => setNewCampaignName(e.target.value)}
                    required
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #d1d5db' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '4px' }}>Budget</label>
                    <input
                      type="number"
                      value={newCampaignBudget}
                      onChange={(e) => setNewCampaignBudget(Number(e.target.value))}
                      required
                      min={1}
                      style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #d1d5db' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '4px' }}>Currency</label>
                    <select
                      value={newCampaignCurrency}
                      onChange={(e) => setNewCampaignCurrency(e.target.value)}
                      style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #d1d5db' }}
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '4px' }}>Start Date</label>
                    <input
                      type="date"
                      value={newStartDate}
                      onChange={(e) => setNewStartDate(e.target.value)}
                      required
                      style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #d1d5db' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '4px' }}>End Date</label>
                    <input
                      type="date"
                      value={newEndDate}
                      onChange={(e) => setNewEndDate(e.target.value)}
                      required
                      style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #d1d5db' }}
                    />
                  </div>
                </div>

                <AudienceSelector
                  audiences={state.audiences}
                  selectedAudienceIds={selectedAudienceIds}
                  onChange={setSelectedAudienceIds}
                />

                <LocationSelector
                  locations={state.locations}
                  selectedLocationIds={selectedLocationIds}
                  onChange={setSelectedLocationIds}
                />

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
                  <button
                    type="button"
                    onClick={() => setIsCreatingCampaign(false)}
                    style={{ padding: '8px 16px', border: '1px solid #d1d5db', borderRadius: '4px', backgroundColor: '#fff', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{ padding: '8px 16px', border: 'none', borderRadius: '4px', backgroundColor: '#2563eb', color: '#fff', cursor: 'pointer', fontWeight: 600 }}
                  >
                    Save Campaign
                  </button>
                </div>
              </form>
            </div>
          ) : selectedCampaign ? (
            <CampaignDetail
              campaign={selectedCampaign}
              audiences={state.audiences}
              locations={state.locations}
              activations={state.activations}
              onStatusChange={(status: CampaignStatus) => actions.updateCampaignStatus(selectedCampaign.id, status)}
              onOpenActivationModal={() => setIsActivationModalOpen(true)}
            />
          ) : (
            <div style={{ padding: '32px', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280' }}>
              Select a campaign from the left sidebar or create a new campaign to view details.
            </div>
          )}
        </div>
      )}

      {isActivationModalOpen && selectedCampaign && (
        <ActivationForm
          campaignId={selectedCampaign.id}
          vendors={state.vendors}
          onSubmit={async (input) => {
            await actions.triggerActivation(input);
            setIsActivationModalOpen(false);
          }}
          onCancel={() => setIsActivationModalOpen(false)}
        />
      )}
    </div>
  );
};
