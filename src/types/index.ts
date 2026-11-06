export type NavigationTab = 
  | 'dashboard' 
  | 'catalog' 
  | 'simulator' 
  | 'market' 
  | 'sop' 
  | 'diversification' 
  | 'farmJourney' 
  | 'portfolio';

// 1. Skema Diversifikasi Produk
export interface DiversifiedProduct {
  id: string;
  commodityId: string;
  sourceCommodityName: string; // misal: "Cabai Rawit Merah"
  processedProductName: string; // misal: "Chili Oil Premium 150ml"
  rawMaterialNeededKg: number; // Kebutuhan bahan baku segar per unit olahan (misal: 0.25 kg)
  processingCostPerUnit: number; // Biaya bumbu, minyak, gas per unit
  packagingCostPerUnit: number; // Biaya botol kaca, segel, stiker label
  laborCostPerUnit: number; // Biaya tenaga kerja per unit
  sellingPricePerUnit: number; // Harga jual produk olahan
  shelfLifeMonths: number; // Masa simpan / kedaluwarsa (bulan)
  complexityLevel: 'Rendah' | 'Sedang' | 'Tinggi';
}

// 2. Skema Kebun Aktif Pengguna
export interface FarmProject {
  id: string;
  name: string; // Nama kebun, misal: "Kebun Cabai Blok A"
  commodityName: string;
  plantingDate: string;
  targetHarvestDate: string;
  landAreaM2: number;
  projectedBudget: number; // Anggaran rencana dari simulator
  projectedYieldKg: number; // Target panen rencana dari simulator
  status: 'Persiapan' | 'Penanaman' | 'Pemeliharaan' | 'Siap Panen' | 'Selesai';
  costs: Array<{ id: string; date: string; category: string; amount: number; note: string }>;
  logs: Array<{ id: string; date: string; activity: 'Penyiraman' | 'Pemupukan' | 'Pengendalian Hama' | 'Monitoring'; note: string }>;
  actualHarvest?: {
    harvestDate: string;
    actualYieldKg: number;
    sellingPricePerKg: number;
    actualRevenue: number;
  };
}

export type CommodityCategory = 'hortikultura' | 'buah' | 'pangan' | 'perkebunan' | 'hidroponik';

export interface Commodity {
  id: string;
  name: string;
  scientificName: string;
  category: CommodityCategory;
  categoryLabel: string;
  cycleDays: number; // HST (Hari Setelah Tanam)
  optimalAltitude: string; // e.g. "0 - 800 mdpl"
  waterRequirement: 'Rendah' | 'Sedang' | 'Tinggi';
  riskLevel: 'Rendah' | 'Sedang' | 'Tinggi';
  suitableSeason: 'Kemarau' | 'Hujan' | 'Sepanjang Tahun';
  avgCapexPer1000m2: number;
  avgOpexPerCycle: number;
  defaultYieldKgPer1000m2: number;
  defaultPricePerKg: number;
  priceRange: { min: number; max: number; avg: number };
  image: string;
  description: string;
  keyAdvantages: string[];
  keyRisks: string[];
  targetMarkets: string[];
  tags?: string[];
  isCustom?: boolean;
}

export interface CostItem {
  id: string;
  name: string;
  category: 'capex' | 'opex';
  unit: string;
  qty: number;
  unitPrice: number;
  total: number;
  note?: string;
}

export interface SimulationParameters {
  commodityId: string;
  commodityName: string;
  landArea: number;
  areaUnit: 'm2' | 'ha' | 'polybag';
  capexItems: CostItem[];
  opexItems: CostItem[];
  estimatedYieldKg: number;
  sellingPricePerKg: number;
  priceVariationPct: number; // -40% to +30%
  yieldVariationPct: number; // -50% to 0%
}

export interface FinancialCalculationResult {
  totalCapex: number;
  totalOpex: number;
  totalInvestment: number;
  effectiveYieldKg: number;
  effectivePricePerKg: number;
  grossRevenue: number;
  netProfit: number;
  monthlyProfit: number;
  hppPerKg: number; // Harga Pokok Produksi per kg
  bepKg: number; // Titik Impas volume panen
  bepRpPerKg: number; // Titik Impas harga jual
  roiPct: number; // Laba / Total Modal %
  bcRatio: number; // Benefit to Cost ratio
  paybackPeriodCycles: number;
  financialFeasibilityStatus: 'Sangat Layak' | 'Layak' | 'Perlu Efisiensi' | 'Risiko Tinggi';
}

export interface SavedScenario {
  id: string;
  title: string;
  createdAt: string;
  commodityId: string;
  commodityName: string;
  landArea: number;
  areaUnit: 'm2' | 'ha' | 'polybag';
  totalCapex: number;
  totalOpex: number;
  grossRevenue: number;
  netProfit: number;
  roiPct: number;
  bepKg: number;
  notes?: string;
}

export interface MarketPriceItem {
  id: string;
  commodityName: string;
  category: string;
  currentPrice: number;
  previousPrice: number;
  changePct: number;
  unit: string;
  region: string;
  trend: 'up' | 'down' | 'stable';
  history7Days: number[];
  highestRegion: string;
  lowestRegion: string;
}

export interface SOPPhase {
  week: string;
  title: string;
  description: string;
  tasks: Array<{ id: string; text: string; done?: boolean }>;
  tips: string;
  keyInputs: string;
}
