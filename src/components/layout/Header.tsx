import React, { useState } from 'react';
import {
  Calendar,
  Plus,
  GraduationCap,
  HeartHandshake,
  Sparkles,
  Menu,
  ChevronDown,
  Lock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

export const Header: React.FC = () => {
  const {
    activeTab,
    userRole,
    setUserRole,
    setIsNewSessionModalOpen,
    setIsNewFeedbackModalOpen,
    setIsNewCuriosityModalOpen,
    setIsUploadModalOpen,
    setIsMobileMenuOpen
  } = useApp();

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);

  const getPageTitle = () => {
    switch (activeTab) {
      case 'beranda':
        return { title: 'Dashboard', subtitle: 'Ringkasan perkembangan & highlight' };
      case 'daily-report':
        return { title: 'Daily Report', subtitle: 'Detail aktivitas & observasi mentor' };
      case 'progress':
        return { title: 'Progress Raka', subtitle: 'Grafik perkembangan berkala' };
      case 'curiosity':
        return { title: 'Curiosity Corner', subtitle: 'Rasa penasaran Raka' };
      case 'parent-corner':
        return { title: 'Parent Corner', subtitle: 'Feedback orang tua' };
      case 'monthly-report':
        return { title: 'Monthly Report', subtitle: 'Rangkuman bulanan' };
      case 'galeri-karya':
        return { title: 'Galeri Karya', subtitle: 'Dokumentasi karya Raka' };
      case 'pengaturan':
        return { title: 'Pengaturan', subtitle: 'Profil siswa & preferensi' };
      default:
        return { title: 'Raka Learning Journey', subtitle: '' };
    }
  };

  const { title, subtitle } = getPageTitle();

  const getRoleLabel = (role: UserRole) => {
    if (role === 'mentor') return { label: 'Mentor', color: 'text-indigo-700 bg-indigo-50 border-indigo-200' };
    if (role === 'parent') return { label: 'Orang Tua', color: 'text-rose-700 bg-rose-50 border-rose-200' };
    return { label: 'Raka', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
  };

  const currentRoleInfo = getRoleLabel(userRole);

  return (
    <header className="h-14 md:h-16 bg-white border-b border-slate-200/80 px-3 md:px-6 flex items-center justify-between sticky top-0 z-30 select-none">
      {/* Left: Mobile Drawer Trigger & Page Title */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="md:hidden min-w-[44px] min-h-[44px] -ml-1 flex items-center justify-center rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          aria-label="Buka Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <h2 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight truncate">
            {title}
          </h2>
          {subtitle && (
            <p className="text-[10px] sm:text-[11px] text-slate-500 hidden sm:block truncate">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        {/* Period Selector (desktop only) */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50/70 text-slate-700 text-xs font-medium">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <span>September 2026</span>
        </div>

        {/* Desktop Role Switcher */}
        <div className="hidden md:flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200/70">
          <button
            type="button"
            onClick={() => setUserRole('mentor')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs transition-all ${
              userRole === 'mentor'
                ? 'bg-white text-indigo-700 shadow-xs ring-1 ring-indigo-200 font-bold'
                : 'text-slate-600 hover:text-slate-900 font-medium'
            }`}
            title="Masuk sebagai Mentor"
          >
            <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
            <span>Mentor</span>
          </button>

          <button
            type="button"
            onClick={() => setUserRole('parent')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs transition-all ${
              userRole === 'parent'
                ? 'bg-white text-rose-700 shadow-xs ring-1 ring-rose-200 font-bold'
                : 'text-slate-600 hover:text-slate-900 font-medium'
            }`}
            title="Masuk sebagai Orang Tua"
          >
            <HeartHandshake className="w-3.5 h-3.5 text-rose-600" />
            <span>Orang Tua</span>
          </button>

          <button
            type="button"
            onClick={() => setUserRole('student')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs transition-all ${
              userRole === 'student'
                ? 'bg-white text-emerald-700 shadow-xs ring-1 ring-emerald-200 font-bold'
                : 'text-slate-600 hover:text-slate-900 font-medium'
            }`}
            title="Masuk sebagai Raka"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Raka</span>
          </button>
        </div>

        {/* Mobile Compact Role Badge Dropdown */}
        <div className="relative md:hidden">
          <button
            type="button"
            onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-bold transition-all min-h-[36px] ${currentRoleInfo.color}`}
            aria-label="Ganti Peran Pengguna"
          >
            {userRole === 'mentor' && <GraduationCap className="w-3.5 h-3.5" />}
            {userRole === 'parent' && <HeartHandshake className="w-3.5 h-3.5" />}
            {userRole === 'student' && <Sparkles className="w-3.5 h-3.5" />}
            <span>{currentRoleInfo.label}</span>
            <ChevronDown className="w-3 h-3 ml-0.5 opacity-60" />
          </button>

          {isRoleDropdownOpen && (
            <>
              {/* Tap-outside backdrop for mobile */}
              <div
                className="fixed inset-0 z-30"
                onClick={() => setIsRoleDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-1 w-36 bg-white rounded-xl shadow-lg border border-slate-100 p-1 z-40 animate-in fade-in">
                <button
                  onClick={() => {
                    setUserRole('mentor');
                    setIsRoleDropdownOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-2 rounded-lg text-xs font-medium hover:bg-slate-50 flex items-center gap-2 text-slate-700 min-h-[38px]"
                >
                  <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Mentor</span>
                </button>
                <button
                  onClick={() => {
                    setUserRole('parent');
                    setIsRoleDropdownOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-2 rounded-lg text-xs font-medium hover:bg-slate-50 flex items-center gap-2 text-slate-700 min-h-[38px]"
                >
                  <HeartHandshake className="w-3.5 h-3.5 text-rose-600" />
                  <span>Orang Tua</span>
                </button>
                <button
                  onClick={() => {
                    setUserRole('student');
                    setIsRoleDropdownOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-2 rounded-lg text-xs font-medium hover:bg-slate-50 flex items-center gap-2 text-slate-700 min-h-[38px]"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Raka</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Action Menu (Accessible equally by all roles: Mentor, Orang Tua, and Raka) */}
        <div className="relative">
          <button
            onClick={() => setIsActionMenuOpen(!isActionMenuOpen)}
            className={`flex items-center justify-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 text-white rounded-lg text-xs font-semibold transition-all shadow-xs min-h-[36px] ${
              userRole === 'mentor'
                ? 'bg-indigo-600 hover:bg-indigo-700'
                : userRole === 'parent'
                ? 'bg-rose-600 hover:bg-rose-700'
                : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
            title="Tambah Entri / Aksi"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">+ Tambah</span>
            <ChevronDown className="w-3 h-3 opacity-70 hidden sm:inline" />
          </button>

          {isActionMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setIsActionMenuOpen(false)}
              />
              <div className="absolute right-0 mt-1 w-60 bg-white rounded-xl shadow-xl border border-slate-100 p-1.5 z-40 animate-in fade-in">
                <div className="px-2.5 py-1 text-[10px] uppercase font-bold text-slate-400 flex items-center justify-between">
                  <span>Aksi: {currentRoleInfo.label}</span>
                  {userRole === 'mentor' ? (
                    <span className="text-[9px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">Akses Penuh</span>
                  ) : (
                    <span className="text-[9px] font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">Dibatasi</span>
                  )}
                </div>

                {/* 1. Mulai Sesi Mentoring (Khusus Mentor) */}
                {userRole === 'mentor' ? (
                  <button
                    type="button"
                    onClick={() => {
                      setIsNewSessionModalOpen(true);
                      setIsActionMenuOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-lg text-xs font-medium hover:bg-indigo-50 hover:text-indigo-700 flex items-center justify-between text-slate-700 min-h-[38px] transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span>Mulai Sesi Mentoring</span>
                    </div>
                  </button>
                ) : (
                  <div
                    className="w-full px-2.5 py-2 rounded-lg text-xs flex items-center justify-between text-slate-400 bg-slate-50/70 min-h-[38px] cursor-not-allowed opacity-75"
                    title="Hanya Mentor yang dapat mencatat sesi mentoring baru"
                  >
                    <div className="flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="line-through decoration-slate-300">Mulai Sesi Mentoring</span>
                    </div>
                    <span className="text-[9px] font-semibold text-slate-400 bg-slate-200/80 px-1.5 py-0.5 rounded">
                      Mentor
                    </span>
                  </div>
                )}

                {/* 2. Catat Feedback Orang Tua (Mentor & Orang Tua) */}
                {userRole === 'mentor' || userRole === 'parent' ? (
                  <button
                    type="button"
                    onClick={() => {
                      setIsNewFeedbackModalOpen(true);
                      setIsActionMenuOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-lg text-xs font-medium hover:bg-rose-50 hover:text-rose-700 flex items-center justify-between text-slate-700 min-h-[38px] transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <HeartHandshake className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>Catat Feedback Orang Tua</span>
                    </div>
                  </button>
                ) : (
                  <div
                    className="w-full px-2.5 py-2 rounded-lg text-xs flex items-center justify-between text-slate-400 bg-slate-50/70 min-h-[38px] cursor-not-allowed opacity-75"
                    title="Khusus Orang Tua atau Mentor"
                  >
                    <div className="flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="line-through decoration-slate-300">Feedback Orang Tua</span>
                    </div>
                    <span className="text-[9px] font-semibold text-slate-400 bg-slate-200/80 px-1.5 py-0.5 rounded">
                      Orang Tua
                    </span>
                  </div>
                )}

                {/* 3. Tanya di Curiosity Corner (Semua) */}
                <button
                  type="button"
                  onClick={() => {
                    setIsNewCuriosityModalOpen(true);
                    setIsActionMenuOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-2 rounded-lg text-xs font-medium hover:bg-amber-50 hover:text-amber-700 flex items-center gap-2 text-slate-700 min-h-[38px] transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Tanya di Curiosity Corner</span>
                </button>

                {/* 4. Upload Karya ke R2 (Mentor & Siswa Raka) */}
                <button
                  type="button"
                  onClick={() => {
                    setIsUploadModalOpen(true);
                    setIsActionMenuOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-2 rounded-lg text-xs font-medium hover:bg-sky-50 hover:text-sky-700 flex items-center gap-2 text-slate-700 min-h-[38px] transition-colors"
                >
                  <Plus className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>Upload Karya ke R2</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
