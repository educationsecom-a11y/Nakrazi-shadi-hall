import { FormEvent, useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarCheck,
  Check,
  Copy,
  Database,
  ExternalLink,
  Image as ImageIcon,
  Layers,
  LogIn,
  LogOut,
  MessageSquareQuote,
  RefreshCw,
  Settings,
  ShieldAlert,
  Tag,
} from 'lucide-react';
import { BrandLogo } from '../components/BrandLogo';
import { AdminContentTab } from '../components/admin/AdminContentTab';
import { AdminInquiriesTab } from '../components/admin/AdminInquiriesTab';
import { AdminPicturesTab } from '../components/admin/AdminPicturesTab';
import { AdminPricingTab } from '../components/admin/AdminPricingTab';
import { useAuth } from '../context/AuthContext';
import { BookingInquiryRecord, useVenueData } from '../context/VenueDataContext';
import {
  BOOTSTRAPPED_ADMIN_EMAIL,
  SUPABASE_PROJECT_ID,
  isMissingTableError,
  supabase,
} from '../lib/supabase';
import { SUPABASE_SCHEMA_SQL } from '../lib/supabaseSchema';

type AdminTab =
  | 'inquiries'
  | 'pictures'
  | 'pricing'
  | 'services-halls'
  | 'reviews-faqs'
  | 'settings';

const TABS: { id: AdminTab; label: string; icon: typeof CalendarCheck }[] = [
  { id: 'inquiries', label: 'Booking Inquiries', icon: CalendarCheck },
  { id: 'pictures', label: 'Pictures & Gallery', icon: ImageIcon },
  { id: 'pricing', label: 'Packages & Menu Prices', icon: Tag },
  { id: 'services-halls', label: 'Services & Hall Specs', icon: Layers },
  { id: 'reviews-faqs', label: 'Reviews & FAQs', icon: MessageSquareQuote },
  { id: 'settings', label: 'Venue & Hero Settings', icon: Settings },
];

