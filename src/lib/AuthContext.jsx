"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabase';

const AuthContext = createContext({
  user: null,
  session: null,
  profile: null,
  loading: true,
  signInWithPassword: async () => {},
  signUpWithPassword: async () => {},
  signInWithOtp: async () => {},
  verifyOtp: async () => {},
  signInWithOAuth: async () => {},
  signOut: async () => {},
  loginAsDemo: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sync session on mount
  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      try {
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (mounted && initialSession) {
          setSession(initialSession);
          setUser(initialSession.user);
          loadProfile(initialSession.user);
        } else if (mounted) {
          // Check for local demo session
          const localDemo = localStorage.getItem('ziggers_demo_user');
          if (localDemo) {
            try {
              const demoUser = JSON.parse(localDemo);
              setUser(demoUser);
              setProfile(demoUser.profile);
            } catch (e) {
              localStorage.removeItem('ziggers_demo_user');
            }
          }
        }
      } catch (err) {
        console.warn('Auth initialization fallback:', err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    initAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        if (!mounted) return;
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        if (currentSession?.user) {
          localStorage.removeItem('ziggers_demo_user');
          await loadProfile(currentSession.user);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  async function loadProfile(currentUser) {
    if (!currentUser) return;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single();

      if (!error && data) {
        setProfile(data);
      } else {
        // Fallback to user metadata
        setProfile({
          id: currentUser.id,
          full_name: currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || 'Ziggers User',
          email: currentUser.email,
          company: currentUser.user_metadata?.company || 'Brand Partner',
          role: currentUser.user_metadata?.role || 'brand_admin',
          avatar_url: currentUser.user_metadata?.avatar_url || null,
        });
      }
    } catch (err) {
      setProfile({
        id: currentUser.id,
        full_name: currentUser.email?.split('@')[0] || 'Ziggers User',
        email: currentUser.email,
        company: 'Brand Partner',
        role: 'brand_admin',
      });
    }
  }

  // 1. Password sign in
  const signInWithPassword = async ({ email, password }) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  // 2. Sign up
  const signUpWithPassword = async ({ email, password, fullName, company, role = 'brand_admin' }) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            company: company,
            role: role,
          },
          emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined,
        },
      });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  // 3. OTP / Magic link
  const signInWithOtp = async ({ email }) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined,
        },
      });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  // 4. Verify OTP
  const verifyOtp = async ({ email, token, type = 'email' }) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type,
      });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  // 5. OAuth (Google, etc.)
  const signInWithOAuth = async (provider = 'google') => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined,
        },
      });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  // 6. Sign out
  const signOut = async () => {
    setLoading(true);
    try {
      localStorage.removeItem('ziggers_demo_user');
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setProfile(null);
    } catch (err) {
      console.error('Sign out error:', err);
    } finally {
      setLoading(false);
    }
  };

  // 7. Instant Demo Login (for frictionless evaluation)
  const loginAsDemo = (tier = 'brand') => {
    const demoProfiles = {
      brand: {
        id: 'demo-brand-101',
        email: 'subanesh@ziggers.in',
        user_metadata: { full_name: 'Subanesh', company: 'Artisan Cafe & Brands', role: 'brand_admin' },
        profile: {
          id: 'demo-brand-101',
          full_name: 'Subanesh',
          email: 'subanesh@ziggers.in',
          company: 'Artisan Cafe & Brands',
          role: 'brand_admin',
          tier: 'D2C Brand',
        }
      },
      agency: {
        id: 'demo-agency-202',
        email: 'ops@experientialmedia.com',
        user_metadata: { full_name: 'Agency Operations Director', company: 'Zenith BTL Agency', role: 'agency_admin' },
        profile: {
          id: 'demo-agency-202',
          full_name: 'Agency Operations Director',
          email: 'ops@experientialmedia.com',
          company: 'Zenith BTL Agency',
          role: 'agency_admin',
          tier: 'Enterprise Agency',
        }
      },
      small_business: {
        id: 'demo-local-303',
        email: 'owner@localbistro.com',
        user_metadata: { full_name: 'Local Bistro Owner', company: 'Chennai Bistro', role: 'small_business' },
        profile: {
          id: 'demo-local-303',
          full_name: 'Local Bistro Owner',
          email: 'owner@localbistro.com',
          company: 'Chennai Bistro',
          role: 'small_business',
          tier: 'Small Business',
        }
      }
    };

    const selected = demoProfiles[tier] || demoProfiles.brand;
    setUser(selected);
    setProfile(selected.profile);
    localStorage.setItem('ziggers_demo_user', JSON.stringify(selected));
    return selected;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        signInWithPassword,
        signUpWithPassword,
        signInWithOtp,
        verifyOtp,
        signInWithOAuth,
        signOut,
        loginAsDemo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
