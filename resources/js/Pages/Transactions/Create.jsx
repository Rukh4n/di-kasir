import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {Head, useForm, Link, router } from "@inertiajs/react";
import {
  Save,
  ArrowLeft,
  Search,
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  Receipt,
  Package,
  Banknote,
  Coins,
} from "lucide-react";

const Create = ({ products = [] }) => {
  const { data, setData, post, processing, reset } = useForm({
    items: [],
    total_price: 0,
    cash_received: "",
    change: 0,
  });

  const [query, setQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  const executeSearch = () => {
    if (!query.trim()) return;
    router.get(
      route("transactions.searchProducts"),
      { query: query },
      {
        preserveState: true,
        replace: true,
        onSuccess: (page) => {
          const results = page.props.products || [];
          setFilteredProducts(results);
          
          if (results.length === 1) {
            addProduct(results[0]);
          }
        },
      }
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      executeSearch();
    }
  };

  const addProduct = (product) => {
    const existsIndex = data.items.findIndex((item) => item.id === product.id);

    let newItems;
    if (existsIndex > -1) {
      newItems = [...data.items];
      newItems[existsIndex].qty += 1;
    } else {
      newItems = [...data.items, { ...product, qty: 1 }];
    }

    setData("items", newItems);
    calculateTotal(newItems);
    setQuery("");
    setFilteredProducts([]);
  };

  const removeProduct = (index) => {
    const newItems = data.items.filter((_, i) => i !== index);
    setData("items", newItems);
    calculateTotal(newItems);
  };

  const handleQtyChange = (index, value) => {
    const newItems = [...data.items];
    const qtyVal = parseInt(value) || 1;
    newItems[index].qty = Math.max(1, qtyVal);
    setData("items", newItems);
    calculateTotal(newItems);
  };

  const incrementQty = (index) => {
    const newItems = [...data.items];
    newItems[index].qty += 1;
    setData("items", newItems);
    calculateTotal(newItems);
  };

  const decrementQty = (index) => {
    const newItems = [...data.items];
    if (newItems[index].qty > 1) {
      newItems[index].qty -= 1;
      setData("items", newItems);
      calculateTotal(newItems);
    }
  };

  const calculateTotal = (items) => {
    const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
    setData((prevData) => ({
      ...prevData,
      items: items,
      total_price: total,
      change: prevData.cash_received ? (parseFloat(prevData.cash_received) || 0) - total : 0,
    }));
  };

  const handleCashChange = (value) => {
    const numValue = parseFloat(value) || 0;
    setData((prevData) => ({
      ...prevData,
      cash_received: value,
      change: numValue - prevData.total_price,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (parseFloat(data.cash_received) < data.total_price) {
      alert("Uang diterima kurang dari total harga!");
      return;
    }
    post(route("transactions.store"), {
      onSuccess: () => reset(),
    });
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  return (
    <AuthenticatedLayout>
      <Head title="Tambah Transaksi">
        <meta name="description" content="Tambahkan transaksi baru di sini." />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 backdrop-blur-xl p-6 rounded-2xl border border-slate-800/80 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-600/10 rounded-xl border border-blue-500/20 text-blue-400">
                <Receipt className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-white">
                  Kasir & Transaksi Baru
                </h1>
                <p className="text-sm text-slate-400">
                  Kelola item belanja dan selesaikan pembayaran kasir secara real-time.
                </p>
              </div>
            </div>

            <Link
              href={route("transactions.index")}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-slate-300 hover:text-white bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 transition-all duration-200 text-sm font-medium w-fit"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Daftar
            </Link>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Kolom Kiri: Input Search & Tabel Belanja */}
              <div className="lg:col-span-8 space-y-6">
                {/* Search Bar dengan Tombol Cari */}
                <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl p-6 border border-slate-800/80 shadow-xl relative z-20 overflow-visible">
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Cari Produk (Barcode / Nama Item)
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="w-full rounded-xl border border-slate-700/80 bg-slate-950/80 pl-11 pr-4 py-3 text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 outline-none"
                        placeholder="Ketik nama produk atau scan barcode lalu tekan Enter..."
                        autoFocus
                      />
                    </div>
                    <button
                      type="button"
                      onClick={executeSearch}
                      className="px-5 py-3 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/25 transition-all duration-200 flex items-center gap-2 shrink-0"
                    >
                      <Search className="w-4 h-4" />
                      Cari
                    </button>
                  </div>

                  {/* Dropdown Hasil Pencarian */}
                  {filteredProducts.length > 0 && (
                    <div className="absolute left-6 right-6 top-full mt-2 bg-slate-800/95 backdrop-blur-xl rounded-xl max-h-60 overflow-y-auto border border-slate-700/80 shadow-2xl z-50 divide-y divide-slate-700/50">
                      {filteredProducts.map((product) => (
                        <div
                          key={product.id}
                          onClick={() => addProduct(product)}
                          className="px-4 py-3 hover:bg-blue-600/10 hover:border-l-4 hover:border-blue-500 cursor-pointer transition-all flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-900 rounded-lg group-hover:bg-blue-600/20 text-slate-400 group-hover:text-blue-400 transition">
                              <Package className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="font-medium text-slate-200 group-hover:text-white">
                                {product.name}
                              </p>
                              <p className="text-xs font-mono text-slate-400">
                                Code: {product.code}
                              </p>
                            </div>
                          </div>
                          <span className="font-mono font-semibold text-blue-400">
                            {formatCurrency(product.price)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Tabel Keranjang Item */}
                <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-800/80 shadow-xl overflow-hidden relative z-10">
                  <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="w-5 h-5 text-blue-400" />
                      <h2 className="font-semibold text-slate-200">
                        Daftar Keranjang Belanja
                      </h2>
                    </div>
                    <span className="text-xs bg-slate-800 text-slate-400 px-3 py-1 rounded-full border border-slate-700/50 font-medium">
                      {data.items.length} Item Ditambahkan
                    </span>
                  </div>

                  {data.items.length === 0 ? (
                    <div className="py-16 text-center flex flex-col items-center justify-center p-6">
                      <div className="p-4 bg-slate-800/40 rounded-full text-slate-600 mb-3 border border-slate-800">
                        <ShoppingCart className="w-10 h-10" />
                      </div>
                      <p className="text-slate-400 font-medium">
                        Belum ada item transaksi
                      </p>
                      <p className="text-xs text-slate-500 mt-1 max-w-xs">
                        Gunakan kolom pencarian di atas untuk menambahkan produk ke dalam keranjang.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-slate-950/60 text-slate-400 uppercase text-xs font-semibold tracking-wider border-b border-slate-800">
                          <tr>
                            <th className="px-5 py-4">Produk</th>
                            <th className="px-5 py-4">Harga Unit</th>
                            <th className="px-5 py-4 text-center">Jumlah (Qty)</th>
                            <th className="px-5 py-4 text-right">Subtotal</th>
                            <th className="px-5 py-4 text-center">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 bg-slate-900/30">
                          {data.items.map((item, index) => (
                            <tr
                              key={index}
                              className="hover:bg-slate-800/30 transition-colors"
                            >
                              <td className="px-5 py-4">
                                <p className="font-medium text-slate-100">
                                  {item.name}
                                </p>
                                <p className="text-xs font-mono text-slate-400">
                                  {item.code}
                                </p>
                              </td>
                              <td className="px-5 py-4 font-mono text-slate-300">
                                {formatCurrency(item.price)}
                              </td>
                              <td className="px-5 py-4">
                                <div className="flex items-center justify-center gap-1 bg-slate-950/80 rounded-lg p-1 border border-slate-800 w-fit mx-auto">
                                  <button
                                    type="button"
                                    onClick={() => decrementQty(index)}
                                    className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition"
                                  >
                                    <Minus className="w-3.5 h-3.5" />
                                  </button>
                                  <input
                                    type="number"
                                    min="1"
                                    value={item.qty}
                                    onChange={(e) =>
                                      handleQtyChange(index, e.target.value)
                                    }
                                    className="w-12 bg-transparent text-center font-mono text-xs text-slate-100 border-none focus:ring-0 p-0"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => incrementQty(index)}
                                    className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition"
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                              <td className="px-5 py-4 text-right font-mono font-semibold text-emerald-400">
                                {formatCurrency(item.price * item.qty)}
                              </td>
                              <td className="px-5 py-4 text-center">
                                <button
                                  type="button"
                                  onClick={() => removeProduct(index)}
                                  className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition"
                                  title="Hapus item"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>

              {/* Kolom Kanan: Ringkasan & Pembayaran */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl p-6 border border-slate-800/80 shadow-xl space-y-6 sticky top-6">
                  <h2 className="text-lg font-bold text-slate-100 border-b border-slate-800 pb-4">
                    Ringkasan Pembayaran
                  </h2>

                  {/* Display Total Harga */}
                  <div className="bg-gradient-to-br from-blue-900/30 to-slate-950 p-5 rounded-2xl border border-blue-500/20 text-center space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                      Total Tagihan
                    </p>
                    <p className="text-3xl font-extrabold font-mono text-white tracking-tight">
                      {formatCurrency(data.total_price)}
                    </p>
                  </div>

                  {/* Field Input Uang Diterima */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-300 flex items-center gap-2">
                      <Banknote className="w-4 h-4 text-emerald-400" />
                      Uang Diterima
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-slate-400 text-sm">
                        Rp
                      </span>
                      <input
                        type="number"
                        value={data.cash_received}
                        onChange={(e) => handleCashChange(e.target.value)}
                        className="w-full rounded-xl border border-slate-700/80 bg-slate-950/80 pl-12 pr-4 py-3 font-mono text-slate-100 text-lg font-semibold focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 outline-none"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  {/* Display Kembalian */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-400 flex items-center gap-2">
                      <Coins className="w-4 h-4 text-amber-400" />
                      Kembalian
                    </label>
                    <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 font-mono text-lg font-bold text-slate-200 flex justify-between items-center">
                      <span className="text-xs text-slate-500 uppercase">Rp</span>
                      <span
                        className={
                          data.change < 0
                            ? "text-rose-400"
                            : "text-emerald-400"
                        }
                      >
                        {formatCurrency(data.change > 0 ? data.change : 0)}
                      </span>
                    </div>
                  </div>

                  {/* Tombol Simpan Transaksi */}
                  <button
                    type="submit"
                    disabled={
                      processing ||
                      data.items.length === 0 ||
                      parseFloat(data.cash_received || 0) < data.total_price
                    }
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 py-3.5 px-6 text-white font-semibold shadow-lg shadow-blue-600/25 transition-all duration-200 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none text-base"
                  >
                    <Save className="w-5 h-5" />
                    Simpan Transaksi
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default Create;