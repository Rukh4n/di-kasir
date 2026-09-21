import React from 'react'
import { Plus, Search, Layers, Building2 } from "lucide-react"
import { Link, router } from '@inertiajs/react'

export default function CategoryHeader({ query, setQuery, branchId, setBranchId, branches, userRole, setFilteredCategories }) {
  const handleSearch = (e) => setQuery(e.target.value)
  const handleBranchChange = (e) => setBranchId(e.target.value)

  const submitSearch = () => {
    router.get(route('categories.index'), { query, branch_id: branchId }, {
      preserveState: true,
      onSuccess: (page) => {
        setFilteredCategories(page.props.categories || [])
      }
    })
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      submitSearch()
    }
  }

  return (
    <div className="bg-gray-900/60 p-4 sm:p-6 rounded-2xl border border-gray-800/80 backdrop-blur-xl shadow-xl mb-8">
      <div className="flex flex-col gap-5">
        
        {/* Top Section: Title & Add Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-indigo-600/15 border border-indigo-500/30 rounded-2xl text-indigo-400 shrink-0 shadow-inner">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                Daftar Kategori
              </h1>
              <p className="text-xs sm:text-sm text-gray-400 mt-0.5">Kelola dan atur kategori produk toko kamu</p>
            </div>
          </div>

          <Link href={route('categories.create')} className="w-full sm:w-auto">
            <button 
              className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 active:scale-95 text-white font-semibold rounded-xl px-4 py-2.5 flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition-all text-sm shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Kategori</span>
            </button>
          </Link>
        </div>

        {/* Divider / Separation Line */}
        <div className="h-px bg-gray-800/80 w-full"></div>

        {/* Bottom Section: Filters & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full">
          
          {/* Filter Cabang (Hanya tampil untuk admin) */}
          {userRole === 'admin' && branches.length > 0 && (
            <div className="relative w-full sm:w-48 shrink-0">
              <select
                value={branchId}
                onChange={handleBranchChange}
                className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-gray-700/80 bg-gray-950/80 text-gray-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-inner appearance-none cursor-pointer"
              >
                <option value="">Semua Cabang</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
              <Building2 className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          )}

          {/* Input Pencarian & Tombol Cari Berdampingan */}
          <div className="flex items-center gap-2 w-full sm:w-auto sm:flex-1">
            <div className="relative flex-1">
              <input
                type="text"
                value={query}
                onChange={handleSearch}
                onKeyDown={handleKeyDown}
                placeholder="Cari kode / nama..."
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-700/80 bg-gray-950/80 text-gray-100 placeholder-gray-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-inner"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            <button
              onClick={submitSearch}
              className="px-4 sm:px-5 py-2.5 bg-gray-800/90 hover:bg-gray-700 active:scale-95 text-gray-200 font-medium rounded-xl border border-gray-700/60 flex items-center justify-center gap-2 text-sm transition-all shadow-md shrink-0"
            >
              <Search className="w-4 h-4" />
              <span className="hidden xs:inline">Cari</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  )
}