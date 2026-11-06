import React, { useState } from 'react';
import { 
  Home, Calculator, Sparkles, ClipboardList, Menu, 
  Sprout, BarChart3, BookOpen, Layers, X 
} from 'lucide-react';
import { NavigationTab } from '../types';

interface MobileBottomNavProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  savedCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  savedCount,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const primaryTabs = [
    { id: 'dashboard' as NavigationTab, label: 'Beranda', icon: Home },
    { id: 'simulator' as NavigationTab, label: 'Simulator', icon: Calculator },
    { id: 'diversification' as NavigationTab, label: 'Olah Produk', icon: Sparkles },
    { id: 'farmJourney' as NavigationTab, label: 'Kebun', icon: ClipboardList },
  ];

  const moreTabs = [
    { id: 'catalog' as NavigationTab, label: 'Katalog Komoditas', desc: 'Database 25+ tanaman & input manual', icon: Sprout },
    { id: 'market' as NavigationTab, label: 'Pantauan Harga Pasar', desc: 'Harga komoditas & rantai pasok PIHPS', icon: BarChart3 },
    { id: 'sop' as NavigationTab, label: 'Panduan SOP Tani', desc: 'Kalender tanam & checklist agronomi', icon: BookOpen },
    { id: 'portfolio' as NavigationTab, label: 'Portofolio Skenario', desc: 'Simulasi tersimpan & analisis risiko', icon: Layers, badge: savedCount },
  ];

  const isMoreActive = ['catalog', 'market', 'sop', 'portfolio'].includes(activeTab);

  return (
    <>
      {/* Bottom Sheet Menu Modal */}
      {isMenuOpen && (
        <div 
          onClick={() => setIsMenuOpen(false)}
          className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-150"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-slate-900 rounded-t-3xl border-t border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-2xl animate-in slide-in-from-bottom duration-200"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                Menu Agropreneur Lainnya
              </span>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {moreTabs.map((item) => {
                const Icon = item.icon;
                const isSelected = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMenuOpen(false);
                    }}
                    className={`p-3 rounded-2xl flex items-center justify-between text-left transition-all ${
                      isSelected
                        ? 'bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-500/60 text-emerald-800 dark:text-emerald-200'
                        : 'bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${
                        isSelected
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold block text-slate-900 dark:text-white">
                          {item.label}
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                          {item.desc}
                        </span>
                      </div>
                    </div>

                    {item.badge && item.badge > 0 ? (
                      <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-emerald-600 text-white">
                        {item.badge}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Main Ergonomic 5-item Bottom Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 transition-colors shadow-lg">
        <div className="grid grid-cols-5 items-center h-16 max-w-lg mx-auto px-1">
          {primaryTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsMenuOpen(false);
                }}
                className={`flex flex-col items-center justify-center min-h-[48px] py-1 transition-all relative ${
                  isActive
                    ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                <span className={`text-[10px] tracking-tight mt-1 truncate max-w-[58px] ${isActive ? 'font-bold' : 'font-medium'}`}>
                  {tab.label}
                </span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 mt-0.5" />
                )}
              </button>
            );
          })}

          {/* More Menu Button */}
          <button
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className={`flex flex-col items-center justify-center min-h-[48px] py-1 transition-all relative ${
              isMoreActive || isMenuOpen
                ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <div className="relative">
              <Menu className={`w-5 h-5 transition-transform ${isMoreActive || isMenuOpen ? 'scale-110' : ''}`} />
              {savedCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-emerald-600 text-white text-[8px] font-bold px-1 rounded-full min-w-[12px] text-center">
                  {savedCount}
                </span>
              )}
            </div>
            <span className={`text-[10px] tracking-tight mt-1 truncate ${isMoreActive || isMenuOpen ? 'font-bold' : 'font-medium'}`}>
              Lainnya
            </span>
            {isMoreActive && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 mt-0.5" />
            )}
          </button>
        </div>
      </div>
    </>
  );
};
