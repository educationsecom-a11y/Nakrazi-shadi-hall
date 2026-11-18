import { FormEvent, useEffect, useState } from 'react';
import { Plus, Save, Trash2 } from 'lucide-react';
import { useVenueData } from '../../context/VenueDataContext';
import { MENU_CATEGORIES, MenuCategoryId, MenuDish, WeddingPackage } from '../../data/venueData';

export function AdminPricingTab() {
  const {
    siteConfig,
    saveSiteConfig,
    packages,
    savePackage,
    menuDishes,
    saveMenuDish,
    deleteMenuDish,
  } = useVenueData();

  const [baseRate, setBaseRate] = useState<number>(siteConfig.baseVenuePerHead);
  useEffect(() => {
    setBaseRate(siteConfig.baseVenuePerHead);
  }, [siteConfig.baseVenuePerHead]);
  const [savingBase, setSavingBase] = useState(false);
  const [statusBanner, setStatusBanner] = useState('');
  const [errorBanner, setErrorBanner] = useState('');

  // Local editable copies for the 3 packages
  const [pkgDrafts, setPkgDrafts] = useState<Record<string, WeddingPackage>>(() => {
    const map: Record<string, WeddingPackage> = {};
    packages.forEach((p) => {
      map[p.id] = p;
    });
    return map;
  });
  useEffect(() => {
    setPkgDrafts((prev) => {
      const next = { ...prev };
      packages.forEach((p) => {
        if (!next[p.id]) next[p.id] = p;
      });
      return next;
    });
  }, [packages]);

  // New dish form
  const [dishForm, setDishForm] = useState<{
    id: string | null;
    category: MenuCategoryId;
    nameEn: string;
    nameUr: string;
    pricePerHead: string;
    noteEn: string;
    noteUr: string;
  }>({
    id: null,
    category: 'curry',
    nameEn: '',
    nameUr: '',
    pricePerHead: '350',
    noteEn: '',
    noteUr: '',
  });
  const [dishCategoryFilter, setDishCategoryFilter] = useState<'all' | MenuCategoryId>('all');

  const handleSaveBaseRate = async (e: FormEvent) => {
    e.preventDefault();
    setSavingBase(true);
    setStatusBanner('');
    setErrorBanner('');
    try {
      await saveSiteConfig({
        ...siteConfig,
        baseVenuePerHead: Math.max(0, Number(baseRate) || 0),
      });
      setStatusBanner('Hall base per-head rate updated.');
    } catch (err) {
      setErrorBanner(err instanceof Error ? err.message : 'Unable to save base rate.');
    } finally {
      setSavingBase(false);
    }
  };

  const handleSavePackage = async (pkgId: string, sortOrder: number) => {
    const draft = pkgDrafts[pkgId] || packages.find((p) => p.id === pkgId);
    if (!draft) return;
    setStatusBanner('');
    setErrorBanner('');
    try {
      await savePackage(draft, sortOrder);
      setStatusBanner(`${draft.name.en} price & details saved live.`);
    } catch (err) {
      setErrorBanner(err instanceof Error ? err.message : 'Unable to save package.');
    }
  };

  const updatePkgDraft = (pkgId: string, updater: (prev: WeddingPackage) => WeddingPackage) => {
    const base = pkgDrafts[pkgId] || packages.find((p) => p.id === pkgId);
    if (!base) return;
    setPkgDrafts((prev) => ({
      ...prev,
      [pkgId]: updater(base),
    }));
  };

  const handleSaveDish = async (e: FormEvent) => {
    e.preventDefault();
    if (!dishForm.nameEn.trim()) return;
    setStatusBanner('');
    setErrorBanner('');
    const sortOrder = dishForm.id
      ? Math.max(0, menuDishes.findIndex((d) => d.id === dishForm.id))
      : menuDishes.length;
    try {
      await saveMenuDish(
        {
          id: dishForm.id || `dish_${Date.now()}`,
          category: dishForm.category,
          name: {
            en: dishForm.nameEn.trim(),
            ur: dishForm.nameUr.trim() || dishForm.nameEn.trim(),
          },
          pricePerHead: Math.max(0, Number(dishForm.pricePerHead) || 0),
          note: {
            en: dishForm.noteEn.trim(),
            ur: dishForm.noteUr.trim() || dishForm.noteEn.trim(),
          },
        },
        sortOrder
      );
      setDishForm({
        id: null,
        category: 'curry',
        nameEn: '',
        nameUr: '',
        pricePerHead: '350',
        noteEn: '',
        noteUr: '',
      });
      setStatusBanner('Menu dish saved and updated in the Per-Head Calculator.');
    } catch (err) {
      setErrorBanner(err instanceof Error ? err.message : 'Unable to save menu dish.');
    }
  };

  const startEditDish = (dish: MenuDish) => {
    setDishForm({
      id: dish.id,
      category: dish.category,
      nameEn: dish.name.en,
      nameUr: dish.name.ur,
      pricePerHead: String(dish.pricePerHead),
      noteEn: dish.note.en,
      noteUr: dish.note.ur,
    });
  };

  const filteredDishes =
    dishCategoryFilter === 'all'
      ? menuDishes
      : menuDishes.filter((d) => d.category === dishCategoryFilter);

  return (
    <div className="space-y-8">
      {statusBanner && (
        <div className="text-xs font-semibold text-emerald-900 bg-emerald-50 border border-emerald-200 px-4 py-3 rounded-xl">
          {statusBanner}
        </div>
      )}
      {errorBanner && (
        <div className="text-xs font-semibold text-red-800 bg-red-50 border border-red-200 px-4 py-3 rounded-xl">
          {errorBanner}
        </div>
      )}

      {/* 1. Calculator Hall Base Rate */}
      <form
        onSubmit={handleSaveBaseRate}
        className="bg-white rounded-xl border border-[#E5E2E1] p-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4"
      >
        <div className="flex-1">
          <h2 className="font-serif text-xl font-bold text-[#0B3B2E]">
            Hall & Service Base Rate (Calculator)
          </h2>
          <p className="text-xs text-[#525B57] mt-1">
            Fixed per-guest hall, generator, seating, and staff fee added automatically in the Menu Calculator.
          </p>
        </div>

        <div className="flex items-end gap-3">
          <div>
            <label htmlFor="base-rate-input" className="block text-xs font-semibold mb-1">
              Rate (PKR / guest)
            </label>
            <input
              id="base-rate-input"
              type="number"
              min={0}
              value={baseRate}
              onChange={(e) => setBaseRate(Number(e.target.value))}
              className="w-36 h-10 px-3 rounded-lg border border-[#D8D3C8] bg-[#FAF7F2] text-sm font-bold tabular-nums"
            />
          </div>
          <button
            type="submit"
            disabled={savingBase}
            className="h-10 px-4 rounded-lg bg-[#0B3B2E] hover:bg-[#06241B] text-[#FAF7F2] text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <Save className="w-4 h-4 text-[#D4AF37]" />
            <span>{savingBase ? 'Saving...' : 'Save Rate'}</span>
          </button>
        </div>
      </form>

      {/* 2. Wedding Package Prices & Features */}
      <div className="space-y-4">
        <h2 className="font-serif text-2xl font-bold text-[#0B3B2E]">
          Wedding Packages & Per-Head Pricing
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {packages.map((pkg, idx) => {
            const draft = pkgDrafts[pkg.id] || pkg;
            return (
              <div
                key={pkg.id}
                className="bg-white rounded-xl border border-[#E5E2E1] p-5 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#F2ECE1]">
                    <span className="font-serif text-lg font-bold text-[#0B3B2E]">
                      {draft.name.en}
                    </span>
                    <label className="inline-flex items-center gap-1.5 text-xs font-medium text-[#525B57] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(draft.highlighted)}
                        onChange={(e) =>
                          updatePkgDraft(pkg.id, (prev) => ({
                            ...prev,
                            highlighted: e.target.checked,
                          }))
                        }
                        className="accent-[#0B3B2E]"
                      />
                      <span>Popular</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold mb-1">Price (PKR / guest)</label>
                      <input
                        type="number"
                        min={0}
                        value={draft.pricePerHead}
                        onChange={(e) =>
                          updatePkgDraft(pkg.id, (prev) => ({
                            ...prev,
                            pricePerHead: Number(e.target.value) || 0,
                          }))
                        }
                        className="w-full h-9 px-2.5 rounded-lg border border-[#D8D3C8] bg-[#FAF7F2] text-sm font-bold tabular-nums"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1">Badge (Optional)</label>
                      <input
                        type="text"
                        value={draft.badge?.en || ''}
                        onChange={(e) =>
                          updatePkgDraft(pkg.id, (prev) => ({
                            ...prev,
                            badge: e.target.value
                              ? { en: e.target.value, ur: prev.badge?.ur || e.target.value }
                              : undefined,
                          }))
                        }
                        placeholder="e.g. Most Popular"
                        className="w-full h-9 px-2.5 rounded-lg border border-[#D8D3C8] bg-[#FAF7F2] text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1">Package Name (EN)</label>
                    <input
                      type="text"
                      value={draft.name.en}
                      onChange={(e) =>
                        updatePkgDraft(pkg.id, (prev) => ({
                          ...prev,
                          name: { ...prev.name, en: e.target.value },
                        }))
                      }
                      className="w-full h-9 px-2.5 rounded-lg border border-[#D8D3C8] bg-[#FAF7F2] text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1">Package Name (UR)</label>
                    <input
                      type="text"
                      dir="rtl"
                      value={draft.name.ur}
                      onChange={(e) =>
                        updatePkgDraft(pkg.id, (prev) => ({
                          ...prev,
                          name: { ...prev.name, ur: e.target.value },
                        }))
                      }
                      className="w-full h-9 px-2.5 rounded-lg border border-[#D8D3C8] bg-[#FAF7F2] text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1">Description (EN)</label>
                    <textarea
                      rows={2}
                      value={draft.description.en}
                      onChange={(e) =>
                        updatePkgDraft(pkg.id, (prev) => ({
                          ...prev,
                          description: { ...prev.description, en: e.target.value },
                        }))
                      }
                      className="w-full p-2.5 rounded-lg border border-[#D8D3C8] bg-[#FAF7F2] text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1">
                      Checklist Features (1 per line, EN)
                    </label>
                    <textarea
                      rows={4}
                      value={draft.features.map((f) => f.en).join('\n')}
                      onChange={(e) => {
                        const lines = e.target.value.split('\n');
                        updatePkgDraft(pkg.id, (prev) => ({
                          ...prev,
                          features: lines.map((line, lineIdx) => ({
                            en: line,
                            ur: prev.features[lineIdx]?.ur || line,
                          })),
                        }));
                      }}
                      className="w-full p-2.5 rounded-lg border border-[#D8D3C8] bg-[#FAF7F2] text-xs"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleSavePackage(pkg.id, idx)}
                  className="w-full py-2.5 px-4 rounded-lg bg-[#D4AF37] hover:bg-[#C39B24] text-[#0B3B2E] text-xs font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save {draft.name.en}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Menu Calculator Dishes CRUD */}
      <div className="bg-white rounded-xl border border-[#E5E2E1] p-6 space-y-6">
        <div>
          <h2 className="font-serif text-xl font-bold text-[#0B3B2E]">
            Menu Calculator Dish Prices ({menuDishes.length})
          </h2>
          <p className="text-xs text-[#525B57] mt-0.5">
            Add, edit, or delete catering dishes and per-head PKR rates used in the interactive Menu Builder.
          </p>
        </div>

        <form
          onSubmit={handleSaveDish}
          className="rounded-xl bg-[#FAF7F2] border border-[#E5E2E1] p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 items-end"
        >
          <div>
            <label className="block text-xs font-semibold mb-1">Course Category</label>
            <select
              value={dishForm.category}
              onChange={(e) =>
                setDishForm({ ...dishForm, category: e.target.value as MenuCategoryId })
              }
              className="w-full h-9 px-2.5 rounded-lg border border-[#D8D3C8] bg-white text-xs"
            >
              {MENU_CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label.en}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Dish Name (EN) *</label>
            <input
              type="text"
              value={dishForm.nameEn}
              onChange={(e) => setDishForm({ ...dishForm, nameEn: e.target.value })}
              placeholder="e.g. Mutton Rosh"
              className="w-full h-9 px-2.5 rounded-lg border border-[#D8D3C8] bg-white text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Dish Name (UR)</label>
            <input
              type="text"
              dir="rtl"
              value={dishForm.nameUr}
              onChange={(e) => setDishForm({ ...dishForm, nameUr: e.target.value })}
              placeholder="اردو نام"
              className="w-full h-9 px-2.5 rounded-lg border border-[#D8D3C8] bg-white text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Price (PKR)</label>
            <input
              type="number"
              min={0}
              value={dishForm.pricePerHead}
              onChange={(e) => setDishForm({ ...dishForm, pricePerHead: e.target.value })}
              className="w-full h-9 px-2.5 rounded-lg border border-[#D8D3C8] bg-white text-xs font-bold tabular-nums"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Short Note (EN)</label>
            <input
              type="text"
              value={dishForm.noteEn}
              onChange={(e) => setDishForm({ ...dishForm, noteEn: e.target.value })}
              placeholder="Ingredients / style"
              className="w-full h-9 px-2.5 rounded-lg border border-[#D8D3C8] bg-white text-xs"
            />
          </div>

          <button
            type="submit"
            className="h-9 px-3 rounded-lg bg-[#0B3B2E] hover:bg-[#06241B] text-[#FAF7F2] text-xs font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{dishForm.id ? 'Update Dish' : 'Add Dish'}</span>
          </button>
        </form>

        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setDishCategoryFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
              dishCategoryFilter === 'all'
                ? 'bg-[#0B3B2E] text-[#F3DF98]'
                : 'bg-[#FAF7F2] text-[#525B57]'
            }`}
          >
            All Courses
          </button>
          {MENU_CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setDishCategoryFilter(c.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                dishCategoryFilter === c.id
                  ? 'bg-[#0B3B2E] text-[#F3DF98]'
                  : 'bg-[#FAF7F2] text-[#525B57]'
              }`}
            >
              {c.label.en}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto border border-[#E5E2E1] rounded-xl">
          <table className="w-full text-left border-collapse min-w-[640px]">
            <thead>
              <tr className="bg-[#FAF7F2] border-b border-[#E5E2E1] text-xs font-semibold text-[#525B57]">
                <th className="py-3 px-4">Dish</th>
                <th className="py-3 px-4">Course</th>
                <th className="py-3 px-4 text-right">Per-Head (PKR)</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E2E1] text-sm">
              {filteredDishes.map((dish) => (
                <tr key={dish.id} className="hover:bg-[#FAF7F2]/60">
                  <td className="py-3 px-4">
                    <p className="font-semibold text-[#0B3B2E]">{dish.name.en}</p>
                    <p className="text-xs text-[#525B57]">{dish.note.en}</p>
                  </td>
                  <td className="py-3 px-4 text-xs capitalize text-[#525B57]">{dish.category}</td>
                  <td className="py-3 px-4 text-right font-bold tabular-nums text-[#0B3B2E]">
                    PKR {dish.pricePerHead.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => startEditDish(dish)}
                        className="px-2.5 py-1 rounded border border-[#E5E2E1] hover:border-[#0B3B2E] text-xs font-semibold cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteMenuDish(dish.id)}
                        aria-label={`Delete ${dish.name.en}`}
                        className="p-1.5 rounded border border-[#E5E2E1] hover:border-red-600 text-red-700 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
