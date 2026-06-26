export const metadata = {
  title: 'CinemaVote - My Watchlist',
  description: 'Daftar film dan serial favorit pilihan Charlene yang siap untuk ditonton nanti.',
};

export default function WatchlistLayout({ children }) {
  return (
    <div className="bg-black min-h-screen text-white">
      {/* Memanggil halaman utama daftar watchlist (page.js milik folder watchlist) */}
      {children}
    </div>
  );
}