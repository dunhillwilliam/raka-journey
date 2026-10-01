import React, { useState } from 'react';
import {
  Edit2,
  Check,
  Bell,
  RotateCcw,
  Database,
  Copy,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  HeartHandshake,
  Sparkles,
  ShieldCheck,
  Lock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RakaAvatar } from '../illustrations/ArtAssets';
import { SUPABASE_SQL_MIGRATION, testSupabaseConnection } from '../../lib/supabase';

export const SettingsView: React.FC = () => {
  const {
    userRole,
    setUserRole,
    userProfile,
    updateUserProfile,
    resetToDefaultDemoData,
    cloudConfig,
    updateCloudConfig
  } = useApp();

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
  const [profileName, setProfileName] = useState(userProfile.name);
  const [profileAge, setProfileAge] = useState(userProfile.age);
  const [profileInterests, setProfileInterests] = useState(userProfile.interests.join(', '));

  // Cloud Config State
  const [sbUrl, setSbUrl] = useState(cloudConfig.supabaseUrl);
  const [sbKey, setSbKey] = useState(cloudConfig.supabaseAnonKey);
  const [cfAccount, setCfAccount] = useState(cloudConfig.cfAccountId);
  const [cfBucket, setCfBucket] = useState(cloudConfig.cfBucketName);
  const [cfPublic, setCfPublic] = useState(cloudConfig.cfPublicUrl);

  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isCopiedSql, setIsCopiedSql] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveProfile = () => {
    updateUserProfile({
      name: profileName,
      age: Number(profileAge) || 9,
      interests: profileInterests.split(',').map(s => s.trim()).filter(Boolean)
    });
    setIsEditingProfile(false);
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    const res = await testSupabaseConnection(sbUrl, sbKey);
    setIsTesting(false);
    setTestResult(res);
  };

  const handleSaveCloudConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateCloudConfig(sbUrl, sbKey, cfAccount, cfBucket, cfPublic);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3500);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_MIGRATION);
    setIsCopiedSql(true);
    setTimeout(() => setIsCopiedSql(false), 2500);
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="border-b border-slate-200/80 pb-3 sm:pb-4">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">Pengaturan &amp; Integrasi Cloud</h2>
        <p className="text-[11px] sm:text-xs text-slate-500">
          Kelola peran pengguna aktif, konektivitas database Supabase, Cloudflare R2 storage, profil siswa, dan notifikasi
        </p>
      </div>

      {/* 1. Role Switcher Card: Capabilities Restricted Per Role Except Mentor */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">Peran Pengguna &amp; Pembatasan Kapabilitas</h3>
                <span className="text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-full">
                  Hak Akses Terintegrasi
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Kapabilitas dibatasi sesuai peran masing-masing, sementara <strong>Mentor</strong> memegang akses penuh ke seluruh fitur dan pengaturan sistem.
              </p>
            </div>
          </div>
        </div>

        {/* 3 Role Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {/* Mentor */}
          <button
            type="button"
            onClick={() => setUserRole('mentor')}
            className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between min-h-[120px] ${
              userRole === 'mentor'
                ? 'bg-indigo-50/70 border-indigo-300 ring-2 ring-indigo-400/50 shadow-xs'
                : 'bg-slate-50/50 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                <GraduationCap className="w-4 h-4" />
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                userRole === 'mentor' ? 'text-indigo-700 bg-indigo-100 ring-1 ring-indigo-300' : 'text-emerald-700 bg-emerald-50'
              }`}>
                Akses Penuh
              </span>
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 mt-2">Mentor (Kak Sabina)</h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                Kontrol penuh: buat sesi, observasi, konfigurasi Supabase &amp; R2, serta reset data.
              </p>
            </div>
          </button>

          {/* Orang Tua */}
          <button
            type="button"
            onClick={() => setUserRole('parent')}
            className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between min-h-[120px] ${
              userRole === 'parent'
                ? 'bg-rose-50/70 border-rose-300 ring-2 ring-rose-400/50 shadow-xs'
                : 'bg-slate-50/50 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center">
                <HeartHandshake className="w-4 h-4" />
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                userRole === 'parent' ? 'text-rose-700 bg-rose-100 ring-1 ring-rose-300' : 'text-slate-600 bg-slate-100'
              }`}>
                Akses Dibatasi
              </span>
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 mt-2">Orang Tua (Ayah &amp; Ibu)</h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                Memberi feedback mingguan, evaluasi rumah, pantau progress (tanpa akses sesi &amp; DB).
              </p>
            </div>
          </button>

          {/* Raka */}
          <button
            type="button"
            onClick={() => setUserRole('student')}
            className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between min-h-[120px] ${
              userRole === 'student'
                ? 'bg-emerald-50/70 border-emerald-300 ring-2 ring-emerald-400/50 shadow-xs'
                : 'bg-slate-50/50 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                userRole === 'student' ? 'text-emerald-700 bg-emerald-100 ring-1 ring-emerald-300' : 'text-slate-600 bg-slate-100'
              }`}>
                Akses Dibatasi
              </span>
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 mt-2">Raka (Siswa)</h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                Eksplorasi materi, upload karya digital, tanya di Curiosity (tanpa akses sesi &amp; DB).
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* 2. Cloud Integration Card (Supabase & Cloudflare R2) */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Koneksi Supabase &amp; Cloudflare R2</h3>
              <p className="text-xs text-slate-500">
                Data belajar tersimpan di Supabase PostgreSQL dan artefak file tersimpan di Cloudflare R2 (via variabel lingkungan)
              </p>
            </div>
          </div>

          {/* Status Badges */}
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium flex items-center gap-1.5 ${
              cloudConfig.isSupabaseConnected ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
            }`}>
              <span className={`w-2 h-2 rounded-full ${cloudConfig.isSupabaseConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              {cloudConfig.isSupabaseConnected ? 'Supabase Live' : 'Supabase Offline'}
            </span>

            <button
              type="button"
              onClick={handleCopySql}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 min-h-[36px]"
              title="Salin SQL migration untuk Supabase"
            >
              {isCopiedSql ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              <span>{isCopiedSql ? 'Tersalin!' : 'Salin SQL Schema'}</span>
            </button>
          </div>
        </div>

        {/* Cloud Config Form */}
        <form onSubmit={handleSaveCloudConfig} className="space-y-4 pt-4 border-t border-slate-100">
          {userRole !== 'mentor' && (
            <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Integrasi cloud &amp; DB terkunci. Hanya <strong>Mentor</strong> yang memiliki hak akses untuk menguji koneksi atau mengubah konfigurasi database &amp; storage.</span>
            </div>
          )}

          {saveSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Koneksi Supabase &amp; Cloudflare R2 dikonfigurasi via variabel lingkungan (variabel VITE_*).</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Supabase Project URL
              </label>
              <input
                type="text"
                disabled={userRole !== 'mentor'}
                placeholder="https://xyzcompany.supabase.co"
                value={sbUrl}
                onChange={(e) => setSbUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 text-xs min-h-[40px] font-mono disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Supabase Anon Key
              </label>
              <input
                type="password"
                disabled={userRole !== 'mentor'}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={sbKey}
                onChange={(e) => setSbKey(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 text-xs min-h-[40px] font-mono disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Cloudflare R2 Bucket Name
              </label>
              <input
                type="text"
                disabled={userRole !== 'mentor'}
                placeholder="raka-learning-assets"
                value={cfBucket}
                onChange={(e) => setCfBucket(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 text-xs min-h-[40px] font-mono disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Cloudflare R2 Public Domain / Worker URL
              </label>
              <input
                type="text"
                disabled={userRole !== 'mentor'}
                placeholder="https://pub-xxxx.r2.dev"
                value={cfPublic}
                onChange={(e) => setCfPublic(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 text-xs min-h-[40px] font-mono disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={isTesting || userRole !== 'mentor'}
                onClick={handleTestConnection}
                className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5 min-h-[38px] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
                <span>{isTesting ? 'Menguji...' : 'Test Koneksi DB'}</span>
              </button>

              {testResult && (
                <span className={`text-xs flex items-center gap-1 ${
                  testResult.success ? 'text-emerald-700' : 'text-rose-600'
                }`}>
                  {testResult.success ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> : <AlertCircle className="w-3.5 h-3.5 shrink-0" />}
                  <span className="truncate max-w-[280px]">{testResult.message}</span>
                </span>
              )}
            </div>

            {userRole === 'mentor' ? (
              <button
                type="submit"
                className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold shadow-xs min-h-[38px] transition-colors"
              >
                Terapkan &amp; Muat Ulang
              </button>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 text-slate-400 rounded-xl text-xs font-medium">
                <Lock className="w-3.5 h-3.5" />
                <span>Konfigurasi Terkunci (Read-Only)</span>
              </div>
            )}
          </div>
        </form>
      </div>

      {/* 3. Profil Siswa & Notifikasi Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Profil Raka Card */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900">Profil Siswa</h3>
              {userRole === 'student' ? (
                <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-lg">
                  <Lock className="w-3 h-3" />
                  Diatur Orang Tua / Mentor
                </span>
              ) : !isEditingProfile ? (
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(true)}
                  className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 min-h-[36px]"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Profil</span>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    className="text-xs text-slate-500 hover:text-slate-700 min-h-[36px] px-2"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveProfile}
                    className="flex items-center gap-1 px-2.5 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold min-h-[36px]"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Simpan
                  </button>
                </div>
              )}
            </div>

            {!isEditingProfile ? (
              <div className="flex items-center gap-4 sm:gap-5">
                <RakaAvatar className="w-16 h-16 sm:w-20 sm:h-20 shadow-md ring-3 sm:ring-4 ring-slate-50 shrink-0" />
                <div className="space-y-1 text-xs text-slate-600 min-w-0">
                  <div>
                    <span className="text-slate-400">Nama:</span>{' '}
                    <span className="font-bold text-slate-900 text-sm">{userProfile.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Usia:</span>{' '}
                    <span className="font-semibold text-slate-800">{userProfile.age} tahun</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Minat:</span>{' '}
                    <div className="flex flex-wrap gap-1 mt-1">
                      {userProfile.interests.map((int, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium">
                          {int}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Nama Siswa</label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 min-h-[42px]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Usia (Tahun)</label>
                  <input
                    type="number"
                    value={profileAge}
                    onChange={(e) => setProfileAge(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 min-h-[42px]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Minat (Pisahkan dengan koma)</label>
                  <input
                    type="text"
                    value={profileInterests}
                    onChange={(e) => setProfileInterests(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 min-h-[42px]"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 sm:mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>Kurikulum: Exploratory</span>
            <span className="text-emerald-600 font-medium">Status Aktif</span>
          </div>
        </div>

        {/* Akses & Notifikasi Card */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <Bell className="w-4 h-4 text-slate-600 shrink-0" />
              <h3 className="text-xs sm:text-sm font-bold text-slate-900">Akses &amp; Notifikasi</h3>
            </div>

            <div className="space-y-2.5 sm:space-y-3 text-xs">
              <label className="flex items-start gap-3 p-2.5 sm:p-3 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer min-h-[48px]">
                <input
                  type="checkbox"
                  checked={userProfile.notifications.newSession}
                  onChange={(e) =>
                    updateUserProfile({
                      notifications: {
                        ...userProfile.notifications,
                        newSession: e.target.checked
                      }
                    })
                  }
                  className="w-4 h-4 mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 shrink-0"
                />
                <div>
                  <span className="font-semibold text-slate-800">Notifikasi sesi baru</span>
                  <p className="text-[10px] sm:text-[11px] text-slate-500">Pemberitahuan saat mentor merilis Daily Report</p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-2.5 sm:p-3 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer min-h-[48px]">
                <input
                  type="checkbox"
                  checked={userProfile.notifications.parentFeedback}
                  onChange={(e) =>
                    updateUserProfile({
                      notifications: {
                        ...userProfile.notifications,
                        parentFeedback: e.target.checked
                      }
                    })
                  }
                  className="w-4 h-4 mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 shrink-0"
                />
                <div>
                  <span className="font-semibold text-slate-800">Notifikasi feedback orang tua</span>
                  <p className="text-[10px] sm:text-[11px] text-slate-500">Rangkuman observasi rumah mingguan</p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-2.5 sm:p-3 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer min-h-[48px]">
                <input
                  type="checkbox"
                  checked={userProfile.notifications.monthlyProgress}
                  onChange={(e) =>
                    updateUserProfile({
                      notifications: {
                        ...userProfile.notifications,
                        monthlyProgress: e.target.checked
                      }
                    })
                  }
                  className="w-4 h-4 mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 shrink-0"
                />
                <div>
                  <span className="font-semibold text-slate-800">Notifikasi progress bulanan</span>
                  <p className="text-[10px] sm:text-[11px] text-slate-500">Pemberitahuan rilis Monthly Growth Story</p>
                </div>
              </label>
            </div>
          </div>

          <div className="mt-4 sm:mt-5 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
            Saluran: Push Web &amp; WhatsApp Reminder
          </div>
        </div>
      </div>

      {/* 4. Data Management Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
            <RotateCcw className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-semibold text-slate-900">Segarkan Data</h4>
            <p className="text-[11px] text-slate-500">Muat ulang data dari Supabase dan Cloudflare</p>
          </div>
        </div>

        {userRole === 'mentor' ? (
          <button
            type="button"
            onClick={() => {
              if (confirm('Muat ulang data dari database Supabase?')) {
                resetToDefaultDemoData();
              }
            }}
            className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs min-h-[38px] flex items-center justify-center gap-1.5 transition-colors self-start sm:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Segarkan Data</span>
          </button>
        ) : (
          <div
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 text-slate-400 rounded-xl text-xs font-medium self-start sm:self-auto min-h-[38px] cursor-not-allowed"
            title="Khusus Mentor"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Segarkan Data (Khusus Mentor)</span>
          </div>
        )}
      </div>
    </div>
  );
};
