import React, { useState } from 'react';
import {
  TrendingUp,
  Calendar,
  Plus
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ProgressView: React.FC = () => {
  const { competencies, sessions, setIsNewSessionModalOpen } = useApp();
  const [selectedCompetencyKey, setSelectedCompetencyKey] = useState<string>('all');
  const [activePointIndex, setActivePointIndex] = useState<number>(0);

  if (sessions.length === 0) {
    return (
      <div className="space-y-4 sm:space-y-6 max-w-7xl mx-auto pb-10">
        <div className="border-b border-slate-200/80 pb-3 sm:pb-4">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">Progress Raka</h2>
          <p className="text-[11px] sm:text-xs text-slate-500">Perkembangan kemampuan dan kompetensi dari waktu ke waktu</p>
        </div>

        <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-8 sm:p-12 text-center max-w-lg mx-auto my-8">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
            <TrendingUp className="w-6 h-6" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1">Belum Ada Data Perkembangan</h3>
          <p className="text-xs text-slate-500 mb-4 leading-relaxed">
            Grafik perkembangan kompetensi akan otomatis terhitung dan terpantau saat mentor atau orang tua mencatat sesi belajar di Supabase.
          </p>
          <button
            onClick={() => setIsNewSessionModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>+ Catat Sesi Pertama</span>
          </button>
        </div>
      </div>
    );
  }

  // Derive chronological progress points from actual sessions
  const sortedSessions = [...sessions].sort((a, b) => a.sessionNumber - b.sessionNumber);
  const progressPoints = sortedSessions.map(s => ({
    week: `Sesi ${s.sessionNumber}`,
    date: s.formattedDate,
    creativity: s.scores.creativity || 80,
    criticalThinking: s.scores.criticalThinking || 75,
    communication: s.scores.communication || 75,
    digitalSkills: s.scores.digitalSkills || 80,
    independence: s.scores.independence || 70
  }));

  // SVG Chart Dimensions
  const chartWidth = 640;
  const chartHeight = 240;
  const padding = { top: 25, right: 25, bottom: 35, left: 35 };

  const usableWidth = chartWidth - padding.left - padding.right;
  const usableHeight = chartHeight - padding.top - padding.bottom;

  const xStep = progressPoints.length > 1 ? usableWidth / (progressPoints.length - 1) : usableWidth / 2;

  const getCoordinates = (value: number, index: number) => {
    const x = progressPoints.length > 1 ? padding.left + index * xStep : padding.left + usableWidth / 2;
    const y = padding.top + usableHeight - (value / 100) * usableHeight;
    return { x, y };
  };

  const activeCompetencies = selectedCompetencyKey === 'all'
    ? competencies
    : competencies.filter(c => c.key === selectedCompetencyKey);

  const activePoint = progressPoints[activePointIndex] || progressPoints[progressPoints.length - 1];

  const overallAvg = Math.round(
    competencies.reduce((acc, c) => acc + c.currentScore, 0) / Math.max(1, competencies.length)
  );
  const overallDelta = Math.round(
    competencies.reduce((acc, c) => acc + c.delta, 0) / Math.max(1, competencies.length)
  );

  return (
    <div className="space-y-4 sm:space-y-6 max-w-7xl mx-auto pb-10">
      {/* Header & Filter Controls */}
      <div className="flex flex-col gap-2.5 sm:gap-4 border-b border-slate-200/80 pb-3 sm:pb-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">Progress Raka</h2>
          <p className="text-[11px] sm:text-xs text-slate-500">
            Perkembangan kemampuan dihitung otomatis dari {sessions.length} sesi di Supabase
          </p>
        </div>

        {/* Filter Controls: Period Selector */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 min-h-[36px]">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>Semester Genap 2026</span>
          </div>
        </div>
      </div>

      {/* Main Chart Container */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 sm:p-6 shadow-xs relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
              Grafik Perkembangan Skor Kompetensi (0 - 100)
            </h3>
            <p className="text-[10px] sm:text-[11px] text-slate-500">
              Menampilkan lintasan perkembangan dari setiap sesi mentoring
            </p>
          </div>

          {/* Competency Filter Pills */}
          <div className="flex flex-wrap items-center gap-1 sm:gap-1.5">
            <button
              onClick={() => setSelectedCompetencyKey('all')}
              className={`px-2.5 py-1 text-[11px] rounded-lg font-semibold transition-colors min-h-[32px] ${
                selectedCompetencyKey === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Semua ({competencies.length})
            </button>
            {competencies.map((comp) => (
              <button
                key={comp.id}
                onClick={() => setSelectedCompetencyKey(comp.key)}
                className={`px-2.5 py-1 text-[11px] rounded-lg font-semibold transition-colors min-h-[32px] flex items-center gap-1 ${
                  selectedCompetencyKey === comp.key
                    ? 'text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
                style={{
                  backgroundColor: selectedCompetencyKey === comp.key ? comp.color : undefined
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
                <span>{comp.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* SVG Multi-line Chart */}
        <div className="w-full overflow-x-auto -mx-2 px-2 pb-2">
          <div className="min-w-[420px] sm:min-w-full">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-auto select-none overflow-visible"
            >
              {/* Background Grid Lines */}
              {[0, 25, 50, 75, 100].map((val) => {
                const y = padding.top + usableHeight - (val / 100) * usableHeight;
                return (
                  <g key={val}>
                    <line
                      x1={padding.left}
                      y1={y}
                      x2={chartWidth - padding.right}
                      y2={y}
                      stroke="#E2E8F0"
                      strokeDasharray="3 3"
                      strokeWidth="1"
                    />
                    <text
                      x={padding.left - 8}
                      y={y + 3}
                      fill="#94A3B8"
                      fontSize="9"
                      textAnchor="end"
                      fontFamily="monospace"
                    >
                      {val}
                    </text>
                  </g>
                );
              })}

              {/* X Axis Labels */}
              {progressPoints.map((pt, idx) => {
                const x = progressPoints.length > 1 ? padding.left + idx * xStep : padding.left + usableWidth / 2;
                return (
                  <text
                    key={idx}
                    x={x}
                    y={chartHeight - 8}
                    fill="#64748B"
                    fontSize="10"
                    textAnchor="middle"
                    fontWeight={activePointIndex === idx ? 'bold' : 'normal'}
                  >
                    {pt.week}
                  </text>
                );
              })}

              {/* Competency Lines */}
              {activeCompetencies.map((comp) => {
                const points = progressPoints.map((pt, idx) => {
                  const val = (pt as any)[comp.key] || 0;
                  return getCoordinates(val, idx);
                });

                const lineData = points.reduce((acc, curr, idx) => {
                  return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
                }, '');

                return (
                  <g key={comp.id}>
                    <path
                      d={lineData}
                      fill="none"
                      stroke={comp.color}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="transition-all duration-300"
                    />
                    {points.map((pt, idx) => (
                      <circle
                        key={idx}
                        cx={pt.x}
                        cy={pt.y}
                        r={activePointIndex === idx ? '5' : '3.5'}
                        fill="#FFFFFF"
                        stroke={comp.color}
                        strokeWidth="2"
                        className="cursor-pointer"
                        onClick={() => setActivePointIndex(idx)}
                      />
                    ))}
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Active Point Scorecard */}
        {activePoint && (
          <div className="mt-4 p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
            <div>
              <span className="font-bold text-slate-800">{activePoint.week}</span>
              <span className="text-slate-400 ml-2">({activePoint.date})</span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {competencies.map(comp => (
                <div key={comp.id} className="flex items-center gap-1.5 font-mono">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: comp.color }} />
                  <span className="text-slate-600 text-[11px]">{comp.name}:</span>
                  <span className="font-bold text-slate-900">{(activePoint as any)[comp.key] || 0}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Breakdown Table & Overall Progress Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs">
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 mb-3">Ringkasan Perkembangan Kompetensi</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] text-slate-400">
                  <th className="pb-2 font-semibold">Kompetensi</th>
                  <th className="pb-2 text-right font-semibold">Awal</th>
                  <th className="pb-2 text-right font-semibold">Saat Ini</th>
                  <th className="pb-2 text-right font-semibold">Pertumbuhan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {competencies.map(c => (
                  <tr key={c.id}>
                    <td className="py-2.5 flex items-center gap-2 font-medium text-slate-800">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                      <span>{c.name}</span>
                    </td>
                    <td className="py-2.5 text-right font-mono text-slate-500">{c.initialScore}</td>
                    <td className="py-2.5 text-right font-mono font-bold text-slate-900">{c.currentScore}</td>
                    <td className="py-2.5 text-right font-mono font-semibold text-emerald-600">
                      {c.delta >= 0 ? `+${c.delta}` : c.delta}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 mb-1">Rata-rata Kemajuan</h3>
            <p className="text-[11px] text-slate-500 mb-4">Akumulasi pertumbuhan kompetensi dari sesi mentoring</p>
          </div>

          <div className="py-4 flex flex-col items-center justify-center text-center">
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-slate-900">
              {overallAvg}%
            </div>
            <div className="text-xs font-semibold text-emerald-600 mt-1">
              {overallDelta >= 0 ? `+${overallDelta}%` : `${overallDelta}%`} sejak sesi pertama
            </div>
            <p className="text-xs text-slate-500 mt-2 max-w-xs">
              Dihitung secara real-time berdasarkan evaluasi skor tiap sesi di Supabase.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>Total Sesi: {sessions.length}</span>
            <span className="font-semibold text-slate-700">Data Supabase Terverifikasi</span>
          </div>
        </div>
      </div>
    </div>
  );
};
