export interface LocalizedText {
  en: string;
  ur: string;
}

export const VENUE_CONTACT = {
  phoneDisplay: '+92 340 9553001',
  phoneRaw: '+923409553001',
  whatsappNumber: '923409553001',
  whatsappDefaultUrl:
    'https://wa.me/923409553001?text=Assalam-o-Alaikum%20Nakreezay%20Shadi%20Hall%2C%20I%20would%20like%20to%20inquire%20about%20a%20wedding%20booking.',
  email: 'bookings@nakreezayshadihall.pk',
  address: {
    en: 'Qamber Bypass Road, Najib Abad, Mingora, Swat Valley, Khyber Pakhtunkhwa, Pakistan',
    ur: 'قمبر بائی پاس روڈ، نجیب آباد، مینگورہ، وادیِ سوات، خیبر پختونخوا، پاکستان',
  },
  shortLocation: {
    en: 'Mingora, Swat',
    ur: 'مینگورہ، سوات',
  },
  visitingHours: {
    en: '10:00 AM – 9:00 PM Daily',
    ur: 'روزانہ صبح 10:00 تا رات 9:00 بجے',
  },
  fridayNote: {
    en: 'Friday timings: Open after Jummah prayer',
    ur: 'جمعہ کے روز نمازِ جمعہ کے بعد کھلا رہتا ہے',
  },
  googleMapsEmbedUrl:
    'https://maps.google.com/maps?q=Qamber+Bypass+Road,+Mingora,+Swat,+Pakistan&t=&z=14&ie=UTF8&iwloc=&output=embed',
};

// Verified visual assets from the workspace Stitch attachment
export const VENUE_IMAGES = {
  heroBanquet:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCSjpHqSET4eWYnObNUXSH66jOjHj2nkRLcpc3Jg_fvUEe-_LEEzN3K10jqS5H8BB0209rgutR7vz6uItS_qV1NBqo3hRQjFMjx2cbmxlpw61QGXXUKj0vR4M6GK9eAHueBt5CIQFd9rBJIv4s7eNpJZo_GQ9zuD9nNNyduR_RDppCbRSew3eE4TLLfmK3ZF5MzAP2Ecr1Kv2rw7SwWlhmkFSBaTDK_qcLzwXKJQRg',
  stageDecor:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDPwAXowdsiwWFIFNa3HiOacVNEhXtBXZzOu33eQGZK64t9h_EbsC9CqI5Wp653rnRElosbFXRsfayC1o8h2YKV7hl32Uc4TUCCrU2ekEhIYY57_uPzOlcUKAx-RXrULtlydJZOtjB5tUJHytBo9YkdUWfMlaAnjXaN_koizcIxnkpzR5OyLugxK1uu541rMyTOGAXyJQFW7EUmJVcVHC9M80oL4xk69vLIp8vXhcc',
  cateringFeast:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBQRV_T1_CllYZqY9RxEDHpjzD4pyRM81Lu5EK0-OIOnDfUzAdBPQ91ztz0LpTRfmsjB7Z3gj8ANrEfEsKis6AwzZrJEqrQP0lbUfgIyIC1wkeYQU1ebUzFQcXGJt0gY2bG3S2LRXX95dDFKUM9zqO_bXqagqp0bPGcVLogwFl0m9MtgZifmHhHmdx3ghKZjmFIEuLP6omh3uA_lgXe94nAc6XcURKITc53aafzErI',
  avLighting:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuD5ToW4YnkOdaD3pfL65KDL8khAm8_1eVoPn474XQptuSi1eC-yZdO6ReGUSN9WS3t_bvaXMzyL2Z-UkByCRpUFsVcDy-bonvNxr9E4F_WqV6aqxIN4p-ryvz6f4HoJ5ZPv2sVI0JgLW5T00bqBW1CXf5Rtu0zEnQPYwyq7Un-hA7RYUTimYCZ_KUbXNloPmSEeklswkMbb2N1jgIMgMpPrdM4H8faKPJ87p4DtflU',
};

export interface HighlightItem {
  id: string;
  icon: 'shield' | 'users' | 'zap' | 'car';
  title: LocalizedText;
  description: LocalizedText;
  meta: LocalizedText;
}

export const VENUE_HIGHLIGHTS: HighlightItem[] = [
  {
    id: 'separate-halls',
    icon: 'shield',
    title: {
      en: 'Separate Gents & Ladies Halls',
      ur: 'مردانہ اور زنانہ کے لیے علیحدہ ہال',
    },
    description: {
      en: 'Dedicated private entrances, sound-isolated partitions, and exclusive bridal waiting suites designed for complete family parda.',
      ur: 'مکمل پردے اور خاندانی وقار کے لیے علیحدہ داخلی راستے، ساؤنڈ پروف پارٹیشن اور پرائیویٹ برائیڈل ویٹنگ رومز۔',
    },
    meta: {
      en: 'Private Entrances · VIP Bridal Rooms',
      ur: 'علیحدہ راستے · وی آئی پی برائیڈل روم',
    },
  },
  {
    id: 'capacity',
    icon: 'users',
    title: {
      en: '200 to 1,200+ Guest Capacity',
      ur: '200 سے 1,200+ مہمانوں کی گنجائش',
    },
    description: {
      en: 'Flexible hall partitioning accommodates intimate family gatherings as effortlessly as grand multi-family Swati wedding banquets.',
      ur: 'ہال کی لچکدار پارٹیشن چھوٹی خاندانی تقریبات سے لے کر سوات کی عظیم الشان شادیوں تک ہر تقریب کے لیے موزوں ہے۔',
    },
    meta: {
      en: 'Modular Seating · Column-Free View',
      ur: 'کشادہ نشستیں · ستونوں کے بغیر ہال',
    },
  },
  {
    id: 'power-climate',
    icon: 'zap',
    title: {
      en: '24/7 Heavy Generator & Climate',
      ur: '24/7 ہیوی جنریٹر اور موسمی کنٹرول',
    },
    description: {
      en: 'Uninterrupted heavy diesel generator backup paired with central winter heating and high-capacity summer chiller air conditioning.',
      ur: 'بلا تعطل ہیوی ڈیزل جنریٹر بیک اپ، سردیوں کے لیے سینٹرل ہیٹنگ اور گرمیوں کے لیے جدید ایئر کنڈیشننگ۔',
    },
    meta: {
      en: 'Winter Heating · Summer Chiller AC',
      ur: 'سردیوں کی ہیٹنگ · گرمیوں کی اے سی',
    },
  },
  {
    id: 'parking',
    icon: 'car',
    title: {
      en: 'Secure Valet & Spacious Parking',
      ur: 'محفوظ والیٹ اور کشادہ پارکنگ',
    },
    description: {
      en: 'Dedicated 150+ vehicle guarded parking compound situated directly off Qamber Bypass Road with zero Mingora city traffic congestion.',
      ur: 'قمبر بائی پاس روڈ پر 150 سے زائد گاڑیوں کی محفوظ پارکنگ، مینگورہ شہر کے ٹریفک رش سے مکمل نجات۔',
    },
    meta: {
      en: '150+ Cars · Direct Bypass Access',
      ur: '150+ گاڑیاں · بائی پاس پر آسان رسائی',
    },
  },
];

