import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { VenueImage } from '../components/VenueImage';
import { useLanguage } from '../context/LanguageContext';
import { useVenueData } from '../context/VenueDataContext';

export function ServicesPage() {
  const { lang, t, isRtl } = useLanguage();
  const { services } = useVenueData();

  return (
    <div className="flex flex-col">
      <PageHeader
        title={t.servicesPage.title}
        subtitle={t.servicesPage.subtitle}
        breadcrumbLabel={t.nav.services}
      />

      <section className="py-16 lg:py-20 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {services.map((service, index) => {
            const isEven = index % 2 === 0;
            return (
              <div
                key={service.id}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch bg-white rounded-2xl border border-[#E5E2E1] p-5 sm:p-8"
              >
                <div
                  className={`lg:col-span-5 ${
                    isEven ? 'lg:order-1' : 'lg:order-2'
                  }`}
                >
                  <div className="rounded-xl overflow-hidden bg-[#0B3B2E] h-72 lg:h-full min-h-[300px]">
                    <VenueImage
                      src={service.image}
                      alt={service.title[lang]}
                      fallbackTitle={service.title[lang]}
                      className={`w-full h-full object-cover ${service.imageFocus || ''}`}
                    />
                  </div>
                </div>

                <div
                  className={`lg:col-span-7 flex flex-col justify-center ${
                    isEven ? 'lg:order-2' : 'lg:order-1'
                  }`}
                >
                  <p className="text-xs font-semibold uppercase tracking-widest text-[#9B7B16] mb-2">
                    {service.number} · {service.category[lang]}
                  </p>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0B3B2E] mb-4">
                    {service.title[lang]}
                  </h2>
                  <p className="text-base text-[#525B57] leading-relaxed mb-6">
                    {service.description[lang]}
                  </p>

                  <ul className="space-y-3 mb-7">
                    {service.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-sm text-[#1E1E1E]">
                        <Check className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                        <span>{feat[lang]}</span>
                      </li>
                    ))}
                  </ul>

                  <div>
                    <Link
                      to="/contact"
                      state={{
                        notes: `Inquiry regarding service: ${service.title.en}`,
                      }}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0B3B2E] hover:bg-[#06241B] text-[#FAF7F2] text-sm font-semibold transition-colors"
                    >
                      <span>{t.servicesPage.bookServiceBtn}</span>
                      <ArrowRight className={`w-4 h-4 text-[#D4AF37] ${isRtl ? 'rotate-180' : ''}`} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
