import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { PieChart as PieIcon, AlertCircle } from 'lucide-react';
import { formatIDR, FarmEconomicsResult } from '../../utils/calculateFarmEconomics';

interface CostBreakdownChartProps {
  result: FarmEconomicsResult;
}

export const CostBreakdownChart: React.FC<CostBreakdownChartProps> = ({ result }) => {
  const { costBreakdown, costPercentages, totalOpex } = result;

  const data = [
    { name: 'Tenaga Kerja', value: costBreakdown.labor, pct: costPercentages.labor, color: '#1E6B45' },
    { name: 'Pupuk Nutrisi', value: costBreakdown.fertilizer, pct: costPercentages.fertilizer, color: '#F4B544' },
    { name: 'Benih Unggul', value: costBreakdown.seed, pct: costPercentages.seed, color: '#2E7D32' },
    { name: 'Pestisida & Obat', value: costBreakdown.pesticide, pct: costPercentages.pesticide, color: '#D9534F' },
    { name: 'Air & Listrik', value: costBreakdown.utilities, pct: costPercentages.utilities, color: '#3B82F6' },
    { name: 'Kemasan', value: costBreakdown.packaging, pct: costPercentages.packaging, color: '#8B5CF6' },
    { name: 'Transportasi', value: costBreakdown.transport, pct: costPercentages.transport, color: '#EC4899' },
    { name: 'Biaya Tetap/Sewa', value: costBreakdown.fixedOperating, pct: costPercentages.fixedOperating, color: '#64748B' },
  ].filter((item) => item.value > 0);

  // Determine highest cost item
  const dominantItem = [...data].sort((a, b) => b.value - a.value)[0] || data[0];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl shadow-lg text-xs">
          <p className="font-bold text-[#26372B] dark:text-white">{item.name}</p>
          <p className="text-emerald-700 dark:text-emerald-400 font-extrabold tabular-nums">
            {formatIDR(item.value)}
          </p>
          <p className="text-[11px] text-slate-500">
            Porsi: <strong className="text-slate-800 dark:text-slate-200">{item.pct}%</strong> dari Opex
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <PieIcon className="w-5 h-5 text-[#1E6B45]" />
          <h3 className="text-sm sm:text-base font-bold text-[#26372B] dark:text-white">
            Struktur Biaya Operasional (Cost Breakdown)
          </h3>
        </div>
        <span className="text-xs font-semibold text-slate-500 tabular-nums">
          Total Opex: <strong className="text-[#26372B] dark:text-white">{formatIDR(totalOpex)}</strong>
        </span>
      </div>

      {totalOpex === 0 ? (
        <div className="h-48 flex items-center justify-center text-xs text-slate-400">
          Belum ada komponen biaya operasional yang diinput.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
          {/* Donut Chart */}
          <div className="sm:col-span-6 h-52 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400">Porsi Terbesar</span>
              <span className="text-xs font-extrabold text-[#1E6B45] dark:text-emerald-400 truncate max-w-[90px]">
                {dominantItem ? dominantItem.name : '-'}
              </span>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 tabular-nums">
                {dominantItem ? `${dominantItem.pct}%` : ''}
              </span>
            </div>
          </div>

          {/* Legend Items Grid */}
          <div className="sm:col-span-6 space-y-1.5 text-xs max-h-52 overflow-y-auto pr-1">
            {data.map((item) => (
              <div key={item.name} className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-700 dark:text-slate-300 text-xs truncate max-w-[110px]">{item.name}</span>
                </div>
                <div className="text-right">
                  <span className="font-semibold text-slate-900 dark:text-white tabular-nums block text-xs">
                    {formatIDR(item.value)}
                  </span>
                  <span className="text-[10px] text-slate-400 tabular-nums">{item.pct}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dominant Cost Driver Alert */}
      {dominantItem && (
        <div className="p-3 rounded-xl bg-[#E8F3E8] dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 text-xs text-slate-800 dark:text-emerald-100 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-[#1E6B45] shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            Porsi biaya tertinggi berada pada <strong>{dominantItem.name} ({dominantItem.pct}% dari total Opex)</strong>. Optimalisasi efisiensi pada pos ini akan memberikan dampak tercepat terhadap lonjakan margin laba bersih.
          </div>
        </div>
      )}
    </div>
  );
};
