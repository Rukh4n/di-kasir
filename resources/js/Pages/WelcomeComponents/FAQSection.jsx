import React, { useState } from "react";
import { motion } from "framer-motion";
import { HelpCircle, ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    question: "Apakah aplikasi ini bisa digunakan di semua perangkat?",
    answer:
      "Ya, aplikasi kasir berbasis website ini bisa diakses melalui komputer, laptop, tablet, maupun smartphone selama terhubung dengan internet.",
  },
  {
    question: "Apakah ada biaya tambahan selain harga paket?",
    answer:
      "Tidak ada biaya tersembunyi. Untuk paket 'Tinggal Pakai', Anda hanya membayar biaya bulanan sesuai pilihan paket.",
  },
  {
    question: "Bagaimana dengan keamanan data?",
    answer:
      "Data Anda aman karena kami menggunakan enkripsi dan backup data berkala untuk memastikan keamanan transaksi.",
  },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative w-full min-h-screen bg-orange-100 dark:bg-orange-700 px-6 md:px-20 py-16">
      <div className="max-w-5xl mx-auto">
        {/* Title */}
        <motion.h2
          className="text-3xl md:text-5xl font-extrabold text-center mb-12 text-orange-700 dark:text-white"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          Pertanyaan yang Sering <span className="text-blue-700">Diajukan</span>
        </motion.h2>

        {/* FAQ List */}
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 border border-orange-200 dark:border-gray-700 hover:shadow-2xl transition"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <button
                className="w-full flex justify-between items-center text-left"
                onClick={() => toggleFAQ(index)}
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-6 h-6 text-blue-600" />
                  <span className="text-lg font-semibold text-orange-700 dark:text-white">
                    {faq.question}
                  </span>
                </div>
                {openIndex === index ? (
                  <ChevronUp className="w-6 h-6 text-orange-600 dark:text-blue-400" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-orange-600 dark:text-blue-400" />
                )}
              </button>

              {openIndex === index && (
                <motion.p
                  className="mt-4 text-gray-600 dark:text-gray-300 text-base leading-relaxed"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.4 }}
                >
                  {faq.answer}
                </motion.p>
              )}

              {/* Tambahan jawaban umum di bawah setiap pertanyaan */}
              <p className="mt-3 text-sm text-blue-700 dark:text-orange-300 italic">
                Anda juga bisa upgrade paket kapan pun sesuai kebutuhan bisnis
                tanpa kehilangan data sebelumnya.
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
