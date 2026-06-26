"use client";
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import MovieCard from '../../components/MovieCard';
import DetailModal from '../../components/DetailModal';
import { movieApi } from '../../api/movieApi';

export default function FilmPage() {
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("search") || "";
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [selectedRating, setSelectedRating] = useState("0");
  const [selectedMovie, setSelectedMovie] = useState<any>(null);

  // State untuk menampung data live dari database Rails
  const [dbMovies, setDbMovies] = useState<any[]>([]);

 // Ambil data live lewat jembatan api
  useEffect(() => {
    movieApi.getAllMovies()
      .then((data) => {
        setDbMovies(data);
      })
      .catch((err) => console.error("Gagal konek backend di halaman film:", err));
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
      console.error("Error pas vote di halaman film:", error);
    }
  };

  // 🛠️ LOGIKA FILTER KHUSUS MOVIE & DEFENSIVE PROGRAMMING
  const filteredMovies = Array.isArray(dbMovies)
    ? dbMovies.filter((movie) => {
        // KUNCI UTAMA: Hanya loloskan data yang berjenis 'movie'
        const isMovie = movie?.category?.toLowerCase() === "movie" || movie?.type?.toLowerCase() === "movie";
        
        // Filter Searchbar (Berfungsi melacak judul)
        const matchSearch = (movie?.title || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        
        // Filter Genre
        const movieGenre = movie.genre || movie.category || "";
        const matchGenre = 
          selectedGenre === "All" || 
          movieGenre.toLowerCase().includes(selectedGenre.toLowerCase());
          
        // Filter Rating
        const matchRating = (movie?.rating || 0) >= parseFloat(selectedRating);

        return isMovie && matchSearch && matchGenre && matchRating;
      })
    : [];

  return (
    <section className="px-10 min-h-screen bg-black pt-5 text-white">

      {/* TOOLBAR FILTER (GENRE & RATING) - PERSIS BARU & POPULER */}
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

      {/* GRID KONTEN FILM (5 KOLOM ESTETIK) */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {filteredMovies.length > 0 ? (
          filteredMovies.map((movie) => (
            <MovieCard 
              key={movie.id} 
              movie={movie} 
              onOpenDetail={(data) => setSelectedMovie(data)} 
              onVote={handleVote} 
            />  
          ))
        ) : (
          <div className="col-span-full text-center py-20 text-gray-500 italic">
            {searchTerm !== "" ? (
              <span>Yah, maaf film "{searchTerm}" tidak dapat ditemukan... 🎬</span>
            ) : (
              <span>Maaf film dengan kriteria ini tidak dapat ditemukan 🎬</span>
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