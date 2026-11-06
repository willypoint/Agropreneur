import React from 'react';
import { Award, CheckCircle2, AlertTriangle, TrendingUp, Sparkles, ShieldAlert } from 'lucide-react';
import { FarmEconomicsResult } from '../../utils/calculateFarmEconomics';

interface AgropreneurScoreGaugeProps {
  result: FarmEconomicsResult;
}

export const AgropreneurScoreGauge: React.FC<AgropreneurScoreGaugeProps> = ({ result }) => {
  const { scoreTotal, scoreBreakdown, scoreCategory, scoreBadgeColor, positiveDrivers, riskFactors } = result;

  // Gauge circular mathematics
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scoreTotal / 100) * circumference;

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-[#F4B544] flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[#26372B] dark:text-white">
              Agropreneur Score Engine
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Indeks kelayakan bisnis pertanian multivariabel (Skala 0–100)
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <span
          style={{ backgroundColor: `${scoreBadgeColor}15`, color: scoreBadgeColor, borderColor: `${scoreBadgeColor}40` }}
          className="text-xs font-bold px-3 py-1 rounded-full border flex items-center gap-1.5 whitespace-nowrap"
        >
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: scoreBadgeColor }} />
          {scoreCategory}
        </span>
      </div>

      {/* Main Score Gauge Visualization */}
      <div className="flex flex-col sm:flex-row items-center gap-6 justify-between">
        {/* Circular Gauge */}
        <div className="relative flex items-center justify-center shrink-0">
          <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 128 128">
            {/* Background Track */}
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke="currentColor"
              strokeWidth="11"
              fill="transparent"
              className="text-slate-100 dark:text-slate-800"
            />
            {/* Progress Arc */}
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke={scoreBadgeColor}
              strokeWidth="11"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-700 ease-out"
            />
          </svg>

          {/* Centered Number Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-extrabold text-[#26372B] dark:text-white tabular-nums tracking-tight">
              {scoreTotal}
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              / 100
            </span>
          </div>
        </div>

        {/* 5 Weighted Component Progress Bars */}
        <div className="w-full space-y-2 text-xs">
          <div className="space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-600 dark:text-slate-300">Margin Keuntungan (30%)</span>
              <span className="font-bold tabular-nums text-slate-900 dark:text-white">{scoreBreakdown.margin}/100</span>
            </div>
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                style={{ width: `${scoreBreakdown.margin}%` }}
                className="h-full bg-emerald-600 rounded-full transition-all duration-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-600 dark:text-slate-300">Kecepatan Panen (20%)</span>
              <span className="font-bold tabular-nums text-slate-900 dark:text-white">{scoreBreakdown.harvestSpeed}/100</span>
            </div>
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                style={{ width: `${scoreBreakdown.harvestSpeed}%` }}
                className="h-full bg-[#1E6B45] rounded-full transition-all duration-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-600 dark:text-slate-300">Kemudahan Budidaya (20%)</span>
              <span className="font-bold tabular-nums text-slate-900 dark:text-white">{scoreBreakdown.farmingEase}/100</span>
            </div>
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                style={{ width: `${scoreBreakdown.farmingEase}%` }}
                className="h-full bg-teal-600 rounded-full transition-all duration-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-600 dark:text-slate-300">Akses Permodalan (15%)</span>
              <span className="font-bold tabular-nums text-slate-900 dark:text-white">{scoreBreakdown.capitalAccess}/100</span>
            </div>
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                style={{ width: `${scoreBreakdown.capitalAccess}%` }}
                className="h-full bg-amber-500 rounded-full transition-all duration-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-600 dark:text-slate-300">Diversifikasi & Likuiditas (15%)</span>
              <span className="font-bold tabular-nums text-slate-900 dark:text-white">{scoreBreakdown.diversification}/100</span>
            </div>
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                style={{ width: `${scoreBreakdown.diversification}%` }}
                className="h-full bg-blue-600 rounded-full transition-all duration-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Transparent Factors Grid: Drivers & Risks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
        {/* Positive Drivers */}
        <div className="p-3.5 rounded-xl bg-[#E8F3E8] dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#1E6B45] dark:text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />
            <span>Faktor Pendorong Utama</span>
          </div>
          <ul className="text-xs text-slate-700 dark:text-emerald-100 space-y-1">
            {positiveDrivers.map((driver, idx) => (
              <li key={idx} className="flex items-start gap-1.5 leading-snug">
                <span className="text-[#2E7D32] font-bold">•</span>
                <span>{driver}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Risk Factors */}
        <div className="p-3.5 rounded-xl bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#D9534F] dark:text-rose-400">
            <AlertTriangle className="w-4 h-4 text-[#D9534F]" />
            <span>Faktor Risiko Kritis</span>
          </div>
          <ul className="text-xs text-slate-700 dark:text-rose-100 space-y-1">
            {riskFactors.length > 0 ? (
              riskFactors.map((risk, idx) => (
                <li key={idx} className="flex items-start gap-1.5 leading-snug">
                  <span className="text-[#D9534F] font-bold">•</span>
                  <span>{risk}</span>
                </li>
              ))
            ) : (
              <li className="flex items-start gap-1.5 leading-snug text-slate-500">
                <span className="text-emerald-600 font-bold">•</span>
                <span>Tidak ada indikasi risiko dominan. Operasional dinilai seimbang.</span>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};
