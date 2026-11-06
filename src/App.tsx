import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { DashboardView } from './components/DashboardView';
import { CatalogView } from './components/CatalogView';
import { SimulatorView } from './components/SimulatorView';
import { MarketPriceView } from './components/MarketPriceView';
import { SOPView } from './components/SOPView';
import { PortfolioView } from './components/PortfolioView';
import { DiversificationView } from './components/DiversificationView';
import { FarmJourneyView } from './components/FarmJourneyView';
import { NavigationTab, Commodity, SavedScenario } from './types';
import { COMMODITIES } from './data/commodities';

const DEFAULT_INITIAL_SCENARIO: SavedScenario = {
  id: 'scen-init-1',
  title: 'Percontohan Cabai Rawit Merah (1.000 m²)',
  createdAt: '5 Nov 2026',
  commodityId: 'cabai-rawit-merah',
  commodityName: 'Cabai Rawit Merah (Ori 212 / Kaliber)',
  landArea: 1000,
  areaUnit: 'm2',
  totalCapex: 12500000,
  totalOpex: 9800000,
  grossRevenue: 45600000,
  netProfit: 33300000,
  roiPct: 149.3,
  bepKg: 258,
};

export default function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [selectedCommodityForSim, setSelectedCommodityForSim] = useState<Commodity | null>(COMMODITIES[0]);
  const [selectedCommodityForModal, setSelectedCommodityForModal] = useState<Commodity | null>(null);

  // Dark Mode State
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('agropreneur_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('agropreneur_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('agropreneur_theme', 'light');
    }
  }, [isDark]);

  const toggleDarkMode = () => setIsDark((prev) => !prev);

  // Saved Scenarios in LocalStorage
  const [savedScenarios, setSavedScenarios] = useState<SavedScenario[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('agropreneur_scenarios');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return [DEFAULT_INITIAL_SCENARIO];
        }
      }
    }
    return [DEFAULT_INITIAL_SCENARIO];
  });

  useEffect(() => {
    localStorage.setItem('agropreneur_scenarios', JSON.stringify(savedScenarios));
  }, [savedScenarios]);

  // Custom user-created manual commodities
  const [customCommodities, setCustomCommodities] = useState<Commodity[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('agropreneur_custom_commodities');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return [];
        }
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('agropreneur_custom_commodities', JSON.stringify(customCommodities));
  }, [customCommodities]);

  const handleAddCustomCommodity = (commodity: Commodity) => {
    setCustomCommodities((prev) => [commodity, ...prev]);
  };

  const handleDeleteCustomCommodity = (id: string) => {
    setCustomCommodities((prev) => prev.filter((c) => c.id !== id));
  };

  const handleSaveScenario = (scenario: SavedScenario) => {
    setSavedScenarios((prev) => [scenario, ...prev]);
  };

  const handleDeleteScenario = (id: string) => {
    setSavedScenarios((prev) => prev.filter((s) => s.id !== id));
  };

  const handleSelectCommodityForSimulation = (commodity: Commodity) => {
    setSelectedCommodityForSim(commodity);
    setActiveTab('simulator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoadScenarioToSimulator = (commodity: Commodity, scenario: SavedScenario) => {
    setSelectedCommodityForSim(commodity);
    setActiveTab('simulator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewSimulation = () => {
    setSelectedCommodityForSim(COMMODITIES[0]);
    setActiveTab('simulator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [selectedCropIdForSOP, setSelectedCropIdForSOP] = useState<string>('cabai-rawit-merah');

  const handleSelectCommodityForSOP = (commodity: Commodity) => {
    setSelectedCropIdForSOP(commodity.id);
    setActiveTab('sop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cross-module states
  const [diversificationInitial, setDiversificationInitial] = useState<{
    commodityName?: string;
    volumeKg?: number;
  } | null>(null);

  const [farmJourneyInitial, setFarmJourneyInitial] = useState<{
    commodityName: string;
    landAreaM2?: number;
    projectedBudget?: number;
    projectedYieldKg?: number;
  } | null>(null);

  const handleNavigateToDiversification = (commodityName: string, harvestYieldKg?: number) => {
    setDiversificationInitial({ commodityName, volumeKg: harvestYieldKg });
    setActiveTab('diversification');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToFarmJourney = (commodityName: string, projectedYieldKg?: number) => {
    setFarmJourneyInitial({ commodityName, projectedYieldKg });
    setActiveTab('farmJourney');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartFarmProjectFromScenario = (scenario: SavedScenario) => {
    setFarmJourneyInitial({
      commodityName: scenario.commodityName,
      landAreaM2: scenario.landArea,
      projectedBudget: scenario.totalCapex + scenario.totalOpex,
      projectedYieldKg: scenario.bepKg * 2,
    });
    setActiveTab('farmJourney');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Desktop & Tablet Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDark={isDark}
        toggleDarkMode={toggleDarkMode}
        savedCount={savedScenarios.length}
        onNewSimulation={handleNewSimulation}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24 md:pb-12">
        {activeTab === 'dashboard' && (
          <DashboardView
            setActiveTab={setActiveTab}
            onSelectCommodityForSimulation={handleSelectCommodityForSimulation}
            onSelectCommodityForSOP={handleSelectCommodityForSOP}
            onViewCommodityDetail={(crop) => {
              setSelectedCommodityForModal(crop);
              setActiveTab('catalog');
            }}
            customCommodities={customCommodities}
            onAddCustomCommodity={handleAddCustomCommodity}
            onDeleteCustomCommodity={handleDeleteCustomCommodity}
          />
        )}

        {activeTab === 'catalog' && (
          <CatalogView
            onSelectCommodityForSimulation={handleSelectCommodityForSimulation}
            onSelectCommodityForSOP={handleSelectCommodityForSOP}
            selectedCommodityForModal={selectedCommodityForModal}
            setSelectedCommodityForModal={setSelectedCommodityForModal}
            customCommodities={customCommodities}
            onAddCustomCommodity={handleAddCustomCommodity}
            onDeleteCustomCommodity={handleDeleteCustomCommodity}
          />
        )}

        {activeTab === 'simulator' && (
          <SimulatorView
            initialCommodity={selectedCommodityForSim}
            onSaveScenario={handleSaveScenario}
            savedScenarios={savedScenarios}
            customCommodities={customCommodities}
          />
        )}

        {activeTab === 'diversification' && (
          <DiversificationView
            customCommodities={customCommodities}
            onSelectCommodityForSimulation={handleSelectCommodityForSimulation}
            onNavigateToFarmJourney={handleNavigateToFarmJourney}
            initialCommodityName={diversificationInitial?.commodityName}
            initialVolumeKg={diversificationInitial?.volumeKg}
          />
        )}

        {activeTab === 'farmJourney' && (
          <FarmJourneyView
            customCommodities={customCommodities}
            onNavigateToDiversification={handleNavigateToDiversification}
            onNavigateToSOP={(cropId) => {
              if (cropId) setSelectedCropIdForSOP(cropId);
              setActiveTab('sop');
            }}
            initialNewProjectCommodity={farmJourneyInitial || undefined}
          />
        )}

        {activeTab === 'market' && <MarketPriceView />}

        {activeTab === 'sop' && (
          <SOPView
            customCommodities={customCommodities}
            initialCropId={selectedCropIdForSOP}
          />
        )}

        {activeTab === 'portfolio' && (
          <PortfolioView
            savedScenarios={savedScenarios}
            onDeleteScenario={handleDeleteScenario}
            onLoadScenarioToSimulator={handleLoadScenarioToSimulator}
            onNewSimulation={handleNewSimulation}
            onStartFarmProject={handleStartFarmProjectFromScenario}
          />
        )}
      </main>

      {/* Mobile Ergonomic Bottom Tab Bar */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        savedCount={savedScenarios.length}
      />

      {/* Minimalist Anti-Slop Footer */}
      <footer className="hidden md:block border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-slate-200">Agropreneur Indonesia</span>
            <span>·</span>
            <span>Kalkulator & Simulator Bisnis Pertanian Presisi</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Acuan Harga: PIHPS & Pasar Induk</span>
            <span>·</span>
            <span>Standar Input: Kementerian Pertanian RI</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
