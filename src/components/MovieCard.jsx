"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link'; // Import ini wajib untuk pindah halaman

export default function MovieCard({ movie, onOpenDetail }) {
  const [votes, setVotes] = useState(0);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    const savedVotes = localStorage.getItem(`votes-${movie.id}`) || 0;
    const votedStatus = localStorage.getItem(`hasVoted-${movie.id}`) === 'true';
    setVotes(parseInt(savedVotes));
    setHasVoted(votedStatus);
  }, [movie.id]);

  const handleVote = () => {
    if (!hasVoted) {
      const newVoteCount = votes + 1;
      setVotes(newVoteCount);
      setHasVoted(true);
      localStorage.setItem(`votes-${movie.id}`, newVoteCount);
      localStorage.setItem(`hasVoted-${movie.id}`, 'true');
    }
  };
  
  const addToWatchlist = () => {
    const currentWatchlist = JSON.parse(localStorage.getItem("myWatchlist") || "[]");
    const isExist = currentWatchlist.find((item) => item.id === movie.id);

    if (!isExist) {
      const updatedWatchlist = [...currentWatchlist, movie];
      localStorage.setItem("myWatchlist", JSON.stringify(updatedWatchlist));
      alert(`${movie.title} berhasil ditambah ke Watchlist!`);
    } else {
      alert("Film ini sudah ada di daftar kamu.");
    }
  };
  
  return (
    <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-red-600 transition-all shadow-lg group">
      
      {/* Bagian Poster - SEKARANG LANGSUNG PINDAH KE HALAMAN BARU */}
      <div className="relative overflow-hidden h-64">
        <img 
          src={movie.image} 
          alt={movie.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition duration-300" 
        />

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40">
          {/* TANDAI: Link ini yang bakal bikin layar pindah ke halaman besar */}
          <Link 
            href={`/watch/${movie.trailerId}`} 
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
            <button onClick={addToWatchlist} className="w-12 h-12 border-2 border-gray-500 text-white rounded-full flex items-center justify-center hover:border-white hover:bg-white/10 transition">
              <span className="text-xl font-medium leading-none">+</span>
            </button>
            <button onClick={() => onOpenDetail(movie)} className="border border-gray-600 rounded-full w-12 h-12 flex items-center justify-center text-white hover:bg-gray-700 transition">
              ▼
            </button>
          </div>
        </div>

        <p className="text-yellow-500 text-sm mt-1">⭐ {movie.rating}</p>

        <button 
          onClick={handleVote} 
          disabled={hasVoted}
          className={`w-full mt-4 py-2 rounded font-bold text-sm text-white transition italic uppercase
            ${hasVoted ? 'bg-gray-700 cursor-not-allowed opacity-70' : 'bg-red-600 hover:bg-red-700 active:scale-95'}`}
        >
          {hasVoted ? `VOTED (${votes})` : `VOTE (${votes})`}
        </button>
      </div>
    </div>
  );
}