import React, { useState } from 'react';
import { X, Plus, Trash2, CheckCircle, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const NewSessionModal: React.FC = () => {
  const { isNewSessionModalOpen, setIsNewSessionModalOpen, addSession, sessions, setActiveTab } = useApp();

  const nextSessionNum = (sessions[0]?.sessionNumber || 0) + 1;
  const todayStr = new Date().toISOString().split('T')[0];

  const [sessionTitle, setSessionTitle] = useState('');
  const [sessionDate, setSessionDate] = useState(todayStr);
  const [duration, setDuration] = useState<number>(0);
  const [format, setFormat] = useState<'Online' | 'Offline' | 'Hybrid'>('Online');
  const [mentorName, setMentorName] = useState('');

  // Topics learned
  const [topics, setTopics] = useState<string[]>([]);
  const [newTopicInput, setNewTopicInput] = useState('');

  // Curiosity
  const [curiosityQuestion, setCuriosityQuestion] = useState('');
  const [curiosityCategory, setCuriosityCategory] = useState('');
  const [curiosityLevel, setCuriosityLevel] = useState<'Tinggi' | 'Sedang' | 'Rendah'>('Sedang');

  // Mentor Observation
  const [mentorNotes, setMentorNotes] = useState('');
  const [strengths, setStrengths] = useState<string[]>([]);
  const [newStrengthInput, setNewStrengthInput] = useState('');
  const [developments, setDevelopments] = useState<string[]>([]);
  const [newDevInput, setNewDevInput] = useState('');

  // Activities
  const [tasks, setTasks] = useState<string[]>([]);
  const [newTaskInput, setNewTaskInput] = useState('');

  // Parent Feedback
  const [parentQuote, setParentQuote] = useState('');

  // Next Session Plan
  const [plans, setPlans] = useState<string[]>([]);
  const [newPlanInput, setNewPlanInput] = useState('');
  const [formError, setFormError] = useState('');

  if (!isNewSessionModalOpen) return null;

  const handleAddTopic = () => {
    if (newTopicInput.trim()) {
      setTopics([...topics, newTopicInput.trim()]);
      setNewTopicInput('');
    }
  };

  const handleAddStrength = () => {
    if (newStrengthInput.trim()) {
      setStrengths([...strengths, newStrengthInput.trim()]);
      setNewStrengthInput('');
    }
  };

  const handleAddDev = () => {
    if (newDevInput.trim()) {
      setDevelopments([...developments, newDevInput.trim()]);
      setNewDevInput('');
    }
  };

  const handleAddTask = () => {
    if (newTaskInput.trim()) {
      setTasks([...tasks, newTaskInput.trim()]);
      setNewTaskInput('');
    }
  };

  const handleAddPlan = () => {
    if (newPlanInput.trim()) {
      setPlans([...plans, newPlanInput.trim()]);
      setNewPlanInput('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionTitle.trim()) {
      setFormError('Silakan masukkan judul sesi pembelajaran.');
      return;
    }

    setFormError('');
    const dateObj = new Date(sessionDate);
    const formattedDate = dateObj.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    await addSession({
      sessionNumber: nextSessionNum,
      date: sessionDate,
      formattedDate,
      title: sessionTitle,
      durationMinutes: Number(duration),
      format,
      mentorName,
      topicsLearned: topics.map((t, idx) => ({ id: `t-${idx}`, text: t, completed: true })),
      curiosity: {
        question: curiosityQuestion,
        category: curiosityCategory,
        level: curiosityLevel
      },
      mentorObservation: {
        notes: mentorNotes,
        strengths,
        areasForDevelopment: developments
      },
      activities: {
        tasks: tasks.map((t, idx) => ({ id: `act-${idx}`, text: t, completed: true }))
      },
      parentFeedback: {
        quote: parentQuote,
        parentName: '',
        date: formattedDate
      },
      nextSessionPlan: plans
    });

    setIsNewSessionModalOpen(false);
    setActiveTab('daily-report');
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-4 z-50 animate-in fade-in overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full my-auto shadow-2xl border border-slate-100 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-4 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="min-w-0 pr-2">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate">Mulai Sesi Baru &middot; Daily Report</h3>
            <p className="text-[10px] sm:text-xs text-slate-500 truncate">
              Dokumentasikan sesi ke-{nextSessionNum} (Tersimpan ke Supabase)
            </p>
          </div>
          <button
            onClick={() => setIsNewSessionModalOpen(false)}
            className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 shrink-0"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-4 overflow-y-auto space-y-4 sm:space-y-6 flex-1 text-xs">
          {formError && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-medium text-xs">
              {formError}
            </div>
          )}
          {/* Sesi Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-slate-700 font-semibold mb-1">Judul Materi Sesi</label>
              <input
                type="text"
                required
                placeholder="Contoh: Audio Mixing & Sound Effects"
                value={sessionTitle}
                onChange={(e) => setSessionTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Tanggal Sesi</label>
              <input
                type="date"
                required
                value={sessionDate}
                onChange={(e) => setSessionDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Durasi (Menit)</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Format Pembelajaran</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Mentor</label>
              <input
                type="text"
                value={mentorName}
                onChange={(e) => setMentorName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Section 1: Topics Learned */}
          <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-200/80 space-y-3">
            <span className="font-bold text-slate-900 block">1. Apa yang Dipelajari Hari Ini?</span>
            <div className="space-y-1.5">
              {topics.map((t, idx) => (
                <div key={idx} className="flex items-center justify-between bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                  <span>{t}</span>
                  <button
                    type="button"
                    onClick={() => setTopics(topics.filter((_, i) => i !== idx))}
                    className="text-slate-400 hover:text-rose-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Tambah poin materi yang dipelajari..."
                value={newTopicInput}
                onChange={(e) => setNewTopicInput(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTopic();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddTopic}
                className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg font-medium"
              >
                Tambah
              </button>
            </div>
          </div>

          {/* Section 2: Curiosity */}
          <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-200/70 space-y-3">
            <span className="font-bold text-amber-950 block">2. Apa yang Membuat Raka Penasaran?</span>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Pertanyaan Raka</label>
              <input
                type="text"
                placeholder="Contoh: Kenapa kalau angle berbeda kesannya bisa berubah?"
                value={curiosityQuestion}
                onChange={(e) => setCuriosityQuestion(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Kategori Topik</label>
                <input
                  type="text"
                  value={curiosityCategory}
                  onChange={(e) => setCuriosityCategory(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Level Curiosity</label>
                <select
                  value={curiosityLevel}
                  onChange={(e) => setCuriosityLevel(e.target.value as any)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
                >
                  <option value="Tinggi">Tinggi</option>
                  <option value="Sedang">Sedang</option>
                  <option value="Rendah">Rendah</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Observasi Mentor */}
          <div className="p-4 bg-sky-50/50 rounded-xl border border-sky-200/70 space-y-3">
            <span className="font-bold text-sky-950 block">3. Observasi Mentor</span>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Catatan Evaluasi / Refleksi Mentor</label>
              <textarea
                rows={3}
                placeholder="Catatan umum mengenai respon Raka selama sesi..."
                value={mentorNotes}
                onChange={(e) => setMentorNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white resize-none"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Strength */}
              <div>
                <label className="block text-emerald-800 font-bold mb-1">Kekuatan (Strengths)</label>
                <div className="space-y-1 mb-2">
                  {strengths.map((str, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-white px-2.5 py-1 rounded border border-emerald-200 text-[11px]">
                      <span>{str}</span>
                      <button type="button" onClick={() => setStrengths(strengths.filter((_, i) => i !== idx))}>
                        <Trash2 className="w-3 h-3 text-slate-400" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    placeholder="Tambah kekuatan..."
                    value={newStrengthInput}
                    onChange={(e) => setNewStrengthInput(e.target.value)}
                    className="flex-1 px-2.5 py-1 rounded border border-slate-200 bg-white text-xs"
                  />
                  <button type="button" onClick={handleAddStrength} className="px-2.5 py-1 bg-emerald-600 text-white rounded">
                    +
                  </button>
                </div>
              </div>

              {/* Area for development */}
              <div>
                <label className="block text-amber-800 font-bold mb-1">Area yang Perlu Dikembangkan</label>
                <div className="space-y-1 mb-2">
                  {developments.map((dev, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-white px-2.5 py-1 rounded border border-amber-200 text-[11px]">
                      <span>{dev}</span>
                      <button type="button" onClick={() => setDevelopments(developments.filter((_, i) => i !== idx))}>
                        <Trash2 className="w-3 h-3 text-slate-400" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    placeholder="Tambah area pengembangan..."
                    value={newDevInput}
                    onChange={(e) => setNewDevInput(e.target.value)}
                    className="flex-1 px-2.5 py-1 rounded border border-slate-200 bg-white text-xs"
                  />
                  <button type="button" onClick={handleAddDev} className="px-2.5 py-1 bg-amber-600 text-white rounded">
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Section 6: Next Session Plan */}
          <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200/70 space-y-3">
            <span className="font-bold text-emerald-950 block">6. Rencana Sesi Berikutnya</span>
            <div className="space-y-1.5">
              {plans.map((p, idx) => (
                <div key={idx} className="flex items-center justify-between bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                  <span>{p}</span>
                  <button
                    type="button"
                    onClick={() => setPlans(plans.filter((_, i) => i !== idx))}
                    className="text-slate-400 hover:text-rose-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Rencana sesi berikutnya..."
                value={newPlanInput}
                onChange={(e) => setNewPlanInput(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
              />
              <button
                type="button"
                onClick={handleAddPlan}
                className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg font-medium"
              >
                Tambah
              </button>
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsNewSessionModalOpen(false)}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-xs flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Simpan &amp; Publikasikan Report</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
