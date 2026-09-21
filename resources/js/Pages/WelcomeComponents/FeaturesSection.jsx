import React from "react";
import {
  Layers,
  Package,
  Barcode,
  Trash2,
  FileSpreadsheet,
  ShoppingCart,
  BarChart2,
  Settings,
} from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: <Layers className="w-8 h-8 text-blue-600" />,
    title: "Manajemen Kategori",
    description: "Upload & edit kategori produk dengan mudah.",
  },
  {
    icon: <Trash2 className="w-8 h-8 text-orange-500" />,
    title: "Hapus Kategori",
    description: "Khusus admin atau pemilik toko untuk keamanan data.",
  },
  {
    icon: <Package className="w-8 h-8 text-blue-600" />,
    title: "Manajemen Produk",
    description: "Upload produk, update data, dan kelola stok lebih rapi.",
  },
  {
    icon: <Barcode className="w-8 h-8 text-orange-500" />,
    title: "Barcode Otomatis",
    description: "Generate barcode untuk setiap produk secara instan.",
  },
  {
    icon: <Trash2 className="w-8 h-8 text-orange-600" />,
    title: "Hapus Produk",
    description: "Hanya pemilik toko atau admin yang bisa menghapus produk.",
  },
  {
    icon: <FileSpreadsheet className="w-8 h-8 text-blue-500" />,
    title: "Export Produk",
    description: "Export data produk beserta barcodenya (admin/pemilik).",
  },
  {
    icon: <ShoppingCart className="w-8 h-8 text-orange-600" />,
    title: "Transaksi Cepat",
    description: "Buat transaksi penjualan dengan cepat & akurat.",
  },
  {
    icon: <Trash2 className="w-8 h-8 text-orange-500" />,
    title: "Hapus Transaksi",
    description: "Khusus pemilik toko atau admin untuk kontrol penuh.",
  },
  {
    icon: <FileSpreadsheet className="w-8 h-8 text-blue-600" />,
    title: "Export Transaksi",
    description: "Export semua transaksi ke Excel (khusus admin/pemilik).",
  },
  {
    icon: <BarChart2 className="w-8 h-8 text-orange-600" />,
    title: "Dashboard Statistik",
    description: "Pantau penjualan dengan grafik & analitik real-time.",
  },
  {
    icon: <Settings className="w-8 h-8 text-blue-700" />,
    title: "Halaman Opsi",
    description:
      "Khusus admin/pemilik toko untuk menghapus transaksi lama atau yang sudah di-backup agar penyimpanan tetap lega.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="relative w-full min-h-screen bg-gradient-to-b from-white via-blue-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 px-4 sm:px-8 md:px-16 lg:px-24 py-16 overflow-hidden">
      {/* Background Illustration */}
      <div className="absolute inset-0 opacity-10 z-0">
        <img
          src="/welcome/dashboard.png"
          alt="Dashboard Illustration"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.h2
          className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-center mb-8 text-blue-900 dark:text-white"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          Fitur Utama{" "}
          <span className="text-orange-500 italic font-bold">di </span>
          <span className="text-blue-800 italic font-bold">Kasir</span>
        </motion.h2>

        {/* Preview Image */}
        <motion.div
          className="mb-12 flex justify-center items-center"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <img
            src="/welcome/dashboard.png"
            alt="Preview Aplikasi"
            className="rounded-xl shadow-lg border w-full sm:w-4/5 md:w-3/4 lg:w-2/3 xl:w-1/2 object-contain"
          />
        </motion.div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 flex flex-col items-start gap-3 hover:shadow-2xl transition border-t-4 border-orange-400 relative z-10"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <div className="p-3 bg-blue-50 dark:bg-gray-700 rounded-xl">
                {feature.icon}
              </div>
              <h3 className="text-base sm:text-lg font-bold text-blue-700 dark:text-white">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
