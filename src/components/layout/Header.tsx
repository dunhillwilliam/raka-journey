import React, { useState } from 'react';
import {
  Calendar,
  Plus,
  GraduationCap,
  HeartHandshake,
  Sparkles,
  Menu,
  ChevronDown,
  Share2,
  Copy,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Header: React.FC = () => {
  const {
    activeTab,
    setIsNewSessionModalOpen,
    setIsNewFeedbackModalOpen,
    setIsNewCuriosityModalOpen,
    setIsUploadModalOpen,
    setIsMobileMenuOpen
  } = useApp();

  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState<'parent' | 'raka' | null>(null);

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

  const copyLink = (view: 'parent' | 'raka') => {
    const url = `${window.location.origin}${window.location.pathname}?view=${view}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(view);
    setIsActionMenuOpen(false);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const { title, subtitle } = getPageTitle();

  return (
    <header className="h-14 md:h-16 bg-white border-b border-slate-200/80 px-3 md:px-6 flex items-center justify-between sticky top-0 z-30 select-none">
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

      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50/70 text-slate-700 text-xs font-medium">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <span>Semester Genap 2026</span>
        </div>

        <div className="relative">
          <button
            onClick={() => setIsActionMenuOpen(!isActionMenuOpen)}
            className="flex items-center justify-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-all shadow-xs min-h-[36px]"
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
              <div className="absolute right-0 mt-1 w-64 bg-white rounded-xl shadow-xl border border-slate-100 p-4 z-40 animate-in fade-in">
                <div className="px-2.5 py-1 text-[10px] uppercase font-bold text-slate-400 flex items-center justify-between">
                  <span>Aksi Mentor</span>
                  <span className="text-[9px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">Akses Penuh</span>
                </div>

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

                <div className="border-t border-slate-100 my-1" />

                <div className="px-2.5 py-1 text-[10px] uppercase font-bold text-slate-400">
                  Bagikan Link
                </div>

                <button
                  type="button"
                  onClick={() => copyLink('parent')}
                  className="w-full text-left px-2.5 py-2 rounded-lg text-xs font-medium hover:bg-rose-50 hover:text-rose-700 flex items-center justify-between text-slate-700 min-h-[38px] transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>Link untuk Orang Tua</span>
                  </div>
                  {copiedLink === 'parent' ? (
                    <span className="text-[10px] font-semibold text-emerald-600">Tersalin!</span>
                  ) : (
                    <Copy className="w-3 h-3 text-slate-400 shrink-0" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => copyLink('raka')}
                  className="w-full text-left px-2.5 py-2 rounded-lg text-xs font-medium hover:bg-emerald-50 hover:text-emerald-700 flex items-center justify-between text-slate-700 min-h-[38px] transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Link untuk Raka</span>
                  </div>
                  {copiedLink === 'raka' ? (
                    <span className="text-[10px] font-semibold text-emerald-600">Tersalin!</span>
                  ) : (
                    <Copy className="w-3 h-3 text-slate-400 shrink-0" />
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};