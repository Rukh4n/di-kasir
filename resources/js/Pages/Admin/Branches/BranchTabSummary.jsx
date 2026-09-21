import React from 'react';
import { Users, Package, FolderTree, Receipt } from 'lucide-react';

const BranchTabSummary = ({ branch }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-gray-900/50 border border-gray-700/70 rounded-xl p-4 flex items-center gap-4">
        <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg">
          <Users className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs text-gray-400">Total Staff</p>
          <p className="text-lg font-bold text-white">{branch.users_count || 0}</p>
        </div>
      </div>

      <div className="bg-gray-900/50 border border-gray-700/70 rounded-xl p-4 flex items-center gap-4">
        <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-lg">
          <Package className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs text-gray-400">Total Produk</p>
          <p className="text-lg font-bold text-white">{branch.products_count || 0}</p>
        </div>
      </div>

      <div className="bg-gray-900/50 border border-gray-700/70 rounded-xl p-4 flex items-center gap-4">
        <div className="p-3 bg-purple-500/10 text-purple-400 rounded-lg">
          <FolderTree className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs text-gray-400">Total Kategori</p>
          <p className="text-lg font-bold text-white">{branch.categories_count || 0}</p>
        </div>
      </div>

      <div className="bg-gray-900/50 border border-gray-700/70 rounded-xl p-4 flex items-center gap-4">
        <div className="p-3 bg-amber-500/10 text-amber-400 rounded-lg">
          <Receipt className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs text-gray-400">Total Transaksi</p>
          <p className="text-lg font-bold text-white">{branch.transactions_count || 0}</p>
        </div>
      </div>
    </div>
  );
};

export default BranchTabSummary;