export function AdminPage() {
  const {
    user,
    authReady,
    isAdmin,
    checkingRole,
    signInWithEmail,
    signUpAdmin,
    signInWithGoogle,
    logout,
  } = useAuth();
  const {
    galleryItems,
    menuDishes,
    packages,
    supabaseStatus,
    refreshFromSupabase,
    seedDefaultsToSupabase,
  } = useVenueData();

  const [activeTab, setActiveTab] = useState<AdminTab>('inquiries');
  const [inquiries, setInquiries] = useState<BookingInquiryRecord[]>([]);
  const [loadingInquiries, setLoadingInquiries] = useState(true);

  // Auth form state
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [emailInput, setEmailInput] = useState(BOOTSTRAPPED_ADMIN_EMAIL);
  const [passwordInput, setPasswordInput] = useState('');
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authInfo, setAuthInfo] = useState('');

  // Sync & SQL setup state
  const [syncingDefaults, setSyncingDefaults] = useState(false);
  const [syncNotice, setSyncNotice] = useState('');
  const [syncError, setSyncError] = useState('');
  const [copiedSql, setCopiedSql] = useState(false);
  const [showSqlModal, setShowSqlModal] = useState(false);

  const loadInquiries = useCallback(async () => {
    if (!authReady || !user || !isAdmin) {
      setInquiries([]);
      setLoadingInquiries(false);
      return;
    }
    setLoadingInquiries(true);
    try {
      const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        if (!isMissingTableError(error)) {
          setSyncError(`Unable to load inquiries: ${error.message}`);
        }
        setInquiries([]);
        return;
      }

      const list: BookingInquiryRecord[] = (data || []).map((row) => ({
        id: row.id,
        fullName: row.full_name || '',
        phone: row.phone || '',
        eventDate: row.event_date || '',
        eventShift: (row.event_shift === 'Day Lunch' ? 'Day Lunch' : 'Night Dinner'),
        eventType: row.event_type || '',
        gentsCount: Number(row.gents_count) || 0,
        ladiesCount: Number(row.ladies_count) || 0,
        catering:
          row.catering === 'No - Hall Only' ? 'No - Hall Only' : 'Yes - Per Head',
        notes: row.notes || '',
        status: (row.status || 'pending') as BookingInquiryRecord['status'],
        createdAt: row.created_at || null,
      }));
      setInquiries(list);
    } finally {
      setLoadingInquiries(false);
    }
  }, [authReady, user, isAdmin]);

  useEffect(() => {
    loadInquiries();
    if (!authReady || !user || !isAdmin) return;

    const channel = supabase
      .channel('admin-inquiries-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'inquiries' }, () => {
        loadInquiries();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [authReady, user, isAdmin, loadInquiries]);

  const handleEmailAuth = async (e: FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthInfo('');
    if (!emailInput.trim() || !passwordInput) {
      setAuthError('Please enter your administrator email and password.');
      return;
    }
    setAuthSubmitting(true);
    try {
      if (authMode === 'signin') {
        await signInWithEmail(emailInput, passwordInput);
      } else {
        const res = await signUpAdmin(emailInput, passwordInput);
        if (res.needsEmailConfirmation) {
          setAuthInfo(
            'Account created. Please check your inbox and confirm your email, then sign in.'
          );
          setAuthMode('signin');
        }
      }
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Authentication failed.');
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setAuthError('');
    setAuthInfo('');
    try {
      await signInWithGoogle();
    } catch (err) {
      setAuthError(
        err instanceof Error ? err.message : 'Unable to sign in with Google right now.'
      );
    }
  };

  const handleSeedCloud = async () => {
    setSyncingDefaults(true);
    setSyncNotice('');
    setSyncError('');
    try {
      await seedDefaultsToSupabase();
      setSyncNotice(
        `All website pictures, packages, menu rates, services, and FAQs are synced to Supabase (${SUPABASE_PROJECT_ID}).`
      );
    } catch (err) {
      setSyncError(
        err instanceof Error
          ? err.message
          : 'Failed to sync defaults to Supabase. Verify schema SQL has been run.'
      );
    } finally {
      setSyncingDefaults(false);
    }
  };

  const handleCopySql = async () => {
    try {
      await navigator.clipboard.writeText(SUPABASE_SCHEMA_SQL);
      setCopiedSql(true);
      setTimeout(() => setCopiedSql(false), 2500);
    } catch {
      setShowSqlModal(true);
    }
  };

  // Loading state while Auth initializes
  if (!authReady || checkingRole) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl border border-[#E5E2E1] p-8 max-w-sm w-full text-center space-y-3">
          <BrandLogo className="w-12 h-12 mx-auto" />
          <p className="font-serif text-xl font-bold text-[#0B3B2E]">
            Loading Admin Portal
          </p>
          <p className="text-xs text-[#525B57]">Verifying Supabase session...</p>
        </div>
      </div>
    );
  }

  // Unauthenticated Sign-In Gate
  if (!user) {
    return (
      <div className="min-h-screen bg-[#0B3B2E] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-[#D4AF37]/40 max-w-md w-full p-8 shadow-2xl space-y-5">
          <div className="flex items-center gap-3 pb-4 border-b border-[#E5E2E1]">
            <BrandLogo className="w-11 h-11 shrink-0" />
            <div>
              <h1 className="font-serif text-2xl font-bold text-[#0B3B2E]">
                Nakreezay Admin Portal
              </h1>
              <p className="text-xs text-[#525B57]">
                Supabase Connected · Project {SUPABASE_PROJECT_ID}
              </p>
            </div>
          </div>

          <div className="flex rounded-lg bg-[#FAF7F2] p-1 border border-[#E5E2E1] text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setAuthMode('signin');
                setAuthError('');
              }}
              className={`flex-1 py-2 rounded-md cursor-pointer transition-colors ${
                authMode === 'signin'
                  ? 'bg-[#0B3B2E] text-[#F3DF98]'
                  : 'text-[#525B57] hover:text-[#0B3B2E]'
              }`}
            >
              Admin Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('signup');
                setAuthError('');
              }}
              className={`flex-1 py-2 rounded-md cursor-pointer transition-colors ${
                authMode === 'signup'
                  ? 'bg-[#0B3B2E] text-[#F3DF98]'
                  : 'text-[#525B57] hover:text-[#0B3B2E]'
              }`}
            >
              First-Time Setup
            </button>
          </div>

          {authError && (
            <p className="text-xs text-red-700 bg-red-50 border border-red-200 p-3 rounded-lg">
              {authError}
            </p>
          )}
          {authInfo && (
            <p className="text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 p-3 rounded-lg">
              {authInfo}
            </p>
          )}

          <form onSubmit={handleEmailAuth} className="space-y-3.5">
            <div>
              <label htmlFor="adm-email" className="block text-xs font-semibold text-[#1E1E1E] mb-1">
                Administrator Email
              </label>
              <input
                id="adm-email"
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                required
                className="w-full h-10 px-3 rounded-lg border border-[#D8D3C8] bg-[#FAF7F2] text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
            </div>

            <div>
              <label htmlFor="adm-pass" className="block text-xs font-semibold text-[#1E1E1E] mb-1">
                Password
              </label>
              <input
                id="adm-pass"
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                required
                minLength={6}
                placeholder="Minimum 6 characters"
                className="w-full h-10 px-3 rounded-lg border border-[#D8D3C8] bg-[#FAF7F2] text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
            </div>

            <button
              type="submit"
              disabled={authSubmitting}
              className="w-full py-2.5 px-4 rounded-lg bg-[#D4AF37] hover:bg-[#C39B24] disabled:opacity-60 text-[#0B3B2E] font-semibold text-sm inline-flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <LogIn className="w-4 h-4" />
              <span>
                {authSubmitting
                  ? 'Authenticating...'
                  : authMode === 'signin'
                  ? 'Sign In to Admin Portal'
                  : 'Create Admin Account'}
              </span>
            </button>
          </form>

          <div className="relative flex items-center py-1">
            <div className="flex-grow border-t border-[#E5E2E1]" />
            <span className="mx-3 text-[11px] uppercase tracking-wider text-[#525B57]">or</span>
            <div className="flex-grow border-t border-[#E5E2E1]" />
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full py-2.5 px-4 rounded-lg border border-[#D8D3C8] hover:border-[#0B3B2E] bg-white text-[#0B3B2E] font-semibold text-xs inline-flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <span>Continue with Google (Supabase OAuth)</span>
          </button>

          <div className="pt-1 text-center">
            <Link to="/" className="text-xs font-semibold text-[#0B3B2E] hover:underline">
              Return to Public Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated but NOT authorized admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-[#E5E2E1] max-w-md w-full p-8 text-center space-y-4">
          <ShieldAlert className="w-10 h-10 text-red-700 mx-auto" />
          <h1 className="font-serif text-2xl font-bold text-[#0B3B2E]">
            Admin Access Required
          </h1>
          <p className="text-sm text-[#525B57]">
            Signed in as <span className="font-semibold text-[#1E1E1E]">{user.email}</span>. This account is not listed in Supabase <code className="text-xs bg-[#FAF7F2] px-1.5 py-0.5 rounded">admin_users</code> for Nakreezay Shadi Hall.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={logout}
              className="flex-1 py-2.5 px-4 rounded-lg bg-[#0B3B2E] text-white text-xs font-semibold cursor-pointer"
            >
              Sign Out
            </button>
            <Link
              to="/"
              className="flex-1 py-2.5 px-4 rounded-lg border border-[#E5E2E1] text-[#0B3B2E] text-xs font-semibold text-center"
            >
              Back to Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const pendingCount = inquiries.filter((i) => i.status === 'pending').length;
  const confirmedCount = inquiries.filter((i) => i.status === 'confirmed').length;
  const activeTabLabel = TABS.find((t) => t.id === activeTab)?.label || 'Dashboard';

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1E1E1E] flex flex-col lg:flex-row" dir="ltr">
      {/* Left Sidebar (Desktop) */}
      <aside className="w-full lg:w-64 bg-[#0B3B2E] text-[#FAF7F2] shrink-0 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#D4AF37]/30">
        <div>
          <div className="p-5 border-b border-white/10 flex items-center justify-between lg:justify-start gap-3">
            <Link to="/" className="flex items-center gap-2.5">
              <BrandLogo light className="w-9 h-9 shrink-0" />
              <div>
                <p className="font-serif text-base font-bold text-[#F3DF98] leading-tight">
                  Nakreezay
                </p>
                <p className="text-[11px] text-[#B9CEC6]">Supabase Admin</p>
              </div>
            </Link>
          </div>

          <nav className="p-3 flex lg:flex-col gap-1 overflow-x-auto" aria-label="Admin sections">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                    isActive
                      ? 'bg-[#D4AF37] text-[#0B3B2E]'
                      : 'text-[#D6E2DD] hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="hidden lg:block p-4 border-t border-white/10 space-y-3">
          <div className="text-xs">
            <p className="text-[#B9CEC6]">Signed in as</p>
            <p className="font-semibold text-white truncate">{user.email}</p>
            <p className="text-[11px] text-[#D4AF37] mt-1 font-mono">{SUPABASE_PROJECT_ID}</p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="w-full py-2 px-3 rounded-lg border border-white/20 hover:bg-white/10 text-xs font-semibold inline-flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="bg-white border-b border-[#E5E2E1] px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs sm:text-sm min-w-0">
            <span className="text-[#525B57] hidden sm:inline">Nakreezay</span>
            <span className="text-[#D4AF37] hidden sm:inline">/</span>
            <span className="text-[#525B57]">Admin Portal</span>
            <span className="text-[#D4AF37]">/</span>
            <span className="font-semibold text-[#0B3B2E] truncate">{activeTabLabel}</span>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setShowSqlModal((v) => !v)}
              className="px-3 py-2 rounded-lg border border-[#E5E2E1] hover:border-[#0B3B2E] text-xs font-semibold text-[#0B3B2E] inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <span>SQL Schema</span>
            </button>

            <button
              type="button"
              onClick={handleSeedCloud}
              disabled={syncingDefaults}
              className="px-3 py-2 rounded-lg border border-[#E5E2E1] hover:border-[#0B3B2E] text-xs font-semibold text-[#0B3B2E] inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Database className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="hidden sm:inline">
                {syncingDefaults ? 'Syncing...' : 'Sync Defaults to Supabase'}
              </span>
              <span className="sm:hidden">Sync</span>
            </button>

            <Link
              to="/"
              className="px-3.5 py-2 rounded-lg bg-[#0B3B2E] hover:bg-[#06241B] text-[#FAF7F2] text-xs font-semibold inline-flex items-center gap-1.5 whitespace-nowrap"
            >
              <span>View Live Site</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#D4AF37]" />
            </Link>

            <button
              type="button"
              onClick={logout}
              aria-label="Sign out"
              className="lg:hidden p-2 rounded-lg border border-[#E5E2E1] text-[#0B3B2E] cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        <main className="p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Missing Schema Banner (appears until user runs schema.sql in Supabase SQL Editor) */}
          {(supabaseStatus.missingSchema || showSqlModal) && (
            <div className="bg-white rounded-xl border border-[#D4AF37] p-5 space-y-4 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="font-serif text-lg font-bold text-[#0B3B2E]">
                    Supabase Database Schema Setup ({SUPABASE_PROJECT_ID})
                  </h2>
                  <p className="text-xs text-[#525B57] mt-0.5">
                    {supabaseStatus.missingSchema
                      ? 'Your Supabase project is connected, but the venue tables have not been created yet. Paste this SQL into your Supabase SQL Editor, run it once, and click Verify Connection.'
                      : 'Reference SQL schema for your Supabase PostgreSQL tables and Row Level Security policies.'}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleCopySql}
                    className="px-3.5 py-2 rounded-lg bg-[#D4AF37] hover:bg-[#C39B24] text-[#0B3B2E] text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSql ? 'Copied SQL' : 'Copy Schema SQL'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      await refreshFromSupabase();
                      await loadInquiries();
                    }}
                    className="px-3.5 py-2 rounded-lg bg-[#0B3B2E] text-[#FAF7F2] text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Verify Connection</span>
                  </button>
                </div>
              </div>

              <pre className="max-h-56 overflow-auto rounded-lg bg-[#06241B] text-[#FAF7F2] p-4 text-[11px] font-mono leading-relaxed">
                {SUPABASE_SCHEMA_SQL}
              </pre>
            </div>
          )}

          {syncNotice && (
            <div className="text-xs font-semibold text-emerald-900 bg-emerald-50 border border-emerald-200 px-4 py-3 rounded-xl">
              {syncNotice}
            </div>
          )}

          {syncError && (
            <div className="text-xs font-semibold text-red-800 bg-red-50 border border-red-200 px-4 py-3 rounded-xl">
              {syncError}
            </div>
          )}

          {/* KPI Summary Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-white rounded-xl border border-[#E5E2E1] p-4">
              <p className="text-xs text-[#525B57]">Total Inquiries</p>
              <p className="font-serif text-2xl font-bold text-[#0B3B2E] tabular-nums mt-1">
                {inquiries.length}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-[#E5E2E1] p-4">
              <p className="text-xs text-[#525B57]">Pending Review</p>
              <p className="font-serif text-2xl font-bold text-[#9B7B16] tabular-nums mt-1">
                {pendingCount}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-[#E5E2E1] p-4">
              <p className="text-xs text-[#525B57]">Confirmed Dates</p>
              <p className="font-serif text-2xl font-bold text-[#15803D] tabular-nums mt-1">
                {confirmedCount}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-[#E5E2E1] p-4">
              <p className="text-xs text-[#525B57]">Gallery Photos</p>
              <p className="font-serif text-2xl font-bold text-[#0B3B2E] tabular-nums mt-1">
                {galleryItems.length}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-[#E5E2E1] p-4">
              <p className="text-xs text-[#525B57]">Packages</p>
              <p className="font-serif text-2xl font-bold text-[#0B3B2E] tabular-nums mt-1">
                {packages.length}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-[#E5E2E1] p-4">
              <p className="text-xs text-[#525B57]">Menu Dishes</p>
              <p className="font-serif text-2xl font-bold text-[#0B3B2E] tabular-nums mt-1">
                {menuDishes.length}
              </p>
            </div>
          </div>

          {activeTab === 'inquiries' && (
            <AdminInquiriesTab inquiries={inquiries} loading={loadingInquiries} />
          )}
          {activeTab === 'pictures' && <AdminPicturesTab />}
          {activeTab === 'pricing' && <AdminPricingTab />}
          {(activeTab === 'services-halls' ||
            activeTab === 'reviews-faqs' ||
            activeTab === 'settings') && <AdminContentTab section={activeTab} />}
        </main>
      </div>
    </div>
  );
}
