import React, { useState } from 'react';
import { X, Heart } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const NewFeedbackModal: React.FC = () => {
  const { isNewFeedbackModalOpen, setIsNewFeedbackModalOpen, addParentFeedback, parentFeedbacks } = useApp();

  const nextWeekNum = (parentFeedbacks[0]?.weekNumber || 4) + 1;
  const [weekName, setWeekName] = useState(`Minggu ${nextWeekNum}`);
  const [engagementRate, setEngagementRate] = useState(90);
  const [parentNote, setParentNote] = useState('');
  const [developmentTarget, setDevelopmentTarget] = useState('');

  const [checklist, setChecklist] = useState([
    { id: 'c1', text: 'Raka menceritakan materi yang dipelajari', checked: true },
    { id: 'c2', text: 'Raka mencoba hal yang dipelajari secara mandiri', checked: true },
    { id: 'c3', text: 'Raka menunjukkan ketertarikan pada topik tertentu', checked: true },
    { id: 'c4', text: 'Raka mengalami kesulitan tertentu', checked: false },
    { id: 'c5', text: 'Ada hal lain yang ingin disampaikan', checked: true }
  ]);

  if (!isNewFeedbackModalOpen) return null;

  const handleToggleCheck = (id: string) => {
    setChecklist(checklist.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addParentFeedback({
      weekName: `${weekName} (${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })})`,
      weekNumber: nextWeekNum,
      engagementRate: Number(engagementRate) || 85,
      checklist,
      parentNote: parentNote || 'Raka sangat bersemangat mempraktekkan apa yang dipelajari.',
      developmentTarget: developmentTarget || 'Mendorong Raka untuk terus bereksplorasi.'
    });

    setIsNewFeedbackModalOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50 animate-in fade-in overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-100 p-4 sm:p-6 text-xs max-h-[92vh] overflow-y-auto my-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
              <Heart className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Feedback &amp; Observasi Orang Tua</h3>
              <p className="text-[11px] text-slate-500">Evaluasi perkembangan Raka di rumah</p>
            </div>
          </div>
          <button
            onClick={() => setIsNewFeedbackModalOpen(false)}
            className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 shrink-0"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Periode Minggu</label>
              <input
                type="text"
                value={weekName}
                onChange={(e) => setWeekName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 min-h-[42px]"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Home Learning Engagement (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={engagementRate}
                onChange={(e) => setEngagementRate(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 min-h-[42px]"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-2">Checklist Observasi di Rumah</label>
            <div className="space-y-1.5">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleToggleCheck(item.id)}
                  className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer min-h-[44px]"
                >
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => {}}
                    className="w-4 h-4 rounded text-rose-600 shrink-0"
                  />
                  <span className={item.checked ? 'text-slate-800 font-medium' : 'text-slate-500'}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Catatan Orang Tua</label>
            <textarea
              rows={3}
              required
              placeholder="Ceritakan apa saja yang dilakukan Raka di rumah..."
              value={parentNote}
              onChange={(e) => setParentNote(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 resize-none text-xs"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Hal yang Ingin Dikembangkan</label>
            <textarea
              rows={2}
              placeholder="Hal apa yang orang tua harapkan ditingkatkan pada sesi berikutnya..."
              value={developmentTarget}
              onChange={(e) => setDevelopmentTarget(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 resize-none text-xs"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsNewFeedbackModalOpen(false)}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl min-h-[42px]"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl shadow-xs min-h-[42px]"
            >
              Kirim Feedback
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
