"use client";
import React from 'react';
import { Cloud, Check, Loader2 } from 'lucide-react';

export default function DraftSaveIndicator({ isSaving, lastSaved }) {
  return (
    <div className="flex items-center gap-1.5 text-[11px] text-muted font-medium bg-linen/50 border border-espresso/10 px-2.5 py-1 rounded-lg shadow-2xs">
      {isSaving ? (
        <>
          <Loader2 size={12} className="animate-spin text-gold" />
          <span>Saving draft...</span>
        </>
      ) : (
        <>
          <Check size={12} className="text-green-600" />
          <span>
            {lastSaved ? `Draft saved ${new Date(lastSaved).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Draft autosaved'}
          </span>
        </>
      )}
    </div>
  );
}
