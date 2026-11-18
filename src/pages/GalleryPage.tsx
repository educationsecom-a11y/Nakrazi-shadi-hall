import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { VenueImage } from '../components/VenueImage';
import { useLanguage } from '../context/LanguageContext';
import { useVenueData } from '../context/VenueDataContext';
import {
  GALLERY_CATEGORIES,
  GalleryCategory,
  GalleryItem,
} from '../data/venueData';

export function GalleryPage() {
  const { lang, t, isRtl } = useLanguage();
  const { galleryItems, hallSpecs } = useVenueData();
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>('All');
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);

  const filteredItems =
    activeCategory === 'All'
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeCategory);

  const currentIndex = lightboxItem
    ? filteredItems.findIndex((i) => i.id === lightboxItem.id)
    : -1;

  const openNext = () => {
    if (currentIndex === -1 || filteredItems.length === 0) return;
    setLightboxItem(filteredItems[(currentIndex + 1) % filteredItems.length]);
  };

  const openPrev = () => {
    if (currentIndex === -1 || filteredItems.length === 0) return;
    setLightboxItem(
      filteredItems[(currentIndex - 1 + filteredItems.length) % filteredItems.length]
    );
  };

  useEffect(() => {
    if (!lightboxItem) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxItem(null);
      if (e.key === 'ArrowRight') openNext();
      if (e.key === 'ArrowLeft') openPrev();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  });

  const aspectHeightClass = (aspect: GalleryItem['aspect']) => {
    switch (aspect) {
      case 'tall':
        return 'h-80 sm:h-96';
      case 'wide':
        return 'h-56 sm:h-64';
      default:
        return 'h-64 sm:h-72';
    }
  };

  return (
    <div className="flex flex-col">
      <PageHeader
        title={t.galleryPage.title}
        subtitle={t.galleryPage.subtitle}
        breadcrumbLabel={t.nav.gallery}
      />

      {/* Hall Specs Comparison Table */}
      <section className="py-16 bg-white border-b border-[#E5E2E1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl font-bold text-[#0B3B2E] mb-8">
            {t.galleryPage.specsTitle}
          </h2>

          <div className="overflow-x-auto rounded-xl border border-[#E5E2E1]">
            <table className="w-full text-start border-collapse min-w-[760px]">
              <thead>
                <tr className="bg-[#0B3B2E] text-[#FAF7F2] text-xs font-semibold uppercase tracking-wider">
                  <th className="py-4 px-5 text-start">{t.galleryPage.tableHeaders.hall}</th>
                  <th className="py-4 px-5 text-start">{t.galleryPage.tableHeaders.area}</th>
                  <th className="py-4 px-5 text-start">{t.galleryPage.tableHeaders.banquet}</th>
                  <th className="py-4 px-5 text-start">{t.galleryPage.tableHeaders.theater}</th>
                  <th className="py-4 px-5 text-start">{t.galleryPage.tableHeaders.bridal}</th>
                  <th className="py-4 px-5 text-start">{t.galleryPage.tableHeaders.climate}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E2E1] text-sm">
                {hallSpecs.map((hall) => (
                  <tr key={hall.id} className="hover:bg-[#FAF7F2] transition-colors">
                    <td className="py-4 px-5">
                      <p className="font-serif font-semibold text-[#0B3B2E] text-base">
                        {hall.name[lang]}
                      </p>
                      <p className="text-xs text-[#525B57] mt-0.5">{hall.notes[lang]}</p>
                    </td>
                    <td className="py-4 px-5 font-medium tabular-nums whitespace-nowrap">
                      {hall.areaSqFt}
                    </td>
                    <td className="py-4 px-5 font-semibold text-[#0B3B2E] tabular-nums whitespace-nowrap">
                      {hall.banquetCapacity}
                    </td>
                    <td className="py-4 px-5 tabular-nums whitespace-nowrap">
                      {hall.theaterCapacity}
                    </td>
                    <td className="py-4 px-5 text-[#1E1E1E]">{hall.bridalRoom[lang]}</td>
                    <td className="py-4 px-5 text-[#525B57]">{hall.climateControl[lang]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Filterable Masonry Photo Gallery */}
      <section className="py-16 lg:py-20 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0B3B2E]">
              {t.galleryPage.galleryTitle}
            </h2>

            <div
              className="flex flex-wrap items-center gap-2"
              role="tablist"
              aria-label="Gallery category filters"
            >
              {GALLERY_CATEGORIES.map((cat) => {
                const active = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                      active
                        ? 'bg-[#0B3B2E] text-[#F3DF98]'
                        : 'bg-white text-[#525B57] border border-[#E5E2E1] hover:border-[#D4AF37] hover:text-[#0B3B2E]'
                    }`}
                  >
                    {cat.label[lang]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Responsive Masonry Columns */}
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {filteredItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setLightboxItem(item)}
                className="group break-inside-avoid w-full text-start bg-white rounded-xl border border-[#E5E2E1] overflow-hidden block cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
              >
                <div className={`relative w-full overflow-hidden bg-[#0B3B2E] ${aspectHeightClass(item.aspect)}`}>
                  <VenueImage
                    src={item.image}
                    alt={item.title[lang]}
                    fallbackTitle={item.title[lang]}
                    className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
                      item.tintClass || ''
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end justify-end p-4">
                    <span className="w-9 h-9 rounded-full bg-white/90 text-[#0B3B2E] flex items-center justify-center shadow">
                      <Maximize2 className="w-4 h-4" />
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-xs font-medium text-[#7A6114] mb-1">{item.category}</p>
                  <h3 className="font-serif text-lg font-semibold text-[#0B3B2E]">
                    {item.title[lang]}
                  </h3>
                  <p className="text-xs text-[#525B57] mt-1 leading-relaxed">
                    {item.caption[lang]}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Full-Screen Lightbox Modal */}
      {lightboxItem && (
        <div
          className="fixed inset-0 z-50 bg-[#06241B]/95 backdrop-blur-sm flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={lightboxItem.title[lang]}
          onClick={() => setLightboxItem(null)}
        >
          <div
            className="relative max-w-5xl w-full bg-[#0B3B2E] rounded-2xl overflow-hidden border border-[#D4AF37]/40 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setLightboxItem(null)}
              aria-label="Close lightbox"
              className="absolute top-4 end-4 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative h-[55vh] sm:h-[68vh] bg-[#06241B]">
              <VenueImage
                src={lightboxItem.image}
                alt={lightboxItem.title[lang]}
                fallbackTitle={lightboxItem.title[lang]}
                className="w-full h-full object-cover"
              />

              {filteredItems.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={openPrev}
                    aria-label="Previous photo"
                    className="absolute start-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/55 hover:bg-black text-white flex items-center justify-center cursor-pointer"
                  >
                    <ChevronLeft className={`w-6 h-6 ${isRtl ? 'rotate-180' : ''}`} />
                  </button>
                  <button
                    type="button"
                    onClick={openNext}
                    aria-label="Next photo"
                    className="absolute end-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/55 hover:bg-black text-white flex items-center justify-center cursor-pointer"
                  >
                    <ChevronRight className={`w-6 h-6 ${isRtl ? 'rotate-180' : ''}`} />
                  </button>
                </>
              )}
            </div>

            <div className="p-5 sm:p-6 bg-[#0B3B2E] text-[#FAF7F2] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <p className="text-xs font-semibold text-[#D4AF37]">{lightboxItem.category}</p>
                <h3 className="font-serif text-xl font-bold text-white mt-0.5">
                  {lightboxItem.title[lang]}
                </h3>
                <p className="text-sm text-[#D6E2DD] mt-1">{lightboxItem.caption[lang]}</p>
              </div>
              <span className="text-xs text-[#B9CEC6] tabular-nums shrink-0">
                {currentIndex + 1} / {filteredItems.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
