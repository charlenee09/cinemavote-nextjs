"use client";
import { useParams, useRouter } from 'next/navigation';

export default function WatchDetailPage() {
  const params = useParams();
  const router = useRouter();
  const idFilm = params.id; // Menangkap ID otomatis dari URL (Contoh: mqqft2x_Aa4)

  return (
    <div className="min-h-screen bg-black text-white font-sans pt-24 p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* FITUR TAMBAHAN: TOMBOL KEMBALI KE BERANDA POLOS SESUAI REQUEST CHARLENE */}
        <button 
          onClick={() => router.push('/')} // Begitu diklik langsung balik ke Beranda utama
          className="mb-4 bg-transparent border-none text-gray-400 hover:text-red-500 font-bold text-xs tracking-wider uppercase flex items-center space-x-2 cursor-pointer transition-all duration-300"
        >
          <span className="text-sm">←</span>
          <span>Kembali ke Beranda</span>
        </button>

        {/* LAYOUT VIDEO PLAYER ASLI KAMU YANG TENGAH TEPAT SESUAI GAMBAR */}
        <div className="w-full aspect-video bg-black rounded border border-gray-900 overflow-hidden shadow-2xl relative">
          {idFilm ? (
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${idFilm}?autoplay=1&modestbranding=1&rel=0`}
              title="CinemaVote Video Player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-600 text-sm">
              Memuat video player...
            </div>
          )}
        </div>

      </div>
    </div>
  );
}