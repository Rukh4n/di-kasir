import React from 'react';

const BranchTabTransactions = ({ transactions, formatDate, formatRupiah }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs text-gray-300">
        <thead className="bg-gray-900/60 text-gray-400 uppercase text-[10px]">
          <tr>
            <th className="px-4 py-3 rounded-l-lg">Kode Transaksi</th>
            <th className="px-4 py-3">Waktu</th>
            <th className="px-4 py-3">Total Bayar</th>
            <th className="px-4 py-3 rounded-r-lg">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700/50">
          {transactions && transactions.length > 0 ? (
            transactions.map((t) => (
              <tr key={t.id} className="hover:bg-gray-700/30">
                <td className="px-4 py-3 font-mono text-gray-400">{t.invoice_number || t.code || `#${t.id}`}</td>
                <td className="px-4 py-3 text-gray-400">{formatDate(t.created_at)}</td>
                <td className="px-4 py-3 font-medium text-white">{formatRupiah(t.grand_total || t.total_price)}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Selesai
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="px-4 py-6 text-center text-gray-500">
                Belum ada riwayat transaksi di cabang ini.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BranchTabTransactions;