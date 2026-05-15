"use client";
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { movies } from '../../data/movies';
import MovieCard from '../../components/MovieCard';
import DetailModal from '../../components/DetailModal';

export default function BaruPopulerPage() {

  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("search") || "";
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [selectedRating, setSelectedRating] = useState("0");
  const [selectedMovie, setSelectedMovie] = useState(null);

  // LOGIKA FILTER KONTEN - BARU & POPULER
  const filteredTrending = movies.filter((movie) => {
    const isNewOrPopular = movie?.isNew === true || movie?.isPopular === true;
    
    const matchSearch = (movie?.title || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchGenre = selectedGenre === "All" || 
      (Array.isArray(movie?.genre) 
        ? movie.genre.some(g => g.toLowerCase() === selectedGenre.toLowerCase())
        : movie?.genre?.toLowerCase() === selectedGenre.toLowerCase());
    const matchRating = (movie?.rating || 0) >= parseFloat(selectedRating);

    return isNewOrPopular && matchSearch && matchGenre && matchRating;
  });

  return (
    <section className="px-10 min-h-screen bg-black pt-5">

      {/* TOOLBAR FILTER (GENRE & RATING) */}
      <div className="flex items-center space-x-3 mb-10">
        <select 
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          className="appearance-none bg-black border border-gray-600 rounded-full px-5 py-1.5 text-[11px] font-bold text-white outline-none hover:border-white transition uppercase cursor-pointer" 
        >
          <option value="All">GENRE ▼</option>
          <option value="Action">Action</option>
          <option value="Sci-Fi">Sci-Fi</option>
          <option value="Comedy">Comedy</option>
          <option value="Drama">Drama</option>
        </select>

        <select 
          value={selectedRating}
          onChange={(e) => setSelectedRating(e.target.value)}
          className="appearance-none bg-black border border-gray-600 rounded-full px-5 py-1.5 text-[11px] font-bold text-white outline-none hover:border-white transition uppercase cursor-pointer"
        >
          <option value="0">RATING ▼</option>
          <option value="9">9.0+</option>
        </select>
      </div>

      {/* GRID KONTEN BARU & POPULER */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {filteredTrending.length > 0 ? (
          filteredTrending.map((movie) => (
            <MovieCard 
              key={movie.id} 
              movie={movie} 
              onOpenDetail={(data) => setSelectedMovie(data)} 
            />  
          ))
        ) : (
          /* LOGIKA PEMISAH PESAN KOSONG DI HALAMAN BARU & POPULER */
          <div className="col-span-full text-center py-20 text-gray-500 italic">
            {searchTerm !== "" ? (
              // Jika kosong karena ketikan di search box
              <span>Yah, maaf film "{searchTerm}" tidak dapat ditemukan... 🎬</span>
            ) : (
              // Jika kosong murni karena milih filter dropdown Genre
              <span>maaf film dengan genre ini tidak dapat ditemukan 🎬</span>
            )}
          </div>
        )}
      </div>

      {selectedMovie && (
        <DetailModal 
          movie={selectedMovie} 
          onClose={() => setSelectedMovie(null)} 
        />
      )}
    </section>
  );
}