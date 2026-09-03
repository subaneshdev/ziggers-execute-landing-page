"use client";
import React from 'react';
import { Filter, Layers, Navigation, Check } from 'lucide-react';

export const PLACE_CATEGORIES = [
  { id: 'shopping_mall', label: 'Malls & Retail' },
  { id: 'gym', label: 'Gyms & Fitness' },
  { id: 'university', label: 'Colleges & Univ' },
  { id: 'school', label: 'Schools & Coaching' },
  { id: 'corporate', label: 'IT & Business Parks' },
  { id: 'transit_station', label: 'Metro & Railway' },
  { id: 'cafe', label: 'Cafes & Dining' },
  { id: 'park', label: 'Parks & Promenades' },
  { id: 'stadium', label: 'Sports & Stadiums' },
  { id: 'supermarket', label: 'Supermarkets' },
  { id: 'hospital', label: 'Hospitals & Medical' },
  { id: 'market', label: 'High Streets & Bazaars' }
];

export default function PlaceDiscoveryFilter({
  selectedTypes = ['shopping_mall', 'gym'],
  onToggleType,
  audienceMatchFilter = 'All',
  onSetAudienceMatchFilter,
  searchRadiusKm = 3.0,
  onSetSearchRadiusKm
}) {
  return (
    <div className="bg-linen/25 border border-espresso/10 rounded-2xl p-4 space-y-4 text-xs font-sans">
      
      {/* 1. Location Category Multi-select */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="font-bold text-espresso uppercase text-[10px] tracking-wider flex items-center gap-1.5">
            <Layers size={13} className="text-gold" />
            <span>Target Place Types ({selectedTypes.length})</span>
          </label>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {PLACE_CATEGORIES.map((cat) => {
            const isSelected = selectedTypes.includes(cat.id);
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onToggleType(cat.id)}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-all flex items-center gap-1 cursor-pointer ${
                  isSelected
                    ? 'bg-espresso text-gold border-espresso shadow-2xs'
                    : 'bg-white text-espresso/70 border-espresso/10 hover:border-espresso/30'
                }`}
              >
                {isSelected && <Check size={11} strokeWidth={3} />}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Radius & Match Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-espresso/10">
        
        {/* Search Radius */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-muted uppercase tracking-wider block">
            Search Discovery Radius
          </label>
          <div className="flex items-center gap-1.5 flex-wrap">
            {[1.0, 3.0, 5.0, 10.0].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => onSetSearchRadiusKm(r)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  searchRadiusKm === r
                    ? 'bg-gold text-espresso font-extrabold shadow-2xs'
                    : 'bg-white border border-espresso/10 text-espresso/70 hover:border-gold'
                }`}
              >
                {r} km
              </button>
            ))}
          </div>
        </div>

        {/* Audience Match Filter */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-muted uppercase tracking-wider block">
            Audience Alignment Filter
          </label>
          <div className="flex items-center gap-1">
            {['All', 'High Match', 'Medium Match'].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => onSetAudienceMatchFilter(m)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  audienceMatchFilter === m
                    ? 'bg-espresso text-gold'
                    : 'bg-white border border-espresso/10 text-espresso/70 hover:border-espresso/30'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
