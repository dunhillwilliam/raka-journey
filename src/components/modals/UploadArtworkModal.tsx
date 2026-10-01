import React, { useState } from 'react';
import { X, Upload, Palette } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Artwork } from '../../types';

export const UploadArtworkModal: React.FC = () => {
  const { isUploadModalOpen, setIsUploadModalOpen, uploadArtwork, cloudConfig } = useApp();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Artwork['category']>('Video');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadPercent, setUploadPercent] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isUploadModalOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setErrorMessage('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !selectedFile) {
      setErrorMessage('Silakan lengkapi judul karya dan pilih file yang ingin diunggah.');
      return;
    }

    setErrorMessage('');
    setIsUploading(true);
    setUploadPercent(10);

    const result = await uploadArtwork(selectedFile, title.trim(), category, description.trim());
    setIsUploading(false);

    if (result.success) {
      setIsUploadModalOpen(false);
      setTitle('');
      setSelectedFile(null);
      setDescription('');
    } else {
      setErrorMessage(`Gagal upload: ${result.error}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50 animate-in fade-in overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-100 p-4 sm:p-6 text-xs max-h-[92vh] overflow-y-auto my-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Palette className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-slate-900 truncate">Upload Karya ke Cloudflare R2</h3>
              <p className="text-[10px] sm:text-[11px] text-slate-500 truncate">
                Bucket: <span className="font-mono text-slate-700">{cloudConfig.cfBucketName || 'raka-learning-assets'}</span> · Database: <span className="text-emerald-600">Supabase</span>
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsUploadModalOpen(false)}
            className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 shrink-0"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMessage && (
          <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-medium text-xs">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Judul Karya / Proyek</label>
            <input
              type="text"
              required
              placeholder="Contoh: My Weekend Story - Final Cut"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[42px]"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Kategori Karya</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[42px]"
            >
              <option value="Video">Video</option>
              <option value="Desain">Desain</option>
              <option value="Presentasi">Presentasi</option>
              <option value="Proyek">Proyek</option>
              <option value="Riset">Riset</option>
            </select>
          </div>

          {/* File Picker / Dropzone */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Pilih File</label>
            <label className="border-2 border-dashed border-slate-300 hover:border-indigo-400 rounded-xl p-4 sm:p-5 flex flex-col items-center justify-center cursor-pointer bg-slate-50 hover:bg-indigo-50/20 transition-all text-center min-h-[110px]">
              <Upload className="w-6 h-6 text-slate-400 mb-1.5" />
              {selectedFile ? (
                <div>
                  <span className="font-semibold text-slate-800 block truncate max-w-xs">{selectedFile.name}</span>
                  <span className="text-[10px] text-slate-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</span>
                </div>
              ) : (
                <div>
                  <span className="font-medium text-slate-700 block">Klik untuk memilih file</span>
                  <span className="text-[10px] text-slate-400">MP4, PNG, JPG, PDF, ZIP (Maks 50MB)</span>
                </div>
              )}
              <input
                type="file"
                className="hidden"
                accept="video/*,image/*,application/pdf,.zip"
                onChange={handleFileChange}
              />
            </label>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Deskripsi &amp; Cerita di Balik Karya</label>
            <textarea
              rows={2}
              placeholder="Catatan mengenai proses pembuatan atau apa yang dipelajari Raka saat membuat ini..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none text-xs"
            />
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-mono text-slate-600">
                <span>Mengunggah ke Cloudflare R2 &amp; sinkron ke Supabase...</span>
                <span>{uploadPercent}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 transition-all duration-300"
                  style={{ width: `${uploadPercent}%` }}
                />
              </div>
            </div>
          )}

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              disabled={isUploading}
              onClick={() => setIsUploadModalOpen(false)}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl min-h-[42px]"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isUploading || !selectedFile}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold rounded-xl shadow-xs flex items-center gap-1.5 min-h-[42px]"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{isUploading ? 'Menyimpan...' : 'Upload Karya'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
