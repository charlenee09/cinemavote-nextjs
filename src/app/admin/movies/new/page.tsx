"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddMovie() {
  const router = useRouter();
  const [formData, setFormData] = useState({ title: "", category: "", year: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("http://localhost:3001/movies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ movie: formData }),
    });
    router.push("/admin/movies"); // Kembali ke daftar film setelah sukses
  };

  return (
    <div className="p-8 text-white">
      <h1 className="text-2xl font-bold mb-4">Tambah Film Baru</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input className="bg-[#222] p-2" placeholder="Judul" onChange={(e) => setFormData({...formData, title: e.target.value})} />
        <input className="bg-[#222] p-2" placeholder="Kategori" onChange={(e) => setFormData({...formData, category: e.target.value})} />
        <input className="bg-[#222] p-2" placeholder="Tahun" onChange={(e) => setFormData({...formData, year: e.target.value})} />
        <button className="bg-green-600 p-2 rounded">Simpan Film</button>
      </form>
    </div>
  );
}