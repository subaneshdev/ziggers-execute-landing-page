export interface AudienceSegment {
  id: string;
  brandId: string;
  name: string;
  description: string;
  sizeEstimate: number;
  tags: string[];
}

export function validateAudienceSegment(segment: Partial<AudienceSegment>): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!segment.brandId) {
    errors.push('Brand ID is required for audience segment');
  }

  if (!segment.name || segment.name.trim().length === 0) {
    errors.push('Audience name is required');
  }

  if (segment.sizeEstimate !== undefined && segment.sizeEstimate < 0) {
    errors.push('Size estimate cannot be negative');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function matchesBrand(segment: AudienceSegment, brandId: string): boolean {
  return segment.brandId === brandId;
}
