"use client";
import { useState } from 'react';
import { movies } from '../../data/movies';
import MovieCard from '../../components/MovieCard';
import SearchBar from '../../components/SearchBar';
import DetailModal from '../../components/DetailModal';
import { useSearchParams } from 'next/navigation';

export default function HomePage() {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const navbarSearch = searchParams.get("search") || "";
  const finalSearch = searchTerm || navbarSearch;
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [selectedRating, setSelectedRating] = useState("0");
  const [selectedMovie, setSelectedMovie] = useState(null);

  const filteredMovies = movies.filter((movie) => {
    const matchSearch = (movie?.title || "")
      .toLowerCase()
      .includes(finalSearch.toLowerCase());

    const matchGenre =
      selectedGenre === "All" ||
      (Array.isArray(movie.genre) 
        ? movie.genre.some(g => g.toLowerCase() === selectedGenre.toLowerCase())
        : movie.genre.toLowerCase() === selectedGenre.toLowerCase());

    const matchRating = (movie.rating || 0) >= parseFloat(selectedRating);

    return matchSearch && matchGenre && matchRating;
  });

  return (
    <section className="px-10">
      <div className="flex justify-start space-x-3 mb-4 mt-2">

        {/* Dropdown Genre */}
        <div className="relative">
          <select 
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="appearance-none bg-black border border-gray-600 rounded-full px-5 py-1.5 text-[11px] font-bold tracking-widest text-white outline-none cursor-pointer hover:border-white transition uppercase" 
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

        {/* Dropdown Rating */}
        <div className="relative">
          <select 
            value={selectedRating}
            onChange={(e) => setSelectedRating(e.target.value)}
            className="appearance-none bg-black border border-gray-600 rounded-full px-5 py-1.5 text-[11px] font-bold tracking-widest text-white outline-none cursor-pointer hover:border-white transition uppercase"
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
      </div>

      <div className="text-center mb-10">
        <h1 className="text-5xl font-black mb-4 tracking-tighter">
          EXPLORE <span className="text-red-600">MOVIES</span>
        </h1>
        <p className="text-gray-500 uppercase text-xs tracking-[0.3em]">
          Temukan dan berikan vote untuk film terbaik
        </p>
      </div>

      <SearchBar onSearch={setSearchTerm} />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-12">
        {filteredMovies.length > 0 ? (
          filteredMovies.map((movie) => (
            <MovieCard 
              key={movie.id} 
              movie={movie} 
              onOpenDetail={(data) => setSelectedMovie(data)} 
            />   
          ))
        ) : (
          /* LOGIKA PEMISAH PESAN KOSONG DI BERANDA */
          <div className="col-span-full text-center py-20">
            {finalSearch !== "" ? (
              // 1. Jika kosongnya gara-gara ngetik di search box (baik di navbar atau halaman utama)
              <p className="text-gray-600 italic text-lg">
                Yah, maaf film "{finalSearch}" tidak dapat ditemukan... 🎬
              </p>
            ) : (
              // 2. Jika kosongnya murni gara-gara milih filter genre dropdown
              <p className="text-gray-600 italic text-lg">
                maaf film dengan genre ini tidak dapat ditemukan 🎬
              </p>
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