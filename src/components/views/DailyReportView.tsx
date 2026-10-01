import React from 'react';
import {
  Download,
  ArrowLeft,
  Clock,
  Laptop,
  CheckCircle,
  HelpCircle,
  Plus,
  ChevronRight,
  Lock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MentorAvatar, VideoEditingIllustration } from '../illustrations/ArtAssets';

export const DailyReportView: React.FC = () => {
  const {
    sessions,
    currentSession,
    selectSession,
    userRole,
    setActiveTab,
    setIsPdfPreviewOpen,
    setIsNewSessionModalOpen,
    updateSession
  } = useApp();

  if (!currentSession) {
    return (
      <div className="space-y-4 sm:space-y-6 max-w-7xl mx-auto pb-10">
        <div className="flex items-center gap-2 border-b border-slate-200/80 pb-3 sm:pb-4">
          <button
            onClick={() => setActiveTab('beranda')}
            className="min-w-[38px] min-h-[38px] flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900">Daily Report</h2>
            <p className="text-xs text-slate-500">Belum ada sesi mentoring yang tercatat di Supabase</p>
          </div>
        </div>

        <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-8 sm:p-12 text-center max-w-lg mx-auto my-8">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1">Mulai Catat Sesi Mentoring Pertama</h3>
          <p className="text-xs text-slate-500 mb-4 leading-relaxed">
            Data materi yang dipelajari, observasi mentor, dokumentasi aktivitas, dan rencana sesi berikutnya akan tersimpan langsung ke database Supabase.
          </p>
          {userRole === 'mentor' ? (
            <button
              type="button"
              onClick={() => setIsNewSessionModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>+ Catat Sesi Baru</span>
            </button>
          ) : (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-500 rounded-xl text-xs font-medium">
              <Lock className="w-4 h-4 text-slate-400" />
              <span>Menunggu rilis sesi baru dari Mentor (Kak Sabina)</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  const handleToggleTopic = (topicId: string) => {
    const updatedTopics = currentSession.topicsLearned.map(t =>
      t.id === topicId ? { ...t, completed: !t.completed } : t
    );
    updateSession({
      ...currentSession,
      topicsLearned: updatedTopics
    });
  };

  const handleToggleTask = (taskId: string) => {
    const updatedTasks = currentSession.activities.tasks.map(t =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    updateSession({
      ...currentSession,
      activities: {
        ...currentSession.activities,
        tasks: updatedTasks
      }
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-w-7xl mx-auto pb-10">
      {/* Top Header & Actions */}
      <div className="flex flex-col gap-2.5 sm:gap-3 border-b border-slate-200/80 pb-3 sm:pb-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={() => setActiveTab('beranda')}
              className="min-w-[38px] min-h-[38px] flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors shrink-0"
              title="Kembali ke Dashboard"
              aria-label="Kembali"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="min-w-0">
              <h2 className="text-xs sm:text-base font-bold text-slate-900 truncate">
                Daily Report
              </h2>
              <span className="text-[10px] sm:text-xs font-mono font-medium text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded truncate block sm:inline">
                Sesi ke-{String(currentSession.sessionNumber).padStart(2, '0')} · {currentSession.formattedDate}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={() => setIsPdfPreviewOpen(true)}
              className="min-h-[36px] sm:min-h-[38px] flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
              title="Unduh PDF"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Unduh PDF</span>
              <span className="sm:hidden text-[11px]">PDF</span>
            </button>

            {userRole === 'mentor' ? (
              <button
                type="button"
                onClick={() => setIsNewSessionModalOpen(true)}
                className="min-h-[36px] sm:min-h-[38px] flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">+ Sesi Baru</span>
                <span className="sm:hidden text-[11px]">Sesi</span>
              </button>
            ) : (
              <div
                className="min-h-[36px] sm:min-h-[38px] flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-[11px] font-medium text-slate-400"
                title="Pencatatan sesi hanya dapat dilakukan oleh Mentor"
              >
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden sm:inline">Sesi Baru (Khusus Mentor)</span>
                <span className="sm:hidden">Mentor</span>
              </div>
            )}
          </div>
        </div>

        {/* Sesi selector pills (horizontal scrollable on mobile with smooth swipe) */}
        <div className="overflow-x-auto pb-1 -mx-1 px-1 flex items-center gap-1.5 no-scrollbar">
          <span className="text-[11px] font-semibold text-slate-400 shrink-0 mr-1 hidden sm:inline">Pilih Sesi:</span>
          {sessions.map((s) => (
            <button
              key={s.id}
              onClick={() => selectSession(s.id)}
              className={`px-3 py-1.5 min-h-[36px] text-xs font-medium rounded-lg whitespace-nowrap transition-colors shrink-0 ${
                s.id === currentSession.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
            >
              Sesi {s.sessionNumber}
            </button>
          ))}
        </div>
      </div>

      {/* Main Session Banner Card */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-sky-950 text-white rounded-2xl p-4 sm:p-6 shadow-md relative overflow-hidden">
        <div className="flex flex-col gap-3 sm:gap-4 z-10 relative">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white shrink-0">
              <Laptop className="w-5 h-5 sm:w-6 sm:h-6 text-sky-400" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] sm:text-[11px] font-mono text-sky-300 font-medium">Sesi ke-{currentSession.sessionNumber}</span>
              <h1 className="text-sm sm:text-2xl font-bold tracking-tight text-white leading-snug">
                {currentSession.title}
              </h1>
            </div>
          </div>

          {/* Session Meta Tags */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-[10px] sm:text-xs text-slate-300 font-medium pt-2 border-t border-white/10">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Durasi {currentSession.durationMinutes} menit</span>
            </div>
            <span className="text-slate-600 hidden sm:inline">·</span>
            <div className="flex items-center gap-1.5">
              <Laptop className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Format {currentSession.format}</span>
            </div>
            <span className="text-slate-600 hidden sm:inline">·</span>
            <div className="flex items-center gap-1.5">
              <MentorAvatar className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              <span>Mentor {currentSession.mentorName}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Report Sections: Reordered sequentially 1-6 on mobile, 8/4 grid on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        {/* 1. Apa yang Dipelajari Hari Ini? (Desktop: 8 cols, Mobile: Order 1) */}
        <div className="lg:col-span-8 order-1 bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-center gap-2.5 mb-3.5">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs shrink-0">
              1
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900">Apa yang Dipelajari Hari Ini?</h3>
              <p className="text-[10px] sm:text-[11px] text-slate-500">Materi dan konsep inti yang dieksplorasi</p>
            </div>
          </div>

          <div className="space-y-2">
            {currentSession.topicsLearned.map((topic) => (
              <div
                key={topic.id}
                onClick={() => handleToggleTopic(topic.id)}
                className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 border border-slate-100 cursor-pointer transition-colors min-h-[44px]"
              >
                <div className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 border ${
                  topic.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300'
                }`}>
                  {topic.completed && <CheckCircle className="w-3.5 h-3.5" />}
                </div>
                <span className={`text-xs ${topic.completed ? 'text-slate-800 font-medium' : 'text-slate-500'}`}>
                  {topic.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Apa yang Membuat Raka Penasaran? (Desktop: 4 cols, Mobile: Order 2) */}
        <div className="lg:col-span-4 order-2 bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs shrink-0">
                2
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900">Rasa Penasaran Raka</h3>
                <p className="text-[10px] sm:text-[11px] text-slate-500">Pertanyaan spontan saat sesi</p>
              </div>
            </div>

            <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-xl relative">
              <HelpCircle className="w-4 h-4 text-amber-600 absolute top-3 right-3 opacity-60" />
              <p className="text-xs font-semibold text-slate-900 italic leading-relaxed pr-6">
                &ldquo;{currentSession.curiosity.question}&rdquo;
              </p>
              <div className="mt-3 pt-2.5 border-t border-amber-200/60 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Kategori:</span>
                <span className="font-semibold text-slate-800">{currentSession.curiosity.category}</span>
              </div>
              <div className="mt-1 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Level:</span>
                <span className="font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded text-[10px]">
                  {currentSession.curiosity.level}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('curiosity')}
            className="mt-3 w-full min-h-[40px] flex items-center justify-center text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            Lihat di Curiosity Corner &rarr;
          </button>
        </div>

        {/* 3. Observasi Mentor (Desktop: 8 cols, Mobile: Order 3) */}
        <div className="lg:col-span-8 order-3 bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-center gap-2.5 mb-3.5">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center font-bold text-xs shrink-0">
              3
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900">Observasi Mentor</h3>
              <p className="text-[10px] sm:text-[11px] text-slate-500">Catatan perkembangan dan area pendampingan</p>
            </div>
          </div>

          <div className="p-3.5 sm:p-4 bg-slate-50 rounded-xl border border-slate-200/70 text-xs text-slate-700 leading-relaxed mb-4">
            &ldquo;{currentSession.mentorObservation.notes}&rdquo;
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {/* Strength */}
            <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-200/60">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                Strength
              </span>
              <ul className="mt-2 space-y-1.5">
                {currentSession.mentorObservation.strengths.map((str, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-xs text-emerald-900 font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Area yang Perlu Dikembangkan */}
            <div className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-200/60">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-amber-800">
                Area yang Perlu Dikembangkan
              </span>
              <ul className="mt-2 space-y-1.5">
                {currentSession.mentorObservation.areasForDevelopment.map((area, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-xs text-amber-900 font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                    <span>{area}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* 5. Feedback Orang Tua (Desktop: 4 cols, Mobile: Order 5) */}
        <div className="lg:col-span-4 order-5 bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-xs shrink-0">
                5
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900">Feedback Orang Tua</h3>
                <p className="text-[10px] sm:text-[11px] text-slate-500">Refleksi penerapan di rumah</p>
              </div>
            </div>

            <div className="p-3.5 bg-rose-50/50 border border-rose-200/70 rounded-xl">
              <p className="text-xs text-slate-800 italic leading-relaxed">
                &ldquo;{currentSession.parentFeedback.quote}&rdquo;
              </p>
              <div className="mt-2 text-right text-[10px] text-slate-500 font-medium">
                — {currentSession.parentFeedback.parentName}
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('parent-corner')}
            className="mt-3 w-full min-h-[40px] flex items-center justify-center text-xs font-semibold text-rose-600 hover:text-rose-800 transition-colors"
          >
            Lihat semua feedback &rarr;
          </button>
        </div>

        {/* 4. Hasil / Aktivitas Belajar (Desktop: 8 cols, Mobile: Order 4) */}
        <div className="lg:col-span-8 order-4 bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-center gap-2.5 mb-3.5">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center font-bold text-xs shrink-0">
              4
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900">Hasil / Aktivitas Belajar</h3>
              <p className="text-[10px] sm:text-[11px] text-slate-500">Artefak proyek yang dikerjakan langsung</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <VideoEditingIllustration className="w-full" />

            <div className="space-y-2">
              <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Checklist Praktik Mandiri
              </span>
              {currentSession.activities.tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => handleToggleTask(task.id)}
                  className="flex items-center gap-2.5 p-3 rounded-lg hover:bg-slate-50 border border-slate-100 cursor-pointer transition-colors text-xs text-slate-700 font-medium min-h-[44px]"
                >
                  <CheckCircle className={`w-4 h-4 shrink-0 ${task.completed ? 'text-emerald-500' : 'text-slate-300'}`} />
                  <span>{task.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 6. Rencana Sesi Berikutnya (Desktop: 4 cols, Mobile: Order 6) */}
        <div className="lg:col-span-4 order-6 bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs shrink-0">
                6
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900">Rencana Sesi Berikutnya</h3>
                <p className="text-[10px] sm:text-[11px] text-slate-500">Milestone pembelajaran mendatang</p>
              </div>
            </div>

            <ul className="space-y-2">
              {currentSession.nextSessionPlan.map((plan, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 font-medium">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <span>{plan}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={() => setIsNewSessionModalOpen(true)}
            className="mt-4 w-full min-h-[44px] py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
          >
            <span>Mulai Sesi Berikutnya</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
