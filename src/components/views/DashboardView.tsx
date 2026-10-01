import React from 'react';
import {
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  Video,
  Play,
  Sparkles,
  Calendar,
  ArrowUpRight,
  Plus,
  GraduationCap,
  HeartHandshake,
  Lock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RakaAvatar } from '../illustrations/ArtAssets';

export const DashboardView: React.FC = () => {
  const {
    sessions,
    competencies,
    curiosityItems,
    artworks,
    userRole,
    userProfile,
    setActiveTab,
    selectSession,
    setIsNewSessionModalOpen,
    setIsNewCuriosityModalOpen,
    setIsNewFeedbackModalOpen,
    setIsUploadModalOpen
  } = useApp();

  const latestSession = sessions[0];
  const latestCuriosity = curiosityItems[0];
  const latestArtwork = artworks[0];

  const getRoleGreeting = () => {
    if (userRole === 'mentor') {
      return {
        title: 'Halo, Mentor (Kak Sabina)!',
        subtitle: 'Pantau perkembangan sesi belajar Raka, catat observasi kompetensi, dan buat sesi baru.',
        badge: 'Mode Mentor · Akses Penuh',
        badgeColor: 'text-indigo-700 bg-indigo-100/80 border border-indigo-200',
        icon: GraduationCap
      };
    }
    if (userRole === 'parent') {
      return {
        title: 'Halo, Ayah & Ibu Raka!',
        subtitle: 'Lihat ringkasan belajar Raka di rumah, berikan feedback mingguan, atau catat sesi.',
        badge: 'Mode Orang Tua · Akses Penuh',
        badgeColor: 'text-rose-700 bg-rose-100/80 border border-rose-200',
        icon: HeartHandshake
      };
    }
    return {
      title: `Halo, ${userProfile.name.split(' ')[0] || 'Raka'}!`,
      subtitle: 'Semangat bereksplorasi hari ini! Kamu bisa mengajukan pertanyaan penasaran atau upload karyamu.',
      badge: 'Mode Raka · Akses Penuh',
      badgeColor: 'text-emerald-700 bg-emerald-100/80 border border-emerald-200',
      icon: Sparkles
    };
  };

  const greeting = getRoleGreeting();
  const GreetingIcon = greeting.icon;

  return (
    <div className="space-y-5 sm:space-y-6 max-w-7xl mx-auto pb-6">
      {/* Top Banner & Latest Session Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
        {/* Banner: Role-Aware Greeting */}
        <div className="lg:col-span-8 bg-gradient-to-r from-amber-50/80 via-sky-50/80 to-emerald-50/80 border border-slate-200/80 rounded-2xl p-3.5 sm:p-6 relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-6 shadow-xs">
          <div className="flex items-center gap-3 sm:gap-5 z-10 w-full sm:w-auto">
            <RakaAvatar className="w-12 h-12 xs:w-14 xs:h-14 sm:w-20 sm:h-20 shadow-md ring-2 sm:ring-4 ring-white shrink-0" />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
                <h2 className="text-base sm:text-2xl font-bold text-slate-900 tracking-tight">{greeting.title}</h2>
                <span className={`inline-flex items-center gap-1 text-[9px] sm:text-[11px] font-medium px-2 py-0.5 rounded-full ${greeting.badgeColor}`}>
                  <GreetingIcon className="w-3 h-3" />
                  {greeting.badge}
                </span>
              </div>
              <p className="text-[11px] sm:text-sm text-slate-600 max-w-md leading-relaxed line-clamp-2 sm:line-clamp-none">
                {greeting.subtitle}
              </p>
              <div className="mt-1.5 sm:mt-3 flex items-center gap-1.5 text-[10px] sm:text-[11px] font-medium text-slate-400">
                <Calendar className="w-3.5 h-3.5 shrink-0" />
                <span>Semester Genap 2026</span>
              </div>
            </div>
          </div>

          <div className="absolute right-0 top-0 w-64 h-64 bg-gradient-to-br from-indigo-200/20 via-sky-200/20 to-transparent rounded-full blur-2xl pointer-events-none" />
        </div>

        {/* Sesi Terbaru Card */}
        <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Sesi Terbaru
            </span>
            {latestSession && (
              <span className="text-[10px] sm:text-[11px] font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md font-medium">
                Sesi ke-{String(latestSession.sessionNumber).padStart(2, '0')} · {latestSession.formattedDate}
              </span>
            )}
          </div>

          {latestSession ? (
            <>
              <div className="my-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Video className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug truncate">
                      {latestSession.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                      Mentor: {latestSession.mentorName} · {latestSession.durationMinutes} menit
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  selectSession(latestSession.id);
                  setActiveTab('daily-report');
                }}
                className="mt-2 sm:mt-3 w-full min-h-[44px] flex items-center justify-center gap-1.5 py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-xs"
              >
                <span>Lihat Daily Report</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <div className="my-auto py-4 text-center">
              <p className="text-xs text-slate-500 mb-2">Belum ada sesi tercatat di Supabase</p>
              <button
                onClick={() => setIsNewSessionModalOpen(true)}
                className="w-full min-h-[40px] flex items-center justify-center gap-1.5 py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Mulai Sesi Pertama</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Akses & Kapabilitas Cepat (Dibatasi Sesuai Peran, Mentor Penuh) */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 sm:p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
              Aksi Cepat ({greeting.badge})
            </span>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full hidden sm:inline ${
              userRole === 'mentor'
                ? 'text-emerald-700 bg-emerald-50'
                : 'text-amber-700 bg-amber-50'
            }`}>
              {userRole === 'mentor' ? 'Semua Akses Terbuka' : 'Akses Dibatasi Sesuai Peran'}
            </span>
          </div>
          <span className="text-[11px] text-slate-500">
            {userRole === 'mentor'
              ? 'Mentor memiliki kapabilitas penuh untuk semua aksi belajar & sistem.'
              : 'Fitur aktif disesuaikan dengan peran pengguna saat ini.'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          {/* 1. Mulai Sesi (Khusus Mentor) */}
          {userRole === 'mentor' ? (
            <button
              type="button"
              onClick={() => setIsNewSessionModalOpen(true)}
              className="flex items-center gap-2 p-2.5 sm:p-3 rounded-xl border border-slate-200/80 hover:border-indigo-300 hover:bg-indigo-50/40 transition-all text-left group min-h-[46px]"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">Mulai Sesi</p>
                <p className="text-[10px] text-slate-500 truncate">Catat Sesi Mentoring</p>
              </div>
            </button>
          ) : (
            <div
              className="flex items-center gap-2 p-2.5 sm:p-3 rounded-xl border border-slate-200 bg-slate-50/70 text-left min-h-[46px] cursor-not-allowed opacity-75"
              title="Hanya Mentor yang dapat mencatat sesi mentoring"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center shrink-0">
                <Lock className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-400 line-through truncate">Mulai Sesi</p>
                <p className="text-[10px] text-slate-400 truncate">Khusus Mentor</p>
              </div>
            </div>
          )}

          {/* 2. Catat Feedback (Mentor & Orang Tua) */}
          {userRole === 'mentor' || userRole === 'parent' ? (
            <button
              type="button"
              onClick={() => setIsNewFeedbackModalOpen(true)}
              className="flex items-center gap-2 p-2.5 sm:p-3 rounded-xl border border-slate-200/80 hover:border-rose-300 hover:bg-rose-50/40 transition-all text-left group min-h-[46px]"
            >
              <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                <HeartHandshake className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">Catat Feedback</p>
                <p className="text-[10px] text-slate-500 truncate">Observasi Orang Tua</p>
              </div>
            </button>
          ) : (
            <div
              className="flex items-center gap-2 p-2.5 sm:p-3 rounded-xl border border-slate-200 bg-slate-50/70 text-left min-h-[46px] cursor-not-allowed opacity-75"
              title="Khusus Orang Tua atau Mentor"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center shrink-0">
                <Lock className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-400 line-through truncate">Feedback</p>
                <p className="text-[10px] text-slate-400 truncate">Khusus Orang Tua</p>
              </div>
            </div>
          )}

          {/* 3. Curiosity Corner (Semua) */}
          <button
            type="button"
            onClick={() => setIsNewCuriosityModalOpen(true)}
            className="flex items-center gap-2 p-2.5 sm:p-3 rounded-xl border border-slate-200/80 hover:border-amber-300 hover:bg-amber-50/40 transition-all text-left group min-h-[46px]"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate">Curiosity</p>
              <p className="text-[10px] text-slate-500 truncate">Tanya Hal Penasaran</p>
            </div>
          </button>

          {/* 4. Upload Karya ke R2 (Semua) */}
          <button
            type="button"
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-2 p-2.5 sm:p-3 rounded-xl border border-slate-200/80 hover:border-sky-300 hover:bg-sky-50/40 transition-all text-left group min-h-[46px]"
          >
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 group-hover:bg-sky-600 group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
              <Plus className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate">Upload Karya</p>
              <p className="text-[10px] text-slate-500 truncate">Simpan File ke R2</p>
            </div>
          </button>
        </div>
      </div>

      {/* Progress Utama Bulan Ini (5 Radial Gauges) */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 sm:mb-6">
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">Progress Utama Bulan Ini</h3>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
              Evaluasi akumulatif kompetensi belajar ({sessions.length} sesi tercatat)
            </p>
          </div>
          <button
            onClick={() => setActiveTab('progress')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 self-start sm:self-auto py-1"
          >
            Lihat Detail <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Circular Gauges Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-6">
          {competencies.map((comp) => {
            const radius = 34;
            const circumference = 2 * Math.PI * radius;
            const hasScore = comp.currentScore > 0;
            const strokeDashoffset = hasScore 
              ? circumference - (comp.currentScore / 100) * circumference
              : circumference;

            return (
              <div
                key={comp.id}
                className="flex flex-col items-center text-center p-2.5 sm:p-3 rounded-xl hover:bg-slate-50/80 transition-colors last:col-span-2 sm:last:col-span-1"
              >
                <div className="relative w-18 h-18 sm:w-24 sm:h-24 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r={radius}
                      stroke="#F1F5F9"
                      strokeWidth="8"
                      fill="transparent"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r={radius}
                      stroke={comp.color}
                      strokeWidth="8"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      fill="transparent"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xs sm:text-base font-bold text-slate-900">
                      {hasScore ? `${comp.currentScore}%` : '-'}
                    </span>
                    {hasScore && comp.delta !== 0 && (
                      <span className="text-[9px] sm:text-[10px] font-semibold text-emerald-600">
                        {comp.delta > 0 ? `+${comp.delta}%` : `${comp.delta}%`}
                      </span>
                    )}
                  </div>
                </div>
                <span className="mt-2 text-xs font-semibold text-slate-700">
                  {comp.name}
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5">
                  {hasScore ? 'Terpantau' : 'Belum Ada Sesi'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3 Highlight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        {/* 1. Highlight Pembelajaran */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900">Materi Terakhir Dipelajari</h3>
            </div>

            {latestSession && latestSession.topicsLearned.length > 0 ? (
              <div className="space-y-2">
                {latestSession.topicsLearned.slice(0, 3).map((topic) => (
                  <div key={topic.id} className="flex items-start gap-2 text-xs text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <span className="line-clamp-2">{topic.text}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic py-2">
                Materi sesi akan tampil otomatis saat mentor atau pengguna mencatat sesi di Supabase.
              </p>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              onClick={() => setActiveTab('daily-report')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 min-h-[36px]"
            >
              Lihat materi lengkap <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 2. Curiosity Terbaru */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3.5">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <HelpCircle className="w-4 h-4" />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900">Curiosity Terbaru</h3>
            </div>

            {latestCuriosity ? (
              <div className="p-3 bg-amber-50/60 border border-amber-200/70 rounded-xl relative">
                <p className="text-xs font-medium text-slate-800 italic leading-relaxed">
                  &ldquo;{latestCuriosity.question}&rdquo;
                </p>
                <div className="mt-2.5 flex items-center justify-between text-[10px] text-amber-800/80 font-medium">
                  <span>{latestCuriosity.formattedDate}</span>
                  <span className="px-1.5 py-0.5 bg-amber-200/60 rounded text-[9px] font-semibold text-amber-900">
                    {latestCuriosity.topic}
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center">
                <p className="text-xs text-slate-400 italic">Belum ada pertanyaan curiosity tersimpan.</p>
                <button
                  onClick={() => setIsNewCuriosityModalOpen(true)}
                  className="mt-1 text-xs font-semibold text-amber-600 hover:underline"
                >
                  + Ajukan Pertanyaan
                </button>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              onClick={() => setActiveTab('curiosity')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 min-h-[36px]"
            >
              Lihat semua pertanyaan <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 3. Karya Terbaru (Cloudflare R2) */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Play className="w-4 h-4" />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900">Karya Terbaru</h3>
            </div>

            {latestArtwork ? (
              <div
                className="relative rounded-xl overflow-hidden bg-slate-900 aspect-video flex items-center justify-center group cursor-pointer"
                onClick={() => setActiveTab('galeri-karya')}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Play className="w-4 h-4 translate-x-0.5" />
                </div>
                <div className="absolute bottom-2 left-2 text-xs font-semibold text-white truncate max-w-[80%]">
                  {latestArtwork.title}
                </div>
                <span className="absolute bottom-2 right-2 text-[10px] font-mono text-white/90 bg-black/60 px-1.5 py-0.5 rounded">
                  {latestArtwork.category}
                </span>
              </div>
            ) : (
              <div className="p-3 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center aspect-video flex flex-col items-center justify-center">
                <p className="text-xs text-slate-400 italic mb-2">Belum ada karya di Cloudflare R2.</p>
                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Upload Karya Pertama
                </button>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              onClick={() => setActiveTab('galeri-karya')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 min-h-[36px]"
            >
              Lihat galeri karya <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
