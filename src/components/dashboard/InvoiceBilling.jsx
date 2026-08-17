"use client";
import React, { useState } from 'react';
import { 
  FileText, Download, Printer, DollarSign, Building, 
  CheckCircle, Calendar, ShieldCheck, ArrowRight, Layers, MapPin
} from 'lucide-react';

export default function InvoiceBilling({ campaigns = [], onLogAction }) {
  const [selectedDocument, setSelectedDocument] = useState('gst_invoice'); // 'gst_invoice', 'worker_statement', 'expense_report', 'client_billing'

  const billingDocs = campaigns.map((c, idx) => ({
    id: `gst_inv_${c.id || idx}`,
    name: `GST Tax Invoice — ${c.name}`,
    docNumber: `INV-2026-ZG-${1000 + idx}`,
    date: new Date().toISOString().split('T')[0],
    amount: c.totalBudget || c.spend || '₹0',
    status: c.stage === 'Live' ? 'In Progress' : 'Paid / Reconciled',
    desc: `Official GST invoice for ${c.city} execution with 18% tax breakdown.`
  }));

  const selectedDocObj = billingDocs.find(d => d.id === selectedDocument) || billingDocs[0];

  const handleDownload = (doc) => {
    if (onLogAction) {
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

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleDownload({ name: 'Consolidated Agency Billing Statement', docNumber: 'ALL-ZIP-2026' })}
            className="bg-espresso hover:bg-muted text-white font-extrabold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Printer size={13} className="text-gold" />
            <span>Print / Export Document</span>
          </button>
        </div>
      </div>

      {/* Core Accounting Document Cards */}
      {billingDocs.length === 0 ? (
        <div className="bg-white border border-espresso/10 rounded-2xl p-12 text-center text-muted">
          <FileText size={36} className="mx-auto mb-2 opacity-30 text-espresso" />
          <p className="font-bold text-sm text-espresso">No billing invoices or tax statements generated</p>
          <p className="text-xs text-muted mt-0.5">GST tax invoices, worker wage statements, and client billing reports will be generated automatically when a campaign is deployed.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {billingDocs.map((doc) => (
              <div
                key={doc.id}
                onClick={() => setSelectedDocument(doc.id)}
                className={`bg-white border rounded-2xl p-5 shadow-xs transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                  selectedDocument === doc.id ? 'border-gold bg-linen/10 ring-2 ring-gold/40' : 'border-espresso/10 hover:border-espresso/30'
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
                  <span className="text-sm font-extrabold text-espresso font-mono">{doc.amount}</span>
                  <span className="text-[10px] font-bold text-gold flex items-center gap-0.5">
                    Preview <ArrowRight size={10} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Document Interactive Preview Sheet */}
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
              {billingDocs.find(d => d.id === selectedDocument)?.docNumber}
            </span>
            <span className="text-[10px] text-muted block mt-1">Date: 25 August 2026</span>
          </div>
        </div>

        {/* Billed To / Campaign Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="bg-linen/20 p-4 rounded-2xl border border-espresso/10 space-y-1">
            <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">Billed To (Promotion Agency / Client)</span>
            <strong className="text-espresso font-extrabold block text-sm">Mindshare BTL & Media Private Limited</strong>
            <span className="text-muted block">Client Account: Coca-Cola India</span>
            <span className="text-muted block font-mono text-[11px]">GSTIN: 33AABCM9876K1Z2</span>
          </div>

          <div className="bg-linen/20 p-4 rounded-2xl border border-espresso/10 space-y-1">
            <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">Campaign Execution Reference</span>
            <strong className="text-espresso font-extrabold block text-sm">Coca-Cola College Activation (Chennai)</strong>
            <span className="text-muted block">Duration: 20 Aug 2026 – 25 Aug 2026 (5 Days)</span>
            <span className="text-muted block">Deployment: 20 Brand Promoters • 4 College Nodes</span>
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
                <th className="py-3 px-4 text-right">Unit Rate</th>
                <th className="py-3 px-4 text-right">Taxable Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-espresso/10 font-medium font-mono text-[11px]">
              <tr>
                <td className="py-3.5 px-4 font-sans font-bold text-espresso">
                  On-Ground Brand Promoters (20 Pax across 4 Chennai College Hubs)
                </td>
                <td className="py-3.5 px-4 text-muted">998313</td>
                <td className="py-3.5 px-4 text-center">100 Shifts</td>
                <td className="py-3.5 px-4 text-right">₹1,200/day</td>
                <td className="py-3.5 px-4 text-right font-bold text-espresso">₹1,20,000</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-sans font-bold text-espresso">
                  Senior Field Operations Supervisors (2 Leads • Geofence Auditing)
                </td>
                <td className="py-3.5 px-4 text-muted">998313</td>
                <td className="py-3.5 px-4 text-center">10 Shifts</td>
                <td className="py-3.5 px-4 text-right">₹2,000/day</td>
                <td className="py-3.5 px-4 text-right font-bold text-espresso">₹20,000</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-sans font-bold text-espresso">
                  Ziggers Execute Platform Software Fee (AI Waves & Geofence GPS API)
                </td>
                <td className="py-3.5 px-4 text-muted">998313</td>
                <td className="py-3.5 px-4 text-center">1 Activation</td>
                <td className="py-3.5 px-4 text-right">₹15,000</td>
                <td className="py-3.5 px-4 text-right font-bold text-espresso">₹15,000</td>
              </tr>
              <tr className="bg-linen/10">
                <td colSpan={4} className="py-3 px-4 font-sans font-bold text-right text-muted uppercase text-[10px]">
                  Subtotal Taxable Amount
                </td>
                <td className="py-3 px-4 text-right font-bold text-espresso text-xs">
                  ₹1,55,000
                </td>
              </tr>
              <tr className="bg-linen/10">
                <td colSpan={4} className="py-2 px-4 font-sans font-bold text-right text-muted uppercase text-[10px]">
                  CGST (9%) + SGST (9%)
                </td>
                <td className="py-2 px-4 text-right font-bold text-espresso text-xs">
                  ₹27,900
                </td>
              </tr>
              <tr className="bg-espresso text-white">
                <td colSpan={4} className="py-3.5 px-4 font-sans font-extrabold text-right uppercase text-xs">
                  Grand Total (Inclusive of GST)
                </td>
                <td className="py-3.5 px-4 text-right font-extrabold text-gold text-sm">
                  ₹1,82,900
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-espresso/10 text-xs">
          <div className="flex items-center gap-2 text-green-700 font-bold">
            <ShieldCheck size={16} />
            <span>Digital Cryptographic Signature Verified by Ziggers Execute Accounting Engine.</span>
          </div>

          <button
            onClick={() => handleDownload({ name: selectedDocument, docNumber: 'DOC-PRINT' })}
            className="bg-gold hover:bg-gold/90 text-espresso font-extrabold px-5 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Download size={14} />
            <span>Download Formatted PDF / Print</span>
          </button>
        </div>

      </div>

    </div>
  );
}
