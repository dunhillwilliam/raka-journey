import React from 'react';
import { X, Printer, Download, CheckCircle, Clock, Laptop } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RakaAvatar } from '../illustrations/ArtAssets';

export const PdfPreviewModal: React.FC = () => {
  const { isPdfPreviewOpen, setIsPdfPreviewOpen, currentSession } = useApp();

  if (!isPdfPreviewOpen || !currentSession) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-100 flex flex-col max-h-[92vh] my-6">
        {/* Modal Toolbar (Non-printable) */}
        <div className="p-4 sm:p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 rounded-t-2xl shrink-0 print:hidden">
          <div className="min-w-0 pr-2">
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate">Preview Laporan PDF</h3>
            <p className="text-[10px] sm:text-[11px] text-slate-500 truncate">
              Dokumen siap cetak / simpan sebagai PDF
            </p>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs min-h-[36px]"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cetak / Simpan PDF</span>
              <span className="sm:hidden text-[11px]">Cetak PDF</span>
            </button>
            <button
              onClick={() => setIsPdfPreviewOpen(false)}
              className="min-w-[36px] min-h-[36px] flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200"
              aria-label="Tutup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Document Sheet */}
        <div id="printable-report" className="p-4 sm:p-4 overflow-y-auto space-y-4 sm:space-y-6 text-xs text-slate-800 bg-white">
          {/* Document Header */}
          <div className="border-b-2 border-slate-900 pb-4 sm:pb-5 flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3">
            <div className="flex items-center gap-3 sm:gap-4">
              <RakaAvatar className="w-12 h-12 sm:w-14 sm:h-14 ring-2 ring-slate-100 shrink-0" />
              <div>
                <h1 className="text-base sm:text-xl font-bold text-slate-900">RAKA LEARNING JOURNEY</h1>
                <p className="text-[11px] sm:text-xs text-slate-500 font-medium">Laporan Hasil Sesi Mentoring Personal</p>
                <div className="mt-1 flex flex-wrap items-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] text-slate-600 font-mono">
                  <span>Siswa: Raka (9 th)</span>
                  <span>&bull;</span>
                  <span>Mentor: {currentSession.mentorName}</span>
                </div>
              </div>
            </div>

            <div className="text-left xs:text-right">
              <span className="text-[11px] sm:text-xs font-mono font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 bg-slate-100 rounded text-slate-900">
                SESI KE-{String(currentSession.sessionNumber).padStart(2, '0')}
              </span>
              <p className="text-[10px] sm:text-[11px] text-slate-500 mt-1">{currentSession.formattedDate}</p>
            </div>
          </div>

          {/* Session Overview Box */}
          <div className="bg-slate-50 p-4 sm:p-4 rounded-xl border border-slate-200 space-y-1.5 sm:space-y-2">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
              <h2 className="text-xs sm:text-sm font-bold text-slate-900">{currentSession.title}</h2>
              <span className="text-[10px] sm:text-[11px] text-slate-600 font-medium">
                {currentSession.durationMinutes} Menit &bull; {currentSession.format}
              </span>
            </div>
          </div>

          {/* 1. Apa yang Dipelajari Hari Ini */}
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-xs border-b border-slate-200 pb-1 uppercase tracking-wider">
              1. Apa yang Dipelajari Hari Ini
            </h3>
            <ul className="space-y-1.5 pl-1 sm:pl-2">
              {currentSession.topicsLearned.map((topic) => (
                <li key={topic.id} className="flex items-center gap-2 text-xs text-slate-700">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{topic.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 2. Rasa Penasaran / Curiosity */}
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-xs border-b border-slate-200 pb-1 uppercase tracking-wider">
              2. Rasa Penasaran Raka (Curiosity)
            </h3>
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <p className="font-semibold text-slate-900 italic text-xs">
                &ldquo;{currentSession.curiosity.question}&rdquo;
              </p>
              <p className="text-[10px] text-amber-900 mt-1 font-mono">
                Kategori: {currentSession.curiosity.category} &bull; Level: {currentSession.curiosity.level}
              </p>
            </div>
          </div>

          {/* 3. Observasi Mentor */}
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-xs border-b border-slate-200 pb-1 uppercase tracking-wider">
              3. Observasi Mentor
            </h3>
            <p className="text-slate-700 leading-relaxed italic bg-slate-50 p-4 rounded-lg border border-slate-100 text-xs">
              &ldquo;{currentSession.mentorObservation.notes}&rdquo;
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-2">
              <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                <span className="font-bold text-emerald-900 block text-[10px] uppercase mb-1">Kekuatan (Strengths)</span>
                <ul className="list-disc list-inside text-[11px] text-emerald-800 space-y-0.5">
                  {currentSession.mentorObservation.strengths.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
              <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
                <span className="font-bold text-amber-900 block text-[10px] uppercase mb-1">Area Pengembangan</span>
                <ul className="list-disc list-inside text-[11px] text-amber-800 space-y-0.5">
                  {currentSession.mentorObservation.areasForDevelopment.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* 4. Feedback Orang Tua & Rencana Sesi Berikutnya */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1.5">
              <h3 className="font-bold text-slate-900 text-xs border-b border-slate-200 pb-1 uppercase tracking-wider">
                Feedback Orang Tua
              </h3>
              <p className="text-slate-700 italic bg-slate-50 p-4 rounded-lg border border-slate-100 text-[11px]">
                &ldquo;{currentSession.parentFeedback.quote}&rdquo;
              </p>
            </div>

            <div className="space-y-1.5">
              <h3 className="font-bold text-slate-900 text-xs border-b border-slate-200 pb-1 uppercase tracking-wider">
                Rencana Sesi Berikutnya
              </h3>
              <ul className="list-disc list-inside text-[11px] text-slate-700 space-y-1 bg-slate-50 p-4 rounded-lg border border-slate-100">
                {currentSession.nextSessionPlan.map((plan, i) => (
                  <li key={i}>{plan}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Signatures Footer */}
          <div className="pt-8 border-t border-slate-200 flex justify-between items-end text-center text-xs">
            <div>
              <p className="text-slate-400 text-[10px] mb-8">Disiapkan oleh,</p>
              <p className="font-bold text-slate-900">{currentSession.mentorName}</p>
              <p className="text-[10px] text-slate-500">Mentor Spesialis</p>
            </div>
            <div>
              <p className="text-slate-400 text-[10px] mb-8">Diverifikasi oleh,</p>
              <p className="font-bold text-slate-900">Orang Tua / Wali</p>
              <p className="text-[10px] text-slate-500">Raka</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
