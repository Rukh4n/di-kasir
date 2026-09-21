import React from 'react'
import { Link } from '@inertiajs/react'
import { Plus, Download } from 'lucide-react'

const HeaderActions = ({ exportUrl, onExportClick }) => {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-slate-800/60 border border-slate-700/50 p-5 rounded-2xl backdrop-blur-sm shadow-xl">
      <div>
        <span className="text-xs font-semibold tracking-wider text-indigo-400 uppercase">Manajemen Inventaris</span>
        <h1 className="text-2xl font-extrabold text-white mt-0.5">Daftar Produk</h1>
      </div>

      <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
        <Link href={route('products.create')}>
          <button className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-600/20 active:scale-95">
            <Plus className="w-4 h-4" />
            <span>Tambah Produk</span>
          </button>
        </Link>

        <a
          href={exportUrl}
          onClick={onExportClick}
          className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-xl border transition-all shadow-sm bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border-amber-500/30 active:scale-95"
        >
          <Download className="w-4 h-4" />
          <span>Export Excel</span>
        </a>
      </div>
    </div>
  )
}

export default HeaderActions