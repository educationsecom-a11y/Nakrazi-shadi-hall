import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  FAQS,
  FaqItem,
  GALLERY_ITEMS,
  GalleryItem,
  HALL_BASE_VENUE_PER_HEAD,
  HALL_SPECS,
  HallSpec,
  MENU_DISHES,
  MenuCategoryId,
  MenuDish,
  SERVICES_DATA,
  ServiceDetail,
  TESTIMONIALS,
  TestimonialItem,
  VENUE_CONTACT,
  VENUE_IMAGES,
  WEDDING_PACKAGES,
  WeddingPackage,
} from '../data/venueData';
import { isMissingTableError, supabase } from '../lib/supabase';

export interface SiteConfigData {
  heroImageUrl: string;
  stageImageUrl: string;
  cateringImageUrl: string;
  avImageUrl: string;
  baseVenuePerHead: number;
  phoneDisplay: string;
  phoneRaw: string;
  whatsappNumber: string;
  email: string;
  addressEn: string;
  addressUr: string;
  visitingHoursEn: string;
  visitingHoursUr: string;
  fridayNoteEn: string;
  fridayNoteUr: string;
  heroHeadlineEn: string;
  heroHeadlineUr: string;
  heroSubheadlineEn: string;
  heroSubheadlineUr: string;
}

export interface BookingInquiryRecord {
  id: string;
  fullName: string;
  phone: string;
  eventDate: string;
  eventShift: 'Day Lunch' | 'Night Dinner';
  eventType: string;
  gentsCount: number;
  ladiesCount: number;
  catering: 'Yes - Per Head' | 'No - Hall Only';
  notes: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt?: string | null;
}

export interface SupabaseConnectionStatus {
  checked: boolean;
  connected: boolean;
  missingSchema: boolean;
  lastError: string | null;
}

export const DEFAULT_SITE_CONFIG: SiteConfigData = {
  heroImageUrl: VENUE_IMAGES.heroBanquet,
  stageImageUrl: VENUE_IMAGES.stageDecor,
  cateringImageUrl: VENUE_IMAGES.cateringFeast,
  avImageUrl: VENUE_IMAGES.avLighting,
  baseVenuePerHead: HALL_BASE_VENUE_PER_HEAD,
  phoneDisplay: VENUE_CONTACT.phoneDisplay,
  phoneRaw: VENUE_CONTACT.phoneRaw,
  whatsappNumber: VENUE_CONTACT.whatsappNumber,
  email: VENUE_CONTACT.email,
  addressEn: VENUE_CONTACT.address.en,
  addressUr: VENUE_CONTACT.address.ur,
  visitingHoursEn: VENUE_CONTACT.visitingHours.en,
  visitingHoursUr: VENUE_CONTACT.visitingHours.ur,
  fridayNoteEn: VENUE_CONTACT.fridayNote.en,
  fridayNoteUr: VENUE_CONTACT.fridayNote.ur,
  heroHeadlineEn: 'Celebrate Your Grand Moments in the Heart of Swat',
  heroHeadlineUr: 'وادیِ سوات کے دل میں اپنی خوشیوں کا شاندار جشن منائیں',
  heroSubheadlineEn:
    'Separate parda-compliant gents and ladies banquet halls, custom floral stages, and authentic Swati hospitality with zero city traffic.',
  heroSubheadlineUr:
    'مردانہ و زنانہ کے لیے علیحدہ باپردہ ہال، خوبصورت پھولوں کے اسٹیج اور ٹریفک سے پاک کشادہ ماحول کے ساتھ سواتی مہمان نوازی۔',
};

interface VenueDataContextValue {
  siteConfig: SiteConfigData;
  packages: WeddingPackage[];
  menuDishes: MenuDish[];
  galleryItems: GalleryItem[];
  services: ServiceDetail[];
  hallSpecs: HallSpec[];
  testimonials: TestimonialItem[];
  faqs: FaqItem[];
  whatsappDefaultUrl: string;
  buildWhatsAppUrl: (text: string) => string;
  supabaseStatus: SupabaseConnectionStatus;
  refreshFromSupabase: () => Promise<void>;

