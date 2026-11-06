import React from 'react';
import { Layers, Trash2, ArrowRight, Calculator, PlusCircle, CheckCircle, TrendingUp, Calendar, Sprout } from 'lucide-react';
import { SavedScenario, Commodity } from '../types';
import { formatIDR } from '../utils/calculator';
import { COMMODITIES } from '../data/commodities';

interface PortfolioViewProps {
  savedScenarios: SavedScenario[];
  onDeleteScenario: (id: string) => void;
  onLoadScenarioToSimulator: (commodity: Commodity, scenario: SavedScenario) => void;
  onNewSimulation: () => void;
  onStartFarmProject?: (scenario: SavedScenario) => void;
}

export const PortfolioView: React.FC<PortfolioViewProps> = ({
  savedScenarios,
  onDeleteScenario,
  onLoadScenarioToSimulator,
  onNewSimulation,
  onStartFarmProject,
}) => {
  const totalInvestment = savedScenarios.reduce((acc, s) => acc + s.totalCapex + s.totalOpex, 0);
  const totalProjectedProfit = savedScenarios.reduce((acc, s) => acc + s.netProfit, 0);
  const avgRoi = savedScenarios.length > 0
    ? Math.round(savedScenarios.reduce((acc, s) => acc + s.roiPct, 0) / savedScenarios.length)
    : 0;

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-6 h-6 text-emerald-600" />
            <span>Portofolio & Skenario Usaha Tersimpan</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Koleksi rencana bisnis dan hasil simulasi kelayakan finansial yang telah Anda simpan.
          </p>
        </div>

        <button
          onClick={onNewSimulation}
          className="px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl flex items-center gap-1.5 transition-colors shadow-sm self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Buat Simulasi Baru</span>
        </button>
      </div>

      {/* Aggregate Stats */}
      {savedScenarios.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-xs text-slate-500 dark:text-slate-400">Total Proyeksi Modal Terencana</span>
            <p className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1 tabular-nums">
              {formatIDR(totalInvestment)}
            </p>
            <span className="text-[11px] text-slate-400 mt-1 block">
              Dari {savedScenarios.length} skenario aktif
            </span>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-xs text-slate-500 dark:text-slate-400">Total Potensi Laba Bersih</span>
            <p className="text-xl sm:text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums">
              {formatIDR(totalProjectedProfit)}
            </p>
            <span className="text-[11px] text-slate-400 mt-1 block">
              Akumulasi per satu siklus panen
            </span>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-xs text-slate-500 dark:text-slate-400">Rata-rata ROI Skenario</span>
            <p className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1 tabular-nums">
              {avgRoi}%
            </p>
            <span className="text-[11px] text-slate-400 mt-1 block">
              Tingkat imbal hasil rata-rata
            </span>
          </div>
        </div>
      )}

      {/* Scenarios Grid */}
      {savedScenarios.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 space-y-3">
          <Layers className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
          <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">
            Belum Ada Skenario Simulasi Tersimpan
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Buka Simulator Finansial, atur luas lahan dan biaya komoditas, lalu klik tombol "Simpan ke Portofolio Saya".
          </p>
          <button
            onClick={onNewSimulation}
            className="px-4 py-2.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm transition-colors"
          >
            Mulai Hitung Simulasi Pertama
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {savedScenarios.map((scen) => {
            const crop = COMMODITIES.find((c) => c.id === scen.commodityId) || COMMODITIES[0];
            return (
              <div
                key={scen.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4 hover:border-emerald-500/50 transition-colors"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                        {crop.categoryLabel}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                        {scen.title}
                      </h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3" />
                        <span>Disimpan: {scen.createdAt}</span>
                        <span aria-hidden="true">·</span>
                        <span>Luas: {scen.landArea} {scen.areaUnit}</span>
                      </p>
                    </div>

                    <button
                      onClick={() => onDeleteScenario(scen.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors rounded-lg"
                      title="Hapus skenario"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-4 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs">
                    <div>
                      <span className="text-slate-500 text-[11px] block">Total Modal:</span>
                      <span className="font-semibold text-slate-900 dark:text-white tabular-nums">
                        {formatIDR(scen.totalCapex + scen.totalOpex)}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-500 text-[11px] block">Omzet Proyeksi:</span>
                      <span className="font-semibold text-slate-900 dark:text-white tabular-nums">
                        {formatIDR(scen.grossRevenue)}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-500 text-[11px] block">Laba Bersih:</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                        {formatIDR(scen.netProfit)}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-500 text-[11px] block">ROI:</span>
                      <span className="font-bold text-slate-900 dark:text-white tabular-nums">
                        {scen.roiPct}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs text-slate-500">
                    Titik Impas: <strong className="text-slate-800 dark:text-slate-200">{scen.bepKg.toLocaleString('id-ID')} Kg</strong>
                  </span>

                  <div className="flex items-center gap-2">
                    {onStartFarmProject && (
                      <button
                        onClick={() => onStartFarmProject(scen)}
                        className="px-3 py-1.5 text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 hover:bg-emerald-100 dark:hover:bg-emerald-900 rounded-lg transition-colors flex items-center gap-1"
                        title="Buat proyek kebun riil dari skenario simulasi ini"
                      >
                        <Sprout className="w-3.5 h-3.5" />
                        <span>Jadikan Kebun</span>
                      </button>
                    )}

                    <button
                      onClick={() => onLoadScenarioToSimulator(crop, scen)}
                      className="px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      <Calculator className="w-3.5 h-3.5" />
                      <span>Simulator</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
