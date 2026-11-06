import { DiversifiedProduct } from '../types';

export const DEFAULT_DIVERSIFIED_PRODUCTS: DiversifiedProduct[] = [
  {
    id: 'prod-chili-oil',
    commodityId: 'cabai-rawit-merah',
    sourceCommodityName: 'Cabai Rawit Merah',
    processedProductName: 'Chili Oil Premium Bawang Crispy 150ml',
    rawMaterialNeededKg: 0.2, // 200g cabai segar per botol 150ml
    processingCostPerUnit: 6500, // Minyak kanola, bawang putih, rempah aromatik, gas
    packagingCostPerUnit: 4500, // Botol kaca heksagonal, stiker laminasi doff, plastik segel
    laborCostPerUnit: 2500, // Tenaga kerja sangrai & packing
    sellingPricePerUnit: 35000,
    shelfLifeMonths: 12,
    complexityLevel: 'Rendah',
  },
  {
    id: 'prod-sambal-bawang-pouch',
    commodityId: 'cabai-rawit-merah',
    sourceCommodityName: 'Cabai Rawit Merah',
    processedProductName: 'Sambal Korek Bawang Pouch Retort 200g',
    rawMaterialNeededKg: 0.25, // 250g cabai + bawang
    processingCostPerUnit: 5500, // Minyak, garam, gula, rempah
    packagingCostPerUnit: 3200, // Standing pouch aluminium foil retort grade + zipper
    laborCostPerUnit: 2000,
    sellingPricePerUnit: 28000,
    shelfLifeMonths: 6,
    complexityLevel: 'Rendah',
  },
  {
    id: 'prod-bubuk-cabai-kering',
    commodityId: 'cabai-rawit-merah',
    sourceCommodityName: 'Cabai Rawit Merah',
    processedProductName: 'Chili Flakes / Abon Cabai Kering 80g',
    rawMaterialNeededKg: 0.35, // Susut pengeringan ~75-80%
    processingCostPerUnit: 4000, // Dehydrator listrik & bumbu gurih
    packagingCostPerUnit: 3000, // Botol bumbu putar (flapper shaker)
    laborCostPerUnit: 2000,
    sellingPricePerUnit: 25000,
    shelfLifeMonths: 18,
    complexityLevel: 'Sedang',
  },
  {
    id: 'prod-bawang-goreng-toples',
    commodityId: 'bawang-merah-brebes',
    sourceCommodityName: 'Bawang Merah Brebes',
    processedProductName: 'Bawang Goreng Renyah Original Grade A Toples 150g',
    rawMaterialNeededKg: 0.5, // 500g umbi basah menghasilkan ~150g goreng kering
    processingCostPerUnit: 7000, // Minyak nabati berkualitas & garam
    packagingCostPerUnit: 4000, // Toples tabung PET tebal + aluminium foil seal
    laborCostPerUnit: 3000, // Pengupasan, perajangan, penggorengan
    sellingPricePerUnit: 38000,
    shelfLifeMonths: 8,
    complexityLevel: 'Rendah',
  },
  {
    id: 'prod-pasta-bawang-merah',
    commodityId: 'bawang-merah-brebes',
    sourceCommodityName: 'Bawang Merah Brebes',
    processedProductName: 'Pasta Bawang Merah Siap Masak Jar 250g',
    rawMaterialNeededKg: 0.3,
    processingCostPerUnit: 4500, // Minyak pengawet alami, garam dapur
    packagingCostPerUnit: 3800, // Jar kaca + seal vacuum
    laborCostPerUnit: 2000,
    sellingPricePerUnit: 27000,
    shelfLifeMonths: 4,
    complexityLevel: 'Rendah',
  },
  {
    id: 'prod-saus-tomat-artisan',
    commodityId: 'tomat-servo',
    sourceCommodityName: 'Tomat Servo / Apel',
    processedProductName: 'Artisan Pasta & Ketchup Tomat Segar 300ml',
    rawMaterialNeededKg: 0.8, // 800g tomat matang per botol
    processingCostPerUnit: 6000, // Cuka apel, rempah oregano, gula tebu
    packagingCostPerUnit: 4800, // Botol saus kaca vintage + shrink sleeve
    laborCostPerUnit: 3500, // Reduksi & sterilisasi pasteurisasi
    sellingPricePerUnit: 36000,
    shelfLifeMonths: 9,
    complexityLevel: 'Sedang',
  },
  {
    id: 'prod-sun-dried-tomato',
    commodityId: 'tomat-cherry-hidroponik',
    sourceCommodityName: 'Tomat Cherry Hidroponik',
    processedProductName: 'Sun-Dried Cherry Tomato in Extra Virgin Olive Oil 200g',
    rawMaterialNeededKg: 0.7, // Pengeringan tomat cherry
    processingCostPerUnit: 14000, // Extra virgin olive oil, rosemary, garlic
    packagingCostPerUnit: 5000, // Jar kaca segi enam premium + pita
    laborCostPerUnit: 4000,
    sellingPricePerUnit: 65000,
    shelfLifeMonths: 12,
    complexityLevel: 'Sedang',
  },
  {
    id: 'prod-serbuk-jahe-merah',
    commodityId: 'jahe-merah-gajah',
    sourceCommodityName: 'Jahe Merah Super',
    processedProductName: 'Serbuk Jahe Merah Instan Gula Aren Kristal 200g',
    rawMaterialNeededKg: 0.4, // Ekstraksi rimpang
    processingCostPerUnit: 8000, // Gula aren kelapa murni, habbatussauda, sereh
    packagingCostPerUnit: 3500, // Pouch standing zipper doff printing
    laborCostPerUnit: 3000, // Kristalisasi wajan baja
    sellingPricePerUnit: 35000,
    shelfLifeMonths: 12,
    complexityLevel: 'Sedang',
  },
  {
    id: 'prod-selai-melon-golden',
    commodityId: 'melon-golden-aroma',
    sourceCommodityName: 'Melon Golden Aroma Hidroponik',
    processedProductName: 'Melon Golden Spread / Confiture Jam 220g',
    rawMaterialNeededKg: 0.6,
    processingCostPerUnit: 7000, // Pektin buah alami, jus lemon, gula tebu
    packagingCostPerUnit: 4200, // Jar kaca hexagonal + kain penutup rami
    laborCostPerUnit: 3000,
    sellingPricePerUnit: 42000,
    shelfLifeMonths: 10,
    complexityLevel: 'Sedang',
  },
  {
    id: 'prod-cold-pressed-juice',
    commodityId: 'selada-keriting-hidroponik',
    sourceCommodityName: 'Selada Keriting & Sayur Daun',
    processedProductName: 'Green Detox Cold-Pressed Juice 250ml',
    rawMaterialNeededKg: 0.35, // Selada, kale/timun, apel
    processingCostPerUnit: 5000, // Tambahan lemon & madu
    packagingCostPerUnit: 2500, // Botol PET food grade 250ml + tamper seal
    laborCostPerUnit: 2500, // Cold press extractor bertekanan
    sellingPricePerUnit: 26000,
    shelfLifeMonths: 1, // Ready to drink dingin
    complexityLevel: 'Rendah',
  },
  {
    id: 'prod-roast-beans-kopi',
    commodityId: 'kopi-arabika-gayo',
    sourceCommodityName: 'Kopi Arabika Specialty',
    processedProductName: 'Roasted Whole Bean Specialty Gusset Pouch 200g',
    rawMaterialNeededKg: 0.25, // Green bean susut roasting ~15-18%
    processingCostPerUnit: 12000, // Jasa roasting drum roaster + cupping QC
    packagingCostPerUnit: 5500, // Pouch one-way degassing valve foil zipper
    laborCostPerUnit: 3000,
    sellingPricePerUnit: 75000,
    shelfLifeMonths: 12,
    complexityLevel: 'Tinggi',
  },
  {
    id: 'prod-ekstrak-vanilla',
    commodityId: 'vanili-planifolia',
    sourceCommodityName: 'Vanili Polong Planifolia Gourmet',
    processedProductName: 'Pure Vanilla Extract Bottle 100ml',
    rawMaterialNeededKg: 0.05, // 50g polong vanili grade A per 100ml
    processingCostPerUnit: 18000, // Pelarut gliserin/alkohol food grade, maserasi 3 bulan
    packagingCostPerUnit: 6000, // Botol kaca amber gelap penetes pipet
    laborCostPerUnit: 5000,
    sellingPricePerUnit: 125000,
    shelfLifeMonths: 24,
    complexityLevel: 'Tinggi',
  },
  {
    id: 'prod-beras-vakum-premium',
    commodityId: 'padi-pandanwangi',
    sourceCommodityName: 'Padi Pandanwangi Cianjur',
    processedProductName: 'Beras Organik Pandanwangi Kemasan Vakum Bata 2.5 kg',
    rawMaterialNeededKg: 4.0, // Gabah ke beras giling rendemen ~62%
    processingCostPerUnit: 5000, // Huller polishing & sortasi menir
    packagingCostPerUnit: 4500, // Plastik nylon vacuum tebal 120 micron + box jinjing
    laborCostPerUnit: 2500,
    sellingPricePerUnit: 65000,
    shelfLifeMonths: 18,
    complexityLevel: 'Rendah',
  },
];
