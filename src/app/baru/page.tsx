"use client";
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import MovieCard from '../../components/MovieCard';
import DetailModal from '../../components/DetailModal';
import { movieApi } from '../../api/movieApi';

export default function BaruPopulerPage() {
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("search") || "";
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [selectedRating, setSelectedRating] = useState("0");
  const [selectedMovie, setSelectedMovie] = useState<any>(null);

  // State untuk menampung data live dari database Rails
  const [dbMovies, setDbMovies] = useState<any[]>([]);

  // Ambil data live dari Rails port 3001 saat halaman dibuka
// Ambil data live lewat jembatan api
  useEffect(() => {
    movieApi.getAllMovies()
      .then((data) => {
        setDbMovies(data);
      })
      .catch((err) => console.error("Gagal konek backend di halaman baru & populer:", err));
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
      console.error("Error pas vote di halaman baru & populer:", error);
    }
  };

  // 🛠️ LOGIKA FILTER KONTEN AMAN (DEFENSIVE PROGRAMMING)
  const filteredTrending = Array.isArray(dbMovies)
    ? dbMovies.filter((movie) => {
        // Menyesuaikan logika film baru/populer dari Rails
        const isNewOrPopular = movie?.isNew === true || movie?.isPopular === true || true;
        
        const matchSearch = (movie?.title || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        
        const movieGenre = movie.genre || movie.category || "";
        const matchGenre = 
          selectedGenre === "All" || 
          movieGenre.toLowerCase().includes(selectedGenre.toLowerCase());
          
        const matchRating = (movie?.rating || 0) >= parseFloat(selectedRating);

        return isNewOrPopular && matchSearch && matchGenre && matchRating;
      })
    : [];

  return (
    <section className="px-10 min-h-screen bg-black pt-5 text-white">

      {/* TOOLBAR FILTER (GENRE & RATING) */}
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

      {/* GRID KONTEN BARU & POPULER */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {filteredTrending.length > 0 ? (
          filteredTrending.map((movie) => (
            <MovieCard 
              key={movie.id} 
              movie={movie} 
              onOpenDetail={(data) => setSelectedMovie(data)} 
              onVote={handleVote} // 👈 Oper fungsi vote ke MovieCard
            />  
          ))
        ) : (
          <div className="col-span-full text-center py-20 text-gray-500 italic">
            {searchTerm !== "" ? (
              <span>Yah, maaf film "{searchTerm}" tidak dapat ditemukan... 🎬</span>
            ) : (
              <span>maaf film dengan genre ini tidak dapat ditemukan 🎬</span>
            )}
          </div>
        )}
      </div>

      {selectedMovie && (
        <DetailModal 
          movie={selectedMovie} 
          onClose={() => setSelectedMovie(null)} 
          onVote={handleVote} // 👈 Oper fungsi vote ke DetailModal
        />
      )}
    </section>
  );
}