import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {Head, useForm, router, Link } from "@inertiajs/react";
import {
  PackagePlus,
  Save,
  ArrowLeft,
  Barcode,
  RefreshCw,
  Tag,
  DollarSign,
  Layers,
  Building2,
  AlertCircle,
  TrendingUp,
} from "lucide-react";

const Create = ({ categories = [] }) => {
  const { data, setData, processing, errors, reset } = useForm({
    code: "",
    name: "",
    category_id: "",
    cost_price: "",
    price: "",
    stock: "",
    branch_id: "",
  });

  const generateCode = () => {
    const randomCode = "PRD-" + Math.floor(100000 + Math.random() * 900000);
    setData("code", randomCode);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    router.post(route("products.store"), data, {
      onSuccess: () =>
        reset(
          "code",
          "name",
          "category_id",
          "cost_price",
          "price",
          "stock",
          "branch_id"
        ),
    });
  };

  const selectedCategoryObj = categories.find(
    (cat) => String(cat.id) === String(data.category_id)
  );

  return (
    <AuthenticatedLayout>
        <Head title="Tambah Produk">
          <meta name="description" content="Tambahkan produkmu di sini." />
        </Head>
      <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header Navigation */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900/60 backdrop-blur-md p-5 rounded-2xl border border-slate-800 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400">
                <PackagePlus className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">
                  Tambah Produk Baru
                </h1>
                <p className="text-xs text-slate-400">
                  Kelola inventaris barang dengan menginputkan detail informasi produk.
                </p>
              </div>
            </div>

            <Link
              href={route("products.index")}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-800 hover:text-white border border-slate-700/60 transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Daftar
            </Link>
          </div>

          {/* Form Container */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Main Form */}
              <div className="lg:col-span-2 space-y-6 bg-slate-900/80 backdrop-blur-xl p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl">
                <h2 className="text-base font-semibold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-blue-400" />
                  Informasi Dasar
                </h2>

                {/* Input Name */}
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Nama Produk <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={data.name}
                    onChange={(e) => setData("name", e.target.value)}
                    className={`w-full rounded-xl border ${
                      errors.name ? "border-rose-500 focus:ring-rose-500/20" : "border-slate-700/80 focus:border-blue-500 focus:ring-blue-500/20"
                    } bg-slate-950/60 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-4 transition duration-150`}
                    placeholder="Contoh: Kopi Susu Gula Aren 250ml"
                    required
                  />
                  {errors.name && (
                    <p className="flex items-center gap-1.5 text-xs text-rose-400 mt-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Category Selection */}
                <div className="space-y-2">
                  <label htmlFor="category_id" className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Kategori Produk <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="category_id"
                      value={data.category_id}
                      onChange={(e) => {
                        const selectedCategory = categories.find(
                          (cat) => cat.id === parseInt(e.target.value)
                        );
                        setData((prevData) => ({
                          ...prevData,
                          category_id: e.target.value,
                          branch_id: selectedCategory?.branch_id || prevData.branch_id,
                        }));
                      }}
                      className={`w-full rounded-xl border ${
                        errors.category_id ? "border-rose-500 focus:ring-rose-500/20" : "border-slate-700/80 focus:border-blue-500 focus:ring-blue-500/20"
                      } bg-slate-950/60 px-4 py-3 text-sm text-slate-100 focus:outline-none focus:ring-4 transition duration-150 appearance-none`}
                      required
                    >
                      <option value="" disabled className="bg-slate-900 text-slate-400">
                        -- Pilih Kategori --
                      </option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id} className="bg-slate-900 text-slate-200">
                          {cat.name} {cat.branch ? `(${cat.branch.name})` : ""}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                      <Layers className="w-4 h-4" />
                    </div>
                  </div>
                  {errors.category_id && (
                    <p className="flex items-center gap-1.5 text-xs text-rose-400 mt-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.category_id}
                    </p>
                  )}
                </div>

                {/* Auto Branch Readonly Display */}
                {selectedCategoryObj?.branch && (
                  <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/80 flex items-center gap-3">
                    <Building2 className="w-4 h-4 text-blue-400 shrink-0" />
                    <div className="text-xs">
                      <span className="text-slate-400">Terhubung ke Cabang: </span>
                      <span className="font-medium text-slate-200">{selectedCategoryObj.branch.name}</span>
                    </div>
                  </div>
                )}

                {/* Pricing & Stock Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  {/* Harga Modal */}
                  <div className="space-y-2">
                    <label htmlFor="cost_price" className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                      Harga Modal (Rp) <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                        <DollarSign className="w-4 h-4" />
                      </div>
                      <input
                        type="number"
                        id="cost_price"
                        min="0"
                        value={data.cost_price}
                        onChange={(e) => setData("cost_price", e.target.value)}
                        className={`w-full rounded-xl border ${
                          errors.cost_price ? "border-rose-500 focus:ring-rose-500/20" : "border-slate-700/80 focus:border-blue-500 focus:ring-blue-500/20"
                        } bg-slate-950/60 pl-10 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-4 transition duration-150`}
                        placeholder="0"
                        required
                      />
                    </div>
                    {errors.cost_price && (
                      <p className="flex items-center gap-1.5 text-xs text-rose-400 mt-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.cost_price}
                      </p>
                    )}
                  </div>

                  {/* Harga Jual */}
                  <div className="space-y-2">
                    <label htmlFor="price" className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                      Harga Jual (Rp) <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                        <TrendingUp className="w-4 h-4" />
                      </div>
                      <input
                        type="number"
                        id="price"
                        min="0"
                        value={data.price}
                        onChange={(e) => setData("price", e.target.value)}
                        className={`w-full rounded-xl border ${
                          errors.price ? "border-rose-500 focus:ring-rose-500/20" : "border-slate-700/80 focus:border-blue-500 focus:ring-blue-500/20"
                        } bg-slate-950/60 pl-10 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-4 transition duration-150`}
                        placeholder="0"
                        required
                      />
                    </div>
                    {errors.price && (
                      <p className="flex items-center gap-1.5 text-xs text-rose-400 mt-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.price}
                      </p>
                    )}
                  </div>

                  {/* Stok */}
                  <div className="space-y-2">
                    <label htmlFor="stock" className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                      Jumlah Stok <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="stock"
                      min="0"
                      value={data.stock}
                      onChange={(e) => setData("stock", e.target.value)}
                      className={`w-full rounded-xl border ${
                        errors.stock ? "border-rose-500 focus:ring-rose-500/20" : "border-slate-700/80 focus:border-blue-500 focus:ring-blue-500/20"
                      } bg-slate-950/60 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-4 transition duration-150`}
                      placeholder="0"
                      required
                    />
                    {errors.stock && (
                      <p className="flex items-center gap-1.5 text-xs text-rose-400 mt-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.stock}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Code & Identification */}
              <div className="space-y-6">
                <div className="bg-slate-900/80 backdrop-blur-xl p-6 rounded-2xl border border-slate-800 shadow-xl space-y-6">
                  <h2 className="text-base font-semibold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
                    <Barcode className="w-4 h-4 text-blue-400" />
                    Kode Produk
                  </h2>

                  {/* Input Code & Generate */}
                  <div className="space-y-2">
                    <label htmlFor="code" className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                      Kode SKU / Produk <span className="text-rose-500">*</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        id="code"
                        value={data.code}
                        onChange={(e) => setData("code", e.target.value)}
                        className={`w-full rounded-xl border ${
                          errors.code ? "border-rose-500 focus:ring-rose-500/20" : "border-slate-700/80 focus:border-blue-500 focus:ring-blue-500/20"
                        } bg-slate-950/60 px-3.5 py-2.5 text-sm font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-4 transition duration-150`}
                        placeholder="PRD-XXXXX"
                        required
                      />
                      <button
                        type="button"
                        onClick={generateCode}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600/20 border border-blue-500/30 px-3.5 py-2.5 text-xs font-semibold text-blue-300 hover:bg-blue-600 hover:text-white transition duration-200 shrink-0"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Generate
                      </button>
                    </div>
                    {errors.code && (
                      <p className="flex items-center gap-1.5 text-xs text-rose-400 mt-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.code}
                      </p>
                    )}
                  </div>
                </div>

                {/* Submit Action Card */}
                <div className="bg-slate-900/80 backdrop-blur-xl p-5 rounded-2xl border border-slate-800 shadow-xl flex items-center justify-between gap-4">
                  <div className="text-xs text-slate-400">
                    Pastikan data yang diisi sudah sesuai.
                  </div>
                  <button
                    type="submit"
                    disabled={processing}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 text-sm shadow-lg shadow-blue-600/25 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                  >
                    <Save className="w-4 h-4" />
                    {processing ? "Menyimpan..." : "Simpan Produk"}
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
