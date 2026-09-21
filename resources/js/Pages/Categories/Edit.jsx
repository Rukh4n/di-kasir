import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {Head, useForm, router, Link } from "@inertiajs/react";
import { Save, ArrowLeft, ToggleLeft, ToggleRight, Layers, Edit3, ShieldAlert } from "lucide-react";

const Edit = ({ category, branches = [] }) => {
  const isAdmin = branches.length > 0;

  const { data, setData, processing, errors } = useForm({
    code: category.code || "",
    name: category.name || "",
    branch_id: category.branch_id || (isAdmin ? "" : undefined),
  });

  const [isEditable, setIsEditable] = useState(false);

  const toggleEdit = () => setIsEditable(!isEditable);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isEditable) return;
    router.put(route("categories.update", category.id), data);
  };

  return (
    <AuthenticatedLayout>
    <Head title="Edit Kategori">
      <meta name="description" content="Edit kategori di sini." />
    </Head>      
    <div className="min-h-[85vh] bg-gray-950 text-gray-100 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-xl bg-gray-900/80 backdrop-blur-xl border border-gray-800/80 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-blue-950/20">
          
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-gray-800/80">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-inner">
                <Edit3 className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">Edit Kategori</h1>
                <p className="text-xs sm:text-sm text-gray-400 mt-0.5">Perbarui informasi kategori inventaris</p>
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

          {/* Status & Toggle Bar */}
          <div className="flex items-center justify-between bg-gray-950/50 border border-gray-800/80 px-4 py-3 rounded-2xl mb-6">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${isEditable ? "bg-amber-500 animate-pulse" : "bg-blue-500"}`} />
              <span className="text-xs sm:text-sm font-medium text-gray-300">
                Mode: <strong className={isEditable ? "text-amber-400" : "text-blue-400"}>{isEditable ? "Sedang Diedit" : "Terkunci (Read-Only)"}</strong>
              </span>
            </div>
            
            <button
              type="button"
              onClick={toggleEdit}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold shadow-md transition-all active:scale-95 ${
                isEditable
                  ? "bg-red-600/20 text-red-400 border border-red-500/30 hover:bg-red-600/30"
                  : "bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600/30"
              }`}
            >
              {isEditable ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
              {isEditable ? "Batal Edit" : "Ubah Data"}
            </button>
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
                    className={`w-full rounded-xl border px-4 py-3 text-sm transition-all ${
                      isEditable
                        ? "border-blue-500/60 bg-gray-950 text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        : "border-gray-700/60 bg-gray-950/40 text-gray-400 cursor-not-allowed"
                    }`}
                    disabled={!isEditable}
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
                  <p className="text-xs sm:text-sm text-red-400 mt-1.5 flex items-center gap-1 font-medium">
                    {errors.branch_id}
                  </p>
                )}
              </div>
            )}

            {/* Input Code */}
            <div className="space-y-2">
              <label htmlFor="code" className="block text-sm font-semibold text-gray-200">
                Kode Kategori <span className="text-gray-500 text-xs font-normal">(Tidak dapat diubah)</span>
              </label>
              <input
                type="text"
                id="code"
                value={data.code}
                readOnly
                className="w-full rounded-xl border border-gray-700/60 bg-gray-950/60 px-4 py-3 text-sm text-gray-400 cursor-not-allowed select-none"
              />
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
                className={`w-full rounded-xl border px-4 py-3 text-sm transition-all ${
                  isEditable
                    ? "border-blue-500/60 bg-gray-950 text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    : "border-gray-700/60 bg-gray-950/40 text-gray-400 cursor-not-allowed"
                }`}
                readOnly={!isEditable}
                required
                placeholder="Masukkan nama kategori"
              />
              {errors.name && (
                <p className="text-xs sm:text-sm text-red-400 mt-1.5 flex items-center gap-1 font-medium">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Submit Action */}
            {isEditable && (
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-800/80 animate-fade-in">
                <button
                  type="button"
                  onClick={toggleEdit}
                  className="px-5 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-gray-200 hover:bg-gray-800/50 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 hover:bg-blue-500 hover:shadow-blue-500/40 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                >
                  <Save className="w-4 h-4" />
                  {processing ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            )}
            
          </form>
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default Edit;
