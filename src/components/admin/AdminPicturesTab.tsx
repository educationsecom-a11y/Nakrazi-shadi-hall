import { FormEvent, useEffect, useState } from 'react';
import { Plus, Save, Trash2 } from 'lucide-react';
import { SiteConfigData, useVenueData } from '../../context/VenueDataContext';
import { GALLERY_CATEGORIES, GalleryItem } from '../../data/venueData';
import { ImageFieldInput } from './ImageFieldInput';
import { VenueImage } from '../VenueImage';

export function AdminPicturesTab() {
  const { siteConfig, saveSiteConfig, galleryItems, saveGalleryItem, deleteGalleryItem } =
    useVenueData();

  const [configDraft, setConfigDraft] = useState<SiteConfigData>(siteConfig);
  useEffect(() => {
    setConfigDraft(siteConfig);
  }, [siteConfig]);
  const [savingSiteImgs, setSavingSiteImgs] = useState(false);
  const [siteSavedMsg, setSiteSavedMsg] = useState('');
  const [siteErrorMsg, setSiteErrorMsg] = useState('');

  const [editingGalleryId, setEditingGalleryId] = useState<string | null>(null);
  const [galleryForm, setGalleryForm] = useState<{
    category: GalleryItem['category'];
    titleEn: string;
    titleUr: string;
    captionEn: string;
    captionUr: string;
    image: string;
    aspect: GalleryItem['aspect'];
  }>({
    category: 'Barat Stages',
    titleEn: '',
    titleUr: '',
    captionEn: '',
    captionUr: '',
    image: '',
    aspect: 'square',
  });
  const [savingGallery, setSavingGallery] = useState(false);
  const [galleryMsg, setGalleryMsg] = useState('');

  const handleSaveSiteImages = async (e: FormEvent) => {
    e.preventDefault();
    setSavingSiteImgs(true);
    setSiteSavedMsg('');
    setSiteErrorMsg('');
    try {
      await saveSiteConfig({
        ...siteConfig,
        heroImageUrl: configDraft.heroImageUrl,
        stageImageUrl: configDraft.stageImageUrl,
        cateringImageUrl: configDraft.cateringImageUrl,
        avImageUrl: configDraft.avImageUrl,
      });
      setSiteSavedMsg('Main site pictures updated live.');
    } catch (err) {
      setSiteErrorMsg(err instanceof Error ? err.message : 'Unable to save site pictures.');
    } finally {
      setSavingSiteImgs(false);
    }
  };

  const resetGalleryForm = () => {
    setEditingGalleryId(null);
    setGalleryForm({
      category: 'Barat Stages',
      titleEn: '',
      titleUr: '',
      captionEn: '',
      captionUr: '',
      image: '',
      aspect: 'square',
    });
  };

  const startEditGallery = (item: GalleryItem) => {
    setEditingGalleryId(item.id);
    setGalleryForm({
      category: item.category,
      titleEn: item.title.en,
      titleUr: item.title.ur,
      captionEn: item.caption.en,
      captionUr: item.caption.ur,
      image: item.image,
      aspect: item.aspect,
    });
    setGalleryMsg('');
  };

  const handleSaveGalleryItem = async (e: FormEvent) => {
    e.preventDefault();
    if (!galleryForm.titleEn.trim() || !galleryForm.image.trim()) {
      setGalleryMsg('Please provide an English title and an image URL or upload.');
      return;
    }
    setSavingGallery(true);
    setGalleryMsg('');
    try {
      const sortOrder = editingGalleryId
        ? Math.max(0, galleryItems.findIndex((g) => g.id === editingGalleryId))
        : galleryItems.length;
      await saveGalleryItem(
        {
          id: editingGalleryId || `gal_${Date.now()}`,
          category: galleryForm.category,
          title: {
            en: galleryForm.titleEn.trim(),
            ur: galleryForm.titleUr.trim() || galleryForm.titleEn.trim(),
          },
          caption: {
            en: galleryForm.captionEn.trim(),
            ur: galleryForm.captionUr.trim() || galleryForm.captionEn.trim(),
          },
          image: galleryForm.image.trim(),
          aspect: galleryForm.aspect,
        },
        sortOrder
      );
      resetGalleryForm();
      setGalleryMsg('Gallery photo saved and published live.');
    } catch (err) {
      setSiteErrorMsg(err instanceof Error ? err.message : 'Unable to save gallery photo.');
    } finally {
      setSavingGallery(false);
    }
  };

  const categoryOptions = GALLERY_CATEGORIES.filter((c) => c.id !== 'All');

  return (
    <div className="space-y-8">
      {/* Section 1: Main Website Showcase Pictures */}
      <form
        onSubmit={handleSaveSiteImages}
        className="bg-white rounded-xl border border-[#E5E2E1] p-6 space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E5E2E1]">
          <div>
            <h2 className="font-serif text-xl font-bold text-[#0B3B2E]">
              Main Website Showcase Pictures
            </h2>
            <p className="text-xs text-[#525B57] mt-0.5">
              Update the Hero Banner and Featured Showcase photos across Home, About, and Services.
            </p>
          </div>
          <button
            type="submit"
            disabled={savingSiteImgs}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#0B3B2E] hover:bg-[#06241B] text-[#FAF7F2] text-xs font-semibold cursor-pointer whitespace-nowrap shrink-0"
          >
            <Save className="w-4 h-4 text-[#D4AF37]" />
            <span>{savingSiteImgs ? 'Saving...' : 'Save Main Pictures'}</span>
          </button>
        </div>

        {siteSavedMsg && (
          <p className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-lg">
            {siteSavedMsg}
          </p>
        )}
        {siteErrorMsg && (
          <p className="text-xs font-semibold text-red-800 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
            {siteErrorMsg}
          </p>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ImageFieldInput
            label="Home Hero Banquet Background"
            value={configDraft.heroImageUrl}
            onChange={(val) => setConfigDraft({ ...configDraft, heroImageUrl: val })}
          />
          <ImageFieldInput
            label="Stage & Floral Decor Showcase"
            value={configDraft.stageImageUrl}
            onChange={(val) => setConfigDraft({ ...configDraft, stageImageUrl: val })}
          />
          <ImageFieldInput
            label="Swati & Pakistani Catering Showcase"
            value={configDraft.cateringImageUrl}
            onChange={(val) => setConfigDraft({ ...configDraft, cateringImageUrl: val })}
          />
          <ImageFieldInput
            label="Sound & Lighting Showcase"
            value={configDraft.avImageUrl}
            onChange={(val) => setConfigDraft({ ...configDraft, avImageUrl: val })}
          />
        </div>
      </form>

      {/* Section 2: Add / Edit Gallery Photo */}
      <form
        onSubmit={handleSaveGalleryItem}
        className="bg-white rounded-xl border border-[#E5E2E1] p-6 space-y-5"
      >
        <div className="flex items-center justify-between pb-4 border-b border-[#E5E2E1]">
          <div>
            <h2 className="font-serif text-xl font-bold text-[#0B3B2E]">
              {editingGalleryId ? 'Edit Gallery Photo' : 'Add New Gallery Photo'}
            </h2>
            <p className="text-xs text-[#525B57] mt-0.5">
              Photos added here appear immediately in the Halls & Gallery masonry grid.
            </p>
          </div>
          {editingGalleryId && (
            <button
              type="button"
              onClick={resetGalleryForm}
              className="text-xs font-semibold text-[#525B57] hover:text-[#0B3B2E] cursor-pointer"
            >
              Cancel Edit
            </button>
          )}
        </div>

        {galleryMsg && (
          <p className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-lg">
            {galleryMsg}
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#1E1E1E] mb-1">
              Gallery Category
            </label>
            <select
              value={galleryForm.category}
              onChange={(e) =>
                setGalleryForm({
                  ...galleryForm,
                  category: e.target.value as GalleryItem['category'],
                })
              }
              className="w-full h-10 px-3 rounded-lg border border-[#D8D3C8] bg-[#FAF7F2] text-sm"
            >
              {categoryOptions.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label.en}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1E1E1E] mb-1">
              Card Aspect Ratio
            </label>
            <select
              value={galleryForm.aspect}
              onChange={(e) =>
                setGalleryForm({
                  ...galleryForm,
                  aspect: e.target.value as GalleryItem['aspect'],
                })
              }
              className="w-full h-10 px-3 rounded-lg border border-[#D8D3C8] bg-[#FAF7F2] text-sm"
            >
              <option value="square">Square</option>
              <option value="wide">Wide Landscape</option>
              <option value="tall">Tall Portrait</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1E1E1E] mb-1">
              Title (English) *
            </label>
            <input
              type="text"
              value={galleryForm.titleEn}
              onChange={(e) => setGalleryForm({ ...galleryForm, titleEn: e.target.value })}
              placeholder="e.g. Royal Gold Barat Stage"
              className="w-full h-10 px-3 rounded-lg border border-[#D8D3C8] bg-[#FAF7F2] text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1E1E1E] mb-1">
              Title (Urdu)
            </label>
            <input
              type="text"
              dir="rtl"
              value={galleryForm.titleUr}
              onChange={(e) => setGalleryForm({ ...galleryForm, titleUr: e.target.value })}
              placeholder="اردو عنوان (اختیاری)"
              className="w-full h-10 px-3 rounded-lg border border-[#D8D3C8] bg-[#FAF7F2] text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1E1E1E] mb-1">
              Caption (English)
            </label>
            <input
              type="text"
              value={galleryForm.captionEn}
              onChange={(e) => setGalleryForm({ ...galleryForm, captionEn: e.target.value })}
              placeholder="Short description of setup..."
              className="w-full h-10 px-3 rounded-lg border border-[#D8D3C8] bg-[#FAF7F2] text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1E1E1E] mb-1">
              Caption (Urdu)
            </label>
            <input
              type="text"
              dir="rtl"
              value={galleryForm.captionUr}
              onChange={(e) => setGalleryForm({ ...galleryForm, captionUr: e.target.value })}
              placeholder="مختصر تفصیل (اختیاری)"
              className="w-full h-10 px-3 rounded-lg border border-[#D8D3C8] bg-[#FAF7F2] text-sm"
            />
          </div>
        </div>

        <ImageFieldInput
          label="Photo Image *"
          value={galleryForm.image}
          onChange={(val) => setGalleryForm({ ...galleryForm, image: val })}
        />

        <button
          type="submit"
          disabled={savingGallery}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#D4AF37] hover:bg-[#C39B24] text-[#0B3B2E] text-sm font-semibold cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>
            {savingGallery
              ? 'Saving Photo...'
              : editingGalleryId
              ? 'Update Gallery Photo'
              : 'Add Photo to Gallery'}
          </span>
        </button>
      </form>

      {/* Section 3: Existing Gallery Items Grid */}
      <div className="bg-white rounded-xl border border-[#E5E2E1] p-6">
        <h3 className="font-serif text-lg font-bold text-[#0B3B2E] mb-4">
          Published Gallery Photos ({galleryItems.length})
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {galleryItems.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-[#E5E2E1] bg-[#FAF7F2] overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="h-40 bg-[#0B3B2E]">
                  <VenueImage
                    src={item.image}
                    alt={item.title.en}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3.5">
                  <p className="text-[11px] font-semibold text-[#7A6114]">{item.category}</p>
                  <p className="font-serif text-base font-semibold text-[#0B3B2E] mt-0.5">
                    {item.title.en}
                  </p>
                </div>
              </div>
              <div className="px-3.5 pb-3.5 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => startEditGallery(item)}
                  className="px-3 py-1.5 rounded-md bg-white border border-[#E5E2E1] hover:border-[#0B3B2E] text-xs font-semibold text-[#0B3B2E] cursor-pointer"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => deleteGalleryItem(item.id)}
                  aria-label={`Delete ${item.title.en}`}
                  className="p-1.5 rounded-md bg-white border border-[#E5E2E1] hover:border-red-600 text-red-700 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
