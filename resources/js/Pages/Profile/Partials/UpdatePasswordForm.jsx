import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { useRef } from 'react';

export default function UpdatePasswordForm({ className = '' }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    return (
        <section className={`${className} max-w-3xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md`}>
            <header className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                    Perbarui Kata Sandi
                </h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Pastikan akun Anda menggunakan kata sandi yang panjang dan aman.
                </p>
            </header>

            <form onSubmit={updatePassword} className="space-y-6">
                <div className="space-y-1">
                    <InputLabel htmlFor="current_password" value="Kata Sandi Saat Ini" />
                    <TextInput
                        id="current_password"
                        ref={currentPasswordInput}
                        value={data.current_password}
                        onChange={(e) => setData('current_password', e.target.value)}
                        type="password"
                        className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-indigo-500 focus:border-indigo-500"
                        autoComplete="current-password"
                    />
                    <InputError message={errors.current_password} className="mt-1 text-sm text-red-500" />
                </div>

                <div className="space-y-1">
                    <InputLabel htmlFor="password" value="Kata Sandi Baru" />
                    <TextInput
                        id="password"
                        ref={passwordInput}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        type="password"
                        className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-indigo-500 focus:border-indigo-500"
                        autoComplete="new-password"
                    />
                    <InputError message={errors.password} className="mt-1 text-sm text-red-500" />
                </div>

                <div className="space-y-1">
                    <InputLabel htmlFor="password_confirmation" value="Konfirmasi Kata Sandi" />
                    <TextInput
                        id="password_confirmation"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        type="password"
                        className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-indigo-500 focus:border-indigo-500"
                        autoComplete="new-password"
                    />
                    <InputError message={errors.password_confirmation} className="mt-1 text-sm text-red-500" />
                </div>

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing} className="px-6 py-2">
                        Simpan
                    </PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-out duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                    >
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Tersimpan.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
