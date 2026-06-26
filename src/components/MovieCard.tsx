"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
// 1. 🚀 TAMBAHKAN IMPORT JEMBATAN DI SINI
import { movieApi } from '../api/movieApi';

interface MovieCardProps {
  movie: any;
  onOpenDetail: (data: any) => void;
  onVote: (movieId: number) => void;
  isWatchlistPage?: boolean; 
}

export default function MovieCard({ movie, onOpenDetail, onVote, isWatchlistPage = false }: MovieCardProps) {
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    const votedStatus = localStorage.getItem(`hasVoted-${movie.id}`) === 'true';
    setHasVoted(votedStatus);
  }, [movie.id]);

  const handleVoteClick = () => {
    if (!hasVoted) {
      onVote(movie.id);
      setHasVoted(true);
      localStorage.setItem(`hasVoted-${movie.id}`, 'true');
    }
  };
  
  // 2. 🛠️ GANTI FUNGSI INI JADI SUPER RINGKAS LEWAT JEMBATAN API
  const addToWatchlist = async () => {
    try {
      // Panggil fungsi toggleWatchlist yang ada di dalam movieApi
      const data = await movieApi.toggleWatchlist(movie.id);
      alert(data.message); 
      
      if (isWatchlistPage) {
        window.location.reload();
      }
    } catch (error) {
      console.error("Error pas klik watchlist:", error);
    }
  };
  
  return (
    <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-red-600 transition-all shadow-lg group">
      
      <div className="relative overflow-hidden h-64">
        <img 
          src={movie.image} 
          alt={movie.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition duration-300" 
        />

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40">
          <Link 
            href={`/watch/${movie.id}`} 
            className="w-14 h-14 border-4 border-white rounded-full flex items-center justify-center bg-black/20 hover:scale-110 transition cursor-pointer"
          >
            <span className="text-white text-2xl ml-1">▶</span>
          </Link>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between">
          <h3 className="text-white font-bold text-sm h-[32px] line-clamp-2 mb-2">{movie.title}</h3>
          
          <div className="flex items-center space-x-3 ml-2">
            
            <button 
              onClick={addToWatchlist} 
              className={`w-12 h-12 border-2 rounded-full flex items-center justify-center transition
                ${isWatchlistPage 
                  ? 'border-red-500 text-red-500 hover:bg-red-500/20' 
                  : 'border-gray-500 text-white hover:border-white hover:bg-white/10'}`}
            >
              <span className="text-xl font-medium leading-none">
                {isWatchlistPage ? "✕" : "+"}
              </span>
            </button>

            <button onClick={() => onOpenDetail(movie)} className="border border-gray-600 rounded-full w-12 h-12 flex items-center justify-center text-white hover:bg-gray-700 transition">
              ▼
            </button>
          </div>
        </div>

        <p className="text-yellow-500 text-sm mt-1">⭐ {movie.rating}</p>

        <button 
          onClick={handleVoteClick} 
          disabled={hasVoted}
          className={`w-full mt-4 py-2 rounded font-bold text-sm text-white transition italic uppercase
            ${hasVoted ? 'bg-gray-700 cursor-not-allowed opacity-70' : 'bg-red-600 hover:bg-red-700 active:scale-95'}`}
        >
          {hasVoted ? "VOTED" : "VOTE"}
        </button>
      </div>
    </div>
  );
}