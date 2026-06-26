"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import MovieCard from '../../components/MovieCard';
import DetailModal from '../../components/DetailModal';
import { movieApi } from '../../api/movieApi';

export default function RankingPage() {
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("search") || "";
  
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [selectedMovie, setSelectedMovie] = useState<any>(null);

  // State untuk menampung data live dari database Rails
  const [dbMovies, setDbMovies] = useState<any[]>([]);

// Ambil data live lewat jembatan api
  useEffect(() => {
    movieApi.getAllMovies()
      .then((data) => {
        setDbMovies(data);
      })
      .catch((err) => console.error("Gagal konek backend di halaman ranking:", err));
  }, []);

  // 🔥 FUNGSI VOTE LIVE lewat jembatan api
  const handleVote = async (movieId: number) => {
    try {
      const data = await movieApi.voteMovie(movieId);

      setDbMovies((prevMovies) =>
        prevMovies.map((movie) =>
          movie.id === movieId ? { ...movie, votes: data.votes } : movie
        )
      );

      if (selectedMovie && selectedMovie.id === movieId) {
        setSelectedMovie((prev: any) => ({ ...prev, votes: data.votes }));
      }

      alert(`Mantap! ${data.message}`);
    } catch (error) {
      console.error("Error pas vote di halaman ranking:", error);
    }
  };
  
  // 1. URUTKAN DATA FILM DARI RATING TERTINGGI KE TERENDAH
  const sortedMovies = Array.isArray(dbMovies)
    ? [...dbMovies].sort((a, b) => (b.rating || 0) - (a.rating || 0))
    : [];

  // 2. FILTER DATA BERDASARKAN GENRE & SEARCH BAR LIVE
  const filteredRanking = sortedMovies.filter((movie) => {
    const movieGenre = movie.genre || movie.category || "";
    const matchGenre =
      selectedGenre === "All" ||
      movieGenre.toLowerCase().includes(selectedGenre.toLowerCase());

    const matchSearch = (movie?.title || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return matchGenre && matchSearch;
  });

  return (
    <div className="p-10 bg-black min-h-screen pt-5 text-white">
      <h1 className="text-4xl font-black mb-2 text-yellow-500 tracking-tighter">MOVIE RANKING</h1>
      <p className="text-gray-400 mb-10 text-xs uppercase tracking-widest italic">Daftar film dengan rating tertinggi saat ini.</p>
      
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
<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-8 gap-y-16 pt-10">
  {filteredRanking.length > 0 ? (
    filteredRanking.map((movie, index) => (
      <div key={movie.id} className="relative flex flex-col pt-6">
        
        {/* 🔥 ANGKA RANKING KUNING EMAS YANG SUDAH DIPAKSA MAJU KE DEPAN */}
        <span className="absolute -top-4 -left-2 text-5xl font-black text-yellow-500 z-[30] select-none italic drop-shadow-[0_5px_5px_rgba(0,0,0,1)]">
        {index + 1}
        </span>
        
        {/* Kartu Film */}
        <div className="relative z-10 hover:scale-105 transition duration-300">
          <MovieCard 
            movie={movie} 
            onOpenDetail={(data) => setSelectedMovie(data)} 
            onVote={handleVote} 
          />
        </div>
      </div>
    ))
  ) : (
    <div className="col-span-full text-center py-20 text-gray-500 italic">
      {searchTerm !== "" ? (
        <span>Maaf, film "{searchTerm}" tidak dapat ditemukan 🎬</span>
      ) : (
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
          onVote={handleVote} // 👈 Oper fungsi vote ke DetailModal
        />
      )}
    </div>
  );
}