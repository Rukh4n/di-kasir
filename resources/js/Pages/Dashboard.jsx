import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import AdminDashboard from '@/Components/Admin/AdminDashboard';
import CasierDashboard from '@/Components/Casier/CasierDashboard';

export default function Dashboard({
    isAdmin = false,
    stats = {},
    branchPerformances = [],
    lowStockProducts = [],
    recentTransactions = [],
    shiftInfo = {},
    localLowStock = [],
    filters = {},
    error = null,
}) {
    const { auth } = usePage().props;

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Dashboard
                </h2>
            }
        >
        <Head title="Dashboard">
            <meta name="description" content="Pantau Semua Kegiatan di tokomu dalam satu halaman ringkas ini.." />
        </Head>

            <div className="py-6 max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                {error && (
                    <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                        {error}
                    </div>
                )}

                {isAdmin ? (
                    <AdminDashboard
                        stats={stats}
                        branchPerformances={branchPerformances}
                        lowStockProducts={lowStockProducts}
                        recentTransactions={recentTransactions}
                        filters={filters}
                    />
                ) : (
                    <CasierDashboard 
                        stats={stats}
                        user={auth.user}
                        shiftInfo={shiftInfo}
                        recentTransactions={recentTransactions}
                        localLowStock={localLowStock}
                    />
                )}
            </div>
        </AuthenticatedLayout>
    );
}