"use client";
import { useState, useEffect } from 'react';
import MovieCard from '../../components/MovieCard';
import SearchBar from '../../components/SearchBar';
import DetailModal from '../../components/DetailModal';
import { useSearchParams } from 'next/navigation';
import { movieApi } from '../../api/movieApi';

export default function HomePage() {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const navbarSearch = searchParams.get("search") || "";
  const finalSearch = searchTerm || navbarSearch;
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [selectedRating, setSelectedRating] = useState("0");
  const [selectedMovie, setSelectedMovie] = useState<any>(null);

  // State untuk menampung data live dari database Rails
  const [dbMovies, setDbMovies] = useState<any[]>([]);

  // Ambil data live lewat jembatan api saat halaman dibuka
  useEffect(() => {
    movieApi.getAllMovies()
      .then((data) => {
        setDbMovies(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Gagal konek ke backend Rails:", err);
        setDbMovies([]);
      });
  }, []);

  // 🔥 FUNGSI API Vote lewat jembatan api
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
      console.error("Error pas vote:", error);
    }
  };

  // 🛠️ LOGIKA FILTER ORIGINAL KAMU (DIPASANG ANTI-CRASH AGAR FILM TIDAK HILANG)
  const filteredMovies = Array.isArray(dbMovies)
    ? dbMovies.filter((movie) => {
        const matchSearch = (movie?.title || "")
          .toLowerCase()
          .includes(finalSearch.toLowerCase());

        // Mengembalikan ke properti asli bawaan database kamu (.category)
        const movieGenre = movie?.category || "";
        const matchGenre =
          selectedGenre === "All" ||
          movieGenre.toLowerCase() === selectedGenre.toLowerCase();

        const matchRating = (movie?.rating || 0) >= parseFloat(selectedRating);

        return matchSearch && matchGenre && matchRating;
      })
    : [];

  return (
    <section className="px-10" suppressHydrationWarning>
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

      {/* Grid Layout Sesuai Kodingan Awal Kamu */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-12">
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
          <div className="col-span-full text-center py-20">
            {finalSearch !== "" ? (
              <p className="text-gray-600 italic text-lg">
                Yah, maaf film "{finalSearch}" tidak dapat ditemukan... 🎬
              </p>
            ) : (
              <p className="text-gray-600 italic text-lg">
                Maaf film dengan kriteria ini tidak dapat ditemukan 🎬
              </p>
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