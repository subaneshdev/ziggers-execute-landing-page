"use client";
import React, { useState } from 'react';
import { 
  FileText, Download, Printer, DollarSign, Building, 
  CheckCircle, Calendar, ShieldCheck, ArrowRight, Layers, MapPin, Plus
} from 'lucide-react';

export default function InvoiceBilling({ campaigns = [], onLogAction, onCreateClick }) {
  const [selectedDocId, setSelectedDocId] = useState(campaigns[0]?.id || null);

  const billingDocs = campaigns.map((c, idx) => {
    const rawBudget = parseInt((c.spend || c.totalBudget || '35000').replace(/[^0-9]/g, ''), 10) || 35000;
    const taxableValue = Math.round(rawBudget * 0.8475);
    const gstValue = Math.round(rawBudget * 0.1525);

    return {
      id: c.id || `inv_${idx}`,
      name: `GST Tax Invoice — ${c.name}`,
      docNumber: `INV-2026-ZG-${1000 + idx}`,
      date: new Date().toISOString().split('T')[0],
      clientName: c.brand || 'Enterprise Partner',
      campaignTitle: c.name,
      city: c.city || 'Chennai',
      promoterCount: c.workers || 10,
      shiftsCount: (c.workers || 10) * 5,
      taxableValue: `₹${taxableValue.toLocaleString('en-IN')}`,
      gstValue: `₹${gstValue.toLocaleString('en-IN')}`,
      grandTotal: `₹${rawBudget.toLocaleString('en-IN')}`,
      status: c.stage === 'Live' ? 'In Progress' : 'Paid / Reconciled',
      desc: `Official GST tax invoice for ${c.city} execution with 18% tax breakdown.`
    };
  });

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

        {billingDocs.length > 0 && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleDownload(selectedDocObj)}
              className="bg-espresso hover:bg-muted text-white font-extrabold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Printer size={13} className="text-gold" />
              <span>Print / Export Document</span>
            </button>
          </div>
        )}
      </div>

      {/* Core Accounting Document Cards */}
      {billingDocs.length === 0 ? (
        <div className="py-16 px-6 text-center bg-white border border-espresso/10 rounded-3xl flex flex-col items-center justify-center">
          <div className="w-14 h-14 rounded-2xl bg-linen/50 border border-espresso/10 text-gold flex items-center justify-center mb-4 shadow-xs">
            <FileText size={26} />
          </div>

          <h3 className="text-base font-extrabold text-espresso tracking-tight mb-1.5">
            No Invoices or Billing Statements Generated
          </h3>

          <p className="text-xs text-muted max-w-md mx-auto mb-6 leading-relaxed">
            GST tax invoices, worker wage statements, and client billing reports will be generated automatically when a campaign is deployed.
          </p>

          <button
            onClick={onCreateClick}
            className="inline-flex items-center gap-2 bg-espresso hover:bg-muted text-white font-extrabold px-6 py-3 rounded-xl text-xs shadow-md transition-all cursor-pointer"
          >
            <Plus size={16} className="text-gold" />
            <span>Create Campaign to Generate Invoices</span>
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {billingDocs.map((doc) => (
              <div
                key={doc.id}
                onClick={() => setSelectedDocId(doc.id)}
                className={`bg-white border rounded-2xl p-5 shadow-xs transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                  (selectedDocId || billingDocs[0].id) === doc.id ? 'border-gold bg-linen/10 ring-2 ring-gold/40' : 'border-espresso/10 hover:border-espresso/30'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between">
                    <span className="text-[10px] font-mono font-bold text-muted">{doc.docNumber}</span>
                    <span className="text-[9px] font-bold bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                      {doc.status}
                    </span>
                  </div>
                  <h3 className="text-xs font-extrabold text-espresso mt-2 leading-tight">{doc.name}</h3>
                  <p className="text-[10px] text-muted leading-relaxed mt-1">{doc.desc}</p>
                </div>

                <div className="pt-3 border-t border-espresso/10 flex items-center justify-between">
                  <span className="text-sm font-extrabold text-espresso font-mono">{doc.grandTotal}</span>
                  <span className="text-[10px] font-bold text-gold flex items-center gap-0.5">
                    Preview <ArrowRight size={10} />
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Document Interactive Preview Sheet */}
          {selectedDocObj && (
            <div className="bg-white border border-espresso/10 rounded-2xl shadow-sm overflow-hidden p-6 md:p-8 space-y-6">
              
              {/* Invoice Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-espresso/10 pb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-espresso text-white rounded-xl flex items-center justify-center font-bold text-xl">
                    Z
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-espresso leading-none">ZIGGERS EXECUTE TECHNOLOGIES PRIVATE LIMITED</h3>
                    <span className="text-[10px] text-muted font-mono block mt-1">
                      GSTIN: 33AAACZ1234F1Z8 • PAN: AAACZ1234F • SAC: 998313 (Marketing Services)
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono font-bold bg-linen/50 border border-espresso/10 px-3 py-1 rounded-lg text-espresso inline-block">
                    {selectedDocObj.docNumber}
                  </span>
                  <span className="text-[10px] text-muted block mt-1">Date: {selectedDocObj.date}</span>
                </div>
              </div>

              {/* Billed To / Campaign Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                <div className="bg-linen/20 p-4 rounded-2xl border border-espresso/10 space-y-1">
                  <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">Billed To (Promotion Agency / Client)</span>
                  <strong className="text-espresso font-extrabold block text-sm">{selectedDocObj.clientName}</strong>
                  <span className="text-muted block font-mono text-[11px]">GSTIN: 33AABCM9876K1Z2</span>
                </div>

                <div className="bg-linen/20 p-4 rounded-2xl border border-espresso/10 space-y-1">
                  <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">Campaign Execution Reference</span>
                  <strong className="text-espresso font-extrabold block text-sm">{selectedDocObj.campaignTitle} ({selectedDocObj.city})</strong>
                  <span className="text-muted block">Deployment: {selectedDocObj.promoterCount} Brand Promoters • {selectedDocObj.city} Metro Hubs</span>
                </div>
              </div>

              {/* Financial Line Items Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-espresso/10 text-[10px] font-bold text-muted uppercase tracking-wider bg-linen/20">
                      <th className="py-3 px-4">Line Item Description</th>
                      <th className="py-3 px-4">HSN / SAC</th>
                      <th className="py-3 px-4 text-center">Quantity / Days</th>
                      <th className="py-3 px-4 text-right">Taxable Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-espresso/10 font-medium font-mono text-[11px]">
                    <tr>
                      <td className="py-3.5 px-4 font-sans font-bold text-espresso">
                        On-Ground Brand Promoters ({selectedDocObj.promoterCount} Pax across {selectedDocObj.city} Hubs)
                      </td>
                      <td className="py-3.5 px-4 text-muted">998313</td>
                      <td className="py-3.5 px-4 text-center">{selectedDocObj.shiftsCount} Shifts</td>
                      <td className="py-3.5 px-4 text-right font-bold text-espresso">{selectedDocObj.taxableValue}</td>
                    </tr>
                    <tr className="bg-linen/10">
                      <td colSpan={3} className="py-3 px-4 font-sans font-bold text-right text-muted uppercase text-[10px]">
                        Subtotal Taxable Amount
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-espresso text-xs">
                        {selectedDocObj.taxableValue}
                      </td>
                    </tr>
                    <tr className="bg-linen/10">
                      <td colSpan={3} className="py-2 px-4 font-sans font-bold text-right text-muted uppercase text-[10px]">
                        CGST (9%) + SGST (9%)
                      </td>
                      <td className="py-2 px-4 text-right font-bold text-espresso text-xs">
                        {selectedDocObj.gstValue}
                      </td>
                    </tr>
                    <tr className="bg-espresso text-white">
                      <td colSpan={3} className="py-3.5 px-4 font-sans font-extrabold text-right uppercase text-xs">
                        Grand Total (Inclusive of GST)
                      </td>
                      <td className="py-3.5 px-4 text-right font-extrabold text-gold text-sm">
                        {selectedDocObj.grandTotal}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

    </div>
  );
}
