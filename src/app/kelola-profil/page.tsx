"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function KelolaProfilPage() {
  const router = useRouter();

  const [userData, setUserData] = useState({
    username: "",
    email: "",
    tglLahir: "",
  });

  // Ambil data dari localStorage
  useEffect(() => {
    const saved = localStorage.getItem("userTercatat");

    if (saved) {
      setUserData(JSON.parse(saved));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("userTercatat", JSON.stringify(userData));

    alert("Profil berhasil diperbarui!");

    // BALIK KE HALAMAN SEBELUMNYA
    router.back();
  };

  return (
    <section className="min-h-screen bg-black flex items-center justify-center px-5">
      <div className="bg-white text-black p-8 rounded-xl w-full max-w-md shadow-2xl">
        
        <h1 className="text-2xl font-black mb-6 border-b pb-3">
          Kelola Profil
        </h1>

        <div className="space-y-5">

          <div>
            <label className="text-xs font-bold uppercase text-gray-500">
              Username
            </label>

            <input
              type="text"
              value={userData.username}
              onChange={(e) =>
                setUserData({
                  ...userData,
                  username: e.target.value,
                })
              }
              className="w-full border border-gray-300 rounded-lg p-3 mt-1 outline-none focus:border-red-600"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-gray-500">
              Email
            </label>

            <input
              type="email"
              value={userData.email}
              onChange={(e) =>
                setUserData({
                  ...userData,
                  email: e.target.value,
                })
              }
              className="w-full border border-gray-300 rounded-lg p-3 mt-1 outline-none focus:border-red-600"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-gray-500">
              Tanggal Lahir
            </label>

            <input
              type="date"
              value={userData.tglLahir}
              onChange={(e) =>
                setUserData({
                  ...userData,
                  tglLahir: e.target.value,
                })
              }
              className="w-full border border-gray-300 rounded-lg p-3 mt-1 outline-none focus:border-red-600"
            />
          </div>

        </div>

        <div className="flex justify-end mt-8">
          <button
            onClick={handleSave}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold transition"
          >
            Simpan
          </button>
        </div>

      </div>
    </section>
  );
}