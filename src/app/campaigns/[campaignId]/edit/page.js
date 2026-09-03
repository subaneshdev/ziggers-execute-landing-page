"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import CampaignCreationLayout from '@/components/campaign-creator/CampaignCreationLayout';
import { Loader2 } from 'lucide-react';

export default function EditCampaignDraftPage() {
  const params = useParams();
  const campaignId = params?.campaignId;
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCampaign() {
      try {
        const res = await fetch(`/api/campaigns?id=${campaignId}`);
        const data = await res.json();
        if (data.success && data.campaign) {
          setInitialData({
            name: data.campaign.name || data.campaign.title,
            objective: data.campaign.objective || data.campaign.campaign_type,
            budgetInr: data.campaign.guaranteed_payout || 50000,
            locations: [{
              id: 'loc_saved',
              name: data.campaign.location || data.campaign.location_name,
              city: data.campaign.city || 'Chennai',
              radiusKm: 1.0,
              radiusText: '1 km radius',
              analyzed: true
            }],
            campaignDays: 7,
            shiftHours: 5,
            primaryKpi: 'Samples Distributed'
          });
        }
      } catch (err) {
        console.warn('Failed to load draft campaign:', err);
      } finally {
        setLoading(false);
      }
    }

    if (campaignId) {
      loadCampaign();
    } else {
      setLoading(false);
    }
  }, [campaignId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-gold" />
          <span className="text-xs font-bold text-muted">Loading Campaign Blueprint...</span>
        </div>
      </div>
    );
  }

  return <CampaignCreationLayout initialData={initialData} campaignId={campaignId} />;
}
