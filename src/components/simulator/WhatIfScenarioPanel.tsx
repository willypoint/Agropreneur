import React, { useState } from 'react';
import { Sliders, ArrowRight, TrendingDown, TrendingUp, AlertTriangle, ShieldCheck, RefreshCw } from 'lucide-react';
import { 
  FarmInputs, 
  WhatIfScenarioMode, 
  calculateWhatIfScenarios, 
  formatIDR 
} from '../../utils/calculateFarmEconomics';

interface WhatIfScenarioPanelProps {
  baseInputs: FarmInputs;
}

export const WhatIfScenarioPanel: React.FC<WhatIfScenarioPanelProps> = ({ baseInputs }) => {
  const [activeMode, setActiveMode] = useState<WhatIfScenarioMode>('market_crash');

  const scenarios = calculateWhatIfScenarios(baseInputs);
  const baseline = scenarios.normal;
  const currentScenario = scenarios[activeMode];

  const modes: Array<{ id: WhatIfScenarioMode; label: string; badge: string }> = [
    { id: 'normal', label: '1. Normal', badge: 'Baseline' },
    { id: 'market_crash', label: '2. Pasar Jatuh (-20%)', badge: 'Harga Anjlok' },
    { id: 'crop_loss', label: '3. Hama / Cuaca (+30%)', badge: 'Gagal Sebagian' },
    { id: 'cost_hike', label: '4. Biaya Naik (+15%)', badge: 'Saprotan Naik' },
  ];

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#E8F3E8] dark:bg-emerald-950/60 text-[#1E6B45] dark:text-emerald-300 flex items-center justify-center">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[#26372B] dark:text-white">
              "What-If" Stress-Testing & Skenario Lapangan
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Uji daya tahan toleransi keuntungan terhadap 3 risiko ekstrem agribisnis
            </p>
          </div>
        </div>

        {/* Tolerance Status Pill */}
        <div className="self-start sm:self-auto">
          <span
            className={`text-xs font-bold px-3 py-1 rounded-full border flex items-center gap-1.5 ${
              currentScenario.toleranceStatus === 'Untung Optimal'
                ? 'bg-emerald-50 text-[#2E7D32] border-emerald-300 dark:bg-emerald-950/50 dark:border-emerald-800'
                : currentScenario.toleranceStatus === 'Toleransi Laba Menipis'
                ? 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/50 dark:border-amber-800'
                : 'bg-rose-50 text-[#D9534F] border-rose-300 dark:bg-rose-950/50 dark:border-rose-800'
            }`}
          >
            {currentScenario.isProfitable ? (
              <ShieldCheck className="w-3.5 h-3.5" />
            ) : (
              <AlertTriangle className="w-3.5 h-3.5" />
            )}
            <span>Status: {currentScenario.toleranceStatus}</span>
          </span>
        </div>
      </div>

      {/* Mode Selector Segmented Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {modes.map((m) => (
          <button
            key={m.id}
            onClick={() => setActiveMode(m.id)}
            className={`p-2.5 rounded-xl text-left border transition-all ${
              activeMode === m.id
                ? 'bg-[#E8F3E8] dark:bg-emerald-950/50 border-[#1E6B45] dark:border-emerald-600 text-[#1E6B45] dark:text-emerald-300 font-bold shadow-xs'
                : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
            }`}
          >
            <span className="text-xs block">{m.label}</span>
            <span className="text-[10px] text-slate-400 font-normal block mt-0.5">{m.badge}</span>
          </button>
        ))}
      </div>

      {/* Scenario Explanation */}
      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2 leading-relaxed">
        <span className="font-bold text-[#1E6B45] dark:text-emerald-400 shrink-0">Catatan Simulasi:</span>
        <span>{currentScenario.description}</span>
      </div>

      {/* Side-by-Side Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Kondisi Normal (Baseline) */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Sebelum Skenario (Baseline)
            </span>
            <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-md">
              Kondisi Normal
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Omzet Kotor:</span>
              <span className="font-bold text-slate-900 dark:text-white tabular-nums">
                {formatIDR(baseline.grossRevenue)}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500">Total Opex (Biaya):</span>
              <span className="font-semibold text-slate-900 dark:text-white tabular-nums">
                {formatIDR(baseline.totalOpex)}
              </span>
            </div>

            <div className="flex justify-between items-center pt-1 border-t border-slate-200 dark:border-slate-700">
              <span className="font-bold text-slate-700 dark:text-slate-300">Laba Bersih:</span>
              <span className="font-extrabold text-[#2E7D32] tabular-nums text-sm">
                {formatIDR(baseline.netProfit)}
              </span>
            </div>

            <div className="flex justify-between items-center text-[11px] text-slate-500">
              <span>Margin Keuntungan:</span>
              <span className="font-bold tabular-nums text-slate-800 dark:text-slate-200">
                {baseline.profitMarginPct}%
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Sesudah Skenario Stress-Test */}
        <div
          className={`p-4 rounded-xl border space-y-3 transition-colors ${
            currentScenario.isProfitable
              ? 'bg-[#E8F3E8]/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
              : 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-300 dark:border-rose-900'
          }`}
        >
          <div className="flex items-center justify-between pb-2 border-b border-emerald-200 dark:border-slate-700">
            <span className="text-xs font-bold text-[#1E6B45] dark:text-emerald-300 uppercase tracking-wide">
              Sesudah Skenario Risiko
            </span>
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                currentScenario.isProfitable
                  ? 'bg-[#2E7D32] text-white'
                  : 'bg-[#D9534F] text-white'
              }`}
            >
              {currentScenario.isProfitable ? 'Masih Untung' : 'Zona Defisit (Rugi)'}
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-600 dark:text-slate-300">Omzet Sesudah Risiko:</span>
              <span className="font-bold text-slate-900 dark:text-white tabular-nums">
                {formatIDR(currentScenario.grossRevenue)}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-600 dark:text-slate-300">Total Opex Baru:</span>
              <span className="font-semibold text-slate-900 dark:text-white tabular-nums">
                {formatIDR(currentScenario.totalOpex)}
              </span>
            </div>

            <div className="flex justify-between items-center pt-1 border-t border-emerald-200/80 dark:border-slate-700">
              <span className="font-bold text-slate-800 dark:text-slate-200">Laba Bersih Baru:</span>
              <span
                className={`font-extrabold tabular-nums text-sm ${
                  currentScenario.isProfitable ? 'text-[#2E7D32]' : 'text-[#D9534F]'
                }`}
              >
                {formatIDR(currentScenario.netProfit)}
              </span>
            </div>

            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-500">Perubahan dari Normal:</span>
              <span
                className={`font-bold tabular-nums flex items-center gap-0.5 ${
                  currentScenario.deltaNetProfit < 0 ? 'text-[#D9534F]' : 'text-slate-600'
                }`}
              >
                {currentScenario.deltaNetProfit < 0 && <TrendingDown className="w-3 h-3" />}
                {formatIDR(currentScenario.deltaNetProfit)} ({currentScenario.deltaProfitPct}%)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
