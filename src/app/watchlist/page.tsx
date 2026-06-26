"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import MovieCard from '../../components/MovieCard';
import DetailModal from '../../components/DetailModal';
import { movieApi } from '../../api/movieApi';

export default function WatchlistPage() {
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("search") || "";

  const [watchlist, setWatchlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState<any>(null);

  // 1. Ambil data dari Rails dan SARING hanya yang masuk Watchlist
// 1. Ambil data dari Rails lewat jembatan api dan SARING yang masuk Watchlist
  useEffect(() => {
    movieApi.getAllMovies()
      .then((data) => {
        if (Array.isArray(data)) {
          // 🔥 KUNCI PEMISAH: Hanya loloskan film yang is_watchlist bernilai true
          const userWatchlist = data.filter((movie: any) => movie.is_watchlist === true);
          setWatchlist(userWatchlist);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Gagal konek backend di halaman watchlist:", err);
        setLoading(false);
      });
  }, []);

  // 2. FUNGSI LIVE VOTE (Agar angka vote sinkron lewat jembatan api)
  const handleVote = async (movieId: number) => {
    try {
      const data = await movieApi.voteMovie(movieId);
      
      setWatchlist((prev) =>
        prev.map((m) => (m.id === movieId ? { ...m, votes: data.votes } : m))
      );
      if (selectedMovie && selectedMovie.id === movieId) {
        setSelectedMovie((prev: any) => ({ ...prev, votes: data.votes }));
      }
      alert(`Mantap! ${data.message}`);
    } catch (error) {
      console.error("Error vote di watchlist:", error);
    }
  };

  // 3. FUNGSI HAPUS DARIPADA WATCHLIST LANGSUNG KE BACKEND RAILS
  const handleRemoveFromWatchlist = async (id: number) => {
    try {
      const data = await movieApi.toggleWatchlist(id);
      
      // Hapus film dari daftar tampilan state secara real-time
      const updatedList = watchlist.filter(movie => movie.id !== id);
      setWatchlist(updatedList);
      alert("Film berhasil dihapus dari daftar tontonan kamu! ✕");
    } catch (error) {
      console.error("Gagal menghapus dari watchlist backend:", error);
    }
  };

  // 4. LOGIKA FILTER BERDASARKAN KETIKAN SEARCH BAR
  const filteredWatchlist = watchlist.filter((movie) => {
    return (movie?.title || "").toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <section className="px-10 min-h-screen bg-black pt-5 text-white">
      <h1 className="text-4xl font-black mb-2 text-white uppercase tracking-wider">MY WATCHLIST</h1>
      <p className="text-gray-400 mb-10 italic">Daftar tontonan yang kamu simpan.</p>

      {/* GRID KONTEN */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-20 text-gray-500 italic animate-pulse">
            Memuat data watchlist dari Rails... 🎬
          </div>
        ) : filteredWatchlist.length > 0 ? (
          filteredWatchlist.map((movie) => (
            <div key={movie.id} className="relative group">
              
              {/* TOMBOL HAPUS (Silang Merah) */}
              <button
                onClick={() => handleRemoveFromWatchlist(movie.id)}
                className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white font-bold w-6 h-6 rounded-full flex items-center justify-center text-xs z-30 shadow-lg transition transform hover:scale-110 active:scale-95 cursor-pointer border-none outline-none"
                title="Hapus dari Watchlist"
              >
                🗑️
              </button>

              {/* KARTU FILM */}
              <MovieCard 
                movie={movie} 
                onOpenDetail={(data) => setSelectedMovie(data)} 
                onVote={handleVote}
              />  
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-20 text-gray-500 italic">
            {searchTerm !== "" ? (
              <span>Maaf, film "{searchTerm}" tidak dapat ditemukan di watchlist 🎬</span>
            ) : (
              <span>Watchlist kamu sedang kosong ... 🎬</span>
            )}
          </div>
        )}
      </div>

      {selectedMovie && (
        <DetailModal 
          movie={selectedMovie} 
          onClose={() => setSelectedMovie(null)} 
          onVote={handleVote}
        />
      )}
    </section>
  );
}