export interface ServiceDetail {
  id: string;
  number: string;
  category: LocalizedText;
  title: LocalizedText;
  summary: LocalizedText;
  description: LocalizedText;
  features: LocalizedText[];
  image: string;
  imageFocus?: string;
}

export const SERVICES_DATA: ServiceDetail[] = [
  {
    id: 'banquet-halls',
    number: '01',
    category: {
      en: 'Architecture & Privacy',
      ur: 'تعمیرات اور پردہ داری',
    },
    title: {
      en: 'Luxury Banquet Halls & Partitioning',
      ur: 'لگژری بینکوئٹ ہالز اور پارٹیشننگ',
    },
    summary: {
      en: 'Segregated Gents Hall, Ladies Exclusive Wing, and VIP Bridal Room with acoustic isolation.',
      ur: 'مردانہ ہال، خواتین کا علیحدہ ونگ اور آرام دہ وی آئی پی برائیڈل سویٹ۔',
    },
    description: {
      en: 'Our dual-wing architectural layout ensures dignified privacy for Swat families. The Grand Main Hall and Ladies Exclusive Wing operate with separate covered entrances, dedicated restrooms, and serene VIP bridal suites equipped with vanity lighting and private family seating.',
      ur: 'ہمارا دو حصوں پر مشتمل ڈیزائن سوات کے خاندانوں کے لیے مکمل پردے اور وقار کو یقینی بناتا ہے۔ مین ہال اور لیڈیز ونگ کے علیحدہ داخلی دروازے، واش رومز اور آرام دہ برائیڈل سویٹ موجود ہیں۔',
    },
    features: [
      { en: 'Completely separate Gents & Ladies entrances', ur: 'مردوں اور خواتین کے لیے مکمل طور پر علیحدہ داخلی راستے' },
      { en: 'Sound-insulated movable partitions (200 to 1,200+ guests)', ur: 'ساؤنڈ پروف پارٹیشن کے ساتھ 200 تا 1,200+ مہمانوں کی گنجائش' },
      { en: 'Private VIP Bridal Suite with powder lounge', ur: 'آرام دہ پرائیویٹ وی آئی پی برائیڈل روم اور پاؤڈر لاؤنج' },
    ],
    image: VENUE_IMAGES.heroBanquet,
  },
  {
    id: 'stage-decor',
    number: '02',
    category: {
      en: 'Artisan Scenography',
      ur: 'اسٹیج اور پھولوں کی سجاوٹ',
    },
    title: {
      en: 'Custom Stage, Walkway & Floral Decor',
      ur: 'کسٹم اسٹیج، واک وے اور تازہ پھولوں کی سجاوٹ',
    },
    summary: {
      en: 'Royal gold thrones, fresh rose backdrops, and tailored Barat, Walima, and Mehndi themes.',
      ur: 'بارات، ولیمہ اور مہندی کے لیے شاہی اسٹیج، تازہ گلابوں اور روشن واک وے کی سجاوٹ۔',
    },
    description: {
      en: 'Whether you envision a marigold-and-fairy-light Mehndi courtyard, a regal crimson-and-gold Barat stage, or an ivory-and-emerald Walima backdrop, our in-house floral designers craft bespoke stage installations using fresh Swati jasmine and imported blooms.',
      ur: 'چاہے گیندے کے پھولوں اور روشنیوں سے سجی مہندی ہو، شاہی بارات کا اسٹیج ہو یا ولیمے کا نفیس سفید و سنہری سیٹ اپ، ہمارے ماہر ڈیزائنرز ہر تقریب کو یادگار بناتے ہیں۔',
    },
    features: [
      { en: 'Thematic Barat, Walima & Mehndi stage packages', ur: 'بارات، ولیمہ اور مہندی کے لیے مخصوص تھیم اسٹیج' },
      { en: 'Illuminated bridal walkway with floral pillars', ur: 'پھولوں کے ستونوں اور روشنیوں سے سجا برائیڈل واک وے' },
      { en: 'Coordinated round table centerpieces & chair sashes', ur: 'میزوں کی دلکش سجاوٹ اور نفیس کرسیوں کے کور' },
    ],
    image: VENUE_IMAGES.stageDecor,
  },
  {
    id: 'inhouse-catering',
    number: '03',
    category: {
      en: 'Culinary Excellence',
      ur: 'لذیذ ضیافت اور کیٹرنگ',
    },
    title: {
      en: 'In-House Catering & Traditional Dining',
      ur: 'ان ہاؤس کیٹرنگ اور روایتی سواتی دسترخوان',
    },
    summary: {
      en: 'Live BBQ stations, Kabuli Pulao, Mutton & Chicken Karahi, Seekh Kabab, and Green Qahwa.',
      ur: 'لائیو باربی کیو، قابلی پلاؤ، مٹن و چکن کڑاہی، سیخ کباب اور کشمیری و سبز قہوہ۔',
    },
    description: {
      en: 'Prepared inside our inspected hygienic commercial kitchen by master Swat chefs, every banquet dish is served piping hot simultaneously across all tables—from fragrant Kabuli Pulao and tender Mutton Karahi to live charcoal Seekh Kabab and traditional Peshawari Green Qahwa.',
      ur: 'ہمارے جدید اور صاف ستھرے کمرشل کچن میں سوات کے ماہر باورچیوں کے ہاتھوں تیار کردہ قابلی پلاؤ، مٹن کڑاہی، لائیو سیخ کباب، دیسی میٹھے اور گرما گرم سبز قہوہ تمام مہمانوں کو بیک وقت پیش کیا جاتا ہے۔',
    },
    features: [
      { en: 'Live charcoal BBQ, Seekh Kabab & Malai Boti counters', ur: 'لائیو کوئلہ باربی کیو، سیخ کباب اور ملائی بوٹی کاؤنٹر' },
      { en: 'Signature Kabuli Pulao, Mutton Karahi & Chicken Qorma', ur: 'مخصوص قابلی پلاؤ، مٹن کڑاہی اور چکن قورمہ' },
      { en: 'Artisanal Kheer, Gajar Halwa & complimentary Green Qahwa', ur: 'کھیر، گاجر کا حلوہ، گلاب جامن اور روایتی سبز قہوہ' },
    ],
    image: VENUE_IMAGES.cateringFeast,
  },
  {
    id: 'lighting-sound',
    number: '04',
    category: {
      en: 'Audio & Illumination',
      ur: 'روشنی اور ساؤنڈ سسٹم',
    },
    title: {
      en: 'Chandelier Lighting, Spotlights & Sound System',
      ur: 'فانوس، اسٹیج اسپاٹ لائٹس اور ساؤنڈ سسٹم',
    },
    summary: {
      en: 'Crystal ceiling chandeliers, calibrated stage spotlights, and crystal-clear PA acoustics.',
      ur: 'بلوری فانوس، اسٹیج اسپاٹ لائٹس اور صاف آواز والا جدید ساؤنڈ سسٹم۔',
    },
    description: {
      en: 'Our high-ceilinged halls feature warm crystal chandeliers paired with programmable architectural uplighting and focused stage spotlights for photography and cinematography. Independent audio zones ensure clear Tilawat, speeches, and entry announcements.',
      ur: 'بلند چھتوں پر آویزاں بلوری فانوس، فوٹوگرافی کے لیے اسٹیج اسپاٹ لائٹس اور تلاوت و تقاریر کے لیے بہترین ساؤنڈ سسٹم ہر لمحے کو روشن بناتا ہے۔',
    },
    features: [
      { en: 'Grand crystal chandeliers with dimmable warm ambience', ur: 'شاندار بلوری فانوس اور مدھم و روشن لائٹنگ کنٹرول' },
      { en: 'Dedicated photography spotlights & dry-ice entry ready', ur: 'ویڈیوگرافی کے لیے اسپاٹ لائٹس اور برائیڈل انٹری سیٹ اپ' },
      { en: 'Dual-zone PA sound for Gents & Ladies halls', ur: 'مردانہ اور زنانہ ہال کے لیے علیحدہ ساؤنڈ زونز' },
    ],
    image: VENUE_IMAGES.avLighting,
  },
  {
    id: 'security-valet',
    number: '05',
    category: {
      en: 'Guest Safety & Access',
      ur: 'سیکیورٹی اور والیٹ پارکنگ',
    },
    title: {
      en: 'Uniformed Security & Valet Parking',
      ur: 'تربیت یافتہ سیکیورٹی اور والیٹ پارکنگ',
    },
    summary: {
      en: 'Gated compound security, female security staff for the ladies wing, and attended valet parking.',
      ur: 'محفوظ کمپاؤنڈ، خواتین کے ونگ کے لیے لیڈیز سیکیورٹی اسٹاف اور والیٹ پارکنگ۔',
    },
    description: {
      en: 'Guests enjoy stress-free arrival right off Qamber Bypass Road. Our trained uniformed security team manages compound entry, VIP guest escorting, and organized parking for 150+ cars, complemented by female security personnel exclusively stationed at the Ladies Wing entrance.',
      ur: 'قمبر بائی پاس روڈ پر آسان آمدورفت کے ساتھ ہمارا وردی پوش سیکیورٹی عملہ، 150+ گاڑیوں کی والیٹ پارکنگ اور خواتین کے ونگ کے لیے لیڈیز سیکیورٹی اسٹاف ہمہ وقت موجود رہتا ہے۔',
    },
    features: [
      { en: 'Dedicated female security staff for the Ladies Exclusive Wing', ur: 'خواتین ونگ کے دروازے پر مخصوص لیڈیز سیکیورٹی اسٹاف' },
      { en: '150+ guarded vehicle parking inside gated compound', ur: 'محفوظ گیٹڈ کمپاؤنڈ کے اندر 150 سے زائد گاڑیوں کی پارکنگ' },
      { en: 'CCTV perimeter monitoring & trained traffic marshals', ur: 'سی سی ٹی وی نگرانی اور ٹریفک مارشلز کی سہولت' },
    ],
    image: VENUE_IMAGES.heroBanquet,
    imageFocus: 'object-bottom',
  },
  {
    id: 'corporate-gatherings',
    number: '06',
    category: {
      en: 'Conferences & Milestones',
      ur: 'کارپوریٹ سیمینار اور خاندانی تقریبات',
    },
    title: {
      en: 'Corporate Seminars, Conferences & Gatherings',
      ur: 'کارپوریٹ سیمینارز، کانفرنسز اور دیگر تقریبات',
    },
    summary: {
      en: 'Theater seating up to 1,400, podium AV setup, executive tea breaks, and formal luncheons.',
      ur: 'کانفرنسز، یونیورسٹی تقریبات، عقیقہ اور کارپوریٹ لنچ کے لیے مکمل انتظامات۔',
    },
    description: {
      en: 'Beyond grand weddings, Nakreezay hosts medical symposiums, educational convocations, Jirga receptions, Aqiqah celebrations, and corporate conferences in Mingora with theater-style seating, wireless microphones, and executive refreshment service.',
      ur: 'شادیوں کے علاوہ نقریزے شادی ہال مینگورہ میں میڈیکل سیمینارز، تعلیمی کانووکیشن، جرگہ اجتماعات، عقیقہ اور کارپوریٹ کانفرنسز کے لیے تھیٹر سیٹنگ اور ریفریشمنٹ کی مکمل سہولیات فراہم کرتا ہے۔',
    },
    features: [
      { en: 'Theater & U-shape conference configurations', ur: 'کانفرنس کے لیے تھیٹر اور یو شیپ سیٹنگ کا انتظام' },
      { en: 'High-speed Wi-Fi, projector screens & wireless mics', ur: 'پروجیکٹر اسکرین، وائرلیس مائیکروفونز اور ہائی اسپیڈ وائی فائی' },
      { en: 'Customizable corporate hi-tea & formal lunch menus', ur: 'کارپوریٹ ہائی ٹی اور ظہرانے کے کسٹم مینو' },
    ],
    image: VENUE_IMAGES.avLighting,
    imageFocus: 'object-top',
  },
];

