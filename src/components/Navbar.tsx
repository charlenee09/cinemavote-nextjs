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
  username: "",
  email: "",
  password: "",
  tglLahir: "",
  role: ""
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
  const handleSignup = async () => {
    try {
      const res = await fetch("http://localhost:3001/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: {
            username: userData.username,
            email: userData.email,
            password: userData.password,
            tgl_lahir: userData.tglLahir,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert("Berhasil daftar!");

      setIsLoggedIn(true);
      setShowLoginForm(false);
      setUserData(data.user);

      localStorage.setItem(
        "userTercatat",
        JSON.stringify(data.user)
      );

    } catch (err) {
      console.log(err);
      alert("Server Rails tidak bisa dihubungi");
    }
  };

  // =========================
  // TARUH HANDLE LOGIN DI SINI
  // =========================

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userData.email,
          password: userData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert("Login berhasil!");

      setIsLoggedIn(true);
      setShowLoginForm(false);
      setUserData(data.user);

      localStorage.setItem(
        "userTercatat",
        JSON.stringify(data.user)
      );

      // 🔥 CEK ROLE
      if (data.user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }

    } catch (err) {
      console.log(err);
      alert("Server Rails tidak bisa dihubungi");
    }
  };

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
        // DI SINI KITA KEMBALIKAN TOMBOL SIGN-IN DAN SIGN-UP BIAR BERJALAN BERSAMAAN
        <div className="flex items-center space-x-6 pr-4">
          <button
            onClick={() => {
              setIsLoginView(true); // Pastikan modal yang terbuka versinya Sign In
              setShowLoginForm(true);
            }}
            className="text-sm font-bold text-gray-300 hover:text-white transition cursor-pointer"
          >
            Sign-in
          </button>
          
          <button
            onClick={() => {
              setIsLoginView(false); // Pastikan modal yang terbuka versinya Sign Up
              setShowLoginForm(true);
            }}
            className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-2 rounded transition cursor-pointer shadow-md"
          >
            Sign-up
          </button>
        </div>

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
              {userData.role === "admin" && (
  <Link
    href="/admin"
    onClick={() => setShowProfile(false)}
    className="block w-full text-left px-4 py-2 text-[11px] hover:underline"
  >
    🛠 Dashboard Admin
  </Link>
)}
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

{/* MODAL LOGIN & SIGN UP */}
{showLoginForm && (
  <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[9999]">
    <div className="bg-[#141414] p-10 rounded-md w-96 border border-gray-800 relative shadow-2xl transition-all duration-300">

      <button
        onClick={() => setShowLoginForm(false)}
        className="absolute top-4 right-4 text-gray-500 hover:text-white transition cursor-pointer text-sm"
      >
        ✕
      </button>

      <h2 className="text-3xl font-bold mb-6 text-white tracking-tight">
        {isLoginView ? "Sign In" : "Sign Up"}
      </h2>

      {/* 1. INPUT USERNAME (Cuma muncul pas Sign Up) */}
      {!isLoginView && (
        <div className="mb-4">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Nama Lengkap</label>
          <input
            type="text"
            placeholder="Masukkan nama lengkap..."
            value={userData.username || ""}
            onChange={(e) => setUserData({ ...userData, username: e.target.value })}
            className="w-full p-3 bg-[#333] rounded text-white text-sm outline-none border border-transparent focus:border-red-600 transition"
          />
        </div>
      )}

      {/* 2. INPUT EMAIL (Muncul di dua-duanya) */}
      <div className="mb-4">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Alamat Email</label>
        <input
          type="email"
          placeholder="@gmail.com"
          value={userData.email || ""}
          onChange={(e) => setUserData({ ...userData, email: e.target.value })}
          className="w-full p-3 bg-[#333] rounded text-white text-sm outline-none border border-transparent focus:border-red-600 transition"
        />
      </div>

      {/* 3. INPUT PASSWORD (Muncul di dua-duanya) */}
      <div className="mb-4">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Kata Sandi</label>
      <input
        type="password"
        value={userData.password || ""}
        onChange={(e) =>
          setUserData({
            ...userData,
            password: e.target.value,
          })
        }
        className="w-full p-3 bg-[#333] rounded text-white text-sm outline-none border border-transparent focus:border-red-600 transition"
      />
      </div>

      {/* 4. INPUT TANGGAL LAHIR (Cuma muncul pas Sign Up) */}
      {!isLoginView && (
        <div className="mb-6">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Tanggal Lahir</label>
          <input
            type="date"
            value={userData.tglLahir || ""}
            onChange={(e) => setUserData({ ...userData, tglLahir: e.target.value })}
            className="w-full p-3 bg-[#333] rounded text-white text-sm outline-none border border-transparent focus:border-red-600 transition uppercase"
          />
        </div>
      )}

      {/* TOMBOL AKSI UTAMA */}
      <button
        onClick={() => {
          if (isLoginView) {
            handleLogin();
          } else {
            handleSignup();
          }
        }}
        className="w-full bg-red-600 py-3 rounded font-bold hover:bg-red-700 transition uppercase text-sm tracking-wider shadow-lg cursor-pointer"
      >
        {isLoginView ? "Masuk" : "Daftar Akun"}
      </button>

      {/* NAVIGASI PINDAH MODE DI DALAM MODAL */}
      <p className="text-xs text-gray-500 text-center mt-4">
        {isLoginView ? "Belum punya akun CinemaVote? " : "Sudah punya akun? "}
        <span 
          onClick={() => setIsLoginView(!isLoginView)}
          className="text-white hover:underline cursor-pointer font-bold transition ml-1"
        >
          {isLoginView ? "Daftar sekarang" : "Login disini"}
        </span>
      </p>

    </div>
  </div>
)}

    </nav>
  );
}