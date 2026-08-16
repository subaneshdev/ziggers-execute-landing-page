"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/AuthContext';
import { 
  ArrowRight, ShieldCheck, Mail, Lock, Building2, Store, Users, 
  CheckCircle2, AlertCircle, Eye, EyeOff, Loader2, Sparkles, User
} from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const { signUpWithPassword, signInWithOAuth, loginAsDemo } = useAuth();

  const [accountType, setAccountType] = useState('brand'); // 'brand' | 'agency' | 'small_business'
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!email || !password || !fullName) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const { data, error } = await signUpWithPassword({
      email,
      password,
      fullName,
      company: companyName || (accountType === 'agency' ? 'Partner Agency' : 'Brand Client'),
      role: accountType === 'agency' ? 'agency_admin' : accountType === 'small_business' ? 'small_business' : 'brand_admin',
    });

    if (error) {
      setErrorMsg(error.message || 'Failed to create account.');
      setLoading(false);
    } else {
      setSuccessMsg('Account created successfully! Redirecting to campaign console...');
      setTimeout(() => {
        router.push('/dashboard');
      }, 900);
    }
  };

  const handleOAuthSignup = async (provider) => {
    setLoading(true);
    setErrorMsg('');
    const { error } = await signInWithOAuth(provider);
    if (error) {
      setErrorMsg(error.message || `Failed to sign up with ${provider}.`);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative selection:bg-gold/20 selection:text-espresso font-body">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-b from-gold/10 via-linen/20 to-transparent blur-3xl pointer-events-none" />

      {/* Header Brand */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <Link href="/" className="inline-flex items-center gap-2 decoration-transparent">
          <div className="w-9 h-9 bg-espresso text-gold rounded-xl flex items-center justify-center font-black text-lg shadow-sm">
            Z
          </div>
          <span className="text-2xl font-black tracking-tight text-espresso font-display">Ziggers Execute</span>
        </Link>
        <h2 className="mt-4 text-2xl font-black text-espresso tracking-tight font-display">
          Create Your Ziggers Account
        </h2>
        <p className="mt-1 text-xs text-muted font-medium">
          Start launching self-serve offline marketing campaigns across India
        </p>
      </div>

      {/* Signup Card */}
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-sm border border-espresso/10 rounded-3xl sm:px-10">

          {/* Account Type Selector */}
          <div className="mb-5">
            <label className="block text-xs font-bold text-espresso mb-2">I am launching campaigns as:</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'brand', label: 'D2C Brand', icon: <Building2 size={14} /> },
                { id: 'agency', label: 'Agency', icon: <Users size={14} /> },
                { id: 'small_business', label: 'Local Store', icon: <Store size={14} /> },
              ].map((tier) => (
                <button
                  key={tier.id}
                  type="button"
                  onClick={() => setAccountType(tier.id)}
                  className={`p-2.5 rounded-xl border text-center flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    accountType === tier.id
                      ? 'border-gold bg-gold/10 text-espresso font-extrabold ring-1 ring-gold shadow-2xs'
                      : 'border-espresso/15 bg-[#faf9f6] text-muted hover:border-espresso/30'
                  }`}
                >
                  <span className={accountType === tier.id ? 'text-gold' : 'text-muted'}>{tier.icon}</span>
                  <span className="text-[10px] font-bold">{tier.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Alerts */}
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

          {/* Form */}
          <form onSubmit={handleSignup} className="space-y-3.5">
            
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-espresso mb-1">Full Name</label>
              <div className="relative rounded-xl shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted">
                  <User size={14} />
                </div>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Subanesh Kumar"
                  className="block w-full pl-9 pr-3 py-2.5 text-xs bg-[#faf9f6] border border-espresso/15 rounded-xl text-espresso placeholder:text-muted/60 focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold"
                />
              </div>
            </div>

            {/* Company Name */}
            <div>
              <label className="block text-xs font-bold text-espresso mb-1">Company / Brand Name</label>
              <div className="relative rounded-xl shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted">
                  <Building2 size={14} />
                </div>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Artisan Cafe or Zenith Agency"
                  className="block w-full pl-9 pr-3 py-2.5 text-xs bg-[#faf9f6] border border-espresso/15 rounded-xl text-espresso placeholder:text-muted/60 focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold"
                />
              </div>
            </div>

            {/* Work Email */}
            <div>
              <label className="block text-xs font-bold text-espresso mb-1">Work Email</label>
              <div className="relative rounded-xl shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted">
                  <Mail size={14} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="subanesh@company.com"
                  className="block w-full pl-9 pr-3 py-2.5 text-xs bg-[#faf9f6] border border-espresso/15 rounded-xl text-espresso placeholder:text-muted/60 focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-espresso mb-1">Password</label>
              <div className="relative rounded-xl shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted">
                  <Lock size={14} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="block w-full pl-9 pr-9 py-2.5 text-xs bg-[#faf9f6] border border-espresso/15 rounded-xl text-espresso placeholder:text-muted/60 focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted hover:text-espresso"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-espresso hover:bg-muted text-white font-extrabold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={14} className="animate-spin text-gold" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account & Get Started</span>
                  <ArrowRight size={13} className="text-gold" />
                </>
              )}
            </button>
          </form>

          {/* Social OAuth */}
          <div className="mt-5">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-espresso/10" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold text-muted">
                <span className="bg-white px-2">Or continue with</span>
              </div>
            </div>

            <div className="mt-3">
              <button
                type="button"
                onClick={() => handleOAuthSignup('google')}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-espresso/15 rounded-xl bg-white text-xs font-bold text-espresso hover:bg-linen/40 transition-colors shadow-2xs cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Sign up with Google</span>
              </button>
            </div>
          </div>

          {/* Footer Link */}
          <div className="mt-5 text-center text-xs text-muted">
            Already have an account?{' '}
            <Link href="/login" className="font-bold text-espresso hover:text-gold hover:underline">
              Sign in
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
}
