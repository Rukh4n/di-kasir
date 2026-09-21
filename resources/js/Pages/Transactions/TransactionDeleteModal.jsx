import React from 'react';
import { Trash2, X } from 'lucide-react';

export default function TransactionDeleteModal({ showModal, selectedTransaction, deleteMode, closeModal, handleDelete }) {
  if (!showModal || !selectedTransaction || !deleteMode) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-sm relative shadow-2xl">
        <button onClick={closeModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 p-1 rounded-lg hover:bg-gray-800 transition">
          <X className="w-4 h-4" />
        </button>
        <div className="w-10 h-10 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 mb-3">
          <Trash2 className="w-5 h-5" />
        </div>
        <h2 className="text-lg font-bold text-white mb-1">Konfirmasi Hapus</h2>
        <p className="text-gray-400 text-xs mb-6 leading-relaxed">
          Apakah Anda yakin ingin menghapus transaksi <span className="text-white font-semibold">{selectedTransaction.invoice_number}</span>? Tindakan ini tidak dapat dibatalkan.
        </p>
        <div className="flex justify-end gap-2">
          <button onClick={closeModal} className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium transition text-xs">
            Batal
          </button>
          <button onClick={handleDelete} className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-medium transition text-xs shadow-lg shadow-rose-600/20">
            Hapus Transaksi
          </button>
        </div>
      </div>
    </div>
  );
}