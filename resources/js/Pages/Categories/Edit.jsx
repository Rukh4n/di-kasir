import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useForm, router, Link } from "@inertiajs/react";
import { Save, ArrowLeft, ToggleLeft, ToggleRight } from "lucide-react";

const Edit = ({ category }) => {
  const { data, setData, processing, errors } = useForm({
    code: category.code || "",
    name: category.name || "",
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
      <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-gray-800 rounded-2xl p-6 shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold">Edit Kategori</h1>
            <Link
              href={route("categories.index")}
              className="flex items-center gap-1 text-gray-300 hover:text-white transition text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </Link>
          </div>

          {/* Tombol Toggle Edit */}
          <div className="flex justify-center mb-4">
            <button
              type="button"
              onClick={toggleEdit}
              className={`flex items-center gap-1 rounded-md px-4 py-1 text-xs font-medium shadow-sm transition ${
                isEditable
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-yellow-600 hover:bg-yellow-700 text-white"
              }`}
            >
              {isEditable ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
              {isEditable ? "Ngga Jadi" : "Edit"}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Input Code */}
            <div>
              <label htmlFor="code" className="block text-xs font-medium mb-1">
                Kode Kategori
              </label>
              <input
                type="text"
                id="code"
                value={data.code}
                readOnly
                className="w-full rounded-md border border-gray-700 bg-gray-700 px-3 py-1 text-gray-300 cursor-not-allowed text-sm"
              />
            </div>

            {/* Input Name */}
            <div>
              <label htmlFor="name" className="block text-xs font-medium mb-1">
                Nama Kategori
              </label>
              <input
                type="text"
                id="name"
                value={data.name}
                onChange={(e) => setData("name", e.target.value)}
                className={`w-full rounded-md border px-3 py-1 text-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500/50 ${
                  isEditable
                    ? "border-gray-700 bg-gray-900 text-gray-100"
                    : "border-gray-700 bg-gray-700 text-gray-300 cursor-not-allowed"
                }`}
                readOnly={!isEditable}
                required
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>

            {/* Submit */}
            {isEditable && (
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={processing}
                  className="flex items-center gap-1 rounded-md bg-green-600 px-4 py-1 text-xs text-white font-semibold shadow-sm hover:bg-green-700 transition disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  Simpan
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
