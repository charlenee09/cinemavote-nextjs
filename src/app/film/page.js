"use client";
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { movies } from '../../data/movies';
import MovieCard from '../../components/MovieCard';
import DetailModal from '../../components/DetailModal';

export default function FilmPage() {

  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("search") || "";
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [selectedRating, setSelectedRating] = useState("0");
  const [selectedMovie, setSelectedMovie] = useState(null);

  // LOGIKA FILTER KONTEN - KHUSUS MOVIE
  const filteredMovies = movies.filter((movie) => {
    // Kuncinya di sini: Kategorinya harus "movie"
    const isMovie = movie?.category === "movie"; 
    
    const matchSearch = (movie?.title || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchGenre = selectedGenre === "All" || 
      (Array.isArray(movie?.genre) 
        ? movie.genre.some(g => g.toLowerCase() === selectedGenre.toLowerCase())
        : movie?.genre?.toLowerCase() === selectedGenre.toLowerCase());
    const matchRating = (movie?.rating || 0) >= parseFloat(selectedRating);

    return isMovie && matchSearch && matchGenre && matchRating;
  });

  return (
    <section className="px-10 min-h-screen bg-black pt-5">

      {/* 3. TOOLBAR FILTER (GENRE & RATING) */}
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

        <select 
          value={selectedRating}
          onChange={(e) => setSelectedRating(e.target.value)}
          className="appearance-none bg-black border border-gray-600 rounded-full px-5 py-1.5 text-[11px] font-bold text-white outline-none hover:border-white transition uppercase cursor-pointer"
        >
          <option value="0">RATING ▼</option>
          <option value="9">9.0+</option>
          <option value="8">8.0+</option>
          <option value="7">7.0+</option>
          <option value="6">6.0+</option>
          <option value="5">5.0+</option>
          <option value="4">4.0+</option>
          <option value="3">3.0+</option>
          <option value="2">2.0+</option>
          <option value="1">1.0+</option>
        </select>
      </div>

      {/* GRID KONTEN FILM */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {filteredMovies.length > 0 ? (
          filteredMovies.map((movie) => (
            <MovieCard 
              key={movie.id} 
              movie={movie} 
              onOpenDetail={(data) => setSelectedMovie(data)} 
            />  
          ))
        ) : (
          /* LOGIKA PEMISAH PESAN KOSONG DI HALAMAN FILM */
          <div className="col-span-full text-center py-20 text-gray-500 italic">
            {searchTerm !== "" ? (
              // Jika kosong gara-gara ketikan di search box
              <span>Yah, maaf film "{searchTerm}" tidak dapat ditemukan... 🎬</span>
            ) : (
              // Jika kosong murni karena milih dropdown Genre
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