export interface WeddingPackage {
  id: 'silver' | 'gold' | 'platinum';
  name: LocalizedText;
  tierLabel: LocalizedText;
  badge?: LocalizedText;
  pricePerHead: number;
  hallFeeNote: LocalizedText;
  description: LocalizedText;
  highlighted?: boolean;
  features: LocalizedText[];
  presetDishIds: string[];
}

export const WEDDING_PACKAGES: WeddingPackage[] = [
  {
    id: 'silver',
    name: {
      en: 'Silver Celebration',
      ur: 'سلور سیلیبریشن پیکیج',
    },
    tierLabel: {
      en: 'Essential Elegance',
      ur: 'معیاری اور نفیس',
    },
    pricePerHead: 1650,
    hallFeeNote: {
      en: 'Includes Hall Hire & Service Staff (Min. 250 Guests)',
      ur: 'ہال کرایہ اور سروس اسٹاف شامل ہے (کم از کم 250 مہمان)',
    },
    description: {
      en: 'Dignified hospitality and classic Swati dining designed for intimate Valima, Engagement, and family receptions.',
      ur: 'ولیمہ، منگنی اور خاندانی تقریبات کے لیے باوقار مہمان نوازی اور کلاسک سواتی ضیافت۔',
    },
    features: [
      { en: 'Separate Gents & Ladies halls with acoustic partition', ur: 'مردانہ و زنانہ علیحدہ ہال مع ساؤنڈ پروف پارٹیشن' },
      { en: 'Standard floral stage backdrop & crisp ivory linens', ur: 'اسٹیج کی خوبصورت سجاوٹ اور نفیس میز پوش' },
      { en: '4-Dish Classic Menu (Chicken Biryani, Chicken Qorma, Naan, Salad/Raita)', ur: '4 ڈشز کا کلاسک مینو (چکن بریانی، چکن قورمہ، نان، سلاد و رائتہ)' },
      { en: 'Kheer dessert & Green Qahwa service', ur: 'مزیدار کھیر اور روایتی سبز قہوہ کی سروس' },
      { en: 'Heavy generator backup & seasonal climate control', ur: 'جنریٹر بیک اپ اور موسمی ہیٹنگ / اے سی' },
      { en: 'Guarded parking compound off Qamber Bypass', ur: 'قمبر بائی پاس پر محفوظ پارکنگ کمپاؤنڈ' },
    ],
    presetDishIds: ['chicken-biryani', 'chicken-qorma', 'fresh-salad', 'mint-raita', 'roghni-naan', 'kheer', 'green-qahwa'],
  },
  {
    id: 'gold',
    name: {
      en: 'Royal Gold',
      ur: 'رائل گولڈ پیکیج',
    },
    tierLabel: {
      en: 'Signature Experience',
      ur: 'سگنیچر پیکیج',
    },
    badge: {
      en: 'Most Popular',
      ur: 'سب سے زیادہ مقبول',
    },
    pricePerHead: 2450,
    hallFeeNote: {
      en: 'All-Inclusive Hall, Decor & Banquet Service',
      ur: 'ہال، اسٹیج ڈیکور اور مکمل کیٹرنگ شامل ہے',
    },
    description: {
      en: 'Our signature Swat wedding experience balancing opulent floral staging, VIP bridal comfort, and a rich 7-item banquet.',
      ur: 'سوات کی شاندار شادیوں کے لیے ہمارا مقبول ترین پیکیج، جس میں لگژری اسٹیج، برائیڈل روم اور 7 ڈشز کی شاہی ضیافت شامل ہے۔',
    },
    highlighted: true,
    features: [
      { en: 'Luxury velvet bridal throne & fresh floral stage canopy', ur: 'تازہ پھولوں سے سجا شاہی اسٹیج اور ویلویٹ برائیڈل صوفہ' },
      { en: 'Private VIP Bridal Suite with attached powder room', ur: 'خواتین ونگ میں پرائیویٹ وی آئی پی برائیڈل روم' },
      { en: '7-Item Feast (Kabuli Pulao, Mutton Karahi, Seekh Kabab, Sides)', ur: '7 ڈشز کی شاہی ضیافت (قابلی پلاؤ، مٹن کڑاہی، سیخ کباب، لوازمات)' },
      { en: 'Gajar Halwa & Kheer dual dessert spread + Cold Drinks & Qahwa', ur: 'گاجر کا حلوہ اور کھیر، کولڈ ڈرنکس اور گرما گرم سبز قہوہ' },
      { en: 'Dedicated floor manager, female security & valet attendants', ur: 'مخصوص ایونٹ مینیجر، لیڈیز سیکیورٹی اور والیٹ پارکنگ' },
      { en: 'Stage spotlights & dual-zone hall sound system', ur: 'اسٹیج اسپاٹ لائٹس اور ڈوئل زون ساؤنڈ سسٹم' },
    ],
    presetDishIds: [
      'kabuli-pulao',
      'mutton-karahi',
      'seekh-kabab',
      'fresh-salad',
      'mint-raita',
      'roghni-naan',
      'kheer',
      'gajar-halwa',
      'green-qahwa',
      'cold-drinks',
    ],
  },
  {
    id: 'platinum',
    name: {
      en: 'Grand Platinum',
      ur: 'گرینڈ پلاٹینم پیکیج',
    },
    tierLabel: {
      en: 'Imperial Bespoke',
      ur: 'شاہی اور وی آئی پی',
    },
    pricePerHead: 3350,
    hallFeeNote: {
      en: 'Full Complex Priority & Custom Decor Architecture',
      ur: 'مکمل کمپلیکس ترجیح اور کسٹم ڈیزائنر ڈیکور',
    },
    description: {
      en: 'Unmatched grandeur for high-profile Barats and multi-family receptions featuring live BBQ stations and designer walkways.',
      ur: 'بڑی بارات اور خصوصی تقریبات کے لیے بے مثال شان و شوکت، لائیو باربی کیو اور ڈیزائنر واک وے کے ساتھ۔',
    },
    features: [
      { en: 'Custom designer floral stage, ceiling drapes & lit bridal walkway', ur: 'کسٹم ڈیزائنر پھولوں کا اسٹیج اور روشن برائیڈل واک وے' },
      { en: 'Full Imperial Menu (Kabuli Pulao, Mutton Karahi, White Karahi, Live BBQ)', ur: 'مکمل شاہی مینو (قابلی پلاؤ، مٹن و وائٹ کڑاہی، لائیو سیخ کباب و ملائی بوٹی)' },
      { en: 'Triple Dessert Trio (Kheer, Gajar Halwa, Hot Gulab Jamun)', ur: 'تین شاہی میٹھے (کھیر، گاجر کا حلوہ اور گرما گرم گلاب جامن)' },
      { en: 'Gents VIP Majlis Lounge & Bridal Suite with dedicated attendant', ur: 'مہمانانِ خصوصی کے لیے وی آئی پی لاؤنج اور برائیڈل سویٹ' },
      { en: 'Cold sparkler walkway entry & cinematography spotlight rigging', ur: 'کولڈ اسپارکلر انٹری اور فوٹوگرافی اسپاٹ لائٹس' },
      { en: 'Priority valet lane & dedicated VIP security detail', ur: 'ترجیحی والیٹ لین اور خصوصی سیکیورٹی پروٹوکول' },
    ],
    presetDishIds: [
      'kabuli-pulao',
      'chicken-biryani',
      'mutton-karahi',
      'chicken-white-karahi',
      'seekh-kabab',
      'malai-boti',
      'fresh-salad',
      'mint-raita',
      'roghni-naan',
      'kheer',
      'gajar-halwa',
      'gulab-jamun',
      'green-qahwa',
      'cold-drinks',
    ],
  },
];

