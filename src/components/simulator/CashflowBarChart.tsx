import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { BarChart3, TrendingUp, TrendingDown } from 'lucide-react';
import { formatIDR, FarmEconomicsResult } from '../../utils/calculateFarmEconomics';

interface CashflowBarChartProps {
  result: FarmEconomicsResult;
}

export const CashflowBarChart: React.FC<CashflowBarChartProps> = ({ result }) => {
  const { grossRevenue, totalOpex, netProfit, isProfitable, bepRevenueRp } = result;

  const data = [
    {
      name: 'Total Opex (Biaya)',
      amount: totalOpex,
      color: '#D9534F', // Negative/Cost red
    },
    {
      name: 'Omzet (Pendapatan)',
      amount: grossRevenue,
      color: '#1E6B45', // Primary Green
    },
    {
      name: 'Laba Bersih',
      amount: netProfit,
      color: isProfitable ? '#2E7D32' : '#D9534F',
    },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl shadow-lg text-xs">
          <p className="font-bold text-[#26372B] dark:text-white">{item.name}</p>
          <p className="text-sm font-extrabold tabular-nums mt-0.5" style={{ color: item.color }}>
            {formatIDR(item.amount)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-[#1E6B45]" />
          <h3 className="text-sm sm:text-base font-bold text-[#26372B] dark:text-white">
            Perbandingan Finansial & Arus Kas Panen
          </h3>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-bold tabular-nums">
          {isProfitable ? (
            <span className="text-[#2E7D32] flex items-center gap-1 bg-[#E8F3E8] dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Surplus: {formatIDR(netProfit)}</span>
            </span>
          ) : (
            <span className="text-[#D9534F] flex items-center gap-1 bg-rose-50 dark:bg-rose-950/40 px-2.5 py-1 rounded-lg">
              <TrendingDown className="w-3.5 h-3.5" />
              <span>Defisit: {formatIDR(Math.abs(netProfit))}</span>
            </span>
          )}
        </div>
      </div>

      {/* Bar Chart Container */}
      <div className="h-60 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={{ stroke: '#CBD5E1' }}
              tick={{ fill: '#64748B', fontSize: 11, fontWeight: 500 }}
            />
            <YAxis
              tickLine={false}
              axisLine={{ stroke: '#CBD5E1' }}
              tick={{ fill: '#64748B', fontSize: 10 }}
              tickFormatter={(val) => `Rp ${(val / 1000000).toFixed(0)}Jt`}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={0} stroke="#94A3B8" />
            <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend & Impas Information */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-2 border-t border-slate-100 dark:border-slate-800 text-slate-500">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#D9534F]" />
            <span>Biaya Operasional</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#1E6B45]" />
            <span>Omzet Kotor</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#2E7D32]" />
            <span>Laba Bersih</span>
          </div>
        </div>

        <div>
          <span>Omzet Impas (BEP): <strong className="text-slate-800 dark:text-slate-200 tabular-nums">{formatIDR(bepRevenueRp)}</strong></span>
        </div>
      </div>
    </div>
  );
};
