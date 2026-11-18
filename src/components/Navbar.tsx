import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, MessageCircle, Phone, X } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { useLanguage } from '../context/LanguageContext';
import { useVenueData } from '../context/VenueDataContext';

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { lang, setLang, t } = useLanguage();
  const { siteConfig, whatsappDefaultUrl } = useVenueData();
  const location = useLocation();

  const navItems = [
    { to: '/', label: t.nav.home },
    { to: '/about', label: t.nav.about },
    { to: '/services', label: t.nav.services },
    { to: '/gallery', label: t.nav.gallery },
    { to: '/packages', label: t.nav.packages },
    { to: '/contact', label: t.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#D4AF37]/25">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Left: Emblem + Brand */}
        <Link
          to="/"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-3 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] rounded-lg py-1"
        >
          <BrandLogo className="w-10 h-10 shrink-0" />
          <div className="flex flex-col leading-tight">
            <span className="font-serif text-lg sm:text-xl font-bold text-[#0B3B2E] whitespace-nowrap">
              {t.brandName}
            </span>
            <span className="text-xs font-medium tracking-wide text-[#7A6114] whitespace-nowrap">
              {t.brandSubtitle}
            </span>
          </div>
        </Link>

        {/* Center: Navigation Links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden lg:flex items-center gap-6"
        >
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={`relative py-2 text-sm font-semibold whitespace-nowrap shrink-0 transition-colors duration-150 ${
                  isActive
                    ? 'text-[#0B3B2E]'
                    : 'text-[#4A534F] hover:text-[#0B3B2E]'
                }`}
              >
                {item.label}
                <span
                  className={`absolute bottom-0 inset-x-0 h-0.5 bg-[#D4AF37] transition-transform duration-150 origin-center ${
                    isActive ? 'scale-x-100' : 'scale-x-0'
                  }`}
                />
              </NavLink>
            );
          })}
        </nav>

        {/* Right: Language Switcher + WhatsApp + Primary CTA */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          <div
            className="inline-flex items-center rounded-md border border-[#D4AF37]/40 bg-white p-0.5"
            role="group"
            aria-label="Language switcher"
          >
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors cursor-pointer whitespace-nowrap ${
                lang === 'en'
                  ? 'bg-[#0B3B2E] text-[#FAF7F2]'
                  : 'text-[#4A534F] hover:text-[#0B3B2E]'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLang('ur')}
              className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors cursor-pointer whitespace-nowrap ${
                lang === 'ur'
                  ? 'bg-[#0B3B2E] text-[#FAF7F2]'
                  : 'text-[#4A534F] hover:text-[#0B3B2E]'
              }`}
            >
              اردو
            </button>
          </div>

          <a
            href={whatsappDefaultUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className="w-10 h-10 inline-flex items-center justify-center rounded-lg border border-[#0B3B2E]/15 bg-white text-[#0B3B2E] hover:bg-[#0B3B2E] hover:text-[#FAF7F2] transition-colors shrink-0"
          >
            <MessageCircle className="w-4 h-4" />
          </a>

          <Link
            to="/contact"
            className="px-4 py-2.5 rounded-lg bg-[#D4AF37] hover:bg-[#C39B24] text-[#0B3B2E] font-semibold text-sm whitespace-nowrap shrink-0 transition-colors shadow-sm"
          >
            {t.nav.bookYourDate}
          </Link>
        </div>

        {/* Mobile Actions */}
        <div className="flex lg:hidden items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setLang(lang === 'en' ? 'ur' : 'en')}
            className="px-2.5 py-2 text-xs font-semibold rounded-md border border-[#D4AF37]/50 bg-white text-[#0B3B2E] cursor-pointer whitespace-nowrap"
          >
            {lang === 'en' ? 'اردو' : 'EN'}
          </button>
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={mobileOpen}
            className="w-11 h-11 inline-flex items-center justify-center rounded-lg border border-[#0B3B2E]/20 bg-white text-[#0B3B2E] cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Slide-Out Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-[#06241B]/60 backdrop-blur-xs"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="fixed top-0 end-0 h-full w-80 max-w-[85vw] bg-[#FAF7F2] shadow-2xl flex flex-col justify-between p-6 border-s border-[#D4AF37]/30 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-5 border-b border-[#D4AF37]/25">
                <div className="flex items-center gap-2.5">
                  <BrandLogo className="w-9 h-9" />
                  <div>
                    <div className="font-serif text-base font-bold text-[#0B3B2E]">
                      {t.brandName}
                    </div>
                    <div className="text-xs text-[#7A6114]">{t.brandSubtitle}</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close navigation menu"
                  className="w-10 h-10 inline-flex items-center justify-center rounded-lg text-[#0B3B2E] hover:bg-[#0B3B2E]/10 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="mt-6 flex flex-col gap-1.5" aria-label="Mobile Navigation">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.to;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={() => setMobileOpen(false)}
                      className={`px-4 py-3 rounded-lg text-base font-semibold transition-colors ${
                        isActive
                          ? 'bg-[#0B3B2E] text-[#F3DF98]'
                          : 'text-[#1E1E1E] hover:bg-[#0B3B2E]/5'
                      }`}
                    >
                      {item.label}
                    </NavLink>
                  );
                })}
              </nav>

              <div className="mt-6 pt-5 border-t border-[#D4AF37]/25">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-[#525B57]">
                    {lang === 'en' ? 'Language' : 'زبان'}
                  </span>
                  <div className="inline-flex rounded-md border border-[#D4AF37]/40 bg-white p-0.5">
                    <button
                      type="button"
                      onClick={() => setLang('en')}
                      className={`px-3 py-1.5 text-xs font-semibold rounded cursor-pointer ${
                        lang === 'en' ? 'bg-[#0B3B2E] text-white' : 'text-[#525B57]'
                      }`}
                    >
                      English
                    </button>
                    <button
                      type="button"
                      onClick={() => setLang('ur')}
                      className={`px-3 py-1.5 text-xs font-semibold rounded cursor-pointer ${
                        lang === 'ur' ? 'bg-[#0B3B2E] text-white' : 'text-[#525B57]'
                      }`}
                    >
                      اردو
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 pt-4 border-t border-[#D4AF37]/25">
              <Link
                to="/contact"
                onClick={() => setMobileOpen(false)}
                className="w-full py-3 px-4 rounded-lg bg-[#D4AF37] text-[#0B3B2E] font-semibold text-center text-sm"
              >
                {t.nav.bookYourDate}
              </Link>
              <a
                href={`tel:${siteConfig.phoneRaw}`}
                className="w-full py-3 px-4 rounded-lg border border-[#0B3B2E]/20 bg-white text-[#0B3B2E] font-semibold text-sm inline-flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                <span className="tabular-nums" dir="ltr">
                  {siteConfig.phoneDisplay}
                </span>
              </a>
              <a
                href={whatsappDefaultUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-lg bg-[#0B3B2E] text-[#FAF7F2] font-semibold text-sm inline-flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-[#D4AF37]" />
                <span>{t.common.whatsappUs}</span>
              </a>
            </div>
          </aside>
        </div>
      )}
    </header>
  );
}
