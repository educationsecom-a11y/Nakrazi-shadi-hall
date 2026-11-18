import { Link } from 'react-router-dom';
import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { useLanguage } from '../context/LanguageContext';
import { useVenueData } from '../context/VenueDataContext';

export function Footer() {
  const { lang, t } = useLanguage();
  const { siteConfig, whatsappDefaultUrl } = useVenueData();

  return (
    <footer className="bg-[#0B3B2E] text-[#FAF7F2] border-t border-[#D4AF37]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: Brand summary & logo */}
          <div className="flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-3 w-fit">
              <BrandLogo light className="w-10 h-10 shrink-0" />
              <div className="flex flex-col leading-tight">
                <span className="font-serif text-xl font-bold text-[#F3DF98]">
                  {t.brandName}
                </span>
                <span className="text-xs text-[#D6E2DD]">{t.brandSubtitle}</span>
              </div>
            </Link>
            <p className="text-sm text-[#D6E2DD] leading-relaxed">{t.footer.summary}</p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col gap-4">
            <h3 className="font-serif text-lg font-semibold text-[#F3DF98]">
              {t.footer.quickLinks}
            </h3>
            <nav className="flex flex-col gap-2.5 text-sm text-[#D6E2DD]" aria-label="Footer Quick Links">
              <Link to="/" className="hover:text-[#D4AF37] transition-colors w-fit">
                {t.nav.home}
              </Link>
              <Link to="/about" className="hover:text-[#D4AF37] transition-colors w-fit">
                {t.nav.about}
              </Link>
              <Link to="/services" className="hover:text-[#D4AF37] transition-colors w-fit">
                {t.nav.services}
              </Link>
              <Link to="/gallery" className="hover:text-[#D4AF37] transition-colors w-fit">
                {t.nav.gallery}
              </Link>
              <Link to="/packages" className="hover:text-[#D4AF37] transition-colors w-fit">
                {t.nav.packages}
              </Link>
              <Link to="/contact" className="hover:text-[#D4AF37] transition-colors w-fit">
                {t.nav.contact}
              </Link>
            </nav>
          </div>

          {/* Column 3: Visiting Hours */}
          <div className="flex flex-col gap-4">
            <h3 className="font-serif text-lg font-semibold text-[#F3DF98]">
              {t.footer.visitingHours}
            </h3>
            <div className="flex flex-col gap-3 text-sm text-[#D6E2DD]">
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">
                    {lang === 'en' ? siteConfig.visitingHoursEn : siteConfig.visitingHoursUr}
                  </p>
                  <p className="text-xs text-[#B9CEC6] mt-1">
                    {lang === 'en' ? siteConfig.fridayNoteEn : siteConfig.fridayNoteUr}
                  </p>
                </div>
              </div>
              <p className="text-sm text-[#D6E2DD] leading-relaxed">{t.footer.toursWelcome}</p>
            </div>
          </div>

          {/* Column 4: Contact Details */}
          <div className="flex flex-col gap-4">
            <h3 className="font-serif text-lg font-semibold text-[#F3DF98]">
              {t.footer.contactDetails}
            </h3>
            <div className="flex flex-col gap-3 text-sm text-[#D6E2DD]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-1" />
                <p className="leading-relaxed">
                  {lang === 'en' ? siteConfig.addressEn : siteConfig.addressUr}
                </p>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <a
                  href={`tel:${siteConfig.phoneRaw}`}
                  dir="ltr"
                  className="hover:text-[#D4AF37] transition-colors tabular-nums font-medium"
                >
                  {siteConfig.phoneDisplay}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="hover:text-[#D4AF37] transition-colors break-all"
                >
                  {siteConfig.email}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#06241B] border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#B9CEC6]">
          <p>{t.footer.rights}</p>
          <div className="flex items-center gap-3">
            <Link to="/contact" className="hover:text-[#D4AF37] transition-colors">
              {t.nav.bookYourDate}
            </Link>
            <span aria-hidden="true">·</span>
            <a
              href={whatsappDefaultUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#D4AF37] transition-colors"
            >
              WhatsApp
            </a>
            <span aria-hidden="true">·</span>
            <Link to="/admin" className="hover:text-[#D4AF37] transition-colors font-medium">
              {lang === 'en' ? 'Admin Portal' : 'ایڈمن پورٹل'}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
