export const metadata = {
  title: 'CinemaVote - Player',
  description: 'Selamat menonton tayangan pilihan Anda di CinemaVote',
};

export default function WatchLayout({ children }) {
  return (
    <section className="bg-black min-h-screen w-full p-0 m-0">
      {/* children ini bertugas memanggil file page.js video player yang kita buat tadi */}
      {children}
    </section>
  );
}