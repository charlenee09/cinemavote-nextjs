"use client";

export default function Preloader() {
  return (
    <div className="fixed inset-0 bg-black z-[99999] flex flex-col items-center justify-center font-sans select-none animate-fade-in">
      
      {/* KOTAK ANIMASI LOGO/ICON */}
      <div className="relative flex items-center justify-center mb-6">
        {/* Efek Lingkaran Loading Berputar di Luar */}
        <div className="w-20 h-20 border-4 border-t-red-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        
        {/* Icon Proyektor/Film Tengah Melayang */}
        <span className="absolute text-4xl animate-pulse">
          🎬
        </span>
      </div>

      {/* TEKS PRELOADER */}
      <div className="text-center">
        <h1 className="text-xl font-black tracking-[0.3em] text-white uppercase italic">
          CINEMA<span className="text-red-600">VOTE</span>
        </h1>
        <p className="text-[10px] text-gray-500 uppercase tracking-[0.5em] mt-2 font-mono animate-pulse">
          Memuat Pengalaman Sinema...
        </p>
      </div>

    </div>
  );
}