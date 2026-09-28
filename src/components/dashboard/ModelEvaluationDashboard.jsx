"use client";
import React, { useState, useEffect } from 'react';
import { 
  Activity, TrendingUp, CheckCircle2, AlertTriangle, Database, 
  Layers, ShieldCheck, RefreshCw, BarChart3, HelpCircle, ArrowUpRight,
  Sparkles, Target, Cpu, Clock, Calendar, Check, Zap, Split, Award,
  Sliders, AlertCircle, Info, Lock
} from 'lucide-react';
import { 
  calculateModelValidationMetrics, 
  performTemporalHoldoutValidation,
  getModelMaturity, 
  updateBetaBinomialRate, 
  BAYESIAN_METRIC_DEFINITIONS, 
  PRIOR_STRENGTH_LEVELS,
  METRIC_BENCHMARKS
} from '@/lib/intelligence/clientForecast';

// Benchmark test fixtures for explicit Demo Mode ONLY
const DEMO_BENCHMARK_PAIRS = [
  { campaignName: 'Red Bull sampling (T. Nagar)', predicted: 5200, actual: 4850, lowerBound: 4200, upperBound: 6100, objective: 'Product Sampling', date: '2026-08-10', locationType: 'Commercial' },
  { campaignName: 'Cult.fit Pass Launch (Indiranagar)', predicted: 3100, actual: 3350, lowerBound: 2600, upperBound: 3700, objective: 'Lead Generation', date: '2026-08-04', locationType: 'High Street' },
  { campaignName: 'Zepto Flyer Blitz (Koramangala)', predicted: 8400, actual: 7900, lowerBound: 7100, upperBound: 9600, objective: 'Retail Activation', date: '2026-07-28', locationType: 'Transit Hub' },
  { campaignName: 'Ather Energy Test Ride (Velachery)', predicted: 1800, actual: 1950, lowerBound: 1400, upperBound: 2250, objective: 'Lead Generation', date: '2026-07-20', locationType: 'Tech Corridor' },
  { campaignName: 'HDFC Sky Demat Drive (Cyber City)', predicted: 2400, actual: 2150, lowerBound: 1900, upperBound: 2900, objective: 'App Downloads', date: '2026-07-12', locationType: 'Tech Park' },
  { campaignName: 'Swiggy Instamart Tea Sampling (Anna Nagar)', predicted: 6500, actual: 6800, lowerBound: 5400, upperBound: 7600, objective: 'Product Sampling', date: '2026-07-02', locationType: 'Commercial' }
];

