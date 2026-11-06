import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sprout, Calendar, DollarSign, ClipboardList, CheckCircle2, 
  TrendingUp, TrendingDown, PlusCircle, Trash2, ArrowRight, 
  Sparkles, Check, X, AlertTriangle, Clock, MapPin, 
  PackageCheck, HelpCircle, FileText, ChevronRight, Droplets, 
  Bug, Eye, ShieldCheck, BarChart3, Edit3
} from 'lucide-react';
import { FarmProject, Commodity } from '../types';
import { DEFAULT_FARM_PROJECTS } from '../data/defaultFarmProjects';
import { COMMODITIES } from '../data/commodities';
import { formatIDR, formatPercent } from '../utils/calculator';

interface FarmJourneyViewProps {
  customCommodities?: Commodity[];
  onNavigateToDiversification?: (commodityName: string, harvestYieldKg?: number) => void;
  onNavigateToSOP?: (commodityId?: string) => void;
  initialNewProjectCommodity?: {
    commodityName: string;
    landAreaM2?: number;
    projectedBudget?: number;
    projectedYieldKg?: number;
  };
}

export const FarmJourneyView: React.FC<FarmJourneyViewProps> = ({
  customCommodities = [],
  onNavigateToDiversification,
  onNavigateToSOP,
  initialNewProjectCommodity,
}) => {
  // Farm Projects State stored in LocalStorage
  const [projects, setProjects] = useState<FarmProject[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('agropreneur_farm_projects');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return DEFAULT_FARM_PROJECTS;
        }
      }
    }
    return DEFAULT_FARM_PROJECTS;
  });

  useEffect(() => {
    localStorage.setItem('agropreneur_farm_projects', JSON.stringify(projects));
  }, [projects]);

  // Selected Project for active view
  const [selectedProjectId, setSelectedProjectId] = useState<string>(() => {
    return projects[0]?.id || '';
  });

  const activeProject = useMemo(() => {
    return projects.find((p) => p.id === selectedProjectId) || projects[0] || null;
  }, [projects, selectedProjectId]);

  // Active Sub-tab inside Project Details
  const [activeSubTab, setActiveSubTab] = useState<'costs' | 'logs' | 'harvest'>('costs');

  // Modals State
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState<boolean>(false);
  const [isAddCostModalOpen, setIsAddCostModalOpen] = useState<boolean>(false);
  const [isAddLogModalOpen, setIsAddLogModalOpen] = useState<boolean>(false);
  const [isHarvestModalOpen, setIsHarvestModalOpen] = useState<boolean>(false);

  // Auto open new project modal if triggered with initial params
  useEffect(() => {
    if (initialNewProjectCommodity) {
      setIsNewProjectModalOpen(true);
    }
  }, [initialNewProjectCommodity]);

  // Combined commodities for selection
  const allCommodities = useMemo(() => {
    return [...customCommodities, ...COMMODITIES];
  }, [customCommodities]);

  // New Project Form State
  const [projectForm, setProjectForm] = useState({
    name: initialNewProjectCommodity ? `Kebun ${initialNewProjectCommodity.commodityName} Baru` : '',
    commodityName: initialNewProjectCommodity?.commodityName || 'Cabai Rawit Merah',
    plantingDate: new Date().toISOString().split('T')[0],
    targetHarvestDate: new Date(Date.now() + 85 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    landAreaM2: initialNewProjectCommodity?.landAreaM2 || 1000,
    projectedBudget: initialNewProjectCommodity?.projectedBudget || 9800000,
    projectedYieldKg: initialNewProjectCommodity?.projectedYieldKg || 1200,
    status: 'Penanaman' as FarmProject['status'],
  });

  // When commodity in new project changes, update default budget & yield
  const handleCommoditySelectInForm = (comName: string) => {
    const match = allCommodities.find((c) => c.name === comName);
    if (match) {
      const area = projectForm.landAreaM2 || 1000;
      const ratio = area / 1000;
      const estBudget = Math.round((match.avgCapexPer1000m2 + match.avgOpexPerCycle) * ratio);
      const estYield = Math.round(match.defaultYieldKgPer1000m2 * ratio);
      const targetDate = new Date(Date.now() + match.cycleDays * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];

      setProjectForm((prev) => ({
        ...prev,
        commodityName: comName,
        projectedBudget: estBudget,
        projectedYieldKg: estYield,
        targetHarvestDate: targetDate,
      }));
    } else {
      setProjectForm((prev) => ({ ...prev, commodityName: comName }));
    }
  };

  // Add Cost Form State
  const [costForm, setCostForm] = useState({
    date: new Date().toISOString().split('T')[0],
    category: 'Pupuk & Nutrisi',
    amount: 250000,
    note: '',
  });

  // Add Log Form State
  const [logForm, setLogForm] = useState({
    date: new Date().toISOString().split('T')[0],
    activity: 'Monitoring' as 'Penyiraman' | 'Pemupukan' | 'Pengendalian Hama' | 'Monitoring',
    note: '',
  });

  // Harvest Evaluation Form State
  const [harvestForm, setHarvestForm] = useState({
    harvestDate: new Date().toISOString().split('T')[0],
    actualYieldKg: activeProject?.projectedYieldKg || 1000,
    sellingPricePerKg: 30000,
  });

  // Synchronize harvest form when activeProject changes
  useEffect(() => {
    if (activeProject) {
      if (activeProject.actualHarvest) {
        setHarvestForm({
          harvestDate: activeProject.actualHarvest.harvestDate,
          actualYieldKg: activeProject.actualHarvest.actualYieldKg,
          sellingPricePerKg: activeProject.actualHarvest.sellingPricePerKg,
        });
      } else {
        setHarvestForm({
          harvestDate: new Date().toISOString().split('T')[0],
          actualYieldKg: activeProject.projectedYieldKg,
          sellingPricePerKg: 30000,
        });
      }
    }
  }, [activeProject]);

  // Calculations for Active Project
  const projectStats = useMemo(() => {
    if (!activeProject) return null;

    const totalActualCosts = activeProject.costs.reduce((sum, c) => sum + c.amount, 0);
    const budgetRemaining = activeProject.projectedBudget - totalActualCosts;
    const budgetBurnPct =
      activeProject.projectedBudget > 0
        ? (totalActualCosts / activeProject.projectedBudget) * 100
        : 0;

    // Actual Harvest Metrics
    const actualHarvest = activeProject.actualHarvest;
    const isHarvested = Boolean(actualHarvest);
    const actualYield = actualHarvest?.actualYieldKg || 0;
    const actualRevenue = actualHarvest?.actualRevenue || 0;
    const actualNetProfit = actualRevenue - totalActualCosts;

    // Deviations
    const yieldDeviationPct =
      activeProject.projectedYieldKg > 0
        ? ((actualYield - activeProject.projectedYieldKg) / activeProject.projectedYieldKg) * 100
        : 0;

    const costDeviationPct =
      activeProject.projectedBudget > 0
        ? ((totalActualCosts - activeProject.projectedBudget) / activeProject.projectedBudget) * 100
        : 0;

    return {
      totalActualCosts,
      budgetRemaining,
      budgetBurnPct,
      isHarvested,
      actualYield,
      actualRevenue,
      actualNetProfit,
      yieldDeviationPct,
      costDeviationPct,
    };
  }, [activeProject]);

  // Handlers
  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.name.trim()) return;

    const newProj: FarmProject = {
      id: `farm-${Date.now()}`,
      name: projectForm.name.trim(),
      commodityName: projectForm.commodityName,
      plantingDate: projectForm.plantingDate,
      targetHarvestDate: projectForm.targetHarvestDate,
      landAreaM2: Number(projectForm.landAreaM2) || 1000,
      projectedBudget: Number(projectForm.projectedBudget) || 10000000,
      projectedYieldKg: Number(projectForm.projectedYieldKg) || 1000,
      status: projectForm.status,
      costs: [],
      logs: [
        {
          id: `log-init-${Date.now()}`,
          date: projectForm.plantingDate,
          activity: 'Monitoring',
          note: `Proyek kebun dimulai untuk komoditas ${projectForm.commodityName} seluas ${projectForm.landAreaM2} m².`,
        },
      ],
    };

    setProjects((prev) => [newProj, ...prev]);
    setSelectedProjectId(newProj.id);
    setIsNewProjectModalOpen(false);
  };

  const handleUpdateStatus = (newStatus: FarmProject['status']) => {
    if (!activeProject) return;
    setProjects((prev) =>
      prev.map((p) => (p.id === activeProject.id ? { ...p, status: newStatus } : p))
    );
  };

  const handleDeleteProject = (id: string) => {
    if (projects.length <= 1) return;
    const remaining = projects.filter((p) => p.id !== id);
    setProjects(remaining);
    if (selectedProjectId === id) {
      setSelectedProjectId(remaining[0].id);
    }
  };

  const handleAddCost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProject || costForm.amount <= 0) return;

    const newCost = {
      id: `cost-${Date.now()}`,
      date: costForm.date,
      category: costForm.category,
      amount: Number(costForm.amount),
      note: costForm.note.trim() || costForm.category,
    };

    setProjects((prev) =>
      prev.map((p) =>
        p.id === activeProject.id ? { ...p, costs: [newCost, ...p.costs] } : p
      )
    );
    setIsAddCostModalOpen(false);
    setCostForm({
      date: new Date().toISOString().split('T')[0],
      category: 'Pupuk & Nutrisi',
      amount: 250000,
      note: '',
    });
  };

  const handleDeleteCost = (costId: string) => {
    if (!activeProject) return;
    setProjects((prev) =>
      prev.map((p) =>
        p.id === activeProject.id
          ? { ...p, costs: p.costs.filter((c) => c.id !== costId) }
          : p
      )
    );
  };

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProject || !logForm.note.trim()) return;

    const newLog = {
      id: `log-${Date.now()}`,
      date: logForm.date,
      activity: logForm.activity,
      note: logForm.note.trim(),
    };

    setProjects((prev) =>
      prev.map((p) =>
        p.id === activeProject.id ? { ...p, logs: [newLog, ...p.logs] } : p
      )
    );
    setIsAddLogModalOpen(false);
    setLogForm({
      date: new Date().toISOString().split('T')[0],
      activity: 'Monitoring',
      note: '',
    });
  };

  const handleDeleteLog = (logId: string) => {
    if (!activeProject) return;
    setProjects((prev) =>
      prev.map((p) =>
        p.id === activeProject.id
          ? { ...p, logs: p.logs.filter((l) => l.id !== logId) }
          : p
      )
    );
  };

  const handleSaveHarvest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProject) return;

    const yieldKg = Number(harvestForm.actualYieldKg) || 0;
    const pricePerKg = Number(harvestForm.sellingPricePerKg) || 0;
    const revenue = yieldKg * pricePerKg;

    const actualHarvestData = {
      harvestDate: harvestForm.harvestDate,
      actualYieldKg: yieldKg,
      sellingPricePerKg: pricePerKg,
      actualRevenue: revenue,
    };

    setProjects((prev) =>
      prev.map((p) =>
        p.id === activeProject.id
          ? { ...p, status: 'Selesai', actualHarvest: actualHarvestData }
          : p
      )
    );
    setIsHarvestModalOpen(false);
  };

  if (!activeProject) {
    return (
      <div className="text-center py-20 space-y-4">
        <Sprout className="w-12 h-12 text-slate-400 mx-auto" />
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">
          Belum Ada Proyek Kebun
        </h2>
        <button
          onClick={() => setIsNewProjectModalOpen(true)}
          className="px-5 py-2.5 bg-emerald-600 text-white font-semibold text-xs rounded-xl"
        >
          Buat Proyek Kebun Pertama
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header & Project Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sprout className="w-3.5 h-3.5" />
              <span>My Farm Journey</span>
            </span>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
              Operasional & Evaluasi Realisasi
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Manajemen Operasional Kebun Tani
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Pantau realisasi pengeluaran riil, catat aktivitas harian, dan evaluasi capaian panen vs target simulator.
          </p>
        </div>

        <button
          onClick={() => setIsNewProjectModalOpen(true)}
          className="px-4 py-2.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm flex items-center gap-2 transition-all self-start md:self-auto shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Buat Proyek Kebun Baru</span>
        </button>
      </div>

      {/* Projects Horizontal Selector Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {projects.map((proj) => {
          const isSelected = proj.id === activeProject.id;
          return (
            <button
              key={proj.id}
              onClick={() => setSelectedProjectId(proj.id)}
              className={`px-4 py-2.5 rounded-xl text-left border transition-all whitespace-nowrap shrink-0 flex items-center gap-3 ${
                isSelected
                  ? 'bg-white dark:bg-slate-900 border-emerald-500 shadow-sm ring-1 ring-emerald-500/20'
                  : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div>
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${
                    proj.status === 'Selesai'
                      ? 'bg-purple-500'
                      : proj.status === 'Siap Panen'
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`} />
                  <span className={`text-xs font-bold ${isSelected ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                    {proj.name}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  {proj.commodityName} · {proj.landAreaM2} m² · {proj.status}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* ACTIVE PROJECT OVERVIEW CARD */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                {activeProject.commodityName}
              </span>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>{activeProject.landAreaM2} m²</span>
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              {activeProject.name}
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
              <span>Tanam: <strong>{activeProject.plantingDate}</strong></span>
              <span>·</span>
              <span>Target Panen: <strong>{activeProject.targetHarvestDate}</strong></span>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            {/* Stage Selector */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs">
              <span className="text-[11px] text-slate-500 px-2 font-medium">Status:</span>
              {(['Persiapan', 'Penanaman', 'Pemeliharaan', 'Siap Panen', 'Selesai'] as FarmProject['status'][]).map((st) => (
                <button
                  key={st}
                  onClick={() => handleUpdateStatus(st)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    activeProject.status === st
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {projects.length > 1 && (
              <button
                onClick={() => handleDeleteProject(activeProject.id)}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-xl transition-colors"
                title="Hapus proyek kebun ini"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Financial & Yield Burn Rate Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">
              Biaya Aktual Terpakai
            </span>
            <span className="text-xl font-extrabold text-slate-900 dark:text-white tabular-nums">
              {formatIDR(projectStats?.totalActualCosts || 0)}
            </span>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  (projectStats?.budgetBurnPct || 0) > 100 ? 'bg-rose-500' : 'bg-emerald-600'
                }`}
                style={{ width: `${Math.min(100, projectStats?.budgetBurnPct || 0)}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-400 block mt-1">
              {(projectStats?.budgetBurnPct || 0).toFixed(1)}% dari anggaran {formatIDR(activeProject.projectedBudget)}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">
              Sisa Anggaran Tersedia
            </span>
            <span className={`text-xl font-extrabold tabular-nums ${
              (projectStats?.budgetRemaining || 0) >= 0
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-rose-600 dark:text-rose-400'
            }`}>
              {formatIDR(projectStats?.budgetRemaining || 0)}
            </span>
            <span className="text-[10px] text-slate-400 block mt-2">
              {(projectStats?.budgetRemaining || 0) >= 0 ? 'Kondisi Aman Terkendali' : 'Peringatan: Over Budget'}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">
              Target Panen Rencana
            </span>
            <span className="text-xl font-extrabold text-slate-900 dark:text-white tabular-nums">
              {activeProject.projectedYieldKg.toLocaleString('id-ID')} Kg
            </span>
            <span className="text-[10px] text-slate-400 block mt-2">
              Rata-rata: {(activeProject.projectedYieldKg / (activeProject.landAreaM2 / 1000)).toFixed(0)} kg / 1.000m²
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">
              Status Panen & Evaluasi
            </span>
            {projectStats?.isHarvested ? (
              <div>
                <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">
                  {projectStats.actualYield.toLocaleString('id-ID')} Kg
                </span>
                <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-semibold block mt-1">
                  Realisasi Laba: {formatIDR(projectStats.actualNetProfit)}
                </span>
              </div>
            ) : (
              <div>
                <span className="text-sm font-bold text-amber-600 dark:text-amber-400">
                  Dalam Pemeliharaan
                </span>
                <button
                  onClick={() => setIsHarvestModalOpen(true)}
                  className="mt-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline block"
                >
                  + Catat Hasil Panen Riil
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SUB-TABS NAVIGATION: BIAYA RIIL, JURNAL AKTIVITAS, EVALUASI PANEN */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6 text-sm font-semibold">
        <button
          onClick={() => setActiveSubTab('costs')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
            activeSubTab === 'costs'
              ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Biaya Operasional Riil ({activeProject.costs.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('logs')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
            activeSubTab === 'logs'
              ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          <span>Jurnal Aktivitas Lapangan ({activeProject.logs.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('harvest')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
            activeSubTab === 'harvest'
              ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Evaluasi Realisasi vs Simulasi</span>
          {projectStats?.isHarvested && (
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          )}
        </button>
      </div>

      {/* TAB CONTENT A: BIAYA OPERASIONAL RIIL */}
      {activeSubTab === 'costs' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Catatan setiap transaksi pembelian saprodi, upah harian, atau sewa alat untuk memantau burn rate anggaran.
            </p>
            <button
              onClick={() => setIsAddCostModalOpen(true)}
              className="px-3.5 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>+ Catat Pengeluaran Baru</span>
            </button>
          </div>

          {activeProject.costs.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400 space-y-2">
              <DollarSign className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-xs">Belum ada pengeluaran yang dicatat untuk kebun ini.</p>
              <button
                onClick={() => setIsAddCostModalOpen(true)}
                className="text-xs font-semibold text-emerald-600 hover:underline"
              >
                Catat pengeluaran pertama
              </button>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-4 py-3">Tanggal</th>
                      <th className="px-4 py-3">Kategori</th>
                      <th className="px-4 py-3">Keterangan Pengeluaran</th>
                      <th className="px-4 py-3 text-right">Nominal (Rp)</th>
                      <th className="px-4 py-3 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {activeProject.costs.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                        <td className="px-4 py-3 text-slate-500 tabular-nums whitespace-nowrap">
                          {c.date}
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            {c.category}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-800 dark:text-slate-200 font-medium max-w-xs sm:max-w-md">
                          {c.note}
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-slate-900 dark:text-white tabular-nums">
                          {formatIDR(c.amount)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => handleDeleteCost(c.id)}
                            className="p-1 text-slate-400 hover:text-rose-500 rounded"
                            title="Hapus baris pengeluaran"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-50 dark:bg-slate-800/40 font-bold border-t border-slate-200 dark:border-slate-800">
                    <tr>
                      <td colSpan={3} className="px-4 py-3 text-slate-700 dark:text-slate-300">
                        Total Biaya Aktual
                      </td>
                      <td className="px-4 py-3 text-right text-emerald-600 dark:text-emerald-400 tabular-nums text-sm">
                        {formatIDR(projectStats?.totalActualCosts || 0)}
                      </td>
                      <td />
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT B: JURNAL AKTIVITAS LAPANGAN */}
      {activeSubTab === 'logs' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Buku harian lapangan mencatat jadwal pemupukan, penyiraman, pengendalian hama, dan perkembangan tanaman.
            </p>
            <div className="flex items-center gap-2">
              {onNavigateToSOP && (
                <button
                  onClick={() => onNavigateToSOP()}
                  className="px-3 py-2 text-xs font-semibold border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Lihat Standar SOP Tani</span>
                </button>
              )}
              <button
                onClick={() => setIsAddLogModalOpen(true)}
                className="px-3.5 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>+ Catat Aktivitas</span>
              </button>
            </div>
          </div>

          {activeProject.logs.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400 space-y-2">
              <ClipboardList className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-xs">Belum ada aktivitas yang dicatat di jurnal lapangan.</p>
              <button
                onClick={() => setIsAddLogModalOpen(true)}
                className="text-xs font-semibold text-emerald-600 hover:underline"
              >
                Catat aktivitas pertama
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {activeProject.logs.map((log) => {
                const badgeStyle =
                  log.activity === 'Penyiraman'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                    : log.activity === 'Pemupukan'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : log.activity === 'Pengendalian Hama'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    : 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300';

                const ActivityIcon =
                  log.activity === 'Penyiraman'
                    ? Droplets
                    : log.activity === 'Pemupukan'
                    ? Sprout
                    : log.activity === 'Pengendalian Hama'
                    ? Bug
                    : Eye;

                return (
                  <div
                    key={log.id}
                    className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4 shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0 mt-0.5">
                        <ActivityIcon className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${badgeStyle}`}>
                            {log.activity}
                          </span>
                          <span className="text-[11px] text-slate-400 tabular-nums">
                            {log.date}
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                          {log.note}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteLog(log.id)}
                      className="p-1 text-slate-400 hover:text-rose-500 rounded shrink-0"
                      title="Hapus log ini"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT C: EVALUASI REALISASI VS SIMULASI */}
      {activeSubTab === 'harvest' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Analisis Kinerja Realisasi vs Rencana Simulasi Awal
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Bandingkan hasil panen aktual dan pengeluaran riil dengan proyeksi anggaran untuk evaluasi efisiensi musim berikutnya.
              </p>
            </div>

            <button
              onClick={() => setIsHarvestModalOpen(true)}
              className="px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm flex items-center gap-1.5 self-start sm:self-auto shrink-0"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{projectStats?.isHarvested ? 'Update Data Panen' : '+ Catat Hasil Panen Riil'}</span>
            </button>
          </div>

          {projectStats?.isHarvested ? (
            <div className="space-y-6">
              
              {/* Comparison Cards: Plan vs Actual */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* 1. Tonase Panen */}
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">
                    Tonase Panen (Yield Netto)
                  </span>
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-xs text-slate-400 block">Target:</span>
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-300 tabular-nums">
                        {activeProject.projectedYieldKg.toLocaleString('id-ID')} Kg
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold block">Realisasi:</span>
                      <span className="text-xl font-black text-slate-900 dark:text-white tabular-nums">
                        {projectStats.actualYield.toLocaleString('id-ID')} Kg
                      </span>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Deviasi Hasil:</span>
                    <span className={`font-bold tabular-nums flex items-center gap-1 ${
                      projectStats.yieldDeviationPct >= 0 ? 'text-emerald-600' : 'text-rose-600'
                    }`}>
                      {projectStats.yieldDeviationPct >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                      <span>{projectStats.yieldDeviationPct >= 0 ? '+' : ''}{formatPercent(projectStats.yieldDeviationPct)}</span>
                    </span>
                  </div>
                </div>

                {/* 2. Biaya Operasional */}
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">
                    Biaya Operasional (Opex)
                  </span>
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-xs text-slate-400 block">Anggaran:</span>
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-300 tabular-nums">
                        {formatIDR(activeProject.projectedBudget)}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold block">Realisasi:</span>
                      <span className="text-xl font-black text-slate-900 dark:text-white tabular-nums">
                        {formatIDR(projectStats.totalActualCosts)}
                      </span>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Penghematan Biaya:</span>
                    <span className={`font-bold tabular-nums ${
                      projectStats.costDeviationPct <= 0 ? 'text-emerald-600' : 'text-rose-600'
                    }`}>
                      {projectStats.costDeviationPct <= 0
                        ? `Hemat ${formatIDR(Math.abs(projectStats.budgetRemaining))}`
                        : `Overbudget +${formatIDR(Math.abs(projectStats.budgetRemaining))}`}
                    </span>
                  </div>
                </div>

                {/* 3. Laba Bersih Aktual */}
                <div className="p-5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-500/60 shadow-sm space-y-3">
                  <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 block">
                    Laba Bersih Riil Panen
                  </span>
                  <div>
                    <span className="text-2xl font-black text-emerald-700 dark:text-emerald-300 tabular-nums block">
                      {formatIDR(projectStats.actualNetProfit)}
                    </span>
                    <span className="text-[11px] text-emerald-800/80 dark:text-emerald-200 mt-0.5 block">
                      Omzet: {formatIDR(projectStats.actualRevenue)} (@ {formatIDR(activeProject.actualHarvest?.sellingPricePerKg || 0)}/kg)
                    </span>
                  </div>
                  <div className="pt-2 border-t border-emerald-200/60 dark:border-emerald-800/40 text-xs text-emerald-900 dark:text-emerald-100 flex justify-between">
                    <span>HPP Riil:</span>
                    <strong className="tabular-nums">
                      {formatIDR(Math.round(projectStats.totalActualCosts / Math.max(1, projectStats.actualYield)))}/kg
                    </strong>
                  </div>
                </div>

              </div>

              {/* CRITICAL INTERCONNECTION BANNER: FARM TO PRODUCT DIVERSIFICATION */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-slate-950 shadow-md">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" />
                      <span>Rekomendasi Diversifikasi Nilai Tambah</span>
                    </span>
                    <h4 className="text-lg font-black text-slate-950">
                      Olah Hasil Panen {activeProject.commodityName} Menjadi Produk Bernilai Tinggi
                    </h4>
                    <p className="text-xs text-amber-950/90 max-w-2xl leading-relaxed">
                      Anda memiliki <strong>{projectStats.actualYield} Kg</strong> hasil panen dari kebun ini. Daripada seluruhnya dijual segar ke pasar induk dengan risiko fluktuasi harga, simulasikan pengolahan sebagian hasil panen menjadi produk olahan premium.
                    </p>
                  </div>

                  {onNavigateToDiversification && (
                    <button
                      onClick={() =>
                        onNavigateToDiversification(
                          activeProject.commodityName,
                          projectStats.actualYield
                        )
                      }
                      className="px-5 py-3 bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 shrink-0 transition-transform active:scale-95"
                    >
                      <span>Simulasi Olah Hasil Panen</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

            </div>
          ) : (
            <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 space-y-3">
              <Sprout className="w-10 h-10 mx-auto text-amber-500" />
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Panen Belum Dicatatkan
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                Proyek ini masih berstatus <strong>{activeProject.status}</strong>. Ketika masa panen tiba, klik tombol di bawah untuk mencatat tonase riil dan mengevaluasi efisiensi usaha.
              </p>
              <button
                onClick={() => setIsHarvestModalOpen(true)}
                className="px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm"
              >
                + Catat Hasil Panen Sekarang
              </button>
            </div>
          )}
        </div>
      )}

      {/* MODAL 1: BUAT PROYEK KEBUN BARU */}
      {isNewProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  Manajemen Lahan
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                  Buat Proyek Kebun Aktif Baru
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Mulai pencatatan siklus tanam baru untuk melacak pengeluaran dan jurnal aktivitas.
                </p>
              </div>
              <button
                onClick={() => setIsNewProjectModalOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Nama Proyek Kebun *
                </label>
                <input
                  type="text"
                  required
                  value={projectForm.name}
                  onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                  placeholder="Contoh: Kebun Cabai Blok A - Musim Hujan"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Pilihan Komoditas *
                  </label>
                  <select
                    value={projectForm.commodityName}
                    onChange={(e) => handleCommoditySelectInForm(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  >
                    {allCommodities.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Luas Lahan (m²) *
                  </label>
                  <input
                    type="number"
                    min="10"
                    required
                    value={projectForm.landAreaM2}
                    onChange={(e) => setProjectForm({ ...projectForm, landAreaM2: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white tabular-nums font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Tanggal Tanam
                  </label>
                  <input
                    type="date"
                    required
                    value={projectForm.plantingDate}
                    onChange={(e) => setProjectForm({ ...projectForm, plantingDate: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white tabular-nums"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Target Tanggal Panen
                  </label>
                  <input
                    type="date"
                    required
                    value={projectForm.targetHarvestDate}
                    onChange={(e) => setProjectForm({ ...projectForm, targetHarvestDate: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white tabular-nums"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Anggaran Rencana (Rp)
                  </label>
                  <input
                    type="number"
                    step="500000"
                    value={projectForm.projectedBudget}
                    onChange={(e) => setProjectForm({ ...projectForm, projectedBudget: Number(e.target.value) })}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 tabular-nums font-semibold"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Target Panen (Kg)
                  </label>
                  <input
                    type="number"
                    step="50"
                    value={projectForm.projectedYieldKg}
                    onChange={(e) => setProjectForm({ ...projectForm, projectedYieldKg: Number(e.target.value) })}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 tabular-nums font-semibold"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewProjectModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Mulai Proyek Kebun</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CATAT PENGELUARAN BARU */}
      {isAddCostModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Catat Pengeluaran Baru
                </h3>
                <p className="text-xs text-slate-500">{activeProject.name}</p>
              </div>
              <button
                onClick={() => setIsAddCostModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCost} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Tanggal Transaksi</label>
                <input
                  type="date"
                  required
                  value={costForm.date}
                  onChange={(e) => setCostForm({ ...costForm, date: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-3 py-2 text-slate-900 dark:text-white tabular-nums"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Kategori Biaya</label>
                <select
                  value={costForm.category}
                  onChange={(e) => setCostForm({ ...costForm, category: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                >
                  <option value="Benih & Persemaian">Benih & Persemaian</option>
                  <option value="Pupuk & Nutrisi">Pupuk Dasar & Nutrisi Kocor</option>
                  <option value="Pengendalian Hama & Pestisida">Pengendalian Hama & Pestisida</option>
                  <option value="Tenaga Kerja">Upah Tenaga Kerja Lapangan</option>
                  <option value="Irigasi, Listrik & BBM">Irigasi, Listrik & BBM Pompa</option>
                  <option value="Alat & Bahan Olah Lahan">Alat, Bambu & Mulsa</option>
                  <option value="Kemasan & Distribusi">Kemasan, Peti & Transportasi</option>
                  <option value="Lainnya">Pengeluaran Lainnya</option>
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">Nominal Biaya (Rp) *</label>
                <input
                  type="number"
                  step="10000"
                  min="1000"
                  required
                  value={costForm.amount}
                  onChange={(e) => setCostForm({ ...costForm, amount: Number(e.target.value) })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-3 py-2 text-slate-900 dark:text-white tabular-nums font-bold"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Catatan Keterangan</label>
                <input
                  type="text"
                  value={costForm.note}
                  onChange={(e) => setCostForm({ ...costForm, note: e.target.value })}
                  placeholder="Misal: Beli NPK Mutiara 1 karung 50kg"
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddCostModalOpen(false)}
                  className="px-3 py-2 rounded-xl border text-slate-600"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white font-semibold rounded-xl"
                >
                  Simpan Biaya
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: CATAT LOG AKTIVITAS BARU */}
      {isAddLogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Jurnal Aktivitas Lapangan
                </h3>
                <p className="text-xs text-slate-500">{activeProject.name}</p>
              </div>
              <button
                onClick={() => setIsAddLogModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddLog} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Tanggal</label>
                <input
                  type="date"
                  required
                  value={logForm.date}
                  onChange={(e) => setLogForm({ ...logForm, date: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-3 py-2 text-slate-900 dark:text-white tabular-nums"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Jenis Aktivitas</label>
                <select
                  value={logForm.activity}
                  onChange={(e) => setLogForm({ ...logForm, activity: e.target.value as any })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                >
                  <option value="Penyiraman">Penyiraman</option>
                  <option value="Pemupukan">Pemupukan (Kocor / Tabur / Daun)</option>
                  <option value="Pengendalian Hama">Pengendalian Hama & Penyakit</option>
                  <option value="Monitoring">Monitoring & Evaluasi Tanaman</option>
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">Catatan Teknis Lapangan *</label>
                <textarea
                  rows={3}
                  required
                  value={logForm.note}
                  onChange={(e) => setLogForm({ ...logForm, note: e.target.value })}
                  placeholder="Misal: Kocor NPK 16-16-16 dosis 5 gram/pokok. Kondisi daun hijau segar, tunas aktif tumbuh."
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddLogModalOpen(false)}
                  className="px-3 py-2 rounded-xl border text-slate-600"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white font-semibold rounded-xl"
                >
                  Simpan Jurnal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: CATAT PANEN AKTUAL & EVALUASI */}
      {isHarvestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-emerald-600">Siklus Selesai</span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Pencatatan Hasil Panen Riil
                </h3>
                <p className="text-xs text-slate-500">{activeProject.name}</p>
              </div>
              <button
                onClick={() => setIsHarvestModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveHarvest} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Tanggal Panen Selesai</label>
                <input
                  type="date"
                  required
                  value={harvestForm.harvestDate}
                  onChange={(e) => setHarvestForm({ ...harvestForm, harvestDate: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-3 py-2 text-slate-900 dark:text-white tabular-nums"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">
                  Total Tonase Panen Riil (Kg) *
                </label>
                <input
                  type="number"
                  step="10"
                  min="1"
                  required
                  value={harvestForm.actualYieldKg}
                  onChange={(e) => setHarvestForm({ ...harvestForm, actualYieldKg: Number(e.target.value) })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-3 py-2 text-slate-900 dark:text-white tabular-nums font-bold text-sm"
                />
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Target awal rencana simulator: {activeProject.projectedYieldKg.toLocaleString('id-ID')} Kg
                </span>
              </div>

              <div>
                <label className="font-semibold block mb-1">
                  Rata-rata Harga Jual Panen Riil (Rp/Kg) *
                </label>
                <input
                  type="number"
                  step="500"
                  min="1000"
                  required
                  value={harvestForm.sellingPricePerKg}
                  onChange={(e) => setHarvestForm({ ...harvestForm, sellingPricePerKg: Number(e.target.value) })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-3 py-2 text-slate-900 dark:text-white tabular-nums font-bold text-sm"
                />
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-1">
                <span className="text-[11px] text-emerald-800 dark:text-emerald-300 font-semibold block">
                  Estimasi Omzet Hasil Panen:
                </span>
                <span className="text-lg font-black text-emerald-700 dark:text-emerald-300 tabular-nums">
                  {formatIDR((harvestForm.actualYieldKg || 0) * (harvestForm.sellingPricePerKg || 0))}
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsHarvestModalOpen(false)}
                  className="px-3 py-2 rounded-xl border text-slate-600"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white font-semibold rounded-xl"
                >
                  Simpan & Selesaikan Siklus
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
