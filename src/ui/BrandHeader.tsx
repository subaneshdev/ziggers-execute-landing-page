import React from 'react';
import { Brand, formatBrandLabel } from '../domain/brand';

interface BrandHeaderProps {
  brands: Brand[];
  selectedBrandId: string | null;
  onSelectBrand: (brandId: string) => void;
}

export const BrandHeader: React.FC<BrandHeaderProps> = ({
  brands,
  selectedBrandId,
  onSelectBrand,
}) => {
  return (
    <header className="brand-header" style={{ padding: '16px', backgroundColor: '#1f2937', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>Enterprise Marketing Activation Platform</h1>
        <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem', color: '#9ca3af' }}>Campaign Execution & Channel Integration Hub</p>
      </div>
      <div>
        <label htmlFor="brand-select" style={{ marginRight: '8px', fontSize: '0.875rem' }}>Active Brand:</label>
        <select
          id="brand-select"
          value={selectedBrandId || ''}
          onChange={(e) => onSelectBrand(e.target.value)}
          style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid #4b5563', backgroundColor: '#374151', color: '#fff' }}
        >
          {brands.map((brand) => (
            <option key={brand.id} value={brand.id}>
              {formatBrandLabel(brand)}
            </option>
          ))}
        </select>
      </div>
    </header>
  );
};
