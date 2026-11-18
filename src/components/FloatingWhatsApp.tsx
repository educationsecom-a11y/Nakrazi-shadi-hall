import { MessageCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useVenueData } from '../context/VenueDataContext';

export function FloatingWhatsApp() {
  const { t } = useLanguage();
  const { whatsappDefaultUrl } = useVenueData();

  return (
    <a
      href={whatsappDefaultUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t.common.whatsappUs}
      className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2.5 rounded-full bg-[#15803D] hover:bg-[#166534] text-white px-4 py-3 shadow-lg border border-white/20 transition-transform duration-150 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
    >
      <MessageCircle className="w-5 h-5 shrink-0" />
      <span className="hidden sm:inline text-sm font-semibold whitespace-nowrap">
        {t.common.whatsappUs}
      </span>
    </a>
  );
}