export type MenuCategoryId = 'rice' | 'curry' | 'bbq' | 'sides' | 'desserts' | 'drinks';

export interface MenuDish {
  id: string;
  category: MenuCategoryId;
  name: LocalizedText;
  pricePerHead: number;
  note: LocalizedText;
}

export const MENU_CATEGORIES: { id: MenuCategoryId; label: LocalizedText }[] = [
  { id: 'rice', label: { en: 'Rice Specialties', ur: 'چاول کی ڈشز' } },
  { id: 'curry', label: { en: 'Main Curries', ur: 'مین کڑاہی اور قورمہ' } },
  { id: 'bbq', label: { en: 'Live Charcoal BBQ', ur: 'لائیو باربی کیو' } },
  { id: 'sides', label: { en: 'Accompaniments & Naan', ur: 'لوازمات اور نان' } },
  { id: 'desserts', label: { en: 'Traditional Desserts', ur: 'روایتی میٹھے' } },
  { id: 'drinks', label: { en: 'Beverages & Qahwa', ur: 'مشروبات اور قہوہ' } },
];

export const MENU_DISHES: MenuDish[] = [
  // Rice
  {
    id: 'kabuli-pulao',
    category: 'rice',
    name: { en: 'Kabuli Pulao', ur: 'قابلی پلاؤ (بادام و کشمش)' },
    pricePerHead: 420,
    note: { en: 'Sella basmati with caramelized carrots & raisins', ur: 'بادام، کشمش اور گاجر کے ساتھ' },
  },
  {
    id: 'chicken-biryani',
    category: 'rice',
    name: { en: 'Chicken Biryani', ur: 'چکن بریانی' },
    pricePerHead: 320,
    note: { en: 'Fragrant spiced Sindhi-style layered biryani', ur: 'خوشبودار مصالحہ دار تہہ والی بریانی' },
  },
  // Main Curry
  {
    id: 'mutton-karahi',
    category: 'curry',
    name: { en: 'Mutton Karahi', ur: 'مٹن کڑاہی (تازہ ذبح شدہ)' },
    pricePerHead: 780,
    note: { en: 'Fresh Swat valley mutton cooked with tomatoes & ginger', ur: 'وادیِ سوات کے تازہ گوشت سے تیار' },
  },
  {
    id: 'chicken-white-karahi',
    category: 'curry',
    name: { en: 'Chicken White Karahi', ur: 'چکن وائٹ کڑاہی' },
    pricePerHead: 440,
    note: { en: 'Creamy yogurt, crushed black pepper & green chili', ur: 'کریم، دہی اور کالی مرچ کے ساتھ' },
  },
  {
    id: 'chicken-qorma',
    category: 'curry',
    name: { en: 'Shahi Chicken Qorma', ur: 'شاہی چکن قورمہ' },
    pricePerHead: 390,
    note: { en: 'Slow-braised traditional wedding qorma', ur: 'روایتی شادی کا دیگی قورمہ' },
  },
  // BBQ
  {
    id: 'seekh-kabab',
    category: 'bbq',
    name: { en: 'Chicken Seekh Kabab', ur: 'چکن سیخ کباب' },
    pricePerHead: 340,
    note: { en: 'Charcoal-grilled live on skewers', ur: 'کوئلوں پر تازہ تیار کردہ' },
  },
  {
    id: 'malai-boti',
    category: 'bbq',
    name: { en: 'Chicken Malai Boti', ur: 'چکن ملائی بوٹی' },
    pricePerHead: 380,
    note: { en: 'Tender cream-marinated boneless cubes', ur: 'نرم و ملائم کریم میں میرینیٹ شدہ' },
  },
  // Sides
  {
    id: 'fresh-salad',
    category: 'sides',
    name: { en: 'Fresh Garden Salad', ur: 'تازہ گارڈن سلاد' },
    pricePerHead: 70,
    note: { en: 'Seasonal Swat greens, cucumber, onion & lemon', ur: 'کھیرا، ٹماٹر، پیاز اور موسمی سبزیاں' },
  },
  {
    id: 'mint-raita',
    category: 'sides',
    name: { en: 'Mint Raita', ur: 'پودینہ رائتہ' },
    pricePerHead: 60,
    note: { en: 'Chilled yogurt blended with fresh garden mint', ur: 'تازہ پودینے اور دہی کا رائتہ' },
  },
  {
    id: 'roghni-naan',
    category: 'sides',
    name: { en: 'Roghni Naan (Tandoori)', ur: 'تندوری روغنی نان' },
    pricePerHead: 90,
    note: { en: 'Sesame-topped buttered tandoori naan', ur: 'تل اور مکھن لگے گرما گرم نان' },
  },
  // Desserts
  {
    id: 'kheer',
    category: 'desserts',
    name: { en: 'Badami Kheer', ur: 'بادامی کھیر' },
    pricePerHead: 160,
    note: { en: 'Slow-simmered milk pudding topped with pistachios', ur: 'پستے اور بادام سے سجی کھیر' },
  },
  {
    id: 'gajar-halwa',
    category: 'desserts',
    name: { en: 'Desi Ghee Gajar Halwa', ur: 'دیسی گھی گاجر کا حلوہ' },
    pricePerHead: 210,
    note: { en: 'Rich khoya & almond winter delicacy', ur: 'خوئے اور بادام سے بھرپور' },
  },
  {
    id: 'gulab-jamun',
    category: 'desserts',
    name: { en: 'Hot Gulab Jamun', ur: 'گرما گرم گلاب جامن' },
    pricePerHead: 170,
    note: { en: 'Warm cardamom syrup-soaked milk dumplings', ur: 'الائچی کے شیرے میں ڈوبے تازہ گلاب جامن' },
  },
  // Drinks
  {
    id: 'green-qahwa',
    category: 'drinks',
    name: { en: 'Peshawari Green Qahwa', ur: 'پشاوری سبز قہوہ (الائچی)' },
    pricePerHead: 65,
    note: { en: 'Cardamom & lemon digestive tea served hot', ur: 'الائچی اور لیموں کے ساتھ گرما گرم قہوہ' },
  },
  {
    id: 'cold-drinks',
    category: 'drinks',
    name: { en: 'Assorted Cold Drinks & Water', ur: 'کولڈ ڈرنکس اور منرل واٹر' },
    pricePerHead: 110,
    note: { en: 'Chilled branded soft drinks & sealed mineral water', ur: 'ٹھنڈے مشروبات اور سیلڈ منرل واٹر' },
  },
];

