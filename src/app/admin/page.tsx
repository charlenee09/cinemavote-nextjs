"use client";
import { useEffect, useState } from "react";
import { adminApi } from "../../api/adminApi";
import Link from "next/link";

export default function AdminDashboard() {
    const [dashboard, setDashboard] = useState({
    movies: 0,
    users: 0,
    admins: 0,
    votes: 0,
  });
        useEffect(() => {
        const fetchDashboard = async () => {
            try {
            const data = await adminApi.getDashboard();
            console.log("Data yang diterima dari Rails:", data); // <--- INI PENTING!
            setDashboard(data);
            } catch (err) {
            console.log("Error:", err);
            }
        };
        fetchDashboard();
        }, []);
        return (
    <div className="min-h-screen bg-[#111] text-white flex">

      {/* Sidebar */}
      <aside className="w-64 bg-black border-r border-gray-800 p-6">

        <h1 className="text-3xl font-black text-red-600 mb-10">
          CINEMAVOTE
        </h1>

        <nav className="space-y-4">

          <Link
            href="/admin"
            className="block hover:text-red-500"
          >
            📊 Dashboard
          </Link>

          <Link
            href="/admin/movies"
            className="block hover:text-red-500"
          >
            🎬 Kelola Film
          </Link>

          <Link
            href="/admin/users"
            className="block hover:text-red-500"
          >
            👤 Kelola User
          </Link>

          <Link
            href="/admin/reviews"
            className="block hover:text-red-500"
          >
            ⭐ Kelola Review
          </Link>

        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 p-10">

        <h2 className="text-4xl font-bold mb-8">
          Dashboard Admin
        </h2>

        <div className="grid grid-cols-4 gap-6">

          <div className="bg-[#1a1a1a] rounded-xl p-6">
            <p className="text-gray-400">Total Film</p>
            <h1 className="text-4xl font-bold mt-3">0</h1>
          </div>

          <div className="bg-[#1a1a1a] rounded-xl p-6">
            <p className="text-gray-400">Total User</p>
            <h1 className="text-4xl font-bold mt-3">0</h1>
          </div>

          <div className="bg-[#1a1a1a] rounded-xl p-6">
            <p className="text-gray-400">Total Review</p>
            <h1 className="text-4xl font-bold mt-3">0</h1>
          </div>

          <div className="bg-[#1a1a1a] rounded-xl p-6">
            <p className="text-gray-400">Total Vote</p>
            <h1 className="text-4xl font-bold mt-3">0</h1>
          </div>

        </div>

      </main>

    </div>
  );
}