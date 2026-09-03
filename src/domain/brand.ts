export interface Brand {
  id: string;
  name: string;
  code: string;
  industry: string;
  active: boolean;
  createdAt: string;
}

export type CreateBrandInput = Omit<Brand, 'id' | 'createdAt'>;

export function validateBrand(brand: Partial<Brand>): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!brand.name || brand.name.trim().length === 0) {
    errors.push('Brand name is required');
  }

  if (!brand.code || brand.code.trim().length < 2) {
    errors.push('Brand code must be at least 2 characters');
  }

  if (!brand.industry || brand.industry.trim().length === 0) {
    errors.push('Brand industry is required');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function isBrandActive(brand: Brand): boolean {
  return brand.active;
}

export function formatBrandLabel(brand: Brand): string {
  return `${brand.name} [${brand.code.toUpperCase()}]`;
}
