// src/api/movieApi.ts
import { BASE_URL } from "./baseUrl";

export const movieApi = {
  // 1. Ambil semua data film (Untuk halaman Beranda)
  getAllMovies: async () => {
  const res = await fetch(`${BASE_URL}/movies`);
  
  if (!res.ok) {
    // Kita tangkap detail error dari server
    const errorData = await res.text(); 
    console.error("Detail Error dari Rails:", errorData);
    throw new Error(`Gagal memuat daftar film: ${res.status} ${res.statusText}`);
  }
  
  return res.json();
},

  // 2. 🔥 API BARU: Ambil data berdasarkan kategori (Untuk halaman Film atau Serial)
  getMoviesByCategory: async (category: string) => {
    const res = await fetch(`${BASE_URL}/movies?category=${category}`);
    if (!res.ok) throw new Error(`Gagal memuat data kategori ${category}`);
    return res.json();
  },

  // 3. 🔥 API BARU: Ambil data film terbaru (Untuk halaman Baru)
  getNewMovies: async () => {
    const res = await fetch(`${BASE_URL}/movies/latest`); // sesuaikan dengan route Rails kamu jika ada
    if (!res.ok) throw new Error("Gagal memuat data film terbaru");
    return res.json();
  },

  // 4. Ambil detail 1 film berdasarkan ID (Untuk halaman /watch/[id])
  getMovieById: async (id: string | number) => {
    const res = await fetch(`${BASE_URL}/movies/${id}`);
    if (!res.ok) throw new Error("Film tidak ditemukan");
    return res.json();
  },

  // 5. Kirim Vote Film ke Rails
  voteMovie: async (id: number) => {
    const res = await fetch(`${BASE_URL}/movies/${id}/vote`, {
      method: "PATCH",
    });
    if (!res.ok) throw new Error("Gagal mengirimkan vote");
    return res.json();
  },

  // 6. Tambah atau Hapus dari Watchlist
  toggleWatchlist: async (id: number) => {
    const res = await fetch(`${BASE_URL}/movies/${id}/toggle_watchlist`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) throw new Error("Gagal memperbarui status watchlist");
    return res.json();
  }, // 🔴 Di sini tadi kurang tanda koma, Charl!

  // 7. 🔥 FUNGSI BARU UNTUK SIGN UP (DAFTAR AKUN)
  signUp: async (userData: any) => {
    const res = await fetch(`${BASE_URL}/users`, { 
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData), 
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Gagal mendaftar akun baru");
    }
    return res.json();
  }, // 🔴 Pemisah koma antar fungsi auth

  // 8. 🔥 FUNGSI BARU UNTUK SIGN IN (MASUK AKUN)
  signIn: async (credentials: any) => {
    const res = await fetch(`${BASE_URL}/login`, { 
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials), 
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Email atau password salah");
    }
    return res.json();
  }
}; // 🔴 Penutup objek movieApi tunggal yang rapi