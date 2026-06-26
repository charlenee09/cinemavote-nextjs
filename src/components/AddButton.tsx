"use client";

export default function AddButton({ movie }) {
  const handleAdd = () => {
    if (typeof window !== "undefined") {
      const currentWatchlist = JSON.parse(localStorage.getItem("myWatchlist") || "[]");
      const isExist = currentWatchlist.find((item) => item.id === movie.id);

      if (!isExist) {
        const updatedWatchlist = [...currentWatchlist, movie];
        localStorage.setItem("myWatchlist", JSON.stringify(updatedWatchlist));
        
        // Teriak ke browser kalau ada data baru masuk
        window.dispatchEvent(new Event("storage")); 
        alert(`Berhasil! ${movie.title} masuk daftar.`);
      } else {
        alert("Sudah ada di daftar, Charlene!");
      }
    }
  };

  return (
    <button 
      onClick={handleAdd}
      className="w-12 h-12 border-2 border-gray-500 text-white rounded-full flex items-center justify-center hover:border-white hover:bg-white/10 transition"
    >
      <span className="text-2xl font-medium leading-none">+</span>
    </button>
  );
}