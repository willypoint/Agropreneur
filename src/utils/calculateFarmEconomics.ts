/**
 * calculateFarmEconomics.ts
 * Core Financial Engine & Mathematical Architecture for AGROPRENEUR
 * Strictly adheres to agricultural business modeling specifications.
 */

export interface FarmInputs {
  commodityName: string;
  cycleDays: number; // HST (Hari Setelah Tanam)
  landAreaM2: number;
  plantPopulation: number;
  productivityPerPlantKg: number; // kg per pohon/titik tanam
  shrinkagePct: number; // Persentase susut / kehilangan hasil (0-50%)
  targetPricePerKg: number;

  // Capex (Investasi Awal)
  capexTotal: number;

  // Opex itemized breakdown
  seedCost: number; // Benih
  fertilizerCost: number; // Pupuk (organik & anorganik)
  pesticideCost: number; // Pestisida & fungisida
  laborCost: number; // Upah Tenaga Kerja olah, rawat & panen
  utilitiesCost: number; // Air & Listrik
  packagingCost: number; // Kemasan & keranjang
  transportCost: number; // Transportasi & distribusi
  fixedOperatingCost: number; // Biaya sewa lahan musim & penyusutan alat kecil

  // Agropreneur score helpers
  agronomicEaseScore?: number; // 0-100
  marketLiquidityScore?: number; // 0-100
}

export interface FarmEconomicsResult {
  // Yield and Revenue
  grossYieldKg: number;
  netYieldKg: number; // Yield Netto
  grossRevenue: number; // Omzet
  
  // Cost breakdown
  totalOpex: number;
  costBreakdown: {
    seed: number;
    fertilizer: number;
    pesticide: number;
    labor: number;
    utilities: number;
    packaging: number;
    transport: number;
    fixedOperating: number;
  };
  costPercentages: {
    seed: number;
    fertilizer: number;
    pesticide: number;
    labor: number;
    utilities: number;
    packaging: number;
    transport: number;
    fixedOperating: number;
  };

  // Profitability
  netProfit: number; // Laba Bersih
  profitMarginPct: number; // Margin (%)
  monthlyNetProfit: number;
  hppPerKg: number; // Harga Pokok Produksi per kg

  // Break-Even Point (BEP)
  bepQuantityKg: number; // BEP Fisik (kg)
  bepRevenueRp: number; // BEP Omzet (Rp)
  bepPricePerKg: number; // BEP Harga per kg

  // Capital Return
  capexTotal: number;
  paybackPeriodCycles: number; // Waktu Balik Modal dalam siklus panen
  paybackPeriodMonths: number;
  isProfitable: boolean;

  // Agropreneur Score Engine (0-100)
  scoreTotal: number;
  scoreBreakdown: {
    margin: number;
    harvestSpeed: number;
    farmingEase: number;
    capitalAccess: number;
    diversification: number;
  };
  scoreCategory: 'Sangat Layak & Potensial' | 'Cukup Menjanjikan' | 'Risiko Tinggi / Margin Tipis';
  scoreBadgeColor: string; // Hex color
  positiveDrivers: string[];
  riskFactors: string[];
}

export type WhatIfScenarioMode = 'normal' | 'market_crash' | 'crop_loss' | 'cost_hike';

export interface WhatIfScenarioResult {
  mode: WhatIfScenarioMode;
  title: string;
  description: string;
  grossRevenue: number;
  totalOpex: number;
  netProfit: number;
  profitMarginPct: number;
  hppPerKg: number;
  deltaNetProfit: number;
  deltaProfitPct: number;
  isProfitable: boolean;
  toleranceStatus: 'Untung Optimal' | 'Toleransi Laba Menipis' | 'Zona Rugi (Kritis)';
}

/**
 * Format currency to IDR with no fractional decimals.
 */
