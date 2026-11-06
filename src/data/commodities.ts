import { Commodity } from '../types';

export const COMMODITIES: Commodity[] = [
  {
    id: 'cabai-rawit-merah',
    name: 'Cabai Rawit Merah (Ori 212 / Kaliber)',
    scientificName: 'Capsicum frutescens',
    category: 'hortikultura',
    categoryLabel: 'Hortikultura Sayur',
    cycleDays: 120,
    optimalAltitude: '0 - 1.200 mdpl',
    waterRequirement: 'Sedang',
    riskLevel: 'Sedang',
    suitableSeason: 'Kemarau',
    avgCapexPer1000m2: 12500000,
    avgOpexPerCycle: 9800000,
    defaultYieldKgPer1000m2: 1200,
    defaultPricePerKg: 38000,
    priceRange: { min: 22000, max: 85000, avg: 38000 },
    image: '/src/assets/images/crop_cabai_rawit_1793888690231.jpg',
    description: 'Komoditas primadona agribisnis Indonesia dengan potensi margin sangat tinggi. Panen dapat dilakukan 15-20 kali petik selama masa produktif.',
    keyAdvantages: [
      'Panen berulang mingguan selama 3-4 bulan',
      'Permintaan pasar harian tidak pernah surut',
      'Harga sering melesat tajam di hari raya / cuaca basah'
    ],
    keyRisks: [
      'Penyakit Antraknosa (patek) dan Virus Kuning (Gemini)',
      'Fluktuasi harga pasar yang volatil antar musim',
      'Sensitif terhadap genangan air berlebih'
    ],
    targetMarkets: ['Pasar Induk Sayur', 'Industri Sambal Olahan', 'Restoran & UMKM Kuliner'],
    tags: ['sayur', 'pedas', 'panen berulang', 'pasar induk', 'fluktuatif', 'komoditas inflasi', 'populer']
  },
  {
    id: 'cabai-merah-keriting',
    name: 'Cabai Merah Keriting (Lado F1 / Kastilo)',
    scientificName: 'Capsicum annuum',
    category: 'hortikultura',
    categoryLabel: 'Hortikultura Sayur',
    cycleDays: 110,
    optimalAltitude: '300 - 1.400 mdpl',
    waterRequirement: 'Sedang',
    riskLevel: 'Sedang',
    suitableSeason: 'Kemarau',
    avgCapexPer1000m2: 13000000,
    avgOpexPerCycle: 10500000,
    defaultYieldKgPer1000m2: 1400,
    defaultPricePerKg: 35000,
    priceRange: { min: 18000, max: 70000, avg: 35000 },
    image: '/src/assets/images/crop_cabai_rawit_1793888690231.jpg',
    description: 'Bahan baku utama bumbu dapur nusantara dengan bentuk panjang ramping bergelombang. Daya tahan transportasi antar pulau sangat baik.',
    keyAdvantages: [
      'Bobot buah per pohon tinggi (0.8 - 1.2 kg/pohon)',
      'Bisa dipetik saat merah merata atau merah semburat',
      'Serapan industri bumbu instan dan katering sangat tinggi'
    ],
    keyRisks: [
      'Layu bakteri Pseudomonas dan layu fusarium',
      'Serangan lalat buah pada fase buah matang',
      'Kelembapan tinggi di musim penghujan memicu rontok bunga'
    ],
    targetMarkets: ['Pasar Induk Kramat Jati', 'Pabrik Pengolahan Pasta Cabai', 'Katering & Horeka'],
    tags: ['sayur', 'bumbu dapur', 'keriting', 'horeka', 'panen berulang', 'hortikultura']
  },
  {
    id: 'melon-golden-greenhouse',
    name: 'Melon Golden Hidroponik (Inthanon / Alisha)',
    scientificName: 'Cucumis melo var. reticulatus',
    category: 'hidroponik',
    categoryLabel: 'Hidroponik Modern',
    cycleDays: 70,
    optimalAltitude: '200 - 800 mdpl',
    waterRequirement: 'Sedang',
    riskLevel: 'Rendah',
    suitableSeason: 'Sepanjang Tahun',
    avgCapexPer1000m2: 38000000,
    avgOpexPerCycle: 14500000,
    defaultYieldKgPer1000m2: 2400,
    defaultPricePerKg: 28000,
    priceRange: { min: 22000, max: 40000, avg: 28000 },
    image: '/src/assets/images/crop_melon_golden_1793888691358.jpg',
    description: 'Model agribisnis presisi bernilai tambah tinggi. Tingkat kemanisan (Brix 13-15%) stabil dan terlindung dari cuaca ekstrem berkat greenhouse.',
    keyAdvantages: [
      'Harga jual stabil dan terikat kontrak horeka/supermarket',
      'Siklus cepat hanya 70 hari dengan perputaran modal kilat',
      'Kualitas fisik buah mulus berharga premium (Grade A)'
    ],
    keyRisks: [
      'Investasi modal awal (Greenhouse & Fertigasi) relatif tinggi',
      'Membutuhkan kedisiplinan kontrol EC & pH nutrisi harian',
      'Hama thrips dan tungau jika insect net bocor'
    ],
    targetMarkets: ['Supermarket Modern (Ranch, Hero, Papaya)', 'Hotel & Kafe Premium', 'Wisata Edukasi Petik Buah'],
    tags: ['buah premium', 'hidroponik', 'greenhouse', 'fertigasi', 'brix tinggi', 'supermarket', 'kontrak tani']
  },
  {
    id: 'bawang-merah-brebes',
    name: 'Bawang Merah (Bima Brebes / Tajuk)',
    scientificName: 'Allium cepa var. ascalonicum',
    category: 'hortikultura',
    categoryLabel: 'Hortikultura Sayur',
    cycleDays: 60,
    optimalAltitude: '0 - 450 mdpl',
    waterRequirement: 'Sedang',
    riskLevel: 'Sedang',
    suitableSeason: 'Kemarau',
    avgCapexPer1000m2: 11000000,
    avgOpexPerCycle: 13500000,
    defaultYieldKgPer1000m2: 1300,
    defaultPricePerKg: 32000,
    priceRange: { min: 18000, max: 55000, avg: 32000 },
    image: '/src/assets/images/crop_bawang_merah_1793888691346.jpg',
    description: 'Salah satu komoditas inflasi strategis nasional. Umur panen sangat singkat (60 hari) dengan serapan pasar konsumen rumah tangga yang masif.',
    keyAdvantages: [
      'Umur tanaman sangat cepat panen (kurang dari 2 bulan)',
      'Bisa disimpan dalam bentuk rogol kering untuk menunggu harga puncak',
      'Pasar sangat likuid, mudah dijual kapan saja ke tengkulak/pedagang'
    ],
    keyRisks: [
      'Biaya benih umbi cukup mahal dan mendominasi opex',
      'Serangan ulat grayak (Spodoptera exigua) dan busuk umbi fusarium',
      'Sensitif terhadap kelembapan tinggi di musim hujan lebat'
    ],
    targetMarkets: ['Pasar Tradisional & Grosir', 'Pabrik Bawang Goreng Kemasan', 'Pemasok Katering'],
    tags: ['bumbu pokok', 'cepat panen', 'panen 60 hari', 'pasar likuid', 'komoditas inflasi', 'brebes', 'nganjuk']
  },
  {
    id: 'bawang-putih-lokal',
    name: 'Bawang Putih (Lumbu Hijau / Tawangmangu)',
    scientificName: 'Allium sativum',
    category: 'hortikultura',
    categoryLabel: 'Hortikultura Sayur',
    cycleDays: 115,
    optimalAltitude: '700 - 1.400 mdpl',
    waterRequirement: 'Sedang',
    riskLevel: 'Sedang',
    suitableSeason: 'Kemarau',
    avgCapexPer1000m2: 12000000,
    avgOpexPerCycle: 12500000,
    defaultYieldKgPer1000m2: 1100,
    defaultPricePerKg: 36000,
    priceRange: { min: 25000, max: 50000, avg: 36000 },
    image: '/src/assets/images/crop_bawang_merah_1793888691346.jpg',
    description: 'Komoditas substitusi impor bernilai tinggi. Aroma dan minyak atsiri bawang putih lokal jauh lebih tajam dan disukai industri obat tradisional.',
    keyAdvantages: [
      'Peluang substitusi impor terbuka lebar dengan dukungan subsidi benih',
      'Aroma khas lebih pekat dibanding bawang impor',
      'Daya simpan umbi kering sangat lama (hingga 6 bulan)'
    ],
    keyRisks: [
      'Hanya optimal tumbuh di dataran tinggi berhawa sejuk',
      'Persaingan harga dengan bawang putih impor curah',
      'Penyakit busuk pangkal batang sclerotium'
    ],
    targetMarkets: ['Industri Herbal & Farmasi', 'Supermarket Sayur Lokal', 'Pasar Tradisional Spesialis'],
    tags: ['bumbu pokok', 'dataran tinggi', 'substitusi impor', 'tahan simpan', 'rempah']
  },
  {
    id: 'semangka-non-biji',
    name: 'Semangka Non-Biji (Amara F1 / Inul)',
    scientificName: 'Citrullus lanatus',
    category: 'buah',
    categoryLabel: 'Buah Segar',
    cycleDays: 65,
    optimalAltitude: '0 - 500 mdpl',
    waterRequirement: 'Sedang',
    riskLevel: 'Sedang',
    suitableSeason: 'Kemarau',
    avgCapexPer1000m2: 8500000,
    avgOpexPerCycle: 7200000,
    defaultYieldKgPer1000m2: 3200,
    defaultPricePerKg: 6500,
    priceRange: { min: 4500, max: 9500, avg: 6500 },
    image: '/src/assets/images/crop_melon_golden_1793888691358.jpg',
    description: 'Buah pelepas dahaga favorit dengan tonase bobot luar biasa. Satu buah dapat mencapai 6-9 kg dengan rasa manis renyah.',
    keyAdvantages: [
      'Produktivitas tonase bobot sangat masif per hektar',
      'Siklus panen sangat cepat hanya 65 hari',
      'Diterima oleh pedagang eceran pinggir jalan hingga supermarket'
    ],
    keyRisks: [
      'Memerlukan penyerbukan bunga jantan semangka berbiji secara manual',
      'Kerentanan pecah buah jika terjadi hujan mendadak jelang panen',
      'Hama lalat buah dan kutu kebul'
    ],
    targetMarkets: ['Pengepul Buah Segar', 'Pasar Buah Grosir', 'Lapak Jus & Es Buah'],
    tags: ['buah segar', 'tonase tinggi', 'cepat panen', 'panen 65 hari', 'dataran rendah', 'manis']
  },
  {
    id: 'kangkung-darat-cabut',
    name: 'Kangkung Darat Cabut (Serimpi / Grand)',
    scientificName: 'Ipomoea aquatica',
    category: 'hortikultura',
    categoryLabel: 'Hortikultura Sayur',
    cycleDays: 25,
    optimalAltitude: '0 - 800 mdpl',
    waterRequirement: 'Tinggi',
    riskLevel: 'Rendah',
    suitableSeason: 'Sepanjang Tahun',
    avgCapexPer1000m2: 3000000,
    avgOpexPerCycle: 2800000,
    defaultYieldKgPer1000m2: 1200,
    defaultPricePerKg: 6000,
    priceRange: { min: 4000, max: 9000, avg: 6000 },
    image: '/src/assets/images/hero_agropreneur_farm_1793888689885.jpg',
    description: 'Juara perputaran modal kilat. Panen hanya dalam waktu 21-25 hari dengan modal awal sangat terjangkau bagi pemula.',
    keyAdvantages: [
      'Perputaran modal tercepat di dunia sayuran (kurang dari 1 bulan)',
      'Modal awal terendah, sangat aman untuk wirausaha tani pemula',
      'Hampir tidak pernah ditolak pasar sayur basah harian'
    ],
    keyRisks: [
      'Harga jual per ikat rentan turun saat musim panen raya lokal',
      'Daya simpan daun segar sangat pendek (maksimal 24 jam)',
      'Hama ulat pemakan daun dan belalang'
    ],
    targetMarkets: ['Pasar Pagi Tradisional', 'Tukang Sayur Keliling', 'Restoran Seafood / Kangkung Bakar'],
    tags: ['sayuran daun', 'panen kilat', 'panen 25 hari', 'modal kecil', 'pemula', 'perputaran cepat', 'cash flow harian']
  },
  {
    id: 'bayam-cabut-hijau',
    name: 'Bayam Cabut Hijau (Maestro / Giti Hijau)',
    scientificName: 'Amaranthus tricolor',
    category: 'hortikultura',
    categoryLabel: 'Hortikultura Sayur',
    cycleDays: 22,
    optimalAltitude: '0 - 1.000 mdpl',
    waterRequirement: 'Tinggi',
    riskLevel: 'Rendah',
    suitableSeason: 'Sepanjang Tahun',
    avgCapexPer1000m2: 2800000,
    avgOpexPerCycle: 2600000,
    defaultYieldKgPer1000m2: 1100,
    defaultPricePerKg: 6500,
    priceRange: { min: 4500, max: 10000, avg: 6500 },
    image: '/src/assets/images/hero_agropreneur_farm_1793888689885.jpg',
    description: 'Sayur bergizi kaya zat besi dengan umur budidaya paling singkat (20-25 hari). Solusi menjaga arus kas harian pertanian.',
    keyAdvantages: [
      'Panen kilat dalam 3 minggu pasca tabur benih',
      'Bisa rotasi tanam berkali-kali dalam 1 tahun kalender',
      'Biaya benih dan pupuk sangat terjangkau'
    ],
    keyRisks: [
      'Sensitif terhadap serangan rebah kecambah (Pythium) saat basah',
      'Layu daun cepat jika terkena terik matahari pascapanen',
      'Fluktuasi harga di pedagang sayur eceran'
    ],
    targetMarkets: ['Pasar Tradisional Pagi', 'Pabrik Keripik Bayam Krispi', 'Supermarket Kemasan Sayur'],
    tags: ['sayuran daun', 'panen kilat', 'panen 22 hari', 'modal kecil', 'perputaran cepat', 'kaya nutrisi']
  },
  {
    id: 'terong-ungu-antaboga',
    name: 'Terong Ungu Hibrida (Antaboga / Yumi F1)',
    scientificName: 'Solanum melongena',
    category: 'hortikultura',
    categoryLabel: 'Hortikultura Sayur',
    cycleDays: 90,
    optimalAltitude: '0 - 900 mdpl',
    waterRequirement: 'Sedang',
    riskLevel: 'Rendah',
    suitableSeason: 'Sepanjang Tahun',
    avgCapexPer1000m2: 6500000,
    avgOpexPerCycle: 5800000,
    defaultYieldKgPer1000m2: 3500,
    defaultPricePerKg: 5500,
    priceRange: { min: 3500, max: 8500, avg: 5500 },
    image: '/src/assets/images/crop_cabai_rawit_1793888690231.jpg',
    description: 'Tanaman tangguh dengan periode panen panjang hingga 4-5 bulan. Buah ungu mengkilap dengan daya tahan simpan kuat.',
    keyAdvantages: [
      'Masa panen sangat panjang (bisa petik hingga 25-30 kali)',
      'Tanaman sangat tahan penyakit dibanding tanaman solanaceae lain',
      'Tonase panen kumulatif sangat besar per pohon'
    ],
    keyRisks: [
      'Kutu daun thrips dan ulat buah',
      'Penyakit layu fusarium jika drainase tanah buruk',
      'Harga pasar kadang tertekan saat panen raya massal'
    ],
    targetMarkets: ['Pasar Induk Sayur', 'Warung Makan Padang & Lalapan', 'Pasar Tradisional'],
    tags: ['sayur', 'panen panjang', 'panen berulang', 'tahan banting', 'tonase tinggi', 'terong']
  },
  {
    id: 'mentimun-hibrida',
    name: 'Mentimun Lalap & Rujak (Hercules / Misano)',
    scientificName: 'Cucumis sativus',
    category: 'hortikultura',
    categoryLabel: 'Hortikultura Sayur',
    cycleDays: 38,
    optimalAltitude: '0 - 800 mdpl',
    waterRequirement: 'Sedang',
    riskLevel: 'Rendah',
    suitableSeason: 'Sepanjang Tahun',
    avgCapexPer1000m2: 5500000,
    avgOpexPerCycle: 4800000,
    defaultYieldKgPer1000m2: 2600,
    defaultPricePerKg: 5000,
    priceRange: { min: 3000, max: 8000, avg: 5000 },
    image: '/src/assets/images/crop_melon_golden_1793888691358.jpg',
    description: 'Sayur buah merambat dengan masa panen kilat (35-40 HST). Setiap ketiak daun mampu menghasilkan buah lurus mulus.',
    keyAdvantages: [
      'Mulai panen pertama sangat cepat (umur 35 HST)',
      'Pemetikan dilakukan setiap 2 hari sekali selama 1 bulan penuh',
      'Dibutuhkan setiap hari oleh ribuan warung pecel lele & lalapan'
    ],
    keyRisks: [
      'Kebutuhan ajir/tali rambatan yang cukup banyak',
      'Penyakit embun bulu (downy mildew) saat mendung',
      'Lalat buah menusuk calon buah muda'
    ],
    targetMarkets: ['Pasar Grosir Sayur', 'Warung Nasi & Pecel Lele', 'Pabrik Acar Olahan'],
    tags: ['sayur buah', 'cepat panen', 'panen 38 hari', 'lalapan', 'perputaran cepat', 'segar']
  },
  {
    id: 'pakcoy-hidroponik-nft',
    name: 'Pakcoy / Sawi Sendok Hidroponik (Naibai)',
    scientificName: 'Brassica rapa subsp. chinensis',
    category: 'hidroponik',
    categoryLabel: 'Hidroponik Modern',
    cycleDays: 30,
    optimalAltitude: '200 - 1.200 mdpl',
    waterRequirement: 'Tinggi',
    riskLevel: 'Rendah',
    suitableSeason: 'Sepanjang Tahun',
    avgCapexPer1000m2: 40000000,
    avgOpexPerCycle: 7500000,
    defaultYieldKgPer1000m2: 2000,
    defaultPricePerKg: 18000,
    priceRange: { min: 14000, max: 24000, avg: 18000 },
    image: '/src/assets/images/hero_agropreneur_farm_1793888689885.jpg',
    description: 'Sayuran oriental daun tebal renyah higienis tanpa pestisida kimia. Permintaan sangat konsisten untuk restoran suki, ramen, dan tumisan.',
    keyAdvantages: [
      'Waktu panen hanya 28-30 hari dari semai',
      'Tampilan batang putih bersih dan daun hijau cerah berharga premium',
      'Diterima jaringan supermarket dan katering sehat'
    ],
    keyRisks: [
      'Kebutuhan listrik pompa tandon harus 24 jam nonstop',
      'Fluktuasi suhu air nutrisi di siang terik',
      'Ulat daun plutella jika net greenhouse tidak rapat'
    ],
    targetMarkets: ['Restoran Hotpot & Chinese Food', 'Supermarket Modern', 'Paket Sayur Hidroponik Online'],
    tags: ['hidroponik', 'greenhouse', 'sayuran daun', 'panen 30 hari', 'supermarket', 'horeka']
  },
  {
    id: 'selada-hidroponik-nft',
    name: 'Selada Hidroponik NFT (Romaine & Butterhead)',
    scientificName: 'Lactuca sativa',
    category: 'hidroponik',
    categoryLabel: 'Hidroponik Modern',
    cycleDays: 35,
    optimalAltitude: '400 - 1.200 mdpl',
    waterRequirement: 'Tinggi',
    riskLevel: 'Rendah',
    suitableSeason: 'Sepanjang Tahun',
    avgCapexPer1000m2: 45000000,
    avgOpexPerCycle: 8500000,
    defaultYieldKgPer1000m2: 1800,
    defaultPricePerKg: 25000,
    priceRange: { min: 18000, max: 35000, avg: 25000 },
    image: '/src/assets/images/crop_melon_golden_1793888691358.jpg',
    description: 'Siklus panen tercepat (hanya 35 hari) dengan cash flow bulanan yang stabil. Daun renyah higienis tanpa pestisida kimia sintetis.',
    keyAdvantages: [
      'Bisa panen 10-12 siklus dalam 1 tahun kalender',
      'Konsumsi air 80% lebih hemat daripada tanam tanah tradisional',
      'Disukai restoran burger, salad bar, dan konsumen gaya hidup sehat'
    ],
    keyRisks: [
      'Mati listrik pompa air lebih dari 4 jam berisiko layu massal',
      'Suhu tandon nutrisi yang terlalu panas memicu tipburn daun',
      'Umur simpan daun segar relatif pendek setelah petik'
    ],
    targetMarkets: ['Restoran Cepat Saji & Kafe', 'Paket Sayur Segar Langganan', 'Supermarket Sayur Organik'],
    tags: ['hidroponik', 'sayur salad', 'horeka', 'panen 35 hari', 'cash flow bulanan', 'premium']
  },
  {
    id: 'tomat-servo-f1',
    name: 'Tomat Dataran Tinggi (Servo F1)',
    scientificName: 'Solanum lycopersicum',
    category: 'hortikultura',
    categoryLabel: 'Hortikultura Sayur',
    cycleDays: 85,
    optimalAltitude: '500 - 1.400 mdpl',
    waterRequirement: 'Sedang',
    riskLevel: 'Sedang',
    suitableSeason: 'Kemarau',
    avgCapexPer1000m2: 9500000,
    avgOpexPerCycle: 8200000,
    defaultYieldKgPer1000m2: 2800,
    defaultPricePerKg: 9500,
    priceRange: { min: 4000, max: 20000, avg: 9500 },
    image: '/src/assets/images/crop_cabai_rawit_1793888690231.jpg',
    description: 'Varietas tahan virus Gemini dengan buah padat dan daging tebal. Sangat disukai pedagang pasar karena daya simpan transportasi antarkota.',
    keyAdvantages: [
      'Produktivitas tonase buah per meter persegi sangat tinggi',
      'Daya tahan simpan buah kuat hingga 7-10 hari pasca petik',
      'Tahan terhadap serangan layu bakteri Ralstonia'
    ],
    keyRisks: [
      'Harga pasar rentan anjlok saat panen raya serentak',
      'Serangan ulat buah Helicoverpa armigera',
      'Keretakan kulit buah jika terkena hujan mendadak setelah panas terik'
    ],
    targetMarkets: ['Pasar Induk Kramat Jati / Caringin', 'Industri Saus Tomat', 'Supermarket & Agen Sayur'],
    tags: ['sayur buah', 'tonase tinggi', 'tahan simpan', 'dataran tinggi', 'populer', 'tomat']
  },
  {
    id: 'jagung-hibrida-pipil',
    name: 'Jagung Hibrida Pipil (Pioneer / NK)',
    scientificName: 'Zea mays',
    category: 'pangan',
    categoryLabel: 'Pangan Pokok',
    cycleDays: 105,
    optimalAltitude: '0 - 700 mdpl',
    waterRequirement: 'Rendah',
    riskLevel: 'Rendah',
    suitableSeason: 'Sepanjang Tahun',
    avgCapexPer1000m2: 3500000,
    avgOpexPerCycle: 3200000,
    defaultYieldKgPer1000m2: 850,
    defaultPricePerKg: 5800,
    priceRange: { min: 4600, max: 7200, avg: 5800 },
    image: '/src/assets/images/hero_agropreneur_farm_1793888689885.jpg',
    description: 'Komoditas tahan banting dengan risiko perawatan terendah. Sangat cocok untuk pemanfaatan lahan luas dengan mekanisasi sederhana.',
    keyAdvantages: [
      'Perawatan relatif minim, tahan cuaca panas dan kekeringan',
      'Serapan industri pakan ternak (feedmill) tanpa batas kuota',
      'Tingkat kegagalan panen paling rendah dibanding sayuran'
    ],
    keyRisks: [
      'Margin per kilogram tipis, membutuhkan skala lahan minimal 1 hektar',
      'Hama ulat grayak frugiperda (FAW) pada fase vegetatif',
      'Kebutuhan alat perontok dan pengeringan kadar air (KA 14%)'
    ],
    targetMarkets: ['Pabrik Pakan Ternak (Feedmill)', 'Peternak Layer/Broiler Mandiri', 'Gudang Bulog'],
    tags: ['pangan', 'pakan ternak', 'tahan kering', 'modal rendah', 'risiko rendah', 'lahan luas']
  },
  {
    id: 'padi-sawah-irigasi',
    name: 'Padi Sawah Irigasi (Inpari 32 / Ciherang)',
    scientificName: 'Oryza sativa',
    category: 'pangan',
    categoryLabel: 'Pangan Pokok',
    cycleDays: 115,
    optimalAltitude: '0 - 600 mdpl',
    waterRequirement: 'Tinggi',
    riskLevel: 'Rendah',
    suitableSeason: 'Sepanjang Tahun',
    avgCapexPer1000m2: 4000000,
    avgOpexPerCycle: 3900000,
    defaultYieldKgPer1000m2: 700,
    defaultPricePerKg: 6800,
    priceRange: { min: 5800, max: 8200, avg: 6800 },
    image: '/src/assets/images/hero_agropreneur_farm_1793888689885.jpg',
    description: 'Pangan pokok utama bangsa dengan regulasi harga dasar pembelian pemerintah (HPP Gabah Kering Panen) yang menjamin kestabilan.',
    keyAdvantages: [
      'Jaminan pasar 100% terserap oleh penggilingan padi lokal & Bulog',
      'Subsidi pupuk dan asuransi usaha tani padi (AUTP) tersedia',
      'Teknologi budidaya sangat mapan dan tenaga kerja mudah didapat'
    ],
    keyRisks: [
      'Serangan hama wereng batang coklat dan tikus sawah',
      'Ketergantungan debit saluran irigasi teknis',
      'Fluktuasi rendemen giling beras saat cuaca mendung'
    ],
    targetMarkets: ['Penggilingan Beras Lokal (Rice Mill)', 'Perum Bulog', 'Toko Grosir Sembako'],
    tags: ['pangan pokok', 'beras', 'sawah irigasi', 'bulog', 'stabil', 'pemerintah']
  },
  {
    id: 'ubi-jalar-cilembu',
    name: 'Ubi Jalar Madu Cilembu Organik',
    scientificName: 'Ipomoea batatas',
    category: 'pangan',
    categoryLabel: 'Pangan Pokok',
    cycleDays: 135,
    optimalAltitude: '400 - 1.000 mdpl',
    waterRequirement: 'Rendah',
    riskLevel: 'Rendah',
    suitableSeason: 'Kemarau',
    avgCapexPer1000m2: 4500000,
    avgOpexPerCycle: 4200000,
    defaultYieldKgPer1000m2: 2200,
    defaultPricePerKg: 7500,
    priceRange: { min: 5000, max: 12000, avg: 7500 },
    image: '/src/assets/images/crop_bawang_merah_1793888691346.jpg',
    description: 'Umbi manis alami bertekstur pulen seperti madu saat dipanggang. Komoditas populer untuk oleh-oleh dan ekspor ke Singapura & Jepang.',
    keyAdvantages: [
      'Permintaan ekspor dan pasar oleh-oleh modern sangat tinggi',
      'Kebutuhan pupuk kimia sangat minim, menghemat opex',
      'Tahan kekeringan dan cocok di lahan lereng berpasir'
    ],
    keyRisks: [
      'Hama boleng (Cylas formicarius) yang membuat umbi pahit',
      'Rasa manis madu khas hanya keluar maksimal pada tanah spesifik',
      'Perlu proses penganginan (curing) 1-2 minggu sebelum dipanggang'
    ],
    targetMarkets: ['Toko Oleh-Oleh Khas', 'Eksportir Makanan Ringan Asia', 'Supermarket Segar'],
    tags: ['ubi', 'manis', 'cilembu', 'ekspor', 'rendah pupuk', 'tahan kering', 'pangan']
  },
  {
    id: 'singkong-gajah-mukibat',
    name: 'Singkong Gajah / Mukibat Industri',
    scientificName: 'Manihot esculenta',
    category: 'pangan',
    categoryLabel: 'Pangan Pokok',
    cycleDays: 300,
    optimalAltitude: '0 - 800 mdpl',
    waterRequirement: 'Rendah',
    riskLevel: 'Rendah',
    suitableSeason: 'Sepanjang Tahun',
    avgCapexPer1000m2: 3200000,
    avgOpexPerCycle: 3000000,
    defaultYieldKgPer1000m2: 5000,
    defaultPricePerKg: 1600,
    priceRange: { min: 1200, max: 2200, avg: 1600 },
    image: '/src/assets/images/hero_agropreneur_farm_1793888689885.jpg',
    description: 'Komoditas ketahanan pangan dengan tonase umbi raksasa (mencapai 40-50 ton/ha). Bahan baku utama tepung tapioka dan mocaf.',
    keyAdvantages: [
      'Hasil bobot tonase sangat besar dengan modal minim',
      'Tahan terhadap kondisi tanah marjinal dan kurang air',
      'Seluruh bagian (daun, batang bibit, umbi) bernilai ekonomis'
    ],
    keyRisks: [
      'Waktu tanam cukup panjang (9-10 bulan)',
      'Kadar pati umbi dipengaruhi curah hujan saat panen',
      'Ketergantungan pada jarak ke pabrik tapioka lokal'
    ],
    targetMarkets: ['Pabrik Tepung Tapioka & Mocaf', 'Industri Keripik Singkong', 'Pakan Ternak Silase'],
    tags: ['singkong', 'tapioka', 'tonase raksasa', 'modal kecil', 'tahan banting', 'industri']
  },
  {
    id: 'kacang-tanah-tuban',
    name: 'Kacang Tanah Polong (Kancil / Tuban)',
    scientificName: 'Arachis hypogaea',
    category: 'pangan',
    categoryLabel: 'Pangan Pokok',
    cycleDays: 95,
    optimalAltitude: '0 - 500 mdpl',
    waterRequirement: 'Rendah',
    riskLevel: 'Rendah',
    suitableSeason: 'Kemarau',
    avgCapexPer1000m2: 4200000,
    avgOpexPerCycle: 3800000,
    defaultYieldKgPer1000m2: 550,
    defaultPricePerKg: 24000,
    priceRange: { min: 18000, max: 32000, avg: 24000 },
    image: '/src/assets/images/crop_bawang_merah_1793888691346.jpg',
    description: 'Polong gurih bahan baku bumbu pecel, selai kacang, dan camilan sangrai. Tanaman pengikat nitrogen yang menyuburkan tanah sawah rotasi.',
    keyAdvantages: [
      'Memperbaiki kesuburan tanah sawah setelah panen padi',
      'Harga jual biji kacang kupas kering sangat stabil dan tinggi',
      'Permintaan industri makanan ringan nasional tak pernah surut'
    ],
    keyRisks: [
      'Serangan hama tikus dan ulat tanah',
      'Penyakit jamur bercak daun cercospora',
      'Kebutuhan tenaga kerja cukup banyak saat cabut dan petik polong'
    ],
    targetMarkets: ['Pabrik Kacang Sangrai / Garuda / Dua Kelinci', 'Industri Bumbu Pecel & Gado-Gado', 'Pasar Tradisional'],
    tags: ['kacang', 'polong', 'rotasi tanam', 'bumbu pecel', 'tanah subur', 'pangan']
  },
  {
    id: 'jahe-merah-polybag',
    name: 'Jahe Merah Organik (Media Polybag)',
    scientificName: 'Zingiber officinale var. rubrum',
    category: 'perkebunan',
    categoryLabel: 'Perkebunan & Rempah',
    cycleDays: 270,
    optimalAltitude: '0 - 900 mdpl',
    waterRequirement: 'Rendah',
    riskLevel: 'Rendah',
    suitableSeason: 'Sepanjang Tahun',
    avgCapexPer1000m2: 15000000,
    avgOpexPerCycle: 11000000,
    defaultYieldKgPer1000m2: 2500,
    defaultPricePerKg: 28000,
    priceRange: { min: 20000, max: 50000, avg: 28000 },
    image: '/src/assets/images/crop_bawang_merah_1793888691346.jpg',
    description: 'Herbal obat berkhasiat tinggi dengan nilai jual ekspor. Budidaya polybag mempermudah kontrol drainase dan panen rimpang bersih.',
    keyAdvantages: [
      'Permintaan stabil untuk jamu tradisional, farmasi, dan ekspor',
      'Bisa dibudidayakan di pekarangan terbatas tanpa lahan sawah luas',
      'Rimpang tidak busuk jika waktu panen ditunda beberapa minggu'
    ],
    keyRisks: [
      'Waktu pemeliharaan cukup panjang (9 sampai 10 bulan)',
      'Risiko penyakit layu bakteri pseudomonas pada rimpang',
      'Kebutuhan media tanam gembur dan porus dalam jumlah besar'
    ],
    targetMarkets: ['Industri Herbal & Farmasi Nasional', 'Eksportir Rempah Nusantara', 'Pabrik Minuman Jahe Instan'],
    tags: ['rempah', 'herbal', 'polybag', 'ekspor', 'tahan tunda panen', 'pekarangan']
  },
  {
    id: 'vanili-emas-hijau',
    name: 'Vanili Planifolia (Emas Hijau Organik)',
    scientificName: 'Vanilla planifolia',
    category: 'perkebunan',
    categoryLabel: 'Perkebunan & Rempah',
    cycleDays: 270, // Panen polong 9 bulan pasca kawin
    optimalAltitude: '400 - 800 mdpl',
    waterRequirement: 'Sedang',
    riskLevel: 'Sedang',
    suitableSeason: 'Sepanjang Tahun',
    avgCapexPer1000m2: 28000000,
    avgOpexPerCycle: 12000000,
    defaultYieldKgPer1000m2: 450, // Polong basah matang
    defaultPricePerKg: 220000,
    priceRange: { min: 150000, max: 450000, avg: 220000 },
    image: '/src/assets/images/hero_agropreneur_farm_1793888689885.jpg',
    description: 'Julukan "Emas Hijau" berkat nilai jual polong yang sangat fantastis di pasar ekspor Eropa dan Amerika Serikat untuk aroma kue dan parfum.',
    keyAdvantages: [
      'Nilai jual per kilogram tertinggi di antara seluruh komoditas pertanian',
      'Pasar ekspor global dengan harga dollar yang sangat menguntungkan',
      'Dapat ditanam secara tumpangsari dengan pohon penaung'
    ],
    keyRisks: [
      'Perlu penyerbukan manual bunga vanili satu per satu di pagi hari',
      'Risiko pencurian polong di kebun karena harganya yang mahal',
      'Penyakit busuk batang fusarium oxysporum'
    ],
    targetMarkets: ['Eksportir Rempah Eropa & AS', 'Industri Es Krim & Bakery Mewah', 'Pabrik Ekstrak Vanili'],
    tags: ['emas hijau', 'vanili', 'harga tertinggi', 'ekspor eropa', 'rempah mewah', 'polong']
  },
  {
    id: 'jamur-tiram-kumbung',
    name: 'Jamur Tiram Putih (Kumbung Bambu)',
    scientificName: 'Pleurotus ostreatus',
    category: 'hortikultura',
    categoryLabel: 'Hortikultura Sayur',
    cycleDays: 120, // 4 bulan panen harian dari baglog
    optimalAltitude: '500 - 1.100 mdpl',
    waterRequirement: 'Tinggi',
    riskLevel: 'Rendah',
    suitableSeason: 'Sepanjang Tahun',
    avgCapexPer1000m2: 24000000, // Kumbung bambu + rak susun 8.000 baglog
    avgOpexPerCycle: 18000000, // Baglog siap tumbuh, tenaga semprot spuyer
    defaultYieldKgPer1000m2: 3200,
    defaultPricePerKg: 14000,
    priceRange: { min: 10000, max: 20000, avg: 14000 },
    image: '/src/assets/images/crop_bawang_merah_1793888691346.jpg',
    description: 'Usaha tani tanpa tanah di dalam ruangan kumbung berventilasi. Baglog serbuk gergaji menghasilkan jamur mekar setiap hari.',
    keyAdvantages: [
      'Panen harian setiap pagi tanpa terpengaruh cuaca hujan atau panas',
      'Tidak membutuhkan lahan sawah luas, cukup bangunan kumbung vertikal',
      'Limbah baglog bekas (media kompos) bernilai jual pupuk organik'
    ],
    keyRisks: [
      'Kumbung harus terjaga kelembapan 80-90% dan suhu sejuk < 26°C',
      'Kontaminasi jamur liar hijau (Trichoderma) dan ulat',
      'Jamur segar cepat menyusut bobot jika tidak segera dijual'
    ],
    targetMarkets: ['Pasar Tradisional Pagi', 'Pabrik Jamur Crispy', 'Restoran Vegetarian & Kuliner'],
    tags: ['jamur', 'kumbung', 'panen harian', 'tanpa tanah', 'vertikal', 'baglog', 'cash flow harian']
  },
  {
    id: 'kopi-arabika-dataran-tinggi',
    name: 'Kopi Arabika Spesialti (Gayo / Kintamani)',
    scientificName: 'Coffea arabica',
    category: 'perkebunan',
    categoryLabel: 'Perkebunan & Rempah',
    cycleDays: 240, // Musim panen petik merah
    optimalAltitude: '1.000 - 1.800 mdpl',
    waterRequirement: 'Sedang',
    riskLevel: 'Rendah',
    suitableSeason: 'Sepanjang Tahun',
    avgCapexPer1000m2: 16000000,
    avgOpexPerCycle: 8500000,
    defaultYieldKgPer1000m2: 500, // Green bean / beras kopi
    defaultPricePerKg: 95000,
    priceRange: { min: 75000, max: 140000, avg: 95000 },
    image: '/src/assets/images/hero_agropreneur_farm_1793888689885.jpg',
    description: 'Komoditas gaya hidup global. Kopi arabika petik merah berproses pascapanen (natural / honey / wine) memiliki nilai jual tinggi di coffee shop modern.',
    keyAdvantages: [
      'Pasar kedai kopi spesialti dan ekspor terus bertumbuh pesat',
      'Dapat diolah menjadi green bean atau roasted bean bermargin tebal',
      'Tanaman tahunan yang berproduksi puluhan tahun'
    ],
    keyRisks: [
      'Hanya bisa tumbuh di dataran tinggi > 1.000 mdpl',
      'Keterampilan pascapanen fermentasi sangat menentukan cupping score',
      'Hama penggerek buah kopi (PBKo)'
    ],
    targetMarkets: ['Coffee Shop Spesialti & Roastery', 'Eksportir Kopi Internasional', 'Wisata Edukasi Kebun Kopi'],
    tags: ['kopi', 'arabika', 'dataran tinggi', 'spesialti', 'coffee shop', 'ekspor', 'tanaman tahunan']
  },
  {
    id: 'kopi-robusta-organik',
    name: 'Kopi Robusta Organik (Temanggung / Dampit)',
    scientificName: 'Coffea canephora',
    category: 'perkebunan',
    categoryLabel: 'Perkebunan & Rempah',
    cycleDays: 210,
    optimalAltitude: '400 - 900 mdpl',
    waterRequirement: 'Sedang',
    riskLevel: 'Rendah',
    suitableSeason: 'Sepanjang Tahun',
    avgCapexPer1000m2: 12000000,
    avgOpexPerCycle: 6500000,
    defaultYieldKgPer1000m2: 650,
    defaultPricePerKg: 52000,
    priceRange: { min: 38000, max: 70000, avg: 52000 },
    image: '/src/assets/images/hero_agropreneur_farm_1793888689885.jpg',
    description: 'Kopi dengan body tebal dan kafein mantap yang diserap massal oleh industri kopi sachet, kafe es kopi susu kekinian, dan ekspor.',
    keyAdvantages: [
      'Tanaman sangat tahan penyakit karat daun dibanding arabika',
      'Bisa tumbuh di dataran rendah hingga sedang (400 - 900 mdpl)',
      'Tren es kopi susu kekinian membuat permintaan melonjak'
    ],
    keyRisks: [
      'Harga green bean mengikuti bursa komoditas London',
      'Pascapanen tradisional (jemur tanah) menurunkan grade mutu',
      'Peremajaan tanaman tua (pruning dan sambung pucuk)'
    ],
    targetMarkets: ['Pabrik Kopi Bubuk & Sachet', 'Kafe Kopi Susu Kekinian', 'Gudang Eksportir Kopi'],
    tags: ['kopi', 'robusta', 'dataran sedang', 'es kopi susu', 'kafe', 'tahan penyakit']
  },
  {
    id: 'pisang-cavendish-premium',
    name: 'Pisang Cavendish Organik (Standar Supermarket)',
    scientificName: 'Musa acuminata',
    category: 'buah',
    categoryLabel: 'Buah Segar',
    cycleDays: 270,
    optimalAltitude: '0 - 800 mdpl',
    waterRequirement: 'Tinggi',
    riskLevel: 'Rendah',
    suitableSeason: 'Sepanjang Tahun',
    avgCapexPer1000m2: 14000000,
    avgOpexPerCycle: 9000000,
    defaultYieldKgPer1000m2: 3800,
    defaultPricePerKg: 9000,
    priceRange: { min: 7000, max: 14000, avg: 9000 },
    image: '/src/assets/images/hero_agropreneur_farm_1793888689885.jpg',
    description: 'Pisang meja populer berwarna kuning mulus dengan pasar konsumen harian terbesar. Hasil panen per tandan bisa mencapai 25-35 kg.',
    keyAdvantages: [
      'Permintaan sangat stabil di supermarket modern dan hotel',
      'Sekali tanam anakan pisang terus beranak pinak berkelanjutan',
      'Produktivitas tonase buah per hektar sangat tinggi'
    ],
    keyRisks: [
      'Penyakit layu fusarium (panama disease) dan darah pisang',
      'Kulit buah sensitif terhadap gesekan saat panen dan transportasi',
      'Membutuhkan pembungkusan tandan (bagging) dengan plastik biru'
    ],
    targetMarkets: ['Supermarket Modern (Sunpride tier)', 'Hotel Bintang & Restoran', 'Toko Buah Grosir'],
    tags: ['buah segar', 'pisang cavendish', 'supermarket', 'tonase besar', 'berkelanjutan']
  },
  {
    id: 'alpukat-miki-aligator',
    name: 'Alpukat Jumbo Mentega (Miki / Aligator)',
    scientificName: 'Persea americana',
    category: 'buah',
    categoryLabel: 'Buah Segar',
    cycleDays: 180, // Siklus berbuah tahunan pasca umur 3 tahun
    optimalAltitude: '100 - 900 mdpl',
    waterRequirement: 'Sedang',
    riskLevel: 'Rendah',
    suitableSeason: 'Sepanjang Tahun',
    avgCapexPer1000m2: 18000000,
    avgOpexPerCycle: 7000000,
    defaultYieldKgPer1000m2: 2200,
    defaultPricePerKg: 28000,
    priceRange: { min: 20000, max: 45000, avg: 28000 },
    image: '/src/assets/images/crop_melon_golden_1793888691358.jpg',
    description: 'Varietas alpukat premium berbobot jumbo (0.8 - 1.5 kg per buah) dengan daging kuning pulen mentega tanpa serat dan tahan ulat.',
    keyAdvantages: [
      'Harga jual sangat tinggi dan digemari kalangan menengah atas',
      'Daging buah tebal manis legit tanpa rasa getir',
      'Pohon berbuah sepanjang tahun tanpa musim jeda panjang'
    ],
    keyRisks: [
      'Investasi fase vegetatif awal butuh waktu 3 tahun hingga berbuah',
      'Lalat buah menusuk buah muda jika tidak dibrongsong',
      'Penyakit busuk akar phytophthora bila lahan becek'
    ],
    targetMarkets: ['Supermarket Buah Premium', 'Toko Buah Oleh-Oleh', 'Industri Minuman Jus Sehat'],
    tags: ['buah premium', 'alpukat', 'mentega', 'jumbo', 'pohon buah', 'tahunan']
  }
];