export const HALL_BASE_VENUE_PER_HEAD = 450; // Covers hall, seating, crockery, generator, security & service staff

export interface HallSpec {
  id: string;
  name: LocalizedText;
  areaSqFt: string;
  banquetCapacity: string;
  theaterCapacity: string;
  bridalRoom: LocalizedText;
  climateControl: LocalizedText;
  notes: LocalizedText;
}

export const HALL_SPECS: HallSpec[] = [
  {
    id: 'grand-main-hall',
    name: {
      en: 'Grand Main Hall (Gents / Combined)',
      ur: 'گرینڈ مین ہال (مردانہ / مشترکہ)',
    },
    areaSqFt: '11,500 sq ft',
    banquetCapacity: '850 Guests',
    theaterCapacity: '1,200+ Guests',
    bridalRoom: {
      en: 'VIP Groom & Family Lounge',
      ur: 'وی آئی پی دولہا اور فیملی لاؤنج',
    },
    climateControl: {
      en: 'Dual Chiller AC + Central Heating',
      ur: 'ڈوئل چلر اے سی + سینٹرل ہیٹنگ',
    },
    notes: {
      en: 'Column-free span with crystal chandeliers',
      ur: 'ستونوں کے بغیر کشادہ ہال اور بلوری فانوس',
    },
  },
  {
    id: 'ladies-wing',
    name: {
      en: 'Ladies Exclusive Wing',
      ur: 'خواتین کا خصوصی ونگ',
    },
    areaSqFt: '6,800 sq ft',
    banquetCapacity: '450 Guests',
    theaterCapacity: '600 Guests',
    bridalRoom: {
      en: 'Private VIP Bridal Suite & Powder Room',
      ur: 'پرائیویٹ وی آئی پی برائیڈل سویٹ',
    },
    climateControl: {
      en: 'Independent AC + Winter Heating',
      ur: 'علیحدہ اے سی + سردیوں کی ہیٹنگ',
    },
    notes: {
      en: 'Separate gated entrance & female security',
      ur: 'علیحدہ داخلی دروازہ اور لیڈیز سیکیورٹی',
    },
  },
  {
    id: 'outdoor-marquee',
    name: {
      en: 'Outdoor Courtyard Marquee',
      ur: 'آؤٹ ڈور لان اور مارکی',
    },
    areaSqFt: '9,200 sq ft',
    banquetCapacity: '650 Guests',
    theaterCapacity: '850 Guests',
    bridalRoom: {
      en: 'Adjacent Suites Available',
      ur: 'ملحقہ وی آئی پی کمرے دستیاب',
    },
    climateControl: {
      en: 'Open-Air Breeze / Patio Heaters',
      ur: 'قدرتی ہوا / پیٹیو ہیٹرز',
    },
    notes: {
      en: 'Ideal for Mehndi nights & spring daytime receptions',
      ur: 'مہندی کی تقریبات اور بہار کے دن کے فنکشنز کے لیے بہترین',
    },
  },
];

