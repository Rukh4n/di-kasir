import React from 'react';
import { Receipt, Plus, Download } from 'lucide-react';

export default function TransactionHeader() {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      {/* Bagian Judul & Deskripsi */}
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
          <Receipt className="w-6 h-6 text-indigo-400 shrink-0" />
          <span className="truncate">Daftar Transaksi</span>
        </h1>
        <p className="text-xs sm:text-sm text-gray-400">
          Kelola dan pantau seluruh riwayat transaksi penjualan.
        </p>
      </div>

      {/* Bagian Tombol Aksi */}
      <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
        <a 
          href={route('transactions.create')} 
          className="flex-1 sm:flex-initial"
        >
          <button className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl px-4 py-2.5 flex items-center justify-center gap-2 transition duration-200 text-xs sm:text-sm active:scale-95 shadow-lg shadow-indigo-600/20">
            <Plus className="w-4 h-4 shrink-0" />
            <span>Transaksi Baru</span>
          </button>
        </a>

        <a 
          href={route('transactions.export')} 
          className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 font-medium text-xs sm:text-sm transition bg-amber-600 hover:bg-amber-500 text-white active:scale-95 shadow-lg shadow-amber-600/20"
        >
          <Download className="w-4 h-4 shrink-0" />
          <span>Export Data</span>
        </a>
      </div>
    </div>
  );
}