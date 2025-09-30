import React from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

const plans = [
  {
    category: "Setup Server Sendiri",
    options: [
      {
        title: "Bayar Langsung",
        price: "Rp 1.000.000",
        subtitle: "Sekali bayar",
        description:
          "Cocok untuk Anda yang ingin kontrol penuh server dengan biaya lebih murah.",
        features: [
          "Biaya awal Rp 1.000.000",
          "Kontrol penuh server",
          "Cocok untuk tim IT mandiri",
        ],
      },
      {
        title: "Kredit",
        price: "Rp 1.300.000",
        subtitle: "26x cicilan tanpa bunga",
        description:
          "Pilih opsi cicilan tanpa bunga untuk kemudahan pembayaran.",
        features: [
          "Total biaya Rp 1.300.000",
          "26x cicilan ringan",
          "Tanpa bunga tambahan",
        ],
      },
    ],
  },
  {
    category: "Tinggal Pakai",
    options: [
      {
        title: "Bayar Langsung",
        price: "Rp 1.600.000",
        subtitle: "Kemudian Rp 60.000/bulan",
        description:
          "Tinggal pakai dengan mudah tanpa pusing memikirkan perbaikan, backup data, atau setup server mandiri.",
        features: [
          "Biaya awal Rp 1.600.000",
          "Langganan Rp 60.000/bulan",
          "Maintenance & Backup otomatis",
          "Tanpa ribet setup server",
        ],
      },
      {
        title: "Kredit",
        price: "Rp 2.100.000",
        subtitle: "Cicilan Rp 50.000/bulan (tanpa bunga)",
        description: "Tinggal pakai dengan cicilan ringan tanpa beban tambahan.",
        features: [
          "Total biaya Rp 2.100.000",
          "Cicilan Rp 50.000/bulan",
          "Tanpa bunga tambahan",
          "Semua fitur premium",
        ],
      },
    ],
  },
];

const PricingSection = () => {
  const handleWhatsAppClick = (planTitle) => {
    const phoneNumber = "6285727165906"; // format internasional untuk WhatsApp
    const message = `Halo ka, saya sudah tertarik untuk membeli paket ${planTitle}. saya ingin bertemu untuk membahas seputar aplikasi ini lebih lanjut apakah bisa?`;
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(url, "_blank");
  };

  return (
    <section className="relative w-full min-h-screen bg-gradient-to-b from-blue-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 px-6 md:px-20 py-16">
      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.h2
          className="text-3xl md:text-5xl font-extrabold text-center text-blue-800 dark:text-white mb-12"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          Paket Harga <span className="text-orange-500 italic">di</span>
          <span className="text-blue-800 font-bold italic">Kasir</span>
        </motion.h2>

        <div className="space-y-16">
          {plans.map((planCategory, idx) => (
            <div key={idx}>
              <motion.h3
                className="text-2xl font-bold text-center text-orange-600 dark:text-orange-400 mb-8"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true, amount: 0.3 }}
              >
                {planCategory.category}
              </motion.h3>

              <div className="grid md:grid-cols-2 gap-8">
                {planCategory.options.map((plan, i) => (
                  <motion.div
                    key={i}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 flex flex-col justify-between"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: i * 0.2 }}
                    viewport={{ once: true, amount: 0.2 }}
                  >
                    <div>
                      <h4 className="text-xl font-bold text-blue-700 dark:text-white mb-2">
                        {plan.title}
                      </h4>
                      <p className="text-2xl font-extrabold text-orange-600 mb-1">
                        {plan.price}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        {plan.subtitle}
                      </p>
                      <p className="text-gray-700 dark:text-gray-300 mb-6">
                        {plan.description}
                      </p>
                      <ul className="space-y-3">
                        {plan.features.map((feature, j) => (
                          <li
                            key={j}
                            className="flex items-center text-gray-700 dark:text-gray-300"
                          >
                            <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <button
                      onClick={() => handleWhatsAppClick(plan.title)}
                      className="mt-8 w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition"
                    >
                      Pilih Paket
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
