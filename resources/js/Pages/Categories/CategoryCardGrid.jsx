import React from 'react'
import { Link } from '@inertiajs/react'
import { Eye, Edit, Trash2, Tag, Layers } from "lucide-react"

export default function CategoryCardGrid({ filteredCategories, openModal, userRole }) {
  if (filteredCategories.length === 0) {
    return (
      <div className="bg-gray-900/40 rounded-2xl p-12 text-center border border-gray-800/80 max-w-lg mx-auto">
        <div className="w-16 h-16 bg-gray-800/80 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-700/50">
          <Layers className="w-8 h-8 text-gray-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-300 mb-1">Data Tidak Ditemukan</h3>
        <p className="text-sm text-gray-500">Belum ada data kategori yang tersimpan atau sesuai pencarian.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {filteredCategories.map((category) => (
        <div 
          key={category.id} 
          className="group bg-gray-900/80 hover:bg-gray-900 border border-gray-800/90 hover:border-indigo-500/40 rounded-2xl p-5 shadow-lg hover:shadow-indigo-500/5 transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent group-hover:via-indigo-500 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-indigo-950/60 text-indigo-300 border border-indigo-800/40">
                <Tag className="w-3 h-3" />
                {category.code}
              </span>
            </div>

            <h3 className="text-lg font-bold text-gray-100 group-hover:text-indigo-300 transition-colors line-clamp-2">
              {category.name}
            </h3>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-800/80 flex items-center justify-end gap-2">
            <Link 
              href={route('categories.show', category.id)}
              className="p-2 rounded-xl bg-gray-800/60 hover:bg-indigo-600/20 text-gray-400 hover:text-indigo-400 border border-gray-700/50 hover:border-indigo-500/30 transition-all"
              title="Detail"
            >
              <Eye className="w-4 h-4" />
            </Link>
            
            <Link 
              href={route('categories.edit', category.id)}
              className="p-2 rounded-xl bg-gray-800/60 hover:bg-amber-600/20 text-gray-400 hover:text-amber-400 border border-gray-700/50 hover:border-amber-500/30 transition-all"
              title="Edit"
            >
              <Edit className="w-4 h-4" />
            </Link>

            <button
              onClick={(e) => {
                e.stopPropagation()
                openModal(category)
              }}
              className={`p-2 rounded-xl border transition-all ${
                userRole === 'admin' 
                  ? "bg-gray-800/60 hover:bg-rose-600/20 text-gray-400 hover:text-rose-400 border-gray-700/50 hover:border-rose-500/30" 
                  : "bg-gray-800/20 text-gray-600 border-gray-800 cursor-not-allowed"
              }`}
              title="Hapus"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
