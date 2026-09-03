import React from 'react';
import { Location, formatLocationAddress } from '../domain/location';

interface LocationSelectorProps {
  locations: Location[];
  selectedLocationIds: string[];
  onChange: (selectedIds: string[]) => void;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  locations,
  selectedLocationIds,
  onChange,
}) => {
  const toggleLocation = (id: string) => {
    if (selectedLocationIds.includes(id)) {
      onChange(selectedLocationIds.filter(item => item !== id));
    } else {
      onChange([...selectedLocationIds, id]);
    }
  };

  return (
    <div className="location-selector" style={{ border: '1px solid #e5e7eb', borderRadius: '6px', padding: '12px' }}>
      <h3 style={{ marginTop: 0, fontSize: '1rem' }}>Target Locations</h3>
      {locations.length === 0 ? (
        <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>No target locations configured.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px' }}>
          {locations.map((loc) => (
            <label key={loc.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '6px', border: '1px solid #f3f4f6', borderRadius: '4px' }}>
              <input
                type="checkbox"
                checked={selectedLocationIds.includes(loc.id)}
                onChange={() => toggleLocation(loc.id)}
              />
              <span style={{ fontSize: '0.875rem' }}>{formatLocationAddress(loc)}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};
