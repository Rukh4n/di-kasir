import React, { useState, useRef, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useForm, router, Link } from "@inertiajs/react";
import { Save, ArrowLeft, ToggleLeft, ToggleRight } from "lucide-react";
import JsBarcode from "jsbarcode";

const Edit = ({ product, categories }) => {
  const { data, setData, processing, errors } = useForm({
    code: product.code || "",
    name: product.name || "",
    category_id: product.category_id || "",
    price: product.price || "",
    stock: product.stock || "",
    barcode: product.barcode || "",
  });

  const [barcodeImage, setBarcodeImage] = useState("");
  const [isEditable, setIsEditable] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (data.barcode && canvasRef.current) {
      JsBarcode(canvasRef.current, data.barcode, {
        format: "CODE128",
        displayValue: true,
        fontSize: 16,
      });
      setBarcodeImage(canvasRef.current.toDataURL("image/png"));
    }
  }, [data.barcode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isEditable) return;
    router.put(route("products.update", product.id), data);
  };

  const toggleEdit = () => setIsEditable(!isEditable);

  return (
    <AuthenticatedLayout>
      <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-gray-800 rounded-2xl p-6 shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold">Edit Produk</h1>
            <Link
              href={route("products.index")}
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
                Kode Produk
              </label>
              <input
                type="text"
                id="code"
                value={data.code}
                readOnly
                className="w-full rounded-md border border-gray-700 bg-gray-700 px-3 py-1 text-gray-300 cursor-not-allowed text-sm"
              />
            </div>

            {/* Barcode */}
            {data.barcode && (
              <div>
                <label htmlFor="barcode" className="block text-xs font-medium mb-1">
                  Barcode
                </label>
                <input
                  type="text"
                  id="barcode"
                  value={data.barcode}
                  readOnly
                  className="w-full rounded-md border border-gray-700 bg-gray-700 px-3 py-1 text-gray-300 cursor-not-allowed text-sm"
                />
                <canvas ref={canvasRef} className="hidden" />
                {barcodeImage && (
                  <img
                    src={barcodeImage}
                    alt="Barcode"
                    className="mt-1 w-full h-auto"
                  />
                )}
              </div>
            )}

            {/* Input Name */}
            <div>
              <label htmlFor="name" className="block text-xs font-medium mb-1">
                Nama Produk
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

            {/* Category */}
            <div>
              <label htmlFor="category_id" className="block text-xs font-medium mb-1">
                Kategori
              </label>
              <select
                id="category_id"
                value={data.category_id}
                onChange={(e) => setData("category_id", e.target.value)}
                className={`w-full rounded-md border px-3 py-1 text-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500/50 ${
                  isEditable
                    ? "border-gray-700 bg-gray-900 text-gray-100"
                    : "border-gray-700 bg-gray-700 text-gray-300 cursor-not-allowed"
                }`}
                disabled={!isEditable}
                required
              >
                <option value="">Pilih Kategori</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.category_id && <p className="text-xs text-red-500 mt-1">{errors.category_id}</p>}
            </div>

            {/* Price */}
            <div>
              <label htmlFor="price" className="block text-xs font-medium mb-1">
                Harga
              </label>
              <input
                type="number"
                id="price"
                value={data.price}
                onChange={(e) => setData("price", e.target.value)}
                className={`w-full rounded-md border px-3 py-1 text-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500/50 ${
                  isEditable
                    ? "border-gray-700 bg-gray-900 text-gray-100"
                    : "border-gray-700 bg-gray-700 text-gray-300 cursor-not-allowed"
                }`}
                readOnly={!isEditable}
                required
              />
              {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
            </div>

            {/* Stock */}
            <div>
              <label htmlFor="stock" className="block text-xs font-medium mb-1">
                Stok
              </label>
              <input
                type="number"
                id="stock"
                value={data.stock}
                onChange={(e) => setData("stock", e.target.value)}
                className={`w-full rounded-md border px-3 py-1 text-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500/50 ${
                  isEditable
                    ? "border-gray-700 bg-gray-900 text-gray-100"
                    : "border-gray-700 bg-gray-700 text-gray-300 cursor-not-allowed"
                }`}
                readOnly={!isEditable}
                required
              />
              {errors.stock && <p className="text-xs text-red-500 mt-1">{errors.stock}</p>}
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
