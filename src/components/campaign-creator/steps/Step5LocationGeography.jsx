"use client";
import React, { useState, useEffect } from 'react';
import { 
  MapPin, Search, Sparkles, Trash2, CheckCircle2, 
  AlertCircle, Info, Loader2, ArrowRight, Layers, Navigation, RefreshCw, Star, Plus, 
  Target, ShieldCheck, Zap, Compass, Check
} from 'lucide-react';
import LocationRecommendationCard from '../ui/LocationRecommendationCard';
import GooglePlacesMap from '../ui/GooglePlacesMap';
import { resolveIndustryKey, INDUSTRY_METRIC_PROFILES } from '@/lib/intelligence/brandAdaptation';

export default function Step5LocationGeography({ draft, onUpdate }) {
  const { 
    blueprintActive = false,
    locations = [], 
    brand = 'Brand',
    brandCategory = '',
    brandIndustry = '',
    brandSubcategory = '',
    brandProductLine = '',
    audienceName = '',
    objective = 'Brand Awareness',
    selectedInterests = [],
    ageRange = [20, 35],
    suggestedEnvironments = [],
    recommendedEnvironments = []
  } = draft;

  const currentIndKey = resolveIndustryKey(`${brandCategory} ${brandIndustry} ${brandSubcategory} ${brand}`);
  const profile = INDUSTRY_METRIC_PROFILES[currentIndKey] || INDUSTRY_METRIC_PROFILES.RETAIL_AND_ECOMMERCE;

  const activeEnvironments = (suggestedEnvironments && suggestedEnvironments.length > 0)
    ? suggestedEnvironments
    : (recommendedEnvironments && recommendedEnvironments.length > 0)
      ? recommendedEnvironments
      : profile.environments;

  const [selectedCity, setSelectedCity] = useState('Chennai');
  const [searchAreaInput, setSearchAreaInput] = useState('T Nagar, Chennai');
  const [selectedEnvironmentIndex, setSelectedEnvironmentIndex] = useState(0);
  
  const [isSearching, setIsSearching] = useState(false);
  const [isRanking, setIsRanking] = useState(false);
  const [searchError, setSearchError] = useState('');

  const [discoveredPlaces, setDiscoveredPlaces] = useState([]);
  const [recommendedPlaces, setRecommendedPlaces] = useState([]);
  const [activeCenter, setActiveCenter] = useState({ lat: 13.0827, lng: 80.2707, name: 'Chennai, Tamil Nadu' });
  const [selectedMapPlace, setSelectedMapPlace] = useState(null);
  const [searchRadiusKm, setSearchRadiusKm] = useState(5.0);

  const generateDynamicQuery = (env, city) => {
    const envName = (env?.environment || env?.type || '').toLowerCase();
    if (envName.includes('gym') || envName.includes('fitness') || envName.includes('crossfit')) {
      return `fitness gyms in ${city}`;
    }
    if (envName.includes('studio') || envName.includes('sports') || envName.includes('turf')) {
      return `sports complexes in ${city}`;
    }
    if (envName.includes('food') || envName.includes('dining') || envName.includes('restaurant')) {
      return `popular food courts and restaurants in ${city}`;
    }
    if (envName.includes('cafe') || envName.includes('coffee') || envName.includes('biker cafe')) {
      return `popular cafes and coffee shops in ${city}`;
    }
    if (envName.includes('it park') || envName.includes('tech') || envName.includes('corporate') || envName.includes('sez')) {
      return `major IT parks and corporate campuses in ${city}`;
    }
    if (envName.includes('dealership') || envName.includes('auto') || envName.includes('motor')) {
      return `automobile showrooms in ${city}`;
    }
    if (envName.includes('beauty') || envName.includes('salon') || envName.includes('spa')) {
      return `beauty salons and spas in ${city}`;
    }
    if (envName.includes('mall') || envName.includes('shopping')) {
      return `shopping malls in ${city}`;
    }
    if (envName.includes('college') || envName.includes('university') || envName.includes('campus')) {
      return `colleges and universities in ${city}`;
    }
    return `commercial high streets and malls in ${city}`;
  };

  const handleDiscoverPlaces = async (envToSearch = null) => {
    const targetEnv = envToSearch || activeEnvironments[selectedEnvironmentIndex] || activeEnvironments[0];
    const query = generateDynamicQuery(targetEnv, selectedCity);

    setIsSearching(true);
    setSearchError('');

    try {
      const res = await fetch(`/api/locations/search?q=${encodeURIComponent(query)}&city=${encodeURIComponent(selectedCity)}`);
      const data = await res.json();

      if (data.success && Array.isArray(data.places) && data.places.length > 0) {
        setDiscoveredPlaces(data.places);
        if (data.center) {
          setActiveCenter(data.center);
        }
        handleRankPlaces(data.places, targetEnv);
      } else {
        setSearchError(`No live Google Places found for "${query}". Try another area.`);
        setDiscoveredPlaces([]);
        setRecommendedPlaces([]);
      }
    } catch (err) {
      setSearchError('Live Google Places search encountered an error.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleRankPlaces = async (placesToRank, targetEnv) => {
    setIsRanking(true);
    try {
      const res = await fetch('/api/locations/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand,
          brandIndustry,
          brandProductLine,
          objective,
          audienceName,
          ageRange,
          city: selectedCity,
          environment: targetEnv?.environment || targetEnv?.type || 'Target Environment',
          places: placesToRank
        })
      });

      const data = await res.json();
      if (data.success && Array.isArray(data.recommendations)) {
        setRecommendedPlaces(data.recommendations);
      }
    } catch (err) {
      console.warn('Ranking notice:', err);
    } finally {
      setIsRanking(false);
    }
  };

  useEffect(() => {
    handleDiscoverPlaces(activeEnvironments[0]);
  }, [selectedCity]);

  const toggleLocationPin = (loc) => {
    const exists = locations.some(l => l.name === loc.name || (l.lat === loc.lat && l.lng === loc.lng));
    let next;
    if (exists) {
      next = locations.filter(l => l.name !== loc.name);
    } else {
      next = [
        ...locations,
        {
          id: `loc_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          name: loc.name,
          address: loc.address || loc.formatted_address || loc.name,
          city: selectedCity,
          lat: loc.lat || loc.latitude,
          lng: loc.lng || loc.longitude,
          radiusKm: searchRadiusKm,
          radiusText: `${searchRadiusKm} km radius`,
          rating: loc.rating || 4.5,
          user_ratings_total: loc.user_ratings_total || 120,
          formulaScore: loc.formulaScore || 90,
          matchCategory: loc.matchCategory || 'High Match',
          reasoningChain: loc.reasoningChain || []
        }
      ];
    }
    onUpdate({ locations: next });
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Step Header */}
      <div className="border-b border-espresso/10 pb-5">
        <span className="text-[11px] font-mono font-bold text-gold uppercase tracking-wider block">
          Step 5 • Location & Geography Targeting
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-espresso tracking-tight font-serif mt-1">
          Where should it happen?
        </h2>
        <p className="text-xs sm:text-sm text-muted mt-1 leading-relaxed">
          Ziggers ranks environment types specifically matched to your audience ({audienceName}), then searches and scores real-world Google Places.
        </p>
      </div>

      {/* Section 01: Geography Filters */}
      <div className="bg-white border border-espresso/15 rounded-3xl p-6 sm:p-7 shadow-xs space-y-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-gold/20 text-gold font-mono font-bold text-[10px] flex items-center justify-center">
              01
            </span>
            <h3 className="text-xs font-black text-espresso uppercase tracking-wider">
              Geographic Scope & Geofence Radius
            </h3>
          </div>
          <p className="text-xs text-muted mt-1 ml-7">
            Select metropolitan center and pinpoint target localities with defined GPS geofence zones.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          
          <div className="space-y-1.5">
            <label className="font-bold text-espresso block">Country</label>
            <input
              type="text"
              disabled
              value="India 🇮🇳"
              className="w-full h-11 bg-linen/30 border border-espresso/10 rounded-xl px-4 text-xs sm:text-sm font-bold text-espresso cursor-not-allowed"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-espresso block">Target City</label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full h-11 bg-linen/10 border border-espresso/15 rounded-xl px-3 text-xs sm:text-sm font-bold text-espresso focus:bg-white focus:ring-2 focus:ring-gold/30 focus:border-gold cursor-pointer transition-all"
            >
              <option value="Chennai">Chennai, Tamil Nadu</option>
              <option value="Bengaluru">Bengaluru, Karnataka</option>
              <option value="Mumbai">Mumbai, Maharashtra</option>
              <option value="Delhi NCR">Delhi NCR</option>
              <option value="Hyderabad">Hyderabad, Telangana</option>
              <option value="Pune">Pune, Maharashtra</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-espresso block">Target Area / Locality</label>
            <input
              type="text"
              value={searchAreaInput}
              onChange={(e) => setSearchAreaInput(e.target.value)}
              placeholder="e.g. T Nagar, Anna Nagar"
              className="w-full h-11 bg-linen/10 border border-espresso/15 rounded-xl px-4 text-xs sm:text-sm font-bold text-espresso focus:bg-white focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-espresso block">Geofence Radius</label>
            <select
              value={searchRadiusKm}
              onChange={(e) => setSearchRadiusKm(Number(e.target.value))}
              className="w-full h-11 bg-linen/10 border border-espresso/15 rounded-xl px-3 text-xs sm:text-sm font-bold text-espresso focus:bg-white focus:ring-2 focus:ring-gold/30 focus:border-gold cursor-pointer transition-all"
            >
              <option value={1.0}>1.0 km (Hyperlocal Cluster)</option>
              <option value={3.0}>3.0 km (Standard Hub)</option>
              <option value={5.0}>5.0 km (Full Sub-district)</option>
            </select>
          </div>

        </div>
      </div>

      {/* Section 02: Recommended Environments (with Match Scores) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-gold/20 text-gold font-mono font-bold text-[10px] flex items-center justify-center">
              02
            </span>
            <label className="block text-xs font-black text-espresso uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles size={14} className="text-gold" />
              <span>Recommended Physical Environments for {brand}</span>
            </label>
          </div>
          <span className="text-[11px] font-mono text-muted">Click environment to search places</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {activeEnvironments.map((env, idx) => {
            const isSelected = selectedEnvironmentIndex === idx;
            return (
              <div
                key={idx}
                onClick={() => {
                  setSelectedEnvironmentIndex(idx);
                  handleDiscoverPlaces(env);
                }}
                className={`p-5 rounded-2xl border cursor-pointer transition-all space-y-2.5 ${
                  isSelected
                    ? 'bg-espresso text-white border-espresso shadow-lg ring-2 ring-gold/50'
                    : 'bg-white border-espresso/10 hover:border-espresso/30 text-espresso shadow-2xs hover:shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full ${
                    isSelected ? 'bg-gold text-espresso' : 'bg-green-50 text-green-800 border border-green-200'
                  }`}>
                    {env.relevanceScore || 90}% Match
                  </span>
                  <span className={`text-[10px] font-mono ${isSelected ? 'text-linen/60' : 'text-muted'}`}>
                    #{idx + 1}
                  </span>
                </div>

                <strong className="text-xs sm:text-sm font-black block font-serif leading-snug">
                  {env.environment || env.type}
                </strong>

                <p className={`text-[11px] leading-relaxed line-clamp-2 ${isSelected ? 'text-linen/75' : 'text-muted'}`}>
                  {env.whyExists}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Map & Scored Places Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Google Places Map */}
        <div className="lg:col-span-6 bg-white border border-espresso/15 rounded-3xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-espresso uppercase tracking-wider flex items-center gap-1.5">
              <Compass size={14} className="text-gold" />
              <span>Places Map ({discoveredPlaces.length} Found)</span>
            </span>
            <span className="text-[10px] font-mono text-muted">{selectedCity} Hub</span>
          </div>

          <GooglePlacesMap
            center={activeCenter}
            places={discoveredPlaces}
            selectedPlace={selectedMapPlace}
            pinnedLocations={locations}
            onSelectPlace={(p) => setSelectedMapPlace(p)}
          />
        </div>

        {/* Right: Scored Recommended Places List */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-espresso uppercase tracking-wider flex items-center gap-1.5">
              <Target size={14} className="text-gold" />
              <span>Ranked Venues in {selectedCity}</span>
            </span>
            <span className="text-[10px] font-mono font-bold text-gold bg-espresso px-2 py-0.5 rounded-full">
              {locations.length} Selected
            </span>
          </div>

          {isSearching || isRanking ? (
            <div className="py-16 text-center bg-white border border-espresso/10 rounded-3xl p-6 space-y-2">
              <Loader2 size={24} className="animate-spin text-gold mx-auto" />
              <strong className="text-xs font-bold text-espresso block">Searching & Scoring Venues...</strong>
            </div>
          ) : recommendedPlaces.length === 0 ? (
            <div className="p-8 text-center bg-white border border-espresso/10 rounded-3xl text-xs text-muted">
              No places loaded yet. Click an environment above to discover venues.
            </div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {recommendedPlaces.map((place, idx) => {
                const isPinned = locations.some(l => l.name === place.name || (l.lat === place.lat && l.lng === place.lng));
                return (
                  <LocationRecommendationCard
                    key={idx}
                    place={place}
                    isPinned={isPinned}
                    onTogglePin={toggleLocationPin}
                    onSelectOnMap={(p) => {
                      setSelectedMapPlace(p);
                      if (p.lat && p.lng) {
                        setActiveCenter({ lat: p.lat, lng: p.lng, name: p.name });
                      }
                    }}
                  />
                );
              })}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