export type GalleryCategory =
  | 'All'
  | 'Barat Stages'
  | 'Walima Decor'
  | 'Mehndi Nights'
  | 'Dining Setup'
  | 'Exterior & Parking';

export interface GalleryItem {
  id: string;
  category: Exclude<GalleryCategory, 'All'>;
  title: LocalizedText;
  caption: LocalizedText;
  image: string;
  aspect: 'tall' | 'wide' | 'square';
  tintClass?: string;
}

export const GALLERY_CATEGORIES: { id: GalleryCategory; label: LocalizedText }[] = [
  { id: 'All', label: { en: 'All', ur: 'تمام تصاویر' } },
  { id: 'Barat Stages', label: { en: 'Barat Stages', ur: 'بارات اسٹیج' } },
  { id: 'Walima Decor', label: { en: 'Walima Decor', ur: 'ولیمہ ڈیکور' } },
  { id: 'Mehndi Nights', label: { en: 'Mehndi Nights', ur: 'مہندی نائٹس' } },
  { id: 'Dining Setup', label: { en: 'Dining Setup', ur: 'ڈائننگ سیٹ اپ' } },
  { id: 'Exterior & Parking', label: { en: 'Exterior & Parking', ur: 'بیرونی منظر اور پارکنگ' } },
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gal-1',
    category: 'Barat Stages',
    title: { en: 'Royal Gold & White Rose Barat Stage', ur: 'شاہی سنہری اور سفید گلابوں کا بارات اسٹیج' },
    caption: {
      en: 'Custom carved throne seating beneath cascading jasmine and chandelier lighting in the Grand Hall.',
      ur: 'گرینڈ ہال میں فانوس کی روشنی اور تازہ پھولوں کے درمیان شاہی بارات اسٹیج۔',
    },
    image: VENUE_IMAGES.stageDecor,
    aspect: 'tall',
  },
  {
    id: 'gal-2',
    category: 'Walima Decor',
    title: { en: 'Crystal Chandelier Main Banquet Hall', ur: 'بلوری فانوسوں سے مزین مین بینکوئٹ ہال' },
    caption: {
      en: 'Column-free emerald and ivory seating setup prepared for an 850-guest Mingora Walima reception.',
      ur: '850 مہمانوں کے ولیمے کے لیے ستونوں کے بغیر کشادہ بینکوئٹ ہال۔',
    },
    image: VENUE_IMAGES.heroBanquet,
    aspect: 'wide',
  },
  {
    id: 'gal-3',
    category: 'Dining Setup',
    title: { en: 'Traditional Swati Feast & Live Copper Deghs', ur: 'روایتی سواتی ضیافت اور تانبے کی دیگیں' },
    caption: {
      en: 'Steaming Kabuli Pulao, Mutton Rosh, and charcoal-grilled BBQ served hot to round banquet tables.',
      ur: 'قابلی پلاؤ، مٹن روش اور کوئلہ باربی کیو کی گرما گرم سروس۔',
    },
    image: VENUE_IMAGES.cateringFeast,
    aspect: 'square',
  },
  {
    id: 'gal-4',
    category: 'Mehndi Nights',
    title: { en: 'Illuminated Mehndi Walkway & Stage Lighting', ur: 'روشن مہندی واک وے اور اسٹیج لائٹنگ' },
    caption: {
      en: 'Warm amber spotlights, moving head beams, and atmospheric dry-ice bridal entry setup.',
      ur: 'خوبصورت اسپاٹ لائٹس اور ڈرائی آئس برائیڈل انٹری کا انتظام۔',
    },
    image: VENUE_IMAGES.avLighting,
    aspect: 'tall',
  },
  {
    id: 'gal-5',
    category: 'Walima Decor',
    title: { en: 'Ivory & Champagne Table Centerpieces', ur: 'آئیوری اور سنہری میزوں کی آرائش' },
    caption: {
      en: 'Fresh floral centerpieces paired with polished silverware and crisp pressed ivory table linens.',
      ur: 'تازہ پھولوں کے گلدستے اور نفیس کراکری کے ساتھ سجی میزیں۔',
    },
    image: VENUE_IMAGES.stageDecor,
    aspect: 'square',
    tintClass: 'brightness-95 contrast-105',
  },
  {
    id: 'gal-6',
    category: 'Exterior & Parking',
    title: { en: 'Qamber Bypass Grand Facade & Valet Compound', ur: 'قمبر بائی پاس کا شاندار بیرونی منظر اور پارکنگ' },
    caption: {
      en: 'Illuminated evening entrance directly off Qamber Bypass Road with 150+ guarded parking bays.',
      ur: 'قمبر بائی پاس روڈ پر روشن داخلی گیٹ اور 150+ گاڑیوں کی محفوظ پارکنگ۔',
    },
    image: VENUE_IMAGES.heroBanquet,
    aspect: 'wide',
    tintClass: 'sepia-[.12]',
  },
  {
    id: 'gal-7',
    category: 'Dining Setup',
    title: { en: 'VIP Family Dining & Silverware Service', ur: 'وی آئی پی فیملی ڈائننگ اور سلور ویئر سروس' },
    caption: {
      en: 'Synchronized table service managed by uniformed banquet stewards for effortless dining.',
      ur: 'وردی پوش ویٹرز کے ذریعے تمام میزوں پر بیک وقت کھانے کی پیشکش۔',
    },
    image: VENUE_IMAGES.cateringFeast,
    aspect: 'tall',
    tintClass: 'contrast-105',
  },
  {
    id: 'gal-8',
    category: 'Mehndi Nights',
    title: { en: 'Musical Acoustic & Spotlight Rigging', ur: 'ساؤنڈ اور رنگا رنگ اسپاٹ لائٹس' },
    caption: {
      en: 'Concert-grade speaker arrays and calibrated color washes for vibrant Mehndi & Dholak evenings.',
      ur: 'مہندی اور ڈھولک کی رنگین شاموں کے لیے جدید ساؤنڈ اور لائٹنگ۔',
    },
    image: VENUE_IMAGES.avLighting,
    aspect: 'wide',
  },
];

