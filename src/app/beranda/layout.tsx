export const metadata = {
  title: 'CinemaVote - Beranda',
  description: 'Temukan, tonton trailer, dan berikan vote untuk film-film terbaik pilihanmu hanya di CinemaVote!',
};

// Pastikan huruf B di BerandaLayout memakai HURUF KAPITAL agar dibaca sebagai React Component
export default function BerandaLayout({ children }) {
  return (
    <div className="bg-black min-h-screen text-white">
      {children}
    </div>
  );
}