import React, { useState } from 'react';
import {
  Upload,
  Plus,
  ExternalLink,
  X,
  Download,
  FileText,
  Video,
  Image as ImageIcon,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Artwork } from '../../types';
import { ArtworkThumbnail } from '../illustrations/ArtAssets';

function getR2FileUrl(art: Artwork, publicUrl: string): string | null {
  if (art.fileUrl) return art.fileUrl;
  if (art.r2Key && publicUrl) {
    return `${publicUrl.replace(/\/$/, '')}/${art.r2Key}`;
  }
  return null;
}

function MediaPreview({ art, publicUrl }: { art: Artwork; publicUrl: string }) {
  const fileUrl = getR2FileUrl(art, publicUrl);

  if (!fileUrl) {
    return <ArtworkThumbnail artworkId={art.id} category={art.category} className="w-full h-44 sm:h-56" />;
  }

  const isImage = /\.(png|jpg|jpeg|gif|webp|svg|bmp|ico)(\?.*)?$/i.test(fileUrl);
  const isVideo = /\.(mp4|webm|ogg|mov|avi|mkv)(\?.*)?$/i.test(fileUrl) || art.category === 'Video';

  if (isImage) {
    return (
      <img
        src={fileUrl}
        alt={art.title}
        className="w-full h-44 sm:h-56 object-contain bg-slate-950"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none';
          (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
        }}
      />
    );
  }

  if (isVideo) {
    return (
      <video
        src={fileUrl}
        controls
        className="w-full h-44 sm:h-56 object-contain bg-slate-950"
        onError={(e) => {
          (e.target as HTMLVideoElement).style.display = 'none';
          (e.target as HTMLVideoElement).nextElementSibling?.classList.remove('hidden');
        }}
      >
        Browser tidak mendukung video.
      </video>
    );
  }

  if (fileUrl.endsWith('.pdf')) {
    return (
      <div className="w-full h-44 sm:h-56 bg-slate-950 flex flex-col items-center justify-center gap-2">
        <FileText className="w-10 h-10 text-slate-400" />
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 underline"
        >
          Buka PDF
        </a>
      </div>
    );
  }

  return <ArtworkThumbnail artworkId={art.id} category={art.category} className="w-full h-44 sm:h-56" />;
}

export const GalleryView: React.FC = () => {
  const { artworks, setIsUploadModalOpen, cloudConfig } = useApp();
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('Semua');
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);

  const publicUrl = cloudConfig.cfPublicUrl;

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-3 sm:pb-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">Galeri Karya</h2>
          <p className="text-[11px] sm:text-xs text-slate-500">
            Dokumentasi hasil karya digital Raka ({artworks.length} karya tersimpan)
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

      <div className="overflow-x-auto pb-1 -mx-1 px-1 no-scrollbar">
        <div className="flex items-center gap-1 bg-slate-100 p-4 rounded-xl w-fit">
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

      {artworks.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-4 sm:p-4 text-center max-w-lg mx-auto my-6">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
            <Upload className="w-6 h-6" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1">Galeri Karya Masih Kosong</h3>
          <p className="text-xs text-slate-500 mb-4 leading-relaxed">
            Belum ada karya yang diunggah. Unggah video, presentasi, atau proyek digital belajar Raka.
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
          {filteredArtworks.map((art) => {
            const fileUrl = getR2FileUrl(art, publicUrl);
            const isImage = fileUrl && /\.(png|jpg|jpeg|gif|webp|svg)(\?.*)?$/i.test(fileUrl);

            return (
              <div
                key={art.id}
                onClick={() => setSelectedArtwork(art)}
                className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="relative">
                  {isImage ? (
                    <div className="w-full h-36 sm:h-40 bg-slate-100 overflow-hidden">
                      <img
                        src={fileUrl!}
                        alt={art.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <ArtworkThumbnail
                      artworkId={art.id}
                      category={art.category}
                      className="w-full h-36 sm:h-40"
                    />
                  )}

                  <div className="p-4">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                        {art.title}
                      </h3>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 shrink-0">
                        {art.category}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="px-4 pb-3 pt-0 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>{art.formattedDate || art.date}</span>
                  <span className="text-indigo-600 font-medium group-hover:underline flex items-center gap-1">
                    Lihat Detail <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}

          <div
            onClick={() => setIsUploadModalOpen(true)}
            className="border-2 border-dashed border-slate-300 hover:border-indigo-400 bg-slate-50/50 hover:bg-indigo-50/30 rounded-2xl p-4 sm:p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all min-h-[190px] sm:min-h-[220px]"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2.5 sm:mb-3">
              <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900">Upload Karya Baru</h4>
            <p className="text-[10px] sm:text-[11px] text-slate-500 mt-1 max-w-[200px]">
              Video, gambar, atau dokumen hasil belajar
            </p>
          </div>
        </div>
      )}

      {selectedArtwork && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-4 z-50 animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-100 my-auto">
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

            <MediaPreview art={selectedArtwork} publicUrl={publicUrl} />

            <div className="p-4 sm:p-4 space-y-3">
              {selectedArtwork.description && (
                <p className="text-xs text-slate-700 leading-relaxed">
                  {selectedArtwork.description}
                </p>
              )}

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1 text-[11px] font-mono text-slate-600">
                <div className="flex justify-between">
                  <span>Penyimpanan:</span>
                  <span className="font-semibold text-sky-700">Cloudflare R2</span>
                </div>
                {selectedArtwork.fileSize && (
                  <div className="flex justify-between">
                    <span>Ukuran:</span>
                    <span className="font-semibold text-slate-800">{selectedArtwork.fileSize}</span>
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
                    const url = getR2FileUrl(selectedArtwork, publicUrl);
                    if (url) {
                      window.open(url, '_blank');
                    }
                  }}
                  disabled={!getR2FileUrl(selectedArtwork, publicUrl)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-xs font-semibold shadow-xs min-h-[40px]"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Buka File</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};