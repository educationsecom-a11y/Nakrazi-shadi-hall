import { FormEvent, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  CheckCircle2,
  ChevronDown,
  Clock,
  MapPin,
  MessageCircle,
  Phone,
  X,
} from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { useLanguage } from '../context/LanguageContext';
import { useVenueData } from '../context/VenueDataContext';
import { VENUE_CONTACT } from '../data/venueData';

interface PrefillState {
  eventDate?: string;
  eventType?: string;
  estimatedGuests?: string;
  eventShift?: string;
  notes?: string;
}

interface BookingFormState {
  fullName: string;
  phone: string;
  eventDate: string;
  eventShift: 'Day Lunch' | 'Night Dinner';
  eventType: string;
  gentsCount: string;
  ladiesCount: string;
  catering: 'Yes - Per Head' | 'No - Hall Only';
  notes: string;
}

export function ContactPage() {
  const { lang, t } = useLanguage();
  const {
    siteConfig,
    faqs,
    whatsappDefaultUrl,
    buildWhatsAppUrl,
    submitBookingInquiry,
  } = useVenueData();
  const location = useLocation();
  const prefill = (location.state as PrefillState | null) || {};

  const initialTotal = Number(prefill.estimatedGuests) || 500;
  const initialSplit = Math.round(initialTotal / 2);

  const [form, setForm] = useState<BookingFormState>({
    fullName: '',
    phone: '',
    eventDate: prefill.eventDate || '2026-12-12',
    eventShift:
      prefill.eventShift === 'Day Lunch' ? 'Day Lunch' : 'Night Dinner',
    eventType: prefill.eventType || 'Barat',
    gentsCount: String(initialSplit),
    ladiesCount: String(initialSplit),
    catering: 'Yes - Per Head',
    notes: prefill.notes || '',
  });

  useEffect(() => {
    if (prefill.eventDate || prefill.eventType || prefill.estimatedGuests || prefill.notes) {
      const total = Number(prefill.estimatedGuests) || 500;
      const half = Math.round(total / 2);
      setForm((prev) => ({
        ...prev,
        eventDate: prefill.eventDate || prev.eventDate,
        eventType: prefill.eventType || prev.eventType,
        eventShift:
          prefill.eventShift === 'Day Lunch' ? 'Day Lunch' : prev.eventShift,
        gentsCount: prefill.estimatedGuests ? String(half) : prev.gentsCount,
        ladiesCount: prefill.estimatedGuests ? String(half) : prev.ladiesCount,
        notes: prefill.notes || prev.notes,
      }));
    }
  }, [
    prefill.eventDate,
    prefill.eventType,
    prefill.estimatedGuests,
    prefill.eventShift,
    prefill.notes,
  ]);

  const [errors, setErrors] = useState<Partial<Record<keyof BookingFormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [openFaqId, setOpenFaqId] = useState<string>(faqs[0]?.id || '');

  const validate = () => {
    const nextErrors: Partial<Record<keyof BookingFormState, string>> = {};
    if (!form.fullName.trim() || form.fullName.trim().length < 2) {
      nextErrors.fullName =
        lang === 'en' ? 'Please enter your full name.' : 'براہ کرم اپنا مکمل نام درج کریں۔';
    }
    const digitsOnly = form.phone.replace(/\D/g, '');
    if (digitsOnly.length < 10) {
      nextErrors.phone =
        lang === 'en'
          ? 'Please enter a valid 10+ digit phone or WhatsApp number.'
          : 'براہ کرم درست فون یا واٹس ایپ نمبر درج کریں۔';
    }
    if (!form.eventDate) {
      nextErrors.eventDate =
        lang === 'en' ? 'Please choose an event date.' : 'براہ کرم تقریب کی تاریخ منتخب کریں۔';
    }
    if (!form.gentsCount || Number(form.gentsCount) < 0) {
      nextErrors.gentsCount =
        lang === 'en' ? 'Enter valid gents guest count.' : 'مرد مہمانوں کی درست تعداد لکھیں۔';
    }
    if (!form.ladiesCount || Number(form.ladiesCount) < 0) {
      nextErrors.ladiesCount =
        lang === 'en' ? 'Enter valid ladies guest count.' : 'خواتین مہمانوں کی درست تعداد لکھیں۔';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await submitBookingInquiry({
        fullName: form.fullName,
        phone: form.phone,
        eventDate: form.eventDate,
        eventShift: form.eventShift,
        eventType: form.eventType,
        gentsCount: Number(form.gentsCount) || 0,
        ladiesCount: Number(form.ladiesCount) || 0,
        catering: form.catering,
        notes: form.notes,
      });
      setShowConfirmation(true);
    } catch {
      // Even if network is momentarily offline, still show WhatsApp confirmation modal
      setShowConfirmation(true);
    } finally {
      setSubmitting(false);
    }
  };

  const totalGuests =
    (Number(form.gentsCount) || 0) + (Number(form.ladiesCount) || 0);

  const buildWhatsAppBookingUrl = () => {
    const message = [
      'Assalam-o-Alaikum Nakreezay Shadi Hall Management,',
      'I would like to submit a Booking Inquiry:',
      '',
      `Name: ${form.fullName}`,
      `Phone/WhatsApp: ${form.phone}`,
      `Event Date: ${form.eventDate}`,
      `Event Shift: ${form.eventShift}`,
      `Event Type: ${form.eventType}`,
      `Gents Guests: ${form.gentsCount}`,
      `Ladies Guests: ${form.ladiesCount}`,
      `Total Estimated Guests: ${totalGuests}`,
      `Catering Needed: ${form.catering}`,
      form.notes ? `Additional Notes: ${form.notes}` : '',
      '',
      'Kindly confirm hall availability and package details.',
    ]
      .filter(Boolean)
      .join('\n');

    return buildWhatsAppUrl(message);
  };

  return (
    <div className="flex flex-col">
      <PageHeader
        title={t.contactPage.title}
        subtitle={t.contactPage.subtitle}
        breadcrumbLabel={t.nav.contact}
      />

      {/* Contact & Booking Split */}
      <section className="py-16 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Address, Hours, Direct Phone/WhatsApp, Google Maps */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-xl border border-[#E5E2E1] p-6 space-y-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#FAF7F2] border border-[#D4AF37]/35 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-[#0B3B2E]" />
                  </div>
                  <div>
                    <h2 className="font-serif text-lg font-bold text-[#0B3B2E]">
                      {t.contactPage.addressTitle}
                    </h2>
                    <p className="text-sm text-[#525B57] mt-1 leading-relaxed">
                      {lang === 'en' ? siteConfig.addressEn : siteConfig.addressUr}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#F2ECE1] flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#FAF7F2] border border-[#D4AF37]/35 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-[#0B3B2E]" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#0B3B2E]">
                      {t.contactPage.hoursTitle}
                    </h3>
                    <p className="text-sm font-semibold text-[#1E1E1E] mt-1">
                      {lang === 'en' ? siteConfig.visitingHoursEn : siteConfig.visitingHoursUr}
                    </p>
                    <p className="text-xs text-[#525B57] mt-0.5">
                      {lang === 'en' ? siteConfig.fridayNoteEn : siteConfig.fridayNoteUr}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#F2ECE1] flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#FAF7F2] border border-[#D4AF37]/35 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-[#0B3B2E]" />
                  </div>
                  <div className="w-full">
                    <h3 className="font-serif text-lg font-bold text-[#0B3B2E]">
                      {t.contactPage.phoneTitle}
                    </h3>
                    <a
                      href={`tel:${siteConfig.phoneRaw}`}
                      dir="ltr"
                      className="inline-block mt-1 text-base font-bold text-[#0B3B2E] hover:text-[#9B7B16] tabular-nums"
                    >
                      {siteConfig.phoneDisplay}
                    </a>
                    <div className="mt-3">
                      <a
                        href={whatsappDefaultUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 px-4 rounded-lg bg-[#0B3B2E] hover:bg-[#06241B] text-[#FAF7F2] text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors"
                      >
                        <MessageCircle className="w-4 h-4 text-[#D4AF37]" />
                        <span>{t.common.whatsappUs}</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Responsive Google Maps Embed */}
              <div className="bg-white rounded-xl border border-[#E5E2E1] overflow-hidden">
                <div className="px-5 py-3.5 border-b border-[#E5E2E1] flex items-center justify-between">
                  <h3 className="font-serif text-base font-bold text-[#0B3B2E]">
                    {t.contactPage.mapTitle}
                  </h3>
                  <span className="text-xs text-[#7A6114] font-medium">
                    {VENUE_CONTACT.shortLocation[lang]}
                  </span>
                </div>
                <div className="w-full h-72 bg-[#E5E2E1]">
                  <iframe
                    title="Nakreezay Shadi Hall Location on Qamber Bypass Road Mingora Swat"
                    src={VENUE_CONTACT.googleMapsEmbedUrl}
                    className="w-full h-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Booking Inquiry Form */}
            <div className="lg:col-span-7 bg-white rounded-xl border border-[#E5E2E1] p-6 sm:p-8 shadow-sm">
              <div className="mb-6 pb-5 border-b border-[#E5E2E1]">
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0B3B2E]">
                  {t.contactPage.formTitle}
                </h2>
                <p className="mt-2 text-sm text-[#525B57] leading-relaxed">
                  {t.contactPage.formSubtitle}
                </p>
              </div>

              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="bk-name"
                      className="block text-xs font-semibold text-[#1E1E1E] mb-1.5"
                    >
                      {t.contactPage.fields.fullName} *
                    </label>
                    <input
                      id="bk-name"
                      type="text"
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      placeholder={t.contactPage.fields.fullNamePlaceholder}
                      className="w-full h-11 px-3.5 rounded-lg border border-[#D8D3C8] bg-[#FAF7F2] text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    />
                    {errors.fullName && (
                      <p className="mt-1 text-xs text-red-700">{errors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="bk-phone"
                      className="block text-xs font-semibold text-[#1E1E1E] mb-1.5"
                    >
                      {t.contactPage.fields.phone} *
                    </label>
                    <input
                      id="bk-phone"
                      type="tel"
                      dir="ltr"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder={t.contactPage.fields.phonePlaceholder}
                      className="w-full h-11 px-3.5 rounded-lg border border-[#D8D3C8] bg-[#FAF7F2] text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-xs text-red-700">{errors.phone}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label
                      htmlFor="bk-date"
                      className="block text-xs font-semibold text-[#1E1E1E] mb-1.5"
                    >
                      {t.contactPage.fields.eventDate} *
                    </label>
                    <input
                      id="bk-date"
                      type="date"
                      value={form.eventDate}
                      onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
                      className="w-full h-11 px-3 rounded-lg border border-[#D8D3C8] bg-[#FAF7F2] text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    />
                    {errors.eventDate && (
                      <p className="mt-1 text-xs text-red-700">{errors.eventDate}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="bk-shift"
                      className="block text-xs font-semibold text-[#1E1E1E] mb-1.5"
                    >
                      {t.contactPage.fields.eventShift}
                    </label>
                    <select
                      id="bk-shift"
                      value={form.eventShift}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          eventShift: e.target.value as BookingFormState['eventShift'],
                        })
                      }
                      className="w-full h-11 px-3 rounded-lg border border-[#D8D3C8] bg-[#FAF7F2] text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    >
                      <option value="Night Dinner">{t.contactPage.fields.shiftNight}</option>
                      <option value="Day Lunch">{t.contactPage.fields.shiftDay}</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="bk-type"
                      className="block text-xs font-semibold text-[#1E1E1E] mb-1.5"
                    >
                      {t.contactPage.fields.eventType}
                    </label>
                    <select
                      id="bk-type"
                      value={form.eventType}
                      onChange={(e) => setForm({ ...form, eventType: e.target.value })}
                      className="w-full h-11 px-3 rounded-lg border border-[#D8D3C8] bg-[#FAF7F2] text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    >
                      <option value="Barat">{t.contactPage.fields.eventTypes[0]}</option>
                      <option value="Walima">{t.contactPage.fields.eventTypes[1]}</option>
                      <option value="Mehndi">{t.contactPage.fields.eventTypes[2]}</option>
                      <option value="Engagement">{t.contactPage.fields.eventTypes[3]}</option>
                      <option value="Corporate">{t.contactPage.fields.eventTypes[4]}</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label
                      htmlFor="bk-gents"
                      className="block text-xs font-semibold text-[#1E1E1E] mb-1.5"
                    >
                      {t.contactPage.fields.gentsCount}
                    </label>
                    <input
                      id="bk-gents"
                      type="number"
                      min={0}
                      max={1500}
                      value={form.gentsCount}
                      onChange={(e) => setForm({ ...form, gentsCount: e.target.value })}
                      className="w-full h-11 px-3.5 rounded-lg border border-[#D8D3C8] bg-[#FAF7F2] text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    />
                    {errors.gentsCount && (
                      <p className="mt-1 text-xs text-red-700">{errors.gentsCount}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="bk-ladies"
                      className="block text-xs font-semibold text-[#1E1E1E] mb-1.5"
                    >
                      {t.contactPage.fields.ladiesCount}
                    </label>
                    <input
                      id="bk-ladies"
                      type="number"
                      min={0}
                      max={1000}
                      value={form.ladiesCount}
                      onChange={(e) => setForm({ ...form, ladiesCount: e.target.value })}
                      className="w-full h-11 px-3.5 rounded-lg border border-[#D8D3C8] bg-[#FAF7F2] text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    />
                    {errors.ladiesCount && (
                      <p className="mt-1 text-xs text-red-700">{errors.ladiesCount}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="bk-catering"
                      className="block text-xs font-semibold text-[#1E1E1E] mb-1.5"
                    >
                      {t.contactPage.fields.catering}
                    </label>
                    <select
                      id="bk-catering"
                      value={form.catering}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          catering: e.target.value as BookingFormState['catering'],
                        })
                      }
                      className="w-full h-11 px-3 rounded-lg border border-[#D8D3C8] bg-[#FAF7F2] text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    >
                      <option value="Yes - Per Head">{t.contactPage.fields.cateringYes}</option>
                      <option value="No - Hall Only">{t.contactPage.fields.cateringNo}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="bk-notes"
                    className="block text-xs font-semibold text-[#1E1E1E] mb-1.5"
                  >
                    {t.contactPage.fields.notes}
                  </label>
                  <textarea
                    id="bk-notes"
                    rows={4}
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    placeholder={t.contactPage.fields.notesPlaceholder}
                    className="w-full p-3.5 rounded-lg border border-[#D8D3C8] bg-[#FAF7F2] text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 px-6 rounded-lg bg-[#D4AF37] hover:bg-[#C39B24] disabled:opacity-60 text-[#0B3B2E] font-semibold text-sm transition-colors cursor-pointer shadow-sm"
                >
                  {submitting
                    ? lang === 'en'
                      ? 'Submitting Inquiry...'
                      : 'درخواست جمع ہو رہی ہے...'
                    : t.contactPage.fields.submitBtn}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-16 bg-white border-t border-[#E5E2E1]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl font-bold text-[#0B3B2E] text-center mb-10">
            {t.contactPage.faqTitle}
          </h2>

          <div className="space-y-3">
            {faqs.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="rounded-xl border border-[#E5E2E1] bg-[#FAF7F2] overflow-hidden"
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenFaqId(isOpen ? '' : faq.id)}
                    className="w-full px-5 py-4 text-start flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span className="font-serif text-base sm:text-lg font-semibold text-[#0B3B2E]">
                      {faq.question[lang]}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-[#D4AF37] shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-sm text-[#525B57] leading-relaxed border-t border-[#E5E2E1]/70">
                      {faq.answer[lang]}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Booking Confirmation Summary Modal */}
      {showConfirmation && (
        <div
          className="fixed inset-0 z-50 bg-[#06241B]/75 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={t.contactPage.modal.title}
        >
          <div className="bg-white rounded-2xl max-w-lg w-full border border-[#D4AF37]/40 shadow-2xl p-6 sm:p-7">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#E5E2E1]">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-6 h-6 text-[#15803D] shrink-0" />
                <h3 className="font-serif text-2xl font-bold text-[#0B3B2E]">
                  {t.contactPage.modal.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowConfirmation(false)}
                aria-label="Close modal"
                className="w-9 h-9 rounded-lg hover:bg-[#FAF7F2] text-[#525B57] flex items-center justify-center cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="mt-3 text-sm text-[#525B57] leading-relaxed">
              {t.contactPage.modal.subtitle}
            </p>

            <div className="mt-5 rounded-xl bg-[#FAF7F2] border border-[#E5E2E1] p-4 space-y-2 text-sm">
              <div className="flex justify-between gap-2">
                <span className="text-[#525B57]">{t.contactPage.fields.fullName}:</span>
                <span className="font-semibold text-[#0B3B2E]">{form.fullName}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-[#525B57]">{t.contactPage.fields.phone}:</span>
                <span className="font-semibold text-[#0B3B2E] tabular-nums" dir="ltr">
                  {form.phone}
                </span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-[#525B57]">{t.contactPage.fields.eventDate}:</span>
                <span className="font-semibold text-[#0B3B2E] tabular-nums">{form.eventDate}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-[#525B57]">{t.contactPage.fields.eventType}:</span>
                <span className="font-semibold text-[#0B3B2E]">
                  {form.eventType} ({form.eventShift})
                </span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-[#525B57]">{t.common.guests}:</span>
                <span className="font-semibold text-[#0B3B2E] tabular-nums">
                  {form.gentsCount} Gents · {form.ladiesCount} Ladies ({totalGuests} Total)
                </span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-[#525B57]">{t.contactPage.fields.catering}:</span>
                <span className="font-semibold text-[#0B3B2E]">{form.catering}</span>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <a
                href={buildWhatsAppBookingUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-4 rounded-lg bg-[#15803D] hover:bg-[#166534] text-white font-semibold text-sm inline-flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{t.contactPage.modal.whatsappBtn}</span>
              </a>
              <button
                type="button"
                onClick={() => setShowConfirmation(false)}
                className="py-3 px-4 rounded-lg border border-[#E5E2E1] hover:bg-[#FAF7F2] text-[#0B3B2E] font-semibold text-sm cursor-pointer"
              >
                {t.contactPage.modal.closeBtn}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
