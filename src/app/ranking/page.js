"use client";

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { movies } from '../../data/movies';
import MovieCard from '../../components/MovieCard';
import DetailModal from '../../components/DetailModal';

export default function RankingPage() {
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("search") || "";
  
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [selectedMovie, setSelectedMovie] = useState(null);

  // 1. URUTKAN DATA FILM DARI RATING TERTINGGI KE TERENDAH
  const sortedMovies = [...movies].sort((a, b) => b.rating - a.rating);

  // 2. FILTER DATA BERDASARKAN GENRE & SEARCH
  const filteredRanking = sortedMovies.filter((movie) => {
    const matchGenre = selectedGenre === "All" || 
      (Array.isArray(movie?.genre) 
        ? movie.genre.some(g => g.toLowerCase() === selectedGenre.toLowerCase())
        : movie?.genre?.toLowerCase() === selectedGenre.toLowerCase());

    const matchSearch = (movie?.title || "").toLowerCase().includes(searchTerm.toLowerCase());

    return matchGenre && matchSearch;
  });

  return (
    <div className="p-10 bg-black min-h-screen pt-5">
      <h1 className="text-4xl font-black mb-2 text-yellow-500">MOVIE RANKING</h1>
      <p className="text-gray-400 mb-10 italic">Daftar film dengan rating tertinggi saat ini.</p>
      
      {/* TOOLBAR FILTER GENRE */}
      <div className="flex items-center space-x-3 mb-10">
        <select 
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          className="appearance-none bg-black border border-gray-600 rounded-full px-5 py-1.5 text-[11px] font-bold text-white outline-none hover:border-white transition uppercase cursor-pointer" 
        >
          <option value="All">GENRE ▼</option>
          <option value="Action">Action</option>
          <option value="Crime">Crime</option>
          <option value="Sci-Fi">Sci-Fi</option>
          <option value="Comedy">Comedy</option>
          <option value="Drama">Drama</option>
          <option value="Horor">Horor</option>
          <option value="Romance">Romance</option>
          <option value="Thiller">Thiller</option>
        </select>
      </div>

      {/* GRID KONTEN RANKING */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {filteredRanking.length > 0 ? (
          filteredRanking.map((movie, index) => (
            <div key={movie.id} className="relative">
              <span className="absolute -top-6 -left-4 text-7xl font-black text-gray-800/40 z-0 select-none">
                {index + 1}
              </span>
              <div className="relative z-10">
                <MovieCard 
                  movie={movie} 
                  onOpenDetail={(data) => setSelectedMovie(data)} 
                />
              </div>
            </div>
          ))
        ) : (
          /* 3. LOGIKA PEMISAH PESAN KOSONG */
          <div className="col-span-full text-center py-20 text-gray-500 italic">
            {searchTerm !== "" ? (
              // Jika user lagi ngetik di Search Box dan kosong
              <span>Maaf, film tidak dapat ditemukan 🎬</span>
            ) : (
              // Jika user lagi murni milih Genre dan kosong
              <span>Maaf, film dengan genre ini tidak dapat ditemukan 🎬</span>
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
    </div>
  );
}