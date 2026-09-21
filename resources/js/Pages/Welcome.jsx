import React from 'react';
import { Head, Link } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import { Store, ShieldCheck } from 'lucide-react';

const Welcome = () => {
  return (
    <GuestLayout>
      <Head title="Selamat Datang" />
      <div className="relative min-h-[calc(100vh-3.5rem)] flex items-center justify-center p-4">
        <div className="absolute inset-0 opacity-10 z-0 bg-cover bg-center bg-[url('/images/background-pattern.svg')]"></div>
        <div className="relative z-10 w-full max-w-xl bg-gray-900 border border-gray-800 p-6 sm:p-10 rounded-2xl shadow-2xl text-center space-y-6">
          <div className="flex justify-center items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Store className="w-6 h-6" />
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </div>
          <div className="space-y-3">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Aplikasi Kasir Multi Cabang
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-md mx-auto">
              Sistem kasir modern untuk pengelolaan multi cabang, dengan setiap cabang memiliki kasir dan manajemen operasionalnya masing-masing secara terpusat dan efisien.
            </p>
          </div>
          <div className="pt-2">
            <Link href={route('login')} className="inline-block w-full sm:w-auto">
              <PrimaryButton className="w-full sm:w-auto justify-center px-8 py-3 text-xs sm:text-sm font-semibold shadow-lg shadow-blue-600/30">
                Masuk
              </PrimaryButton>
            </Link>
          </div>
        </div>
      </div>
    </GuestLayout>
  );
};

export default Welcome;