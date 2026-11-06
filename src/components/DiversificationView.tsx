import React, { useState, useMemo, useEffect } from 'react';
import { 
  Sparkles, TrendingUp, PackageCheck, Clock, ShieldCheck, PlusCircle, 
  Trash2, ArrowRight, Calculator, Check, X, Search, Filter, Layers, 
  HelpCircle, ArrowUpRight, Flame, Droplets, AlertCircle
} from 'lucide-react';
import { DiversifiedProduct, Commodity } from '../types';
import { DEFAULT_DIVERSIFIED_PRODUCTS } from '../data/diversifiedProducts';
import { COMMODITIES } from '../data/commodities';
import { calculateDiversificationEconomics } from '../utils/calculateDiversification';
import { formatIDR, formatPercent } from '../utils/calculator';

interface DiversificationViewProps {
  customCommodities?: Commodity[];
  onSelectCommodityForSimulation?: (commodity: Commodity) => void;
  onNavigateToFarmJourney?: (commodityName: string, projectedYieldKg?: number) => void;
  initialCommodityName?: string;
  initialVolumeKg?: number;
}

export const DiversificationView: React.FC<DiversificationViewProps> = ({
  customCommodities = [],
  onSelectCommodityForSimulation,
  onNavigateToFarmJourney,
  initialCommodityName,
  initialVolumeKg,
}) => {
  // Products list in LocalStorage
  const [products, setProducts] = useState<DiversifiedProduct[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('agropreneur_diversified_products');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return DEFAULT_DIVERSIFIED_PRODUCTS;
        }
      }
    }
    return DEFAULT_DIVERSIFIED_PRODUCTS;
  });

  useEffect(() => {
    localStorage.setItem('agropreneur_diversified_products', JSON.stringify(products));
  }, [products]);

  // Selected Product for Active Value-Add Simulation
  const [selectedProduct, setSelectedProduct] = useState<DiversifiedProduct>(() => {
    if (initialCommodityName) {
      const match = products.find(
        (p) => p.sourceCommodityName.toLowerCase().includes(initialCommodityName.toLowerCase())
      );
      if (match) return match;
    }
    return products[0];
  });

  // Simulator Inputs
  const [batchVolumeKg, setBatchVolumeKg] = useState<number>(initialVolumeKg || 50);
  const [freshMarketPricePerKg, setFreshMarketPricePerKg] = useState<number>(30000);

  // Custom Tuning overrides for active simulation
  const [customProcessingCost, setCustomProcessingCost] = useState<number>(selectedProduct.processingCostPerUnit);
  const [customPackagingCost, setCustomPackagingCost] = useState<number>(selectedProduct.packagingCostPerUnit);
  const [customLaborCost, setCustomLaborCost] = useState<number>(selectedProduct.laborCostPerUnit);
  const [customSellingPrice, setCustomSellingPrice] = useState<number>(selectedProduct.sellingPricePerUnit);

  // When selectedProduct changes, sync custom tuning
  useEffect(() => {
    setCustomProcessingCost(selectedProduct.processingCostPerUnit);
    setCustomPackagingCost(selectedProduct.packagingCostPerUnit);
    setCustomLaborCost(selectedProduct.laborCostPerUnit);
    setCustomSellingPrice(selectedProduct.sellingPricePerUnit);
  }, [selectedProduct]);

  // Combine active product with tuned values
  const activeProductWithOverrides: DiversifiedProduct = useMemo(() => {
    return {
      ...selectedProduct,
      processingCostPerUnit: customProcessingCost,
      packagingCostPerUnit: customPackagingCost,
      laborCostPerUnit: customLaborCost,
      sellingPricePerUnit: customSellingPrice,
    };
  }, [selectedProduct, customProcessingCost, customPackagingCost, customLaborCost, customSellingPrice]);

  // Calculation Results
  const calcResult = useMemo(() => {
    return calculateDiversificationEconomics(
      activeProductWithOverrides,
      batchVolumeKg,
      freshMarketPricePerKg
    );
  }, [activeProductWithOverrides, batchVolumeKg, freshMarketPricePerKg]);

  // Search & Filter for Product Catalog
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCommodityFilter, setSelectedCommodityFilter] = useState<string>('all');
  const [complexityFilter, setComplexityFilter] = useState<string>('all');

  // Modal State for New Product Formula
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newForm, setNewForm] = useState({
    sourceCommodityName: 'Cabai Rawit Merah',
    commodityId: 'cabai-rawit-merah',
    processedProductName: '',
    rawMaterialNeededKg: 0.25,
    processingCostPerUnit: 5000,
    packagingCostPerUnit: 3500,
    laborCostPerUnit: 2000,
    sellingPricePerUnit: 30000,
    shelfLifeMonths: 6,
    complexityLevel: 'Rendah' as 'Rendah' | 'Sedang' | 'Tinggi',
  });

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        !searchQuery ||
        p.processedProductName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sourceCommodityName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCommodity =
        selectedCommodityFilter === 'all' || p.sourceCommodityName === selectedCommodityFilter;

      const matchComplexity =
        complexityFilter === 'all' || p.complexityLevel === complexityFilter;

      return matchSearch && matchCommodity && matchComplexity;
    });
  }, [products, searchQuery, selectedCommodityFilter, complexityFilter]);

  // Unique commodities for filter
  const uniqueCommodityNames = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.sourceCommodityName)));
  }, [products]);

  // Handle Add New Custom Formula
  const handleCreateFormula = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newForm.processedProductName.trim()) return;

    const newProd: DiversifiedProduct = {
      id: `prod-${Date.now()}`,
      commodityId: newForm.commodityId,
      sourceCommodityName: newForm.sourceCommodityName,
      processedProductName: newForm.processedProductName.trim(),
      rawMaterialNeededKg: Number(newForm.rawMaterialNeededKg) || 0.25,
      processingCostPerUnit: Number(newForm.processingCostPerUnit) || 5000,
      packagingCostPerUnit: Number(newForm.packagingCostPerUnit) || 3500,
      laborCostPerUnit: Number(newForm.laborCostPerUnit) || 2000,
      sellingPricePerUnit: Number(newForm.sellingPricePerUnit) || 30000,
      shelfLifeMonths: Number(newForm.shelfLifeMonths) || 6,
      complexityLevel: newForm.complexityLevel,
    };

    setProducts((prev) => [newProd, ...prev]);
    setSelectedProduct(newProd);
    setIsModalOpen(false);
    setNewForm({
      sourceCommodityName: 'Cabai Rawit Merah',
      commodityId: 'cabai-rawit-merah',
      processedProductName: '',
      rawMaterialNeededKg: 0.25,
      processingCostPerUnit: 5000,
      packagingCostPerUnit: 3500,
      laborCostPerUnit: 2000,
      sellingPricePerUnit: 30000,
      shelfLifeMonths: 6,
      complexityLevel: 'Rendah',
    });
  };

  // Handle Delete Formula
  const handleDeleteProduct = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (products.length <= 1) return;
    const remaining = products.filter((p) => p.id !== id);
    setProducts(remaining);
    if (selectedProduct.id === id) {
      setSelectedProduct(remaining[0]);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Farm to Product Engine</span>
            </span>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300">
              Solusi Anjloknya Harga Panen
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Simulator Nilai Tambah & Diversifikasi Produk Olahan
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-3xl">
            Hitung peningkatan omzet dan margin ketika hasil panen segar diolah menjadi produk turunan bernilai jual tinggi dengan daya simpan berbulan-bulan.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm flex items-center gap-2 transition-all self-start md:self-auto shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Tambah Formula Olahan Baru</span>
        </button>
      </div>

      {/* CORE SIMULATOR HERO: SIDE-BY-SIDE VALUE-ADD CALCULATOR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive Parameters (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm space-y-5">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                Formula Aktif
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                selectedProduct.complexityLevel === 'Rendah'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : selectedProduct.complexityLevel === 'Sedang'
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
              }`}>
                Teknik: {selectedProduct.complexityLevel}
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
              {selectedProduct.processedProductName}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Bahan Baku: <strong className="text-slate-800 dark:text-slate-200">{selectedProduct.sourceCommodityName}</strong> ({selectedProduct.rawMaterialNeededKg} kg per unit)
            </p>
          </div>

          {/* Volume Batch Input Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Alokasi Hasil Panen yang Diolah
              </label>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 tabular-nums text-sm">
                {batchVolumeKg} Kg
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="1000"
              step="5"
              value={batchVolumeKg}
              onChange={(e) => setBatchVolumeKg(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-100 dark:bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>5 kg (Skala Dapur)</span>
              <span>100 kg (UMKM)</span>
              <span>1.000 kg (Kemitraan)</span>
            </div>
          </div>

          {/* Fresh Selling Price Benchmark */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Harga Jual Bahan Baku Segar di Pasar (Rp/kg)
              </label>
              <span className="font-bold text-slate-900 dark:text-white tabular-nums">
                {formatIDR(freshMarketPricePerKg)}
              </span>
            </div>
            <input
              type="number"
              step="1000"
              min="2000"
              value={freshMarketPricePerKg}
              onChange={(e) => setFreshMarketPricePerKg(Math.max(0, Number(e.target.value)))}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold tabular-nums text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <p className="text-[10px] text-slate-400 italic">
              *Masukkan harga saat panen raya (misal anjlok) untuk melihat efek penyelamatan profit.
            </p>
          </div>

          {/* Unit Cost & Pricing Breakdown Tuners */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-3 text-xs">
            <span className="font-bold text-slate-900 dark:text-white block">
              Parameter Biaya & Harga Produk per Unit
            </span>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">
                  Biaya Bumbu / Bahan Penolong
                </label>
                <input
                  type="number"
                  step="500"
                  value={customProcessingCost}
                  onChange={(e) => setCustomProcessingCost(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 tabular-nums text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">
                  Biaya Kemasan & Label
                </label>
                <input
                  type="number"
                  step="500"
                  value={customPackagingCost}
                  onChange={(e) => setCustomPackagingCost(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 tabular-nums text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">
                  Biaya Upah Kerja Olah
                </label>
                <input
                  type="number"
                  step="500"
                  value={customLaborCost}
                  onChange={(e) => setCustomLaborCost(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 tabular-nums text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold block mb-1">
                  Harga Jual Produk Olahan
                </label>
                <input
                  type="number"
                  step="1000"
                  value={customSellingPrice}
                  onChange={(e) => setCustomSellingPrice(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-white dark:bg-slate-900 border border-emerald-500/60 rounded-lg px-2.5 py-1.5 tabular-nums text-emerald-700 dark:text-emerald-300 font-bold"
                />
              </div>
            </div>
          </div>

          {/* Quick Info Strip */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>Masa Simpan: <strong>{selectedProduct.shelfLifeMonths} Bulan</strong></span>
            </span>
            <span className="flex items-center gap-1.5">
              <PackageCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Yield: <strong>{calcResult.unitsProduced} Pcs</strong></span>
            </span>
          </div>

        </div>

        {/* Right Column: Comparison Result Dashboard (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Top Multiplier Highlight Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white shadow-md relative overflow-hidden">
            <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span>Kenaikan Nilai Tambah (Value-Add Delta)</span>
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl sm:text-4xl font-extrabold tabular-nums text-white">
                    {calcResult.valueMultiplier.toFixed(1)}x Lipat
                  </span>
                  <span className="text-sm sm:text-base font-bold text-amber-300 tabular-nums">
                    (+{formatPercent(calcResult.valueAddPercentage)})
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  Potensi omzet melompat dari {formatIDR(calcResult.totalFreshRevenue)} (segar) menjadi {formatIDR(calcResult.totalProcessedRevenue)} (olahan).
                </p>
              </div>

              <div className="sm:text-right shrink-0">
                <span className="text-xs text-slate-300 block">Ekstra Keuntungan Bersih:</span>
                <span className="text-xl sm:text-2xl font-black text-amber-400 tabular-nums">
                  +{formatIDR(calcResult.valueAddDelta)}
                </span>
                <span className="text-[11px] text-emerald-200 block mt-0.5">
                  Setelah potong semua biaya produksi
                </span>
              </div>
            </div>
          </div>

          {/* Side-by-Side Comparison Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Left Card: Jual Segar Mentah */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Skenario A: Jual Segar
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    Konvensional
                  </span>
                </div>

                <div className="space-y-1 mb-4">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Total Omzet Mentah:</span>
                  <p className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums">
                    {formatIDR(calcResult.totalFreshRevenue)}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Volume: {batchVolumeKg} kg @ {formatIDR(freshMarketPricePerKg)}
                  </p>
                </div>

                <div className="space-y-2 text-xs pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-start gap-2 text-rose-600 dark:text-rose-400">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>Daya Tahan: Hanya <strong>5–7 hari</strong> sebelum susut & membusuk.</span>
                  </div>
                  <div className="flex items-start gap-2 text-rose-600 dark:text-rose-400">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>Sangat rentan rugi bila panen bertepatan dengan panen raya raya.</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[11px] text-slate-400 block">Laba Sebelum Opex Kebun:</span>
                <span className="text-base font-bold text-slate-700 dark:text-slate-300 tabular-nums">
                  {formatIDR(calcResult.totalFreshRevenue)}
                </span>
              </div>
            </div>

            {/* Right Card: Olah Jadi Produk Bernilai Tambah */}
            <div className="p-5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border-2 border-emerald-500/80 shadow-sm flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-2 right-2 bg-emerald-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Direkomendasikan
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                    Skenario B: Olah Bernilai Tambah
                  </span>
                </div>

                <div className="space-y-1 mb-4">
                  <span className="text-xs text-emerald-700 dark:text-emerald-400">Total Omzet Produk:</span>
                  <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">
                    {formatIDR(calcResult.totalProcessedRevenue)}
                  </p>
                  <p className="text-xs text-emerald-800 dark:text-emerald-300">
                    {calcResult.unitsProduced} kemasan @ {formatIDR(activeProductWithOverrides.sellingPricePerUnit)}
                  </p>
                </div>

                <div className="space-y-1.5 text-xs pt-3 border-t border-emerald-200/60 dark:border-emerald-800/40">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-300">HPP per Kemasan:</span>
                    <span className="font-semibold text-slate-900 dark:text-white tabular-nums">
                      {formatIDR(calcResult.cogsPerUnit)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-300">Margin Laba Olahan:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                      {formatPercent(calcResult.marginPercentage)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-300">Masa Simpan Aman:</span>
                    <span className="font-semibold text-amber-600 dark:text-amber-400">
                      {selectedProduct.shelfLifeMonths} Bulan ({calcResult.shelfLifeComparison.multiplier}x lebih tahan)
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-emerald-200/60 dark:border-emerald-800/40 flex justify-between items-end">
                <div>
                  <span className="text-[11px] text-emerald-700 dark:text-emerald-400 block font-semibold">Laba Bersih Olahan:</span>
                  <span className="text-lg font-black text-emerald-700 dark:text-emerald-300 tabular-nums">
                    {formatIDR(calcResult.netProfitProcessed)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block">Efisiensi:</span>
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 tabular-nums">
                    +{formatIDR(calcResult.valueAddDelta)}
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Quick Actions & Links */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="text-slate-600 dark:text-slate-400">
              Ingin menanam bahan baku <strong className="text-slate-900 dark:text-white">{selectedProduct.sourceCommodityName}</strong>?
            </span>
            <div className="flex items-center gap-2">
              {onSelectCommodityForSimulation && (
                <button
                  onClick={() => {
                    const match = COMMODITIES.find((c) => c.id === selectedProduct.commodityId) || COMMODITIES[0];
                    onSelectCommodityForSimulation(match);
                  }}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1 font-semibold"
                >
                  <Calculator className="w-3.5 h-3.5" />
                  <span>Kalkulasi Budidaya</span>
                </button>
              )}
              {onNavigateToFarmJourney && (
                <button
                  onClick={() => onNavigateToFarmJourney(selectedProduct.sourceCommodityName, batchVolumeKg)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1 font-semibold shadow-sm"
                >
                  <PackageCheck className="w-3.5 h-3.5" />
                  <span>Jadikan Proyek Kebun</span>
                </button>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* SECTION 2: KATALOG FORMULA PRODUK OLAHAN TANI */}
      <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              Pustaka Formula Produk Olahan Terverifikasi ({filteredProducts.length})
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Pilih salah satu produk di bawah untuk menguji kalkulasi nilai tambah secara reaktif.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari olahan..."
                className="pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>

            {/* Commodity Filter */}
            <select
              value={selectedCommodityFilter}
              onChange={(e) => setSelectedCommodityFilter(e.target.value)}
              className="text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-700 dark:text-slate-300"
            >
              <option value="all">Semua Bahan Baku</option>
              {uniqueCommodityNames.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>

            {/* Complexity Filter */}
            <select
              value={complexityFilter}
              onChange={(e) => setComplexityFilter(e.target.value)}
              className="text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-700 dark:text-slate-300"
            >
              <option value="all">Semua Tingkat Kesulitan</option>
              <option value="Rendah">Teknik Rendah (Rumahan)</option>
              <option value="Sedang">Teknik Sedang (Semi-Mesin)</option>
              <option value="Tinggi">Teknik Tinggi (Ekstraksi/Spesialis)</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((prod) => {
            const isSelected = selectedProduct.id === prod.id;
            const hppEstimated =
              prod.rawMaterialNeededKg * 25000 +
              prod.processingCostPerUnit +
              prod.packagingCostPerUnit +
              prod.laborCostPerUnit;
            const marginEst =
              prod.sellingPricePerUnit > 0
                ? ((prod.sellingPricePerUnit - hppEstimated) / prod.sellingPricePerUnit) * 100
                : 0;

            return (
              <div
                key={prod.id}
                onClick={() => setSelectedProduct(prod)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative group ${
                  isSelected
                    ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-emerald-500/60 shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {prod.sourceCommodityName}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      prod.complexityLevel === 'Rendah'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : prod.complexityLevel === 'Sedang'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    }`}>
                      {prod.complexityLevel}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {prod.processedProductName}
                  </h3>

                  <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 my-3">
                    <div className="flex justify-between">
                      <span>Bahan Baku per Kemasan:</span>
                      <strong className="text-slate-800 dark:text-slate-200">{prod.rawMaterialNeededKg} kg</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Masa Simpan:</span>
                      <strong className="text-amber-600 dark:text-amber-400">{prod.shelfLifeMonths} Bulan</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimasi Margin:</span>
                      <strong className="text-emerald-600 dark:text-emerald-400 tabular-nums">
                        ~{formatPercent(marginEst)}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Harga Jual Acuan:</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white tabular-nums">
                      {formatIDR(prod.sellingPricePerUnit)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {isSelected ? (
                      <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-emerald-600 text-white flex items-center gap-1 shadow-sm">
                        <Check className="w-3.5 h-3.5" />
                        <span>Sedang Aktif</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        className="px-2.5 py-1 text-[11px] font-semibold rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        Pilih & Uji
                      </button>
                    )}

                    {/* Delete button if custom */}
                    {prod.id.startsWith('prod-custom') && (
                      <button
                        onClick={(e) => handleDeleteProduct(prod.id, e)}
                        className="p-1 rounded text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors"
                        title="Hapus formula kustom ini"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL: INPUT FORMULA PRODUK OLAHAN BARU */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
            
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  Formula Nilai Tambah Kustom
                </span>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                  Tambah Produk Olahan Baru
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Masukkan parameter konversi bahan baku ke produk olahan untuk menghitung nilai tambah.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateFormula} className="space-y-4 text-xs">
              
              {/* Row 1: Source Commodity and Product Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Bahan Baku Segar
                  </label>
                  <select
                    value={newForm.sourceCommodityName}
                    onChange={(e) => {
                      const selected = COMMODITIES.find((c) => c.name === e.target.value);
                      setNewForm({
                        ...newForm,
                        sourceCommodityName: e.target.value,
                        commodityId: selected ? selected.id : 'custom',
                      });
                    }}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  >
                    {COMMODITIES.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Nama Produk Olahan *
                  </label>
                  <input
                    type="text"
                    required
                    value={newForm.processedProductName}
                    onChange={(e) => setNewForm({ ...newForm, processedProductName: e.target.value })}
                    placeholder="Contoh: Pasta Bawang Merah 250g"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-medium"
                  />
                </div>
              </div>

              {/* Row 2: Conversion and Shelf Life */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Kebutuhan Bahan (kg/unit)
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    min="0.01"
                    value={newForm.rawMaterialNeededKg}
                    onChange={(e) => setNewForm({ ...newForm, rawMaterialNeededKg: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white tabular-nums font-semibold"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Masa Simpan (Bulan)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newForm.shelfLifeMonths}
                    onChange={(e) => setNewForm({ ...newForm, shelfLifeMonths: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white tabular-nums font-semibold"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Tingkat Kesulitan
                  </label>
                  <select
                    value={newForm.complexityLevel}
                    onChange={(e) => setNewForm({ ...newForm, complexityLevel: e.target.value as any })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  >
                    <option value="Rendah">Rendah</option>
                    <option value="Sedang">Sedang</option>
                    <option value="Tinggi">Tinggi</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Costs per Unit */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-3">
                <span className="font-bold text-slate-900 dark:text-white block">
                  Komponen Biaya Pengolahan per Unit (Rp)
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">
                      Biaya Bumbu / Bahan Lain
                    </label>
                    <input
                      type="number"
                      step="500"
                      value={newForm.processingCostPerUnit}
                      onChange={(e) => setNewForm({ ...newForm, processingCostPerUnit: Number(e.target.value) })}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 tabular-nums font-semibold"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">
                      Kemasan & Label
                    </label>
                    <input
                      type="number"
                      step="500"
                      value={newForm.packagingCostPerUnit}
                      onChange={(e) => setNewForm({ ...newForm, packagingCostPerUnit: Number(e.target.value) })}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 tabular-nums font-semibold"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">
                      Upah Tenaga Kerja
                    </label>
                    <input
                      type="number"
                      step="500"
                      value={newForm.laborCostPerUnit}
                      onChange={(e) => setNewForm({ ...newForm, laborCostPerUnit: Number(e.target.value) })}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 tabular-nums font-semibold"
                    />
                  </div>
                </div>
              </div>

              {/* Row 4: Selling Price */}
              <div>
                <label className="font-bold text-emerald-700 dark:text-emerald-400 block mb-1">
                  Target Harga Jual Produk Olahan ke Konsumen (Rp/unit) *
                </label>
                <input
                  type="number"
                  step="1000"
                  required
                  value={newForm.sellingPricePerUnit}
                  onChange={(e) => setNewForm({ ...newForm, sellingPricePerUnit: Number(e.target.value) })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-emerald-500 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white tabular-nums font-bold text-sm"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Simpan Formula ke Pustaka</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
