import { FinancialCalculationResult, SimulationParameters } from '../types';

export function calculateFinancials(params: SimulationParameters): FinancialCalculationResult {
  const totalCapex = params.capexItems.reduce((acc, item) => acc + (item.qty * item.unitPrice), 0);
  const totalOpex = params.opexItems.reduce((acc, item) => acc + (item.qty * item.unitPrice), 0);
  const totalInvestment = totalCapex + totalOpex;

  // Apply sensitivity sliders
  const effectiveYieldKg = Math.max(0, params.estimatedYieldKg * (1 + (params.yieldVariationPct || 0) / 100));
  const effectivePricePerKg = Math.max(0, params.sellingPricePerKg * (1 + (params.priceVariationPct || 0) / 100));

  const grossRevenue = effectiveYieldKg * effectivePricePerKg;

  // In agricultural financial modeling:
  // Capex is depreciated over useful asset life (standard agrobusiness amortizes Capex over 5 seasons = 20% per season)
  const capexAmortizationPerSeason = totalCapex > 0 ? totalCapex * 0.20 : 0;
  const netProfit = grossRevenue - totalOpex - capexAmortizationPerSeason;

  // Approximated cycle duration: 90 days / 3 months if not specified
  const monthlyProfit = netProfit / 3;

  // HPP (Harga Pokok Produksi) per kg
  const hppPerKg = effectiveYieldKg > 0 ? (totalOpex + capexAmortizationPerSeason) / effectiveYieldKg : 0;

  // BEP (Break Even Point)
  // BEP Unit (Kg): minimum volume required to cover operating and amortization costs
  const bepKg = effectivePricePerKg > 0 ? (totalOpex + capexAmortizationPerSeason) / effectivePricePerKg : 0;
  // BEP Rupiah per Kg: minimum price per kg required to cover operating and amortization costs
  const bepRpPerKg = effectiveYieldKg > 0 ? (totalOpex + capexAmortizationPerSeason) / effectiveYieldKg : 0;

  // ROI %: Net Profit / Total Initial Investment
  const roiPct = totalInvestment > 0 ? (netProfit / totalInvestment) * 100 : 0;

  // B/C Ratio: Gross Revenue / Total Production Cost
  const totalProductionCost = totalOpex + capexAmortizationPerSeason;
  const bcRatio = totalProductionCost > 0 ? grossRevenue / totalProductionCost : 0;

  // Payback period (in cycles/harvest seasons)
  const cashFlowPerCycle = grossRevenue - totalOpex;
  const paybackPeriodCycles = cashFlowPerCycle > 0 ? Math.ceil(totalCapex / cashFlowPerCycle * 10) / 10 : 99;

  let financialFeasibilityStatus: FinancialCalculationResult['financialFeasibilityStatus'] = 'Layak';
  if (netProfit < 0 || bcRatio < 1.0) {
    financialFeasibilityStatus = 'Risiko Tinggi';
  } else if (bcRatio >= 1.5 && roiPct >= 35) {
    financialFeasibilityStatus = 'Sangat Layak';
  } else if (bcRatio >= 1.15 && roiPct >= 15) {
    financialFeasibilityStatus = 'Layak';
  } else {
    financialFeasibilityStatus = 'Perlu Efisiensi';
  }

  return {
    totalCapex,
    totalOpex,
    totalInvestment,
    effectiveYieldKg: Math.round(effectiveYieldKg),
    effectivePricePerKg: Math.round(effectivePricePerKg),
    grossRevenue: Math.round(grossRevenue),
    netProfit: Math.round(netProfit),
    monthlyProfit: Math.round(monthlyProfit),
    hppPerKg: Math.round(hppPerKg),
    bepKg: Math.round(bepKg),
    bepRpPerKg: Math.round(bepRpPerKg),
    roiPct: Number(roiPct.toFixed(1)),
    bcRatio: Number(bcRatio.toFixed(2)),
    paybackPeriodCycles,
    financialFeasibilityStatus
  };
}

export function formatIDR(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatNumber(val: number): string {
  return new Intl.NumberFormat('id-ID', {
    maximumFractionDigits: 1
  }).format(val);
}

export function formatPercent(val: number): string {
  return `${val > 0 ? '+' : ''}${val.toFixed(1)}%`;
}
