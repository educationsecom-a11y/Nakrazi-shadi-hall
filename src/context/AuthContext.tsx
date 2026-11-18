import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { BOOTSTRAPPED_ADMIN_EMAIL, isMissingTableError, supabase } from '../lib/supabase';

interface AuthContextValue {
  user: User | null;
  authReady: boolean;
  isAdmin: boolean;
  checkingRole: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpAdmin: (email: string, password: string) => Promise<{ needsEmailConfirmation: boolean }>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingRole, setCheckingRole] = useState(true);

  const verifyAdminRole = async (nextUser: User | null) => {
    setUser(nextUser);
    if (!nextUser) {
      setIsAdmin(false);
      setCheckingRole(false);
      setAuthReady(true);
      return;
    }

    setCheckingRole(true);
    try {
      const userEmail = nextUser.email?.trim().toLowerCase() || '';
      if (userEmail && userEmail === BOOTSTRAPPED_ADMIN_EMAIL.toLowerCase()) {
        setIsAdmin(true);
      } else if (userEmail) {
        const { data, error } = await supabase
          .from('admin_users')
          .select('email')
          .ilike('email', userEmail)
          .maybeSingle();

        if (error && !isMissingTableError(error)) {
          setIsAdmin(false);
        } else {
          setIsAdmin(Boolean(data));
        }
      } else {
        setIsAdmin(false);
      }
    } catch {
      setIsAdmin(false);
    } finally {
      setCheckingRole(false);
      setAuthReady(true);
    }
  };

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (mounted) {
        verifyAdminRole(data.session?.user ?? null);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        verifyAdminRole(session?.user ?? null);
      }
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (error) {
      throw new Error(error.message);
    }
  };

  const signUpAdmin = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/admin`,
      },
    });
    if (error) {
      throw new Error(error.message);
    }
    return {
      needsEmailConfirmation: !data.session,
    };
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/admin`,
      },
    });
    if (error) {
      throw new Error(error.message);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        authReady,
        isAdmin,
        checkingRole,
        signInWithEmail,
        signUpAdmin,
        signInWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
