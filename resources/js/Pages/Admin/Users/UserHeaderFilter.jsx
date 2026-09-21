import React from 'react';
import { Users, Plus, Filter, Search } from 'lucide-react';

export default function UserHeaderFilter({
  openCreateModal,
  isFilterMobileOpen,
  setIsFilterMobileOpen,
  role,
  setRole,
  roles = [],
  branchId,
  setBranchId,
  branches = [],
  search,
  setSearch,
  handleKeyDown,
  handleSearch,
}) {
  return (
    <div className="bg-gray-900/80 border border-gray-800/90 rounded-2xl p-4 sm:p-5 mb-6 shadow-xl backdrop-blur-sm">
      {/* Bagian Header Utama (Judul & Tombol Tambah) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Users className="w-6 h-6 text-indigo-400 shrink-0" />
            <span className="truncate">Manajemen User</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-400">
            Kelola data pengguna, hak akses, dan perannya.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={openCreateModal}
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl px-4 py-2.5 flex items-center justify-center gap-2 transition duration-200 text-xs sm:text-sm active:scale-95 shadow-lg shadow-indigo-600/20"
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span>Tambah User</span>
          </button>
        </div>
      </div>

      {/* Bagian Filter & Pencarian */}
      <div className="mt-4 pt-4 border-t border-gray-800/80">
        {/* Tombol Toggle Filter untuk Mobile */}
        <div className="flex items-center justify-between gap-2 lg:hidden mb-3">
          <button
            onClick={() => setIsFilterMobileOpen(!isFilterMobileOpen)}
            className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-200 bg-gray-800/90 hover:bg-gray-800 px-3.5 py-2.5 rounded-xl border border-gray-700/80 transition shadow-inner w-full sm:w-auto justify-center"
          >
            <Filter className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>{isFilterMobileOpen ? 'Sembunyikan Filter & Pencarian' : 'Tampilkan Filter & Pencarian'}</span>
          </button>
        </div>

        {/* Kontainer Elemen Filter */}
        <div className={`flex-col lg:flex-row lg:items-center justify-between gap-3 ${isFilterMobileOpen ? 'flex' : 'hidden lg:flex'}`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-row items-center gap-3 w-full">
            
            {/* Select Role */}
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full lg:w-44 bg-gray-800/90 border border-gray-700/80 rounded-xl text-xs sm:text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 py-2.5 px-3 transition shadow-inner cursor-pointer"
            >
              <option value="" className="bg-gray-900 text-gray-100">Semua Role</option>
              {roles.length > 0 ? (
                roles.map((r) => (
                  <option key={r.id || r.name || r} value={r.name || r} className="bg-gray-900 text-gray-100">
                    {r.name ? r.name.charAt(0).toUpperCase() + r.name.slice(1) : String(r).toUpperCase()}
                  </option>
                ))
              ) : (
                <>
                  <option value="admin" className="bg-gray-900 text-gray-100">Admin</option>
                  <option value="staff" className="bg-gray-900 text-gray-100">Staff</option>
                </>
              )}
            </select>

            {/* Select Cabang */}
            <select
              value={branchId}
              onChange={(e) => setBranchId(e.target.value)}
              className="w-full lg:w-48 bg-gray-800/90 border border-gray-700/80 rounded-xl text-xs sm:text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 py-2.5 px-3 transition shadow-inner cursor-pointer"
            >
              <option value="" className="bg-gray-900 text-gray-100">Semua Cabang</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id} className="bg-gray-900 text-gray-100">
                  {b.name}
                </option>
              ))}
            </select>

            {/* Input Search */}
            <div className="relative w-full sm:col-span-2 lg:col-span-1 lg:flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari nama atau email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full pl-10 pr-3 py-2.5 bg-gray-800/90 border border-gray-700/80 rounded-xl text-xs sm:text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition shadow-inner"
              />
            </div>

            {/* Tombol Terapkan Filter */}
            <button
              type="button"
              onClick={handleSearch}
              className="w-full sm:w-auto px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-medium rounded-xl transition active:scale-95 flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20"
            >
              <Filter className="w-4 h-4 shrink-0" />
              <span>Filter</span>
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}