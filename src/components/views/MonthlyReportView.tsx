import React, { useState } from 'react';
import {
  Award,
  Calendar,
  CheckCircle2,
  TrendingUp,
  HelpCircle,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MonthlyReportView: React.FC = () => {
  const { monthlyReport, toggleMonthlyTarget, competencies, sessions, artworks, curiosityItems } = useApp();

  const sessionMonths = Array.from(new Set(
    sessions
      .map(s => new Date(s.date).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }))
      .filter(Boolean)
  ));
  const monthOptions = monthlyReport.month && !sessionMonths.includes(monthlyReport.month)
    ? [monthlyReport.month, ...sessionMonths]
    : sessionMonths;
  const [selectedMonth, setSelectedMonth] = useState<string>(monthOptions[0] || '');
  const activeMonth = selectedMonth || monthlyReport.month || '';

  if (sessions.length === 0) {
    return (
      <div className="space-y-4 sm:space-y-6 max-w-7xl mx-auto pb-10">
        <div className="border-b border-slate-200/80 pb-3 sm:pb-4">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">Monthly Report</h2>
          <p className="text-[11px] sm:text-xs text-slate-500">Rangkuman bulanan dan evaluasi capaian belajar Raka</p>
        </div>

        <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-8 sm:p-12 text-center max-w-lg mx-auto my-8">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1">Belum Ada Laporan Bulanan</h3>
          <p className="text-xs text-slate-500 mb-4 leading-relaxed">
            Laporan bulanan akan otomatis terkompilasi dan merangkum total sesi, karya digital di R2, serta pertanyaan curiosity dari Supabase.
          </p>
        </div>
      </div>
    );
  }

  const overallAvg = Math.round(
    competencies.reduce((acc, c) => acc + c.currentScore, 0) / Math.max(1, competencies.length)
  );

  return (
    <div className="space-y-5 sm:space-y-6 max-w-7xl mx-auto pb-10">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-3 sm:pb-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">Monthly Report</h2>
          <p className="text-[11px] sm:text-xs text-slate-500">
            Rangkuman capaian belajar Raka periode {activeMonth}
          </p>
        </div>

        <div className="relative self-start sm:self-auto">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="appearance-none pl-3 pr-8 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-800 hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer shadow-xs min-h-[38px]"
          >
            {monthOptions.length === 0 && <option value="">Pilih Bulan</option>}
            {monthOptions.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
        </div>
      </div>

      {/* Recap Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
          <span className="text-[10px] sm:text-[11px] font-semibold uppercase text-slate-400">Total Sesi</span>
          <p className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 mt-1">{sessions.length}</p>
          <span className="text-[10px] text-emerald-600 font-medium">Tersimpan di Supabase</span>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
          <span className="text-[10px] sm:text-[11px] font-semibold uppercase text-slate-400">Karya di R2</span>
          <p className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 mt-1">{artworks.length}</p>
          <span className="text-[10px] text-sky-600 font-medium">Cloudflare R2 Object</span>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
          <span className="text-[10px] sm:text-[11px] font-semibold uppercase text-slate-400">Pertanyaan</span>
          <p className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 mt-1">{curiosityItems.length}</p>
          <span className="text-[10px] text-amber-600 font-medium">Curiosity Corner</span>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
          <span className="text-[10px] sm:text-[11px] font-semibold uppercase text-slate-400">Rata-rata Skor</span>
          <p className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 mt-1">{overallAvg}%</p>
          <span className="text-[10px] text-indigo-600 font-medium">5 Kompetensi Belajar</span>
        </div>
      </div>

      {/* Competencies Progress in Monthly View */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-4">Evaluasi Kompetensi Belajar</h3>
        <div className="space-y-3">
          {competencies.map(comp => (
            <div key={comp.id} className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-800">{comp.name}</span>
                <span className="font-mono text-slate-900">{comp.currentScore}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${comp.currentScore}%`, backgroundColor: comp.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
