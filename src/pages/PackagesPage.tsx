import { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, MessageCircle, RotateCcw, SlidersHorizontal, Users } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { useLanguage } from '../context/LanguageContext';
import { useVenueData } from '../context/VenueDataContext';
import { MENU_CATEGORIES } from '../data/venueData';

export function PackagesPage() {
  const { lang, t } = useLanguage();
  const { siteConfig, packages, menuDishes, buildWhatsAppUrl } = useVenueData();
  const calculatorRef = useRef<HTMLElement | null>(null);

  const [selectedDishIds, setSelectedDishIds] = useState<string[]>([
    'kabuli-pulao',
    'mutton-karahi',
    'seekh-kabab',
    'fresh-salad',
    'mint-raita',
    'roghni-naan',
    'kheer',
    'green-qahwa',
    'cold-drinks',
  ]);
  const [guestCount, setGuestCount] = useState<number>(500);

  const toggleDish = (dishId: string) => {
    setSelectedDishIds((prev) =>
      prev.includes(dishId) ? prev.filter((id) => id !== dishId) : [...prev, dishId]
    );
  };

  const loadPresetIntoCalculator = (presetIds: string[]) => {
    setSelectedDishIds(presetIds);
    calculatorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const selectedDishes = useMemo(
    () => menuDishes.filter((d) => selectedDishIds.includes(d.id)),
    [menuDishes, selectedDishIds]
  );

  const dishesPerHead = useMemo(
    () => selectedDishes.reduce((sum, dish) => sum + dish.pricePerHead, 0),
    [selectedDishes]
  );

  const perHeadTotal =
    selectedDishes.length > 0 ? siteConfig.baseVenuePerHead + dishesPerHead : 0;
  const estimatedGrandTotal = perHeadTotal * guestCount;

  const whatsappQuoteUrl = useMemo(() => {
    const dishList = selectedDishes.map((d) => `• ${d.name.en} (PKR ${d.pricePerHead})`).join('\n');
    const message = [
      'Assalam-o-Alaikum Nakreezay Shadi Hall,',
      'I built a custom Per-Head Menu Quote on your website:',
      '',
      `Estimated Guests: ${guestCount}`,
      `Estimated Per-Head Rate: PKR ${perHeadTotal.toLocaleString()}`,
      `Estimated Total Cost: PKR ${estimatedGrandTotal.toLocaleString()}`,
      '',
      'Selected Menu Items:',
      dishList || 'Hall & Venue Setup Only',
      '',
      'Please share available dates and formal booking details.',
    ].join('\n');

    return buildWhatsAppUrl(message);
  }, [selectedDishes, guestCount, perHeadTotal, estimatedGrandTotal, buildWhatsAppUrl]);

  return (
    <div className="flex flex-col">
      <PageHeader
        title={t.packagesPage.title}
        subtitle={t.packagesPage.subtitle}
        breadcrumbLabel={t.nav.packages}
      />

      {/* 3 Complete Package Cards */}
      <section className="py-16 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            {packages.map((pkg) => {
              const isGold = pkg.highlighted;
              return (
                <div
                  key={pkg.id}
                  className={`rounded-xl p-7 flex flex-col justify-between ${
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

                    <h2
                      className={`font-serif text-2xl font-bold mb-2 ${
                        isGold ? 'text-white' : 'text-[#0B3B2E]'
                      }`}
                    >
                      {pkg.name[lang]}
                    </h2>
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
                      {pkg.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-sm">
                          <Check
                            className={`w-4 h-4 shrink-0 mt-0.5 ${
                              isGold ? 'text-[#D4AF37]' : 'text-[#0B3B2E]'
                            }`}
                          />
                          <span>{feat[lang]}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-col gap-2.5">
                    <Link
                      to="/contact"
                      state={{
                        notes: `Package selected: ${pkg.name.en} (PKR ${pkg.pricePerHead.toLocaleString()} / guest)`,
                      }}
                      className={`w-full py-3 px-4 rounded-lg text-center text-sm font-semibold transition-colors ${
                        isGold
                          ? 'bg-[#D4AF37] hover:bg-[#C39B24] text-[#0B3B2E]'
                          : 'bg-[#0B3B2E] hover:bg-[#06241B] text-[#FAF7F2]'
                      }`}
                    >
                      {t.packagesPage.selectPackage}
                    </Link>
                    <button
                      type="button"
                      onClick={() => loadPresetIntoCalculator(pkg.presetDishIds)}
                      className={`w-full py-2.5 px-4 rounded-lg text-center text-xs font-semibold cursor-pointer transition-colors border ${
                        isGold
                          ? 'border-white/25 text-[#F3DF98] hover:bg-white/10'
                          : 'border-[#E5E2E1] text-[#0B3B2E] hover:bg-[#FAF7F2]'
                      }`}
                    >
                      {t.packagesPage.loadInCalculator}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Interactive Per-Head Menu Builder */}
      <section
        ref={calculatorRef}
        id="menu-calculator"
        className="py-16 lg:py-20 bg-white border-t border-[#E5E2E1]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#9B7B16] mb-2">
                {t.packagesPage.calculator.kicker}
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0B3B2E]">
                {t.packagesPage.calculator.title}
              </h2>
              <p className="mt-2 text-sm sm:text-base text-[#525B57] leading-relaxed">
                {t.packagesPage.calculator.subtitle}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSelectedDishIds([])}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#E5E2E1] hover:border-[#0B3B2E] text-xs font-semibold text-[#0B3B2E] cursor-pointer transition-colors w-fit shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t.packagesPage.calculator.resetBtn}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Dish Category Selector (8 Cols) */}
            <div className="lg:col-span-8 space-y-6">
              {MENU_CATEGORIES.map((category) => {
                const dishes = menuDishes.filter((d) => d.category === category.id);
                if (dishes.length === 0) return null;
                return (
                  <div
                    key={category.id}
                    className="rounded-xl border border-[#E5E2E1] bg-[#FAF7F2] p-5 sm:p-6"
                  >
                    <h3 className="font-serif text-lg font-semibold text-[#0B3B2E] mb-4 pb-2 border-b border-[#E5E2E1]">
                      {category.label[lang]}
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {dishes.map((dish) => {
                        const isSelected = selectedDishIds.includes(dish.id);
                        return (
                          <button
                            key={dish.id}
                            type="button"
                            onClick={() => toggleDish(dish.id)}
                            aria-pressed={isSelected}
                            className={`text-start p-4 rounded-lg border transition-colors cursor-pointer flex items-start justify-between gap-3 ${
                              isSelected
                                ? 'bg-[#0B3B2E] text-[#FAF7F2] border-[#0B3B2E]'
                                : 'bg-white text-[#1E1E1E] border-[#E5E2E1] hover:border-[#D4AF37]'
                            }`}
                          >
                            <div className="flex flex-col gap-1">
                              <span className="text-sm font-semibold">{dish.name[lang]}</span>
                              <span
                                className={`text-xs ${
                                  isSelected ? 'text-[#D6E2DD]' : 'text-[#525B57]'
                                }`}
                              >
                                {dish.note[lang]}
                              </span>
                            </div>
                            <div className="flex flex-col items-end shrink-0 gap-1.5">
                              <span
                                className={`text-xs font-semibold tabular-nums whitespace-nowrap ${
                                  isSelected ? 'text-[#F3DF98]' : 'text-[#0B3B2E]'
                                }`}
                              >
                                +PKR {dish.pricePerHead}
                              </span>
                              <span
                                className={`w-5 h-5 rounded flex items-center justify-center border ${
                                  isSelected
                                    ? 'bg-[#D4AF37] border-[#D4AF37] text-[#0B3B2E]'
                                    : 'border-[#C8C3B8] bg-[#FAF7F2]'
                                }`}
                              >
                                {isSelected && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Live Estimator Summary Panel (4 Cols) */}
            <aside className="lg:col-span-4 lg:sticky lg:top-24 rounded-xl bg-[#0B3B2E] text-[#FAF7F2] p-6 border border-[#D4AF37]/40 shadow-xl">
              <div className="flex items-center gap-2 text-[#F3DF98] mb-5 pb-4 border-b border-white/15">
                <SlidersHorizontal className="w-5 h-5" />
                <h3 className="font-serif text-xl font-bold">
                  {t.packagesPage.calculator.title}
                </h3>
              </div>

              {/* Guest Count Slider + Input */}
              <div className="mb-6">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <label
                    htmlFor="calc-guests"
                    className="text-sm font-medium text-[#D6E2DD] flex items-center gap-1.5"
                  >
                    <Users className="w-4 h-4 text-[#D4AF37]" />
                    <span>{t.packagesPage.calculator.guestCountLabel}</span>
                  </label>
                  <input
                    id="calc-guests"
                    type="number"
                    min={100}
                    max={1200}
                    step={25}
                    value={guestCount}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (!Number.isNaN(val)) {
                        setGuestCount(Math.min(1200, Math.max(100, val)));
                      }
                    }}
                    className="w-24 px-2.5 py-1 rounded bg-[#06241B] border border-[#D4AF37]/50 text-right text-sm font-bold text-[#F3DF98] tabular-nums focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                  />
                </div>
                <input
                  type="range"
                  min={100}
                  max={1200}
                  step={25}
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  aria-label={t.packagesPage.calculator.guestCountLabel}
                  className="w-full accent-[#D4AF37] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-[#B9CEC6] tabular-nums mt-1">
                  <span>100</span>
                  <span>650</span>
                  <span>1,200</span>
                </div>
              </div>

              {/* Breakdown */}
              <div className="space-y-3 py-4 border-y border-white/15 text-sm">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[#D6E2DD]">
                    {t.packagesPage.calculator.hallServiceBase}
                  </span>
                  <span className="font-semibold tabular-nums whitespace-nowrap">
                    PKR {siteConfig.baseVenuePerHead}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[#D6E2DD]">
                    {t.packagesPage.calculator.selectedDishesLabel} ({selectedDishes.length})
                  </span>
                  <span className="font-semibold tabular-nums whitespace-nowrap">
                    PKR {dishesPerHead.toLocaleString()}
                  </span>
                </div>
              </div>

              {selectedDishes.length === 0 ? (
                <p className="mt-4 text-xs text-[#F3DF98] bg-[#06241B] p-3 rounded-lg border border-[#D4AF37]/30">
                  {t.packagesPage.calculator.noDishesWarning}
                </p>
              ) : (
                <div className="mt-4 max-h-40 overflow-y-auto space-y-1.5 pe-1 text-xs text-[#D6E2DD]">
                  {selectedDishes.map((dish) => (
                    <div key={dish.id} className="flex justify-between gap-2">
                      <span>{dish.name[lang]}</span>
                      <span className="tabular-nums text-[#F3DF98]">PKR {dish.pricePerHead}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Totals */}
              <div className="mt-5 pt-4 border-t border-white/15 space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-[#D6E2DD]">
                    {t.packagesPage.calculator.perHeadRateLabel}
                  </span>
                  <span className="font-serif text-2xl font-bold text-[#F3DF98] tabular-nums">
                    PKR {perHeadTotal.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-[#D6E2DD]">
                    {t.packagesPage.calculator.totalEstimateLabel}
                  </span>
                  <span className="font-serif text-3xl font-bold text-white tabular-nums">
                    PKR {estimatedGrandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              <a
                href={whatsappQuoteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 w-full py-3.5 px-4 rounded-lg bg-[#D4AF37] hover:bg-[#C39B24] text-[#0B3B2E] font-semibold text-sm inline-flex items-center justify-center gap-2 transition-colors shadow-md"
              >
                <MessageCircle className="w-4 h-4 shrink-0" />
                <span>{t.packagesPage.calculator.sendWhatsAppBtn}</span>
              </a>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
