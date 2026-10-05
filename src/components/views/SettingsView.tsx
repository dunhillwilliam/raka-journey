import React, { useState } from 'react';
import {
  Edit2,
  Check,
  Bell,
  RotateCcw,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RakaAvatar } from '../illustrations/ArtAssets';

export const SettingsView: React.FC = () => {
  const {
    userProfile,
    updateUserProfile,
  } = useApp();

  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
  const [profileName, setProfileName] = useState(userProfile.name);
  const [profileAge, setProfileAge] = useState(userProfile.age);
  const [profileInterests, setProfileInterests] = useState(userProfile.interests.join(', '));

  const handleSaveProfile = () => {
    updateUserProfile({
      name: profileName,
      age: Number(profileAge) || 9,
      interests: profileInterests.split(',').map(s => s.trim()).filter(Boolean)
    });
    setIsEditingProfile(false);
  };


  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto pb-12">
      <div className="border-b border-slate-200/80 pb-3 sm:pb-4">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">Pengaturan &amp; Integrasi Cloud</h2>
        <p className="text-[11px] sm:text-xs text-slate-500">
          Kelola konektivitas database Supabase, Cloudflare R2 storage, profil siswa, dan notifikasi
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900">Profil Siswa</h3>
              {!isEditingProfile ? (
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

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <Bell className="w-4 h-4 text-slate-600 shrink-0" />
              <h3 className="text-xs sm:text-sm font-bold text-slate-900">Notifikasi</h3>
            </div>

            <div className="space-y-2.5 sm:space-y-3 text-xs">
              <label className="flex items-start gap-3 p-4 sm:p-4 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer min-h-[48px]">
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

              <label className="flex items-start gap-3 p-4 sm:p-4 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer min-h-[48px]">
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

              <label className="flex items-start gap-3 p-4 sm:p-4 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer min-h-[48px]">
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



    </div>
  );
};
