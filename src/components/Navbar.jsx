"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';

const notifications = [
  { id: 1, text: "🔥 Ranking: Interstellar sekarang jadi nomor #1!", time: "Baru saja" },
  { id: 2, text: "🆕 Film 'The Batman' baru aja ditambahin nih.", time: "1 jam lalu" },
  { id: 3, text: "🎬 Wah, genre Sci-Fi lagi trending minggu ini!", time: "3 jam lalu" },
];

export default function Navbar({ searchTerm, setSearchTerm }) {
  const router = useRouter();

  const [showSearch, setShowSearch] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [isLoginView, setIsLoginView] = useState(true);

  // DATA USER
  const [userData, setUserData] = useState({
    username: "Charlene Vanesa Lim",
    email: "charlenevanesalim@gmail.com",
    tglLahir: "2006-7-7"
  });

  const pathname = usePathname();

  const isActive = (path) => pathname === path;

  // Sinkronisasi localStorage
  useEffect(() => {
    const saved = localStorage.getItem('userTercatat');

    if (saved) {
      setUserData(JSON.parse(saved));
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <nav className="bg-black text-white p-4 sticky top-0 z-50 flex items-center justify-between px-10 border-b border-gray-900 font-sans">

      {/* SISI KIRI */}
      <div className="flex items-center space-x-6">

        <Link
          href="/"
          className="text-red-600 font-black text-2xl tracking-tighter mr-4 italic uppercase"
        >
          CINEMAVOTE
        </Link>

        <div className="hidden md:flex space-x-5 text-sm items-center font-light">

          <Link
            href="/"
            className={`transition ${isActive('/') ? 'text-white font-bold' : 'text-gray-400 hover:text-white'}`}
          >
            Beranda
          </Link>

          <Link
            href="/serial"
            className={`transition ${isActive('/serial') ? 'text-white font-bold' : 'text-gray-400 hover:text-white'}`}
          >
            Serial
          </Link>

          <Link
            href="/film"
            className={`transition ${isActive('/film') ? 'text-white font-bold' : 'text-gray-400 hover:text-white'}`}
          >
            Film
          </Link>

          <Link
            href="/baru"
            className={`transition ${isActive('/baru') ? 'text-white font-bold' : 'text-gray-400 hover:text-white'}`}
          >
            Baru & Populer
          </Link>

          <Link
            href="/ranking"
            className={`transition ${isActive('/ranking') ? 'text-white font-bold' : 'text-gray-400 hover:text-white'}`}
          >
            Ranking
          </Link>

          <Link
            href="/watchlist"
            className={`transition ${isActive('/watchlist') ? 'text-white font-bold' : 'text-gray-400 hover:text-white'}`}
          >
            Watchlist
          </Link>

        </div>
      </div>

      {/* SISI KANAN */}
      <div className="flex items-center space-x-6 relative">

        {/* SEARCH */}
        <button
          onClick={() => setShowSearch(!showSearch)}
          className="text-xl hover:scale-110 transition"
        >
          🔍
        </button>

        {showSearch && (
          <div className="absolute right-55 top-1/2 -translate-y-1/2 z-[1000]">

            <div className="flex items-center bg-[#141414] border border-gray-600 rounded-md px-3 py-2 w-[240px] shadow-2xl">

              <input
                type="text"
                placeholder="Cari judul..."
                onChange={(e) => {
                  router.push(`${pathname}?search=${e.target.value}`);
                }}
                className="bg-transparent text-gray-300 text-[13px] w-full outline-none placeholder-gray-500"
              />

              <button
                onClick={() => setShowSearch(false)}
                className="text-gray-500 hover:text-white ml-2"
              >
                ✕
              </button>

            </div>
          </div>
        )}

        {/* NOTIFIKASI */}
        <div className="relative">

          <button
            onClick={() => setShowNotif(!showNotif)}
            className="focus:outline-none hover:scale-110 transition relative pt-1"
          >
            <span className="text-2xl">🔔</span>

            <span className="absolute top-0 -right-2 bg-red-600 text-[10px] text-white font-bold px-1.5 py-0.5 rounded-full">
              {notifications.length}
            </span>
          </button>

          {showNotif && (
            <div className="absolute right-0 mt-4 w-72 bg-[#121212] border border-gray-800 rounded-lg shadow-2xl z-[999] overflow-hidden">

              <div className="p-3 border-b border-gray-800 bg-[#1a1a1a]">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Update Terbaru
                </h3>
              </div>

              <div className="max-h-60 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="p-4 border-b border-gray-900 hover:bg-[#1a1a1a] transition cursor-pointer"
                  >
                    <p className="text-xs text-gray-200 leading-relaxed">
                      {n.text}
                    </p>

                    <span className="text-[9px] text-gray-600 mt-2 block font-bold uppercase">
                      {n.time}
                    </span>
                  </div>
                ))}
              </div>

            </div>
          )}
        </div>

        {/* PROFILE */}
        <div className="relative flex items-center border-l border-gray-700 pl-6">

          {!isLoggedIn ? (

            <button
              onClick={() => setShowLoginForm(true)}
              className="text-sm font-medium hover:text-red-600 transition"
            >
              Sign-in
            </button>

          ) : (

            <div className="relative">

              <button
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center space-x-2 group"
              >

                <div className="w-8 h-8 rounded-sm overflow-hidden border border-gray-700">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png"
                    alt="Profile"
                  />
                </div>

                <span className="text-[12px] font-bold group-hover:text-white transition">
                  {userData.username}
                </span>

              </button>

              {showProfile && (
                <div className="absolute right-0 top-10 w-48 bg-black border border-gray-800 py-2 z-[1000] shadow-2xl text-white">

                  <Link
                    href="/kelola-profil"
                    onClick={() => setShowProfile(false)}
                    className="block w-full text-left px-4 py-2 text-[11px] hover:underline"
                  >
                    ✏️ Kelola Profil
                  </Link>

                  <button
                    onClick={() => {
                      setIsLoggedIn(false);
                      localStorage.removeItem('userTercatat');
                    }}
                    className="w-full text-left px-4 py-2 text-[11px] text-red-500 hover:underline"
                  >
                    Keluar
                  </button>

                </div>
              )}

            </div>
          )}
        </div>
      </div>

      {/* MODAL LOGIN */}
      {showLoginForm && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[9999]">

          <div className="bg-[#141414] p-10 rounded-md w-96 border border-gray-800 relative shadow-2xl">

            <h2 className="text-3xl font-bold mb-6 text-white">
              {isLoginView ? "Sign In" : "Sign Up"}
            </h2>

            <input
              type="text"
              placeholder="Email"
              value={userData.email}
              onChange={(e) =>
                setUserData({
                  ...userData,
                  email: e.target.value
                })
              }
              className="w-full p-3 mb-4 bg-[#333] rounded text-white outline-none border border-transparent focus:border-red-600"
            />

            <button
              onClick={() => {
                setIsLoggedIn(true);
                setShowLoginForm(false);

                localStorage.setItem(
                  'userTercatat',
                  JSON.stringify(userData)
                );
              }}
              className="w-full bg-red-600 py-3 rounded font-bold hover:bg-red-700 transition uppercase"
            >
              {isLoginView ? "Masuk" : "Daftar"}
            </button>

            <button
              onClick={() => setShowLoginForm(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white"
            >
              ✕
            </button>

          </div>
        </div>
      )}

    </nav>
  );
}