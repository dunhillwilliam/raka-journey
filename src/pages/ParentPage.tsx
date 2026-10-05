import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  HeartHandshake,
  Sparkles,
  TrendingUp,
  HelpCircle,
  ChevronDown,
  CheckCircle,
  Clock,
  Laptop,
  GraduationCap,
  Download
} from 'lucide-react';
import {
  SessionReport,
  ParentFeedbackItem,
  CuriosityItem,
  Artwork,
  CompetencyProgressItem,
} from '../types';
import { INITIAL_COMPETENCIES } from '../lib/initialData';
import {
  getSessions,
  getCuriosityList,
  getParentFeedbacks,
  getArtworksList,
} from '../lib/supabase';

type View = 'report' | 'feedback' | 'progress' | 'curiosity' | 'gallery';

const formatDate = (d: string) => {
  const date = new Date(d);
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
};

const ParentPage: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('report');
  const [sessions, setSessions] = useState<SessionReport[]>([]);
  const [feedbacks, setFeedbacks] = useState<ParentFeedbackItem[]>([]);
  const [curiosityItems, setCuriosityItems] = useState<CuriosityItem[]>([]);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSessionId, setSelectedSessionId] = useState<string>('');

  useEffect(() => {
    async function load() {
      try {
        const [s, f, c, a] = await Promise.all([
          getSessions(),
          getParentFeedbacks(),
          getCuriosityList(),
          getArtworksList(),
        ]);
        setSessions(s);
        setFeedbacks(f);
        setCuriosityItems(c);
        setArtworks(a);
        if (s.length > 0) setSelectedSessionId(s[0].id);
      } catch (e) {
        console.error('Parent page load error:', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const currentSession = sessions.find(s => s.id === selectedSessionId) || sessions[0];

  const competencies: CompetencyProgressItem[] = INITIAL_COMPETENCIES.map(comp => {
    if (sessions.length === 0) {
      return { ...comp, currentScore: 0, initialScore: 0, delta: 0 };
    }
    const sorted = [...sessions].sort((a, b) => a.sessionNumber - b.sessionNumber);
    const firstScore = sorted[0].scores[comp.key] || 0;
    const latestScore = sorted[sorted.length - 1].scores[comp.key] || 0;
    return { ...comp, currentScore: latestScore, initialScore: firstScore, delta: latestScore - firstScore };
  });

  const navItems: { id: View; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'report', label: 'Laporan Sesi', icon: BookOpen },
    { id: 'feedback', label: 'Feedback', icon: HeartHandshake },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'curiosity', label: 'Curiosity', icon: HelpCircle },
    { id: 'gallery', label: 'Galeri', icon: Sparkles },
  ];

  const overallAvg = competencies.length > 0
    ? Math.round(competencies.reduce((a, c) => a + c.currentScore, 0) / competencies.length)
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-pulse text-slate-400 text-sm">Memuat data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased font-sans">
      <header className="bg-white border-b border-slate-200/80 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-rose-600 to-pink-500 flex items-center justify-center text-white">
            <HeartHandshake className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900">Parent Dashboard</h1>
            <p className="text-[10px] text-slate-500">Pantau Perkembangan Raka</p>
          </div>
        </div>
        <span className="text-[10px] font-semibold px-2 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200">
          Orang Tua
        </span>
      </header>

      <nav className="bg-white border-b border-slate-200/80 px-3 py-2 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1 max-w-7xl mx-auto">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors min-h-[36px] ${
                  activeView === item.id
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-4 pb-12">
        {activeView === 'report' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">Laporan Sesi Mentoring</h2>
              {sessions.length > 0 && (
                <div className="relative">
                  <select
                    value={selectedSessionId}
                    onChange={e => setSelectedSessionId(e.target.value)}
                    className="appearance-none pl-3 pr-7 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-800 min-h-[36px]"
                  >
                    {sessions.map(s => (
                      <option key={s.id} value={s.id}>
                        Sesi {s.sessionNumber} - {formatDate(s.date)}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
                </div>
              )}
            </div>

            {currentSession ? (
              <div className="space-y-4">
                <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
                  <h3 className="text-sm font-bold text-slate-900 mb-2">{currentSession.title}</h3>
                  <div className="flex flex-wrap gap-3 text-[11px] text-slate-500 mb-3">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {currentSession.durationMinutes} menit</span>
                    <span className="flex items-center gap-1"><Laptop className="w-3 h-3" /> {currentSession.format}</span>
                    <span className="flex items-center gap-1"><GraduationCap className="w-3 h-3" /> {currentSession.mentorName}</span>
                  </div>
                </div>

                <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
                  <h4 className="text-xs font-bold text-slate-900 mb-2">Apa yang Dipelajari</h4>
                  <div className="space-y-1.5">
                    {currentSession.topicsLearned.map(t => (
                      <div key={t.id} className="flex items-center gap-2 text-xs text-slate-700">
                        <CheckCircle className={`w-3.5 h-3.5 ${t.completed ? 'text-emerald-500' : 'text-slate-300'}`} />
                        <span>{t.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
                  <h4 className="text-xs font-bold text-slate-900 mb-2">Observasi Mentor</h4>
                  <p className="text-xs text-slate-700 leading-relaxed mb-3">&ldquo;{currentSession.mentorObservation.notes}&rdquo;</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200/60">
                      <span className="text-[10px] font-bold uppercase text-emerald-800">Strength</span>
                      <ul className="mt-1 space-y-1">
                        {currentSession.mentorObservation.strengths.map((s, i) => (
                          <li key={i} className="flex items-center gap-1.5 text-[11px] text-emerald-900 font-medium">
                            <span className="w-1 h-1 rounded-full bg-emerald-500 shrink-0" /> {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-200/60">
                      <span className="text-[10px] font-bold uppercase text-amber-800">Perlu Dikembangkan</span>
                      <ul className="mt-1 space-y-1">
                        {currentSession.mentorObservation.areasForDevelopment.map((a, i) => (
                          <li key={i} className="flex items-center gap-1.5 text-[11px] text-amber-900 font-medium">
                            <span className="w-1 h-1 rounded-full bg-amber-500 shrink-0" /> {a}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
                  <h4 className="text-xs font-bold text-slate-900 mb-2">Rencana Sesi Berikutnya</h4>
                  <ul className="space-y-1">
                    {currentSession.nextSessionPlan.map((p, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-8 text-center">
                <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-500">Belum ada sesi mentoring</p>
              </div>
            )}
          </div>
        )}

        {activeView === 'feedback' && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900">Feedback Orang Tua</h2>
            {feedbacks.length > 0 ? (
              feedbacks.map(fb => (
                <div key={fb.id} className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{fb.weekName || `Minggu ${fb.weekNumber}`}</h3>
                      <span className="text-[11px] text-slate-400">{fb.date}</span>
                    </div>
                    <span className="text-base font-bold font-mono text-rose-600">{fb.engagementRate}%</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed bg-rose-50/50 border border-rose-100 p-3 rounded-xl mb-3">
                    &ldquo;{fb.parentNote}&rdquo;
                  </p>
                  {fb.checklist.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Checklist</span>
                      {fb.checklist.map(c => (
                        <div key={c.id} className="flex items-center gap-2 text-xs text-slate-700">
                          <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${c.checked ? 'bg-rose-500 border-rose-500 text-white' : 'border-slate-300'}`}>
                            {c.checked && <span className="text-[9px]">&#10003;</span>}
                          </div>
                          <span>{c.text}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Target Perkembangan</span>
                    <p className="text-xs text-slate-700 mt-1">{fb.developmentTarget || 'Belum ada target'}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-8 text-center">
                <HeartHandshake className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-500">Belum ada feedback yang dicatat</p>
              </div>
            )}
          </div>
        )}

        {activeView === 'progress' && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900">Progress Kompetensi</h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {competencies.map(comp => (
                <div key={comp.id} className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs text-center">
                  <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="34" stroke="#F1F5F9" strokeWidth="8" fill="transparent" />
                      <circle cx="50" cy="50" r="34" stroke={comp.color} strokeWidth="8"
                        strokeDasharray={2 * Math.PI * 34}
                        strokeDashoffset={2 * Math.PI * 34 - (comp.currentScore / 100) * 2 * Math.PI * 34}
                        strokeLinecap="round" fill="transparent" />
                    </svg>
                    <span className="absolute text-xs font-bold text-slate-900">{comp.currentScore}%</span>
                  </div>
                  <span className="mt-2 block text-xs font-semibold text-slate-700">{comp.name}</span>
                  {comp.delta !== 0 && (
                    <span className={`text-[10px] font-semibold ${comp.delta > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {comp.delta > 0 ? `+${comp.delta}` : comp.delta}%
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-slate-900">Ringkasan</h3>
                <span className="font-mono font-bold text-lg text-slate-900">{overallAvg}%</span>
              </div>
              <div className="space-y-2">
                {competencies.map(comp => (
                  <div key={comp.id} className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-600">{comp.name}</span>
                      <span className="font-mono text-slate-900">{comp.currentScore}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${comp.currentScore}%`, backgroundColor: comp.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeView === 'curiosity' && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900">Curiosity Corner</h2>
            {curiosityItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {curiosityItems.map(item => (
                  <div key={item.id} className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-800">{item.topic}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                        item.status === 'Dibahas' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                      }`}>{item.status}</span>
                    </div>
                    <p className="text-xs font-semibold text-slate-900">&ldquo;{item.question}&rdquo;</p>
                    <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                      <span>{item.formattedDate || item.date}</span>
                      {item.answeredInSession && (
                        <span className="text-indigo-600 font-medium">Dibahas di Sesi {item.answeredInSession}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-8 text-center">
                <HelpCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-500">Belum ada pertanyaan curiosity</p>
              </div>
            )}
          </div>
        )}

        {activeView === 'gallery' && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900">Galeri Karya</h2>
            {artworks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {artworks.map(art => (
                  <div key={art.id} className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <h3 className="text-xs font-bold text-slate-900 truncate">{art.title}</h3>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 shrink-0">{art.category}</span>
                    </div>
                    <p className="text-[10px] text-slate-400">{art.formattedDate || art.date}</p>
                    {art.description && (
                      <p className="text-[11px] text-slate-600 mt-2 line-clamp-2">{art.description}</p>
                    )}
                    {art.fileUrl && art.fileUrl.startsWith('http') && (
                      <button
                        onClick={() => window.open(art.fileUrl, '_blank')}
                        className="mt-2 flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 min-h-[36px]"
                      >
                        <Download className="w-3 h-3" /> Lihat Karya
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-8 text-center">
                <Sparkles className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-500">Belum ada karya yang diunggah</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default ParentPage;