import React from 'react';
import { Search, Calendar, Filter, Building2 } from 'lucide-react';

export default function TransactionFilter({ 
  query, 
  setQuery, 
  branchId, 
  setBranchId, 
  branches, 
  startDate, 
  setStartDate, 
  endDate, 
  setEndDate, 
  handleFilter,
  user 
}) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 md:p-5 mb-6 shadow-xl flex flex-col gap-4">
      
      {/* Baris Pertama: Filter Cabang & Rentang Tanggal */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        
        {/* Pilihan Cabang (Admin Only) */}
        {user?.role === 'admin' && branches?.length > 0 && (
          <div className="flex items-center gap-2.5 bg-gray-800 border border-gray-700 px-3.5 py-2.5 rounded-xl shadow-inner w-full sm:w-72 shrink-0">
            <Building2 className="w-4 h-4 text-gray-400 shrink-0" />
            <select
              value={branchId}
              onChange={(e) => setBranchId(e.target.value)}
              className="bg-transparent text-gray-200 text-xs sm:text-sm focus:outline-none [color-scheme:dark] cursor-pointer w-full pr-2"
            >
              <option value="" className="bg-gray-900 text-gray-200">Semua Cabang</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id} className="bg-gray-900 text-gray-200">
                  {branch.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Grup Tanggal (Mulai & Selesai) */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto sm:ml-auto">
          
          {/* Tanggal Mulai */}
          <div className="flex items-center gap-2 bg-gray-800 border border-gray-700 px-3.5 py-2.5 rounded-xl shadow-inner w-full sm:w-auto">
            <Calendar className="w-4 h-4 text-indigo-400 shrink-0" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-transparent text-gray-200 text-xs sm:text-sm focus:outline-none [color-scheme:dark] w-full"
            />
          </div>

          {/* Pemisah s/d */}
          <span className="hidden sm:inline text-gray-500 text-xs font-medium px-0.5 shrink-0">s/d</span>

          {/* Tanggal Selesai */}
          <div className="flex items-center gap-2 bg-gray-800 border border-gray-700 px-3.5 py-2.5 rounded-xl shadow-inner w-full sm:w-auto">
            <Calendar className="w-4 h-4 text-indigo-400 shrink-0" />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-transparent text-gray-200 text-xs sm:text-sm focus:outline-none [color-scheme:dark] w-full"
            />
          </div>

        </div>

      </div>

      {/* Baris Kedua: Kolom Input Pencarian & Tombol Aksi */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        
        {/* Input Pencarian Utama */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari invoice atau item..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-gray-100 text-xs sm:text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition shadow-inner"
          />
        </div>

        {/* Tombol Terapkan Filter */}
        <div className="w-full sm:w-auto shrink-0">
          <button
            onClick={handleFilter}
            className="w-full sm:w-auto px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl flex items-center justify-center gap-1.5 text-xs sm:text-sm transition active:scale-95 shadow-md shadow-indigo-600/20"
          >
            <Filter className="w-4 h-4" />
            Terapkan Filter
          </button>
        </div>

      </div>

    </div>
  );
}