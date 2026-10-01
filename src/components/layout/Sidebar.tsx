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
  GraduationCap,
  HeartHandshake,
  Sparkles
} from 'lucide-react';
import { useApp, NavTab, ROLE_TAB_ACCESS } from '../../context/AppContext';

interface NavItem {
  id: NavTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'beranda', label: 'Beranda', icon: Home },
  { id: 'daily-report', label: 'Daily Report', icon: BookOpen, badge: 'Sesi 4' },
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
    userRole,
    setUserRole,
    userProfile
  } = useApp();

  const handleNavClick = (id: NavTab) => {
    setActiveTab(id);
    setIsMobileMenuOpen(false);
  };

  const navContent = (
    <div className="flex flex-col min-h-full justify-between">
      <div>
        {/* Brand Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-500 flex items-center justify-center text-white shadow-sm shadow-indigo-100 shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-slate-900 leading-tight">Raka</h1>
              <p className="text-[11px] font-medium text-slate-400">Learning Journey</p>
            </div>
          </div>

          {/* Close button for mobile */}
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            aria-label="Tutup Menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Selector (Both Desktop & Mobile Drawer) */}
        <div className="px-3.5 pt-3 pb-2 border-b border-slate-100">
          <div className="flex items-center justify-between mb-1.5 px-0.5">
            <span className="text-[10px] uppercase font-bold text-slate-400">
              Peran Pengguna:
            </span>
            <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${
              userRole === 'mentor'
                ? 'text-emerald-700 bg-emerald-50'
                : userRole === 'parent'
                ? 'text-rose-700 bg-rose-50'
                : 'text-amber-700 bg-amber-50'
            }`}>
              {userRole === 'mentor' ? 'Akses Penuh' : 'Akses Dibatasi'}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setUserRole('mentor')}
              className={`py-2 px-1 text-center rounded-lg text-[11px] font-semibold transition-all flex flex-col items-center gap-1 ${
                userRole === 'mentor'
                  ? 'bg-white text-indigo-700 shadow-xs ring-1 ring-indigo-200 font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Ganti ke peran Mentor"
            >
              <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
              <span>Mentor</span>
            </button>
            <button
              type="button"
              onClick={() => setUserRole('parent')}
              className={`py-2 px-1 text-center rounded-lg text-[11px] font-semibold transition-all flex flex-col items-center gap-1 ${
                userRole === 'parent'
                  ? 'bg-white text-rose-700 shadow-xs ring-1 ring-rose-200 font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Ganti ke peran Orang Tua"
            >
              <HeartHandshake className="w-3.5 h-3.5 text-rose-600" />
              <span>Orang Tua</span>
            </button>
            <button
              type="button"
              onClick={() => setUserRole('student')}
              className={`py-2 px-1 text-center rounded-lg text-[11px] font-semibold transition-all flex flex-col items-center gap-1 ${
                userRole === 'student'
                  ? 'bg-white text-emerald-700 shadow-xs ring-1 ring-emerald-200 font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Ganti ke peran Raka"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Raka</span>
            </button>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="p-3 space-y-1">
          {NAV_ITEMS.filter(item => ROLE_TAB_ACCESS[userRole].includes(item.id)).map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all min-h-[44px] group ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                    isActive ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Active Persona Card at Bottom */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/90 m-3 rounded-2xl border border-slate-200/80">
        <div className="flex items-center gap-2.5">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shadow-xs shrink-0 ${
            userRole === 'mentor'
              ? 'bg-indigo-600 text-white'
              : userRole === 'parent'
              ? 'bg-rose-600 text-white'
              : 'bg-emerald-600 text-white'
          }`}>
            {userRole === 'mentor' && <GraduationCap className="w-4 h-4" />}
            {userRole === 'parent' && <HeartHandshake className="w-4 h-4" />}
            {userRole === 'student' && <Sparkles className="w-4 h-4" />}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-1">
              <p className="text-xs font-bold text-slate-900 truncate">
                {userRole === 'mentor'
                  ? 'Kak Sabina'
                  : userRole === 'parent'
                  ? 'Ayah & Ibu Raka'
                  : (userProfile.name || 'Raka Daniswara')}
              </p>
              <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${
                userRole === 'mentor'
                  ? 'bg-indigo-100 text-indigo-700'
                  : userRole === 'parent'
                  ? 'bg-rose-100 text-rose-700'
                  : 'bg-emerald-100 text-emerald-700'
              }`}>
                {userRole === 'mentor' ? 'Mentor' : userRole === 'parent' ? 'Orang Tua' : 'Raka'}
              </span>
            </div>
            <p className="text-[10px] text-slate-500 truncate mt-0.5">
              {userRole === 'mentor'
                ? 'Fasilitator Belajar'
                : userRole === 'parent'
                ? 'Pendamping di Rumah'
                : `${userProfile.age || 9} Tahun · Siswa`}
            </p>
          </div>
        </div>
        <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-500">
          <span>Kapabilitas:</span>
          <span className={`font-semibold ${
            userRole === 'mentor'
              ? 'text-emerald-600'
              : userRole === 'parent'
              ? 'text-rose-600'
              : 'text-amber-600'
          }`}>
            {userRole === 'mentor'
              ? 'Akses Penuh (Sesi, DB, Laporan)'
              : userRole === 'parent'
              ? 'Feedback & Pantau Rumah'
              : 'Eksplorasi Belajar & Karya'}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Desktop Sidebar (always visible on md: and larger) */}
      <aside className="hidden md:flex w-64 bg-white border-r border-slate-200/80 flex-col shrink-0 min-h-screen select-none sticky top-0 h-screen overflow-y-auto">
        {navContent}
      </aside>

      {/* 2. Mobile Off-Canvas Drawer (visible when isMobileMenuOpen is true) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex animate-in fade-in duration-200">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer Panel: stops background screen scroll and drawer itself scrolls */}
          <div className="relative w-72 max-w-[85vw] bg-white h-full max-h-screen shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200 overflow-y-auto overscroll-contain touch-pan-y pb-safe">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
};
