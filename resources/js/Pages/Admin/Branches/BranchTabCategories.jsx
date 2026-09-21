import React from 'react';

const BranchTabCategories = ({ categories }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs text-gray-300">
        <thead className="bg-gray-900/60 text-gray-400 uppercase text-[10px]">
          <tr>
            <th className="px-4 py-3 rounded-l-lg">Nama Kategori</th>
            <th className="px-4 py-3 rounded-r-lg text-right">Jumlah Produk</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700/50">
          {categories && categories.length > 0 ? (
            categories.map((c) => (
              <tr key={c.id} className="hover:bg-gray-700/30">
                <td className="px-4 py-3 font-medium text-white">{c.name}</td>
                <td className="px-4 py-3 text-right font-medium text-gray-300">{c.products_count || 0}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" className="px-4 py-6 text-center text-gray-500">
                Belum ada kategori di cabang ini.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BranchTabCategories;