import { Link } from 'react-router-dom';
import { Calendar, CheckCircle2, MapPin, ShieldCheck, Sparkles, Users, Utensils } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { VenueImage } from '../components/VenueImage';
import { useLanguage } from '../context/LanguageContext';
import { useVenueData } from '../context/VenueDataContext';
import { VENUE_CONTACT } from '../data/venueData';

export function AboutPage() {
  const { lang, t } = useLanguage();
  const { siteConfig } = useVenueData();

  const pillarIcons = [
    <ShieldCheck key="p1" className="w-5 h-5 text-[#0B3B2E]" />,
    <Utensils key="p2" className="w-5 h-5 text-[#0B3B2E]" />,
    <Users key="p3" className="w-5 h-5 text-[#0B3B2E]" />,
    <MapPin key="p4" className="w-5 h-5 text-[#0B3B2E]" />,
    <CheckCircle2 key="p5" className="w-5 h-5 text-[#0B3B2E]" />,
    <Sparkles key="p6" className="w-5 h-5 text-[#0B3B2E]" />,
  ];

  return (
    <div className="flex flex-col">
      <PageHeader
        title={t.about.title}
        subtitle={t.about.subtitle}
        breadcrumbLabel={t.nav.about}
      />

      {/* Our Story: 2-Column Split */}
      <section className="py-16 lg:py-20 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
            <div className="lg:col-span-7 flex flex-col justify-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#9B7B16] mb-2">
                {t.about.storyKicker}
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0B3B2E] mb-5 text-balance">
                {t.about.storyTitle}
              </h2>
              <p className="text-base text-[#1E1E1E] leading-relaxed mb-4">
                {t.about.storyP1}
              </p>
              <p className="text-base text-[#525B57] leading-relaxed mb-6">
                {t.about.storyP2}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-[#E5E2E1] text-sm text-[#0B3B2E] font-medium">
                <span>{VENUE_CONTACT.shortLocation[lang]}</span>
                <span aria-hidden="true" className="text-[#D4AF37]">·</span>
                <span>
                  {lang === 'en' ? siteConfig.visitingHoursEn : siteConfig.visitingHoursUr}
                </span>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-xl overflow-hidden border border-[#D4AF37]/30 bg-[#0B3B2E] h-80 lg:h-full min-h-[340px]">
                <VenueImage
                  src={siteConfig.stageImageUrl}
                  alt="Nakreezay Shadi Hall Luxury Stage and Floral Design"
                  fallbackTitle="Nakreezay Royal Banquet Interior"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Stats Strip */}
      <section className="bg-[#0B3B2E] text-[#FAF7F2] border-y border-[#D4AF37]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {t.about.stats.map((stat, idx) => (
              <div key={idx} className="text-center lg:text-start">
                <p className="font-serif text-3xl sm:text-4xl font-bold text-[#F3DF98] tabular-nums">
                  {stat.value}
                </p>
                <p className="mt-1.5 text-sm text-[#D6E2DD] font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6 Value Pillars Grid */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#9B7B16] mb-2">
              {t.about.pillarsKicker}
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0B3B2E]">
              {t.about.pillarsTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {t.about.pillars.map((pillar, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-[#E5E2E1] bg-[#FAF7F2] p-6 flex flex-col gap-3"
              >
                <div className="w-11 h-11 rounded-lg bg-white border border-[#D4AF37]/35 flex items-center justify-center">
                  {pillarIcons[idx]}
                </div>
                <h3 className="font-serif text-xl font-semibold text-[#0B3B2E]">
                  0{idx + 1}. {pillar.title}
                </h3>
                <p className="text-sm text-[#525B57] leading-relaxed">{pillar.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[#D4AF37] hover:bg-[#C39B24] text-[#0B3B2E] font-semibold text-sm transition-colors"
            >
              <Calendar className="w-4 h-4" />
              <span>{t.nav.bookYourDate}</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
