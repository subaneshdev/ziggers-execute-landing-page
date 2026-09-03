import React, { useState } from 'react';
import { Vendor, VendorChannel } from '../domain/vendor';
import { CreateActivationInput } from '../domain/activation';

interface ActivationFormProps {
  campaignId: string;
  vendors: Vendor[];
  onSubmit: (input: CreateActivationInput) => void;
  onCancel: () => void;
}

export const ActivationForm: React.FC<ActivationFormProps> = ({
  campaignId,
  vendors,
  onSubmit,
  onCancel,
}) => {
  const [selectedVendorId, setSelectedVendorId] = useState<string>(vendors[0]?.id || '');
  const [channel, setChannel] = useState<VendorChannel>(vendors[0]?.supportedChannels[0] || 'DSP');
  const [creativeUrl, setCreativeUrl] = useState<string>('https://cdn.adserver.com/creative/spring2026.png');
  const [headline, setHeadline] = useState<string>('Limited Time Spring Offer');

  const selectedVendor = vendors.find(v => v.id === selectedVendorId);

  const handleVendorChange = (vendorId: string) => {
    setSelectedVendorId(vendorId);
    const vendor = vendors.find(v => v.id === vendorId);
    if (vendor && vendor.supportedChannels.length > 0) {
      setChannel(vendor.supportedChannels[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      campaignId,
      vendorId: selectedVendorId,
      channel,
      payload: {
        creativeUrl,
        headline,
        timestamp: new Date().toISOString(),
      },
    });
  };

  return (
    <div className="activation-modal-overlay" style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="activation-modal-content" style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '24px', width: '480px', maxWidth: '90%' }}>
        <h3 style={{ marginTop: 0 }}>Dispatch Activation Target</h3>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '4px' }}>Vendor</label>
            <select
              value={selectedVendorId}
              onChange={(e) => handleVendorChange(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #d1d5db' }}
            >
              {vendors.map(v => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '4px' }}>Channel</label>
            <select
              value={channel}
              onChange={(e) => setChannel(e.target.value as VendorChannel)}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #d1d5db' }}
            >
              {selectedVendor?.supportedChannels.map(ch => (
                <option key={ch} value={ch}>{ch}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '4px' }}>Creative URL</label>
            <input
              type="text"
              value={creativeUrl}
              onChange={(e) => setCreativeUrl(e.target.value)}
              required
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #d1d5db' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '4px' }}>Headline Text</label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              required
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #d1d5db' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
            <button
              type="button"
              onClick={onCancel}
              style={{ padding: '8px 16px', border: '1px solid #d1d5db', borderRadius: '4px', backgroundColor: '#fff', cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{ padding: '8px 16px', border: 'none', borderRadius: '4px', backgroundColor: '#2563eb', color: '#fff', cursor: 'pointer', fontWeight: 600 }}
            >
              Dispatch Now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
