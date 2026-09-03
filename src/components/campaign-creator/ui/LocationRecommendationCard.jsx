"use client";
import React from 'react';
import { MapPin, Star, Plus, Check, Navigation, Clock, Sparkles, Eye, ShieldCheck } from 'lucide-react';

export default function LocationRecommendationCard({
  place,
  isAdded = false,
  onAdd,
  onRemove,
  onSelectMap
}) {
  const matchColor = 
    place.audienceMatch === 'High' ? 'bg-green-50 text-green-700 border-green-200' :
    place.audienceMatch === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-200' :
    'bg-linen text-espresso border-espresso/10';

  return (
    <div className={`p-4 rounded-2xl border transition-all space-y-3 font-sans ${
      isAdded 
        ? 'bg-gold/5 border-gold ring-1 ring-gold/40 shadow-xs' 
        : 'bg-white border-espresso/15 hover:border-espresso/35 shadow-2xs'
    }`}>
      {/* Top Header: Place Name & Category */}
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-bold text-muted uppercase tracking-wider bg-linen/50 px-2 py-0.5 rounded">
              {place.locationType || 'Venue'}
            </span>
            {place.rating && (
              <span className="text-[10px] font-mono font-bold text-espresso bg-gold/15 px-1.5 py-0.5 rounded flex items-center gap-1">
                <Star size={10} className="fill-gold text-gold" />
                <span>{place.rating}</span>
                {place.userRatingsTotal > 0 && <span className="text-muted">({place.userRatingsTotal})</span>}
              </span>
            )}
            {place.distanceText && (
              <span className="text-[10px] font-mono text-muted">
                • {place.distanceText}
              </span>
            )}
          </div>

          <h4 className="text-xs font-black text-espresso tracking-tight">
            {place.name}
          </h4>
          <p className="text-[11px] text-muted line-clamp-1">
            {place.formattedAddress}
          </p>
        </div>

        {/* Audience Match Badge */}
        {place.audienceMatch && (
          <span className={`px-2 py-1 rounded-lg text-[10px] font-extrabold border shrink-0 ${matchColor}`}>
            {place.audienceMatch} Match
          </span>
        )}
      </div>

      {/* Why This Location Rationale */}
      {place.whyThisLocation && (
        <div className="p-3 bg-linen/20 border border-espresso/10 rounded-xl space-y-1 text-xs">
          <span className="text-[10px] font-bold text-gold uppercase tracking-wider flex items-center gap-1">
            <Sparkles size={11} /> Why This Location
          </span>
          <p className="text-[11px] text-espresso leading-relaxed">
            {place.whyThisLocation}
          </p>
          {place.bestTime && (
            <div className="text-[10px] text-muted pt-1 flex items-center gap-1 font-mono">
              <Clock size={11} className="text-gold" />
              <span>Optimal Shift: {place.bestTime}</span>
            </div>
          )}
        </div>
      )}

      {/* Card Action Controls */}
      <div className="flex items-center justify-between pt-1 border-t border-espresso/5">
        <button
          type="button"
          onClick={() => onSelectMap && onSelectMap(place)}
          className="text-[11px] font-bold text-muted hover:text-espresso flex items-center gap-1 cursor-pointer transition-colors"
        >
          <Eye size={12} />
          <span>View on Map</span>
        </button>

        {isAdded ? (
          <button
            type="button"
            onClick={() => onRemove && onRemove(place.placeId)}
            className="px-3 py-1.5 bg-green-50 border border-green-300 text-green-800 rounded-xl text-[11px] font-extrabold flex items-center gap-1.5 cursor-pointer hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition-colors"
          >
            <Check size={12} strokeWidth={3} />
            <span>Added to Campaign</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onAdd && onAdd(place)}
            className="px-3.5 py-1.5 bg-espresso hover:bg-muted text-white rounded-xl text-[11px] font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            <Plus size={12} className="text-gold" />
            <span>Add Location</span>
          </button>
        )}
      </div>

    </div>
  );
}
