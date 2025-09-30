import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        clearErrors();
        reset();
    };

    return (
        <section className={`space-y-6 ${className} max-w-3xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md`}>
            <header className="mb-4">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                    Hapus Akun
                </h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Setelah akun Anda dihapus, semua data dan sumber daya akan hilang secara permanen. Pastikan untuk mengunduh data penting sebelum melanjutkan.
                </p>
            </header>

            <DangerButton onClick={confirmUserDeletion} className="px-6 py-2">
                Hapus Akun
            </DangerButton>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-6 space-y-4">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        Apakah Anda yakin ingin menghapus akun ini?
                    </h2>

                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Penghapusan akun akan menghapus semua data secara permanen. Masukkan kata sandi Anda untuk mengonfirmasi penghapusan.
                    </p>

                    <div className="mt-4">
                        <InputLabel
                            htmlFor="password"
                            value="Kata Sandi"
                            className="sr-only"
                        />

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-red-500 focus:border-red-500"
                            isFocused
                            placeholder="Kata Sandi"
                        />

                        <InputError message={errors.password} className="mt-1 text-sm text-red-500" />
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={closeModal} className="px-4 py-2">
                            Batal
                        </SecondaryButton>

                        <DangerButton className="px-4 py-2" disabled={processing}>
                            Hapus Akun
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
