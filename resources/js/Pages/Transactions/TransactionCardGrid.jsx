import React from 'react';
import { ShoppingBag, Printer, Trash2, DollarSign, Wallet, RefreshCw } from 'lucide-react';
import { router } from '@inertiajs/react';

export default function TransactionCardGrid({ transactions, user, openPrintModal, openDeleteModal }) {
  if (transactions.data.length === 0) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center shadow-xl">
        <ShoppingBag className="w-12 h-12 text-gray-600 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-gray-300">Belum ada data transaksi</h3>
        <p className="text-xs text-gray-500 mt-1">Transaksi yang kamu buat akan muncul di sini.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {transactions.data.map((transaction) => (
          <div key={transaction.id} className="bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-2xl p-5 transition duration-300 flex flex-col justify-between group shadow-xl">
            <div>
              <div className="flex justify-between items-start pb-3 mb-3 border-b border-gray-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold text-indigo-400 uppercase tracking-wider bg-indigo-950 border border-indigo-800 px-2 py-0.5 rounded-full">Invoice</span>
                    {transaction.branch && (
                      <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider bg-amber-950/50 border border-amber-800/50 px-2 py-0.5 rounded-full">{transaction.branch.name}</span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-white mt-1 group-hover:text-indigo-300 transition">{transaction.invoice_number}</h3>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openPrintModal(transaction)} className="p-2 bg-gray-800 hover:bg-indigo-600 text-gray-300 hover:text-white rounded-xl transition border border-gray-700 hover:border-indigo-500" title="Cetak Struk">
                    <Printer className="w-4 h-4" />
                  </button>
                  <button onClick={() => openDeleteModal(transaction)} className={`p-2 rounded-xl transition border ${user?.role === 'admin' ? "bg-gray-800 hover:bg-rose-600 text-gray-300 hover:text-white border-gray-700 hover:border-rose-500" : "bg-gray-800/50 text-gray-600 border-gray-800 cursor-not-allowed"}`} title="Hapus Transaksi">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="mb-4">
                <p className="text-[11px] font-medium text-gray-400 mb-2 uppercase tracking-wider">Item Dibeli</p>
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  {transaction.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs bg-gray-800/40 px-2.5 py-1.5 rounded-lg border border-gray-800">
                      <span className="text-gray-200 font-medium truncate max-w-[160px]">{item.name} <span className="text-indigo-400 font-semibold">x{item.qty}</span></span>
                      <span className="text-gray-400 font-mono">{transaction.item_prices[idx] || '-'}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="pt-3 border-t border-gray-800 space-y-1.5 text-xs">
              <div className="flex justify-between items-center text-gray-300 font-semibold text-sm">
                <span className="flex items-center gap-1.5 text-gray-400 font-normal"><DollarSign className="w-3.5 h-3.5 text-emerald-400" /> Total</span>
                <span className="text-emerald-400 text-base font-bold font-mono">{transaction.total_price}</span>
              </div>
              <div className="flex justify-between items-center text-gray-400">
                <span className="flex items-center gap-1.5"><Wallet className="w-3.5 h-3.5 text-gray-500" /> Tunai</span>
                <span className="font-mono text-gray-300">{transaction.cash_received}</span>
              </div>
              <div className="flex justify-between items-center text-gray-400">
                <span className="flex items-center gap-1.5"><RefreshCw className="w-3.5 h-3.5 text-gray-500" /> Kembalian</span>
                <span className="font-mono text-gray-300">{transaction.change}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {transactions.links && transactions.links.length > 1 && (
        <div className="px-5 py-4 bg-gray-900 border-t border-gray-800 flex items-center justify-between flex-wrap gap-3 mt-8 rounded-2xl">
          <span className="text-xs text-gray-400">
            Menampilkan <span className="font-medium text-white">{transactions.from || 0}</span> - <span className="font-medium text-white">{transactions.to || 0}</span> dari <span className="font-medium text-white">{transactions.total || 0}</span> data
          </span>
          <div className="flex items-center gap-1.5">
            {transactions.links.map((link, index) => (
              <button
                key={index}
                disabled={!link.url}
                onClick={() => link.url && router.visit(link.url)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${link.active ? 'bg-indigo-600 text-white shadow-sm' : link.url ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700' : 'bg-gray-900/50 text-gray-600 border border-gray-800/40 cursor-not-allowed'}`}
              >
                <span dangerouslySetInnerHTML={{ __html: link.label }} />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}