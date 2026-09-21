import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {Head, useForm, Link, router } from "@inertiajs/react";
import { PlusCircle, Save, ArrowLeft, Layers, Sparkles, Building2 } from "lucide-react";

const Create = ({ branches = [] }) => {
  const isAdmin = branches.length > 0;

  const { data, setData, processing, errors, reset } = useForm({
    code: "",
    name: "",
    branch_id: isAdmin ? "" : undefined,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    router.post(route("categories.store"), data, {
      onSuccess: () => reset(),
    });
  };

  const generateCode = () => {
    const randomCode = "CAT-" + Math.floor(1000 + Math.random() * 9000);
    setData("code", randomCode);
  };

  return (
    <AuthenticatedLayout>
      <Head title="Tambah Kategori">
        <meta name="description" content="Tambahkan kategori di sini." />
      </Head>
      <div className="min-h-[85vh] bg-gray-950 text-gray-100 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-xl bg-gray-900/80 backdrop-blur-xl border border-gray-800/80 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-indigo-950/20">
          
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-gray-800/80">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-inner">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">Tambah Kategori</h1>
                <p className="text-xs sm:text-sm text-gray-400 mt-0.5">Buat kategori produk baru untuk mengorganisasi inventaris</p>
              </div>
            </div>
            
            <Link
              href={route("categories.index")}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-gray-300 bg-gray-800/80 hover:bg-gray-800 hover:text-white border border-gray-700/60 transition-all active:scale-95 w-fit"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </Link>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Input Branch (Only for Admin) */}
            {isAdmin && (
              <div className="space-y-2">
                <label htmlFor="branch_id" className="block text-sm font-semibold text-gray-200">
                  Pilih Cabang <span className="text-blue-400">*</span>
                </label>
                <div className="relative">
                  <select
                    id="branch_id"
                    value={data.branch_id}
                    onChange={(e) => setData("branch_id", e.target.value)}
                    className="w-full rounded-xl border border-gray-700/60 bg-gray-950 px-4 py-3 text-sm text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  >
                    <option value="">-- Pilih Cabang --</option>
                    {branches.map((branch) => (
                      <option key={branch.id} value={branch.id}>
                        {branch.name}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.branch_id && (
                  <p className="text-xs sm:text-sm text-red-400 mt-1.5 flex items-center gap-1 font-medium animate-shake">
                    {errors.branch_id}
                  </p>
                )}
              </div>
            )}

            {/* Input Code */}
            <div className="space-y-2">
              <label htmlFor="code" className="block text-sm font-semibold text-gray-200">
                Kode Kategori <span className="text-blue-400">*</span>
              </label>
              <div className="flex gap-2.5">
                <div className="relative flex-1">
                  <input
                    type="text"
                    id="code"
                    value={data.code}
                    readOnly
                    className="w-full rounded-xl border border-gray-700/60 bg-gray-950/60 px-4 py-3 text-sm text-gray-300 placeholder:text-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 cursor-not-allowed transition-all"
                    placeholder="Klik Generate untuk kode otomatis"
                  />
                </div>
                <button
                  type="button"
                  onClick={generateCode}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-4 py-3 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-blue-600/25 hover:bg-blue-500 hover:shadow-blue-500/40 transition-all active:scale-95 shrink-0"
                >
                  <Sparkles className="w-4 h-4 text-blue-200" />
                  Generate
                </button>
              </div>
              {errors.code && (
                <p className="text-xs sm:text-sm text-red-400 mt-1.5 flex items-center gap-1 font-medium animate-shake">
                  {errors.code}
                </p>
              )}
            </div>

            {/* Input Name */}
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-semibold text-gray-200">
                Nama Kategori <span className="text-blue-400">*</span>
              </label>
              <input
                type="text"
                id="name"
                value={data.name}
                onChange={(e) => setData("name", e.target.value)}
                className="w-full rounded-xl border border-gray-700/60 bg-gray-950 px-4 py-3 text-sm text-gray-100 placeholder:text-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                placeholder="Contoh: Makanan Ringan, Elektronik, dll."
              />
              {errors.name && (
                <p className="text-xs sm:text-sm text-red-400 mt-1.5 flex items-center gap-1 font-medium animate-shake">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Submit Action */}
            <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-800/80">
              <Link
                href={route("categories.index")}
                className="px-5 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-gray-200 hover:bg-gray-800/50 transition"
              >
                Batal
              </Link>
              <button
                type="submit"
                disabled={processing}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 hover:bg-blue-500 hover:shadow-blue-500/40 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
              >
                <Save className="w-4 h-4" />
                {processing ? "Menyimpan..." : "Simpan Kategori"}
              </button>
            </div>
            
          </form>
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default Create;