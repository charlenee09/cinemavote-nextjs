"use client";
import { useState, useEffect } from 'react';

// 1. Definisikan tipe Props untuk TypeScript agar bebas dari error merah
interface DetailModalProps {
  movie: any;
  onClose: () => void;
  onVote: (movieId: number) => void; // 👈 Tambahkan ini
}

export default function DetailModal({ movie, onClose, onVote }: DetailModalProps) {
  const [userRating, setUserRating] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [comment, setComment] = useState("");
  const [allReviews, setAllReviews] = useState<any[]>([]);
  const [hasVoted, setHasVoted] = useState(false); // 👈 State untuk lacak status tombol vote

  useEffect(() => {
    if (!movie) return;

    // 1. Ambil Watchlist
    const currentWatchlist = JSON.parse(localStorage.getItem("watchlist") || "[]");
    setIsSaved(currentWatchlist.some(m => m.id === movie.id));

    // 2. AMBIL RATING YANG PERNAH DISIMPAN
    const savedRating = localStorage.getItem(`rating-${movie.id}`);
    if (savedRating) setUserRating(parseInt(savedRating));

    // 3. AMBIL DAFTAR REVIEW
    const savedReviews = JSON.parse(localStorage.getItem(`reviews-${movie.id}`) || "[]");
    setAllReviews(savedReviews);

    // 4. AMBIL STATUS VOTE DARI LOCALSTORAGE
    const votedStatus = localStorage.getItem(`hasVoted-${movie.id}`) === 'true';
    setHasVoted(votedStatus);
  }, [movie]);

  // Fungsi memicu vote global ke Rails Backend
  const handleVoteClick = () => {
    if (!hasVoted) {
      onVote(movie.id); // Tembak API di HomePage
      setHasVoted(true);
      localStorage.setItem(`hasVoted-${movie.id}`, 'true');
    }
  };

  // Fungsi Simpan Rating ke LocalStorage
  const handleRatingChange = (val: any) => {
    setUserRating(parseInt(val));
    localStorage.setItem(`rating-${movie.id}`, val); // Biar kesimpan!
  };

  const handleWatchlist = () => {
    let currentWatchlist = JSON.parse(localStorage.getItem("watchlist") || "[]");
    if (isSaved) {
      currentWatchlist = currentWatchlist.filter((m: any) => m.id !== movie.id);
      setIsSaved(false);
    } else {
      currentWatchlist.push(movie);
      setIsSaved(true);
    }
    localStorage.setItem("watchlist", JSON.stringify(currentWatchlist));
    window.dispatchEvent(new Event("storage"));
  };

  const handleSendReview = () => {
    if (comment.trim() === "") return;
    const newReview = {
      id: Date.now(),
      user: "Charlene Vanesa Lim", // Nama kamu otomatis
      text: comment,
      date: new Date().toLocaleDateString('id-ID')
    };
    const updatedReviews = [newReview, ...allReviews];
    setAllReviews(updatedReviews);
    localStorage.setItem(`reviews-${movie.id}`, JSON.stringify(updatedReviews));
    setComment("");
  };

  if (!movie) return null;

  return (
    <div className="fixed inset-0 bg-black/90 z-[10000] overflow-y-auto p-4 md:p-10 flex justify-center backdrop-blur-sm">
      <div className="bg-[#141414] w-full max-w-5xl rounded-xl overflow-hidden relative border border-gray-800 h-fit text-white pb-10">
        <button onClick={onClose} className="absolute top-5 right-5 text-2xl z-50 hover:text-red-600 transition">✕</button>

        {/* HEADER AREA (Info Film) */}
        <div className="p-8 flex flex-col md:flex-row gap-8 bg-gradient-to-b from-gray-900 to-[#141414]">
          <img src={movie.image} className="w-64 rounded-lg shadow-2xl border border-gray-700 object-cover" alt={movie.title} />
          <div className="flex-1">
             <div className="flex items-center gap-4 mb-2">
                <h1 className="text-4xl font-black italic uppercase tracking-tighter">{movie.title}</h1>
                <span className="bg-red-600 px-2 py-1 rounded text-[10px] font-bold uppercase">{movie.year}</span>
             </div>
             <p className="text-gray-400 mb-4 text-xs tracking-widest uppercase">
               {Array.isArray(movie.genre) ? movie.genre.join(" • ") : movie.genre}
             </p>
             <div className="flex items-center gap-10 mb-6 bg-black/40 p-4 rounded-xl w-fit border border-white/5 text-center">
                <div>
                   <p className="text-[10px] uppercase text-gray-500 font-bold">Cinemavote Score</p>
                   <p className="text-2xl font-black text-red-500">{movie.votes || 0} Votes</p> {/* 👈 Sekarang menampilkan total vote dari Rails! */}
                </div>
                <div>
                   <p className="text-[10px] uppercase text-gray-500 font-bold">Your Rate</p>
                   <p className="text-2xl font-black text-yellow-500">{userRating > 0 ? `${userRating}/10` : "-"}</p>
                </div>
             </div>

             <div className="flex flex-wrap gap-3">
                <button onClick={handleWatchlist} className={`${isSaved ? 'bg-gray-600' : 'bg-red-600'} px-6 py-2 rounded-full font-bold text-xs hover:scale-105 transition`}>
                  {isSaved ? "✓ IN WATCHLIST" : "+ WATCHLIST"}
                </button>

                {/* 2. TOMBOL VOTE LIVE BACKEND DI DALAM MODAL */}
                <button 
                  onClick={handleVoteClick}
                  disabled={hasVoted}
                  className={`px-6 py-2 rounded-full font-bold text-xs transition uppercase tracking-wider italic
                    ${hasVoted ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700' : 'bg-white text-black hover:bg-gray-200'}`}
                >
                  {hasVoted ? "VOTED" : "VOTE"}
                </button>

                <div className="flex items-center bg-white/10 rounded-full px-4 py-1 gap-2 border border-white/20">
                  <span className="text-[10px] font-bold">RATE:</span>
                  <select 
                    className="bg-transparent text-xs font-bold outline-none cursor-pointer text-white"
                    value={userRating}
                    onChange={(e) => handleRatingChange(e.target.value)}
                  >
                    <option value="0" className="text-black">-</option>
                    {[...Array(10)].map((_, i) => (
                      <option key={i+1} value={i+1} className="text-black">{i+1}</option>
                    ))}
                  </select>
                </div>
             </div>
          </div>
        </div>

        {/* --- BAGIAN SINOPSIS --- */}
        <div className="mt-10 px-8">
          <h3 className="text-red-600 font-bold text-lg uppercase border-l-4 border-red-600 pl-3 mb-4">Sinopsis</h3>
          <p className="text-gray-400 italic text-sm pl-3 leading-relaxed">{movie.synopsis}</p>
        </div>

        {/* --- BAGIAN CAST --- */}
        <div className="mt-10 px-8">
          <h3 className="text-red-600 font-bold text-lg uppercase border-l-4 border-red-600 pl-3 mb-4">Cast / Pemain</h3>
          <div className="flex flex-wrap gap-2 pl-3">
              {movie.cast?.map((player: string, index: number) => (
              <span key={index} className="bg-gray-800 text-white px-4 py-1 rounded-full text-sm border border-gray-700">
                  {player}
              </span>
              ))}
          </div>
        </div>

        {/* --- BAGIAN REVIEW --- */}
        <div className="px-8 mt-10 border-t border-gray-800 pt-8">
          <h3 className="text-lg font-bold mb-6 border-l-4 border-red-600 pl-3 italic uppercase text-red-600">User Reviews</h3>

          {/* Input Komentar */}
          <div className="bg-[#1a1a1a] p-5 rounded-xl border border-gray-800 mb-8">
            <textarea 
              className="w-full bg-[#222] border border-gray-700 rounded-lg p-3 text-sm text-white outline-none focus:border-red-600 transition resize-none"
              rows={3}
              placeholder="Apa pendapatmu tentang film ini?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>
            <div className="flex justify-end mt-3">
              <button onClick={handleSendReview} className="bg-red-600 px-6 py-2 rounded-full font-bold text-[11px] hover:bg-red-700 transition uppercase tracking-widest">
                Post Review
              </button>
            </div>
          </div>

          {/* List Komentar Orang */}
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {allReviews.length > 0 ? (
              allReviews.map((rev) => (
                <div key={rev.id} className="bg-black/40 p-4 rounded-xl border border-white/5">
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-bold text-xs text-red-500 uppercase">{rev.user}</p>
                    <p className="text-[10px] text-gray-500">{rev.date}</p>
                  </div>
                  <p className="text-sm text-gray-300 italic">"{rev.text}"</p>
                </div>
              ))
            ) : (
              <p className="text-gray-600 text-xs italic text-center py-5">Belum ada review. Jadilah yang pertama! 🎬</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}