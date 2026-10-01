import React from 'react';

// Friendly Raka Illustrated Avatar
export function RakaAvatar({ className = 'w-16 h-16' }: { className?: string }) {
  return (
    <div className={`relative rounded-full overflow-hidden shrink-0 shadow-sm border-2 border-white bg-gradient-to-tr from-amber-100 via-sky-100 to-indigo-100 ${className}`}>
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Soft background glow */}
        <circle cx="60" cy="60" r="58" fill="#F0F9FF" />
        <circle cx="85" cy="35" r="25" fill="#FEF3C7" opacity="0.6" />
        
        {/* Neck */}
        <path d="M52 75H68V95H52V75Z" fill="#FBD5B5" />
        <path d="M52 82C56 86 64 86 68 82V95H52V82Z" fill="#F5C096" />
        
        {/* Teal T-Shirt / Hoodie */}
        <path d="M26 120C26 98 42 92 60 92C78 92 94 98 94 120H26Z" fill="#0D9488" />
        <path d="M46 92C48 98 54 104 60 104C66 104 72 98 74 92" stroke="#0F766E" strokeWidth="2.5" />
        <circle cx="60" cy="110" r="4" fill="#14B8A6" />

        {/* Head / Face */}
        <rect x="36" y="32" width="48" height="52" rx="24" fill="#FDE2CD" />
        
        {/* Hair - back layer */}
        <path d="M30 42C30 22 45 14 60 14C75 14 90 22 90 42C90 47 88 56 87 60C85 48 83 40 80 36C75 32 68 34 60 34C52 34 45 32 40 36C37 40 35 48 33 60C32 56 30 47 30 42Z" fill="#451A03" />

        {/* Ears */}
        <circle cx="34" cy="58" r="7" fill="#FBD5B5" />
        <circle cx="86" cy="58" r="7" fill="#FBD5B5" />

        {/* Hair bangs and strands */}
        <path d="M32 40C38 32 50 28 60 28C72 28 85 33 88 44C84 38 78 35 72 36C66 37 63 43 57 41C52 39 49 35 44 36C39 37 35 42 32 40Z" fill="#78350F" />
        <path d="M42 36C45 42 49 46 54 44" stroke="#451A03" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M66 36C68 44 75 46 80 43" stroke="#451A03" strokeWidth="2.5" strokeLinecap="round" />

        {/* Eyebrows */}
        <path d="M42 49C46 47 51 48 53 50" stroke="#451A03" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M67 50C69 48 74 47 78 49" stroke="#451A03" strokeWidth="2.5" strokeLinecap="round" />

        {/* Sparkling Big Eyes */}
        <circle cx="47" cy="57" r="5" fill="#1E293B" />
        <circle cx="73" cy="57" r="5" fill="#1E293B" />
        <circle cx="48.5" cy="55.5" r="2" fill="#FFFFFF" />
        <circle cx="74.5" cy="55.5" r="2" fill="#FFFFFF" />
        <circle cx="46" cy="58" r="1" fill="#FFFFFF" />
        <circle cx="72" cy="58" r="1" fill="#FFFFFF" />

        {/* Cheeks blush */}
        <ellipse cx="40" cy="64" rx="4" ry="2.5" fill="#F43F5E" opacity="0.35" />
        <ellipse cx="80" cy="64" rx="4" ry="2.5" fill="#F43F5E" opacity="0.35" />

        {/* Cute Smile */}
        <path d="M53 66C55 70 65 70 67 66" stroke="#B45309" strokeWidth="2.5" strokeLinecap="round" />
        
        {/* Star highlight */}
        <path d="M96 22L97.5 26L102 27L97.5 28.5L96 33L94.5 28.5L90 27L94.5 26L96 22Z" fill="#F59E0B" />
      </svg>
    </div>
  );
}

