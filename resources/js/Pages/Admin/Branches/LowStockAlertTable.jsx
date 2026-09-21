import React from 'react';
import { AlertTriangle } from 'lucide-react';

const LowStockAlertTable = ({ lowStockProducts, formatRupiah }) => {
  if (!lowStockProducts || lowStockProducts.length === 0) return null;

  return (
    <div className="bg-amber-950/20 border border-amber-800/40 rounded-xl p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4 text-amber-400">
        <AlertTriangle className="w-5 h-5 shrink-0" />
        <h3 className="text-sm font-semibold">Peringatan Produk Stok Menipis (≤ 5)</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-gray-300">
          <thead className="bg-gray-900/60 text-gray-400 uppercase text-[10px]">
            <tr>
              <th className="px-4 py-2.5 rounded-l-lg">Kode Produk</th>
              <th className="px-4 py-2.5">Nama Produk</th>
              <th className="px-4 py-2.5">Harga</th>
              <th className="px-4 py-2.5 rounded-r-lg text-right">Sisa Stok</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/60">
            {lowStockProducts.map((product) => (
              <tr key={product.id} className="hover:bg-gray-800/40">
                <td className="px-4 py-3 font-mono text-gray-400">{product.code || product.sku || '-'}</td>
                <td className="px-4 py-3 font-medium text-white">{product.name}</td>
                <td className="px-4 py-3">{formatRupiah(product.price)}</td>
                <td className="px-4 py-3 text-right">
                  <span className="px-2 py-1 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 font-bold">
                    {product.stock}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LowStockAlertTable;
