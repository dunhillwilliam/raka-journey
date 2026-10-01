import React, { useState } from 'react';
import {
  Plus,
  HelpCircle,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CuriosityView: React.FC = () => {
  const { curiosityItems, setIsNewCuriosityModalOpen } = useApp();
  const [selectedTopic, setSelectedTopic] = useState<string>('all');

  // Compute topic frequencies dynamically from actual data
  const topicCounts: Record<string, number> = {};
  curiosityItems.forEach(item => {
    topicCounts[item.topic] = (topicCounts[item.topic] || 0) + 1;
  });

  const topicStats = Object.entries(topicCounts).map(([topic, count]) => ({
    topic,
    count
  }));

  const maxCount = Math.max(1, ...topicStats.map(t => t.count));

  const filteredItems = selectedTopic === 'all'
    ? curiosityItems
    : curiosityItems.filter(item => item.topic.toLowerCase() === selectedTopic.toLowerCase());

  return (
    <div className="space-y-5 sm:space-y-6 max-w-7xl mx-auto pb-10">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-3 sm:pb-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">Curiosity Corner</h2>
          <p className="text-[11px] sm:text-xs text-slate-500">
            Pertanyaan dan rasa penasaran Raka yang tersimpan langsung di Supabase ({curiosityItems.length} pertanyaan)
          </p>
        </div>

        <button
          onClick={() => setIsNewCuriosityModalOpen(true)}
          className="self-start sm:self-auto min-h-[40px] flex items-center gap-1.5 px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Tambah Pertanyaan</span>
        </button>
      </div>

      {curiosityItems.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-8 sm:p-12 text-center max-w-lg mx-auto my-8">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3">
            <HelpCircle className="w-6 h-6" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1">Curiosity Corner Kosong</h3>
          <p className="text-xs text-slate-500 mb-4 leading-relaxed">
            Rasa ingin tahu adalah awal dari segala pembelajaran. Catat pertanyaan atau hal yang membuat Raka penasaran hari ini.
          </p>
          <button
            onClick={() => setIsNewCuriosityModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>+ Ajukan Pertanyaan Pertama</span>
          </button>
        </div>
      ) : (
        <>
          {/* Topik Curiosity Visual Bar Chart */}
          {topicStats.length > 0 && (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-4">
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900">Distribusi Topik Minat</h3>
                  <p className="text-[10px] sm:text-[11px] text-slate-500">Klik bar untuk memfilter daftar pertanyaan di bawah</p>
                </div>
                <span className="text-[10px] sm:text-[11px] font-mono text-slate-400">
                  Total: {curiosityItems.length} Pertanyaan
                </span>
              </div>

              <div className="flex items-end justify-around gap-2 h-36 pt-2 border-b border-slate-100 pb-2">
                {topicStats.map(stat => {
                  const heightPercent = Math.round((stat.count / maxCount) * 100);
                  const isSelected = selectedTopic === stat.topic;

                  return (
                    <button
                      key={stat.topic}
                      onClick={() => setSelectedTopic(isSelected ? 'all' : stat.topic)}
                      className="flex flex-col items-center gap-2 h-full justify-end group flex-1 max-w-[80px]"
                    >
                      <span className="text-[10px] font-mono font-bold text-slate-600 group-hover:text-amber-600">
                        {stat.count}
                      </span>
                      <div
                        className={`w-full rounded-t-lg transition-all ${
                          isSelected ? 'bg-amber-500' : 'bg-amber-100 group-hover:bg-amber-300'
                        }`}
                        style={{ height: `${Math.max(15, heightPercent)}%` }}
                      />
                      <span className="text-[9px] sm:text-[10px] font-medium text-slate-600 truncate max-w-full">
                        {stat.topic}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* List of Questions */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                Daftar Pertanyaan {selectedTopic !== 'all' && `(${selectedTopic})`}
              </h3>
              {selectedTopic !== 'all' && (
                <button
                  onClick={() => setSelectedTopic('all')}
                  className="text-xs text-amber-600 hover:underline"
                >
                  Tampilkan Semua
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {filteredItems.map(item => (
                <div
                  key={item.id}
                  className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-800">
                        {item.topic}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                        item.status === 'Dibahas' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {item.status}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-relaxed mb-3">
                      &ldquo;{item.question}&rdquo;
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] sm:text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {item.formattedDate || item.date}
                    </span>
                    {item.answeredInSession && (
                      <span className="text-indigo-600 font-medium">
                        Dibahas di Sesi {item.answeredInSession}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
