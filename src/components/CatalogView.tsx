import React, { useState, useMemo } from 'react';
import { 
  Search, Filter, Calculator, Info, X, CheckCircle, AlertTriangle, 
  ArrowUpDown, Droplets, Mountain, Clock, PlusCircle, Trash2, Tag, 
  SlidersHorizontal, Sparkles, Check, ChevronDown, BookOpen
} from 'lucide-react';
import { COMMODITIES } from '../data/commodities';
import { Commodity, CommodityCategory } from '../types';
import { formatIDR } from '../utils/calculator';

interface CatalogViewProps {
  onSelectCommodityForSimulation: (commodity: Commodity) => void;
  onSelectCommodityForSOP?: (commodity: Commodity) => void;
  selectedCommodityForModal: Commodity | null;
  setSelectedCommodityForModal: (commodity: Commodity | null) => void;
  customCommodities: Commodity[];
  onAddCustomCommodity: (commodity: Commodity) => void;
  onDeleteCustomCommodity: (id: string) => void;
}

export const CatalogView: React.FC<CatalogViewProps> = ({
  onSelectCommodityForSimulation,
  onSelectCommodityForSOP,
  selectedCommodityForModal,
  setSelectedCommodityForModal,
  customCommodities,
  onAddCustomCommodity,
  onDeleteCustomCommodity,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'recommended' | 'roi' | 'capital' | 'cycle'>('recommended');
  
  // Advanced Filter States
  const [quickFilter, setQuickFilter] = useState<string>('all');
  const [capitalFilter, setCapitalFilter] = useState<'all' | '<10jt' | '10-25jt' | '>25jt'>('all');
  const [cycleFilter, setCycleFilter] = useState<'all' | 'fast' | 'medium' | 'long'>('all');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);

  // Manual Commodity Input Modal
  const [isManualModalOpen, setIsManualModalOpen] = useState<boolean>(false);
  const [manualForm, setManualForm] = useState({
    name: '',
    scientificName: '',
    category: 'hortikultura' as CommodityCategory,
    categoryLabel: 'Hortikultura Sayur',
    cycleDays: 60,
    optimalAltitude: '0 - 800 mdpl',
    waterRequirement: 'Sedang' as 'Rendah' | 'Sedang' | 'Tinggi',
    riskLevel: 'Sedang' as 'Rendah' | 'Sedang' | 'Tinggi',
    suitableSeason: 'Sepanjang Tahun' as 'Kemarau' | 'Hujan' | 'Sepanjang Tahun',
    avgCapexPer1000m2: 10000000,
    avgOpexPerCycle: 8000000,
    defaultYieldKgPer1000m2: 1500,
    defaultPricePerKg: 20000,
    description: '',
    keyAdvantages: '',
    targetMarkets: '',
    tags: '',
  });

  // Combine standard and custom user commodities
  const allCommodities = useMemo(() => {
    return [...customCommodities, ...COMMODITIES];
  }, [customCommodities]);

  const categories = [
    { id: 'all', label: 'Semua Komoditas' },
    { id: 'hortikultura', label: 'Hortikultura Sayur' },
    { id: 'hidroponik', label: 'Hidroponik Modern' },
    { id: 'pangan', label: 'Pangan Pokok' },
    { id: 'buah', label: 'Buah Segar' },
    { id: 'perkebunan', label: 'Perkebunan & Rempah' },
  ];

  const quickFilterPresets = [
    { id: 'all', label: 'Semua Filter' },
    { id: 'kilat', label: '⚡ Panen Kilat (< 45 Hari)' },
    { id: 'modal-rendah', label: '💰 Modal Rendah (< 10 Jt)' },
    { id: 'ekspor', label: '🌍 Nilai Tinggi & Ekspor' },
    { id: 'hidroponik', label: '💧 Hidroponik' },
    { id: 'dataran-tinggi', label: '⛰️ Dataran Tinggi' },
    { id: 'tahan-kering', label: '☀️ Tahan Kekeringan' },
    { id: 'custom', label: '⭐ Input Manual Saya' },
  ];

  // Enhanced Filter Logic
  const filteredCommodities = useMemo(() => {
    return allCommodities.filter((item) => {
      // Category match
      const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;

      // Search match across name, scientificName, description, tags, targetMarkets
      const query = searchQuery.trim().toLowerCase();
      const matchSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.scientificName.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.categoryLabel.toLowerCase().includes(query) ||
        (item.tags && item.tags.some((t) => t.toLowerCase().includes(query))) ||
        item.targetMarkets.some((m) => m.toLowerCase().includes(query));

      // Quick filter presets
      let matchQuick = true;
      if (quickFilter === 'kilat') {
        matchQuick = item.cycleDays <= 45;
      } else if (quickFilter === 'modal-rendah') {
        matchQuick = item.avgCapexPer1000m2 + item.avgOpexPerCycle <= 10000000;
      } else if (quickFilter === 'ekspor') {
        matchQuick = Boolean(item.tags && item.tags.includes('ekspor')) || item.defaultPricePerKg >= 25000;
      } else if (quickFilter === 'hidroponik') {
        matchQuick = item.category === 'hidroponik' || Boolean(item.tags && item.tags.includes('hidroponik'));
      } else if (quickFilter === 'dataran-tinggi') {
        matchQuick = item.optimalAltitude.includes('700') || item.optimalAltitude.includes('1.000') || item.optimalAltitude.includes('500');
      } else if (quickFilter === 'tahan-kering') {
        matchQuick = item.waterRequirement === 'Rendah' || Boolean(item.tags && item.tags.includes('tahan kering'));
      } else if (quickFilter === 'custom') {
        matchQuick = Boolean(item.isCustom);
      }

      // Advanced Capital Filter
      let matchCapital = true;
      const totalCapital = item.avgCapexPer1000m2 + item.avgOpexPerCycle;
      if (capitalFilter === '<10jt') {
        matchCapital = totalCapital < 10000000;
      } else if (capitalFilter === '10-25jt') {
        matchCapital = totalCapital >= 10000000 && totalCapital <= 25000000;
      } else if (capitalFilter === '>25jt') {
        matchCapital = totalCapital > 25000000;
      }

      // Advanced Cycle Filter
      let matchCycle = true;
      if (cycleFilter === 'fast') {
        matchCycle = item.cycleDays <= 50;
      } else if (cycleFilter === 'medium') {
        matchCycle = item.cycleDays > 50 && item.cycleDays <= 100;
      } else if (cycleFilter === 'long') {
        matchCycle = item.cycleDays > 100;
      }

      return matchCategory && matchSearch && matchQuick && matchCapital && matchCycle;
    }).sort((a, b) => {
      if (sortBy === 'capital') {
        const totalA = a.avgCapexPer1000m2 + a.avgOpexPerCycle;
        const totalB = b.avgCapexPer1000m2 + b.avgOpexPerCycle;
        return totalA - totalB;
      }
      if (sortBy === 'cycle') {
        return a.cycleDays - b.cycleDays;
      }
      if (sortBy === 'roi') {
        const revenueA = a.defaultYieldKgPer1000m2 * a.defaultPricePerKg;
        const profitA = revenueA - a.avgOpexPerCycle;
        const roiA = profitA / (a.avgCapexPer1000m2 + a.avgOpexPerCycle);

        const revenueB = b.defaultYieldKgPer1000m2 * b.defaultPricePerKg;
        const profitB = revenueB - b.avgOpexPerCycle;
        const roiB = profitB / (b.avgCapexPer1000m2 + b.avgOpexPerCycle);
        return roiB - roiA;
      }
      return 0;
    });
  }, [allCommodities, selectedCategory, searchQuery, quickFilter, capitalFilter, cycleFilter, sortBy]);

  // Handle Manual Form Submission
  const handleCreateManualCommodity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualForm.name.trim()) return;

    const newCommodity: Commodity = {
      id: `custom-${Date.now()}`,
      name: manualForm.name.trim(),
      scientificName: manualForm.scientificName.trim() || manualForm.name.trim(),
      category: manualForm.category,
      categoryLabel: manualForm.categoryLabel,
      cycleDays: Number(manualForm.cycleDays) || 60,
      optimalAltitude: manualForm.optimalAltitude,
      waterRequirement: manualForm.waterRequirement,
      riskLevel: manualForm.riskLevel,
      suitableSeason: manualForm.suitableSeason,
      avgCapexPer1000m2: Number(manualForm.avgCapexPer1000m2) || 5000000,
      avgOpexPerCycle: Number(manualForm.avgOpexPerCycle) || 5000000,
      defaultYieldKgPer1000m2: Number(manualForm.defaultYieldKgPer1000m2) || 1000,
      defaultPricePerKg: Number(manualForm.defaultPricePerKg) || 10000,
      priceRange: {
        min: Math.round((Number(manualForm.defaultPricePerKg) || 10000) * 0.75),
        max: Math.round((Number(manualForm.defaultPricePerKg) || 10000) * 1.5),
        avg: Number(manualForm.defaultPricePerKg) || 10000,
      },
      image: '/src/assets/images/hero_agropreneur_farm_1793888689885.jpg',
      description: manualForm.description.trim() || `Komoditas ${manualForm.name} yang ditambahkan secara manual oleh pengguna untuk analisis usaha tani.`,
      keyAdvantages: manualForm.keyAdvantages
        ? manualForm.keyAdvantages.split(',').map((s) => s.trim())
        : ['Parameter perhitungan ditentukan mandiri', 'Estimasi pasar lokal disesuaikan'],
      keyRisks: ['Fluktuasi harga pasar lokal', 'Tantangan teknis budidaya di lapangan'],
      targetMarkets: manualForm.targetMarkets
        ? manualForm.targetMarkets.split(',').map((s) => s.trim())
        : ['Pasar Lokal', 'Konsumen Langsung'],
      tags: manualForm.tags
        ? manualForm.tags.split(',').map((s) => s.trim().toLowerCase())
        : ['kustom', 'manual'],
      isCustom: true,
    };

    onAddCustomCommodity(newCommodity);
    setIsManualModalOpen(false);
    // Reset form
    setManualForm({
      name: '',
      scientificName: '',
      category: 'hortikultura',
      categoryLabel: 'Hortikultura Sayur',
      cycleDays: 60,
      optimalAltitude: '0 - 800 mdpl',
      waterRequirement: 'Sedang',
      riskLevel: 'Sedang',
      suitableSeason: 'Sepanjang Tahun',
      avgCapexPer1000m2: 10000000,
      avgOpexPerCycle: 8000000,
      defaultYieldKgPer1000m2: 1500,
      defaultPricePerKg: 20000,
      description: '',
      keyAdvantages: '',
      targetMarkets: '',
      tags: '',
    });
  };

  const handleCategoryChange = (cat: CommodityCategory) => {
    const labelMap: Record<CommodityCategory, string> = {
      hortikultura: 'Hortikultura Sayur',
      hidroponik: 'Hidroponik Modern',
      pangan: 'Pangan Pokok',
      buah: 'Buah Segar',
      perkebunan: 'Perkebunan & Rempah',
    };
    setManualForm({
      ...manualForm,
      category: cat,
      categoryLabel: labelMap[cat] || 'Hortikultura Sayur',
    });
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header Title & CTA Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Katalog Komoditas Agribisnis Terlengkap</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              {allCommodities.length} Komoditas
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Cari data komoditas, filter berdasarkan modal & durasi panen, atau isi parameter komoditas secara manual.
          </p>
        </div>

        <button
          onClick={() => setIsManualModalOpen(true)}
          className="px-4 py-2.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm flex items-center gap-2 transition-all self-start sm:self-auto shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Isi Komoditas Manual Baru</span>
        </button>
      </div>

      {/* Main Search Bar & Quick Tools */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          {/* Enhanced Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari komoditas (nama, nama ilmiah, varietas, kata kunci, pasar, misal: cabai, vanili, hidroponik)..."
              className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white placeholder-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 shrink-0">
            <ArrowUpDown className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="recommended">Urutkan: Rekomendasi</option>
              <option value="roi">Urutkan: Potensi ROI Tertinggi</option>
              <option value="capital">Urutkan: Modal Awal Terendah</option>
              <option value="cycle">Urutkan: Masa Panen Tercepat (HST)</option>
            </select>
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`px-3 py-2.5 text-xs font-semibold rounded-xl border flex items-center gap-1.5 transition-colors shrink-0 ${
              showAdvancedFilters || capitalFilter !== 'all' || cycleFilter !== 'all'
                ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filter Lanjutan</span>
          </button>
        </div>

        {/* Quick Filter Badges / Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar pt-1 border-t border-slate-100 dark:border-slate-800">
          {quickFilterPresets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => setQuickFilter(preset.id)}
              className={`px-3 py-1 text-[11px] font-medium rounded-lg whitespace-nowrap transition-colors ${
                quickFilter === preset.id
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Collapsible Advanced Filter Panel */}
        {showAdvancedFilters && (
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-3 text-xs">
            {/* Capital Filter */}
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Kebutuhan Modal Awal/1.000m²
              </label>
              <select
                value={capitalFilter}
                onChange={(e) => setCapitalFilter(e.target.value as any)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-800 dark:text-slate-200"
              >
                <option value="all">Semua Kisaran Modal</option>
                <option value="<10jt">Modal Kecil (&lt; Rp 10 Juta)</option>
                <option value="10-25jt">Modal Menengah (Rp 10 - 25 Juta)</option>
                <option value=">25jt">Modal Intensif (&gt; Rp 25 Juta)</option>
              </select>
            </div>

            {/* Cycle Filter */}
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Durasi Masa Panen (HST)
              </label>
              <select
                value={cycleFilter}
                onChange={(e) => setCycleFilter(e.target.value as any)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-800 dark:text-slate-200"
              >
                <option value="all">Semua Durasi</option>
                <option value="fast">Cepat (&le; 50 HST - Sayur Daun)</option>
                <option value="medium">Sedang (51 - 100 HST - Melon, Bawang)</option>
                <option value="long">Panjang (&gt; 100 HST - Cabai, Padi, Rempah)</option>
              </select>
            </div>

            {/* Reset Filter Button */}
            <div className="flex flex-col justify-end">
              <button
                onClick={() => {
                  setQuickFilter('all');
                  setCapitalFilter('all');
                  setCycleFilter('all');
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
              >
                Reset Semua Filter
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Category Segmented Filter Buttons */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
              selectedCategory === cat.id
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Results Count Banner */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
        <span>Menampilkan <strong className="text-slate-900 dark:text-white font-bold">{filteredCommodities.length}</strong> komoditas</span>
        {(searchQuery || selectedCategory !== 'all' || quickFilter !== 'all' || capitalFilter !== 'all' || cycleFilter !== 'all') && (
          <span className="text-emerald-600 dark:text-emerald-400 font-medium">Filter Aktif Diterapkan</span>
        )}
      </div>

      {/* Commodities Grid */}
      {filteredCommodities.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 space-y-3">
          <Info className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Tidak Ada Komoditas yang Sesuai</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Tidak ditemukan komoditas dengan kriteria tersebut. Anda bisa mereset filter atau membuat komoditas kustom Anda sendiri secara manual.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setQuickFilter('all');
                setCapitalFilter('all');
                setCycleFilter('all');
              }}
              className="px-4 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl"
            >
              Reset Filter
            </button>
            <button
              onClick={() => setIsManualModalOpen(true)}
              className="px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm"
            >
              + Isi Komoditas Manual
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCommodities.map((item) => {
            const totalInitialEst = item.avgCapexPer1000m2 + item.avgOpexPerCycle;
            const grossEst = item.defaultYieldKgPer1000m2 * item.defaultPricePerKg;
            const netProfitEst = grossEst - item.avgOpexPerCycle;

            return (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col justify-between hover:border-emerald-500/60 transition-all shadow-sm group relative"
              >
                <div>
                  <div className="relative h-44 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-md">
                      {item.categoryLabel}
                    </div>
                    
                    {item.isCustom ? (
                      <div className="absolute top-3 right-3 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
                        Manual / Kustom
                      </div>
                    ) : (
                      <div className="absolute top-3 right-3 bg-emerald-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-md tabular-nums">
                        {item.cycleDays} HST
                      </div>
                    )}
                  </div>

                  <div className="p-4 sm:p-5">
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                      <span>{item.optimalAltitude}</span>
                      <span aria-hidden="true">·</span>
                      <span>Air: {item.waterRequirement}</span>
                      <span aria-hidden="true">·</span>
                      <span>Risiko: {item.riskLevel}</span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 italic mb-2.5">
                      {item.scientificName}
                    </p>

                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed mb-3">
                      {item.description}
                    </p>

                    {/* Tags preview */}
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {item.tags.slice(0, 3).map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-md"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 dark:text-slate-400">Modal Awal/1.000m²:</span>
                        <span className="font-semibold text-slate-900 dark:text-white tabular-nums">
                          {formatIDR(totalInitialEst)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 dark:text-slate-400">Estimasi Hasil Panen:</span>
                        <span className="font-semibold text-slate-900 dark:text-white tabular-nums">
                          {item.defaultYieldKgPer1000m2.toLocaleString('id-ID')} Kg
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 dark:text-slate-400">Harga Acuan Pasar:</span>
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">
                          {formatIDR(item.defaultPricePerKg)}/kg
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-1 border-t border-slate-200 dark:border-slate-700/60">
                        <span className="text-slate-500 dark:text-slate-400">Potensi Laba/Panen:</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                          ~{formatIDR(netProfitEst)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 sm:p-5 pt-0 grid grid-cols-3 gap-1.5">
                  <button
                    onClick={() => setSelectedCommodityForModal(item)}
                    className="px-2 py-2 text-[11px] font-semibold rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-center truncate"
                  >
                    Profil
                  </button>
                  <button
                    onClick={() => onSelectCommodityForSOP?.(item)}
                    className="px-2 py-2 text-[11px] font-semibold rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800/60 text-teal-700 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-900 transition-colors text-center flex items-center justify-center gap-1"
                    title="Buka SOP & Kalender Tanam untuk komoditas ini"
                  >
                    <BookOpen className="w-3 h-3 shrink-0" />
                    <span>SOP</span>
                  </button>
                  <button
                    onClick={() => onSelectCommodityForSimulation(item)}
                    className="px-2 py-2 text-[11px] font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors text-center flex items-center justify-center gap-1 shadow-sm"
                    title="Mulai simulasi bisnis untuk komoditas ini"
                  >
                    <Calculator className="w-3 h-3 shrink-0" />
                    <span>Simulasi</span>
                  </button>
                </div>

                {item.isCustom && (
                  <button
                    onClick={() => onDeleteCustomCommodity(item.id)}
                    className="absolute top-3 right-3 bg-rose-500/90 hover:bg-rose-600 text-white p-1 rounded-md shadow-sm transition-colors"
                    title="Hapus komoditas manual ini"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL: INPUT KOMODITAS MANUAL SECARA LENGKAP */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
            
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  Formulir Komoditas Kustom
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
                  Isi Parameter Komoditas Secara Manual
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Masukkan data tanaman spesifik daerah Anda untuk disimpan dan dihitung di Simulator Finansial.
                </p>
              </div>
              <button
                onClick={() => setIsManualModalOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateManualCommodity} className="space-y-4 text-xs">
              
              {/* Row 1: Name and Scientific Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Nama Komoditas & Varietas *
                  </label>
                  <input
                    type="text"
                    required
                    value={manualForm.name}
                    onChange={(e) => setManualForm({ ...manualForm, name: e.target.value })}
                    placeholder="Contoh: Cabai Hiyung Kalsel, Pepaya Madu"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Nama Ilmiah / Latin
                  </label>
                  <input
                    type="text"
                    value={manualForm.scientificName}
                    onChange={(e) => setManualForm({ ...manualForm, scientificName: e.target.value })}
                    placeholder="Contoh: Capsicum frutescens L."
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 italic"
                  />
                </div>
              </div>

              {/* Row 2: Category and Cycle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Kategori Tanaman
                  </label>
                  <select
                    value={manualForm.category}
                    onChange={(e) => handleCategoryChange(e.target.value as CommodityCategory)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="hortikultura">Hortikultura Sayur</option>
                    <option value="hidroponik">Hidroponik Modern</option>
                    <option value="pangan">Pangan Pokok</option>
                    <option value="buah">Buah Segar</option>
                    <option value="perkebunan">Perkebunan & Rempah</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Durasi Panen (Hari Setelah Tanam / HST)
                  </label>
                  <input
                    type="number"
                    min="10"
                    value={manualForm.cycleDays}
                    onChange={(e) => setManualForm({ ...manualForm, cycleDays: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white tabular-nums focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                  />
                </div>
              </div>

              {/* Row 3: Agronomic Environment */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Ketinggian Optimal (mdpl)
                  </label>
                  <input
                    type="text"
                    value={manualForm.optimalAltitude}
                    onChange={(e) => setManualForm({ ...manualForm, optimalAltitude: e.target.value })}
                    placeholder="Contoh: 0 - 600 mdpl"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Kebutuhan Air
                  </label>
                  <select
                    value={manualForm.waterRequirement}
                    onChange={(e) => setManualForm({ ...manualForm, waterRequirement: e.target.value as any })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  >
                    <option value="Rendah">Rendah (Tahan Kering)</option>
                    <option value="Sedang">Sedang (Irigasi Drip/Pompa)</option>
                    <option value="Tinggi">Tinggi (Genangan / NFT)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Tingkat Risiko Hama & Cuaca
                  </label>
                  <select
                    value={manualForm.riskLevel}
                    onChange={(e) => setManualForm({ ...manualForm, riskLevel: e.target.value as any })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  >
                    <option value="Rendah">Rendah</option>
                    <option value="Sedang">Sedang</option>
                    <option value="Tinggi">Tinggi</option>
                  </select>
                </div>
              </div>

              {/* Row 4: Financial Baseline (Capex, Opex, Yield, Price) */}
              <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40 space-y-3">
                <span className="font-bold text-emerald-900 dark:text-emerald-200 block text-xs">
                  Parameter Finansial Acuan (Skala Standar 1.000 m²)
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Estimasi Modal Aset (Capex - Rp)
                    </label>
                    <input
                      type="number"
                      step="500000"
                      value={manualForm.avgCapexPer1000m2}
                      onChange={(e) => setManualForm({ ...manualForm, avgCapexPer1000m2: Number(e.target.value) })}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white tabular-nums font-semibold"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Estimasi Biaya Operasional (Opex/Musim - Rp)
                    </label>
                    <input
                      type="number"
                      step="500000"
                      value={manualForm.avgOpexPerCycle}
                      onChange={(e) => setManualForm({ ...manualForm, avgOpexPerCycle: Number(e.target.value) })}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white tabular-nums font-semibold"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Estimasi Total Panen (Kg / 1.000m²)
                    </label>
                    <input
                      type="number"
                      value={manualForm.defaultYieldKgPer1000m2}
                      onChange={(e) => setManualForm({ ...manualForm, defaultYieldKgPer1000m2: Number(e.target.value) })}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white tabular-nums font-semibold"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Estimasi Harga Jual Pasar (Rp/Kg)
                    </label>
                    <input
                      type="number"
                      step="500"
                      value={manualForm.defaultPricePerKg}
                      onChange={(e) => setManualForm({ ...manualForm, defaultPricePerKg: Number(e.target.value) })}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white tabular-nums font-semibold"
                    />
                  </div>
                </div>
              </div>

              {/* Row 5: Description, Advantages, Target Markets */}
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Deskripsi & Karakteristik Budidaya
                </label>
                <textarea
                  rows={2}
                  value={manualForm.description}
                  onChange={(e) => setManualForm({ ...manualForm, description: e.target.value })}
                  placeholder="Ceritakan keistimewaan tanaman, cara penanaman, atau potensi pasarnya..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Target Pasar (Pisahkan dengan koma)
                  </label>
                  <input
                    type="text"
                    value={manualForm.targetMarkets}
                    onChange={(e) => setManualForm({ ...manualForm, targetMarkets: e.target.value })}
                    placeholder="Pasar Induk, Supermarket, Katering Horeka"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Kata Kunci / Tag Pencarian (Pisahkan koma)
                  </label>
                  <input
                    type="text"
                    value={manualForm.tags}
                    onChange={(e) => setManualForm({ ...manualForm, tags: e.target.value })}
                    placeholder="organik, dataran tinggi, panen cepat"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsManualModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Simpan Komoditas ke Katalog</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Commodity Detail Modal */}
      {selectedCommodityForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  {selectedCommodityForModal.categoryLabel}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
                  {selectedCommodityForModal.name}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 italic">
                  {selectedCommodityForModal.scientificName}
                </p>
              </div>
              <button
                onClick={() => setSelectedCommodityForModal(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Agronomic Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Siklus Panen</span>
                </div>
                <p className="text-sm font-bold text-slate-900 dark:text-white tabular-nums">
                  {selectedCommodityForModal.cycleDays} HST
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                  <Mountain className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Ketinggian</span>
                </div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {selectedCommodityForModal.optimalAltitude}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                  <Droplets className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Kebutuhan Air</span>
                </div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {selectedCommodityForModal.waterRequirement}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                  <span>Tingkat Risiko</span>
                </div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {selectedCommodityForModal.riskLevel}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Tentang Komoditas
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {selectedCommodityForModal.description}
              </p>
            </div>

            {/* Advantages and Risks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2 p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-800/40">
                <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Keunggulan Bisnis</span>
                </h4>
                <ul className="text-xs text-emerald-950 dark:text-emerald-100 space-y-1.5">
                  {selectedCommodityForModal.keyAdvantages.map((adv, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{adv}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2 p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-800/40">
                <h4 className="text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Risiko Kritis & Tantangan</span>
                </h4>
                <ul className="text-xs text-amber-950 dark:text-amber-100 space-y-1.5">
                  {selectedCommodityForModal.keyRisks.map((risk, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Target Markets */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Saluran Penjualan & Target Pasar
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedCommodityForModal.targetMarkets.map((mkt, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg"
                  >
                    {mkt}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5 pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setSelectedCommodityForModal(null)}
                className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Tutup
              </button>
              {onSelectCommodityForSOP && (
                <button
                  onClick={() => {
                    const target = selectedCommodityForModal;
                    setSelectedCommodityForModal(null);
                    onSelectCommodityForSOP(target);
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold rounded-xl bg-teal-50 dark:bg-teal-950/70 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-200 hover:bg-teal-100 dark:hover:bg-teal-900 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <BookOpen className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <span>Buka SOP & Kalender Tanam</span>
                </button>
              )}
              <button
                onClick={() => {
                  const target = selectedCommodityForModal;
                  setSelectedCommodityForModal(null);
                  onSelectCommodityForSimulation(target);
                }}
                className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center justify-center gap-2 shadow-md"
              >
                <Calculator className="w-4 h-4" />
                <span>Simulasikan Komoditas Ini di Kalkulator</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