  // Admin mutation methods
  saveSiteConfig: (next: SiteConfigData) => Promise<void>;
  savePackage: (pkg: WeddingPackage, sortOrder: number) => Promise<void>;
  saveMenuDish: (dish: MenuDish, sortOrder: number) => Promise<void>;
  deleteMenuDish: (id: string) => Promise<void>;
  saveGalleryItem: (item: GalleryItem, sortOrder: number) => Promise<void>;
  deleteGalleryItem: (id: string) => Promise<void>;
  saveService: (service: ServiceDetail, sortOrder: number) => Promise<void>;
  saveHallSpec: (hall: HallSpec, sortOrder: number) => Promise<void>;
  saveTestimonial: (item: TestimonialItem, sortOrder: number) => Promise<void>;
  deleteTestimonial: (id: string) => Promise<void>;
  saveFaq: (faq: FaqItem, sortOrder: number) => Promise<void>;
  deleteFaq: (id: string) => Promise<void>;
  seedDefaultsToSupabase: () => Promise<void>;

  // Public booking inquiry submission + admin inquiry actions
  submitBookingInquiry: (
    payload: Omit<BookingInquiryRecord, 'id' | 'status' | 'createdAt'>
  ) => Promise<string>;
  updateInquiryStatus: (
    id: string,
    status: BookingInquiryRecord['status'],
    notes?: string
  ) => Promise<void>;
  deleteInquiry: (id: string) => Promise<void>;
}

const VenueDataContext = createContext<VenueDataContextValue | undefined>(undefined);

