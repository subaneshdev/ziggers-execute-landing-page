/**
 * Ziggers Intelligence - Mobility, Weather & Events Providers
 * Models environmental and real-time contextual signals impacting on-ground footfall.
 */

import { DataProviderInterface } from './dataProviderInterface.js';

export class MobilityProvider extends DataProviderInterface {
  constructor() {
    super('Urban_Mobility_Index_v2', 'MOBILITY');
  }

  async fetchData({ locationNode, dayOfWeek = 6 }) {
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const isTechPark = (locationNode?.locationType || '').toLowerCase().includes('tech') || 
                       (locationNode?.locationType || '').toLowerCase().includes('office');
    
    // Weekend vs Weekday Mobility Index
    let mobilityFactor = 1.0;
    if (isWeekend) {
      mobilityFactor = isTechPark ? 0.45 : 1.38; // Tech parks dip on weekends, retail surges
    } else {
      mobilityFactor = isTechPark ? 1.40 : 0.95; // Tech parks peak on weekdays
    }

    return {
      data: {
        mobilityFactor,
        isWeekend,
        transitAccessibilityScore: 88
      },
      confidence: 0.88
    };
  }
}

export class WeatherProvider extends DataProviderInterface {
  constructor() {
    super('Atmospheric_Impact_Model_v1', 'WEATHER');
  }

  async fetchData({ city, month = new Date().getMonth() + 1 }) {
    // Calibrated seasonal weather friction coefficient for Indian metros
    // (Monsoon/heavy rain reduces outdoor footfall by 30-40%, pleasant weather elevates it)
    const isMonsoon = (city === 'Chennai' && (month === 10 || month === 11)) || // North-East monsoon
                      (city === 'Mumbai' && (month >= 6 && month <= 8));        // South-West monsoon

    const weatherImpactCoefficient = isMonsoon ? 0.72 : 1.0;

    return {
      data: {
        condition: isMonsoon ? 'Heavy Seasonal Showers' : 'Clear & Favorable',
        weatherImpactCoefficient,
        outdoorActivationSuitability: isMonsoon ? 'Moderate (Covered Locations Recommended)' : 'High'
      },
      confidence: 0.85
    };
  }
}

export class EventProvider extends DataProviderInterface {
  constructor() {
    super('Metro_Event_Intelligence_v1', 'EVENTS');
  }

  async fetchData({ city, date = new Date() }) {
    return {
      data: {
        hasSpecialFestival: false,
        eventMultiplier: 1.0,
        notes: 'Normal commercial traffic period'
      },
      confidence: 0.80
    };
  }
}
