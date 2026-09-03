import React from 'react';
import { Campaign, CampaignStatus, canTransitionCampaignStatus } from '../domain/campaign';
import { AudienceSegment } from '../domain/audience';
import { Location, formatLocationAddress } from '../domain/location';
import { Activation } from '../domain/activation';

interface CampaignDetailProps {
  campaign: Campaign;
  audiences: AudienceSegment[];
  locations: Location[];
  activations: Activation[];
  onStatusChange: (status: CampaignStatus) => void;
  onOpenActivationModal: () => void;
}

const statusOptions: CampaignStatus[] = ['DRAFT', 'SCHEDULED', 'ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED'];

export const CampaignDetail: React.FC<CampaignDetailProps> = ({
  campaign,
  audiences,
  locations,
  activations,
  onStatusChange,
  onOpenActivationModal,
}) => {
  const targetedAudiences = audiences.filter(a => campaign.targetAudienceIds.includes(a.id));
  const targetedLocations = locations.filter(l => campaign.targetLocationIds.includes(l.id));

  return (
    <div className="campaign-detail" style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.5rem' }}>{campaign.name}</h2>
          <p style={{ margin: '4px 0 0 0', color: '#6b7280', fontSize: '0.875rem' }}>
            ID: {campaign.id} | Created: {new Date(campaign.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={onOpenActivationModal}
            style={{
              padding: '8px 16px',
              backgroundColor: '#059669',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Dispatch Activation
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ border: '1px solid #e5e7eb', padding: '16px', borderRadius: '6px' }}>
          <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Budget</span>
          <div style={{ fontSize: '1.25rem', fontWeight: 600, marginTop: '4px' }}>
            {campaign.currency} ${campaign.budget.toLocaleString()}
          </div>
        </div>
        <div style={{ border: '1px solid #e5e7eb', padding: '16px', borderRadius: '6px' }}>
          <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Flight Dates</span>
          <div style={{ fontSize: '0.95rem', fontWeight: 500, marginTop: '4px' }}>
            {campaign.startDate} &rarr; {campaign.endDate}
          </div>
        </div>
        <div style={{ border: '1px solid #e5e7eb', padding: '16px', borderRadius: '6px' }}>
          <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Current Status</span>
          <div style={{ marginTop: '8px' }}>
            <select
              value={campaign.status}
              onChange={(e) => onStatusChange(e.target.value as CampaignStatus)}
              style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #d1d5db' }}
            >
              {statusOptions.map((st) => (
                <option key={st} value={st} disabled={!canTransitionCampaignStatus(campaign.status, st) && st !== campaign.status}>
                  {st}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        <div style={{ border: '1px solid #e5e7eb', padding: '16px', borderRadius: '6px' }}>
          <h3 style={{ marginTop: 0, fontSize: '1rem' }}>Target Audiences</h3>
          {targetedAudiences.length === 0 ? (
            <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>No target audiences selected.</p>
          ) : (
            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.875rem' }}>
              {targetedAudiences.map(aud => (
                <li key={aud.id}>{aud.name} ({aud.sizeEstimate.toLocaleString()} reach)</li>
              ))}
            </ul>
          )}
        </div>

        <div style={{ border: '1px solid #e5e7eb', padding: '16px', borderRadius: '6px' }}>
          <h3 style={{ marginTop: 0, fontSize: '1rem' }}>Target Locations</h3>
          {targetedLocations.length === 0 ? (
            <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>No target locations selected.</p>
          ) : (
            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.875rem' }}>
              {targetedLocations.map(loc => (
                <li key={loc.id}>{formatLocationAddress(loc)}</li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div style={{ border: '1px solid #e5e7eb', padding: '16px', borderRadius: '6px' }}>
        <h3 style={{ marginTop: 0, fontSize: '1rem' }}>Activation History</h3>
        {activations.length === 0 ? (
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>No activations dispatched yet for this campaign.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ padding: '8px' }}>Activation ID</th>
                <th style={{ padding: '8px' }}>Vendor ID</th>
                <th style={{ padding: '8px' }}>Channel</th>
                <th style={{ padding: '8px' }}>Status</th>
                <th style={{ padding: '8px' }}>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {activations.map(act => (
                <tr key={act.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '8px' }}>{act.id}</td>
                  <td style={{ padding: '8px' }}>{act.vendorId}</td>
                  <td style={{ padding: '8px' }}>{act.channel}</td>
                  <td style={{ padding: '8px', fontWeight: 600 }}>{act.status}</td>
                  <td style={{ padding: '8px' }}>{act.dispatchedAt ? new Date(act.dispatchedAt).toLocaleString() : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