// Mentor Kak Sabina Avatar
export function MentorAvatar({ className = 'w-10 h-10' }: { className?: string }) {
  return (
    <div className={`relative rounded-full overflow-hidden shrink-0 shadow-sm border border-sky-200 bg-sky-50 ${className}`}>
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <circle cx="50" cy="50" r="48" fill="#E0F2FE" />
        {/* Hair back */}
        <path d="M26 36C26 18 40 10 50 10C60 10 74 18 74 36C74 54 70 70 68 76C62 72 58 70 50 70C42 70 38 72 32 76C30 70 26 54 26 36Z" fill="#1E293B" />
        {/* Neck */}
        <rect x="44" y="60" width="12" height="18" fill="#FBD5B5" />
        {/* Blouse */}
        <path d="M20 98C20 80 34 76 50 76C66 76 80 80 80 98H20Z" fill="#6366F1" />
        {/* Face */}
        <circle cx="50" cy="46" r="18" fill="#FDE2CD" />
        {/* Hair bangs */}
        <path d="M30 40C36 30 46 26 54 28C62 30 68 36 70 42C64 34 54 32 46 34C38 36 33 42 30 40Z" fill="#0F172A" />
        {/* Glasses */}
        <rect x="36" y="42" width="11" height="8" rx="3" stroke="#475569" strokeWidth="1.5" />
        <rect x="53" y="42" width="11" height="8" rx="3" stroke="#475569" strokeWidth="1.5" />
        <line x1="47" y1="46" x2="53" y2="46" stroke="#475569" strokeWidth="1.5" />
        {/* Eyes */}
        <circle cx="41.5" cy="46" r="1.5" fill="#1E293B" />
        <circle cx="58.5" cy="46" r="1.5" fill="#1E293B" />
        {/* Smile */}
        <path d="M46 54C48 57 52 57 54 54" stroke="#9A3412" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}

// Session 04 Video Editing Activity Illustration (Mockup 02 Section 4)
export function VideoEditingIllustration({ className = 'w-full h-48' }: { className?: string }) {
  return (
    <div className={`relative rounded-xl overflow-hidden bg-slate-900 border border-slate-700 flex flex-col justify-between p-3 select-none ${className}`}>
      {/* Top bar of video player / editing suite */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className="text-[10px] text-slate-400 font-mono ml-2">Project_Weekend_Story.mp4</span>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-medium">1080p · 30fps</span>
      </div>

      {/* Screen preview */}
      <div className="relative my-2 h-24 rounded-lg bg-gradient-to-br from-indigo-950 via-slate-900 to-sky-950 flex items-center justify-center overflow-hidden border border-slate-800">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:12px_12px]" />
        
        {/* Video Canvas Graphic: Sunset Story Scene */}
        <div className="w-40 h-20 rounded bg-gradient-to-t from-amber-600 via-rose-500 to-indigo-900 relative overflow-hidden flex items-center justify-center shadow-md">
          {/* Sun */}
          <div className="w-8 h-8 rounded-full bg-amber-300 shadow-[0_0_15px_#f59e0b] -mb-4" />
          {/* Mountains silhouette */}
          <div className="absolute bottom-0 w-full h-8 flex items-end">
            <div className="w-16 h-7 bg-slate-950/80 -rotate-12 transform origin-bottom-left" />
            <div className="w-20 h-9 bg-slate-950/90 rotate-6 transform origin-bottom-right" />
          </div>
          {/* Floating play badge */}
          <div className="absolute w-8 h-8 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow-lg">
            <svg className="w-4 h-4 translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        <span className="absolute bottom-1 right-2 text-[10px] font-mono text-white/80 bg-black/60 px-1 rounded">01:24</span>
      </div>

      {/* Editing Timeline Tracks */}
      <div className="space-y-1.5 bg-slate-950/80 p-2 rounded border border-slate-800">
        {/* Video track */}
        <div className="flex items-center gap-1 text-[9px] font-mono text-slate-400">
          <span className="w-5 text-indigo-400">V1</span>
          <div className="flex-1 h-3 rounded bg-slate-800 flex gap-1 overflow-hidden p-0.5">
            <div className="w-1/3 bg-indigo-500/80 rounded text-[7px] text-white flex items-center px-1">Intro</div>
            <div className="w-2/5 bg-sky-500/80 rounded text-[7px] text-white flex items-center px-1">Park B-Roll</div>
            <div className="flex-1 bg-violet-500/80 rounded text-[7px] text-white flex items-center px-1">Outro</div>
          </div>
        </div>
        {/* Audio track */}
        <div className="flex items-center gap-1 text-[9px] font-mono text-slate-400">
          <span className="w-5 text-emerald-400">A1</span>
          <div className="flex-1 h-2.5 rounded bg-slate-800 flex items-center px-1">
            <div className="w-full h-1.5 bg-emerald-500/60 rounded flex items-center justify-around">
              <div className="w-0.5 h-1 bg-white" />
              <div className="w-0.5 h-1.5 bg-white" />
              <div className="w-0.5 h-0.5 bg-white" />
              <div className="w-0.5 h-1 bg-white" />
              <div className="w-0.5 h-1.5 bg-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Artwork Item Visual Thumbnails for Galeri Karya
export function ArtworkThumbnail({ artworkId, category, className = 'w-full h-36' }: { artworkId: string; category: string; className?: string }) {
  if (artworkId === 'art-01' || category === 'Video') {
    return (
      <div className={`relative bg-gradient-to-br from-indigo-900 via-slate-900 to-sky-900 rounded-lg overflow-hidden flex items-center justify-center group ${className}`}>
        <div className="absolute inset-0 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:10px_10px] opacity-25" />
        <div className="relative flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-white/90 text-indigo-900 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <svg className="w-5 h-5 translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <span className="mt-2 text-xs font-medium text-white/90 drop-shadow">My Weekend Story</span>
        </div>
        <span className="absolute bottom-2 right-2 bg-black/70 text-[10px] font-mono text-white px-1.5 py-0.5 rounded">01:24</span>
      </div>
    );
  }

  if (artworkId === 'art-02' || category === 'Desain') {
    return (
      <div className={`relative bg-gradient-to-br from-emerald-800 via-teal-900 to-green-950 rounded-lg overflow-hidden flex items-center justify-center p-3 text-center ${className}`}>
        <div className="border border-emerald-400/40 rounded p-2.5 w-full h-full flex flex-col items-center justify-center bg-emerald-950/40">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-400 to-cyan-300 flex items-center justify-center shadow-md mb-1.5">
            <svg className="w-6 h-6 text-emerald-950" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
              <path d="M2 12h20" />
            </svg>
          </div>
          <span className="text-[11px] font-bold tracking-wider text-emerald-200 uppercase">SAVE OUR EARTH</span>
          <span className="text-[9px] text-emerald-300/80 mt-0.5">Poster Desain Grafis</span>
        </div>
      </div>
    );
  }

  if (artworkId === 'art-03' || category === 'Presentasi') {
    return (
      <div className={`relative bg-gradient-to-br from-amber-700 via-orange-800 to-rose-900 rounded-lg overflow-hidden flex flex-col justify-between p-3 ${className}`}>
        <div className="flex items-center justify-between border-b border-white/20 pb-1">
          <span className="text-[9px] font-mono text-amber-200">SLIDE 01/06</span>
          <div className="w-2 h-2 rounded-full bg-amber-400" />
        </div>
        <div className="my-auto text-center">
          <p className="text-xs font-bold text-white leading-tight">FAVOURITE PLACES</p>
          <p className="text-[9px] text-amber-100/80 mt-0.5">Presentation Deck</p>
        </div>
        <div className="flex gap-1 justify-center">
          <div className="w-4 h-1 rounded bg-white/80" />
          <div className="w-2 h-1 rounded bg-white/40" />
          <div className="w-2 h-1 rounded bg-white/40" />
        </div>
      </div>
    );
  }

  if (artworkId === 'art-04' || category === 'Proyek') {
    return (
      <div className={`relative bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-950 rounded-lg overflow-hidden flex items-center justify-center p-3 text-center ${className}`}>
        <div className="relative">
          <div className="w-10 h-10 mx-auto rounded-lg bg-violet-600/40 border border-violet-400/40 flex items-center justify-center mb-1.5 shadow">
            <svg className="w-5 h-5 text-violet-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <span className="text-xs font-semibold text-violet-100">Photo Editing Set</span>
          <p className="text-[9px] text-violet-300">Tone & Composition</p>
        </div>
      </div>
    );
  }

  // Riset / Default
  return (
    <div className={`relative bg-gradient-to-br from-blue-900 via-sky-900 to-cyan-950 rounded-lg overflow-hidden flex items-center justify-center p-3 text-center ${className}`}>
      <div className="relative">
        <div className="w-10 h-10 mx-auto rounded-full bg-cyan-500/30 border border-cyan-400/40 flex items-center justify-center mb-1.5 shadow">
          <svg className="w-5 h-5 text-cyan-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2" />
            <path d="M12 20v2" />
            <path d="m4.93 4.93 1.41 1.41" />
            <path d="m17.66 17.66 1.41 1.41" />
            <path d="M2 12h2" />
            <path d="M20 12h2" />
          </svg>
        </div>
        <span className="text-xs font-semibold text-cyan-100">Why Do Seasons Change?</span>
        <p className="text-[9px] text-cyan-300">Mini Science Research</p>
      </div>
    </div>
  );
}
