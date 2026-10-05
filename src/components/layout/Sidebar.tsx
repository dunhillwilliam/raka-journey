import React from 'react';
import {
  Home,
  BookOpen,
  TrendingUp,
  HelpCircle,
  Users,
  Calendar,
  Image as ImageIcon,
  Settings,
  Layers,
  X,
  GraduationCap
} from 'lucide-react';
import { useApp, NavTab } from '../../context/AppContext';

interface NavItem {
  id: NavTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'beranda', label: 'Beranda', icon: Home },
  { id: 'daily-report', label: 'Daily Report', icon: BookOpen },
  { id: 'progress', label: 'Progress', icon: TrendingUp },
  { id: 'curiosity', label: 'Curiosity', icon: HelpCircle },
  { id: 'parent-corner', label: 'Parent Corner', icon: Users },
  { id: 'monthly-report', label: 'Monthly Report', icon: Calendar },
  { id: 'galeri-karya', label: 'Galeri Karya', icon: ImageIcon },
  { id: 'pengaturan', label: 'Pengaturan', icon: Settings }
];

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
  } = useApp();

  const handleNavClick = (id: NavTab) => {
    setActiveTab(id);
    setIsMobileMenuOpen(false);
  };

  const navContent = (
    <div className="flex flex-col min-h-full justify-between">
      <div>
        <div className="p-4 sm:p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-500 flex items-center justify-center text-white shadow-sm shadow-indigo-100 shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-slate-900 leading-tight">Raka</h1>
              <p className="text-[11px] font-medium text-slate-400">Learning Journey</p>
            </div>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            aria-label="Tutup Menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all min-h-[44px] group ${isActive
                    ? 'bg-indigo-50 text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'
                      }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${isActive ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

    </div>
  );

  return (
    <>
      <aside className="hidden md:flex w-64 bg-white border-r border-slate-200/80 flex-col shrink-0 min-h-screen select-none sticky top-0 h-screen overflow-y-auto">
        {navContent}
      </aside>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex animate-in fade-in duration-200">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <div className="relative w-72 max-w-[85vw] bg-white h-full max-h-screen shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200 overflow-y-auto overscroll-contain touch-pan-y pb-safe">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
};
