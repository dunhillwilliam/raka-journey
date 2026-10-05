import React, { useState } from 'react';
import { X, Lightbulb } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const NewCuriosityModal: React.FC = () => {
  const { isNewCuriosityModalOpen, setIsNewCuriosityModalOpen, addCuriosityItem } = useApp();

  const [question, setQuestion] = useState('');
  const [topic, setTopic] = useState('');
  const [level, setLevel] = useState<'Tinggi' | 'Sedang' | 'Rendah'>('Sedang');

  if (!isNewCuriosityModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    await addCuriosityItem({
      question: question.trim(),
      topic,
      level,
      status: 'Baru'
    });

    setQuestion('');
    setIsNewCuriosityModalOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-4 z-50 animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 p-4 sm:p-4 text-xs my-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
              <Lightbulb className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Tambah Pertanyaan Baru</h3>
              <p className="text-[11px] text-slate-500">Catat ide dan rasa penasaran Raka</p>
            </div>
          </div>
          <button
            onClick={() => setIsNewCuriosityModalOpen(false)}
            className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 shrink-0"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Pertanyaan / Topik Rasa Ingin Tahu</label>
            <textarea
              rows={3}
              required
              placeholder="Misal: Kenapa musik di film bisa membuat tegang?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Kategori Minat</label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 min-h-[42px]"
              >
                <option value="Visual Storytelling">Visual Storytelling</option>
                <option value="Video Editing">Video Editing</option>
                <option value="Desain Visual">Desain Visual</option>
                <option value="Technology">Technology</option>
                <option value="Problem Solving">Problem Solving</option>
                <option value="General Knowledge">General Knowledge</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Tingkat Penasaran</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 min-h-[42px]"
              >
                <option value="Tinggi">Tinggi</option>
                <option value="Sedang">Sedang</option>
                <option value="Rendah">Rendah</option>
              </select>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsNewCuriosityModalOpen(false)}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl min-h-[42px]"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl shadow-xs min-h-[42px]"
            >
              Simpan Pertanyaan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
