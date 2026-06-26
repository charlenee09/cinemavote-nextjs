// src/api/adminApi.ts

import { BASE_URL } from "./baseUrl";

export const adminApi = {
  // Dashboard Admin
  getDashboard: async () => {
    const res = await fetch(`${BASE_URL}/admin/dashboard`);

    if (!res.ok) {
      throw new Error("Gagal memuat dashboard admin");
    }

    return res.json();
  },

  // Ambil semua user
  getUsers: async () => {
    const res = await fetch(`${BASE_URL}/admin/users`);

    if (!res.ok) {
      throw new Error("Gagal memuat data user");
    }

    return res.json();
  },

  // Ambil semua review
  getReviews: async () => {
    const res = await fetch(`${BASE_URL}/admin/reviews`);

    if (!res.ok) {
      throw new Error("Gagal memuat data review");
    }

    return res.json();
  },

  // Ambil semua film
  getMovies: async () => {
    const res = await fetch(`${BASE_URL}/movies`);

    if (!res.ok) {
      throw new Error("Gagal memuat data film");
    }

    return res.json();
  },

  // Tambah film
  createMovie: async (movie: any) => {
    const res = await fetch(`${BASE_URL}/movies`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ movie }),
    });

    if (!res.ok) {
      throw new Error("Gagal menambah film");
    }

    return res.json();
  },

  // Edit film
  updateMovie: async (id: number, movie: any) => {
    const res = await fetch(`${BASE_URL}/movies/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ movie }),
    });

    if (!res.ok) {
      throw new Error("Gagal mengubah film");
    }

    return res.json();
  },

  // Hapus film
  deleteMovie: async (id: number) => {
    const res = await fetch(`${BASE_URL}/movies/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error("Gagal menghapus film");
    }

    return res.json();
  },
};