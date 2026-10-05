import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Plus,
  Upload,
  Lightbulb,
  Palette,
  CheckCircle,
} from 'lucide-react';
import {
  CuriosityItem,
  Artwork,
} from '../types';
import {
  getCuriosityList,
  saveCuriosityToDb,
  getArtworksList,
  saveArtworkToDb,
} from '../lib/supabase';
import {
  uploadFileToR2,
} from '../lib/cloudflareR2';

const RakaPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'curiosity' | 'upload'>('curiosity');
  const [curiosityItems, setCuriosityItems] = useState<CuriosityItem[]>([]);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);

  const [question, setQuestion] = useState('');
  const [topic, setTopic] = useState('Visual Storytelling');
  const [level, setLevel] = useState<'Tinggi' | 'Sedang' | 'Rendah'>('Sedang');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadCategory, setUploadCategory] = useState<Artwork['category'] | ''>('');
  const [uploadDesc, setUploadDesc] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadPercent, setUploadPercent] = useState(0);
  const [uploadError, setUploadError] = useState('');
  const [uploadDone, setUploadDone] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [c, a] = await Promise.all([getCuriosityList(), getArtworksList()]);
        setCuriosityItems(c);
        setArtworks(a);
      } catch (e) {
        console.error('Raka page load error:', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleAddCuriosity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    setSubmitting(true);

    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    const formatted = today.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

    const newItem: CuriosityItem = {
      id: `curiosity-${Date.now()}`,
      question: question.trim(),
      topic,
      level,
      status: 'Baru',
      date: dateStr,
      formattedDate: formatted,
    };

    try {
      await saveCuriosityToDb(newItem);
      setCuriosityItems(prev => [newItem, ...prev]);
      setQuestion('');
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 2000);
    } catch (err) {
      console.error('Failed to save curiosity:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUploadArtwork = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim() || !uploadFile || !uploadCategory) {
      setUploadError('Lengkapi judul, kategori, dan file.');
      return;
    }

    setUploadError('');
    setIsUploading(true);
    setUploadPercent(10);

    try {
      const uploadRes = await uploadFileToR2(uploadFile, uploadCategory, (p) => setUploadPercent(p));
      if (!uploadRes.success) {
        setUploadError(uploadRes.error || 'Upload gagal');
        setIsUploading(false);
        return;
      }

      const today = new Date();
      const dateStr = today.toISOString().split('T')[0];
      const formatted = today.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

      const newArt: Artwork = {
        id: `art-${Date.now()}`,
        title: uploadTitle.trim(),
        category: uploadCategory,
        date: dateStr,
        formattedDate: formatted,
        duration: uploadCategory === 'Video' ? '01:00' : undefined,
        thumbnailUrl: uploadRes.fileUrl,
        fileUrl: uploadRes.fileUrl,
        fileSize: uploadRes.fileSizeFormatted,
        storageProvider: 'cloudflare_r2',
        r2Bucket: uploadRes.bucket,
        r2Key: uploadRes.storageKey,
        description: uploadDesc.trim() || `Karya ${uploadCategory} Raka.`,
      };

      await saveArtworkToDb(newArt);
      setArtworks(prev => [newArt, ...prev]);
      setUploadTitle('');
      setUploadCategory('');
      setUploadDesc('');
      setUploadFile(null);
      setUploadDone(true);
      setTimeout(() => setUploadDone(false), 2000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setUploadError(msg);
    } finally {
      setIsUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-emerald-50 to-sky-50">
        <div className="animate-pulse text-slate-400 text-sm">Memuat...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-sky-50 to-white text-slate-800 antialiased font-sans">
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200/80 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-sm">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900">Ruang Raka</h1>
            <p className="text-[10px] text-slate-500">Eksplorasi & Karya</p>
          </div>
        </div>
        <span className="text-[10px] font-semibold px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
          Raka
        </span>
      </header>

      <nav className="bg-white/80 backdrop-blur-sm border-b border-slate-200/80 px-3 py-2">
        <div className="flex items-center gap-2 max-w-2xl mx-auto">
          <button
            onClick={() => setActiveTab('curiosity')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all min-h-[38px] ${
              activeTab === 'curiosity'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-emerald-50'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Curiosity</span>
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all min-h-[38px] ${
              activeTab === 'upload'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-emerald-50'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Karya</span>
          </button>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto p-4 pb-16">
        {activeTab === 'curiosity' && (
          <div className="space-y-5">
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Ada yang Penasaran?</h2>
                  <p className="text-[11px] text-slate-500">Tulis pertanyaan atau ide yang ingin kamu tahu</p>
                </div>
              </div>

              <form onSubmit={handleAddCuriosity} className="space-y-3">
                <textarea
                  rows={3}
                  required
                  placeholder="Misal: Kenapa langit berwarna biru?"
                  value={question}
                  onChange={e => setQuestion(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none text-xs"
                />
                <div className="grid grid-cols-2 gap-3">
                  <select
                    value={topic}
                    onChange={e => setTopic(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs min-h-[42px]"
                  >
                    <option value="Visual Storytelling">Visual Storytelling</option>
                    <option value="Video Editing">Video Editing</option>
                    <option value="Desain Visual">Desain Visual</option>
                    <option value="Technology">Technology</option>
                    <option value="Problem Solving">Problem Solving</option>
                    <option value="General Knowledge">General Knowledge</option>
                  </select>
                  <select
                    value={level}
                    onChange={e => setLevel(e.target.value as any)}
                    className="px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs min-h-[42px]"
                  >
                    <option value="" disabled>Pilih tingkat...</option>
                    <option value="Tinggi">Tinggi</option>
                    <option value="Sedang">Sedang</option>
                    <option value="Rendah">Rendah</option>
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={submitting || !question.trim()}
                  className="w-full min-h-[44px] flex items-center justify-center gap-1.5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
                >
                  {submitting ? 'Menyimpan...' : submitSuccess ? 'Tersimpan!' : <><Plus className="w-3.5 h-3.5" /> Kirim Pertanyaan</>}
                </button>
              </form>
            </div>

            {curiosityItems.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-slate-900 mb-3">Pertanyaanku ({curiosityItems.length})</h3>
                <div className="space-y-2">
                  {curiosityItems.map(item => (
                    <div key={item.id} className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-800">{item.topic}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                          item.status === 'Dibahas' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                        }`}>{item.status}</span>
                      </div>
                      <p className="text-xs font-semibold text-slate-900">&ldquo;{item.question}&rdquo;</p>
                      <p className="text-[10px] text-slate-400 mt-1">{item.formattedDate || item.date}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'upload' && (
          <div className="space-y-5">
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Palette className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Upload Karyamu</h2>
                  <p className="text-[11px] text-slate-500">Bagikan hasil karyamu ke Cloudflare R2</p>
                </div>
              </div>

              {uploadDone && (
                <div className="mb-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Karya berhasil diunggah!
                </div>
              )}

              {uploadError && (
                <div className="mb-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">{uploadError}</div>
              )}

              <form onSubmit={handleUploadArtwork} className="space-y-3">
                <input
                  type="text"
                  required
                  placeholder="Judul karyamu"
                  value={uploadTitle}
                  onChange={e => setUploadTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs min-h-[42px]"
                />
                <select
                  value={uploadCategory}
                  onChange={e => setUploadCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs min-h-[42px]"
                >
                  <option value="" disabled>Pilih kategori...</option>
                  <option value="Video">Video</option>
                  <option value="Desain">Desain</option>
                  <option value="Presentasi">Presentasi</option>
                  <option value="Proyek">Proyek</option>
                  <option value="Riset">Riset</option>
                </select>

                <label className="border-2 border-dashed border-slate-300 hover:border-indigo-400 rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer bg-slate-50 hover:bg-indigo-50/20 transition-all text-center min-h-[100px]">
                  <Upload className="w-6 h-6 text-slate-400 mb-1" />
                  {uploadFile ? (
                    <div>
                      <span className="font-semibold text-slate-800 block text-xs">{uploadFile.name}</span>
                      <span className="text-[10px] text-slate-500">{(uploadFile.size / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                  ) : (
                    <div>
                      <span className="font-medium text-slate-700 text-xs block">Klik untuk pilih file</span>
                      <span className="text-[10px] text-slate-400">Video, Gambar, PDF, ZIP</span>
                    </div>
                  )}
                  <input type="file" className="hidden" accept="video/*,image/*,application/pdf,.zip" onChange={e => { if (e.target.files?.[0]) setUploadFile(e.target.files[0]); }} />
                </label>

                <textarea
                  rows={2}
                  placeholder="Cerita tentang karyamu..."
                  value={uploadDesc}
                  onChange={e => setUploadDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none text-xs"
                />

                {isUploading && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-mono text-slate-600">
                      <span>Mengunggah...</span>
                      <span>{uploadPercent}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${uploadPercent}%` }} />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isUploading || !uploadFile || !uploadCategory || !uploadTitle.trim()}
                  className="w-full min-h-[44px] flex items-center justify-center gap-1.5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isUploading ? 'Mengunggah...' : 'Upload Karya'}</span>
                </button>
              </form>
            </div>

            {artworks.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-slate-900 mb-3">Karyaku ({artworks.length})</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {artworks.map(art => (
                    <div key={art.id} className="bg-white border border-slate-200/80 rounded-xl p-3 shadow-xs">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h4 className="text-xs font-bold text-slate-900 truncate">{art.title}</h4>
                        <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 shrink-0">{art.category}</span>
                      </div>
                      <p className="text-[10px] text-slate-400">{art.formattedDate || art.date}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default RakaPage;