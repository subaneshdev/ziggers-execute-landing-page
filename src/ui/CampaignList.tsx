import React from 'react';
import { Campaign, CampaignStatus } from '../domain/campaign';

interface CampaignListProps {
  campaigns: Campaign[];
  selectedCampaignId: string | null;
  onSelectCampaign: (id: string) => void;
  onCreateNew: () => void;
}

const statusColors: Record<CampaignStatus, { bg: string; text: string }> = {
  DRAFT: { bg: '#f3f4f6', text: '#374151' },
  SCHEDULED: { bg: '#e0f2fe', text: '#0369a1' },
  ACTIVE: { bg: '#dcfce7', text: '#15803d' },
  PAUSED: { bg: '#fef3c7', text: '#b45309' },
  COMPLETED: { bg: '#e0e7ff', text: '#4338ca' },
  CANCELLED: { bg: '#fee2e2', text: '#b91c1c' },
};

export const CampaignList: React.FC<CampaignListProps> = ({
  campaigns,
  selectedCampaignId,
  onSelectCampaign,
  onCreateNew,
}) => {
  return (
    <div className="campaign-list" style={{ borderRight: '1px solid #e5e7eb', padding: '16px', minWidth: '280px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ margin: 0, fontSize: '1.125rem' }}>Campaigns</h2>
        <button
          onClick={onCreateNew}
          style={{
            padding: '6px 12px',
            backgroundColor: '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.875rem',
          }}
        >
          + New
        </button>
      </div>

      {campaigns.length === 0 ? (
        <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>No campaigns found for selected brand.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {campaigns.map((cmp) => {
            const isSelected = cmp.id === selectedCampaignId;
            const badge = statusColors[cmp.status];

            return (
              <div
                key={cmp.id}
                onClick={() => onSelectCampaign(cmp.id)}
                style={{
                  padding: '12px',
                  borderRadius: '6px',
                  border: isSelected ? '2px solid #2563eb' : '1px solid #e5e7eb',
                  backgroundColor: isSelected ? '#eff6ff' : '#ffffff',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h4 style={{ margin: 0, fontSize: '0.95rem' }}>{cmp.name}</h4>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      backgroundColor: badge.bg,
                      color: badge.text,
                      fontWeight: 600,
                    }}
                  >
                    {cmp.status}
                  </span>
                </div>
                <div style={{ marginTop: '8px', fontSize: '0.8rem', color: '#6b7280' }}>
                  Budget: {cmp.currency} ${cmp.budget.toLocaleString()}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
