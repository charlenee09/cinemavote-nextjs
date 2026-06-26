"use client";

export default function SearchBar({ onSearch }) {
  // Fungsi untuk mencegah refresh saat tekan Enter
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); 
    }
  };

  return (
    <div className="max-w-md mx-auto mb-10 px-4">
      <input
        type="text"
        placeholder="Cari judul film...."
        className="w-full p-4 bg-gray-900 border border-gray-800 rounded-full text-white outline-none focus:border-red-600 transition-all shadow-lg"
        onChange={(e) => onSearch(e.target.value)}
        onKeyDown={handleKeyDown} // Tambahkan ini agar aman dari Enter
      />
      
    </div>
  );
}