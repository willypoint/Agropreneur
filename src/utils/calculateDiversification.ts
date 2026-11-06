import { DiversifiedProduct } from '../types';

export interface DiversificationCalculationResult {
  unitsProduced: number;
  rawMaterialCostPerUnit: number;
  cogsPerUnit: number; // HPP per unit olahan
  totalFreshRevenue: number; // Omzet jika dijual mentah/segar
  totalProcessedRevenue: number; // Omzet produk olahan
  totalProcessingCost: number; // Biaya bumbu, kemasan, tenaga kerja
  totalProductionCost: number; // Total biaya olah
  netProfitProcessed: number; // Laba bersih dari pengolahan
  valueAddDelta: number; // Selisih keuntungan ekstra dibanding jual segar
  valueAddPercentage: number; // Kenaikan nilai (%)
  valueMultiplier: number; // Lipatan nilai (x lipat)
  marginPercentage: number; // Margin laba produk olahan (%)
  shelfLifeComparison: {
    freshDays: number;
    processedDays: number;
    multiplier: number;
  };
}

export function calculateDiversificationEconomics(
  product: DiversifiedProduct,
  batchVolumeKg: number,
  freshMarketPricePerKg: number
): DiversificationCalculationResult {
  const safeVolume = Math.max(0, batchVolumeKg || 0);
  const safePrice = Math.max(0, freshMarketPricePerKg || 0);
  const safeNeeded = Math.max(0.01, product.rawMaterialNeededKg || 0.1);

  // Total unit yang dihasilkan dari batch bahan baku segar
  const unitsProduced = Math.floor(safeVolume / safeNeeded);

  // Biaya bahan baku per unit
  const rawMaterialCostPerUnit = safePrice * safeNeeded;

  // HPP (Harga Pokok Produksi) per unit olahan
  const cogsPerUnit =
    rawMaterialCostPerUnit +
    (product.processingCostPerUnit || 0) +
    (product.packagingCostPerUnit || 0) +
    (product.laborCostPerUnit || 0);

  // Omzet jika panen dijual mentah segar
  const totalFreshRevenue = safeVolume * safePrice;

  // Omzet produk olahan
  const totalProcessedRevenue = unitsProduced * (product.sellingPricePerUnit || 0);

  // Total biaya pemrosesan (bumbu, kemasan, tenaga kerja di luar bahan baku)
  const processingCostOnlyPerUnit =
    (product.processingCostPerUnit || 0) +
    (product.packagingCostPerUnit || 0) +
    (product.laborCostPerUnit || 0);
  const totalProcessingCost = unitsProduced * processingCostOnlyPerUnit;

  // Total biaya produksi termasuk bahan baku
  const totalProductionCost = unitsProduced * cogsPerUnit;

  // Laba bersih produk olahan
  const netProfitProcessed = Math.max(0, totalProcessedRevenue - totalProductionCost);

  // Nilai tambah ekstra bersih dibanding hanya menjual segar
  // (Omzet olahan - total biaya proses - omzet dasar bahan baku yang dikorbankan)
  const valueAddDelta = totalProcessedRevenue - totalFreshRevenue - totalProcessingCost;

  // Persentase kenaikan nilai
  const valueAddPercentage =
    totalFreshRevenue > 0
      ? ((totalProcessedRevenue - totalFreshRevenue) / totalFreshRevenue) * 100
      : 0;

  // Lipatan nilai (omzet olahan / omzet segar)
  const valueMultiplier = totalFreshRevenue > 0 ? totalProcessedRevenue / totalFreshRevenue : 0;

  // Margin keuntungan produk olahan (%)
  const marginPercentage =
    product.sellingPricePerUnit > 0
      ? ((product.sellingPricePerUnit - cogsPerUnit) / product.sellingPricePerUnit) * 100
      : 0;

  const freshDays = 7; // Rata-rata komoditas hortikultura segar tahan 5-7 hari
  const processedDays = (product.shelfLifeMonths || 6) * 30;
  const shelfLifeMultiplier = Math.round(processedDays / freshDays);

  return {
    unitsProduced,
    rawMaterialCostPerUnit,
    cogsPerUnit,
    totalFreshRevenue,
    totalProcessedRevenue,
    totalProcessingCost,
    totalProductionCost,
    netProfitProcessed,
    valueAddDelta,
    valueAddPercentage,
    valueMultiplier,
    marginPercentage,
    shelfLifeComparison: {
      freshDays,
      processedDays,
      multiplier: shelfLifeMultiplier,
    },
  };
}
