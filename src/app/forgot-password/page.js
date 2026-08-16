"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';
import { Mail, ArrowRight, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('Please enter your account email.');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      });
      if (error) throw error;
      setSuccessMsg('Password reset link sent! Check your inbox to set a new password.');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to send password reset email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative selection:bg-gold/20 selection:text-espresso font-body">
      <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none" />
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <Link href="/" className="inline-flex items-center gap-2 decoration-transparent">
          <div className="w-9 h-9 bg-espresso text-gold rounded-xl flex items-center justify-center font-black text-lg shadow-sm">
            Z
          </div>
          <span className="text-2xl font-black tracking-tight text-espresso font-display">Ziggers Execute</span>
        </Link>
        <h2 className="mt-4 text-2xl font-black text-espresso tracking-tight font-display">
          Reset Your Password
        </h2>
        <p className="mt-1 text-xs text-muted font-medium">
          Enter your email to receive password recovery instructions
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-sm border border-espresso/10 rounded-3xl sm:px-10">
          
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
              <AlertCircle size={14} className="shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-xs text-green-700 flex items-start gap-2">
              <CheckCircle2 size={14} className="shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-espresso mb-1">Account Email</label>
              <div className="relative rounded-xl shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted">
                  <Mail size={14} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="block w-full pl-9 pr-3 py-2.5 text-xs bg-[#faf9f6] border border-espresso/15 rounded-xl text-espresso placeholder:text-muted/60 focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-espresso hover:bg-muted text-white font-extrabold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={14} className="animate-spin text-gold" />
                  <span>Sending Link...</span>
                </>
              ) : (
                <>
                  <span>Send Password Reset Link</span>
                  <ArrowRight size={13} className="text-gold" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-muted">
            Remember your password?{' '}
            <Link href="/login" className="font-bold text-espresso hover:text-gold hover:underline">
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
