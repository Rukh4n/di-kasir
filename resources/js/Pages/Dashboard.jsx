import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Calendar, Filter } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Dashboard({ transactions, filters }) {
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });
    const [topProductsData, setTopProductsData] = useState({ labels: [], datasets: [] });
    const [startDate, setStartDate] = useState(filters?.start_date || '');
    const [endDate, setEndDate] = useState(filters?.end_date || '');
    const [groupByHour, setGroupByHour] = useState(false);

    useEffect(() => {
        let filteredTransactions = transactions;

        if (startDate || endDate) {
            filteredTransactions = transactions.filter(t => {
                const tDate = new Date(t.created_at);
                const start = startDate ? new Date(startDate) : null;
                const end = endDate ? new Date(endDate) : null;

                if (start && tDate < start) return false;
                if (end && tDate > new Date(end.getFullYear(), end.getMonth(), end.getDate(), 23, 59, 59)) return false;
                return true;
            });
        }

        if (groupByHour) {
            const hourMap = {};
            filteredTransactions.forEach(t => {
                const date = new Date(t.created_at);
                const dateKey = date.toLocaleDateString('id-ID');
                const hourKey = date.getHours().toString().padStart(2, '0') + ':00';
                const label = `${dateKey} ${hourKey}`;

                if (!hourMap[label]) {
                    hourMap[label] = { total: 0, dateObj: new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours()) };
                }
                hourMap[label].total += 1;
            });

            const sortedLabels = Object.keys(hourMap).sort((a, b) => {
                return hourMap[a].dateObj - hourMap[b].dateObj;
            });

            setChartData({
                labels: sortedLabels,
                datasets: [
                    {
                        label: 'Jumlah Transaksi',
                        data: sortedLabels.map(l => hourMap[l].total),
                        backgroundColor: 'rgba(59, 130, 246, 0.7)',
                        borderColor: 'rgba(59, 130, 246, 1)',
                        borderWidth: 1,
                    },
                ],
            });
        } else {
            const sortedTransactions = [...filteredTransactions].sort(
                (a, b) => new Date(a.created_at) - new Date(b.created_at)
            );

            const labels = sortedTransactions.map(t => {
                const date = new Date(t.created_at);
                return date.toLocaleString('id-ID', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                });
            });
            const data = sortedTransactions.map(t => parseFloat(t.total_price));

            setChartData({
                labels,
                datasets: [
                    {
                        label: 'Total Transaksi',
                        data,
                        backgroundColor: 'rgba(59, 130, 246, 0.7)',
                        borderColor: 'rgba(59, 130, 246, 1)',
                        borderWidth: 1,
                    },
                ],
            });
        }

        const productMap = {};
        filteredTransactions.forEach(t => {
            if (t.items) {
                t.items.forEach(item => {
                    productMap[item.name] = (productMap[item.name] || 0) + item.qty;
                });
            }
        });

        const sortedProducts = Object.entries(productMap)
            .map(([name, qty]) => ({ name, qty }))
            .sort((a, b) => b.qty - a.qty);

        setTopProductsData({
            labels: sortedProducts.map(p => p.name),
            datasets: [
                {
                    label: 'Jumlah Terjual',
                    data: sortedProducts.map(p => p.qty),
                    backgroundColor: 'rgba(236, 72, 153, 0.7)',
                    borderColor: 'rgba(236, 72, 153, 1)',
                    borderWidth: 1,
                },
            ],
        });
    }, [transactions, groupByHour, startDate, endDate]);

    const transactionOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: groupByHour ? 'Grafik Transaksi per Jam' : 'Grafik Transaksi' },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return groupByHour
                            ? `${context.raw} transaksi`
                            : `Rp ${context.raw.toLocaleString()}`;
                    }
                }
            }
        },
        scales: {
            x: { ticks: { autoSkip: false }, beginAtZero: true },
            y: { beginAtZero: true }
        },
    };

    const productOptions = {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Produk Terlaris' },
        },
        scales: { x: { beginAtZero: true }, y: { beginAtZero: true } },
    };

    const handleFilter = (e) => {
        e.preventDefault();
        router.get('/dashboard', { start_date: startDate, end_date: endDate }, { preserveState: true });
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-6 max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                <form onSubmit={handleFilter} className="flex items-center space-x-2 bg-white shadow-sm sm:rounded-lg dark:bg-gray-800 p-2 text-sm">
                    <div className="flex items-center justify-center w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full">
                        <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-200" />
                    </div>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="border rounded px-1 py-0.5 text-sm dark:bg-gray-700 dark:text-gray-200"
                    />
                    <span className="text-sm">-</span>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="border rounded px-1 py-0.5 text-sm dark:bg-gray-700 dark:text-gray-200"
                    />
                    <button type="submit" className="flex items-center bg-blue-600 text-white px-3 py-0.5 rounded hover:bg-blue-700 text-sm">
                        <div className="flex items-center justify-center w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded-full mr-1">
                            <Filter className="w-3 h-3 text-gray-700 dark:text-gray-200" />
                        </div>
                        Filter
                    </button>
                </form>

                <div className="flex items-center space-x-2 bg-white shadow-sm sm:rounded-lg dark:bg-gray-800 p-2 text-sm">
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={groupByHour}
                            onChange={(e) => setGroupByHour(e.target.checked)}
                        />
                        <span className="text-gray-700 dark:text-gray-200">Tampilkan per Jam</span>
                    </label>
                </div>

                <div className="bg-white shadow-sm sm:rounded-lg dark:bg-gray-800 p-6 overflow-x-auto">
                    <div
                        style={{
                            minWidth: `${chartData.labels.length * 120}px`,
                            height: '400px',
                        }}
                    >
                        <Bar data={chartData} options={transactionOptions} />
                    </div>
                </div>

                <div className="bg-white shadow-sm sm:rounded-lg dark:bg-gray-800 p-6 overflow-x-auto">
                    <div style={{ minWidth: '500px', height: '400px' }}>
                        <Bar data={topProductsData} options={productOptions} />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
