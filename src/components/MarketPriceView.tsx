import React, { useState } from 'react';
import { BarChart3, TrendingUp, TrendingDown, Minus, MapPin, Store, Truck, Warehouse, UserCheck } from 'lucide-react';
import { MARKET_PRICES, SUPPLY_CHAIN_MARGINS } from '../data/marketPrices';
import { formatIDR, formatPercent } from '../utils/calculator';

export const MarketPriceView: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'sayur' | 'pangan' | 'buah'>('all');

  const filteredPrices = MARKET_PRICES.filter((p) => {
    if (selectedFilter === 'sayur') return p.category.includes('Sayur');
    if (selectedFilter === 'pangan') return p.category.includes('Pangan');
    if (selectedFilter === 'buah') return p.category.includes('Buah');
    return true;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-emerald-600" />
          <span>Pantauan Harga Pasar Komoditas & Rantai Pasok</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Data pergerakan harga agregat tingkat petani dan grosir pasar induk regional di Indonesia.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit">
        {[
          { id: 'all', label: 'Semua Komoditas' },
          { id: 'sayur', label: 'Sayuran Horti' },
          { id: 'pangan', label: 'Pangan Pokok' },
          { id: 'buah', label: 'Buah & Hidroponik' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedFilter(tab.id as any)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              selectedFilter === tab.id
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Market Prices Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPrices.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  {item.category}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  {item.commodityName}
                </h3>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3" />
                  <span>{item.region}</span>
                </p>
              </div>

              <div className="text-right">
                <span className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tabular-nums">
                  {formatIDR(item.currentPrice)}
                </span>
                <span className="text-[10px] text-slate-400 block">per {item.unit}</span>
                <div
                  className={`inline-flex items-center gap-0.5 text-xs font-bold tabular-nums mt-0.5 ${
                    item.changePct >= 0
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {item.trend === 'up' ? (
                    <TrendingUp className="w-3.5 h-3.5" />
                  ) : item.trend === 'down' ? (
                    <TrendingDown className="w-3.5 h-3.5" />
                  ) : (
                    <Minus className="w-3.5 h-3.5" />
                  )}
                  <span>{formatPercent(item.changePct)} (7 hari)</span>
                </div>
              </div>
            </div>

            {/* 7 Days Mini Trend Bar Graphic */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-medium block">Tren 7 Hari Terakhir:</span>
              <div className="flex items-end gap-1.5 h-10 pt-2">
                {item.history7Days.map((val, idx) => {
                  const min = Math.min(...item.history7Days);
                  const max = Math.max(...item.history7Days);
                  const heightPercent = max === min ? 50 : Math.max(15, ((val - min) / (max - min)) * 100);
                  const isLatest = idx === item.history7Days.length - 1;
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full rounded-t-sm transition-all ${
                          isLatest
                            ? 'bg-emerald-600 dark:bg-emerald-500'
                            : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300'
                        }`}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Regional Spread */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-[11px] space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Tertinggi:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{item.highestRegion}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Terendah:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{item.lowestRegion}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Supply Chain Margin Analysis Section */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Struktur Margin Rantai Pasok Pertanian (Dari Petani hingga Konsumen)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Memahami di mana margin keuntungan terbesar berada dan cara memperpendek rantai pasok agribisnis.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SUPPLY_CHAIN_MARGINS.map((chain, index) => {
            const icons = [UserCheck, Truck, Warehouse, Store];
            const Icon = icons[index];
            return (
              <div
                key={chain.stakeholder}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white tabular-nums">
                    Porsi ~{chain.sharePct}%
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{chain.stakeholder}</h3>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                    Margin Rata-rata: {chain.typicalMargin}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    {chain.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Actionable Strategy Tip */}
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 text-xs text-emerald-900 dark:text-emerald-200 leading-relaxed">
          <strong className="font-bold">Strategi Agropreneur Modern:</strong> Petani yang menjual langsung ke segmen Hotel, Restoran, dan Kafe (Horeka) atau Supermarket Lokal dengan kemasan higienis dapat merebut tambahan margin 15% - 25% dibandingkan jika seluruh hasil panen diserahkan gelondongan ke tengkulak di tepi ladang.
        </div>
      </div>
    </div>
  );
};
