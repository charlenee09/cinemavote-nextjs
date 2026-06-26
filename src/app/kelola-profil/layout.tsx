export const metadata = {
  title: "Kelola Profil | CinemaVote",
  description: "Halaman untuk mengelola profil pengguna CinemaVote",
};

export default function KelolaProfilLayout({ children }) {
  return (
    <section className="bg-black min-h-screen text-white">
      {children}
    </section>
  );
}