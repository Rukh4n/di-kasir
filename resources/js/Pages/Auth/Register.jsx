import { Head, Link } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import { ShieldAlert } from 'lucide-react';

export default function Register() {
    return (
        <GuestLayout>
            <Head title="Registrasi Ditutup" />
            <div className="flex items-center justify-center min-h-screen p-4">
                <div className="w-full max-w-md bg-gray-900 border border-gray-800 p-6 sm:p-8 rounded-2xl shadow-xl text-center space-y-6">
                    <div className="w-12 h-12 mx-auto rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                        <ShieldAlert className="w-6 h-6" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                            Registrasi Terbatas
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                            Registrasi pengguna dilakukan oleh admin saja. Silakan masuk menggunakan akun yang telah diberikan.
                        </p>
                    </div>
                    <div className="pt-2">
                        <Link href={route('login')} className="inline-block w-full">
                            <button type="button" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl py-2.5 px-4 flex items-center justify-center gap-2 transition duration-200 text-xs sm:text-sm active:scale-95 shadow-lg shadow-blue-600/25">
                                Login
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}