export interface TestimonialItem {
  id: string;
  initials: string;
  name: string;
  locationEvent: LocalizedText;
  quote: LocalizedText;
}

export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 't1',
    initials: 'TK',
    name: 'Dr. Tariq Khan',
    locationEvent: {
      en: 'Saidu Sharif · Barat (900 Guests)',
      ur: 'سیدو شریف · بارات (900 مہمان)',
    },
    quote: {
      en: 'We hosted our son’s Barat with over 900 guests from across Malakand and Peshawar. The parda separation between the gents’ and ladies’ halls was immaculate, and guests arrived effortlessly via Qamber Bypass without Mingora city traffic.',
      ur: 'ہم نے اپنے بیٹے کی بارات میں 900 سے زائد مہمانوں کی میزبانی کی۔ مردانہ اور زنانہ ہال کا پردہ انتہائی شاندار تھا اور قمبر بائی پاس کی وجہ سے مہمان ٹریفک کے بغیر باآسانی پہنچے۔',
    },
  },
  {
    id: 't2',
    initials: 'JS',
    name: 'Engr. Jibran Swati',
    locationEvent: {
      en: 'Mingora · Walima (650 Guests)',
      ur: 'مینگورہ · ولیمہ (650 مہمان)',
    },
    quote: {
      en: 'The Mutton Karahi, Kabuli Pulao, and live BBQ were praised for weeks after our Walima reception. Food was served piping hot to every table simultaneously, and the heavy backup generator kept the winter heating seamless.',
      ur: 'ولیمے کے کھانے میں مٹن کڑاہی، قابلی پلاؤ اور لائیو باربی کیو کی تعریف ہفتوں تک ہوتی رہی۔ ہر میز پر کھانا بیک وقت اور گرما گرم پیش کیا گیا۔',
    },
  },
  {
    id: 't3',
    initials: 'SA',
    name: 'Haji Sardar Ali',
    locationEvent: {
      en: 'Matta, Swat · Barat (800 Guests)',
      ur: 'مٹہ، سوات · بارات (800 مہمان)',
    },
    quote: {
      en: 'Nakreezay’s stage floral work matched the finest venues in Islamabad right here in Swat Valley. The private bridal suite gave our family complete comfort and tranquility before the rukhsati.',
      ur: 'نقریزے کا اسٹیج اور پھولوں کا کام اسلام آباد کے بہترین ہالز جیسا تھا۔ رخصتی سے پہلے پرائیویٹ برائیڈل سویٹ نے ہمارے خاندان کو مکمل سکون فراہم کیا۔',
    },
  },
  {
    id: 't4',
    initials: 'AZ',
    name: 'Advocate Zubair Ahmad',
    locationEvent: {
      en: 'Kabal, Swat · Walima & Dinner (500 Guests)',
      ur: 'کبل، سوات · ولیمہ (500 مہمان)',
    },
    quote: {
      en: 'Having 150+ guarded parking spaces directly on Qamber Bypass Road made hosting out-of-town relatives effortless. Transparent per-head pricing with zero hidden charges at settlement.',
      ur: 'قمبر بائی پاس پر 150 سے زائد محفوظ پارکنگ نے دور دراز سے آئے مہمانوں کے لیے بے حد آسانی پیدا کی۔ فی کس ریٹ بالکل شفاف اور معاہدے کے مطابق رہے۔',
    },
  },
];

