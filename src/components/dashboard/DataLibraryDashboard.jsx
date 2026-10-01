"use client";

import React, { useState, useEffect } from 'react';
import { 
  Database, ShieldCheck, AlertCircle, CheckCircle2, 
  ExternalLink, RefreshCw, Filter, Layers, Info, MapPin, Train, Building2, 
  Clock, ShieldAlert, FileText, ArrowRight
} from 'lucide-react';

export default function DataLibraryDashboard() {
  const [loading, setLoading] = useState(true);
  const [dataSources, setDataSources] = useState([]);
  const [batches, setBatches] = useState([]);
  const [totals, setTotals] = useState({ sourcesCount: 0, marketCount: 0, transitCount: 0, venueCount: 0 });
  const [selectedState, setSelectedState] = useState('Tamil Nadu');
  const [marketDetail, setMarketDetail] = useState(null);
  const [transitDetail, setTransitDetail] = useState(null);
  const [venues, setVenues] = useState([]);
  const [activeTab, setActiveTab] = useState('sources'); // 'sources' | 'market' | 'transit' | 'venues' | 'batches'
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const summaryRes = await fetch('/api/data-library?action=summary');
      const summary = await summaryRes.json();
      if (summary.success) {
        setDataSources(summary.sources || []);
        setTotals(summary.totals || {});
      }

      const batchesRes = await fetch('/api/data-library?action=batches');
      const batchesData = await batchesRes.json();
      if (batchesData.success) {
        setBatches(batchesData.batches || []);
      }

      // Initial state market context
      fetchMarketContext(selectedState);
      fetchTransitContext('Chennai');
      fetchVenues();
    } catch (err) {
      console.warn('Notice loading data library:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchMarketContext = async (stateName) => {
    try {
      const res = await fetch(`/api/data-library?action=market&state=${encodeURIComponent(stateName)}`);
      const data = await res.json();
      if (data.success) {
        setMarketDetail(data.marketContext);
      }
    } catch (e) {
      console.warn('Market fetch error:', e.message);
    }
  };

  const fetchTransitContext = async (city) => {
    try {
      const res = await fetch(`/api/data-library?action=transit&city=${encodeURIComponent(city)}`);
      const data = await res.json();
      if (data.success) {
        setTransitDetail(data.transitContext);
      }
    } catch (e) {
      console.warn('Transit fetch error:', e.message);
    }
  };

  const fetchVenues = async () => {
    try {
      const res = await fetch('/api/data-library?action=venues');
      const data = await res.json();
      if (data.success) {
        setVenues(data.venues || []);
      }
    } catch (e) {
      console.warn('Venues fetch error:', e.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStateChange = (e) => {
    const newState = e.target.value;
    setSelectedState(newState);
    fetchMarketContext(newState);
  };

  const handleRunReimport = async () => {
    setImporting(true);
    setImportResult(null);
    try {
      const res = await fetch('/api/data-library', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setImportResult({ type: 'success', summary: data.summary });
        fetchData();
      } else {
        setImportResult({ type: 'error', error: data.error });
      }
    } catch (e) {
      setImportResult({ type: 'error', error: e.message });
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      
      {/* Top Banner & Audit Heading */}
      <div className="bg-white border border-espresso/10 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black tracking-widest text-gold uppercase px-2.5 py-0.5 bg-gold/10 rounded-full border border-gold/20">
              Approved Provenance Registry
            </span>
            <span className="text-[10px] font-bold text-muted font-mono">
              Package v1.0 (Audited 1 Oct 2026)
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-espresso tracking-tight">
            External Data Sources & Market Library
          </h2>
          <p className="text-xs text-muted leading-relaxed max-w-2xl mt-1">
            Official government surveys, verified transit flows, and institution directories stored outside application code. Contextual records are strictly isolated from venue footfall and conversion rates.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={fetchData}
            disabled={loading}
            className="h-10 px-3.5 rounded-xl border border-espresso/15 bg-white text-xs font-bold text-espresso hover:bg-linen/40 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleRunReimport}
            disabled={importing}
            className="h-10 px-4 rounded-xl bg-espresso text-white text-xs font-extrabold hover:bg-muted transition-colors flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
          >
            {importing ? (
              <>
                <RefreshCw size={13} className="animate-spin text-gold" />
                <span>Validating...</span>
              </>
            ) : (
              <>
                <Database size={13} className="text-gold" />
                <span>Verify & Ingest Package</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Alert Banner for Reimport Result */}
      {importResult && (
        <div className={`p-4 rounded-2xl border text-xs flex items-start gap-3 ${
          importResult.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-red-50 border-red-200 text-red-900'
        }`}>
          {importResult.type === 'success' ? (
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
          )}
          <div>
            <div className="font-extrabold mb-1">
              {importResult.type === 'success' ? 'Package Validation & Ingestion Successful' : 'Import Process Error'}
            </div>
            {importResult.type === 'success' ? (
              <p className="text-[11px] leading-relaxed">
                Batch ID: <span className="font-mono">{importResult.summary?.batchId}</span>. All records validated against schema and geographic boundaries without duplicate creation.
              </p>
            ) : (
              <p className="text-[11px] leading-relaxed">{importResult.error}</p>
            )}
          </div>
        </div>
      )}

      {/* 4 Overview Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-espresso/10 rounded-2xl p-4.5 shadow-2xs">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider">Catalogued Sources</span>
            <Database size={16} className="text-gold" />
          </div>
          <div className="text-2xl font-black text-espresso font-mono">{totals.sourcesCount || 9}</div>
          <p className="text-[10px] text-muted mt-1">9 official & community sources identified</p>
        </div>

        <div className="bg-white border border-espresso/10 rounded-2xl p-4.5 shadow-2xs">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider">State Consumption Records</span>
            <Layers size={16} className="text-gold" />
          </div>
          <div className="text-2xl font-black text-espresso font-mono">{totals.marketCount || 74}</div>
          <p className="text-[10px] text-muted mt-1">36 States/UTs + All-India (Rural & Urban)</p>
        </div>

        <div className="bg-white border border-espresso/10 rounded-2xl p-4.5 shadow-2xs">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider">Transit Flow Logs</span>
            <Train size={16} className="text-gold" />
          </div>
          <div className="text-2xl font-black text-espresso font-mono">{totals.transitCount || 11}</div>
          <p className="text-[10px] text-muted mt-1">11 monthly CMRL network passenger counts</p>
        </div>

        <div className="bg-white border border-espresso/10 rounded-2xl p-4.5 shadow-2xs">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider">Legacy Seed Status</span>
            <ShieldAlert size={16} className="text-amber-600" />
          </div>
          <div className="text-sm font-black text-amber-700 font-mono">UNVERIFIED_SEED</div>
          <p className="text-[10px] text-muted mt-1">18 historical metro nodes flagged honest</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-espresso/10 pb-2 overflow-x-auto">
        {[
          { id: 'sources', label: 'Source Catalogue (9)', icon: <Database size={13} /> },
          { id: 'market', label: 'State Market Context (74)', icon: <Layers size={13} /> },
          { id: 'transit', label: 'Transit Passenger Flows (11)', icon: <Train size={13} /> },
          { id: 'venues', label: 'Campus Directory (8)', icon: <Building2 size={13} /> },
          { id: 'batches', label: 'Import Audit Batches', icon: <Clock size={13} /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`h-9 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === tab.id
                ? 'bg-espresso text-white shadow-xs'
                : 'bg-white text-espresso/70 hover:bg-linen/40 border border-espresso/10'
            }`}
          >
            <span className={activeTab === tab.id ? 'text-gold' : 'text-muted'}>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab 1: Sources Catalogue */}
      {activeTab === 'sources' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dataSources.map((src) => {
              const isIncluded = src.status.includes('included');
              return (
                <div key={src.source_id} className="bg-white border border-espresso/10 rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[9px] font-mono font-black uppercase text-gold px-2 py-0.5 bg-gold/10 rounded-md">
                        {src.source_id}
                      </span>
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                        isIncluded ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-linen text-muted border border-espresso/10'
                      }`}>
                        {isIncluded ? 'OBSERVATIONS IMPORTED' : 'IDENTIFIED / NOT CONNECTED'}
                      </span>
                    </div>

                    <h3 className="text-sm font-extrabold text-espresso leading-snug mb-1">
                      {src.publisher}
                    </h3>
                    <p className="text-[11px] text-gold font-bold mb-3">{src.kind}</p>

                    <div className="space-y-1.5 text-[11px] text-muted mb-4">
                      <div><strong className="text-espresso">Period:</strong> {src.data_period}</div>
                      <div><strong className="text-espresso">Permitted Use:</strong> {src.allowed_use}</div>
                      <div className="p-2 bg-linen/30 rounded-xl text-[10px] text-espresso/80 leading-relaxed border border-espresso/5 mt-2">
                        <strong className="text-red-700 block mb-0.5">Restriction / Limit:</strong>
                        {src.restriction}
                      </div>
                    </div>
                  </div>

                  <a
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-8 flex items-center justify-center gap-1.5 rounded-lg border border-espresso/15 text-[11px] font-bold text-espresso hover:bg-linen/40 transition-colors"
                  >
                    <span>View Primary Source</span>
                    <ExternalLink size={11} className="text-gold" />
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Market Context (MoSPI Consumption Expenditure) */}
      {activeTab === 'market' && (
        <div className="bg-white border border-espresso/10 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-black text-espresso">State & UT Consumption Context (MoSPI HCES)</h3>
              <p className="text-xs text-muted leading-relaxed">
                Source Table 1, Press Information Bureau (March 2025). Survey period: August 2023–July 2024.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-espresso shrink-0">Select State/UT:</label>
              <select
                value={selectedState}
                onChange={handleStateChange}
                className="h-10 px-3 bg-linen/30 border border-espresso/15 rounded-xl text-xs font-bold text-espresso focus:outline-none focus:ring-2 focus:ring-gold/30"
              >
                {[
                  'All-India', 'Tamil Nadu', 'Karnataka', 'Maharashtra', 'Delhi', 'Telangana', 'Uttar Pradesh',
                  'West Bengal', 'Gujarat', 'Kerala', 'Haryana', 'Punjab', 'Rajasthan', 'Madhya Pradesh',
                  'Andhra Pradesh', 'Bihar', 'Odisha', 'Assam', 'Chandigarh', 'Goa', 'Himachal Pradesh',
                  'Jammu and Kashmir', 'Jharkhand', 'Uttarakhand', 'Chhattisgarh', 'Puducherry'
                ].map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>
          </div>

          {marketDetail && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-linen/30 border border-espresso/10">
                <span className="text-[10px] font-black uppercase tracking-wider text-muted block mb-1">
                  Rural Sector Estimate
                </span>
                <div className="text-3xl font-black text-espresso font-mono">
                  ₹{marketDetail.rural?.value?.toLocaleString('en-IN')}
                </div>
                <p className="text-[11px] text-muted mt-1">Average monthly per-person consumption expenditure</p>
              </div>

              <div className="p-5 rounded-2xl bg-gold/10 border border-gold/30">
                <span className="text-[10px] font-black uppercase tracking-wider text-gold block mb-1">
                  Urban Sector Estimate
                </span>
                <div className="text-3xl font-black text-espresso font-mono">
                  ₹{marketDetail.urban?.value?.toLocaleString('en-IN')}
                </div>
                <p className="text-[11px] text-muted mt-1">Average monthly per-person consumption expenditure</p>
              </div>
            </div>
          )}

          <div className="p-4 rounded-2xl bg-linen/20 border border-espresso/10 text-xs text-muted leading-relaxed space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-espresso">
              <Info size={14} className="text-gold" />
              <span>Statistical & Regulatory Disclaimer</span>
            </div>
            <p className="text-[11px]">
              {marketDetail?.disclaimer}
            </p>
            {marketDetail?.qualityNote && (
              <p className="text-[10px] text-espresso/70 italic border-t border-espresso/5 pt-1.5">
                Note on data precision: {marketDetail.qualityNote}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Transit Passenger Flows (CMRL) */}
      {activeTab === 'transit' && (
        <div className="bg-white border border-espresso/10 rounded-3xl p-6 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-black text-espresso">Chennai Metro Rail Limited (CMRL) Transit Context</h3>
            <p className="text-xs text-muted leading-relaxed">
              Official monthly passenger ridership from operator media reports (April 2025–February 2026).
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-linen/30 border border-espresso/10">
              <span className="text-[10px] font-bold text-muted uppercase block mb-1">Latest Monthly Volume</span>
              <div className="text-2xl font-black text-espresso font-mono">
                {transitDetail?.latestValue?.toLocaleString('en-IN') || '9,618,085'}
              </div>
              <span className="text-[10px] text-gold font-bold">Month: {transitDetail?.latestMonth || '2026-02'}</span>
            </div>

            <div className="p-4 rounded-2xl bg-linen/30 border border-espresso/10">
              <span className="text-[10px] font-bold text-muted uppercase block mb-1">Geographic Scope</span>
              <div className="text-sm font-black text-espresso">Entire CMRL Network</div>
              <span className="text-[10px] text-muted">All lines & interchange hubs</span>
            </div>

            <div className="p-4 rounded-2xl bg-linen/30 border border-espresso/10">
              <span className="text-[10px] font-bold text-muted uppercase block mb-1">Evidence Type</span>
              <div className="text-sm font-black text-emerald-700">OPERATOR_REPORTED</div>
              <span className="text-[10px] text-muted">Excludes special event tickets</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
            <AlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed">
              <strong>Non-Interchangeability Rule:</strong> Metro network passenger flow represents total transit line movement across Chennai. It is strictly forbidden to substitute this figure into promotional stall reach, station footfall, or sampling handovers.
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Campus Directory (NIRF) */}
      {activeTab === 'venues' && (
        <div className="bg-white border border-espresso/10 rounded-3xl p-6 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-black text-espresso">NIRF 2025 Institutional Campus Directory</h3>
            <p className="text-xs text-muted leading-relaxed">
              8 sample published directory records. Per data policy, daily attendance and spot footfall are unmeasured (NULL).
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-espresso/10 text-muted text-[10px] font-black uppercase">
                  <th className="py-2.5 px-3">Institution ID</th>
                  <th className="py-2.5 px-3">Institution Name</th>
                  <th className="py-2.5 px-3">City & State</th>
                  <th className="py-2.5 px-3">Permission Status</th>
                  <th className="py-2.5 px-3">Measured Footfall</th>
                  <th className="py-2.5 px-3">Student Enrolment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-espresso/5 font-medium">
                {venues.map((v) => (
                  <tr key={v.institutionId} className="hover:bg-linen/20 transition-colors">
                    <td className="py-3 px-3 font-mono text-[11px] text-gold">{v.institutionId}</td>
                    <td className="py-3 px-3 font-bold text-espresso">{v.name}</td>
                    <td className="py-3 px-3 text-muted">{v.city}, {v.state}</td>
                    <td className="py-3 px-3">
                      <span className="text-[9px] font-bold px-2 py-0.5 bg-linen rounded-full border border-espresso/10 text-muted">
                        NOT_CONFIRMED
                      </span>
                    </td>
                    <td className="py-3 px-3 text-muted font-mono italic">
                      {v.footfall === null ? 'Not Measured (NULL)' : v.footfall}
                    </td>
                    <td className="py-3 px-3 text-muted font-mono italic">
                      {v.studentCount === null ? 'Not Measured (NULL)' : v.studentCount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3.5 rounded-2xl bg-linen/30 border border-espresso/10 text-[11px] text-muted">
            <strong className="text-espresso">Integrity Guarantee:</strong> College rankings do not predict activation success. Missing values are stored explicitly as NULL rather than invented zero or fake averages.
          </div>
        </div>
      )}

      {/* Tab 5: Import Audit Batches */}
      {activeTab === 'batches' && (
        <div className="bg-white border border-espresso/10 rounded-3xl p-6 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-black text-espresso">Audit Trail & Import Batches</h3>
            <p className="text-xs text-muted leading-relaxed">
              Every data ingestion creates an immutable batch record tracking processed, accepted, unchanged, and rejected records.
            </p>
          </div>

          <div className="space-y-3">
            {batches.map((b) => (
              <div key={b.id} className="p-4 rounded-2xl border border-espresso/10 bg-linen/20 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-espresso">{b.id}</span>
                    <span className="text-[9px] font-extrabold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
                      {b.review_status}
                    </span>
                  </div>
                  <div className="text-[11px] text-muted">
                    Source: <strong className="text-espresso">{b.source_publisher || b.source_id}</strong> | Version: {b.package_version || '1.0'}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-[11px] font-mono shrink-0">
                  <div>Processed: <strong className="text-espresso">{b.records_processed}</strong></div>
                  <div>Accepted: <strong className="text-emerald-700">{b.records_accepted}</strong></div>
                  <div>Unchanged: <strong className="text-muted">{b.records_unchanged}</strong></div>
                  <div>Rejected: <strong className="text-red-700">{b.records_rejected}</strong></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
