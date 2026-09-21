import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

export default function UserDeleteModal({
  isOpen,
  onClose,
  deletingUser,
  confirmDelete,
  deleteProcessing,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3.5 mb-4">
          <div className="p-3 bg-rose-950 border border-rose-800 rounded-full text-rose-400 shrink-0">
            <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white">Konfirmasi Hapus</h3>
            <p className="text-xs text-gray-400">Tindakan ini tidak dapat dibatalkan.</p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-gray-300 mb-6">
          Apakah Anda yakin ingin menghapus user{' '}
          <span className="font-semibold text-white">"{deletingUser?.name}"</span>?
        </p>

        <div className="flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={deleteProcessing}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-200 text-xs sm:text-sm font-medium rounded-xl transition disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={confirmDelete}
            disabled={deleteProcessing}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs sm:text-sm font-medium rounded-xl shadow transition disabled:opacity-50"
          >
            {deleteProcessing ? 'Menghapus...' : 'Hapus User'}
          </button>
        </div>
      </div>
    </div>
  );
}