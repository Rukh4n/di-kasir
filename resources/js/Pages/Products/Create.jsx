import React, { useState, useRef } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useForm, router, Link } from "@inertiajs/react";
import { PlusCircle, Save, ArrowLeft } from "lucide-react";
import JsBarcode from "jsbarcode";

const Create = ({ categories }) => {
  const { data, setData, processing, errors, reset } = useForm({
    code: "",
    name: "",
    category_id: "",
    price: "",
    stock: "",
    barcode: "",
  });

  const [barcodeImage, setBarcodeImage] = useState("");
  const canvasRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    router.post(route("products.store"), data, {
      onSuccess: () =>
        reset("code", "name", "category_id", "price", "stock", "barcode"),
    });
  };

  const generateCode = () => {
    const randomCode = "PRD-" + Math.floor(1000 + Math.random() * 9000);
    const barcode = "BC-" + Math.floor(100000 + Math.random() * 900000);
    setData("code", randomCode);
    setData("barcode", barcode);

    // Generate barcode on canvas
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      JsBarcode(canvas, barcode, { format: "CODE128", displayValue: true, fontSize: 16 });
      setBarcodeImage(canvas.toDataURL("image/png"));
    }
  };

  return (
    <AuthenticatedLayout>
      <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-6">
        <div className="w-full max-w-lg bg-gray-800 rounded-2xl p-8 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Tambah Produk</h1>
            <Link
              href={route("products.index")}
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
                Kode Produk
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="code"
                  value={data.code}
                  readOnly
                  className="w-full rounded-lg border border-gray-700 bg-gray-700 px-4 py-2 text-gray-300 cursor-not-allowed"
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
              {errors.code && <p className="text-sm text-red-500 mt-1">{errors.code}</p>}
            </div>

            {/* Barcode */}
            {data.barcode && (
              <div>
                <label htmlFor="barcode" className="block text-sm font-medium mb-2">
                  Barcode
                </label>
                <input
                  type="text"
                  id="barcode"
                  value={data.barcode}
                  readOnly
                  className="w-full rounded-lg border border-gray-700 bg-gray-700 px-4 py-2 text-gray-300 cursor-not-allowed"
                />
                <canvas ref={canvasRef} className="hidden" />
                {barcodeImage && (
                  <img
                    src={barcodeImage}
                    alt="Barcode"
                    className="mt-2 w-full h-auto"
                  />
                )}
              </div>
            )}

            {/* Input Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Nama Produk
              </label>
              <input
                type="text"
                id="name"
                value={data.name}
                onChange={(e) => setData("name", e.target.value)}
                className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2 text-gray-100 focus:border-indigo-500 focus:ring focus:ring-indigo-500/50"
                placeholder="Masukkan nama produk"
                required
              />
              {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category_id" className="block text-sm font-medium mb-2">
                Kategori
              </label>
              <select
                id="category_id"
                value={data.category_id}
                onChange={(e) => setData("category_id", e.target.value)}
                className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2 text-gray-100 focus:border-indigo-500 focus:ring focus:ring-indigo-500/50"
                required
              >
                <option value="">Pilih Kategori</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.category_id && <p className="text-sm text-red-500 mt-1">{errors.category_id}</p>}
            </div>

            {/* Price */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium mb-2">
                Harga
              </label>
              <input
                type="number"
                id="price"
                value={data.price}
                onChange={(e) => setData("price", e.target.value)}
                className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2 text-gray-100 focus:border-indigo-500 focus:ring focus:ring-indigo-500/50"
                placeholder="Masukkan harga produk"
                required
              />
              {errors.price && <p className="text-sm text-red-500 mt-1">{errors.price}</p>}
            </div>

            {/* Stock */}
            <div>
              <label htmlFor="stock" className="block text-sm font-medium mb-2">
                Stok
              </label>
              <input
                type="number"
                id="stock"
                value={data.stock}
                onChange={(e) => setData("stock", e.target.value)}
                className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2 text-gray-100 focus:border-indigo-500 focus:ring focus:ring-indigo-500/50"
                placeholder="Masukkan stok produk"
                required
              />
              {errors.stock && <p className="text-sm text-red-500 mt-1">{errors.stock}</p>}
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
