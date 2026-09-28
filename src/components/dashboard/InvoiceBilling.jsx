"use client";
import React, { useState } from 'react';
import { 
  FileText, Download, Printer, DollarSign, Building, 
  CheckCircle, Calendar, ShieldCheck, ArrowRight, Layers, MapPin, Plus
} from 'lucide-react';
import { calculateGstBreakdown } from '@/lib/intelligence/clientForecast';

export default function InvoiceBilling({ campaigns = [], onLogAction, onCreateClick }) {
  const billingDocs = campaigns.map((c, idx) => {
    const title = c.name || c.title || 'Brand Campaign Activation';
    const client = c.brand || c.brand_name || 'Enterprise Client';
    const city = c.city || 'Chennai';
    const workers = parseInt(c.workers || c.headcount_required, 10) || 1;
    const duration = parseInt(c.durationDays || c.campaignDays, 10) || 7;

    const rawBudget = parseInt(String(c.guaranteed_payout || c.spend || c.totalBudget || c.budget || '0').replace(/[^0-9]/g, ''), 10) || 0;
    const gst = calculateGstBreakdown(rawBudget, true);

    return {
      id: c.id || c.campaign_id || `inv_${idx}`,
      name: `GST Tax Invoice — ${title}`,
      docNumber: `INV-2026-ZG-${1000 + idx}`,
      date: c.created_at ? new Date(c.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      clientName: client,
      campaignTitle: title,
      city,
      promoterCount: workers,
      shiftsCount: workers * duration,
      taxableValue: gst.taxableBaseFormatted,
      gstValue: gst.gstAmountFormatted,
      grandTotal: gst.grossTotalFormatted,
      status: (c.status === true || c.stage === 'Live') ? 'In Progress' : 'Paid / Reconciled',
      desc: `Official GST tax invoice for ${city} execution with 18% tax breakdown (CGST 9% + SGST 9%).`
    };
  });

  const [selectedDocId, setSelectedDocId] = useState(billingDocs[0]?.id || null);
  const selectedDocObj = billingDocs.find(d => d.id === selectedDocId) || billingDocs[0];

  const handleDownload = (doc) => {
    if (onLogAction && doc) {
      onLogAction('DOCUMENT_DOWNLOADED', `Downloaded official accounting document: ${doc.name} (${doc.docNumber})`);
    }
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-espresso/10 p-6 rounded-2xl shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="text-gold" size={24} />
            <h2 className="text-xl font-extrabold text-espresso tracking-tight">
              Agency Invoicing, GST & Billing Desk
            </h2>
          </div>
          <p className="text-xs text-muted mt-1">
            Download compliant GST invoices, worker wage statements, location-wise expense analyses, and client billing reports.
          </p>
        </div>

        {billingDocs.length > 0 && selectedDocObj && (
          <button
            onClick={() => handleDownload(selectedDocObj)}
            className="bg-espresso hover:bg-muted text-white font-extrabold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <Printer size={15} className="text-gold" />
            <span>Print / Export Document</span>
          </button>
        )}
      </div>

      {billingDocs.length > 0 ? (
        <>
          {/* Document Selector Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {billingDocs.map((doc) => (
              <div
                key={doc.id}
                onClick={() => setSelectedDocId(doc.id)}
                className={`bg-white border rounded-2xl p-4 cursor-pointer transition-all ${
                  selectedDocId === doc.id 
                    ? 'border-gold bg-gold/5 ring-2 ring-gold/30 shadow-xs' 
                    : 'border-espresso/10 hover:border-espresso/30'
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-mono font-bold text-muted uppercase">{doc.docNumber}</span>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-green-50 text-green-700 font-bold border border-green-200">
                    {doc.status}
                  </span>
                </div>
                <strong className="block text-xs font-bold text-espresso mt-1 line-clamp-1">{doc.name}</strong>
                <p className="text-[11px] text-muted line-clamp-2 mt-1">{doc.desc}</p>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-espresso/10">
                  <span className="text-xs font-bold font-mono text-espresso">{doc.grandTotal}</span>
                  <span className="text-[10px] font-bold text-gold flex items-center gap-1">Preview <ArrowRight size={10} /></span>
                </div>
              </div>
            ))}
          </div>

          {/* Detailed Printable Tax Invoice View */}
          {selectedDocObj && (
            <div className="bg-white border border-espresso/15 rounded-3xl p-8 shadow-sm space-y-6 max-w-4xl mx-auto font-sans">
              {/* Invoice Header */}
              <div className="flex justify-between items-start border-b border-espresso/10 pb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-espresso text-gold font-serif font-black flex items-center justify-center text-base">
                      Z
                    </div>
                    <span className="font-serif text-lg font-black text-espresso tracking-tight">ZIGGERS EXECUTE TECHNOLOGIES PRIVATE LIMITED</span>
                  </div>
                  <p className="text-[11px] text-muted mt-1 font-mono">
                    GSTIN: 33AAACZ1234F1Z8 • PAN: AAACZ1234F • SAC: 998313 (Marketing Services)
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-extrabold px-3 py-1 bg-linen/50 rounded-lg border border-espresso/10 block mb-1">
                    {selectedDocObj.docNumber}
                  </span>
                  <span className="text-[11px] text-muted font-mono">Date: {selectedDocObj.date}</span>
                </div>
              </div>

              {/* Billed To & Execution Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-linen/20 p-5 rounded-2xl border border-espresso/10 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">Billed To (Promotion Agency / Client)</span>
                  <strong className="text-sm font-extrabold text-espresso mt-1 block">{selectedDocObj.clientName}</strong>
                  <span className="text-muted block mt-0.5">GSTIN: 33AABCM9876K1Z2</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">Campaign Execution Reference</span>
                  <strong className="text-sm font-extrabold text-espresso mt-1 block">{selectedDocObj.campaignTitle} ({selectedDocObj.city})</strong>
                  <span className="text-muted block mt-0.5">Deployment: {selectedDocObj.promoterCount} Brand Promoters • {selectedDocObj.city} Metro Hubs</span>
                </div>
              </div>

              {/* Invoice Line Items Table */}
              <table className="w-full text-left text-xs border-collapse font-sans">
                <thead>
                  <tr className="border-b border-espresso/15 text-[10px] font-extrabold text-muted uppercase tracking-wider">
                    <th className="py-3 px-2">Line Item Description</th>
                    <th className="py-3 px-2">HSN / SAC</th>
                    <th className="py-3 px-2">Quantity / Days</th>
                    <th className="py-3 px-2 text-right">Taxable Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-espresso/10 font-mono">
                  <tr>
                    <td className="py-4 px-2 font-sans">
                      <strong className="text-espresso font-bold block">On-Ground Brand Promoters ({selectedDocObj.promoterCount} Pax across {selectedDocObj.city} Hubs)</strong>
                    </td>
                    <td className="py-4 px-2 text-muted">998313</td>
                    <td className="py-4 px-2 text-espresso">{selectedDocObj.shiftsCount} Shifts</td>
                    <td className="py-4 px-2 text-right font-bold text-espresso">{selectedDocObj.taxableValue}</td>
                  </tr>
                </tbody>
              </table>

              {/* Totals & Tax Calculation */}
              <div className="flex justify-end pt-4">
                <div className="w-72 space-y-2 text-xs font-mono">
                  <div className="flex justify-between text-muted">
                    <span>SUBTOTAL TAXABLE AMOUNT</span>
                    <strong className="text-espresso">{selectedDocObj.taxableValue}</strong>
                  </div>
                  <div className="flex justify-between text-muted">
                    <span>CGST (9%) + SGST (9%)</span>
                    <strong className="text-espresso">{selectedDocObj.gstValue}</strong>
                  </div>
                  <div className="flex justify-between text-sm font-extrabold bg-espresso text-linen p-3 rounded-xl">
                    <span>GRAND TOTAL (INCLUSIVE OF GST)</span>
                    <strong className="text-gold">{selectedDocObj.grandTotal}</strong>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        /* Empty State */
        <div className="bg-white border border-espresso/15 rounded-3xl p-12 text-center shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-linen/50 border border-espresso/10 text-gold flex items-center justify-center mx-auto mb-4">
            <FileText size={26} />
          </div>
          <h3 className="text-base font-extrabold text-espresso tracking-tight">No Invoices Available Yet</h3>
          <p className="text-xs text-muted max-w-md mx-auto mt-1 mb-5">
            Deploy your first on-ground campaign to automatically generate statutory GST tax invoices and worker wage statements.
          </p>
          {onCreateClick && (
            <button
              onClick={onCreateClick}
              className="bg-espresso hover:bg-muted text-white font-extrabold px-5 py-2.5 rounded-xl text-xs inline-flex items-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <Plus size={14} className="text-gold" />
              <span>Launch Campaign</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
