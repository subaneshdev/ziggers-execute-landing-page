"use client";
import React, { useState } from 'react';
import { MapPin, Search, Plus, Layers, Navigation, Info } from 'lucide-react';

export default function IndiaMapPicker({ selectedLocations = [], onAddLocation, onRemoveLocation, onRadiusChange }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRadiusKm, setSelectedRadiusKm] = useState(1.0);
  const [activeLocationIndex, setActiveLocationIndex] = useState(0);

  // Popular Indian Hubs quick-suggestions
  const indianPresets = [
    { name: 'Connaught Place, New Delhi', city: 'Delhi', lat: 28.6315, lng: 77.2167 },
    { name: 'Indiranagar 100ft Road, Bengaluru', city: 'Bengaluru', lat: 12.9784, lng: 77.6408 },
    { name: 'Bandra Linking Road, Mumbai', city: 'Mumbai', lat: 19.0596, lng: 72.8361 },
    { name: 'T. Nagar Ranganathan Street, Chennai', city: 'Chennai', lat: 13.0418, lng: 80.2341 },
    { name: 'Gachibowli Financial District, Hyderabad', city: 'Hyderabad', lat: 17.4401, lng: 78.3489 },
    { name: 'FC Road & Deccan, Pune', city: 'Pune', lat: 18.5204, lng: 73.8412 }
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // Create a new location object
    const newLoc = {
      id: 'loc_' + (globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID().slice(0, 8) : Date.now().toString(36)),
      name: searchQuery.trim(),
      city: searchQuery.split(',')[1]?.trim() || searchQuery.split(' ')[0] || 'India Metro',
      lat: 13.0418 + (selectedLocations.length * 0.01),
      lng: 80.2341 + (selectedLocations.length * 0.01),
      radiusKm: selectedRadiusKm,
      radiusText: selectedRadiusKm >= 1 ? `${selectedRadiusKm} km radius` : `${selectedRadiusKm * 1000} m radius`,
      analyzed: false
    };

    onAddLocation(newLoc);
    setSearchQuery('');
  };

  const handleSelectPreset = (preset) => {
    const newLoc = {
      id: 'loc_' + (globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID().slice(0, 8) : Date.now().toString(36)),
      name: preset.name,
      city: preset.city,
      lat: preset.lat,
      lng: preset.lng,
      radiusKm: selectedRadiusKm,
      radiusText: selectedRadiusKm >= 1 ? `${selectedRadiusKm} km radius` : `${selectedRadiusKm * 1000} m radius`,
      analyzed: false
    };

    onAddLocation(newLoc);
  };

  const activeLoc = selectedLocations[activeLocationIndex] || selectedLocations[0];

  return (
    <div className="space-y-4 font-sans">
      {/* Search Input Bar */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted">
            <Search size={15} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search city, locality, landmark, mall, or pincode across India..."
            className="w-full pl-10 pr-4 py-3 bg-linen/20 border border-espresso/15 rounded-2xl text-xs text-espresso placeholder:text-muted/60 focus:outline-none focus:border-gold font-medium"
          />
        </div>
        <button
          type="submit"
          disabled={!searchQuery.trim()}
          className="bg-espresso hover:bg-muted text-white font-extrabold px-5 py-3 rounded-2xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-40"
        >
          <Plus size={14} className="text-gold" />
          <span>Add Location</span>
        </button>
      </form>

      {/* Quick Indian Hub Suggestions */}
      <div className="flex items-center gap-1.5 flex-wrap text-xs">
        <span className="text-[10px] font-bold text-muted uppercase tracking-wider mr-1">Popular Indian Hubs:</span>
        {indianPresets.map((preset) => (
          <button
            key={preset.name}
            type="button"
            onClick={() => handleSelectPreset(preset)}
            className="px-2.5 py-1 bg-white hover:bg-gold/10 border border-espresso/10 hover:border-gold rounded-xl text-[11px] font-semibold text-espresso transition-all cursor-pointer"
          >
            {preset.city} • {preset.name.split(',')[0]}
          </button>
        ))}
      </div>

      {/* Radius Configuration Bar */}
      <div className="p-4 bg-linen/25 border border-espresso/10 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Navigation size={16} className="text-gold" />
          <div>
            <span className="text-xs font-bold text-espresso block">Activation Geofence Radius</span>
            <span className="text-[10px] text-muted">How far should promoters deploy around the centroid?</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { label: 'Exact Spot', val: 0.1 },
            { label: '250 m', val: 0.25 },
            { label: '500 m', val: 0.5 },
            { label: '1 km', val: 1.0 },
            { label: '2 km', val: 2.0 },
            { label: '3 km', val: 3.0 }
          ].map((r) => (
            <button
              key={r.label}
              type="button"
              onClick={() => {
                setSelectedRadiusKm(r.val);
                if (activeLoc && onRadiusChange) {
                  onRadiusChange(activeLoc.id, r.val, r.label);
                }
              }}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                selectedRadiusKm === r.val
                  ? 'bg-espresso text-gold shadow-2xs'
                  : 'bg-white border border-espresso/15 text-espresso/70 hover:border-espresso/40'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Map Visualizer */}
      <div className="relative w-full h-80 bg-[#f4f1ea] border border-espresso/15 rounded-3xl overflow-hidden shadow-inner flex items-center justify-center">
        {/* Map Grid Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-40" />

        {/* Map Ambient Nodes & Radial Waves */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {/* Outer Coverage Ring */}
          <div 
            className="rounded-full border-2 border-dashed border-gold/40 bg-gold/5 flex items-center justify-center animate-pulse"
            style={{ 
              width: `${Math.min(260, Math.max(90, selectedRadiusKm * 90))}px`, 
              height: `${Math.min(260, Math.max(90, selectedRadiusKm * 90))}px` 
            }}
          >
            {/* Inner Core Radius */}
            <div className="w-16 h-16 rounded-full bg-gold/15 border border-gold/60 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-espresso text-gold flex items-center justify-center shadow-md">
                <MapPin size={10} className="text-gold" />
              </div>
            </div>
          </div>
        </div>

        {/* Centered Map Label Info Box */}
        <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-xs border border-espresso/15 p-3 rounded-2xl shadow-sm flex items-center justify-between z-10 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-espresso text-gold flex items-center justify-center shrink-0">
              <MapPin size={16} />
            </div>
            <div>
              <strong className="text-espresso font-extrabold block truncate max-w-xs sm:max-w-md">
                {activeLoc ? activeLoc.name : 'Search and select an activation location'}
              </strong>
              <span className="text-[10px] text-muted block">
                {activeLoc ? `Geofence: ${selectedRadiusKm >= 1 ? selectedRadiusKm + ' km radius' : selectedRadiusKm * 1000 + ' m radius'} • H3 Resolution: 8–9` : 'Enter a venue, high street, or tech park above'}
              </span>
            </div>
          </div>
          {activeLoc && (
            <span className="hidden sm:inline-block px-2.5 py-1 bg-green-50 text-green-700 font-bold text-[10px] rounded-lg border border-green-200">
              Centroid Anchored
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
