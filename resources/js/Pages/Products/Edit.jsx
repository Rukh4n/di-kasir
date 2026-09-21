import React, { useState, useRef, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {Head, useForm, Link } from "@inertiajs/react";
import { Tag, Save, ArrowLeft, Barcode, DollarSign, Layers, Building2, AlertCircle, Lock, Unlock, Package, TrendingUp, Download } from "lucide-react";
import JsBarcode from "jsbarcode";

const Edit = ({ product, categories = [] }) => {
  const { data, setData, put, processing, errors } = useForm({
    product_code: product.product_code || product.code || "",
    name: product.name || "",
    category_id: product.category_id || "",
    cost_price: product.cost_price || "",
    price: product.price || "",
    stock: product.stock || "",
    branch_id: product.branch_id || "",
  });

  const [barcodeImage, setBarcodeImage] = useState("");
  const [isEditable, setIsEditable] = useState(false);
  const canvasRef = useRef(null);

  const formatRupiah = (val) => (!val && val !== 0 ? "" : (val.toString().replace(/[^0-9]/g, "") ? new Intl.NumberFormat("id-ID").format(val.toString().replace(/[^0-9]/g, "")) : ""));
  const parseNumber = (val) => val.replace(/[^0-9]/g, "");

  useEffect(() => {
    if (data.product_code && canvasRef.current) {
      try {
        JsBarcode(canvasRef.current, data.product_code, { format: "CODE128", displayValue: true, fontSize: 14, margin: 10, background: "#ffffff", lineColor: "#0f172a", height: 50 });
        setBarcodeImage(canvasRef.current.toDataURL("image/png"));
      } catch (err) {}
    }
  }, [data.product_code]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isEditable) {
      return;
    }
    put(route("products.update", product.code), {
      onSuccess: () => {},
      onError: (err) => {},
    });
  };

  const handleDownloadBarcode = async () => {
    const activeBarcode = product.barcode ? `/storage/${product.barcode}` : barcodeImage;
    if (!activeBarcode) return;

    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = activeBarcode;

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const padding = 20;
      const textHeight = 40;
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(img.width, 300);
      canvas.height = img.height + textHeight + (padding * 2);

      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const x = (canvas.width - img.width) / 2;
      ctx.drawImage(img, x, padding);

      ctx.fillStyle = "#0f172a";
      ctx.font = "bold 14px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      
      const productName = data.name || "Nama Produk";
      ctx.fillText(productName, canvas.width / 2, img.height + padding + 10);

      const compositeDataUrl = canvas.toDataURL("image/png");

      const link = document.createElement("a");
      link.href = compositeDataUrl;
      link.download = `Barcode-${data.product_code || "product"}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      const link = document.createElement("a");
      link.href = activeBarcode;
      link.download = `Barcode-${data.product_code || "product"}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const toggleEdit = () => setIsEditable((prev) => !prev);
  const selectedCategoryObj = categories.find((cat) => String(cat.id) === String(data.category_id));

  return (
    <AuthenticatedLayout>
      <Head title="Edit Produk">
        <meta name="description" content="Edit produkmu di sini." />
      </Head>
      <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900/60 backdrop-blur-md p-5 rounded-2xl border border-slate-800 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-white tracking-tight">Detail & Edit Produk</h1>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase border ${isEditable ? "bg-blue-500/10 text-blue-400 border-blue-500/20" : "bg-slate-800 text-slate-400 border-slate-700"}`}>
                    {isEditable ? "Mode Edit" : "Mode Baca"}
                  </span>
                </div>
                <p className="text-xs text-slate-400">Kelola dan perbarui data inventaris produk sesuai kebutuhan.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={toggleEdit}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition-all duration-200 border bg-blue-500/10 text-blue-400 hover:bg-blue-600 hover:text-white border-blue-500/30"
              >
                {isEditable ? <><Lock className="w-3.5 h-3.5" /> Batal Edit</> : <><Unlock className="w-3.5 h-3.5" /> Aktifkan Edit</>}
              </button>
              <Link href={route("products.index")} className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-blue-600 hover:text-white border border-slate-700/60 transition-all duration-200">
                <ArrowLeft className="w-3.5 h-3.5" /> Kembali
              </Link>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6 bg-slate-900/80 backdrop-blur-xl p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl">
                <h2 className="text-base font-semibold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-blue-400" /> Informasi Utama Produk
                </h2>

                <div className="space-y-2">
                  <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Nama Produk <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={data.name}
                    onChange={(e) => {
                      setData("name", e.target.value);
                    }}
                    readOnly={!isEditable}
                    className={`w-full rounded-xl border ${errors.name ? "border-rose-500 focus:ring-rose-500/20" : "border-slate-700/80 focus:border-blue-500 focus:ring-blue-500/20"} ${isEditable ? "bg-slate-950/60 text-slate-100" : "bg-slate-950/20 text-slate-400 cursor-not-allowed border-slate-800"} px-4 py-3 text-sm placeholder-slate-500 focus:outline-none focus:ring-4 transition duration-150`}
                    placeholder="Masukkan nama produk"
                    required
                  />
                  {errors.name && (
                    <p className="flex items-center gap-1.5 text-xs text-rose-400 mt-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.name}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="category_id" className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Kategori Produk <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="category_id"
                      value={data.category_id}
                      onChange={(e) => {
                        const val = e.target.value;
                        const selectedCategory = categories.find((cat) => cat.id === parseInt(val));
                        setData((prevData) => ({ ...prevData, category_id: val, branch_id: selectedCategory?.branch_id || prevData.branch_id }));
                      }}
                      disabled={!isEditable}
                      className={`w-full rounded-xl border ${errors.category_id ? "border-rose-500 focus:ring-rose-500/20" : "border-slate-700/80 focus:border-blue-500 focus:ring-blue-500/20"} ${isEditable ? "bg-slate-950/60 text-slate-100" : "bg-slate-950/20 text-slate-400 cursor-not-allowed border-slate-800"} px-4 py-3 text-sm focus:outline-none focus:ring-4 transition duration-150 appearance-none`}
                      required
                    >
                      <option value="" disabled className="bg-slate-900 text-slate-400">-- Pilih Kategori --</option>
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
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.category_id}
                    </p>
                  )}
                </div>

                {(selectedCategoryObj?.branch || product.branch) && (
                  <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/80 flex items-center gap-3">
                    <Building2 className="w-4 h-4 text-blue-400 shrink-0" />
                    <div className="text-xs">
                      <span className="text-slate-400">Terhubung ke Cabang: </span>
                      <span className="font-medium text-slate-200">{selectedCategoryObj?.branch?.name || product.branch?.name}</span>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="space-y-2">
                    <label htmlFor="cost_price" className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                      Harga Modal (Rp) <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                        <DollarSign className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        id="cost_price"
                        value={formatRupiah(data.cost_price)}
                        onChange={(e) => {
                          const parsed = parseNumber(e.target.value);
                          setData("cost_price", parsed);
                        }}
                        readOnly={!isEditable}
                        className={`w-full rounded-xl border ${errors.cost_price ? "border-rose-500 focus:ring-rose-500/20" : "border-slate-700/80 focus:border-blue-500 focus:ring-blue-500/20"} ${isEditable ? "bg-slate-950/60 text-slate-100" : "bg-slate-950/20 text-slate-400 cursor-not-allowed border-slate-800"} pl-10 pr-4 py-3 text-sm placeholder-slate-500 focus:outline-none focus:ring-4 transition duration-150`}
                        placeholder="0"
                        required
                      />
                    </div>
                    {errors.cost_price && (
                      <p className="flex items-center gap-1.5 text-xs text-rose-400 mt-1">
                        <AlertCircle className="w-3.5 h-3.5" /> {errors.cost_price}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="price" className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                      Harga Jual (Rp) <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                        <TrendingUp className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        id="price"
                        value={formatRupiah(data.price)}
                        onChange={(e) => {
                          const parsed = parseNumber(e.target.value);
                          setData("price", parsed);
                        }}
                        readOnly={!isEditable}
                        className={`w-full rounded-xl border ${errors.price ? "border-rose-500 focus:ring-rose-500/20" : "border-slate-700/80 focus:border-blue-500 focus:ring-blue-500/20"} ${isEditable ? "bg-slate-950/60 text-slate-100" : "bg-slate-950/20 text-slate-400 cursor-not-allowed border-slate-800"} pl-10 pr-4 py-3 text-sm placeholder-slate-500 focus:outline-none focus:ring-4 transition duration-150`}
                        placeholder="0"
                        required
                      />
                    </div>
                    {errors.price && (
                      <p className="flex items-center gap-1.5 text-xs text-rose-400 mt-1">
                        <AlertCircle className="w-3.5 h-3.5" /> {errors.price}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="stock" className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                      Jumlah Stok <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="stock"
                      min="0"
                      value={data.stock}
                      onChange={(e) => {
                        setData("stock", e.target.value);
                      }}
                      readOnly={!isEditable}
                      className={`w-full rounded-xl border ${errors.stock ? "border-rose-500 focus:ring-rose-500/20" : "border-slate-700/80 focus:border-blue-500 focus:ring-blue-500/20"} ${isEditable ? "bg-slate-950/60 text-slate-100" : "bg-slate-950/20 text-slate-400 cursor-not-allowed border-slate-800"} px-4 py-3 text-sm placeholder-slate-500 focus:outline-none focus:ring-4 transition duration-150`}
                      placeholder="0"
                      required
                    />
                    {errors.stock && (
                      <p className="flex items-center gap-1.5 text-xs text-rose-400 mt-1">
                        <AlertCircle className="w-3.5 h-3.5" /> {errors.stock}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-slate-900/80 backdrop-blur-xl p-6 rounded-2xl border border-slate-800 shadow-xl space-y-6">
                  <h2 className="text-base font-semibold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
                    <Barcode className="w-4 h-4 text-blue-400" /> Identifikasi Barcode
                  </h2>

                  <div className="space-y-2">
                    <label htmlFor="product_code" className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                      Kode SKUs / Produk
                    </label>
                    <input
                      type="text"
                      id="product_code"
                      value={data.product_code}
                      readOnly
                      className="w-full rounded-xl border border-slate-800 bg-slate-950/40 px-3.5 py-2.5 text-sm font-mono text-slate-400 cursor-not-allowed"
                    />
                    <p className="text-[11px] text-slate-500">Kode produk bersifat unik dan tidak dapat diubah.</p>
                  </div>

                  <canvas ref={canvasRef} className="hidden" />
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col items-center justify-center min-h-[160px] text-center space-y-3">
                    {product.barcode ? (
                      <div className="space-y-2 w-full">
                        <div className="bg-white p-3 rounded-lg shadow-inner inline-block w-full">
                          <img src={`/storage/${product.barcode}`} alt="Barcode" className="max-h-24 w-auto mx-auto object-contain" />
                        </div>
                        <p className="text-xs font-semibold text-slate-200 truncate px-1">{data.name || "Nama Produk"}</p>
                        <p className="text-[11px] text-slate-400 font-mono">Penyimpanan: File System</p>
                      </div>
                    ) : barcodeImage ? (
                      <div className="space-y-2 w-full">
                        <div className="bg-white p-3 rounded-lg shadow-inner inline-block w-full">
                          <img src={barcodeImage} alt="Barcode Preview" className="max-h-24 w-auto mx-auto object-contain" />
                        </div>
                        <p className="text-xs font-semibold text-slate-200 truncate px-1">{data.name || "Nama Produk"}</p>
                        <p className="text-[11px] text-slate-400 font-mono">Format: CODE128 (Generated)</p>
                      </div>
                    ) : (
                      <div className="text-slate-500 text-xs py-4">Tidak ada barcode yang tersedia.</div>
                    )}

                    {(product.barcode || barcodeImage) && (
                      <button
                        type="button"
                        onClick={handleDownloadBarcode}
                        className="inline-flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium border border-blue-500 transition duration-150 mt-2"
                      >
                        <Download className="w-3.5 h-3.5 text-white" /> Download Barcode
                      </button>
                    )}
                  </div>
                </div>

                {isEditable && (
                  <div className="bg-slate-900/80 backdrop-blur-xl p-5 rounded-2xl border border-slate-800 shadow-xl flex items-center justify-between gap-4">
                    <div className="text-xs text-slate-400">Perubahan akan disimpan langsung ke sistem.</div>
                    <button
                      type="submit"
                      disabled={processing}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 text-sm shadow-lg shadow-blue-600/25 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                    >
                      <Save className="w-4 h-4" /> {processing ? "Menyimpan..." : "Simpan Perubahan"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default Edit;
