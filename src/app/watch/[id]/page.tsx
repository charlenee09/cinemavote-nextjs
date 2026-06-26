"use client";
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function WatchDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const idFilm = params?.id || searchParams.get("id"); 

  const [movieData, setMovieData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorFetch, setErrorFetch] = useState(false);

  useEffect(() => {
    if (!idFilm || idFilm === "undefined") {
      setLoading(false);
      return;
    }

    setLoading(true);
    setErrorFetch(false);

    fetch(`http://localhost:3001/movies/${idFilm}`)
      .then((res) => {
        if (!res.ok) {
          setErrorFetch(true);
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) {
          const actualData = data.movie ? data.movie : data;

          const normalizedMovie = {
            id: actualData.id,
            title: actualData.title || actualData.name || "Movie Title",
            rating: actualData.rating || "0",
            category: actualData.category || actualData.genre || "Unknown",
            year: actualData.year || "2026",
            synopsis: actualData.synopsis || actualData.description || "Sinopsis belum diset.",
            // Mengambil data dari kolom trailer kamu di Rails
            trailer_id: actualData.trailer_id || actualData.trailer_url || actualData.youtube_url || actualData.trailer || ""
          };

          setMovieData(normalizedMovie);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Gagal mengambil detail film:", err);
        setErrorFetch(true);
        setLoading(false);
      });
  }, [idFilm]);

  // 🚀 FUNGSI BARU: Jauh lebih aman dan langsung mengekstrak ID YouTube
  const getEmbedUrl = (urlOrId: string) => {
    if (!urlOrId) return "";
    
    const cleanStr = urlOrId.trim();

    // Jika yang kamu input di Rails sudah ID murni (11 karakter tanpa simbol / atau =)
    if (cleanStr.length === 11 && !cleanStr.includes("/") && !cleanStr.includes("=")) {
      return `https://www.youtube.com/embed/${cleanStr}?autoplay=1&modestbranding=1&rel=0&playlist=${cleanStr}&loop=1`;
    }

    // Menggunakan regex super aman untuk mendeteksi ID di dalam link panjang apa pun
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\/shorts\/)([^#\&\?]*).*/;
    const match = cleanStr.match(regExp);
    
    if (match && match[2].length === 11) {
      const extractedId = match[2];
      return `https://www.youtube.com/embed/${extractedId}?autoplay=1&modestbranding=1&rel=0&playlist=${extractedId}&loop=1`;
    }

    // Jika gagal terpotong, pasang langsung sebagai string mentah
    return `https://www.youtube.com/embed/${cleanStr}?autoplay=1&modestbranding=1&rel=0`;
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans pt-24 p-6">
      <div className="max-w-6xl mx-auto">
        
        <button 
          onClick={() => router.push('/')} 
          className="mb-4 bg-transparent border-none text-gray-400 hover:text-red-500 font-bold text-xs tracking-wider uppercase flex items-center space-x-2 cursor-pointer transition-all duration-300 outline-none"
        >
          <span className="text-sm">←</span>
          <span>Kembali ke Beranda</span>
        </button>

        <div className="w-full aspect-video bg-gray-900 rounded border border-gray-800 overflow-hidden shadow-2xl relative">
          {errorFetch ? (
            <div className="w-full h-full flex flex-col items-center justify-center text-red-500 text-sm p-4 text-center bg-gray-950">
              <span>⚠️ Gagal memuat data dari server Rails. Pastikan Rails menyala.</span>
            </div>
          ) : loading ? (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm italic animate-pulse">
              Menghubungi server Rails... 🎬
            </div>
          ) : movieData?.trailer_id ? (
            <iframe
              className="w-full h-full"
              src={getEmbedUrl(movieData.trailer_id)}
              title={movieData.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 text-sm p-4 text-center bg-gray-950">
              <span>⚠️ Maaf, link video trailer belum diisi di database Rails.</span>
            </div>
          )}
        </div>

        {/* 🔍 INDIKATOR CEK NILAI ASLI */}
        {!loading && movieData && (
          <div className="mt-3 p-3 bg-gray-900/40 rounded-lg border border-gray-800 text-xs text-gray-400">
            <p>📋 <span className="font-bold text-gray-300">Teks asli dari Rails kamu:</span> <code className="text-yellow-500 bg-black px-2 py-0.5 rounded">{movieData.trailer_id || "KOSONG"}</code></p>
            <p>🔗 <span className="font-bold text-gray-300">Link Akhir Iframe:</span> <code className="text-cyan-400 bg-black px-2 py-0.5 rounded">{getEmbedUrl(movieData.trailer_id)}</code></p>
          </div>
        )}

        {!loading && movieData && !errorFetch && (
          <div className="mt-6">
            <h1 className="text-3xl font-black tracking-tight text-white uppercase">
              {movieData.title} <span className="text-red-600 text-xl font-bold ml-2">⭐ {movieData.rating}</span>
            </h1>
            <p className="text-gray-500 text-xs mt-1 tracking-widest uppercase font-semibold">
              Kategori: {movieData.category} | Tahun: {movieData.year}
            </p>
            <p className="text-gray-400 text-sm mt-4 leading-relaxed max-w-4xl italic">
              "{movieData.synopsis}"
            </p>
          </div>
        )}

      </div>
    </div>
  );
}