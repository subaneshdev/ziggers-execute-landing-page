"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabase';

const AuthContext = createContext({
  user: null,
  session: null,
  profile: null,
  organization: null,
  loading: true,
  signInWithPassword: async () => {},
  signUpWithPassword: async () => {},
  signInWithOtp: async () => {},
  verifyOtp: async () => {},
  signInWithOAuth: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [organization, setOrganization] = useState(null);
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
          await loadProfileAndOrg(initialSession.user);
        }
      } catch (err) {
        console.warn('Auth initialization:', err.message);
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
          await loadProfileAndOrg(currentSession.user);
        } else {
          setProfile(null);
          setOrganization(null);
        }
        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  async function loadProfileAndOrg(currentUser) {
    if (!currentUser) return;
    try {
      // 1. Fetch user profile
      const { data: profData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single();

      if (profData) {
        setProfile(profData);
      } else {
        setProfile({
          id: currentUser.id,
          full_name: currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || 'Ziggers User',
          email: currentUser.email,
          company: currentUser.user_metadata?.company || 'Organization',
          role: currentUser.user_metadata?.role || 'admin',
        });
      }

      // 2. Fetch or resolve organization context
      const { data: orgData } = await supabase
        .from('organizations')
        .select('*')
        .eq('email', currentUser.email)
        .limit(1);

      if (orgData && orgData.length > 0) {
        setOrganization(orgData[0]);
      } else {
        setOrganization({
          id: currentUser.id,
          name: currentUser.user_metadata?.company || `${currentUser.user_metadata?.full_name || 'My'} Organization`,
          email: currentUser.email
        });
      }
    } catch (err) {
      console.warn('Profile resolution:', err.message);
    }
  }

  // 1. Email & Password Sign In
  const signInWithPassword = async ({ email, password }) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      setUser(data.user);
      setSession(data.session);
      await loadProfileAndOrg(data.user);
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  // 2. Sign Up with Email, Password, Full Name, Company
  const signUpWithPassword = async ({ email, password, full_name, company, role = 'brand_admin' }) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name,
            company,
            role,
          },
        },
      });
      if (error) throw error;

      // Insert profile record if user created
      if (data.user) {
        await supabase.from('profiles').insert([{
          id: data.user.id,
          full_name,
          company,
          role,
          email,
          created_at: new Date().toISOString()
        }]);

        await supabase.from('organizations').insert([{
          name: company,
          email,
          created_at: new Date().toISOString()
        }]);
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  // 3. Passwordless OTP Magic Link
  const signInWithOtp = async ({ email }) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/dashboard` : undefined,
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

  // 4. Verify OTP Token
  const verifyOtp = async ({ email, token, type = 'magiclink' }) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.verifyOtp({ email, token, type });
      if (error) throw error;
      setUser(data.user);
      setSession(data.session);
      await loadProfileAndOrg(data.user);
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  // 5. OAuth Provider Sign In (Google, etc.)
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
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setProfile(null);
      setOrganization(null);
    } catch (err) {
      console.error('Sign out error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        organization,
        loading,
        signInWithPassword,
        signUpWithPassword,
        signInWithOtp,
        verifyOtp,
        signInWithOAuth,
        signOut,
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
