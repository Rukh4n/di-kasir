import React from 'react'
import { AlertCircle, X } from 'lucide-react'

const DeleteModal = ({ show, deleteMode, onClose, onDelete }) => {
  if (!show || !deleteMode) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl relative space-y-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-700/50 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 text-rose-400">
          <div className="p-2.5 bg-rose-500/10 rounded-xl">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-white">Konfirmasi Hapus</h2>
        </div>

        <p className="text-slate-300 text-sm leading-relaxed">
          Apakah Anda yakin ingin menghapus produk ini? Data yang dihapus tidak dapat dikembalikan.
        </p>

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium transition-colors text-sm"
          >
            Batal
          </button>
          <button
            onClick={onDelete}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-medium transition-all shadow-lg shadow-rose-600/20 text-sm"
          >
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteModal