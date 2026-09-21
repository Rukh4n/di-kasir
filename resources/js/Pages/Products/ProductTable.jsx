import React from 'react'
import { Link } from '@inertiajs/react'
import { Edit, Trash2, PackageX } from 'lucide-react'
import Pagination from './Pagination'

const ProductTable = ({ products, filteredProducts, user, openDeleteModal }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm">
      {filteredProducts.length === 0 ? (
        <div className="py-16 text-center space-y-3">
          <div className="inline-flex p-3 bg-slate-800 rounded-2xl text-slate-500">
            <PackageX className="w-8 h-8" />
          </div>
          <p className="text-slate-400 text-base font-medium">Belum ada data produk yang ditemukan.</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-900/80 text-slate-400 font-semibold border-b border-slate-700/60 uppercase text-[11px] tracking-wider">
                  <th className="px-5 py-4">Kode</th>
                  <th className="px-5 py-4">Nama Produk</th>
                  <th className="px-5 py-4">Kategori</th>
                  <th className="px-5 py-4">Cabang</th>
                  <th className="px-5 py-4">Harga</th>
                  <th className="px-5 py-4">Stok</th>
                  <th className="px-5 py-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/40">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-5 py-4 font-mono text-slate-300 text-xs">{product.code}</td>
                    <td className="px-5 py-4 font-semibold text-white">{product.name}</td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-700/60 text-slate-300 border border-slate-600/50">
                        {product.category?.name || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                        {product.branch?.name || '-'}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-medium text-indigo-300">{formatCurrency(product.price)}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          product.stock > 10
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : product.stock > 0
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {product.stock} pcs
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          href={route('products.edit', product.code)}
                          className="p-2 text-slate-300 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors"
                          title="Edit Produk"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => openDeleteModal(product)}
                          disabled={user?.role !== 'admin'}
                          className={`p-2 rounded-lg transition-colors ${
                            user?.role !== 'admin'
                              ? 'text-slate-600 cursor-not-allowed'
                              : 'text-slate-300 hover:text-rose-400 hover:bg-rose-500/10'
                          }`}
                          title="Hapus Produk"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination products={products} />
        </>
      )}
    </div>
  )
}

export default ProductTable