import React from 'react';

const BranchTabProducts = ({ products, formatRupiah }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs text-gray-300">
        <thead className="bg-gray-900/60 text-gray-400 uppercase text-[10px]">
          <tr>
            <th className="px-4 py-3 rounded-l-lg">Kode</th>
            <th className="px-4 py-3">Nama Produk</th>
            <th className="px-4 py-3">Harga</th>
            <th className="px-4 py-3 rounded-r-lg text-right">Stok</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700/50">
          {products && products.length > 0 ? (
            products.map((p) => (
              <tr key={p.id} className="hover:bg-gray-700/30">
                <td className="px-4 py-3 font-mono text-gray-400">{p.code || p.sku || '-'}</td>
                <td className="px-4 py-3 font-medium text-white">{p.name}</td>
                <td className="px-4 py-3">{formatRupiah(p.price)}</td>
                <td className="px-4 py-3 text-right font-bold">{p.stock}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="px-4 py-6 text-center text-gray-500">
                Belum ada produk di cabang ini.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BranchTabProducts;