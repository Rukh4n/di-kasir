import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useForm, Link, router } from "@inertiajs/react";
import {
  Save,
  ArrowLeft,
  Search,
  Trash2,
  Camera,
  X,
} from "lucide-react";
import BarcodeScannerComponent from "react-qr-barcode-scanner";

const Create = ({ products = [] }) => {
  const { data, setData, post, processing, reset } = useForm({
    items: [],
    total_price: 0,
    cash_received: "",
    change: 0,
  });

  const [query, setQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [scanning, setScanning] = useState(false);

  const handleSearch = (e) => {
    const q = e.target.value;
    setQuery(q);

    router.get(
      route("transactions.searchProducts"),
      { query: q },
      {
        preserveState: true,
        replace: true,
        onSuccess: (page) => {
          setFilteredProducts(page.props.products || []);
        },
      }
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && filteredProducts.length === 1) {
      e.preventDefault();
      addProduct(filteredProducts[0]);
    }
  };

  const addProduct = (product) => {
    const exists = data.items.some((item) => item.id === product.id);
    if (exists) return;

    const newItems = [...data.items, { ...product, qty: 1 }];
    setData("items", newItems);
    calculateTotal(newItems);
    setQuery("");
    setFilteredProducts(products);
  };

  const removeProduct = (index) => {
    const newItems = data.items.filter((_, i) => i !== index);
    setData("items", newItems);
    calculateTotal(newItems);
  };

  const handleQtyChange = (index, value) => {
    const newItems = [...data.items];
    newItems[index].qty = parseInt(value) || 1;
    setData("items", newItems);
    calculateTotal(newItems);
  };

  const calculateTotal = (items) => {
    const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
    setData("total_price", total);
    if (data.cash_received) {
      setData("change", (data.cash_received || 0) - total);
    }
  };

  const handleCashChange = (value) => {
    setData("cash_received", value);
    setData("change", (value || 0) - data.total_price);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (data.cash_received < data.total_price) {
      alert("Uang diterima kurang dari total harga!");
      return;
    }
    post(route("transactions.store"), {
      onSuccess: () => reset(),
    });
  };

  const handleScanResult = (err, result) => {
    if (result) {
      setQuery(result.text);
      router.get(
        route("transactions.searchProducts"),
        { query: result.text },
        {
          preserveState: true,
          replace: true,
          onSuccess: (page) => {
            const foundProducts = page.props.products || [];
            setFilteredProducts(foundProducts);
            if (foundProducts.length === 1) {
              addProduct(foundProducts[0]);
              new Audio("/notification/notification-sound-effect-372475.mp3").play();
            }
          },
        }
      );
    }
  };

  return (
    <AuthenticatedLayout>
      <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-6">
        <div className="w-full max-w-5xl bg-gray-800 rounded-2xl p-8 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Tambah Transaksi</h1>
            <Link
              href={route("transactions.index")}
              className="flex items-center gap-2 text-gray-300 hover:text-white transition"
            >
              <ArrowLeft className="w-5 h-5" />
              Kembali
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Kolom kiri: Form Input */}
              <div className="space-y-6">
                {/* Cari Produk */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Cari Produk (Kode / Nama / Scan Barcode)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={query}
                      onChange={handleSearch}
                      onKeyDown={handleKeyDown}
                      className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2 text-gray-100 focus:border-indigo-500 focus:ring focus:ring-indigo-500/50"
                      placeholder="Masukkan kode, nama produk, atau scan barcode"
                    />
                    {!scanning ? (
                      <button
                        type="button"
                        onClick={() => setScanning(true)}
                        className="p-2 bg-indigo-600 rounded-lg text-white hover:bg-indigo-700"
                      >
                        <Camera className="w-5 h-5" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setScanning(false)}
                        className="p-2 bg-red-600 rounded-lg text-white hover:bg-red-700"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                    <Search className="w-6 h-6 text-gray-400 mt-2" />
                  </div>
                  {query && filteredProducts.length > 0 && (
                    <div className="mt-2 bg-gray-700 rounded-lg max-h-40 overflow-y-auto">
                      {filteredProducts.map((product) => (
                        <div
                          key={product.id}
                          onClick={() => addProduct(product)}
                          className="px-4 py-2 hover:bg-gray-600 cursor-pointer"
                        >
                          {product.code} - {product.name} (Rp{" "}
                          {parseFloat(product.price).toLocaleString()})
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Daftar Item */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Item Transaksi
                  </label>
                  {data.items.length === 0 ? (
                    <p className="text-gray-400 text-sm">
                      Belum ada produk yang dipilih.
                    </p>
                  ) : (
                    <table className="w-full text-sm border border-gray-700 rounded-lg overflow-hidden">
                      <thead className="bg-gray-700 text-left">
                        <tr>
                          <th className="px-4 py-2">Produk</th>
                          <th className="px-4 py-2">Harga</th>
                          <th className="px-4 py-2">Qty</th>
                          <th className="px-4 py-2">Subtotal</th>
                          <th className="px-4 py-2"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.items.map((item, index) => (
                          <tr
                            key={index}
                            className="border-t border-gray-700 hover:bg-gray-700/50"
                          >
                            <td className="px-4 py-2">{item.name}</td>
                            <td className="px-4 py-2">
                              Rp {parseFloat(item.price).toLocaleString()}
                            </td>
                            <td className="px-4 py-2">
                              <input
                                type="number"
                                min="1"
                                value={item.qty}
                                onChange={(e) =>
                                  handleQtyChange(index, e.target.value)
                                }
                                className="w-16 rounded-lg border border-gray-700 bg-gray-900 px-2 py-1 text-gray-100 focus:border-indigo-500 focus:ring focus:ring-indigo-500/50"
                              />
                            </td>
                            <td className="px-4 py-2">
                              Rp {(item.price * item.qty).toLocaleString()}
                            </td>
                            <td className="px-4 py-2 text-center">
                              <button
                                type="button"
                                onClick={() => removeProduct(index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>

                {/* Total */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Total Harga
                    </label>
                    <input
                      type="text"
                      value={`Rp ${parseFloat(data.total_price).toLocaleString()}`}
                      readOnly
                      className="w-full rounded-lg border border-gray-700 bg-gray-700 px-4 py-2 text-gray-300 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Uang Diterima
                    </label>
                    <input
                      type="number"
                      value={data.cash_received}
                      onChange={(e) => handleCashChange(parseInt(e.target.value))}
                      className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2 text-gray-100 focus:border-indigo-500 focus:ring focus:ring-indigo-500/50"
                      placeholder="Masukkan jumlah uang diterima"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Kembalian
                    </label>
                    <input
                      type="text"
                      value={`Rp ${parseFloat(data.change).toLocaleString()}`}
                      readOnly
                      className="w-full rounded-lg border border-gray-700 bg-gray-700 px-4 py-2 text-gray-300 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {/* Kolom kanan: Kamera */}
              <div className="flex flex-col items-center">
                {scanning && (
                  <div className="relative border border-gray-600 rounded-lg overflow-hidden w-[400px] h-[250px]">
                    <BarcodeScannerComponent
                      width={400}
                      height={250}
                      onUpdate={handleScanResult}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-40 h-32 border-2 border-white rounded-md"></div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={processing || data.cash_received < data.total_price}
                className="flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2 text-white font-semibold shadow-lg hover:bg-green-700 transition disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                Simpan Transaksi
              </button>
            </div>
          </form>
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default Create;
