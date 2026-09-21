import React from 'react'
import { X, Trash2 } from "lucide-react"
import { router } from '@inertiajs/react'

export default function CategoryDeleteModal({ showModal, closeModal, selectedCategory }) {
  if (!showModal || !selectedCategory) return null

  const handleDelete = () => {
    if (selectedCategory) {
      router.delete(route('categories.destroy', selectedCategory.id), {
        onFinish: () => closeModal()
      })
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl relative">
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 p-1.5 rounded-xl hover:bg-gray-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-12 h-12 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-center text-rose-500 mb-4">
          <Trash2 className="w-6 h-6" />
        </div>

        <h2 className="text-lg font-bold text-gray-100 mb-1">Konfirmasi Hapus</h2>
        <p className="text-gray-400 text-sm mb-6 leading-relaxed">
          Apakah Anda yakin ingin menghapus kategori <span className="font-semibold text-gray-200">"{selectedCategory.name}"</span>? Tindakan ini tidak dapat dibatalkan.
        </p>

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={closeModal}
            className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium text-sm transition-all border border-gray-700/50"
          >
            Batal
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-medium text-sm transition-all shadow-lg shadow-rose-600/20"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  )
}