export interface FaqItem {
  id: string;
  question: LocalizedText;
  answer: LocalizedText;
}

export const FAQS: FaqItem[] = [
  {
    id: 'faq-1',
    question: {
      en: 'What is your advance payment and date reservation policy?',
      ur: 'ایڈوانس ادائیگی اور تاریخ بکنگ کی پالیسی کیا ہے؟',
    },
    answer: {
      en: 'A 25% booking deposit secures your selected date and time shift (Day Lunch or Night Dinner). Another 50% is settled 14 days prior to the event once final guest counts are locked, with the remaining 25% balance cleared 24 hours before the ceremony.',
      ur: 'آپ کی منتخب تاریخ اور شفٹ (دوپہر یا رات) محفوظ کرنے کے لیے 25 فیصد ایڈوانس جمع کرانا ہوتا ہے۔ تقریب سے 14 دن قبل مہمانوں کی حتمی تعداد طے ہونے پر 50 فیصد اور تقریب سے 24 گھنٹے قبل بقیہ 25 فیصد ادائیگی کی جاتی ہے۔',
    },
  },
  {
    id: 'faq-2',
    question: {
      en: 'Do you allow outside catering, or is catering strictly in-house?',
      ur: 'کیا باہر سے کیٹرنگ لانے کی اجازت ہے یا کھانا صرف ہال کا ہوتا ہے؟',
    },
    answer: {
      en: 'We offer both flexible options: our signature Per-Head In-House Catering prepared by Swat master chefs, or a Hall-Only rental option for families bringing traditional family chefs, subject to our kitchen hygiene and timing guidelines.',
      ur: 'ہمارے پاس دونوں سہولیات موجود ہیں: آپ ہمارے ماہر باورچیوں کی فی کس ان ہاؤس کیٹرنگ منتخب کر سکتے ہیں، یا ہال اونلی بکنگ کے ساتھ اپنے خاندانی باورچی لا سکتے ہیں۔',
    },
  },
  {
    id: 'faq-3',
    question: {
      en: 'Are the Gents and Ladies entrances and halls completely separate?',
      ur: 'کیا مردانہ اور زنانہ ہال اور ان کے داخلی راستے مکمل طور پر علیحدہ ہیں؟',
    },
    answer: {
      en: 'Yes, 100%. The Ladies Exclusive Wing has its own sheltered gated entrance, dedicated female security staff, private restrooms, and an enclosed VIP bridal room completely screened from the Gents Hall.',
      ur: 'جی ہاں، 100 فیصد۔ خواتین کے ونگ کا داخلی دروازہ، لیڈیز سیکیورٹی اسٹاف، واش رومز اور وی آئی پی برائیڈل روم مردانہ ہال سے مکمل طور پر علیحدہ اور باپردہ ہیں۔',
    },
  },
  {
    id: 'faq-4',
    question: {
      en: 'How is heating and backup power handled during Swat winters?',
      ur: 'سوات کی سردیوں میں ہیٹنگ اور بجلی کے بیک اپ کا کیا انتظام ہے؟',
    },
    answer: {
      en: 'Both halls are equipped with central winter heating systems and heavy-duty 250kVA diesel standby generators that switch on automatically within seconds—guaranteeing uninterrupted warmth, lighting, and sound regardless of grid outages.',
      ur: 'دونوں ہالز میں سینٹرل ونٹر ہیٹنگ سسٹم اور 250 کے وی اے ہیوی ڈیزل جنریٹرز نصب ہیں جو لوڈشیڈنگ کی صورت میں فوراً آن ہو کر بلا تعطل گرمائش اور روشنی فراہم کرتے ہیں۔',
    },
  },
  {
    id: 'faq-5',
    question: {
      en: 'How many vehicles can your parking compound accommodate?',
      ur: 'آپ کی پارکنگ میں کتنی گاڑیوں کی گنجائش ہے؟',
    },
    answer: {
      en: 'Our walled, floodlit parking compound directly off Qamber Bypass Road accommodates over 150+ cars and SUVs with uniformed valet marshals, ensuring guests never park on busy Mingora streets.',
      ur: 'قمبر بائی پاس روڈ پر واقع ہمارے محفوظ اور روشن کمپاؤنڈ میں 150 سے زائد گاڑیوں کی پارکنگ اور والیٹ عملہ موجود ہے تاکہ مہمانوں کو سڑک پر گاڑی کھڑی نہ کرنی پڑے۔',
    },
  },
];
