import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calculator, RefreshCw, BookmarkPlus, Check, Printer, 
  HelpCircle, AlertCircle, Sprout, TrendingUp, TrendingDown,
  Layers, Sliders, DollarSign, Scale, Percent
} from 'lucide-react';
import { 
  FarmInputs, 
  calculateFarmEconomics, 
  formatIDR, 
  formatNumber, 
  SIMULATOR_QUICK_PRESETS 
} from '../utils/calculateFarmEconomics';
import { AgropreneurScoreGauge } from './simulator/AgropreneurScoreGauge';
import { CostBreakdownChart } from './simulator/CostBreakdownChart';
import { CashflowBarChart } from './simulator/CashflowBarChart';
import { WhatIfScenarioPanel } from './simulator/WhatIfScenarioPanel';
import { Commodity, SavedScenario } from '../types';
import { COMMODITIES } from '../data/commodities';

interface SimulatorViewProps {
  initialCommodity?: Commodity | null;
  onSaveScenario: (scenario: SavedScenario) => void;
  savedScenarios: SavedScenario[];
  customCommodities?: Commodity[];
  onOpenManualModal?: () => void;
}

export const SimulatorView: React.FC<SimulatorViewProps> = ({
  initialCommodity,
  onSaveScenario,
  savedScenarios,
  customCommodities = [],
}) => {
  // Combine custom and built-in commodities
  const allCommodities = useMemo(() => {
    return [...customCommodities, ...COMMODITIES];
  }, [customCommodities]);

  // Selected preset key or commodity ID
  const [selectedPresetKey, setSelectedPresetKey] = useState<string>('pakcoy');

  // Core Farm Inputs State
  const [farmInputs, setFarmInputs] = useState<FarmInputs>(SIMULATOR_QUICK_PRESETS.pakcoy);

  // Scenario title for saving
  const [scenarioTitle, setScenarioTitle] = useState<string>('');
  const [showSaveSuccess, setShowSaveSuccess] = useState<boolean>(false);

  // Sync when initialCommodity prop is passed from Catalog or Dashboard
  useEffect(() => {
    if (initialCommodity) {
      // Map initialCommodity to farmInputs
      const matchedPresetKey = Object.keys(SIMULATOR_QUICK_PRESETS).find(
        (key) => SIMULATOR_QUICK_PRESETS[key].commodityName.toLowerCase().includes(initialCommodity.name.toLowerCase())
      );

      if (matchedPresetKey) {
        setSelectedPresetKey(matchedPresetKey);
        setFarmInputs(SIMULATOR_QUICK_PRESETS[matchedPresetKey]);
      } else {
        // Derive from commodity profile
        setSelectedPresetKey(initialCommodity.id);
        const estPop = initialCommodity.defaultYieldKgPer1000m2 > 1000 ? 1800 : 1000;
        const estProdPerPlant = Number((initialCommodity.defaultYieldKgPer1000m2 / estPop).toFixed(2));
        setFarmInputs({
          commodityName: initialCommodity.name,
          cycleDays: initialCommodity.cycleDays,
          landAreaM2: 1000,
          plantPopulation: estPop,
          productivityPerPlantKg: estProdPerPlant || 1.0,
          shrinkagePct: 8,
          targetPricePerKg: initialCommodity.defaultPricePerKg,
          capexTotal: initialCommodity.avgCapexPer1000m2,
          seedCost: Math.round(initialCommodity.avgOpexPerCycle * 0.2),
          fertilizerCost: Math.round(initialCommodity.avgOpexPerCycle * 0.3),
          pesticideCost: Math.round(initialCommodity.avgOpexPerCycle * 0.15),
          laborCost: Math.round(initialCommodity.avgOpexPerCycle * 0.25),
          utilitiesCost: 400000,
          packagingCost: 400000,
          transportCost: 350000,
          fixedOperatingCost: 500000,
          agronomicEaseScore: 75,
          marketLiquidityScore: 85,
        });
      }
    }
  }, [initialCommodity]);

  // Handle Preset Button Click
  const handleSelectPreset = (key: string) => {
    setSelectedPresetKey(key);
    if (SIMULATOR_QUICK_PRESETS[key]) {
      setFarmInputs(SIMULATOR_QUICK_PRESETS[key]);
    } else {
      const comm = allCommodities.find((c) => c.id === key);
      if (comm) {
        setFarmInputs({
          commodityName: comm.name,
          cycleDays: comm.cycleDays,
          landAreaM2: 1000,
          plantPopulation: 1500,
          productivityPerPlantKg: Number((comm.defaultYieldKgPer1000m2 / 1500).toFixed(2)),
          shrinkagePct: 8,
          targetPricePerKg: comm.defaultPricePerKg,
          capexTotal: comm.avgCapexPer1000m2,
          seedCost: Math.round(comm.avgOpexPerCycle * 0.2),
          fertilizerCost: Math.round(comm.avgOpexPerCycle * 0.3),
          pesticideCost: Math.round(comm.avgOpexPerCycle * 0.15),
          laborCost: Math.round(comm.avgOpexPerCycle * 0.25),
          utilitiesCost: 400000,
          packagingCost: 400000,
          transportCost: 350000,
          fixedOperatingCost: 500000,
          agronomicEaseScore: 75,
          marketLiquidityScore: 85,
        });
      }
    }
  };

  // Helper to update specific input fields
  const updateInput = <K extends keyof FarmInputs>(key: K, value: FarmInputs[K]) => {
    setFarmInputs((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Execute Financial Calculations in Real-Time
  const results = calculateFarmEconomics(farmInputs);

  // Save Scenario Handler
  const handleSave = () => {
    const title = scenarioTitle.trim() || `${farmInputs.commodityName} (${farmInputs.landAreaM2} m²)`;
    const scenario: SavedScenario = {
      id: `scen-${Date.now()}`,
      title,
      createdAt: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      commodityId: selectedPresetKey,
      commodityName: farmInputs.commodityName,
      landArea: farmInputs.landAreaM2,
      areaUnit: 'm2',
      totalCapex: results.capexTotal,
      totalOpex: results.totalOpex,
      grossRevenue: results.grossRevenue,
      netProfit: results.netProfit,
      roiPct: results.profitMarginPct,
      bepKg: results.bepQuantityKg,
    };
    onSaveScenario(scenario);
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#26372B] dark:text-white flex items-center gap-2">
            <Calculator className="w-6 h-6 text-[#1E6B45]" />
            <span>Agro Business Simulator & Financial Engine</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Simulasi reaktif kelayakan usaha tani: pemisahan Capex vs Opex, analisis margin, BEP, dan stress-testing risiko lapangan.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => handleSelectPreset(selectedPresetKey)}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
            title="Reset ke parameter default"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Input</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3 py-2 text-xs font-semibold rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:bg-slate-800 transition-colors flex items-center gap-1.5 shadow-sm"
            title="Cetak ringkasan PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak PDF</span>
          </button>
        </div>
      </div>

      {/* Quick Commodity Preset Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
            Preset Cepat Komoditas Acuan:
          </span>
          <span className="text-[11px] text-slate-500">
            Pilih untuk memuat parameter agronomis & struktur biaya riil
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {[
            { key: 'pakcoy', label: 'Pakcoy Hidroponik (30 HST)', icon: '🥬' },
            { key: 'cabai_rawit', label: 'Cabai Rawit Merah (120 HST)', icon: '🌶️' },
            { key: 'tomat', label: 'Tomat Servo Dataran Tinggi (85 HST)', icon: '🍅' },
            { key: 'melon', label: 'Melon Golden Greenhouse (70 HST)', icon: '🍈' },
            { key: 'bawang_merah', label: 'Bawang Merah Brebes (60 HST)', icon: '🧅' },
          ].map((preset) => (
            <button
              key={preset.key}
              onClick={() => handleSelectPreset(preset.key)}
              className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 ${
                selectedPresetKey === preset.key
                  ? 'bg-[#1E6B45] text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <span>{preset.icon}</span>
              <span>{preset.label}</span>
            </button>
          ))}

          {/* All Commodities Dropdown */}
          <div className="relative flex-1 min-w-[200px]">
            <select
              value={selectedPresetKey}
              onChange={(e) => handleSelectPreset(e.target.value)}
              className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-[#1E6B45]"
            >
              <option value="" disabled>Pilih Komoditas Lainnya ({allCommodities.length} tanaman)...</option>
              {allCommodities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.isCustom ? '⭐ [Manual] ' : ''}{c.name} ({c.cycleDays} HST)
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* MAIN SIMULATOR 2-COLUMN VIEWPORT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ========================================================================= */}
        {/* KOLOM KIRI (INPUT CONTROLS): Luas, Populasi, Harga, Capex, dan Pos Opex  */}
        {/* ========================================================================= */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Section A: Lahan & Target Produksi */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <Sprout className="w-4 h-4 text-[#1E6B45]" />
              <h3 className="text-sm font-bold text-[#26372B] dark:text-white">
                1. Parameter Lahan & Potensi Panen
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Luas Lahan (m²)
                </label>
                <input
                  type="number"
                  min="10"
                  step="50"
                  value={farmInputs.landAreaM2}
                  onChange={(e) => updateInput('landAreaM2', Math.max(1, Number(e.target.value)))}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white tabular-nums font-semibold focus:outline-none focus:ring-2 focus:ring-[#1E6B45]"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Populasi Tanaman (Titik/Pohon)
                </label>
                <input
                  type="number"
                  min="1"
                  step="100"
                  value={farmInputs.plantPopulation}
                  onChange={(e) => updateInput('plantPopulation', Math.max(1, Number(e.target.value)))}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white tabular-nums font-semibold focus:outline-none focus:ring-2 focus:ring-[#1E6B45]"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Produktivitas/Tanaman (kg)
                </label>
                <input
                  type="number"
                  min="0.01"
                  step="0.05"
                  value={farmInputs.productivityPerPlantKg}
                  onChange={(e) => updateInput('productivityPerPlantKg', Math.max(0.01, Number(e.target.value)))}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white tabular-nums font-semibold focus:outline-none focus:ring-2 focus:ring-[#1E6B45]"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Estimasi Susut Hasil (%)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={farmInputs.shrinkagePct}
                    onChange={(e) => updateInput('shrinkagePct', Math.min(50, Math.max(0, Number(e.target.value))))}
                    className="w-20 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white tabular-nums font-semibold text-center focus:outline-none"
                  />
                  <input
                    type="range"
                    min="0"
                    max="30"
                    value={farmInputs.shrinkagePct}
                    onChange={(e) => updateInput('shrinkagePct', Number(e.target.value))}
                    className="flex-1 accent-[#1E6B45] cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Target Price per Kg */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="flex justify-between items-center mb-1">
                <label className="font-bold text-[#1E6B45] dark:text-emerald-400">
                  Target Harga Jual Pasar (Rp/kg)
                </label>
                <span className="font-extrabold text-slate-900 dark:text-white tabular-nums text-sm">
                  {formatIDR(farmInputs.targetPricePerKg)}
                </span>
              </div>
              <input
                type="range"
                min="1000"
                max="100000"
                step="500"
                value={farmInputs.targetPricePerKg}
                onChange={(e) => updateInput('targetPricePerKg', Number(e.target.value))}
                className="w-full accent-[#1E6B45] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                <span>Rp 1.000</span>
                <span>Rp 50.000</span>
                <span>Rp 100.000</span>
              </div>
            </div>

            {/* Computed Net Yield Snapshot */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
              <span className="text-slate-600 dark:text-slate-400">Total Hasil Panen Netto:</span>
              <span className="font-extrabold text-[#1E6B45] dark:text-emerald-400 tabular-nums text-sm">
                {formatNumber(results.netYieldKg)} kg layak jual
              </span>
            </div>
          </div>

          {/* Section B: Biaya Operasional (Opex) Sliders & Inputs */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-[#1E6B45]" />
                <h3 className="text-sm font-bold text-[#26372B] dark:text-white">
                  2. Biaya Operasional per Siklus (Opex)
                </h3>
              </div>
              <span className="text-xs font-extrabold text-[#D9534F] tabular-nums">
                {formatIDR(results.totalOpex)}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              {/* Benih */}
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Benih / Bibit Unggul</span>
                  <span className="font-semibold tabular-nums text-slate-900 dark:text-white">
                    {formatIDR(farmInputs.seedCost)}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10000000"
                  step="50000"
                  value={farmInputs.seedCost}
                  onChange={(e) => updateInput('seedCost', Number(e.target.value))}
                  className="w-full accent-[#1E6B45] cursor-pointer"
                />
              </div>

              {/* Pupuk */}
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Pupuk (Dasar, Susulan & Nutrisi)</span>
                  <span className="font-semibold tabular-nums text-slate-900 dark:text-white">
                    {formatIDR(farmInputs.fertilizerCost)}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="15000000"
                  step="50000"
                  value={farmInputs.fertilizerCost}
                  onChange={(e) => updateInput('fertilizerCost', Number(e.target.value))}
                  className="w-full accent-[#F4B544] cursor-pointer"
                />
              </div>

              {/* Pestisida */}
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Pestisida, Fungisida & Hayati</span>
                  <span className="font-semibold tabular-nums text-slate-900 dark:text-white">
                    {formatIDR(farmInputs.pesticideCost)}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="8000000"
                  step="50000"
                  value={farmInputs.pesticideCost}
                  onChange={(e) => updateInput('pesticideCost', Number(e.target.value))}
                  className="w-full accent-[#D9534F] cursor-pointer"
                />
              </div>

              {/* Tenaga Kerja */}
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Upah Tenaga Kerja (Olah, Rawat & Panen)</span>
                  <span className="font-semibold tabular-nums text-slate-900 dark:text-white">
                    {formatIDR(farmInputs.laborCost)}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="15000000"
                  step="100000"
                  value={farmInputs.laborCost}
                  onChange={(e) => updateInput('laborCost', Number(e.target.value))}
                  className="w-full accent-[#1E6B45] cursor-pointer"
                />
              </div>

              {/* Air & Listrik */}
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Air Baku, Listrik & Pompa</span>
                  <span className="font-semibold tabular-nums text-slate-900 dark:text-white">
                    {formatIDR(farmInputs.utilitiesCost)}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="3000000"
                  step="50000"
                  value={farmInputs.utilitiesCost}
                  onChange={(e) => updateInput('utilitiesCost', Number(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer"
                />
              </div>

              {/* Kemasan & Transportasi */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="text-slate-500 block mb-0.5">Kemasan (Rp)</label>
                  <input
                    type="number"
                    step="50000"
                    value={farmInputs.packagingCost}
                    onChange={(e) => updateInput('packagingCost', Math.max(0, Number(e.target.value)))}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 tabular-nums text-slate-900 dark:text-white font-medium"
                  />
                </div>
                <div>
                  <label className="text-slate-500 block mb-0.5">Transportasi (Rp)</label>
                  <input
                    type="number"
                    step="50000"
                    value={farmInputs.transportCost}
                    onChange={(e) => updateInput('transportCost', Math.max(0, Number(e.target.value)))}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 tabular-nums text-slate-900 dark:text-white font-medium"
                  />
                </div>
              </div>

              {/* Biaya Tetap Operasional / Sewa Lahan Musim */}
              <div className="pt-1">
                <label className="text-slate-500 block mb-0.5">Alokasi Biaya Tetap / Sewa Lahan Musiman (Rp)</label>
                <input
                  type="number"
                  step="100000"
                  value={farmInputs.fixedOperatingCost}
                  onChange={(e) => updateInput('fixedOperatingCost', Math.max(0, Number(e.target.value)))}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 tabular-nums text-slate-900 dark:text-white font-medium"
                />
              </div>
            </div>
          </div>

          {/* Section C: Biaya Investasi Awal (Capex) */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-[#1E6B45]" />
                <h3 className="text-sm font-bold text-[#26372B] dark:text-white">
                  3. Biaya Investasi Aset Awal (Capex)
                </h3>
              </div>
              <span className="text-xs font-bold text-[#F4B544] tabular-nums">
                {formatIDR(farmInputs.capexTotal)}
              </span>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              *Capex (sewa lahan jangka panjang, instalasi greenhouse, mulsa, mesin pompa, selang drip) tidak dibebankan 100% pada siklus pertama, melainkan dihitung pada metrik Payback Period.
            </p>

            <div className="space-y-1 text-xs">
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Total Nilai Investasi Capex (Rp)
              </label>
              <input
                type="number"
                step="500000"
                value={farmInputs.capexTotal}
                onChange={(e) => updateInput('capexTotal', Math.max(0, Number(e.target.value)))}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white tabular-nums font-semibold"
              />
            </div>
          </div>

          {/* Section D: Save Scenario Card */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              Simpan Hasil Simulasi Ini
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={scenarioTitle}
                onChange={(e) => setScenarioTitle(e.target.value)}
                placeholder={`Nama skenario (${farmInputs.commodityName})...`}
                className="flex-1 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1E6B45]"
              />
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-[#1E6B45] hover:bg-[#165235] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all shadow-sm shrink-0"
              >
                <BookmarkPlus className="w-4 h-4" />
                <span>Simpan</span>
              </button>
            </div>
            {showSaveSuccess && (
              <p className="text-[11px] font-semibold text-[#2E7D32] flex items-center gap-1 animate-in fade-in">
                <Check className="w-3.5 h-3.5" />
                <span>Tersimpan di tab Portofolio!</span>
              </p>
            )}
          </div>

        </div>

        {/* ========================================================================= */}
        {/* KOLOM KANAN (FINANCIAL DASHBOARD & OUTPUT): KPI, Gauge, Charts, What-If  */}
        {/* ========================================================================= */}
        <div className="lg:col-span-7 space-y-6">

          {/* 1. SUMMARY METRIC CARDS (High-Impact Dashboard) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
            
            {/* Laba Bersih Card (Highlight Utama) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#E8F3E8] dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800/60 shadow-sm col-span-2 sm:col-span-1">
              <span className="text-xs text-slate-600 dark:text-slate-300 font-semibold block">
                Estimasi Laba Bersih
              </span>
              <p className="text-xl sm:text-2xl font-extrabold text-[#2E7D32] dark:text-emerald-400 mt-1 tabular-nums">
                {formatIDR(results.netProfit)}
              </p>
              <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 mt-2 pt-2 border-t border-emerald-200 dark:border-emerald-800/40">
                <span>Per Siklus ({farmInputs.cycleDays} HST)</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  ~{formatIDR(results.monthlyNetProfit)}/bln
                </span>
              </div>
            </div>

            {/* Total Omzet */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">
                Total Omzet (Revenue)
              </span>
              <p className="text-lg sm:text-xl font-extrabold text-[#26372B] dark:text-white mt-1 tabular-nums">
                {formatIDR(results.grossRevenue)}
              </p>
              <div className="text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 truncate">
                Hasil: <strong className="text-slate-800 dark:text-slate-200">{formatNumber(results.netYieldKg)} kg</strong>
              </div>
            </div>

            {/* Total Opex */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">
                Total Biaya Opex
              </span>
              <p className="text-lg sm:text-xl font-extrabold text-[#D9534F] mt-1 tabular-nums">
                {formatIDR(results.totalOpex)}
              </p>
              <div className="text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                Capex: <strong className="text-slate-800 dark:text-slate-200">{formatIDR(results.capexTotal)}</strong>
              </div>
            </div>

            {/* Margin Keuntungan */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">
                Margin Keuntungan
              </span>
              <p className="text-lg sm:text-xl font-extrabold text-[#F4B544] mt-1 tabular-nums">
                {results.profitMarginPct}%
              </p>
              <div className="text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                Status: <strong className="text-slate-800 dark:text-slate-200">{results.isProfitable ? 'Profitabel' : 'Defisit'}</strong>
              </div>
            </div>

            {/* HPP per Kg */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">
                HPP per Kg (Biaya Pokok)
              </span>
              <p className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white mt-1 tabular-nums">
                {formatIDR(results.hppPerKg)}
              </p>
              <div className="text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                Harga Jual: <strong className="text-slate-800 dark:text-slate-200">{formatIDR(farmInputs.targetPricePerKg)}</strong>
              </div>
            </div>

            {/* Payback Period (Waktu Balik Modal) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">
                Balik Modal (Payback)
              </span>
              <p className="text-lg sm:text-xl font-extrabold text-[#1E6B45] dark:text-emerald-400 mt-1 tabular-nums">
                {results.isProfitable && results.capexTotal > 0
                  ? `${results.paybackPeriodCycles} Siklus`
                  : results.capexTotal === 0
                  ? '0 (Tanpa Capex)'
                  : 'N/A (Defisit)'}
              </p>
              <div className="text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                Estimasi: <strong className="text-slate-800 dark:text-slate-200">{results.paybackPeriodMonths > 0 ? `~${results.paybackPeriodMonths} Bulan` : '-'}</strong>
              </div>
            </div>

          </div>

          {/* 2. BEP Fisik & BEP Harga Banner */}
          <div className="p-4 rounded-xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-[#1E6B45]" />
              <span className="font-bold text-[#26372B] dark:text-white">Titik Impas (Break-Even Point):</span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <div>
                <span className="text-slate-500">BEP Fisik: </span>
                <strong className="text-slate-900 dark:text-white tabular-nums font-bold">
                  {formatNumber(results.bepQuantityKg)} kg
                </strong>
                <span className="text-[10px] text-slate-400 ml-1">
                  ({results.netYieldKg > 0 ? ((results.bepQuantityKg / results.netYieldKg) * 100).toFixed(0) : 0}% panen)
                </span>
              </div>
              <span className="text-slate-300">|</span>
              <div>
                <span className="text-slate-500">BEP Harga Minimal: </span>
                <strong className="text-[#D9534F] tabular-nums font-bold">
                  {formatIDR(results.bepPricePerKg)}/kg
                </strong>
              </div>
            </div>
          </div>

          {/* 3. AGROPRENEUR SCORE ENGINE GAUGE (0-100) */}
          <AgropreneurScoreGauge result={results} />

          {/* 4. VISUALISASI CHARTS (Cost Breakdown Donut & Cashflow Bar Chart) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <CostBreakdownChart result={results} />
            <CashflowBarChart result={results} />
          </div>

          {/* 5. "WHAT-IF" SCENARIO STRESS-TESTING PANEL */}
          <WhatIfScenarioPanel baseInputs={farmInputs} />

          {/* 6. DISCLAIMER BANNER */}
          <div className="p-4 rounded-xl bg-amber-50/80 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5 leading-relaxed">
            <AlertCircle className="w-4 h-4 text-[#F4B544] shrink-0 mt-0.5" />
            <div>
              <strong>Disclaimer Agropreneur:</strong> Simulasi merupakan estimasi berdasarkan asumsi parameter input pengguna. Kondisi cuaca riil, dinamika pasokan pasar regional, serta keahlian teknis budidaya di lapangan dapat memengaruhi hasil panen riil.
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
