import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useForm, Link, router } from "@inertiajs/react";
import { PlusCircle, Save, ArrowLeft } from "lucide-react";

const Create = () => {
  const { data, setData, processing, errors, reset } = useForm({
    code: "",
    name: "",
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
      <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-6">
        <div className="w-full max-w-lg bg-gray-800 rounded-2xl p-8 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Tambah Kategori</h1>
            <Link
              href={route("categories.index")}
              className="flex items-center gap-2 text-gray-300 hover:text-white transition"
            >
              <ArrowLeft className="w-5 h-5" />
              Kembali
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Input Code */}
            <div>
              <label htmlFor="code" className="block text-sm font-medium mb-2">
                Kode Kategori
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="code"
                  value={data.code}
                  readOnly
                  className="w-full rounded-lg border border-gray-700 bg-gray-700 px-4 py-2 text-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-500/50 cursor-not-allowed"
                  placeholder="Klik Generate untuk membuat kode"
                />
                <button
                  type="button"
                  onClick={generateCode}
                  className="flex items-center gap-1 rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 transition"
                >
                  <PlusCircle className="w-4 h-4" />
                  Generate
                </button>
              </div>
              {errors.code && (
                <p className="text-sm text-red-500 mt-1">{errors.code}</p>
              )}
            </div>

            {/* Input Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Nama Kategori
              </label>
              <input
                type="text"
                id="name"
                value={data.name}
                onChange={(e) => setData("name", e.target.value)}
                className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2 text-gray-100 focus:border-indigo-500 focus:ring focus:ring-indigo-500/50"
                placeholder="Masukkan nama kategori"
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">{errors.name}</p>
              )}
            </div>

            {/* Submit */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={processing}
                className="flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2 text-white font-semibold shadow-lg hover:bg-green-700 transition disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                Simpan
              </button>
            </div>
          </form>
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default Create;
