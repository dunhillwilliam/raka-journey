import React, { useState } from 'react';
import {
  Plus,
  HeartHandshake,
  CheckCircle2,
  Calendar,
  Sparkles,
  Lock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ParentCornerView: React.FC = () => {
  const {
    parentFeedbacks,
    userRole,
    toggleFeedbackChecklist,
    setIsNewFeedbackModalOpen
  } = useApp();

  const [selectedFeedbackId, setSelectedFeedbackId] = useState<string>(
    parentFeedbacks[0]?.id || ''
  );

  const canAddFeedback = userRole === 'mentor' || userRole === 'parent';

  if (parentFeedbacks.length === 0) {
    return (
      <div className="space-y-4 sm:space-y-6 max-w-7xl mx-auto pb-10">
        <div className="border-b border-slate-200/80 pb-3 sm:pb-4">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">Parent Corner</h2>
          <p className="text-[11px] sm:text-xs text-slate-500">
            Kolaborasi orang tua dan mentor untuk mendukung perkembangan belajar Raka
          </p>
        </div>

        <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-8 sm:p-12 text-center max-w-lg mx-auto my-8">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1">Belum Ada Feedback Orang Tua</h3>
          <p className="text-xs text-slate-500 mb-4 leading-relaxed">
            Catat pengamatan kebiasaan belajar di rumah, tingkat antusiasme mingguan, dan pesan dukungan orang tua yang tersimpan di Supabase.
          </p>
          {canAddFeedback ? (
            <button
              type="button"
              onClick={() => setIsNewFeedbackModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>+ Catat Feedback Pertama</span>
            </button>
          ) : (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-500 rounded-xl text-xs font-medium">
              <Lock className="w-4 h-4 text-slate-400" />
              <span>Menunggu catatan observasi dari Ayah &amp; Ibu Raka</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  const activeFeedback = parentFeedbacks.find(f => f.id === selectedFeedbackId) || parentFeedbacks[0];

  return (
    <div className="space-y-5 sm:space-y-6 max-w-7xl mx-auto pb-10">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-3 sm:pb-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">Parent Corner</h2>
          <p className="text-[11px] sm:text-xs text-slate-500">
            Kolaborasi orang tua dan mentor ({parentFeedbacks.length} observasi tercatat di Supabase)
          </p>
        </div>

        {canAddFeedback ? (
          <button
            type="button"
            onClick={() => setIsNewFeedbackModalOpen(true)}
            className="self-start sm:self-auto min-h-[40px] flex items-center gap-1.5 px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Tambah Feedback</span>
          </button>
        ) : (
          <div
            className="self-start sm:self-auto min-h-[38px] flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-[11px] font-medium text-slate-400"
            title="Pencatatan feedback khusus untuk Orang Tua atau Mentor"
          >
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>Feedback (Khusus Orang Tua / Mentor)</span>
          </div>
        )}
      </div>

      {/* Week Selector Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {parentFeedbacks.map((fb) => (
          <button
            key={fb.id}
            onClick={() => setSelectedFeedbackId(fb.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap min-h-[36px] ${
              activeFeedback?.id === fb.id
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {fb.weekName || `Minggu ${fb.weekNumber}`}
          </button>
        ))}
      </div>

      {/* Active Feedback Card */}
      {activeFeedback && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">{activeFeedback.weekName || `Minggu ${activeFeedback.weekNumber}`}</h3>
                <span className="text-[11px] text-slate-400">{activeFeedback.date}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">Antusiasme Belajar</span>
                <span className="text-base font-bold font-mono text-rose-600">{activeFeedback.engagementRate}%</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-900 mb-1.5">Catatan Orang Tua di Rumah:</h4>
              <p className="text-xs text-slate-700 leading-relaxed bg-rose-50/50 border border-rose-100 p-3.5 rounded-xl">
                &ldquo;{activeFeedback.parentNote}&rdquo;
              </p>
            </div>

            {activeFeedback.checklist && activeFeedback.checklist.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-slate-900 mb-2">Checklist Observasi Kebiasaan Belajar:</h4>
                <div className="space-y-2">
                  {activeFeedback.checklist.map((item) => (
                    <label
                      key={item.id}
                      onClick={() => toggleFeedbackChecklist(activeFeedback.id, item.id)}
                      className="flex items-start gap-2.5 p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer text-xs"
                    >
                      <input
                        type="checkbox"
                        checked={item.checked}
                        readOnly
                        className="w-4 h-4 mt-0.5 rounded text-rose-600 focus:ring-rose-500 shrink-0"
                      />
                      <span className={item.checked ? 'text-slate-800 font-medium' : 'text-slate-500'}>
                        {item.text}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">Target Perkembangan</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {activeFeedback.developmentTarget || 'Belum ada target khusus yang ditetapkan.'}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400">
              Tersinkronisasi ke Supabase
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