export default function ModelEvaluationDashboard() {
  const [selectedMetric, setSelectedMetric] = useState('samples'); // 'samples', 'footfall', 'qrScans', 'leads'
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [viewMode, setViewMode] = useState('overall'); // 'overall' | 'holdout'
  const [isLoading, setIsLoading] = useState(true);
  const [apiEvaluation, setApiEvaluation] = useState(null);

  // Fetch real database-backed evaluation data for authenticated tenant
  useEffect(() => {
    let isMounted = true;
    async function fetchEvaluation() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/ml/evaluation?tenantId=default_org&metric=${selectedMetric}`);
        const data = await res.json();
        if (isMounted && data.success) {
          setApiEvaluation(data);
        }
      } catch (err) {
        console.warn('Evaluation API fetch error:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    fetchEvaluation();
    return () => { isMounted = false; };
  }, [selectedMetric]);

  // Determine active dataset: Real database records in production, or synthetic benchmark only in explicit demo mode
  const realPairs = apiEvaluation?.pairs || [];
  const validationData = isDemoMode ? DEMO_BENCHMARK_PAIRS : realPairs;
  const observationCount = isDemoMode ? DEMO_BENCHMARK_PAIRS.length : (apiEvaluation?.observationCount || 0);
  const isSufficient = isDemoMode ? true : (apiEvaluation?.isSufficient || false);
  const dataSource = isDemoMode ? 'DEMO_DATA (Synthetic Benchmarks)' : (apiEvaluation?.dataSource || 'ZIGGERS_WAL_SQLITE_AUDITED');
  const modelVersion = apiEvaluation?.modelVersion || 'bayes-v2.0';
  const configVersion = apiEvaluation?.configurationVersion || 'v1.0_canonical_invariant';
  const calculationTimestamp = apiEvaluation?.calculatedAt || new Date().toISOString();

  // Bayesian Simulator State
  const [bayesianMetric, setBayesianMetric] = useState('qr_scan_rate');
  const [priorStrength, setPriorStrength] = useState('LOCATION_TYPE_DATA');
  const [simK, setSimK] = useState(38); // Successes
  const [simN, setSimN] = useState(250); // Opportunities

  // Compute Overall Error Metrics via Unified Engine
  const metricsResult = calculateModelValidationMetrics(validationData, selectedMetric);

  // Compute Temporal Holdout Validation (Train 75% / Test 25%)
  const holdoutResult = performTemporalHoldoutValidation(validationData, 0.70, selectedMetric);

  // Compute Bayesian Posterior
  const bayesianResult = updateBetaBinomialRate({
    metricKey: bayesianMetric,
    successCount: simK,
    opportunityCount: simN,
    priorStrengthLevel: priorStrength
  });

  return (
    <div className="space-y-8 animate-fade-in text-espresso">
      
      {/* Top Demo Mode Banner if active */}
      {isDemoMode && (
        <div className="bg-amber-500/10 border-2 border-amber-500/30 p-3.5 rounded-2xl flex items-center justify-between text-amber-900 text-xs">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-amber-500 text-white font-mono font-bold text-[10px]">
              DEMO DATA
            </span>
            <span className="font-semibold">
              Currently viewing synthetic benchmarking data for illustrative evaluation purposes. Real database telemetry is bypassed in this view.
            </span>
          </div>
          <button
            onClick={() => setIsDemoMode(false)}
            className="text-[11px] font-bold text-amber-900 underline hover:text-amber-950 cursor-pointer"
          >
            Switch to Live Telemetry
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-espresso text-linen p-8 rounded-3xl relative overflow-hidden shadow-xl border border-white/10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-gold text-xs font-mono mb-3 border border-gold/20">
              <Activity className="w-3.5 h-3.5" />
              <span>HIERARCHICAL BAYESIAN STATISTICAL CAMPAIGN ENGINE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif text-white font-normal">
              Predictive Intelligence <span className="text-gold italic">& Temporal Holdout Validation</span>
            </h2>
            <p className="text-linen/70 text-sm max-w-2xl mt-2 font-sans">
              Compare offline campaign forecasts against verified on-ground actuals. Track zero-safe error metrics (WAPE, sMAPE, MAE, RMSE), nominal 90% forecast range calibration, and Beta-Binomial Bayesian parameter updates with temporal holdout separation.
            </p>
            
            {/* Live vs Demo Toggle */}
            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={() => setIsDemoMode(!isDemoMode)}
                className={`text-xs px-3.5 py-1.5 rounded-xl font-mono flex items-center gap-2 transition-all cursor-pointer ${
                  isDemoMode 
                    ? 'bg-amber-400 text-espresso font-bold shadow-md' 
                    : 'bg-white/10 text-linen/90 hover:bg-white/20 border border-white/15'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>{isDemoMode ? 'Demo Mode Active' : 'Enable Demo Mode'}</span>
                {isDemoMode && <span className="text-[10px] bg-espresso text-white px-1.5 py-0.2 rounded font-bold">DEMO DATA</span>}
              </button>
              <span className="text-[11px] text-linen/50 font-mono">
                {isDemoMode ? 'Showing synthetic reference pairs' : 'Querying tenant-isolated database'}
              </span>
            </div>
          </div>

          {/* Model Maturity Badge */}
          <div className="bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10 flex flex-col items-start min-w-[270px]">
            <span className="text-[10px] text-linen/50 uppercase tracking-wider font-mono">Statistical Confidence Tier</span>
            <div className="flex items-center gap-2 mt-1.5">
              <span className={`w-2.5 h-2.5 rounded-full ${observationCount >= 2000 ? 'bg-green-400' : (observationCount >= 30 ? 'bg-amber-400 animate-pulse' : 'bg-orange-400')}`} />
              <span className="text-white font-serif text-base font-medium">
                {isDemoMode ? 'DEMO DATA (Synthetic)' : metricsResult.maturity.label}
              </span>
            </div>
            <div className="flex items-center justify-between w-full mt-3 pt-3 border-t border-white/10 text-xs">
              <span className="text-linen/70 font-mono">Verified Campaigns</span>
              <strong className="text-gold font-mono">{observationCount} / {isDemoMode ? '6 Demo' : '10 Min Required'}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Honest Data Maturity & Provenance Metadata Card */}
      <div className="bg-white p-5 rounded-3xl border border-espresso/10 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-espresso/10">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-gold" />
            <strong className="text-xs font-mono uppercase tracking-wider text-espresso">
              Honest Data Provenance & Model Telemetry Metadata
            </strong>
          </div>
          <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full ${
            isDemoMode ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-green-50 text-green-800 border border-green-200'
          }`}>
            {isDemoMode ? 'DEMO DATA' : 'AUTHENTICATED TENANT RECORD'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 pt-3 font-mono text-xs">
          <div className="p-3 bg-linen/20 rounded-2xl border border-espresso/5">
            <span className="text-[10px] text-espresso/50 block">Verified Campaigns</span>
            <strong className="text-espresso block mt-0.5">{observationCount}</strong>
          </div>
          <div className="p-3 bg-linen/20 rounded-2xl border border-espresso/5">
            <span className="text-[10px] text-espresso/50 block">Minimum Required</span>
            <strong className="text-espresso block mt-0.5">10 Campaigns</strong>
          </div>
          <div className="p-3 bg-linen/20 rounded-2xl border border-espresso/5">
            <span className="text-[10px] text-espresso/50 block">Data Source</span>
            <strong className="text-espresso text-[11px] block mt-0.5 truncate" title={dataSource}>{dataSource}</strong>
          </div>
          <div className="p-3 bg-linen/20 rounded-2xl border border-espresso/5">
            <span className="text-[10px] text-espresso/50 block">Model Version</span>
            <strong className="text-espresso block mt-0.5">{modelVersion}</strong>
          </div>
          <div className="p-3 bg-linen/20 rounded-2xl border border-espresso/5">
            <span className="text-[10px] text-espresso/50 block">Config Version</span>
            <strong className="text-espresso text-[11px] block mt-0.5 truncate" title={configVersion}>{configVersion}</strong>
          </div>
          <div className="p-3 bg-linen/20 rounded-2xl border border-espresso/5">
            <span className="text-[10px] text-espresso/50 block">Maturity Tier</span>
            <strong className="text-espresso block mt-0.5">{isDemoMode ? 'DEMO' : (apiEvaluation?.maturityTier || 'INSUFFICIENT')}</strong>
          </div>
          <div className="p-3 bg-linen/20 rounded-2xl border border-espresso/5">
            <span className="text-[10px] text-espresso/50 block">Calculated At</span>
            <strong className="text-espresso text-[10px] block mt-0.5 truncate">{calculationTimestamp.substring(11, 19)} UTC</strong>
          </div>
        </div>
      </div>

      {/* Statistical Maturity Scale */}
      <div className="bg-white p-6 rounded-3xl border border-espresso/10 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-espresso/80 font-mono">
            Ground-Truth Empirical Confidence Scale
          </h3>
          <span className="text-xs text-espresso/60">Target for High Confidence: 2,000+ Observations</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2.5 font-mono text-xs">
          {[
            { range: '0–9', label: 'Insufficient', active: observationCount < 10 },
            { range: '10–29', label: 'Early Signal', active: observationCount >= 10 && observationCount < 30 },
            { range: '30–99', label: 'Preliminary', active: observationCount >= 30 && observationCount < 100 },
            { range: '100–499', label: 'Calibrating', active: observationCount >= 100 && observationCount < 500 },
            { range: '500–1,999', label: 'Established', active: observationCount >= 500 && observationCount < 2000 },
            { range: '2,000+', label: 'High Confidence', active: observationCount >= 2000 }
          ].map((stage, idx) => (
            <div 
              key={idx} 
              className={`p-3 rounded-2xl border text-center transition-all ${
                stage.active 
                  ? 'bg-espresso text-white border-gold/40 shadow-sm' 
                  : 'bg-linen/30 text-espresso/70 border-espresso/10'
              }`}
            >
              <span className="text-[10px] block opacity-70">{stage.range} OBS</span>
              <strong className="block text-[11px] mt-0.5">{stage.label}</strong>
            </div>
          ))}
        </div>
      </div>

      {/* Validation Mode Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 bg-linen/50 p-1 rounded-2xl border border-espresso/10">
          <button 
            onClick={() => setViewMode('overall')}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
              viewMode === 'overall' ? 'bg-espresso text-white shadow-xs' : 'text-espresso/70 hover:text-espresso'
            }`}
          >
            All Historical Observations ({validationData.length})
          </button>
          <button 
            onClick={() => setViewMode('holdout')}
            className={`px-4 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all ${
              viewMode === 'holdout' ? 'bg-espresso text-white shadow-xs' : 'text-espresso/70 hover:text-espresso'
            }`}
          >
            <Split className="w-3.5 h-3.5" />
            <span>Temporal Holdout Validation (70/30 Split)</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-espresso/60 font-mono">Metric:</span>
          <select 
            value={selectedMetric} 
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="text-xs bg-white border border-espresso/20 rounded-xl px-3 py-1.5 font-medium outline-none focus:border-gold shadow-xs"
          >
            <option value="samples">Product Samples</option>
            <option value="footfall">Footfall Exposure</option>
            <option value="qrScans">QR Scans</option>
            <option value="leads">Leads Generated</option>
          </select>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* WAPE */}
        <div className="bg-white p-6 rounded-3xl border border-espresso/10 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase text-espresso/60">WAPE (Zero-Safe)</span>
            <span className="px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-[10px] font-mono border border-green-200">
              Target: &lt;{METRIC_BENCHMARKS[selectedMetric]?.targetWape}%
            </span>
          </div>
          <strong className="text-2xl font-serif text-espresso block mt-1">
            {(!isDemoMode && !isSufficient) ? 'N/A' : (metricsResult.formatted?.wape || 'N/A')}
          </strong>
          <span className="text-xs text-espresso/60 block mt-2">
            {(!isDemoMode && !isSufficient) 
              ? `Requires 10 verified campaigns (Current: ${observationCount})` 
              : `Weighted Absolute Percentage Error across ${observationCount} campaigns`}
          </span>
        </div>

        {/* MAE & RMSE */}
        <div className="bg-white p-6 rounded-3xl border border-espresso/10 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase text-espresso/60">Mean Absolute Error (MAE)</span>
            <BarChart3 className="w-4 h-4 text-espresso/40" />
          </div>
          <strong className="text-2xl font-serif text-espresso block mt-1">
            {(!isDemoMode && !isSufficient) ? 'N/A' : (metricsResult.formatted?.mae || 'N/A')}
          </strong>
          <span className="text-xs text-espresso/60 block mt-2">
            {(!isDemoMode && !isSufficient) 
              ? 'Root Mean Square Error: N/A' 
              : `Root Mean Square Error: ${metricsResult.formatted?.rmse || 'N/A'}`}
          </span>
        </div>

        {/* Prediction Bias */}
        <div className="bg-white p-6 rounded-3xl border border-espresso/10 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase text-espresso/60">Prediction Bias</span>
            <TrendingUp className="w-4 h-4 text-espresso/40" />
          </div>
          <strong className={`text-2xl font-serif block mt-1 ${(!isDemoMode && !isSufficient) ? 'text-espresso/60' : (metricsResult.metrics.predictionBias >= 0 ? 'text-amber-600' : 'text-blue-600')}`}>
            {(!isDemoMode && !isSufficient) ? 'N/A' : (metricsResult.formatted?.bias || 'N/A')}
          </strong>
          <span className="text-xs text-espresso/60 block mt-2">
            {(!isDemoMode && !isSufficient)
              ? 'Awaiting verified completed campaigns'
              : (metricsResult.metrics.predictionBias >= 0 ? 'Slight tendency to over-forecast' : 'Conservative under-forecast')}
          </span>
        </div>

        {/* Range Coverage & Calibration */}
        <div className="bg-white p-6 rounded-3xl border border-espresso/10 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase text-espresso/60">90% Range Coverage</span>
            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-mono border border-blue-200">
              Calibration: {(!isDemoMode && !isSufficient) ? 'Pending Data' : (metricsResult.calibrationStatus === 'CALIBRATED' ? 'Optimal' : 'Tuning')}
            </span>
          </div>
          <strong className="text-2xl font-serif text-espresso block mt-1">
            {(!isDemoMode && !isSufficient) ? 'N/A' : `${metricsResult.metrics.nominalRangeCoverage}%`}
          </strong>
          <span className="text-xs text-espresso/60 block mt-2">
            {(!isDemoMode && !isSufficient)
              ? 'Calibration requires completed verification proofs'
              : `Calibration Error: ${metricsResult.metrics.calibrationError}% vs nominal 90%`}
          </span>
        </div>
      </div>

      {/* Two-Column Section: Table + Conjugate Bayesian Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Predicted vs Actual Campaign Results Table */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-espresso/10 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-espresso/10">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg text-espresso">
                  {viewMode === 'holdout' ? 'Holdout Test Set Validation (Unseen Data)' : 'Predicted vs. Actual Campaign Outcomes'}
                </h3>
                {isDemoMode && (
                  <span className="text-[9px] font-mono font-bold bg-amber-100 text-amber-800 border border-amber-300 px-1.5 py-0.5 rounded">
                    DEMO DATA
                  </span>
                )}
              </div>
              <p className="text-xs text-espresso/60">
                {isDemoMode
                  ? 'Reference benchmark pairs for display demonstration only'
                  : (viewMode === 'holdout' 
                    ? `Evaluated on ${holdoutResult.holdoutCount} holdout campaigns (${holdoutResult.holdoutPeriod})` 
                    : 'Audited completed activations across Indian metros')}
              </p>
            </div>
          </div>

          {!isDemoMode && !isSufficient ? (
            <div className="p-8 bg-linen/20 border-2 border-dashed border-espresso/20 rounded-2xl text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 mx-auto flex items-center justify-center font-bold">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h4 className="font-serif text-base font-bold text-espresso">
                Not enough verified campaign data for evaluation.
              </h4>
              <p className="text-xs text-muted max-w-sm mx-auto leading-relaxed">
                Complete more campaigns to unlock reliable model metrics.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setIsDemoMode(true)}
                  className="px-3.5 py-2 bg-espresso text-white rounded-xl text-xs font-bold font-mono hover:bg-muted transition-colors cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Sliders className="w-3.5 h-3.5 text-gold" />
                  <span>Preview with Demo Benchmarks (DEMO DATA)</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left font-sans text-xs">
                <thead>
                  <tr className="border-b border-espresso/10 text-espresso/60 font-mono text-[10px] uppercase">
                    <th className="pb-3 font-normal">Campaign & Context</th>
                    <th className="pb-3 font-normal">Predicted (90% Range)</th>
                    <th className="pb-3 font-normal">Actual</th>
                    <th className="pb-3 font-normal">Error</th>
                    <th className="pb-3 font-normal text-right">Coverage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-espresso/5 font-mono">
                  {validationData.map((row, idx) => {
                    const errorPct = row.actual > 0 
                      ? (((row.actual - row.predicted) / row.actual) * 100).toFixed(1)
                      : '0.0';
                    const inRange = row.actual >= row.lowerBound && row.actual <= row.upperBound;

                    return (
                      <tr key={idx} className="hover:bg-linen/30 transition-colors">
                        <td className="py-3.5 pr-2">
                          <strong className="block text-espresso font-sans text-xs">{row.campaignName}</strong>
                          <span className="text-[10px] text-espresso/50 font-mono">{row.date} • {row.locationType} • {row.objective}</span>
                        </td>
                        <td className="py-3.5 pr-2">
                          <span className="text-espresso font-bold">{row.predicted.toLocaleString('en-IN')}</span>
                          <span className="text-[10px] text-espresso/50 block">[{row.lowerBound?.toLocaleString('en-IN') || 0} – {row.upperBound?.toLocaleString('en-IN') || 0}]</span>
                        </td>
                        <td className="py-3.5 pr-2">
                          <span className="text-espresso font-bold text-sm">{row.actual.toLocaleString('en-IN')}</span>
                        </td>
                        <td className="py-3.5 pr-2">
                          <span className={`text-xs px-2 py-0.5 rounded-md font-mono ${
                            Math.abs(Number(errorPct)) <= 15 ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                          }`}>
                            {Number(errorPct) >= 0 ? `+${errorPct}%` : `${errorPct}%`}
                          </span>
                        </td>
                        <td className="py-3.5 text-right">
                          {inRange ? (
                            <span className="inline-flex items-center gap-1 text-green-600 text-[11px] font-sans">
                              <CheckCircle2 className="w-3.5 h-3.5" /> In Range
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-amber-600 text-[11px] font-sans">
                              <AlertTriangle className="w-3.5 h-3.5" /> Out
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Column: Conjugate Beta-Binomial Bayesian Updating Simulator */}
        <div className="lg:col-span-5 bg-linen/40 p-6 rounded-3xl border border-espresso/10 shadow-xs space-y-5">
          <div>
            <div className="inline-flex items-center gap-1.5 text-gold text-xs font-mono mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>OBJECTIVE-AGNOSTIC BAYESIAN ENGINE</span>
            </div>
            <h3 className="font-serif text-lg text-espresso">Conjugate Beta-Binomial Simulator</h3>
            <p className="text-xs text-espresso/70 mt-1">
              Test exact conjugate updating ($p \mid \text{data} \sim \text{Beta}(\alpha_0 + k, \beta_0 + n - k)$) with inverse beta 95% credible intervals.
            </p>
          </div>

          {/* Simulator Inputs */}
          <div className="space-y-3 bg-white p-4 rounded-2xl border border-espresso/10 text-xs">
            <div>
              <label className="block text-[10px] uppercase font-mono text-espresso/60 mb-1">Metric & Opportunity Denominator</label>
              <select 
                value={bayesianMetric} 
                onChange={(e) => setBayesianMetric(e.target.value)}
                className="w-full bg-linen/50 border border-espresso/20 rounded-xl px-3 py-2 font-mono outline-none text-xs"
              >
                <option value="qr_scan_rate">QR Scan Rate (Unique Scans / Exposed Audience)</option>
                <option value="landing_to_lead_rate">Landing to Lead Rate (Leads / Landing Visits)</option>
                <option value="landing_to_signup_rate">Landing to Signup Rate (App Signups / Landing Visits)</option>
                <option value="lead_to_customer_rate">Lead to Customer Rate (Customers / Leads)</option>
                <option value="footfall_interaction_rate">Interaction Rate (Interactions / Footfall)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-mono text-espresso/60 mb-1">Prior Sample Strength (N₀)</label>
              <select 
                value={priorStrength} 
                onChange={(e) => setPriorStrength(e.target.value)}
                className="w-full bg-linen/50 border border-espresso/20 rounded-xl px-3 py-2 font-mono outline-none text-xs"
              >
                <option value="GENERIC_INDUSTRY_PRIOR">Generic Industry Benchmark (N₀ = 5)</option>
                <option value="CITY_HISTORICAL_DATA">City Historical Actuals (N₀ = 15)</option>
                <option value="LOCATION_TYPE_DATA">Location-Type Prior (N₀ = 30)</option>
                <option value="H3_CELL_GROUND_TRUTH">Same H3 Cell Ground Truth (N₀ = 50+)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[10px] uppercase font-mono text-espresso/60 mb-1">Successes (k)</label>
                <input 
                  type="number" 
                  value={simK} 
                  onChange={(e) => setSimK(Math.max(0, parseInt(e.target.value, 10) || 0))}
                  className="w-full bg-linen/50 border border-espresso/20 rounded-xl px-3 py-2 font-mono text-xs outline-none" 
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-mono text-espresso/60 mb-1">Opportunities (n)</label>
                <input 
                  type="number" 
                  value={simN} 
                  onChange={(e) => setSimN(Math.max(simK, parseInt(e.target.value, 10) || simK))}
                  className="w-full bg-linen/50 border border-espresso/20 rounded-xl px-3 py-2 font-mono text-xs outline-none" 
                />
              </div>
            </div>
          </div>

          {/* Posterior Output Cards */}
          <div className="bg-espresso text-linen p-4 rounded-2xl border border-white/10 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="text-[10px] text-linen/60 uppercase">Posterior Expected Rate</span>
              <strong className="text-gold text-lg">{(bayesianResult.posterior.posteriorMean * 100).toFixed(2)}%</strong>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-linen/50 block text-[9px]">95% Credible Interval</span>
                <strong className="text-white">
                  [{(bayesianResult.posterior.credibleInterval95[0] * 100).toFixed(1)}% – {(bayesianResult.posterior.credibleInterval95[1] * 100).toFixed(1)}%]
                </strong>
              </div>
              <div>
                <span className="text-linen/50 block text-[9px]">Posterior Parameters</span>
                <strong className="text-white">α={bayesianResult.posterior.alpha}, β={bayesianResult.posterior.beta}</strong>
              </div>
            </div>

            <p className="text-[11px] text-linen/70 font-sans pt-2 border-t border-white/10">
              {bayesianResult.explainability}
            </p>
          </div>
        </div>
      </div>

      {/* Dataset Provenance & Half-Life Decay Policies */}
      <div className="bg-white p-6 rounded-3xl border border-espresso/10 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-espresso/10">
          <Database className="w-4 h-4 text-gold" />
          <h3 className="font-serif text-lg text-espresso">Source Provenance & Freshness Decay Policies</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
          <div className="bg-linen/40 p-4 rounded-2xl border border-espresso/10">
            <span className="text-[10px] text-espresso/60 uppercase block">Official Population Baseline</span>
            <strong className="text-espresso text-xs block mt-1">Census 2011 (Registrar General)</strong>
            <span className="text-[10px] text-espresso/50 block mt-1">10-year half-life (Slow decay)</span>
          </div>

          <div className="bg-linen/40 p-4 rounded-2xl border border-espresso/10">
            <span className="text-[10px] text-espresso/60 uppercase block">Gridded Spatial Density</span>
            <strong className="text-espresso text-xs block mt-1">WorldPop 100m Gridded Layer</strong>
            <span className="text-[10px] text-espresso/50 block mt-1">2-year half-life calibration</span>
          </div>

          <div className="bg-linen/40 p-4 rounded-2xl border border-espresso/10">
            <span className="text-[10px] text-espresso/60 uppercase block">Urban Mobility & POI</span>
            <strong className="text-espresso text-xs block mt-1">Transit & POI Vectors</strong>
            <span className="text-[10px] text-espresso/50 block mt-1">30–90 day half-life decay</span>
          </div>

          <div className="bg-linen/40 p-4 rounded-2xl border border-espresso/10">
            <span className="text-[10px] text-espresso/60 uppercase block">Ground Truth Telemetry</span>
            <strong className="text-espresso text-xs block mt-1">Ziggers Verified Actuals</strong>
            <span className="text-[10px] text-espresso/50 block mt-1">Conditioned on seasonality & time</span>
          </div>
        </div>
      </div>
    </div>
  );
}
