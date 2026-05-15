"use client";

import { useState } from 'react';
import { useSearchParams } from 'next/navigation'; // 1. IMPORT INI BIAR BISA DETEKSI SEARCH BOX
import { movies } from '../../data/movies';
import MovieCard from '../../components/MovieCard';
import DetailModal from '../../components/DetailModal';

export default function WatchlistPage() {
  const searchParams = useSearchParams(); // 2. AMBIL QUERY PARAMETERS DARI URL
  const searchTerm = searchParams.get("search") || ""; // Ambil keyword search, default kosong ""

  // Data awal watchlist
  const [watchlist, setWatchlist] = useState(
    movies.filter(movie => movie.inWatchlist === true || movie.id <= 3)
  );
  
  const [selectedMovie, setSelectedMovie] = useState(null);

  // FUNGSI UNTUK HAPUS FILM DARI WATCHLIST
  const handleRemoveFromWatchlist = (id) => {
    const updatedList = watchlist.filter(movie => movie.id !== id);
    setWatchlist(updatedList);
  };

  // 3. LOGIKA FILTER BERDASARKAN KETIKAN SEARCH BAR
  const filteredWatchlist = watchlist.filter((movie) => {
    return (movie?.title || "").toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <section className="px-10 min-h-screen bg-black pt-5">
      <h1 className="text-4xl font-black mb-2 text-white uppercase tracking-wider">MY WATCHLIST</h1>
      <p className="text-gray-400 mb-10 italic">Daftar tontonan yang kamu simpan.</p>

      {/* GRID KONTEN */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {/* Menggunakan filteredWatchlist untuk looping */}
        {filteredWatchlist.length > 0 ? (
          filteredWatchlist.map((movie) => (
            <div key={movie.id} className="relative group">
              
              {/* TOMBOL HAPUS (Silang Merah) */}
              <button
                onClick={() => handleRemoveFromWatchlist(movie.id)}
                className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white font-bold w-6 h-6 rounded-full flex items-center justify-center text-xs z-30 shadow-lg transition transform hover:scale-110 active:scale-95"
                title="Hapus dari Watchlist"
              >
                ✕
              </button>

              {/* KARTU FILM */}
              <MovieCard 
                movie={movie} 
                onOpenDetail={(data) => setSelectedMovie(data)} 
              />  
            </div>
          ))
        ) : (
          /* 4. LOGIKA PEMISAH PESAN KOSONG SESUAI KONDISI bby */
          <div className="col-span-full text-center py-20 text-gray-500 italic">
            {searchTerm !== "" ? (
              // Kalau kosong gara-gara lagi ngetik di search box
              <span>Maaf, film tidak dapat ditemukan diwatchlist 🎬</span>
            ) : (
              // Kalau emang dari awal watchlist-nya murni abis/kosong
              <span>Watchlist kamu sedang kosong ... 🎬</span>
            )}
          </div>
        )}
      </div>

      {/* DETAIL MODAL POP-UP */}
      {selectedMovie && (
        <DetailModal 
          movie={selectedMovie} 
          onClose={() => setSelectedMovie(null)} 
        />
      )}
    </section>
  );
}