function slugId(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

function throwSupabaseError(error: { message: string; code?: string }, context: string): never {
  throw new Error(`${context}: ${error.message}`);
}

export function VenueDataProvider({ children }: { children: React.ReactNode }) {
  const [siteConfig, setSiteConfig] = useState<SiteConfigData>(DEFAULT_SITE_CONFIG);
  const [packages, setPackages] = useState<WeddingPackage[]>(WEDDING_PACKAGES);
  const [menuDishes, setMenuDishes] = useState<MenuDish[]>(MENU_DISHES);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(GALLERY_ITEMS);
  const [services, setServices] = useState<ServiceDetail[]>(SERVICES_DATA);
  const [hallSpecs, setHallSpecs] = useState<HallSpec[]>(HALL_SPECS);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(TESTIMONIALS);
  const [faqs, setFaqs] = useState<FaqItem[]>(FAQS);
  const [supabaseStatus, setSupabaseStatus] = useState<SupabaseConnectionStatus>({
    checked: false,
    connected: false,
    missingSchema: false,
    lastError: null,
  });

  const refreshFromSupabase = useCallback(async () => {
    try {
      const [
        configRes,
        pkgRes,
        dishRes,
        galRes,
        svcRes,
        hallRes,
        revRes,
        faqRes,
      ] = await Promise.all([
        supabase.from('site_config').select('*').eq('id', 'main').maybeSingle(),
        supabase.from('packages').select('*').order('sort_order', { ascending: true }),
        supabase.from('menu_dishes').select('*').order('sort_order', { ascending: true }),
        supabase.from('gallery_items').select('*').order('sort_order', { ascending: true }),
        supabase.from('services').select('*').order('sort_order', { ascending: true }),
        supabase.from('hall_specs').select('*').order('sort_order', { ascending: true }),
        supabase.from('testimonials').select('*').order('sort_order', { ascending: true }),
        supabase.from('faqs').select('*').order('sort_order', { ascending: true }),
      ]);

      const firstError =
        configRes.error ||
        pkgRes.error ||
        dishRes.error ||
        galRes.error ||
        svcRes.error ||
        hallRes.error ||
        revRes.error ||
        faqRes.error;

      if (firstError) {
        const missingSchema = isMissingTableError(firstError);
        setSupabaseStatus({
          checked: true,
          connected: !missingSchema,
          missingSchema,
          lastError: firstError.message,
        });
        return;
      }

      setSupabaseStatus({
        checked: true,
        connected: true,
        missingSchema: false,
        lastError: null,
      });

      if (configRes.data) {
        const d = configRes.data;
        setSiteConfig({
          heroImageUrl: d.hero_image_url || DEFAULT_SITE_CONFIG.heroImageUrl,
          stageImageUrl: d.stage_image_url || DEFAULT_SITE_CONFIG.stageImageUrl,
          cateringImageUrl: d.catering_image_url || DEFAULT_SITE_CONFIG.cateringImageUrl,
          avImageUrl: d.av_image_url || DEFAULT_SITE_CONFIG.avImageUrl,
          baseVenuePerHead:
            typeof d.base_venue_per_head === 'number'
              ? d.base_venue_per_head
              : DEFAULT_SITE_CONFIG.baseVenuePerHead,
          phoneDisplay: d.phone_display || DEFAULT_SITE_CONFIG.phoneDisplay,
          phoneRaw: d.phone_raw || DEFAULT_SITE_CONFIG.phoneRaw,
          whatsappNumber: d.whatsapp_number || DEFAULT_SITE_CONFIG.whatsappNumber,
          email: d.email || DEFAULT_SITE_CONFIG.email,
          addressEn: d.address_en || DEFAULT_SITE_CONFIG.addressEn,
          addressUr: d.address_ur || DEFAULT_SITE_CONFIG.addressUr,
          visitingHoursEn: d.visiting_hours_en || DEFAULT_SITE_CONFIG.visitingHoursEn,
          visitingHoursUr: d.visiting_hours_ur || DEFAULT_SITE_CONFIG.visitingHoursUr,
          fridayNoteEn: d.friday_note_en ?? DEFAULT_SITE_CONFIG.fridayNoteEn,
          fridayNoteUr: d.friday_note_ur ?? DEFAULT_SITE_CONFIG.fridayNoteUr,
          heroHeadlineEn: d.hero_headline_en ?? DEFAULT_SITE_CONFIG.heroHeadlineEn,
          heroHeadlineUr: d.hero_headline_ur ?? DEFAULT_SITE_CONFIG.heroHeadlineUr,
          heroSubheadlineEn: d.hero_subheadline_en ?? DEFAULT_SITE_CONFIG.heroSubheadlineEn,
          heroSubheadlineUr: d.hero_subheadline_ur ?? DEFAULT_SITE_CONFIG.heroSubheadlineUr,
        });
      }

      if (pkgRes.data && pkgRes.data.length > 0) {
        setPackages(
          pkgRes.data.map((d) => {
            const featuresEn: string[] = Array.isArray(d.features_en) ? d.features_en : [];
            const featuresUr: string[] = Array.isArray(d.features_ur) ? d.features_ur : [];
            return {
              id: d.id as WeddingPackage['id'],
              name: { en: d.name_en, ur: d.name_ur || d.name_en },
              tierLabel: { en: d.tier_label_en, ur: d.tier_label_ur || d.tier_label_en },
              badge: d.badge_en
                ? { en: d.badge_en, ur: d.badge_ur || d.badge_en }
                : undefined,
              pricePerHead: Number(d.price_per_head) || 0,
              hallFeeNote: { en: d.hall_fee_note_en || '', ur: d.hall_fee_note_ur || '' },
              description: { en: d.description_en || '', ur: d.description_ur || '' },
              highlighted: Boolean(d.highlighted),
              features: featuresEn.map((enText, idx) => ({
                en: enText,
                ur: featuresUr[idx] || enText,
              })),
              presetDishIds: Array.isArray(d.preset_dish_ids) ? d.preset_dish_ids : [],
            } satisfies WeddingPackage;
          })
        );
      }

      if (dishRes.data && dishRes.data.length > 0) {
        setMenuDishes(
          dishRes.data.map(
            (d) =>
              ({
                id: d.id,
                category: d.category as MenuCategoryId,
                name: { en: d.name_en, ur: d.name_ur || d.name_en },
                pricePerHead: Number(d.price_per_head) || 0,
                note: { en: d.note_en || '', ur: d.note_ur || '' },
              }) satisfies MenuDish
          )
        );
      }

      if (galRes.data && galRes.data.length > 0) {
        setGalleryItems(
          galRes.data.map(
            (d) =>
              ({
                id: d.id,
                category: d.category as GalleryItem['category'],
                title: { en: d.title_en, ur: d.title_ur || d.title_en },
                caption: { en: d.caption_en || '', ur: d.caption_ur || '' },
                image: d.image_url,
                aspect: (d.aspect || 'square') as GalleryItem['aspect'],
              }) satisfies GalleryItem
          )
        );
      }

      if (svcRes.data && svcRes.data.length > 0) {
        setServices(
          svcRes.data.map((d) => {
            const featuresEn: string[] = Array.isArray(d.features_en) ? d.features_en : [];
            const featuresUr: string[] = Array.isArray(d.features_ur) ? d.features_ur : [];
            return {
              id: d.id,
              number: d.number || '01',
              category: { en: d.category_en, ur: d.category_ur || d.category_en },
              title: { en: d.title_en, ur: d.title_ur || d.title_en },
              summary: { en: d.summary_en || '', ur: d.summary_ur || '' },
              description: { en: d.description_en || '', ur: d.description_ur || '' },
              image: d.image_url,
              features: featuresEn.map((enText, idx) => ({
                en: enText,
                ur: featuresUr[idx] || enText,
              })),
            } satisfies ServiceDetail;
          })
        );
      }

      if (hallRes.data && hallRes.data.length > 0) {
        setHallSpecs(
          hallRes.data.map(
            (d) =>
              ({
                id: d.id,
                name: { en: d.name_en, ur: d.name_ur || d.name_en },
                areaSqFt: d.area_sq_ft,
                banquetCapacity: d.banquet_capacity,
                theaterCapacity: d.theater_capacity,
                bridalRoom: { en: d.bridal_room_en, ur: d.bridal_room_ur || d.bridal_room_en },
                climateControl: {
                  en: d.climate_control_en,
                  ur: d.climate_control_ur || d.climate_control_en,
                },
                notes: { en: d.notes_en || '', ur: d.notes_ur || '' },
              }) satisfies HallSpec
          )
        );
      }

      if (revRes.data && revRes.data.length > 0) {
        setTestimonials(
          revRes.data.map(
            (d) =>
              ({
                id: d.id,
                initials: d.initials,
                name: d.name,
                locationEvent: {
                  en: d.location_event_en,
                  ur: d.location_event_ur || d.location_event_en,
                },
                quote: { en: d.quote_en, ur: d.quote_ur || d.quote_en },
              }) satisfies TestimonialItem
          )
        );
      }

      if (faqRes.data && faqRes.data.length > 0) {
        setFaqs(
          faqRes.data.map(
            (d) =>
              ({
                id: d.id,
                question: { en: d.question_en, ur: d.question_ur || d.question_en },
                answer: { en: d.answer_en, ur: d.answer_ur || d.answer_en },
              }) satisfies FaqItem
          )
        );
      }
    } catch (err) {
      setSupabaseStatus({
        checked: true,
        connected: false,
        missingSchema: false,
        lastError: err instanceof Error ? err.message : String(err),
      });
    }
  }, []);

  useEffect(() => {
    refreshFromSupabase();

    const channel = supabase
      .channel('nakreezay-cms-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'site_config' }, () => {
        refreshFromSupabase();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'packages' }, () => {
        refreshFromSupabase();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'menu_dishes' }, () => {
        refreshFromSupabase();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'gallery_items' }, () => {
        refreshFromSupabase();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'services' }, () => {
        refreshFromSupabase();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'hall_specs' }, () => {
        refreshFromSupabase();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'testimonials' }, () => {
        refreshFromSupabase();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'faqs' }, () => {
        refreshFromSupabase();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refreshFromSupabase]);

  const buildWhatsAppUrl = (text: string) =>
    `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(text)}`;

  const whatsappDefaultUrl = buildWhatsAppUrl(
    'Assalam-o-Alaikum Nakreezay Shadi Hall, I would like to inquire about a wedding booking.'
  );

  // Admin write operations
  const saveSiteConfig = async (next: SiteConfigData) => {
    const normalized: SiteConfigData = {
      ...next,
      baseVenuePerHead: Number(next.baseVenuePerHead) || 0,
    };
    const { error } = await supabase.from('site_config').upsert({
      id: 'main',
      hero_image_url: normalized.heroImageUrl,
      stage_image_url: normalized.stageImageUrl,
      catering_image_url: normalized.cateringImageUrl,
      av_image_url: normalized.avImageUrl,
      base_venue_per_head: normalized.baseVenuePerHead,
      phone_display: normalized.phoneDisplay,
      phone_raw: normalized.phoneRaw,
      whatsapp_number: normalized.whatsappNumber,
      email: normalized.email,
      address_en: normalized.addressEn,
      address_ur: normalized.addressUr,
      visiting_hours_en: normalized.visitingHoursEn,
      visiting_hours_ur: normalized.visitingHoursUr,
      friday_note_en: normalized.fridayNoteEn,
      friday_note_ur: normalized.fridayNoteUr,
      hero_headline_en: normalized.heroHeadlineEn,
      hero_headline_ur: normalized.heroHeadlineUr,
      hero_subheadline_en: normalized.heroSubheadlineEn,
      hero_subheadline_ur: normalized.heroSubheadlineUr,
      updated_at: new Date().toISOString(),
    });
    if (error) throwSupabaseError(error, 'Failed to save site configuration');
    setSiteConfig(normalized);
  };

  const savePackage = async (pkg: WeddingPackage, sortOrder: number) => {
    const id = pkg.id || slugId('pkg');
    const { error } = await supabase.from('packages').upsert({
      id,
      name_en: pkg.name.en.trim().slice(0, 100),
      name_ur: (pkg.name.ur || pkg.name.en).trim().slice(0, 120),
      tier_label_en: pkg.tierLabel.en.trim().slice(0, 80),
      tier_label_ur: (pkg.tierLabel.ur || pkg.tierLabel.en).trim().slice(0, 100),
      badge_en: pkg.badge?.en?.trim() ? pkg.badge.en.trim().slice(0, 60) : null,
      badge_ur: pkg.badge?.en?.trim()
        ? (pkg.badge.ur || pkg.badge.en).trim().slice(0, 80)
        : null,
      price_per_head: Number(pkg.pricePerHead) || 0,
      hall_fee_note_en: pkg.hallFeeNote.en.trim().slice(0, 180),
      hall_fee_note_ur: (pkg.hallFeeNote.ur || pkg.hallFeeNote.en).trim().slice(0, 200),
      description_en: pkg.description.en.trim().slice(0, 400),
      description_ur: (pkg.description.ur || pkg.description.en).trim().slice(0, 450),
      highlighted: Boolean(pkg.highlighted),
      features_en: pkg.features.map((f) => f.en).slice(0, 20),
      features_ur: pkg.features.map((f) => f.ur || f.en).slice(0, 20),
      preset_dish_ids: (pkg.presetDishIds || []).slice(0, 30),
      sort_order: sortOrder,
      updated_at: new Date().toISOString(),
    });
    if (error) throwSupabaseError(error, 'Failed to save package');
    setPackages((prev) =>
      prev.some((p) => p.id === id)
        ? prev.map((p) => (p.id === id ? { ...pkg, id: id as WeddingPackage['id'] } : p))
        : [...prev, { ...pkg, id: id as WeddingPackage['id'] }]
    );
  };

  const saveMenuDish = async (dish: MenuDish, sortOrder: number) => {
    const id = dish.id || slugId('dish');
    const savedDish: MenuDish = { ...dish, id };
    const { error } = await supabase.from('menu_dishes').upsert({
      id,
      category: dish.category,
      name_en: dish.name.en.trim().slice(0, 100),
      name_ur: (dish.name.ur || dish.name.en).trim().slice(0, 120),
      price_per_head: Number(dish.pricePerHead) || 0,
      note_en: dish.note.en.trim().slice(0, 200),
      note_ur: (dish.note.ur || dish.note.en).trim().slice(0, 240),
      sort_order: sortOrder,
      updated_at: new Date().toISOString(),
    });
    if (error) throwSupabaseError(error, 'Failed to save menu dish');
    setMenuDishes((prev) =>
      prev.some((d) => d.id === id)
        ? prev.map((d) => (d.id === id ? savedDish : d))
        : [...prev, savedDish]
    );
  };

  const deleteMenuDish = async (id: string) => {
    const { error } = await supabase.from('menu_dishes').delete().eq('id', id);
    if (error) throwSupabaseError(error, 'Failed to delete menu dish');
    setMenuDishes((prev) => prev.filter((d) => d.id !== id));
  };

  const saveGalleryItem = async (item: GalleryItem, sortOrder: number) => {
    const id = item.id || slugId('gal');
    const savedItem: GalleryItem = { ...item, id };
    const { error } = await supabase.from('gallery_items').upsert({
      id,
      category: item.category,
      title_en: item.title.en.trim().slice(0, 120),
      title_ur: (item.title.ur || item.title.en).trim().slice(0, 150),
      caption_en: item.caption.en.trim().slice(0, 300),
      caption_ur: (item.caption.ur || item.caption.en).trim().slice(0, 350),
      image_url: item.image,
      aspect: item.aspect || 'square',
      sort_order: sortOrder,
      updated_at: new Date().toISOString(),
    });
    if (error) throwSupabaseError(error, 'Failed to save gallery photo');
    setGalleryItems((prev) =>
      prev.some((g) => g.id === id)
        ? prev.map((g) => (g.id === id ? savedItem : g))
        : [...prev, savedItem]
    );
  };

  const deleteGalleryItem = async (id: string) => {
    const { error } = await supabase.from('gallery_items').delete().eq('id', id);
    if (error) throwSupabaseError(error, 'Failed to delete gallery photo');
    setGalleryItems((prev) => prev.filter((g) => g.id !== id));
  };

  const saveService = async (service: ServiceDetail, sortOrder: number) => {
    const id = service.id || slugId('svc');
    const savedService: ServiceDetail = { ...service, id };
    const { error } = await supabase.from('services').upsert({
      id,
      number: service.number.trim().slice(0, 10),
      category_en: service.category.en.trim().slice(0, 80),
      category_ur: (service.category.ur || service.category.en).trim().slice(0, 100),
      title_en: service.title.en.trim().slice(0, 120),
      title_ur: (service.title.ur || service.title.en).trim().slice(0, 140),
      summary_en: service.summary.en.trim().slice(0, 240),
      summary_ur: (service.summary.ur || service.summary.en).trim().slice(0, 280),
      description_en: service.description.en.trim().slice(0, 600),
      description_ur: (service.description.ur || service.description.en).trim().slice(0, 700),
      image_url: service.image,
      features_en: service.features.map((f) => f.en).slice(0, 10),
      features_ur: service.features.map((f) => f.ur || f.en).slice(0, 10),
      sort_order: sortOrder,
      updated_at: new Date().toISOString(),
    });
    if (error) throwSupabaseError(error, 'Failed to save service');
    setServices((prev) =>
      prev.some((s) => s.id === id)
        ? prev.map((s) => (s.id === id ? savedService : s))
        : [...prev, savedService]
    );
  };

  const saveHallSpec = async (hall: HallSpec, sortOrder: number) => {
    const id = hall.id || slugId('hall');
    const savedHall: HallSpec = { ...hall, id };
    const { error } = await supabase.from('hall_specs').upsert({
      id,
      name_en: hall.name.en.trim().slice(0, 120),
      name_ur: (hall.name.ur || hall.name.en).trim().slice(0, 140),
      area_sq_ft: hall.areaSqFt.trim().slice(0, 40),
      banquet_capacity: hall.banquetCapacity.trim().slice(0, 40),
      theater_capacity: hall.theaterCapacity.trim().slice(0, 40),
      bridal_room_en: hall.bridalRoom.en.trim().slice(0, 120),
      bridal_room_ur: (hall.bridalRoom.ur || hall.bridalRoom.en).trim().slice(0, 140),
      climate_control_en: hall.climateControl.en.trim().slice(0, 120),
      climate_control_ur: (hall.climateControl.ur || hall.climateControl.en).trim().slice(0, 140),
      notes_en: hall.notes.en.trim().slice(0, 160),
      notes_ur: (hall.notes.ur || hall.notes.en).trim().slice(0, 180),
      sort_order: sortOrder,
      updated_at: new Date().toISOString(),
    });
    if (error) throwSupabaseError(error, 'Failed to save hall specification');
    setHallSpecs((prev) =>
      prev.some((h) => h.id === id)
        ? prev.map((h) => (h.id === id ? savedHall : h))
        : [...prev, savedHall]
    );
  };

  const saveTestimonial = async (item: TestimonialItem, sortOrder: number) => {
    const id = item.id || slugId('rev');
    const savedItem: TestimonialItem = { ...item, id };
    const { error } = await supabase.from('testimonials').upsert({
      id,
      initials: item.initials.trim().slice(0, 6),
      name: item.name.trim().slice(0, 100),
      location_event_en: item.locationEvent.en.trim().slice(0, 120),
      location_event_ur: (item.locationEvent.ur || item.locationEvent.en).trim().slice(0, 140),
      quote_en: item.quote.en.trim().slice(0, 600),
      quote_ur: (item.quote.ur || item.quote.en).trim().slice(0, 700),
      sort_order: sortOrder,
      updated_at: new Date().toISOString(),
    });
    if (error) throwSupabaseError(error, 'Failed to save testimonial');
    setTestimonials((prev) =>
      prev.some((t) => t.id === id)
        ? prev.map((t) => (t.id === id ? savedItem : t))
        : [...prev, savedItem]
    );
  };

  const deleteTestimonial = async (id: string) => {
    const { error } = await supabase.from('testimonials').delete().eq('id', id);
    if (error) throwSupabaseError(error, 'Failed to delete testimonial');
    setTestimonials((prev) => prev.filter((t) => t.id !== id));
  };

  const saveFaq = async (faq: FaqItem, sortOrder: number) => {
    const id = faq.id || slugId('faq');
    const savedFaq: FaqItem = { ...faq, id };
    const { error } = await supabase.from('faqs').upsert({
      id,
      question_en: faq.question.en.trim().slice(0, 240),
      question_ur: (faq.question.ur || faq.question.en).trim().slice(0, 280),
      answer_en: faq.answer.en.trim().slice(0, 700),
      answer_ur: (faq.answer.ur || faq.answer.en).trim().slice(0, 800),
      sort_order: sortOrder,
      updated_at: new Date().toISOString(),
    });
    if (error) throwSupabaseError(error, 'Failed to save FAQ');
    setFaqs((prev) =>
      prev.some((f) => f.id === id)
        ? prev.map((f) => (f.id === id ? savedFaq : f))
        : [...prev, savedFaq]
    );
  };

  const deleteFaq = async (id: string) => {
    const { error } = await supabase.from('faqs').delete().eq('id', id);
    if (error) throwSupabaseError(error, 'Failed to delete FAQ');
    setFaqs((prev) => prev.filter((f) => f.id !== id));
  };

  const seedDefaultsToSupabase = async () => {
    const now = new Date().toISOString();

    const [
      configRes,
      pkgRes,
      dishRes,
      galRes,
      svcRes,
      hallRes,
      revRes,
      faqRes,
    ] = await Promise.all([
      supabase.from('site_config').upsert({
        id: 'main',
        hero_image_url: DEFAULT_SITE_CONFIG.heroImageUrl,
        stage_image_url: DEFAULT_SITE_CONFIG.stageImageUrl,
        catering_image_url: DEFAULT_SITE_CONFIG.cateringImageUrl,
        av_image_url: DEFAULT_SITE_CONFIG.avImageUrl,
        base_venue_per_head: DEFAULT_SITE_CONFIG.baseVenuePerHead,
        phone_display: DEFAULT_SITE_CONFIG.phoneDisplay,
        phone_raw: DEFAULT_SITE_CONFIG.phoneRaw,
        whatsapp_number: DEFAULT_SITE_CONFIG.whatsappNumber,
        email: DEFAULT_SITE_CONFIG.email,
        address_en: DEFAULT_SITE_CONFIG.addressEn,
        address_ur: DEFAULT_SITE_CONFIG.addressUr,
        visiting_hours_en: DEFAULT_SITE_CONFIG.visitingHoursEn,
        visiting_hours_ur: DEFAULT_SITE_CONFIG.visitingHoursUr,
        friday_note_en: DEFAULT_SITE_CONFIG.fridayNoteEn,
        friday_note_ur: DEFAULT_SITE_CONFIG.fridayNoteUr,
        hero_headline_en: DEFAULT_SITE_CONFIG.heroHeadlineEn,
        hero_headline_ur: DEFAULT_SITE_CONFIG.heroHeadlineUr,
        hero_subheadline_en: DEFAULT_SITE_CONFIG.heroSubheadlineEn,
        hero_subheadline_ur: DEFAULT_SITE_CONFIG.heroSubheadlineUr,
        updated_at: now,
      }),
      supabase.from('packages').upsert(
        WEDDING_PACKAGES.map((pkg, idx) => ({
          id: pkg.id,
          name_en: pkg.name.en,
          name_ur: pkg.name.ur,
          tier_label_en: pkg.tierLabel.en,
          tier_label_ur: pkg.tierLabel.ur,
          badge_en: pkg.badge?.en ?? null,
          badge_ur: pkg.badge?.ur ?? null,
          price_per_head: pkg.pricePerHead,
          hall_fee_note_en: pkg.hallFeeNote.en,
          hall_fee_note_ur: pkg.hallFeeNote.ur,
          description_en: pkg.description.en,
          description_ur: pkg.description.ur,
          highlighted: Boolean(pkg.highlighted),
          features_en: pkg.features.map((f) => f.en),
          features_ur: pkg.features.map((f) => f.ur),
          preset_dish_ids: pkg.presetDishIds,
          sort_order: idx,
          updated_at: now,
        }))
      ),
      supabase.from('menu_dishes').upsert(
        MENU_DISHES.map((dish, idx) => ({
          id: dish.id,
          category: dish.category,
          name_en: dish.name.en,
          name_ur: dish.name.ur,
          price_per_head: dish.pricePerHead,
          note_en: dish.note.en,
          note_ur: dish.note.ur,
          sort_order: idx,
          updated_at: now,
        }))
      ),
      supabase.from('gallery_items').upsert(
        GALLERY_ITEMS.map((item, idx) => ({
          id: item.id,
          category: item.category,
          title_en: item.title.en,
          title_ur: item.title.ur,
          caption_en: item.caption.en,
          caption_ur: item.caption.ur,
          image_url: item.image,
          aspect: item.aspect,
          sort_order: idx,
          updated_at: now,
        }))
      ),
      supabase.from('services').upsert(
        SERVICES_DATA.map((svc, idx) => ({
          id: svc.id,
          number: svc.number,
          category_en: svc.category.en,
          category_ur: svc.category.ur,
          title_en: svc.title.en,
          title_ur: svc.title.ur,
          summary_en: svc.summary.en,
          summary_ur: svc.summary.ur,
          description_en: svc.description.en,
          description_ur: svc.description.ur,
          image_url: svc.image,
          features_en: svc.features.map((f) => f.en),
          features_ur: svc.features.map((f) => f.ur),
          sort_order: idx,
          updated_at: now,
        }))
      ),
      supabase.from('hall_specs').upsert(
        HALL_SPECS.map((hall, idx) => ({
          id: hall.id,
          name_en: hall.name.en,
          name_ur: hall.name.ur,
          area_sq_ft: hall.areaSqFt,
          banquet_capacity: hall.banquetCapacity,
          theater_capacity: hall.theaterCapacity,
          bridal_room_en: hall.bridalRoom.en,
          bridal_room_ur: hall.bridalRoom.ur,
          climate_control_en: hall.climateControl.en,
          climate_control_ur: hall.climateControl.ur,
          notes_en: hall.notes.en,
          notes_ur: hall.notes.ur,
          sort_order: idx,
          updated_at: now,
        }))
      ),
      supabase.from('testimonials').upsert(
        TESTIMONIALS.map((rev, idx) => ({
          id: rev.id,
          initials: rev.initials,
          name: rev.name,
          location_event_en: rev.locationEvent.en,
          location_event_ur: rev.locationEvent.ur,
          quote_en: rev.quote.en,
          quote_ur: rev.quote.ur,
          sort_order: idx,
          updated_at: now,
        }))
      ),
      supabase.from('faqs').upsert(
        FAQS.map((faq, idx) => ({
          id: faq.id,
          question_en: faq.question.en,
          question_ur: faq.question.ur,
          answer_en: faq.answer.en,
          answer_ur: faq.answer.ur,
          sort_order: idx,
          updated_at: now,
        }))
      ),
    ]);

    const firstError =
      configRes.error ||
      pkgRes.error ||
      dishRes.error ||
      galRes.error ||
      svcRes.error ||
      hallRes.error ||
      revRes.error ||
      faqRes.error;

    if (firstError) {
      throwSupabaseError(firstError, 'Failed to sync default data to Supabase');
    }

    await refreshFromSupabase();
  };

  const submitBookingInquiry = async (
    payload: Omit<BookingInquiryRecord, 'id' | 'status' | 'createdAt'>
  ) => {
    const id = slugId('inq');
    const { error } = await supabase.from('inquiries').insert({
      id,
      full_name: payload.fullName.trim().slice(0, 120),
      phone: payload.phone.trim().slice(0, 40),
      event_date: payload.eventDate.trim().slice(0, 20),
      event_shift: payload.eventShift,
      event_type: payload.eventType.trim().slice(0, 40),
      gents_count: Math.max(0, Math.min(3000, Number(payload.gentsCount) || 0)),
      ladies_count: Math.max(0, Math.min(3000, Number(payload.ladiesCount) || 0)),
      catering: payload.catering,
      notes: (payload.notes || '').trim().slice(0, 1000),
      status: 'pending',
    });
    if (error) throwSupabaseError(error, 'Failed to submit booking inquiry');
    return id;
  };

  const updateInquiryStatus = async (
    id: string,
    status: BookingInquiryRecord['status'],
    notes?: string
  ) => {
    const updates: Record<string, unknown> = { status };
    if (notes !== undefined) {
      updates.notes = notes.trim().slice(0, 1000);
    }
    const { error } = await supabase.from('inquiries').update(updates).eq('id', id);
    if (error) throwSupabaseError(error, 'Failed to update inquiry');
  };

  const deleteInquiry = async (id: string) => {
    const { error } = await supabase.from('inquiries').delete().eq('id', id);
    if (error) throwSupabaseError(error, 'Failed to delete inquiry');
  };

  return (
    <VenueDataContext.Provider
      value={{
        siteConfig,
        packages,
        menuDishes,
        galleryItems,
        services,
        hallSpecs,
        testimonials,
        faqs,
        whatsappDefaultUrl,
        buildWhatsAppUrl,
        supabaseStatus,
        refreshFromSupabase,
        saveSiteConfig,
        savePackage,
        saveMenuDish,
        deleteMenuDish,
        saveGalleryItem,
        deleteGalleryItem,
        saveService,
        saveHallSpec,
        saveTestimonial,
        deleteTestimonial,
        saveFaq,
        deleteFaq,
        seedDefaultsToSupabase,
        submitBookingInquiry,
        updateInquiryStatus,
        deleteInquiry,
      }}
    >
      {children}
    </VenueDataContext.Provider>
  );
}

export function useVenueData() {
  const ctx = useContext(VenueDataContext);
  if (!ctx) {
    throw new Error('useVenueData must be used within a VenueDataProvider');
  }
  return ctx;
}
