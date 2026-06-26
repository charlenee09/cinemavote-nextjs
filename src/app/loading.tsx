export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      {/* Spinner Bulat Merah Ala CinemaVote */}
      <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-sm font-bold tracking-[0.2em] text-gray-400 uppercase animate-pulse">
        Menyiapkan Tontonan...
      </p>
    </div>
  );
}