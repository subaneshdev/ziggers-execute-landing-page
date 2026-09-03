"use client";
import React, { useState } from 'react';
import { MapPin, Layers, Navigation, Eye, CheckCircle2, Star } from 'lucide-react';

export default function GooglePlacesMap({
  center = { lat: 13.0418, lng: 80.2341, name: 'Chennai Central' },
  discoveredPlaces = [],
  selectedLocations = [],
  selectedRadiusKm = 1.0,
  onSelectPlace,
  activePlace = null
}) {
  const [activeLayers, setActiveLayers] = useState({
    places: true,
    geofences: true,
    poiSignals: true
  });

  const toggleLayer = (layerKey) => {
    setActiveLayers(prev => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  return (
    <div className="relative w-full h-[450px] lg:h-[550px] bg-[#f2eee3] border border-espresso/15 rounded-3xl overflow-hidden shadow-inner flex flex-col justify-between font-sans">
      
      {/* Top Map Layer Controls */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        {/* Layer Toggles */}
        <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-xs border border-espresso/15 p-1.5 rounded-2xl shadow-xs pointer-events-auto text-[10px] font-bold text-espresso">
          <button
            type="button"
            onClick={() => toggleLayer('places')}
            className={`px-2.5 py-1 rounded-xl transition-all ${
              activeLayers.places ? 'bg-espresso text-gold' : 'hover:bg-linen'
            }`}
          >
            📍 Places ({discoveredPlaces.length})
          </button>
          <button
            type="button"
            onClick={() => toggleLayer('geofences')}
            className={`px-2.5 py-1 rounded-xl transition-all ${
              activeLayers.geofences ? 'bg-espresso text-gold' : 'hover:bg-linen'
            }`}
          >
            ⭕ Geofences ({selectedLocations.length})
          </button>
        </div>

        {/* Centroid Badge */}
        <div className="hidden sm:flex items-center gap-1.5 bg-white/90 backdrop-blur-xs border border-espresso/15 px-3 py-1.5 rounded-2xl shadow-xs text-xs font-mono font-bold text-espresso">
          <Navigation size={12} className="text-gold" />
          <span>{center.name || 'Selected Area'}</span>
        </div>
      </div>

      {/* Interactive Map Visual Surface */}
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        {/* Map Grid Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-50" />

        {/* Ambient Topography Nodes */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {/* Outer Geofence Ring */}
          {activeLayers.geofences && (
            <div 
              className="rounded-full border-2 border-dashed border-gold/60 bg-gold/5 flex items-center justify-center animate-pulse"
              style={{ 
                width: `${Math.min(360, Math.max(120, selectedRadiusKm * 110))}px`, 
                height: `${Math.min(360, Math.max(120, selectedRadiusKm * 110))}px` 
              }}
            >
              {/* Inner Focus Core */}
              <div className="w-20 h-20 rounded-full bg-gold/20 border border-gold/70 flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-espresso text-gold flex items-center justify-center shadow-lg">
                  <MapPin size={14} className="text-gold" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Discovered Place Markers on Map */}
        {activeLayers.places && discoveredPlaces.slice(0, 8).map((place, idx) => {
          const isSelected = selectedLocations.some(l => l.placeId === place.placeId || l.name === place.name);
          const isActive = activePlace?.placeId === place.placeId;

          // Compute pseudo-offsets around centroid for spatial visual spread
          const angle = (idx * (360 / Math.max(1, discoveredPlaces.length))) * (Math.PI / 180);
          const dist = 70 + ((idx % 3) * 35);
          const offsetX = Math.cos(angle) * dist;
          const offsetY = Math.sin(angle) * dist;

          return (
            <div
              key={place.placeId || idx}
              onClick={() => onSelectPlace && onSelectPlace(place)}
              className={`absolute cursor-pointer transition-all duration-300 transform -translate-x-1/2 -translate-y-1/2 group z-10 ${
                isActive ? 'scale-125 z-30' : isSelected ? 'scale-110' : 'hover:scale-115'
              }`}
              style={{
                top: `calc(50% + ${offsetY}px)`,
                left: `calc(50% + ${offsetX}px)`
              }}
            >
              <div className={`px-2.5 py-1 rounded-xl shadow-md flex items-center gap-1.5 text-[10px] font-extrabold border transition-all ${
                isSelected
                  ? 'bg-green-700 text-white border-green-800 ring-2 ring-green-400/40'
                  : isActive
                  ? 'bg-gold text-espresso border-espresso ring-2 ring-gold/50'
                  : 'bg-white text-espresso border-espresso/20 group-hover:border-gold'
              }`}>
                <MapPin size={11} className={isSelected ? 'text-white' : 'text-gold'} />
                <span className="truncate max-w-[100px] sm:max-w-[140px]">{place.name}</span>
                {place.rating && (
                  <span className="text-[9px] font-mono opacity-80">★{place.rating}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Info Ribbon */}
      <div className="p-3 bg-white/95 backdrop-blur-xs border-t border-espresso/15 z-20 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-ping" />
          <span className="text-muted text-[11px]">
            Showing <strong>{discoveredPlaces.length} verified Google Places</strong> in {selectedRadiusKm} km radius
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted font-mono">
            Centroid: {center.lat?.toFixed(4)}, {center.lng?.toFixed(4)}
          </span>
        </div>
      </div>

    </div>
  );
}