export const COMMODITY_PRESETS_COSTS: Record<string, { capex: Array<{ name: string; unit: string; qty: number; unitPrice: number }>; opex: Array<{ name: string; unit: string; qty: number; unitPrice: number }> }> = {
  'cabai-rawit-merah': {
    capex: [
      { name: 'Sewa Lahan (1 Tahun)', unit: 'Tahun', qty: 1, unitPrice: 3500000 },
      { name: 'Pengolahan Tanah & Pembuatan Bedengan', unit: 'HOK', qty: 25, unitPrice: 100000 },
      { name: 'Plastik Mulsa Hitam Perak (MPHP)', unit: 'Roll', qty: 3, unitPrice: 650000 },
      { name: 'Ajir Bambu Penopang Tanaman', unit: 'Batang', qty: 1800, unitPrice: 1200 },
      { name: 'Instalasi Selang Drip Irigasi', unit: 'Paket', qty: 1, unitPrice: 1800000 },
      { name: 'Sprayer Elektrik 16 Liter', unit: 'Unit', qty: 1, unitPrice: 650000 }
    ],
    opex: [
      { name: 'Benih Unggul Bersertifikat F1 (Ori 212)', unit: 'Sachet (10gr)', qty: 6, unitPrice: 135000 },
      { name: 'Pupuk Kandang Kambing Fermentasi', unit: 'Karung (25kg)', qty: 80, unitPrice: 25000 },
      { name: 'Pupuk Kimia Dasar & Susulan (NPK 16-16-16, KNO3, MKP)', unit: 'Kg', qty: 220, unitPrice: 18500 },
      { name: 'Pestisida, Fungisida & Insektisida Hayati', unit: 'Paket', qty: 1, unitPrice: 1650000 },
      { name: 'Upah Tenaga Kerja Tanam & Perawatan', unit: 'HOK', qty: 30, unitPrice: 90000 },
      { name: 'Upah Tenaga Kerja Petik / Panen (15x)', unit: 'HOK', qty: 45, unitPrice: 85000 },
      { name: 'Biaya Keranjang Panen & Transportasi Pasar', unit: 'Rit', qty: 8, unitPrice: 150000 }
    ]
  },
  'melon-golden-greenhouse': {
    capex: [
      { name: 'Amortisasi Greenhouse Bambu/UV + Insect Net (1.000m²)', unit: 'Musim', qty: 1, unitPrice: 22000000 },
      { name: 'Sistem Fertigasi Tetes & Pompa Otomatis Timer', unit: 'Paket', qty: 1, unitPrice: 8500000 },
      { name: 'Tali Ajir Gantung Poliester & Klip Buah', unit: 'Paket', qty: 1, unitPrice: 2200000 },
      { name: 'EC Meter & pH Meter Digital Presisi', unit: 'Unit', qty: 2, unitPrice: 450000 },
      { name: 'Timbangan Digital & Refraktometer Brix Manis', unit: 'Unit', qty: 1, unitPrice: 950000 }
    ],
    opex: [
      { name: 'Benih F1 Melon Golden (Inthanon/Alisha)', unit: 'Biji', qty: 1750, unitPrice: 3200 },
      { name: 'Media Tanam Cocopeat & Sekam Bakar Steril', unit: 'Karung', qty: 120, unitPrice: 28000 },
      { name: 'Nutrisi Hidroponik AB Mix Khusus Melon (Pekatan)', unit: 'Paket (1000L)', qty: 3, unitPrice: 1450000 },
      { name: 'Biaya Listrik Pompa Sirkulasi & Air Baku', unit: 'Bulan', qty: 3, unitPrice: 650000 },
      { name: 'Upah Teknisi Perawatan & Pruning Cabang', unit: 'Bulan', qty: 2.5, unitPrice: 2000000 },
      { name: 'Kardus Packaging Khusus Buah Premium', unit: 'Pcs', qty: 600, unitPrice: 6000 }
    ]
  },
  'bawang-merah-brebes': {
    capex: [
      { name: 'Sewa Lahan Sawah 1 Tahun (Acuan 1.000m²)', unit: 'Tahun', qty: 1, unitPrice: 3000000 },
      { name: 'Traktor Singkal & Penataan Guludan Bedengan', unit: 'Paket', qty: 1, unitPrice: 1800000 },
      { name: 'Pompa Air Alkon 2 Inch & Selang Spiral', unit: 'Unit', qty: 1, unitPrice: 2200000 },
      { name: 'Sprinkler Micro Spray & Pipa PVC Distribusi', unit: 'Paket', qty: 1, unitPrice: 2600000 }
    ],
    opex: [
      { name: 'Umbi Bibit Bawang Merah Bima Brebes Siap Tanam', unit: 'Kg', qty: 120, unitPrice: 45000 },
      { name: 'Pupuk Organik Petrobio / Kompos Matang', unit: 'Kg', qty: 1500, unitPrice: 1200 },
      { name: 'Pupuk Kimia (ZA, SP-36, KCl, NPK Mutiara)', unit: 'Kg', qty: 180, unitPrice: 16000 },
      { name: 'Insektisida Ulat Grayak & Fungisida Moler', unit: 'Paket', qty: 1, unitPrice: 1700000 },
      { name: 'BBM Pompa Air Pengairan Rutin Subuh', unit: 'Liter', qty: 120, unitPrice: 10000 },
      { name: 'Upah Buruh Cabut Panen & Rogol Ikatan', unit: 'HOK', qty: 22, unitPrice: 95000 }
    ]
  },
  'kangkung-darat-cabut': {
    capex: [
      { name: 'Sewa Lahan 1 Musim', unit: 'Bulan', qty: 1, unitPrice: 600000 },
      { name: 'Olah Tanah Cangkul & Guludan', unit: 'HOK', qty: 8, unitPrice: 100000 },
      { name: 'Selang Siram & Gembor Air', unit: 'Unit', qty: 2, unitPrice: 150000 }
    ],
    opex: [
      { name: 'Benih Kangkung Unggul Serimpi', unit: 'Kaleng (1kg)', qty: 4, unitPrice: 85000 },
      { name: 'Pupuk Kandang Sapi Matang', unit: 'Karung', qty: 30, unitPrice: 20000 },
      { name: 'Pupuk Urea & NPK', unit: 'Kg', qty: 60, unitPrice: 12000 },
      { name: 'Tali Pengikat & Upah Cabut Panen', unit: 'HOK', qty: 10, unitPrice: 85000 }
    ]
  },
  'semangka-non-biji': {
    capex: [
      { name: 'Sewa Lahan 1 Musim', unit: 'Musim', qty: 1, unitPrice: 2500000 },
      { name: 'Traktor Bedengan Lebar & Parit Drainase', unit: 'Paket', qty: 1, unitPrice: 1800000 },
      { name: 'Mulsa Plastik Hitam Perak', unit: 'Roll', qty: 2.5, unitPrice: 650000 },
      { name: 'Sprayer & Alat Penyerbukan Bunga', unit: 'Paket', qty: 1, unitPrice: 800000 }
    ],
    opex: [
      { name: 'Benih Semangka Non-Biji F1 + Benih Penyerbuk', unit: 'Sachet', qty: 5, unitPrice: 160000 },
      { name: 'Pupuk Dasar Organik & Pupuk Kimia', unit: 'Kg', qty: 250, unitPrice: 15000 },
      { name: 'Insektisida Kutu Kebul & Fungisida', unit: 'Paket', qty: 1, unitPrice: 1200000 },
      { name: 'Upah Penyerbukan Bunga Manual & Panen', unit: 'HOK', qty: 25, unitPrice: 90000 }
    ]
  }
};
