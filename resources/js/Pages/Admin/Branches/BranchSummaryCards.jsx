import React from 'react';
import { DollarSign, TrendingUp, Receipt, AlertTriangle } from 'lucide-react';

const BranchSummaryCards = ({ summary, formatRupiah }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400">Total Pendapatan</p>
            <h4 className="text-lg font-bold text-white mt-1">
              {formatRupiah(Number(summary?.total_revenue) || 0)}
            </h4>
          </div>
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400">Omset Hari Ini</p>
            <h4 className="text-lg font-bold text-white mt-1">
              {formatRupiah(Number(summary?.today_revenue) || 0)}
            </h4>
          </div>
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400">Transaksi Hari Ini</p>
            <h4 className="text-lg font-bold text-white mt-1">
              {Number(summary?.today_transactions) || 0}
            </h4>
          </div>
          <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-400">
            <Receipt className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400">Stok Kritis / Habis</p>
            <h4 className="text-lg font-bold text-amber-400 mt-1">
              {Number(summary?.low_stock_count) || 0}
            </h4>
          </div>
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BranchSummaryCards;