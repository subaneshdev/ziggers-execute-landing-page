import React from 'react';
import { AudienceSegment } from '../domain/audience';

interface AudienceSelectorProps {
  audiences: AudienceSegment[];
  selectedAudienceIds: string[];
  onChange: (selectedIds: string[]) => void;
}

export const AudienceSelector: React.FC<AudienceSelectorProps> = ({
  audiences,
  selectedAudienceIds,
  onChange,
}) => {
  const toggleAudience = (id: string) => {
    if (selectedAudienceIds.includes(id)) {
      onChange(selectedAudienceIds.filter(item => item !== id));
    } else {
      onChange([...selectedAudienceIds, id]);
    }
  };

  return (
    <div className="audience-selector" style={{ border: '1px solid #e5e7eb', borderRadius: '6px', padding: '12px' }}>
      <h3 style={{ marginTop: 0, fontSize: '1rem' }}>Target Audience Segments</h3>
      {audiences.length === 0 ? (
        <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>No audience segments available for this brand.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {audiences.map((aud) => (
            <label key={aud.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={selectedAudienceIds.includes(aud.id)}
                onChange={() => toggleAudience(aud.id)}
              />
              <div>
                <strong>{aud.name}</strong> ({aud.sizeEstimate.toLocaleString()} reach)
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280' }}>{aud.description}</p>
              </div>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};
