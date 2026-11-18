import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Calendar,
  Car,
  Check,
  ChevronLeft,
  ChevronRight,
  Phone,
  Quote,
  ShieldCheck,
  Users,
  Utensils,
  Zap,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { useVenueData } from '../context/VenueDataContext';
import { VENUE_CONTACT, VENUE_HIGHLIGHTS } from '../data/venueData';
import { VenueImage } from '../components/VenueImage';

export function HomePage() {
  const { lang, t, isRtl } = useLanguage();
  const { siteConfig, services, packages, testimonials } = useVenueData();
  const navigate = useNavigate();

  const [eventDate, setEventDate] = useState('2026-12-12');
  const [eventType, setEventType] = useState('Barat');
  const [guestCount, setGuestCount] = useState('500');
  const [eventShift, setEventShift] = useState('Night Dinner');
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  const handleAvailabilitySubmit = (e: FormEvent) => {
    e.preventDefault();
    navigate('/contact', {
      state: {
        eventDate,
        eventType,
        estimatedGuests: guestCount,
        eventShift,
      },
    });
  };

  const highlightIcon = (icon: 'shield' | 'users' | 'zap' | 'car') => {
    switch (icon) {
      case 'shield':
        return <ShieldCheck className="w-6 h-6 text-[#0B3B2E]" />;
      case 'users':
        return <Users className="w-6 h-6 text-[#0B3B2E]" />;
      case 'zap':
        return <Zap className="w-6 h-6 text-[#0B3B2E]" />;
      case 'car':
        return <Car className="w-6 h-6 text-[#0B3B2E]" />;
    }
  };

  // Show Stage Decor, Catering, and Sound & Lighting using live showcase images
  const previewServices = services.slice(1, 4).map((svc) => {
    if (svc.id === 'stage-decor') return { ...svc, image: siteConfig.stageImageUrl };
    if (svc.id === 'inhouse-catering') return { ...svc, image: siteConfig.cateringImageUrl };
    if (svc.id === 'lighting-sound') return { ...svc, image: siteConfig.avImageUrl };
    return svc;
  });

  const activeReviews = testimonials.length > 0 ? testimonials : [];

  const nextTestimonial = () => {
    if (activeReviews.length === 0) return;
    setTestimonialIndex((prev) => (prev + 1) % activeReviews.length);
  };
  const prevTestimonial = () => {
    if (activeReviews.length === 0) return;
    setTestimonialIndex((prev) => (prev - 1 + activeReviews.length) % activeReviews.length);
  };

  const visibleTestimonials =
    activeReviews.length >= 3
      ? [
          activeReviews[testimonialIndex % activeReviews.length],
          activeReviews[(testimonialIndex + 1) % activeReviews.length],
          activeReviews[(testimonialIndex + 2) % activeReviews.length],
        ]
      : activeReviews;

  const heroHeadline =
    lang === 'en'
      ? siteConfig.heroHeadlineEn || t.hero.headline
      : siteConfig.heroHeadlineUr || t.hero.headline;

  const heroSubheadline =
    lang === 'en'
      ? siteConfig.heroSubheadlineEn || t.hero.subheadline
      : siteConfig.heroSubheadlineUr || t.hero.subheadline;

  return (
    <div className="flex flex-col">
      {/* 1. HERO SECTION */}
      <section className="relative bg-[#0B3B2E] text-[#FAF7F2] overflow-hidden">
        <div className="absolute inset-0">
          <VenueImage
            src={siteConfig.heroImageUrl}
            alt="Nakreezay Shadi Hall Grand Banquet Interior in Mingora Swat"
            className="w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#06241B] via-[#0B3B2E]/80 to-[#06241B]/65" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pt-24 lg:pb-24">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="max-w-4xl mx-auto text-center"
          >
            <p className="text-xs sm:text-sm font-semibold tracking-wider text-[#F3DF98] mb-4">
              {t.hero.kicker}
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.14] text-balance">
              {heroHeadline}
            </h1>
            <p className="mt-5 text-base sm:text-lg text-[#D6E2DD] max-w-2xl mx-auto leading-relaxed">
              {heroSubheadline}
            </p>
          </motion.div>

          {/* Interactive Quick Availability Widget */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-10 max-w-5xl mx-auto bg-white text-[#1E1E1E] rounded-xl shadow-2xl border border-[#D4AF37]/35 p-5 sm:p-6"
          >
            <div className="flex items-center justify-between gap-4 pb-4 mb-4 border-b border-[#E5E2E1]">
              <div className="flex items-center gap-2 text-[#0B3B2E] font-serif text-lg font-semibold">
                <Calendar className="w-5 h-5 text-[#D4AF37]" />
                <span>{t.hero.widget.title}</span>
              </div>
              <span className="hidden sm:inline text-xs font-medium text-[#525B57]">
                {VENUE_CONTACT.shortLocation[lang]} ·{' '}
                <span dir="ltr" className="tabular-nums">
                  {siteConfig.phoneDisplay}
                </span>
              </span>
            </div>

            <form
              onSubmit={handleAvailabilitySubmit}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end"
            >
              <div className="flex flex-col gap-1.5">
                <label htmlFor="hero-date" className="text-xs font-semibold text-[#525B57]">
                  {t.hero.widget.eventDate}
                </label>
                <input
                  id="hero-date"
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  required
                  className="w-full h-11 px-3 rounded-lg border border-[#D8D3C8] bg-[#FAF7F2] text-sm text-[#1E1E1E] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="hero-type" className="text-xs font-semibold text-[#525B57]">
                  {t.hero.widget.eventType}
                </label>
                <select
                  id="hero-type"
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="w-full h-11 px-3 rounded-lg border border-[#D8D3C8] bg-[#FAF7F2] text-sm text-[#1E1E1E] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                >
                  <option value="Barat">{t.hero.widget.eventTypes[0]}</option>
                  <option value="Walima">{t.hero.widget.eventTypes[1]}</option>
                  <option value="Mehndi">{t.hero.widget.eventTypes[2]}</option>
                  <option value="Corporate">{t.hero.widget.eventTypes[3]}</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="hero-guests" className="text-xs font-semibold text-[#525B57]">
                  {t.hero.widget.estimatedGuests}
                </label>
                <input
                  id="hero-guests"
                  type="number"
                  min={100}
                  max={1500}
                  step={50}
                  value={guestCount}
                  onChange={(e) => setGuestCount(e.target.value)}
                  placeholder="500"
                  required
                  className="w-full h-11 px-3 rounded-lg border border-[#D8D3C8] bg-[#FAF7F2] text-sm text-[#1E1E1E] tabular-nums focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="hero-shift" className="text-xs font-semibold text-[#525B57]">
                  {t.hero.widget.timeSlot}
                </label>
                <select
                  id="hero-shift"
                  value={eventShift}
                  onChange={(e) => setEventShift(e.target.value)}
                  className="w-full h-11 px-3 rounded-lg border border-[#D8D3C8] bg-[#FAF7F2] text-sm text-[#1E1E1E] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                >
                  <option value="Night Dinner">{t.hero.widget.shifts[0]}</option>
                  <option value="Day Lunch">{t.hero.widget.shifts[1]}</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full h-11 px-5 rounded-lg bg-[#D4AF37] hover:bg-[#C39B24] text-[#0B3B2E] font-semibold text-sm transition-colors cursor-pointer whitespace-nowrap shadow-sm"
              >
                {t.hero.widget.checkBtn}
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* 2. VENUE HIGHLIGHTS (4-COLUMN GRID) */}
      <section className="py-16 lg:py-20 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#9B7B16] mb-2">
                {t.home.highlightsKicker}
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0B3B2E] text-balance">
                {t.home.highlightsTitle}
              </h2>
            </div>
            <p className="text-sm sm:text-base text-[#525B57] max-w-md leading-relaxed">
              {t.home.highlightsSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {VENUE_HIGHLIGHTS.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-[#E5E2E1] p-6 flex flex-col justify-between transition-transform duration-200 hover:-translate-y-0.5"
              >
                <div>
                  <div className="w-12 h-12 rounded-lg bg-[#FAF7F2] border border-[#D4AF37]/30 flex items-center justify-center mb-5">
                    {highlightIcon(item.icon)}
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-[#0B3B2E] mb-2.5">
                    {item.title[lang]}
                  </h3>
                  <p className="text-sm text-[#525B57] leading-relaxed">
                    {item.description[lang]}
                  </p>
                </div>
                <p className="mt-5 pt-4 border-t border-[#F2ECE1] text-xs font-medium text-[#7A6114]">
                  {item.meta[lang]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. SERVICES OVERVIEW (3-CARD PREVIEW) */}
      <section className="py-16 lg:py-20 bg-[#F2ECE1]/65 border-y border-[#E5E2E1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#9B7B16] mb-2">
                {t.home.servicesKicker}
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0B3B2E]">
                {t.home.servicesTitle}
              </h2>
            </div>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0B3B2E] hover:bg-[#06241B] text-[#FAF7F2] text-sm font-semibold whitespace-nowrap shrink-0 transition-colors w-fit"
            >
              <span>{t.home.servicesBtn}</span>
              <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {previewServices.map((service) => (
              <Link
                key={service.id}
                to="/services"
                className="group bg-white rounded-xl border border-[#E5E2E1] overflow-hidden flex flex-col transition-shadow duration-200 hover:shadow-lg"
              >
                <div className="h-56 w-full overflow-hidden bg-[#0B3B2E]">
                  <VenueImage
                    src={service.image}
                    alt={service.title[lang]}
                    fallbackTitle={service.title[lang]}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 flex flex-col flex-1 justify-between">
                  <div>
                    <p className="text-xs font-medium text-[#7A6114] mb-1.5">
                      {service.number} · {service.category[lang]}
                    </p>
                    <h3 className="font-serif text-xl font-semibold text-[#0B3B2E] mb-2 group-hover:text-[#9B7B16] transition-colors">
                      {service.title[lang]}
                    </h3>
                    <p className="text-sm text-[#525B57] leading-relaxed">
                      {service.summary[lang]}
                    </p>
                  </div>
                  <div className="mt-5 pt-4 border-t border-[#F2ECE1] flex items-center justify-between text-xs font-semibold text-[#0B3B2E]">
                    <span>{t.common.learnMore}</span>
                    <ArrowRight className={`w-4 h-4 text-[#D4AF37] ${isRtl ? 'rotate-180' : ''}`} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FEATURED WEDDING PACKAGES (3-TIER CARDS) */}
      <section className="py-16 lg:py-20 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#9B7B16] mb-2">
              {t.home.packagesKicker}
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0B3B2E]">
              {t.home.packagesTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            {packages.map((pkg) => {
              const isGold = pkg.highlighted;
              return (
                <div
                  key={pkg.id}
                  className={`rounded-xl p-7 flex flex-col justify-between transition-transform duration-200 ${
                    isGold
                      ? 'bg-[#0B3B2E] text-[#FAF7F2] border-2 border-[#D4AF37] shadow-xl'
                      : 'bg-white text-[#1E1E1E] border border-[#E5E2E1]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span
                        className={`text-xs font-semibold ${
                          isGold ? 'text-[#F3DF98]' : 'text-[#7A6114]'
                        }`}
                      >
                        {pkg.tierLabel[lang]}
                        {pkg.badge ? ` · ${pkg.badge[lang]}` : ''}
                      </span>
                    </div>

                    <h3
                      className={`font-serif text-2xl font-bold mb-2 ${
                        isGold ? 'text-white' : 'text-[#0B3B2E]'
                      }`}
                    >
                      {pkg.name[lang]}
                    </h3>

                    <p
                      className={`text-sm leading-relaxed mb-5 ${
                        isGold ? 'text-[#D6E2DD]' : 'text-[#525B57]'
                      }`}
                    >
                      {pkg.description[lang]}
                    </p>

                    <div className="pb-5 mb-5 border-b border-current/15">
                      <div className="flex items-baseline gap-1.5">
                        <span
                          className={`font-serif text-3xl font-bold tabular-nums ${
                            isGold ? 'text-[#F3DF98]' : 'text-[#0B3B2E]'
                          }`}
                        >
                          PKR {pkg.pricePerHead.toLocaleString()}
                        </span>
                        <span className={`text-xs ${isGold ? 'text-[#D6E2DD]' : 'text-[#525B57]'}`}>
                          {t.common.perHead}
                        </span>
                      </div>
                      <p className={`text-xs mt-1 ${isGold ? 'text-[#B9CEC6]' : 'text-[#525B57]'}`}>
                        {pkg.hallFeeNote[lang]}
                      </p>
                    </div>

                    <ul className="space-y-3 mb-7">
                      {pkg.features.slice(0, 4).map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-sm">
                          <Check
                            className={`w-4 h-4 shrink-0 mt-0.5 ${
                              isGold ? 'text-[#D4AF37]' : 'text-[#0B3B2E]'
                            }`}
                          />
                          <span className={isGold ? 'text-[#FAF7F2]' : 'text-[#1E1E1E]'}>
                            {feat[lang]}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    to="/contact"
                    state={{
                      notes: `Interested in ${pkg.name.en} (PKR ${pkg.pricePerHead.toLocaleString()} / guest)`,
                    }}
                    className={`w-full py-3 px-4 rounded-lg text-center text-sm font-semibold transition-colors ${
                      isGold
                        ? 'bg-[#D4AF37] hover:bg-[#C39B24] text-[#0B3B2E]'
                        : 'bg-[#FAF7F2] hover:bg-[#0B3B2E] text-[#0B3B2E] hover:text-white border border-[#0B3B2E]/20'
                    }`}
                  >
                    {t.packagesPage.selectPackage}
                  </Link>
                </div>
              );
            })}
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/packages"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#0B3B2E] hover:bg-[#06241B] text-[#FAF7F2] text-sm font-semibold transition-colors"
            >
              <Utensils className="w-4 h-4 text-[#D4AF37]" />
              <span>{t.home.packagesBtn}</span>
              <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIALS SLIDER */}
      <section className="py-16 lg:py-20 bg-white border-t border-[#E5E2E1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#9B7B16] mb-2">
                {t.home.testimonialsKicker}
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0B3B2E]">
                {t.home.testimonialsTitle}
              </h2>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={prevTestimonial}
                aria-label="Previous testimonial"
                className="w-10 h-10 rounded-lg border border-[#E5E2E1] bg-[#FAF7F2] hover:border-[#D4AF37] text-[#0B3B2E] inline-flex items-center justify-center cursor-pointer transition-colors"
              >
                <ChevronLeft className={`w-5 h-5 ${isRtl ? 'rotate-180' : ''}`} />
              </button>
              <button
                type="button"
                onClick={nextTestimonial}
                aria-label="Next testimonial"
                className="w-10 h-10 rounded-lg border border-[#E5E2E1] bg-[#FAF7F2] hover:border-[#D4AF37] text-[#0B3B2E] inline-flex items-center justify-center cursor-pointer transition-colors"
              >
                <ChevronRight className={`w-5 h-5 ${isRtl ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {visibleTestimonials.map((review, idx) => (
              <article
                key={`${review.id}-${idx}`}
                className={`bg-[#FAF7F2] rounded-xl border border-[#E5E2E1] p-6 flex flex-col justify-between ${
                  idx > 0 ? 'hidden md:flex' : 'flex'
                }`}
              >
                <div>
                  <Quote className="w-6 h-6 text-[#D4AF37] mb-3" />
                  <p className="text-sm text-[#1E1E1E] leading-relaxed">
                    “{review.quote[lang]}”
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#E5E2E1] flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#0B3B2E] text-[#F3DF98] font-serif font-bold text-sm flex items-center justify-center shrink-0">
                    {review.initials}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#0B3B2E]">{review.name}</p>
                    <p className="text-xs text-[#525B57]">{review.locationEvent[lang]}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 6. BOTTOM CTA BANNER */}
      <section className="py-16 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-[#0B3B2E] text-[#FAF7F2] p-8 sm:p-12 border border-[#D4AF37]/40 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white text-balance">
                {t.home.ctaTitle}
              </h2>
              <p className="mt-3 text-base text-[#D6E2DD] leading-relaxed">
                {t.home.ctaSubtitle}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <a
                href={`tel:${siteConfig.phoneRaw}`}
                className="px-6 py-3.5 rounded-lg border border-[#D4AF37]/60 bg-[#06241B] hover:bg-[#145241] text-[#F3DF98] font-semibold text-sm inline-flex items-center justify-center gap-2 whitespace-nowrap transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>{t.common.callNow}</span>
              </a>
              <Link
                to="/contact"
                className="px-6 py-3.5 rounded-lg bg-[#D4AF37] hover:bg-[#C39B24] text-[#0B3B2E] font-semibold text-sm inline-flex items-center justify-center gap-2 whitespace-nowrap transition-colors"
              >
                <Calendar className="w-4 h-4" />
                <span>{t.common.bookOnline}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
