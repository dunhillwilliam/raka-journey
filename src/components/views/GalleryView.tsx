import React, { useState } from 'react';
import {
  Upload,
  Plus,
  ExternalLink,
  X,
  Download
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Artwork } from '../../types';
import { ArtworkThumbnail } from '../illustrations/ArtAssets';

export const GalleryView: React.FC = () => {
  const { artworks, setIsUploadModalOpen } = useApp();
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('Semua');
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);

  const categories = ['Semua', 'Video', 'Presentasi', 'Desain', 'Proyek'];

  const filteredArtworks = activeCategoryFilter === 'Semua'
    ? artworks
    : artworks.filter(art => {
        if (activeCategoryFilter === 'Proyek') {
          return art.category === 'Proyek' || art.category === 'Riset';
        }
        return art.category.toLowerCase() === activeCategoryFilter.toLowerCase();
      });

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-3 sm:pb-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">Galeri Karya (Cloudflare R2)</h2>
          <p className="text-[11px] sm:text-xs text-slate-500">
            Dokumentasi hasil karya digital dan artefak belajar Raka ({artworks.length} karya tersimpan)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsUploadModalOpen(true)}
            className="min-h-[40px] flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-xs"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>+ Upload Karya ke R2</span>
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="overflow-x-auto pb-1 -mx-1 px-1 no-scrollbar">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-fit">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategoryFilter(cat)}
              className={`px-3 sm:px-3.5 py-1.5 min-h-[36px] text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                activeCategoryFilter === cat
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Artworks Grid */}
      {artworks.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-8 sm:p-12 text-center max-w-lg mx-auto my-6">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
            <Upload className="w-6 h-6" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1">Galeri Karya Masih Kosong</h3>
          <p className="text-xs text-slate-500 mb-4 leading-relaxed">
            Belum ada karya yang diunggah ke Cloudflare R2. Unggah video, presentasi, atau proyek digital belajar Raka.
          </p>
          <button
            type="button"
            onClick={() => setIsUploadModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>+ Upload Karya Pertama</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredArtworks.map((art) => (
            <div
              key={art.id}
              onClick={() => setSelectedArtwork(art)}
              className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden p-3.5 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <ArtworkThumbnail
                  artworkId={art.id}
                  category={art.category}
                  className="w-full h-36 sm:h-40 mb-3"
                />

                <div className="flex items-center justify-between gap-2 mt-1">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                    {art.title}
                  </h3>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 shrink-0">
                    {art.category}
                  </span>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>{art.formattedDate || art.date}</span>
                <span className="text-indigo-600 font-medium group-hover:underline flex items-center gap-1">
                  Lihat Detail <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}

          {/* "+ Upload Karya Baru" Card */}
          <div
            onClick={() => setIsUploadModalOpen(true)}
            className="border-2 border-dashed border-slate-300 hover:border-indigo-400 bg-slate-50/50 hover:bg-indigo-50/30 rounded-2xl p-5 sm:p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all min-h-[190px] sm:min-h-[220px]"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2.5 sm:mb-3">
              <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900">Upload Karya Baru</h4>
            <p className="text-[10px] sm:text-[11px] text-slate-500 mt-1 max-w-[200px]">
              Video, gambar, atau dokumen tersimpan di Cloudflare R2
            </p>
          </div>
        </div>
      )}

      {/* Selected Artwork Preview Modal */}
      {selectedArtwork && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50 animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-100 my-auto">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="min-w-0 pr-2">
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate">{selectedArtwork.title}</h3>
                <span className="text-[10px] text-slate-500">{selectedArtwork.category} · {selectedArtwork.formattedDate || selectedArtwork.date}</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedArtwork(null)}
                className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Media Canvas */}
            <div className="p-3 sm:p-4 bg-slate-950 flex items-center justify-center">
              <ArtworkThumbnail
                artworkId={selectedArtwork.id}
                category={selectedArtwork.category}
                className="w-full h-44 sm:h-56"
              />
            </div>

            {/* Modal Body & Storage Metadata */}
            <div className="p-4 sm:p-5 space-y-3">
              <p className="text-xs text-slate-700 leading-relaxed">
                {selectedArtwork.description}
              </p>

              {/* R2 Storage Metadata */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1 text-[11px] font-mono text-slate-600">
                <div className="flex justify-between">
                  <span>Storage:</span>
                  <span className="font-semibold text-sky-700">Cloudflare R2 Bucket</span>
                </div>
                {selectedArtwork.r2Bucket && (
                  <div className="flex justify-between">
                    <span>Bucket:</span>
                    <span className="font-semibold text-slate-800">{selectedArtwork.r2Bucket}</span>
                  </div>
                )}
                {selectedArtwork.r2Key && (
                  <div className="flex justify-between truncate">
                    <span>Key:</span>
                    <span className="font-semibold text-slate-800 truncate max-w-[200px]">{selectedArtwork.r2Key}</span>
                  </div>
                )}
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedArtwork(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 min-h-[40px]"
                >
                  Tutup
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (selectedArtwork.fileUrl && selectedArtwork.fileUrl.startsWith('http')) {
                      window.open(selectedArtwork.fileUrl, '_blank');
                    } else {
                      const blob = new Blob([`Artefak Raka: ${selectedArtwork.title}\nKategori: ${selectedArtwork.category}\nDeskripsi: ${selectedArtwork.description}`], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `${selectedArtwork.title.toLowerCase().replace(/\s+/g, '-')}.txt`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs min-h-[40px]"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download File R2</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