export function formatIDR(amount: number): string {
  if (isNaN(amount) || !isFinite(amount)) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

/**
 * Format number with thousand separators.
 */
export function formatNumber(val: number, decimals: number = 0): string {
  if (isNaN(val) || !isFinite(val)) return '0';
  return new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(val);
}

/**
 * Core Mathematical Engine: Calculate all farm business metrics with full NaN protections.
 */
export function calculateFarmEconomics(inputs: FarmInputs): FarmEconomicsResult {
  const {
    cycleDays = 60,
    plantPopulation = 1000,
    productivityPerPlantKg = 1.0,
    shrinkagePct = 10,
    targetPricePerKg = 20000,
    capexTotal = 0,
    seedCost = 0,
    fertilizerCost = 0,
    pesticideCost = 0,
    laborCost = 0,
    utilitiesCost = 0,
    packagingCost = 0,
    transportCost = 0,
    fixedOperatingCost = 0,
  } = inputs;

  // 1. Hasil Panen (Gross & Netto)
  const safePopulation = Math.max(0, plantPopulation);
  const safeProductivity = Math.max(0, productivityPerPlantKg);
  const safeShrinkage = Math.min(100, Math.max(0, shrinkagePct));

  const grossYieldKg = safePopulation * safeProductivity;
  const netYieldKg = Math.max(0, grossYieldKg * (1 - safeShrinkage / 100));

  // 2. Omzet / Pendapatan Kotor (Gross Revenue)
  const safePrice = Math.max(0, targetPricePerKg);
  const grossRevenue = netYieldKg * safePrice;

  // 3. Total Biaya Operasional per Siklus (Opex)
  const safeSeed = Math.max(0, seedCost);
  const safeFertilizer = Math.max(0, fertilizerCost);
  const safePesticide = Math.max(0, pesticideCost);
  const safeLabor = Math.max(0, laborCost);
  const safeUtilities = Math.max(0, utilitiesCost);
  const safePackaging = Math.max(0, packagingCost);
  const safeTransport = Math.max(0, transportCost);
  const safeFixedOperating = Math.max(0, fixedOperatingCost);

  const totalOpex =
    safeSeed +
    safeFertilizer +
    safePesticide +
    safeLabor +
    safeUtilities +
    safePackaging +
    safeTransport +
    safeFixedOperating;

  // Cost Breakdown Percentages
  const getPct = (val: number) => (totalOpex > 0 ? (val / totalOpex) * 100 : 0);
  const costBreakdown = {
    seed: safeSeed,
    fertilizer: safeFertilizer,
    pesticide: safePesticide,
    labor: safeLabor,
    utilities: safeUtilities,
    packaging: safePackaging,
    transport: safeTransport,
    fixedOperating: safeFixedOperating,
  };
  const costPercentages = {
    seed: Number(getPct(safeSeed).toFixed(1)),
    fertilizer: Number(getPct(safeFertilizer).toFixed(1)),
    pesticide: Number(getPct(safePesticide).toFixed(1)),
    labor: Number(getPct(safeLabor).toFixed(1)),
    utilities: Number(getPct(safeUtilities).toFixed(1)),
    packaging: Number(getPct(safePackaging).toFixed(1)),
    transport: Number(getPct(safeTransport).toFixed(1)),
    fixedOperating: Number(getPct(safeFixedOperating).toFixed(1)),
  };

  // 4. Laba Bersih per Siklus
  const netProfit = grossRevenue - totalOpex;
  const isProfitable = netProfit > 0;

  // 5. Margin Keuntungan (%)
  const profitMarginPct = grossRevenue > 0 ? Number(((netProfit / grossRevenue) * 100).toFixed(1)) : 0;

  // Monthly Equivalent Profit
  const cycleInMonths = Math.max(0.5, (cycleDays || 60) / 30);
  const monthlyNetProfit = Math.round(netProfit / cycleInMonths);

  // 6. Harga Pokok Produksi (HPP) per kg
  const hppPerKg = netYieldKg > 0 ? Math.round(totalOpex / netYieldKg) : 0;

  // 7. Break-Even Point (BEP)
  // Variable cost per kg = (Total Opex - Fixed Operating) / Net Yield
  const totalVariableCost =
    safeSeed + safeFertilizer + safePesticide + safeLabor + safeUtilities + safePackaging + safeTransport;
  const variableCostPerKg = netYieldKg > 0 ? totalVariableCost / netYieldKg : 0;

  // Protect against division by zero:
  const contributionMarginPerKg = safePrice - variableCostPerKg;
  let bepQuantityKg = 0;
  if (contributionMarginPerKg > 0) {
    bepQuantityKg = Math.round(safeFixedOperating / contributionMarginPerKg);
  } else if (safePrice > 0) {
    // Fallback: total opex / price
    bepQuantityKg = Math.round(totalOpex / safePrice);
  }

  // BEP Price per Kg (Harga Impas agar Omzet = Opex)
  const bepPricePerKg = netYieldKg > 0 ? Math.round(totalOpex / netYieldKg) : 0;
  const bepRevenueRp = Math.round(bepQuantityKg * safePrice);

  // 8. Payback Period (Waktu Balik Modal Investasi Awal)
  const safeCapex = Math.max(0, capexTotal);
  let paybackPeriodCycles = 0;
  if (isProfitable && netProfit > 0) {
    paybackPeriodCycles = safeCapex > 0 ? Number((safeCapex / netProfit).toFixed(1)) : 0;
  } else {
    paybackPeriodCycles = 99; // Negative/zero profit cannot payback Capex
  }
  const paybackPeriodMonths = Number((paybackPeriodCycles * cycleInMonths).toFixed(1));

  // -------------------------------------------------------------
  // 9. MESIN AGROPRENEUR SCORE (0–100)
  // Formula: (Margin * 0.30) + (Kecepatan Panen * 0.20) + (Kemudahan Budidaya * 0.20) + (Akses Modal * 0.15) + (Diversifikasi * 0.15)
  // -------------------------------------------------------------

  // a. Skor Margin (0-100)
  let scoreMargin = 0;
  if (profitMarginPct >= 50) scoreMargin = 100;
  else if (profitMarginPct >= 35) scoreMargin = 85;
  else if (profitMarginPct >= 20) scoreMargin = 70;
  else if (profitMarginPct >= 5) scoreMargin = 50;
  else if (profitMarginPct >= 0) scoreMargin = 30;
  else scoreMargin = 0;

  // b. Skor Kecepatan Panen (0-100)
  let scoreHarvestSpeed = 0;
  if (cycleDays <= 35) scoreHarvestSpeed = 100;
  else if (cycleDays <= 65) scoreHarvestSpeed = 85;
  else if (cycleDays <= 95) scoreHarvestSpeed = 70;
  else if (cycleDays <= 130) scoreHarvestSpeed = 55;
  else scoreHarvestSpeed = 40;

  // c. Skor Kemudahan Budidaya (0-100)
  let scoreFarmingEase = inputs.agronomicEaseScore || 75;

  // d. Skor Akses Permodalan (0-100): semakin terjangkau modal, semakin tinggi skornya
  const initialCapitalNeeded = safeCapex + totalOpex;
  let scoreCapitalAccess = 70;
  if (initialCapitalNeeded <= 10000000) scoreCapitalAccess = 95;
  else if (initialCapitalNeeded <= 25000000) scoreCapitalAccess = 85;
  else if (initialCapitalNeeded <= 50000000) scoreCapitalAccess = 70;
  else if (initialCapitalNeeded <= 100000000) scoreCapitalAccess = 55;
  else scoreCapitalAccess = 40;

  // e. Skor Diversifikasi Pasar (0-100)
  let scoreDiversification = inputs.marketLiquidityScore || 80;

  const scoreTotalCalculated =
    scoreMargin * 0.3 +
    scoreHarvestSpeed * 0.2 +
    scoreFarmingEase * 0.2 +
    scoreCapitalAccess * 0.15 +
    scoreDiversification * 0.15;

  const scoreTotal = Math.min(100, Math.max(0, Math.round(scoreTotalCalculated)));

  let scoreCategory: FarmEconomicsResult['scoreCategory'] = 'Cukup Menjanjikan';
  let scoreBadgeColor = '#F4B544'; // Gold
  if (scoreTotal >= 80) {
    scoreCategory = 'Sangat Layak & Potensial';
    scoreBadgeColor = '#2E7D32'; // Green
  } else if (scoreTotal >= 60) {
    scoreCategory = 'Cukup Menjanjikan';
    scoreBadgeColor = '#F4B544'; // Gold
  } else {
    scoreCategory = 'Risiko Tinggi / Margin Tipis';
    scoreBadgeColor = '#D9534F'; // Red
  }

  // Generate Driving Factors & Risk Factors
  const positiveDrivers: string[] = [];
  const riskFactors: string[] = [];

  if (profitMarginPct >= 35) {
    positiveDrivers.push(`Margin profit tebal (${profitMarginPct}%) memberikan bantalan aman terhadap penurunan harga pasar.`);
  } else if (profitMarginPct < 15 && isProfitable) {
    riskFactors.push(`Margin profit tipis (${profitMarginPct}%); rentan merugi bila terjadi kenaikan harga saprotan.`);
  } else if (!isProfitable) {
    riskFactors.push(`Usaha saat ini berada dalam posisi defisit (rugi ${formatIDR(Math.abs(netProfit))}).`);
  }

  if (cycleDays <= 45) {
    positiveDrivers.push(`Siklus panen kilat (${cycleDays} HST) mempercepat perputaran arus kas hingga 8-10 kali per tahun.`);
  } else if (cycleDays > 120) {
    riskFactors.push(`Masa tunggu panen cukup panjang (${cycleDays} HST); membutuhkan cadangan kas operasional yang memadai.`);
  }

  if (safeShrinkage <= 10) {
    positiveDrivers.push(`Estimasi susut panen terkontrol (${safeShrinkage}%), memaksimalkan tonase panen layak jual.`);
  } else if (safeShrinkage >= 20) {
    riskFactors.push(`Tingkat susut/afkir tinggi (${safeShrinkage}%); perbaiki teknik panen dan perlindungan hama.`);
  }

  if (paybackPeriodCycles <= 2 && safeCapex > 0 && isProfitable) {
    positiveDrivers.push(`Balik modal investasi awal sangat cepat (~${paybackPeriodCycles} siklus panen).`);
  } else if (paybackPeriodCycles > 5 && safeCapex > 0) {
    riskFactors.push(`Waktu balik modal capex membutuhkan lebih dari ${paybackPeriodCycles} siklus panen.`);
  }

  if (costPercentages.labor >= 40) {
    riskFactors.push(`Porsi upah tenaga kerja mendominasi (${costPercentages.labor}% Opex); pertimbangkan mekanisasi atau irigasi tetes.`);
  }

  if (positiveDrivers.length === 0) {
    positiveDrivers.push('Komoditas memiliki serapan pasar harian yang stabil di tingkat pengecer.');
  }

  return {
    grossYieldKg: Math.round(grossYieldKg),
    netYieldKg: Math.round(netYieldKg),
    grossRevenue: Math.round(grossRevenue),
    totalOpex: Math.round(totalOpex),
    costBreakdown,
    costPercentages,
    netProfit: Math.round(netProfit),
    profitMarginPct,
    monthlyNetProfit,
    hppPerKg,
    bepQuantityKg,
    bepRevenueRp,
    bepPricePerKg,
    capexTotal: Math.round(safeCapex),
    paybackPeriodCycles,
    paybackPeriodMonths,
    isProfitable,
    scoreTotal,
    scoreBreakdown: {
      margin: scoreMargin,
      harvestSpeed: scoreHarvestSpeed,
      farmingEase: scoreFarmingEase,
      capitalAccess: scoreCapitalAccess,
      diversification: scoreDiversification,
    },
    scoreCategory,
    scoreBadgeColor,
    positiveDrivers,
    riskFactors,
  };
}

/**
 * Compute What-If Scenario outputs comparing with baseline.
 */
export function calculateWhatIfScenarios(baseInputs: FarmInputs): Record<WhatIfScenarioMode, WhatIfScenarioResult> {
  const baseResult = calculateFarmEconomics(baseInputs);

  // 1. Normal Scenario
  const normal: WhatIfScenarioResult = {
    mode: 'normal',
    title: 'Skenario Normal (Kondisi Lapangan Ideal)',
    description: 'Sesuai dengan estimasi parameter dan harga jual acuan saat ini.',
    grossRevenue: baseResult.grossRevenue,
    totalOpex: baseResult.totalOpex,
    netProfit: baseResult.netProfit,
    profitMarginPct: baseResult.profitMarginPct,
    hppPerKg: baseResult.hppPerKg,
    deltaNetProfit: 0,
    deltaProfitPct: 0,
    isProfitable: baseResult.isProfitable,
    toleranceStatus: baseResult.netProfit > 0 ? 'Untung Optimal' : 'Zona Rugi (Kritis)',
  };

  // 2. Pasar Jatuh: Harga jual turun 20%
  const marketCrashInputs: FarmInputs = {
    ...baseInputs,
    targetPricePerKg: Math.max(0, baseInputs.targetPricePerKg * 0.8), // Turun 20%
  };
  const marketCrashRes = calculateFarmEconomics(marketCrashInputs);
  const deltaMarketCrash = marketCrashRes.netProfit - baseResult.netProfit;
  const marketCrash: WhatIfScenarioResult = {
    mode: 'market_crash',
    title: 'Skenario Pasar Jatuh (-20% Harga Jual)',
    description: 'Simulasi jika harga komoditas di pasar induk anjlok 20% akibat oversupply sentra panen lain.',
    grossRevenue: marketCrashRes.grossRevenue,
    totalOpex: marketCrashRes.totalOpex,
    netProfit: marketCrashRes.netProfit,
    profitMarginPct: marketCrashRes.profitMarginPct,
    hppPerKg: marketCrashRes.hppPerKg,
    deltaNetProfit: deltaMarketCrash,
    deltaProfitPct: baseResult.netProfit !== 0 ? Number(((deltaMarketCrash / Math.abs(baseResult.netProfit)) * 100).toFixed(1)) : 0,
    isProfitable: marketCrashRes.isProfitable,
    toleranceStatus: marketCrashRes.netProfit > 0 ? 'Toleransi Laba Menipis' : 'Zona Rugi (Kritis)',
  };

  // 3. Gagal Panen/Hama: Susut panen naik 30%
  const cropLossInputs: FarmInputs = {
    ...baseInputs,
    shrinkagePct: Math.min(95, (baseInputs.shrinkagePct || 10) + 30), // Susut bertambah 30%
  };
  const cropLossRes = calculateFarmEconomics(cropLossInputs);
  const deltaCropLoss = cropLossRes.netProfit - baseResult.netProfit;
  const cropLoss: WhatIfScenarioResult = {
    mode: 'crop_loss',
    title: 'Skenario Gagal Panen & Hama (+30% Susut Hasil)',
    description: 'Simulasi kehilangan tonase panen sebesar 30% akibat cuaca ekstrem, serangan jamur, atau hama penggerek.',
    grossRevenue: cropLossRes.grossRevenue,
    totalOpex: cropLossRes.totalOpex,
    netProfit: cropLossRes.netProfit,
    profitMarginPct: cropLossRes.profitMarginPct,
    hppPerKg: cropLossRes.hppPerKg,
    deltaNetProfit: deltaCropLoss,
    deltaProfitPct: baseResult.netProfit !== 0 ? Number(((deltaCropLoss / Math.abs(baseResult.netProfit)) * 100).toFixed(1)) : 0,
    isProfitable: cropLossRes.isProfitable,
    toleranceStatus: cropLossRes.netProfit > 0 ? 'Toleransi Laba Menipis' : 'Zona Rugi (Kritis)',
  };

  // 4. Kenaikan Biaya: Biaya pupuk & pestisida naik 15%
  const costHikeInputs: FarmInputs = {
    ...baseInputs,
    fertilizerCost: Math.round(baseInputs.fertilizerCost * 1.15),
    pesticideCost: Math.round(baseInputs.pesticideCost * 1.15),
  };
  const costHikeRes = calculateFarmEconomics(costHikeInputs);
  const deltaCostHike = costHikeRes.netProfit - baseResult.netProfit;
  const costHike: WhatIfScenarioResult = {
    mode: 'cost_hike',
    title: 'Skenario Kenaikan Biaya (+15% Pupuk & Pestisida)',
    description: 'Simulasi jika harga sarana produksi pertanian (saprotan) mengalami lonjakan 15%.',
    grossRevenue: costHikeRes.grossRevenue,
    totalOpex: costHikeRes.totalOpex,
    netProfit: costHikeRes.netProfit,
    profitMarginPct: costHikeRes.profitMarginPct,
    hppPerKg: costHikeRes.hppPerKg,
    deltaNetProfit: deltaCostHike,
    deltaProfitPct: baseResult.netProfit !== 0 ? Number(((deltaCostHike / Math.abs(baseResult.netProfit)) * 100).toFixed(1)) : 0,
    isProfitable: costHikeRes.isProfitable,
    toleranceStatus: costHikeRes.netProfit > 0 ? 'Untung Optimal' : 'Zona Rugi (Kritis)',
  };

  return {
    normal,
    market_crash: marketCrash,
    crop_loss: cropLoss,
    cost_hike: costHike,
  };
}

/**
 * Commodity Default Presets for Pakcoy, Cabai Rawit, Tomat, etc.
 */
export const SIMULATOR_QUICK_PRESETS: Record<string, FarmInputs> = {
  pakcoy: {
    commodityName: 'Pakcoy / Sawi Sendok Hidroponik',
    cycleDays: 30,
    landAreaM2: 1000,
    plantPopulation: 8000, // 8.000 titik lubang tanam
    productivityPerPlantKg: 0.25, // 250 gram per tanaman
    shrinkagePct: 5,
    targetPricePerKg: 18000,
    capexTotal: 35000000, // Instalasi pipa NFT & UV greenhouse amortisasi
    seedCost: 450000,
    fertilizerCost: 1850000, // Nutrisi AB Mix
    pesticideCost: 350000, // Pengendali hayati
    laborCost: 2800000,
    utilitiesCost: 650000, // Listrik pompa
    packagingCost: 950000, // Kemasan plastik berlubang
    transportCost: 450000,
    fixedOperatingCost: 500000,
    agronomicEaseScore: 85,
    marketLiquidityScore: 85,
  },
  cabai_rawit: {
    commodityName: 'Cabai Rawit Merah (Ori 212 / Kaliber)',
    cycleDays: 120,
    landAreaM2: 1000,
    plantPopulation: 1800, // 1.800 pohon
    productivityPerPlantKg: 0.75, // ~1.35 ton panen berkali-kali
    shrinkagePct: 8,
    targetPricePerKg: 38000,
    capexTotal: 12500000, // Mulsa, ajir bambu, selang drip
    seedCost: 810000,
    fertilizerCost: 2650000, // Pupuk kandang + NPK + Kalsium
    pesticideCost: 1650000, // Fungisida patek & insektisida thrips
    laborCost: 3200000, // Petik 15x
    utilitiesCost: 250000,
    packagingCost: 450000,
    transportCost: 600000,
    fixedOperatingCost: 650000,
    agronomicEaseScore: 65,
    marketLiquidityScore: 95,
  },
  tomat: {
    commodityName: 'Tomat Dataran Tinggi (Servo F1)',
    cycleDays: 85,
    landAreaM2: 1000,
    plantPopulation: 1500,
    productivityPerPlantKg: 2.0, // 3.000 kg total buah
    shrinkagePct: 10,
    targetPricePerKg: 9500,
    capexTotal: 9500000,
    seedCost: 650000,
    fertilizerCost: 2100000,
    pesticideCost: 1200000,
    laborCost: 2600000,
    utilitiesCost: 300000,
    packagingCost: 750000,
    transportCost: 800000,
    fixedOperatingCost: 500000,
    agronomicEaseScore: 70,
    marketLiquidityScore: 80,
  },
  melon: {
    commodityName: 'Melon Golden Hidroponik (Inthanon)',
    cycleDays: 70,
    landAreaM2: 1000,
    plantPopulation: 1600,
    productivityPerPlantKg: 1.5, // 1 buah 1.5 kg per pohon
    shrinkagePct: 5,
    targetPricePerKg: 28000,
    capexTotal: 38000000,
    seedCost: 5600000,
    fertilizerCost: 3200000,
    pesticideCost: 850000,
    laborCost: 3000000,
    utilitiesCost: 800000,
    packagingCost: 1200000,
    transportCost: 650000,
    fixedOperatingCost: 800000,
    agronomicEaseScore: 75,
    marketLiquidityScore: 90,
  },
  bawang_merah: {
    commodityName: 'Bawang Merah (Bima Brebes / Tajuk)',
    cycleDays: 60,
    landAreaM2: 1000,
    plantPopulation: 25000, // Rumpun umbi
    productivityPerPlantKg: 0.055, // ~1.375 kg umbi panen
    shrinkagePct: 12, // Susut rogol & jemur
    targetPricePerKg: 32000,
    capexTotal: 11000000,
    seedCost: 5400000, // 120 kg umbi bibit
    fertilizerCost: 2400000,
    pesticideCost: 1700000,
    laborCost: 2400000,
    utilitiesCost: 900000, // BBM pompa air
    packagingCost: 400000,
    transportCost: 500000,
    fixedOperatingCost: 600000,
    agronomicEaseScore: 70,
    marketLiquidityScore: 95,
  },
};
