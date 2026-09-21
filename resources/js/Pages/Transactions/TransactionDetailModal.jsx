import React from 'react';
import { Printer, X } from 'lucide-react';
import Show from './Show';

export default function TransactionDetailModal({ showDetail, selectedTransaction, closeModal }) {
  if (!showDetail || !selectedTransaction) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 w-full max-w-2xl relative max-h-[90vh] flex flex-col shadow-2xl">
        <div className="flex justify-between items-center pb-3 border-b border-gray-800 mb-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Printer className="w-4 h-4 text-indigo-400" />
            Detail & Cetak Transaksi
          </h3>
          <button onClick={closeModal} className="text-gray-400 hover:text-gray-200 p-1 rounded-lg hover:bg-gray-800 transition">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="overflow-y-auto pr-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <Show transaction={selectedTransaction} />
        </div>
      </div>
    </div>
  );
}