import React from 'react'
import { Search, Calendar, Filter, Building2 } from 'lucide-react'

const SearchFilterBar = ({
  query,
  setQuery,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  selectedBranch,
  setSelectedBranch,
  branches = [],
  user,
  onFilter,
  onSearch,
  onKeyDown
}) => {
  return (
    <div className="bg-slate-800/60 border border-slate-700/50 p-4 sm:p-6 rounded-2xl backdrop-blur-sm shadow-xl flex flex-col gap-4">
      
      {/* Baris Pertama: Filter Cabang & Rentang Tanggal (Stack ke bawah di layar kecil) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        
        {/* Pilihan Cabang (Admin Only) */}
        {user?.role === 'admin' && branches.length > 0 && (
          <div className="flex items-center gap-2.5 bg-slate-900/90 border border-slate-700 px-3.5 py-2.5 rounded-xl shadow-inner w-full sm:w-72 shrink-0">
            <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="bg-transparent text-slate-200 text-xs sm:text-sm focus:outline-none [color-scheme:dark] cursor-pointer w-full pr-2"
            >
              <option value="" className="bg-slate-900 text-slate-200">Semua Cabang</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id} className="bg-slate-900 text-slate-200">
                  {branch.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Grup Tanggal (Mulai & Selesai - Stack ke bawah di layar kecil) */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto sm:ml-auto">
          
          {/* Tanggal Mulai */}
          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-700 px-3.5 py-2.5 rounded-xl shadow-inner w-full sm:w-auto">
            <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-transparent text-slate-200 text-xs sm:text-sm focus:outline-none [color-scheme:dark] w-full"
            />
          </div>

          {/* Pemisah s/d (Hidden di mobile agar tidak mengganggu layout satu kolom) */}
          <span className="hidden sm:inline text-slate-500 text-xs font-medium px-0.5 shrink-0">s/d</span>

          {/* Tanggal Selesai */}
          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-700 px-3.5 py-2.5 rounded-xl shadow-inner w-full sm:w-auto">
            <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-transparent text-slate-200 text-xs sm:text-sm focus:outline-none [color-scheme:dark] w-full"
            />
          </div>

        </div>

      </div>

      {/* Baris Kedua: Kolom Input Pencarian & Tombol Aksi */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        
        {/* Input Pencarian Utama */}
        <div className="relative flex-1 w-full">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Cari kode, nama, atau kategori..."
            className="w-full pl-11 pr-4 py-3 bg-slate-900/90 border border-slate-700 rounded-xl text-slate-100 text-sm sm:text-base placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-inner"
          />
        </div>

        {/* Grup Tombol Aksi (Filter & Cari - Tetap 2 kolom sejajar) */}
        <div className="grid grid-cols-2 sm:flex items-center gap-2.5 shrink-0">
          <button
            onClick={onFilter}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-3 bg-slate-700 hover:bg-slate-600 active:scale-95 text-slate-200 text-xs sm:text-sm font-medium rounded-xl transition-all shadow-md"
          >
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>

          <button
            onClick={() => onSearch()}
            className="inline-flex items-center justify-center gap-1.5 px-5 py-3 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs sm:text-sm font-medium rounded-xl transition-all shadow-md shadow-indigo-600/20"
          >
            <Search className="w-4 h-4" />
            <span>Cari</span>
          </button>
        </div>

      </div>

    </div>
  )
}

export default SearchFilterBar