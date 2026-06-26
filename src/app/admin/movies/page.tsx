"use client";

import { useEffect, useState } from "react";

interface Movie {
  id: number;
  title: string;
  category: string;
  image: string;
  year: number;
  rating: number;
  trailer_id: string;
  synopsis: string;
}

export default function AdminMovies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  // State Modal
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
const [category, setCategory] = useState("");
const [year, setYear] = useState("");
const [rating, setRating] = useState("");
const [image, setImage] = useState("");
const [trailerId, setTrailerId] = useState("");
const [synopsis, setSynopsis] = useState("");

  const fetchMovies = async () => {
    try {
      const res = await fetch("http://localhost:3001/movies");
      const data = await res.json();

      console.log("Data dari Rails:", data);

      if (Array.isArray(data)) {
        setMovies(data);
      } else {
        setMovies([]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const deleteMovie = async (id: number) => {
    if (!confirm("Yakin ingin menghapus film ini?")) return;

    try {
      await fetch(`http://localhost:3001/movies/${id}`, {
        method: "DELETE",
      });

      setMovies((prev) => prev.filter((movie) => movie.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const addMovie = async () => {
  try {
    const res = await fetch("http://localhost:3001/movies", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        movie: {
          title,
          category,
          year: Number(year),
          rating: Number(rating),
          image,
          trailer_id: trailerId,
          synopsis,
        },
      }),
    });

    if (!res.ok) {
      throw new Error("Gagal menambahkan film");
    }

    await fetchMovies();

    setShowModal(false);

    setTitle("");
    setCategory("");
    setYear("");
    setRating("");
    setImage("");
    setTrailerId("");
    setSynopsis("");
  } catch (error) {
    console.error(error);
  }
};

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-[#111]">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-8 min-h-screen bg-[#111] text-white">

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          Kelola Film
        </h1>

        <button
          onClick={() => setShowModal(true)}
          className="bg-red-600 hover:bg-red-700 transition px-5 py-2 rounded-lg font-semibold"
        >
          + Tambah Film
        </button>
      </div>

      <table className="w-full rounded-lg overflow-hidden bg-[#222]">

        <thead className="bg-[#333]">

          <tr>

            <th className="text-left p-4">
              Judul
            </th>

            <th className="text-left p-4">
              Kategori
            </th>

            <th className="text-left p-4">
              Tahun
            </th>

            <th className="text-left p-4">
              Rating
            </th>

            <th className="text-left p-4">
              Image
            </th>

            <th className="text-left p-4">
              Trailer ID
            </th>

            <th className="text-center p-4">
              Synopsis
            </th>

            <th className="text-center p-4">
              Aksi
            </th>

          </tr>

        </thead>

        <tbody>

          {movies.map((movie) => (

            <tr
              key={movie.id}
              className="border-b border-gray-700 hover:bg-[#333]"
            >

              <td className="p-4">
                {movie.title}
              </td>

              <td className="p-4">
                {movie.category}
              </td>

              <td className="p-4">
                {movie.year}
              </td>
               <td className="p-4">
                ⭐ {movie.rating}
              </td>
               <td className="p-4">
                <img
                    src={movie.image}
                    alt={movie.title}
                    className="w-16 h-24 object-cover rounded"
                />
                </td>
               <td className="p-4">
                <a
                    href={`https://www.youtube.com/watch?v=${movie.trailer_id}`}
                    target="_blank"
                    className="text-blue-400 underline"
                >
                    Lihat Trailer
                </a>
                </td>
               <td className="p-4 max-w-xs truncate">
                {movie.synopsis}
                </td>
              <td className="text-center p-4">

                <button
                  onClick={() => deleteMovie(movie.id)}
                  className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
                >
                  Hapus
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

      {/* Modal */}

      {showModal && (

        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">

          <div className="bg-white text-black rounded-lg p-6 w-[400px]">

            <h2 className="text-2xl font-bold mb-5">
              Tambah Film
            </h2>

            <input
            type="text"
            placeholder="Judul Film"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-2 rounded mb-3"
            />

            <input
            type="text"
            placeholder="Kategori"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border p-2 rounded mb-3"
            />
            <input
            type="number"
            step="0.1"
            placeholder="Rating"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="w-full border p-2 rounded mb-3"
            />

            <input
            type="number"
            placeholder="Tahun"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full border p-2 rounded mb-3"
            />

            <textarea
            placeholder="Synopsis"
            value={synopsis}
            onChange={(e) => setSynopsis(e.target.value)}
            className="w-full border p-2 rounded mb-5 h-24 resize-none"
            />

            <input
            type="text"
            placeholder="Image URL"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="w-full border p-2 rounded mb-3"
            />

            <input
            type="text"
            placeholder="Trailer ID"
            value={trailerId}
            onChange={(e) => setTrailerId(e.target.value)}
            className="w-full border p-2 rounded mb-3"
            />

            <div className="flex justify-end gap-3">

              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Batal
              </button>

             <button
            onClick={addMovie}
            className="bg-red-600 text-white px-4 py-2 rounded"
            >
            Simpan
            </button>
            </div>

          </div>

        </div>

      )}

    </div>
  );
}