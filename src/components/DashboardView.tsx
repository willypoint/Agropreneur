import React, { useState, useMemo } from 'react';
import { 
  ArrowRight, Calculator, Sprout, TrendingUp, Sparkles, ShieldAlert, 
  CheckCircle2, CloudSun, Calendar, Search, X, PlusCircle, BookOpen, 
  SlidersHorizontal, Clock, Mountain, Droplets, AlertTriangle, Trash2, 
  Check, CheckCircle, ClipboardList 
} from 'lucide-react';
import { COMMODITIES } from '../data/commodities';
import { MARKET_PRICES } from '../data/marketPrices';
import { formatIDR, formatPercent } from '../utils/calculator';
import { NavigationTab, Commodity, CommodityCategory } from '../types';

interface DashboardViewProps {
  setActiveTab: (tab: NavigationTab) => void;
  onSelectCommodityForSimulation: (commodity: Commodity) => void;
  onSelectCommodityForSOP: (commodity: Commodity) => void;
  onViewCommodityDetail?: (commodity: Commodity) => void;
  customCommodities: Commodity[];
  onAddCustomCommodity: (commodity: Commodity) => void;
  onDeleteCustomCommodity: (id: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  setActiveTab,
  onSelectCommodityForSimulation,
  onSelectCommodityForSOP,
  customCommodities,
  onAddCustomCommodity,
  onDeleteCustomCommodity,
}) => {
  // Search & Filter state on Dashboard
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [quickFilter, setQuickFilter] = useState<string>('all');
  const [visibleCount, setVisibleCount] = useState<number>(6);
  
  // Selected commodity for modal view right on Dashboard
  const [selectedCommodityForModal, setSelectedCommodityForModal] = useState<Commodity | null>(null);

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

  // Combine standard commodities with custom commodities
  const allCommodities = useMemo(() => {
    return [...customCommodities, ...COMMODITIES];
  }, [customCommodities]);

  const categories = [
    { id: 'all', label: 'Semua Kategori' },
    { id: 'hortikultura', label: 'Hortikultura Sayur' },
    { id: 'hidroponik', label: 'Hidroponik Modern' },
    { id: 'pangan', label: 'Pangan Pokok' },
    { id: 'buah', label: 'Buah Segar' },
    { id: 'perkebunan', label: 'Perkebunan & Rempah' },
  ];

  const quickFilterPresets = [
    { id: 'all', label: 'Semua Komoditas' },
    { id: 'kilat', label: '⚡ Panen Kilat (< 45 Hari)' },
    { id: 'modal-rendah', label: '💰 Modal Rendah (< 10 Jt)' },
    { id: 'ekspor', label: '🌍 Nilai Tinggi & Ekspor' },
    { id: 'hidroponik', label: '💧 Hidroponik' },
    { id: 'custom', label: '⭐ Input Manual Saya' },
  ];

  // Filtered commodities based on search, category, and quick filter
  const filteredCommodities = useMemo(() => {
    return allCommodities.filter((item) => {
      // Category filter
      const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;

      // Search match
      const query = searchQuery.trim().toLowerCase();
      const matchSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.scientificName.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.categoryLabel.toLowerCase().includes(query) ||
        Boolean(item.tags && item.tags.some((t) => t.toLowerCase().includes(query))) ||
        item.targetMarkets.some((m) => m.toLowerCase().includes(query));

      // Quick filter
      let matchQuick = true;
      if (quickFilter === 'kilat') {
        matchQuick = item.cycleDays <= 45;
      } else if (quickFilter === 'modal-rendah') {
        matchQuick = item.avgCapexPer1000m2 + item.avgOpexPerCycle <= 10000000;
      } else if (quickFilter === 'ekspor') {
        matchQuick = Boolean(item.tags && item.tags.includes('ekspor')) || item.defaultPricePerKg >= 25000;
      } else if (quickFilter === 'hidroponik') {
        matchQuick = item.category === 'hidroponik' || Boolean(item.tags && item.tags.includes('hidroponik'));
      } else if (quickFilter === 'custom') {
        matchQuick = Boolean(item.isCustom);
      }

      return matchCategory && matchSearch && matchQuick;
    });
  }, [allCommodities, selectedCategory, searchQuery, quickFilter]);

  const displayedCommodities = useMemo(() => {
    return filteredCommodities.slice(0, visibleCount);
  }, [filteredCommodities, visibleCount]);

  // Handle manual form submission
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
    <div className="space-y-8 pb-12">
      {/* Hero Section */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 shadow-sm">
        <div className="relative h-72 sm:h-80 md:h-96 w-full overflow-hidden">
          <img
            src="/src/assets/images/hero_agropreneur_farm_1793888689885.jpg"
            alt="Lahan pertanian hortikultura modern Indonesia dengan irigasi presisi"
            className="w-full h-full object-cover object-center transform scale-105 hover:scale-100 transition-transform duration-700"
            referrerPolicy="no-referrer"
          />
          {/* Measured Scrim for WCAG AA readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
          
          <div className="absolute inset-0 p-6 sm:p-8 md:p-10 flex flex-col justify-end text-white">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-emerald-300 font-medium mb-2">
              <Sprout className="w-4 h-4 text-emerald-400" />
              <span>Platform Agropreneur Presisi & Finansial Tani</span>
              <span aria-hidden="true">·</span>
              <span>Edisi 2026/2027</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight max-w-2xl text-wrap-balance leading-tight mb-3">
              Kalkulasi Kelayakan Usaha Tani Sebelum Mengeluarkan Modal
            </h1>

            <p className="text-sm sm:text-base text-slate-200 max-w-2xl leading-relaxed mb-6">
              Simulasikan Capex, Opex, estimasi tonase panen, titik impas (BEP), dan uji sensitivitas anjloknya harga pasar dalam hitungan detik.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setActiveTab('simulator')}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-semibold text-sm rounded-xl transition-all shadow-md flex items-center gap-2"
              >
                <Calculator className="w-4 h-4" />
                <span>Mulai Simulasi Finansial</span>
              </button>

              <button
                onClick={() => setActiveTab('catalog')}
                className="px-5 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md active:scale-95 text-white font-semibold text-sm rounded-xl border border-white/20 transition-all flex items-center gap-2"
              >
                <Sprout className="w-4 h-4" />
                <span>Katalog Komoditas ({allCommodities.length})</span>
              </button>

              <button
                onClick={() => setIsManualModalOpen(true)}
                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-md flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ Isi Komoditas Manual</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Highlights Strip (Tabular Figures) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">Rata-rata ROI Hortikultura</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">42.8%</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Per siklus panen komoditas unggulan</p>
        </div>

        <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">Siklus Panen Tercepat</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums">35 HST</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Selada NFT Hidroponik (10 siklus/thn)</p>
        </div>

        <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">Database Komoditas Lengkap</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums">{allCommodities.length} Jenis</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Katalog standar + manual kustom</p>
        </div>

        <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">Volatilitas Harga Pasar</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400 tabular-nums">±22.4%</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Perlu uji stres sensitivitas harga</p>
        </div>
      </div>

      {/* Live Market Price Overview Bar */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <span>Pantauan Harga Pasar Komoditas Terkini</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Acuan agregasi PIHPS Nasional & Pasar Induk Kramat Jati Jakarta
            </p>
          </div>

          <button
            onClick={() => setActiveTab('market')}
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Lihat Rantai Pasok Lengkap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {MARKET_PRICES.map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex flex-col justify-between"
            >
              <div className="mb-2">
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block truncate">
                  {item.commodityName}
                </span>
                <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tabular-nums">
                  {formatIDR(item.currentPrice)}
                </span>
                <span className="text-[10px] text-slate-400 block">per {item.unit}</span>
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <span
                  className={`font-semibold tabular-nums ${
                    item.changePct >= 0
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {formatPercent(item.changePct)}
                </span>
                <span className="text-[10px] text-slate-400">7 hari</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CORE FEATURE: DISCOVERY & PENCARIAN KOMODITAS LENGKAP PADA DASHBOARD */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                Eksplorasi Komoditas
              </span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                {allCommodities.length} Total Data
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
              Katalog Komoditas Agribisnis Terlengkap & Mesin Analisis
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Cari komoditas, buat komoditas manual Anda sendiri, dan aktifkan fungsi Simulasi, SOP Tani, atau Profil dalam 1 klik.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsManualModalOpen(true)}
              className="px-3.5 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Isi Komoditas Manual</span>
            </button>
            <button
              onClick={() => setActiveTab('catalog')}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
            >
              <span>Buka Katalog Penuh</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Dashboard Search & Filter Control Bar */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3.5">
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ketik pencarian: cabai rawit, melon, vanili, hidroponik, sayur daun, dataran tinggi..."
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

            {/* Category Filter Selector */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full sm:w-auto text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Filter Preset Chips */}
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
        </div>

        {/* Results Counter and Status */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
          <span>
            Menampilkan <strong className="text-slate-900 dark:text-white font-bold">{displayedCommodities.length}</strong> dari <strong className="text-slate-900 dark:text-white font-bold">{filteredCommodities.length}</strong> komoditas yang cocok
          </span>
          {(searchQuery || selectedCategory !== 'all' || quickFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setQuickFilter('all');
              }}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              Reset Filter Pencarian
            </button>
          )}
        </div>

        {/* Dynamic Commodity Cards Grid */}
        {filteredCommodities.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 space-y-3">
            <Sprout className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Tidak Ada Komoditas yang Sesuai</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Tidak ditemukan data tanaman untuk kata kunci &ldquo;{searchQuery}&rdquo;. Buat komoditas kustom Anda sekarang secara manual.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setIsManualModalOpen(true)}
                className="px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm"
              >
                + Tambah Komoditas Manual Ini
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayedCommodities.map((crop) => {
              const totalInitial = crop.avgCapexPer1000m2 + crop.avgOpexPerCycle;
              const grossEst = crop.defaultYieldKgPer1000m2 * crop.defaultPricePerKg;
              const netProfitEst = grossEst - crop.avgOpexPerCycle;

              return (
                <div
                  key={crop.id}
                  className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col justify-between hover:border-emerald-500/50 transition-all shadow-sm group relative"
                >
                  <div>
                    <div className="relative h-44 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                      <img
                        src={crop.image}
                        alt={crop.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-md">
                        {crop.categoryLabel}
                      </div>

                      {crop.isCustom ? (
                        <div className="absolute top-3 right-3 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
                          Manual / Kustom
                        </div>
                      ) : (
                        <div className="absolute top-3 right-3 bg-emerald-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-md tabular-nums">
                          {crop.cycleDays} HST
                        </div>
                      )}
                    </div>

                    <div className="p-4 sm:p-5">
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                        <span>{crop.optimalAltitude}</span>
                        <span aria-hidden="true">·</span>
                        <span>Air: {crop.waterRequirement}</span>
                        <span aria-hidden="true">·</span>
                        <span>Risiko: {crop.riskLevel}</span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 dark:text-white mb-0.5 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {crop.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 italic mb-2.5">
                        {crop.scientificName}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed mb-3">
                        {crop.description}
                      </p>

                      {/* Financial Quick Metrics */}
                      <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 dark:text-slate-400">Modal Awal/1.000m²:</span>
                          <span className="font-semibold text-slate-900 dark:text-white tabular-nums">
                            {formatIDR(totalInitial)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 dark:text-slate-400">Potensi Panen:</span>
                          <span className="font-semibold text-slate-900 dark:text-white tabular-nums">
                            {crop.defaultYieldKgPer1000m2.toLocaleString('id-ID')} Kg
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 dark:text-slate-400">Harga Acuan Pasar:</span>
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">
                            {formatIDR(crop.defaultPricePerKg)}/kg
                          </span>
                        </div>
                        <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
                          <span className="text-slate-500 dark:text-slate-400">Estimasi Laba Bersih:</span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                            ~{formatIDR(netProfitEst)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ACTIVE FUNCTION ACTION BUTTONS: Detail Profil, SOP Tani, Simulasi */}
                  <div className="p-4 sm:p-5 pt-0 grid grid-cols-3 gap-1.5">
                    <button
                      onClick={() => setSelectedCommodityForModal(crop)}
                      className="px-2 py-2 text-[11px] font-semibold rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-center truncate"
                      title="Lihat profil agronomi dan rantai pasar lengkap"
                    >
                      Profil
                    </button>

                    <button
                      onClick={() => onSelectCommodityForSOP(crop)}
                      className="px-2 py-2 text-[11px] font-semibold rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800/60 text-teal-700 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-900 transition-colors text-center flex items-center justify-center gap-1"
                      title="Buka SOP & Kalender Tanam mingguan untuk komoditas ini"
                    >
                      <BookOpen className="w-3 h-3 shrink-0" />
                      <span>SOP</span>
                    </button>

                    <button
                      onClick={() => onSelectCommodityForSimulation(crop)}
                      className="px-2 py-2 text-[11px] font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors text-center flex items-center justify-center gap-1 shadow-sm"
                      title="Buka kalkulator finansial dan hitung BEP untuk komoditas ini"
                    >
                      <Calculator className="w-3 h-3 shrink-0" />
                      <span>Simulasi</span>
                    </button>
                  </div>

                  {crop.isCustom && (
                    <button
                      onClick={() => onDeleteCustomCommodity(crop.id)}
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

        {/* Show More / Show Less Button */}
        {filteredCommodities.length > 6 && (
          <div className="flex justify-center pt-2">
            {visibleCount < filteredCommodities.length ? (
              <button
                onClick={() => setVisibleCount((prev) => prev + 6)}
                className="px-5 py-2.5 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5"
              >
                <span>Tampilkan Lebih Banyak ({filteredCommodities.length - visibleCount} Komoditas Tersisa)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => setVisibleCount(6)}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Sembunyikan Sebagian
              </button>
            )}
          </div>
        )}
      </div>

      {/* Advisory & Seasonal Planning Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-900 to-teal-950 text-white border border-emerald-800/50 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-emerald-300 text-xs font-semibold">
              <CloudSun className="w-4 h-4" />
              <span>Rekomendasi Musim Tanam Agribisnis (BMKG)</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold">
              Kunci Keberhasilan: Hindari Panen Raya Serentak di Sentra Utama
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
              Komoditas hortikultura seperti cabai dan bawang merah memberikan profit puncak bila panen jatuh pada momen defisit pasokan (hari besar keagamaan atau fase transisi musim). Gunakan Simulator untuk menguji ketahanan margin saat harga drop hingga -30%.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('sop')}
              className="w-full sm:w-auto px-4 py-2.5 bg-white text-emerald-900 font-semibold text-xs sm:text-sm rounded-xl hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Buka Panduan SOP Tani</span>
            </button>
          </div>
        </div>
      </div>

      {/* SPRINT 4 INTEGRATION: DIVERSIFIKASI PRODUK & MANAJEMEN KEBUN SHOWCASE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Module 1: Farm to Product */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50/40 dark:from-amber-950/30 dark:to-slate-900 border border-amber-200 dark:border-amber-800/60 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Hilirisasi Hasil Tani</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Farm to Product: Simulator Nilai Tambah Produk Olahan
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Selamatkan profit saat panen raya! Ubah cabai segar menjadi Chili Oil, bawang merah menjadi bawang goreng toples, dan tomat menjadi saus artisan dengan kenaikan nilai hingga 3x lipat dan masa simpan s.d. 12 bulan.
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-amber-200/60 dark:border-amber-800/40">
            <span className="text-xs font-semibold text-amber-800 dark:text-amber-300">
              Formula Olahan Siap Uji
            </span>
            <button
              onClick={() => setActiveTab('diversification')}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
            >
              <span>Buka Simulator Olahan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Module 2: My Farm Journey */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50/40 dark:from-emerald-950/30 dark:to-slate-900 border border-emerald-200 dark:border-emerald-800/60 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <ClipboardList className="w-4 h-4" />
              <span>Manajemen Operasional</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              My Farm Journey: Jurnal Kebun & Evaluasi Realisasi
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Catat pengeluaran harian kebun riil, pantau burn rate anggaran, catat buku harian lapangan (pemupukan & irigasi), serta evaluasi akurasi tonase panen vs simulasi awal.
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-emerald-200/60 dark:border-emerald-800/40">
            <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
              Pelacakan Real-time
            </span>
            <button
              onClick={() => setActiveTab('farmJourney')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
            >
              <span>Kelola Kebun Saya</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* MODAL 1: FORMULIR KOMODITAS MANUAL SECARA LENGKAP */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
            
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  Formulir Komoditas Manual
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
                  Isi Data & Parameter Komoditas Baru
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Tambahkan tanaman lokal atau varietas unggul Anda. Data langsung aktif di Dashboard, Simulator Finansial, dan SOP Tani.
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
                    placeholder="Contoh: Cabai Katokkon Toraja, Jagung Manis Talenta"
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
                    placeholder="Contoh: Capsicum chinense"
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
                    placeholder="Contoh: 0 - 800 mdpl"
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

              {/* Row 4: Financial Baseline */}
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
                  <span>Simpan Komoditas ke Dashboard</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: DETAIL PROFIL LENGKAP KOMODITAS TERPILIH */}
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

            {/* Financial Profile Card */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-slate-500 dark:text-slate-400 block mb-0.5">Capex Aset:</span>
                <span className="font-bold text-slate-900 dark:text-white tabular-nums">
                  {formatIDR(selectedCommodityForModal.avgCapexPer1000m2)}
                </span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block mb-0.5">Opex per Siklus:</span>
                <span className="font-bold text-slate-900 dark:text-white tabular-nums">
                  {formatIDR(selectedCommodityForModal.avgOpexPerCycle)}
                </span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block mb-0.5">Hasil Panen Acuan:</span>
                <span className="font-bold text-slate-900 dark:text-white tabular-nums">
                  {selectedCommodityForModal.defaultYieldKgPer1000m2.toLocaleString('id-ID')} Kg
                </span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block mb-0.5">Harga Acuan Pasar:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                  {formatIDR(selectedCommodityForModal.defaultPricePerKg)}/kg
                </span>
              </div>
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

            {/* ACTIVE ACTION BUTTONS IN MODAL */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5 pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setSelectedCommodityForModal(null)}
                className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Tutup
              </button>

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
