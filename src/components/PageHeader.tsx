import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  breadcrumbLabel: string;
}

export function PageHeader({ title, subtitle, breadcrumbLabel }: PageHeaderProps) {
  const { t, isRtl } = useLanguage();

  return (
    <section className="relative bg-[#0B3B2E] text-[#FAF7F2] py-14 sm:py-20 border-b border-[#D4AF37]/30 overflow-hidden">
      <div
        className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_top_right,_rgba(212,175,55,0.28),_transparent_55%)]"
        aria-hidden="true"
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm text-[#D6E2DD] mb-4">
          <Link to="/" className="hover:text-[#D4AF37] transition-colors">
            {t.common.fromHome}
          </Link>
          <ChevronRight className={`w-3.5 h-3.5 text-[#D4AF37] ${isRtl ? 'rotate-180' : ''}`} />
          <span className="text-[#F3DF98] font-medium">{breadcrumbLabel}</span>
        </nav>

        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight text-balance max-w-3xl">
          {title}
        </h1>
        <p className="mt-4 text-base sm:text-lg text-[#D6E2DD] max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      </div>
    </section>
  );
}
