import { FormEvent, useEffect, useState } from 'react';
import { Plus, Save, Trash2 } from 'lucide-react';
import { SiteConfigData, useVenueData } from '../../context/VenueDataContext';
import { HallSpec, ServiceDetail } from '../../data/venueData';
import { ImageFieldInput } from './ImageFieldInput';

export function AdminContentTab({
  section,
}: {
  section: 'services-halls' | 'reviews-faqs' | 'settings';
}) {
  const {
    siteConfig,
    saveSiteConfig,
    services,
    saveService,
    hallSpecs,
    saveHallSpec,
    testimonials,
    saveTestimonial,
    deleteTestimonial,
    faqs,
    saveFaq,
    deleteFaq,
  } = useVenueData();

  const [notice, setNotice] = useState('');

  // Services drafts
  const [serviceDrafts, setServiceDrafts] = useState<Record<string, ServiceDetail>>({});
  const [hallDrafts, setHallDrafts] = useState<Record<string, HallSpec>>({});

  // New Testimonial form
  const [revForm, setRevForm] = useState({
    id: '' as string,
    initials: '',
    name: '',
    locationEn: '',
    quoteEn: '',
    quoteUr: '',
  });

  // New FAQ form
  const [faqForm, setFaqForm] = useState({
    id: '' as string,
    questionEn: '',
    questionUr: '',
    answerEn: '',
    answerUr: '',
  });

  // Venue settings draft
  const [settingsDraft, setSettingsDraft] = useState<SiteConfigData>(siteConfig);
  useEffect(() => {
    setSettingsDraft(siteConfig);
  }, [siteConfig]);

  if (section === 'services-halls') {
    return (
      <div className="space-y-8">
        {notice && (
          <p className="text-xs font-semibold text-emerald-900 bg-emerald-50 border border-emerald-200 px-4 py-3 rounded-xl">
            {notice}
          </p>
        )}

        {/* Hall Specs Editor */}
        <div className="bg-white rounded-xl border border-[#E5E2E1] p-6 space-y-5">
          <h2 className="font-serif text-xl font-bold text-[#0B3B2E]">
            Hall Specifications & Capacities
          </h2>
          <div className="space-y-4">
            {hallSpecs.map((hall, idx) => {
              const draft = hallDrafts[hall.id] || hall;
              return (
                <div
                  key={hall.id}
                  className="rounded-xl border border-[#E5E2E1] bg-[#FAF7F2] p-4 space-y-3"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs font-semibold mb-1">Hall Name (EN)</label>
                      <input
                        type="text"
                        value={draft.name.en}
                        onChange={(e) =>
                          setHallDrafts({
                            ...hallDrafts,
                            [hall.id]: {
                              ...draft,
                              name: { ...draft.name, en: e.target.value },
                            },
                          })
                        }
                        className="w-full h-9 px-2.5 rounded-lg border border-[#D8D3C8] bg-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1">Area (sq ft)</label>
                      <input
                        type="text"
                        value={draft.areaSqFt}
                        onChange={(e) =>
                          setHallDrafts({
                            ...hallDrafts,
                            [hall.id]: { ...draft, areaSqFt: e.target.value },
                          })
                        }
                        className="w-full h-9 px-2.5 rounded-lg border border-[#D8D3C8] bg-white text-xs tabular-nums"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1">Banquet Capacity</label>
                      <input
                        type="text"
                        value={draft.banquetCapacity}
                        onChange={(e) =>
                          setHallDrafts({
                            ...hallDrafts,
                            [hall.id]: { ...draft, banquetCapacity: e.target.value },
                          })
                        }
                        className="w-full h-9 px-2.5 rounded-lg border border-[#D8D3C8] bg-white text-xs tabular-nums"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1">Theater Capacity</label>
                      <input
                        type="text"
                        value={draft.theaterCapacity}
                        onChange={(e) =>
                          setHallDrafts({
                            ...hallDrafts,
                            [hall.id]: { ...draft, theaterCapacity: e.target.value },
                          })
                        }
                        className="w-full h-9 px-2.5 rounded-lg border border-[#D8D3C8] bg-white text-xs tabular-nums"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={async () => {
                        await saveHallSpec(draft, idx);
                        setNotice(`${draft.name.en} specifications updated.`);
                      }}
                      className="px-3.5 py-2 rounded-lg bg-[#0B3B2E] text-[#FAF7F2] text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Save Hall</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Services Editor */}
        <div className="bg-white rounded-xl border border-[#E5E2E1] p-6 space-y-5">
          <h2 className="font-serif text-xl font-bold text-[#0B3B2E]">
            Venue Services & Images
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {services.map((svc, idx) => {
              const draft = serviceDrafts[svc.id] || svc;
              return (
                <div
                  key={svc.id}
                  className="rounded-xl border border-[#E5E2E1] bg-[#FAF7F2] p-5 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#9B7B16]">
                      Service {draft.number}
                    </span>
                    <button
                      type="button"
                      onClick={async () => {
                        await saveService(draft, idx);
                        setNotice(`Service "${draft.title.en}" saved.`);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#0B3B2E] text-[#FAF7F2] text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Save</span>
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1">Title (EN)</label>
                    <input
                      type="text"
                      value={draft.title.en}
                      onChange={(e) =>
                        setServiceDrafts({
                          ...serviceDrafts,
                          [svc.id]: { ...draft, title: { ...draft.title, en: e.target.value } },
                        })
                      }
                      className="w-full h-9 px-2.5 rounded-lg border border-[#D8D3C8] bg-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1">Description (EN)</label>
                    <textarea
                      rows={3}
                      value={draft.description.en}
                      onChange={(e) =>
                        setServiceDrafts({
                          ...serviceDrafts,
                          [svc.id]: {
                            ...draft,
                            description: { ...draft.description, en: e.target.value },
                          },
                        })
                      }
                      className="w-full p-2.5 rounded-lg border border-[#D8D3C8] bg-white text-xs"
                    />
                  </div>

                  <ImageFieldInput
                    label="Service Photo"
                    value={draft.image}
                    onChange={(val) =>
                      setServiceDrafts({
                        ...serviceDrafts,
                        [svc.id]: { ...draft, image: val },
                      })
                    }
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (section === 'reviews-faqs') {
    const handleSaveReview = async (e: FormEvent) => {
      e.preventDefault();
      if (!revForm.name.trim() || !revForm.quoteEn.trim()) return;
      const initials =
        revForm.initials.trim() ||
        revForm.name
          .trim()
          .split(/\s+/)
          .map((w) => w[0])
          .join('')
          .slice(0, 2)
          .toUpperCase();
      await saveTestimonial(
        {
          id: revForm.id || `rev_${Date.now()}`,
          initials,
          name: revForm.name.trim(),
          locationEvent: {
            en: revForm.locationEn.trim() || 'Mingora, Swat',
            ur: revForm.locationEn.trim() || 'مینگورہ، سوات',
          },
          quote: {
            en: revForm.quoteEn.trim(),
            ur: revForm.quoteUr.trim() || revForm.quoteEn.trim(),
          },
        },
        testimonials.length
      );
      setRevForm({ id: '', initials: '', name: '', locationEn: '', quoteEn: '', quoteUr: '' });
      setNotice('Client review saved.');
    };

    const handleSaveFaq = async (e: FormEvent) => {
      e.preventDefault();
      if (!faqForm.questionEn.trim() || !faqForm.answerEn.trim()) return;
      await saveFaq(
        {
          id: faqForm.id || `faq_${Date.now()}`,
          question: {
            en: faqForm.questionEn.trim(),
            ur: faqForm.questionUr.trim() || faqForm.questionEn.trim(),
          },
          answer: {
            en: faqForm.answerEn.trim(),
            ur: faqForm.answerUr.trim() || faqForm.answerEn.trim(),
          },
        },
        faqs.length
      );
      setFaqForm({ id: '', questionEn: '', questionUr: '', answerEn: '', answerUr: '' });
      setNotice('FAQ item saved.');
    };

    return (
      <div className="space-y-8">
        {notice && (
          <p className="text-xs font-semibold text-emerald-900 bg-emerald-50 border border-emerald-200 px-4 py-3 rounded-xl">
            {notice}
          </p>
        )}

        {/* Testimonials Manager */}
        <div className="bg-white rounded-xl border border-[#E5E2E1] p-6 space-y-5">
          <h2 className="font-serif text-xl font-bold text-[#0B3B2E]">
            Client Testimonials ({testimonials.length})
          </h2>

          <form
            onSubmit={handleSaveReview}
            className="rounded-xl bg-[#FAF7F2] border border-[#E5E2E1] p-4 space-y-3"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                value={revForm.name}
                onChange={(e) => setRevForm({ ...revForm, name: e.target.value })}
                placeholder="Client Name (e.g. Haji Akbar)"
                className="h-9 px-3 rounded-lg border border-[#D8D3C8] bg-white text-xs"
              />
              <input
                type="text"
                value={revForm.locationEn}
                onChange={(e) => setRevForm({ ...revForm, locationEn: e.target.value })}
                placeholder="City · Event (e.g. Mingora · Barat)"
                className="h-9 px-3 rounded-lg border border-[#D8D3C8] bg-white text-xs"
              />
              <input
                type="text"
                value={revForm.initials}
                onChange={(e) => setRevForm({ ...revForm, initials: e.target.value })}
                placeholder="Initials (e.g. HA)"
                className="h-9 px-3 rounded-lg border border-[#D8D3C8] bg-white text-xs"
              />
            </div>
            <textarea
              rows={2}
              value={revForm.quoteEn}
              onChange={(e) => setRevForm({ ...revForm, quoteEn: e.target.value })}
              placeholder="Client review quote (English)..."
              className="w-full p-2.5 rounded-lg border border-[#D8D3C8] bg-white text-xs"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#0B3B2E] text-[#FAF7F2] text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{revForm.id ? 'Update Review' : 'Add Review'}</span>
            </button>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {testimonials.map((rev) => (
              <div
                key={rev.id}
                className="rounded-xl border border-[#E5E2E1] bg-[#FAF7F2] p-4 flex flex-col justify-between gap-3"
              >
                <div>
                  <p className="text-sm font-bold text-[#0B3B2E]">{rev.name}</p>
                  <p className="text-xs text-[#7A6114]">{rev.locationEvent.en}</p>
                  <p className="text-xs text-[#525B57] mt-2 leading-relaxed">{rev.quote.en}</p>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setRevForm({
                        id: rev.id,
                        initials: rev.initials,
                        name: rev.name,
                        locationEn: rev.locationEvent.en,
                        quoteEn: rev.quote.en,
                        quoteUr: rev.quote.ur,
                      })
                    }
                    className="px-2.5 py-1 rounded bg-white border border-[#E5E2E1] text-xs font-semibold cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteTestimonial(rev.id)}
                    aria-label={`Delete review by ${rev.name}`}
                    className="p-1.5 rounded bg-white border border-[#E5E2E1] text-red-700 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs Manager */}
        <div className="bg-white rounded-xl border border-[#E5E2E1] p-6 space-y-5">
          <h2 className="font-serif text-xl font-bold text-[#0B3B2E]">
            Frequently Asked Questions ({faqs.length})
          </h2>

          <form
            onSubmit={handleSaveFaq}
            className="rounded-xl bg-[#FAF7F2] border border-[#E5E2E1] p-4 space-y-3"
          >
            <input
              type="text"
              value={faqForm.questionEn}
              onChange={(e) => setFaqForm({ ...faqForm, questionEn: e.target.value })}
              placeholder="FAQ Question (English)"
              className="w-full h-9 px-3 rounded-lg border border-[#D8D3C8] bg-white text-xs"
            />
            <textarea
              rows={2}
              value={faqForm.answerEn}
              onChange={(e) => setFaqForm({ ...faqForm, answerEn: e.target.value })}
              placeholder="FAQ Answer (English)"
              className="w-full p-2.5 rounded-lg border border-[#D8D3C8] bg-white text-xs"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#0B3B2E] text-[#FAF7F2] text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{faqForm.id ? 'Update FAQ' : 'Add FAQ'}</span>
            </button>
          </form>

          <div className="space-y-3">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className="rounded-xl border border-[#E5E2E1] bg-[#FAF7F2] p-4 flex items-start justify-between gap-4"
              >
                <div>
                  <p className="text-sm font-semibold text-[#0B3B2E]">{faq.question.en}</p>
                  <p className="text-xs text-[#525B57] mt-1">{faq.answer.en}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() =>
                      setFaqForm({
                        id: faq.id,
                        questionEn: faq.question.en,
                        questionUr: faq.question.ur,
                        answerEn: faq.answer.en,
                        answerUr: faq.answer.ur,
                      })
                    }
                    className="px-2.5 py-1 rounded bg-white border border-[#E5E2E1] text-xs font-semibold cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteFaq(faq.id)}
                    aria-label={`Delete FAQ ${faq.question.en}`}
                    className="p-1.5 rounded bg-white border border-[#E5E2E1] text-red-700 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Venue Settings & Contact Details
  const handleSaveSettings = async (e: FormEvent) => {
    e.preventDefault();
    await saveSiteConfig({
      ...siteConfig,
      ...settingsDraft,
    });
    setNotice('Venue contact details, visiting hours, and hero text saved live.');
  };

  return (
    <form
      onSubmit={handleSaveSettings}
      className="bg-white rounded-xl border border-[#E5E2E1] p-6 space-y-6"
    >
      <div className="flex items-center justify-between pb-4 border-b border-[#E5E2E1]">
        <div>
          <h2 className="font-serif text-xl font-bold text-[#0B3B2E]">
            Venue Contact, Hours & Hero Copy
          </h2>
          <p className="text-xs text-[#525B57] mt-0.5">
            Updates phone numbers, WhatsApp deep-links, address, and hero headings across the site.
          </p>
        </div>
        <button
          type="submit"
          className="px-4 py-2.5 rounded-lg bg-[#0B3B2E] text-[#FAF7F2] text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
        >
          <Save className="w-4 h-4 text-[#D4AF37]" />
          <span>Save Settings</span>
        </button>
      </div>

      {notice && (
        <p className="text-xs font-semibold text-emerald-900 bg-emerald-50 border border-emerald-200 px-4 py-3 rounded-xl">
          {notice}
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold mb-1">Display Phone</label>
          <input
            type="text"
            value={settingsDraft.phoneDisplay}
            onChange={(e) =>
              setSettingsDraft({ ...settingsDraft, phoneDisplay: e.target.value })
            }
            className="w-full h-10 px-3 rounded-lg border border-[#D8D3C8] bg-[#FAF7F2] text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">
            WhatsApp Number (digits with country code, e.g. 923409553001)
          </label>
          <input
            type="text"
            value={settingsDraft.whatsappNumber}
            onChange={(e) =>
              setSettingsDraft({
                ...settingsDraft,
                whatsappNumber: e.target.value,
                phoneRaw: `+${e.target.value.replace(/\D/g, '')}`,
              })
            }
            className="w-full h-10 px-3 rounded-lg border border-[#D8D3C8] bg-[#FAF7F2] text-sm tabular-nums"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Booking Email</label>
          <input
            type="email"
            value={settingsDraft.email}
            onChange={(e) => setSettingsDraft({ ...settingsDraft, email: e.target.value })}
            className="w-full h-10 px-3 rounded-lg border border-[#D8D3C8] bg-[#FAF7F2] text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Visiting Hours (EN)</label>
          <input
            type="text"
            value={settingsDraft.visitingHoursEn}
            onChange={(e) =>
              setSettingsDraft({ ...settingsDraft, visitingHoursEn: e.target.value })
            }
            className="w-full h-10 px-3 rounded-lg border border-[#D8D3C8] bg-[#FAF7F2] text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold mb-1">Address (EN)</label>
          <textarea
            rows={2}
            value={settingsDraft.addressEn}
            onChange={(e) => setSettingsDraft({ ...settingsDraft, addressEn: e.target.value })}
            className="w-full p-3 rounded-lg border border-[#D8D3C8] bg-[#FAF7F2] text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Address (UR)</label>
          <textarea
            rows={2}
            dir="rtl"
            value={settingsDraft.addressUr}
            onChange={(e) => setSettingsDraft({ ...settingsDraft, addressUr: e.target.value })}
            className="w-full p-3 rounded-lg border border-[#D8D3C8] bg-[#FAF7F2] text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#E5E2E1]">
        <div>
          <label className="block text-xs font-semibold mb-1">Home Hero Headline (EN)</label>
          <input
            type="text"
            value={settingsDraft.heroHeadlineEn}
            onChange={(e) =>
              setSettingsDraft({ ...settingsDraft, heroHeadlineEn: e.target.value })
            }
            className="w-full h-10 px-3 rounded-lg border border-[#D8D3C8] bg-[#FAF7F2] text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Home Hero Headline (UR)</label>
          <input
            type="text"
            dir="rtl"
            value={settingsDraft.heroHeadlineUr}
            onChange={(e) =>
              setSettingsDraft({ ...settingsDraft, heroHeadlineUr: e.target.value })
            }
            className="w-full h-10 px-3 rounded-lg border border-[#D8D3C8] bg-[#FAF7F2] text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Home Hero Subheadline (EN)</label>
          <textarea
            rows={2}
            value={settingsDraft.heroSubheadlineEn}
            onChange={(e) =>
              setSettingsDraft({ ...settingsDraft, heroSubheadlineEn: e.target.value })
            }
            className="w-full p-3 rounded-lg border border-[#D8D3C8] bg-[#FAF7F2] text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Home Hero Subheadline (UR)</label>
          <textarea
            rows={2}
            dir="rtl"
            value={settingsDraft.heroSubheadlineUr}
            onChange={(e) =>
              setSettingsDraft({ ...settingsDraft, heroSubheadlineUr: e.target.value })
            }
            className="w-full p-3 rounded-lg border border-[#D8D3C8] bg-[#FAF7F2] text-sm"
          />
        </div>
      </div>
    </form>
  );
}
