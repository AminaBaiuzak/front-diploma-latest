import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarController, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useQuery } from "@tanstack/react-query";
import { getStatistics } from "@/services/orders";
import Loader from "react-spinners/PuffLoader";
import {usePathname} from "next/navigation";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarController,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const BarChart = ({ data, role }) => {

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
            },
            title: {
                display: true,
                text: 'Overview',
                align: 'start',
                font: {
                    size: 25,
                },
                color: '#000000',
                padding: {
                    top: 10,
                    bottom: 10,
                    left: 10,
                },
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    display: true,
                    color: '#000',
                },
                border: {
                    display: false,
                },
            },
            y: {
                beginAtZero: true,
                grid: {
                    display: false,
                },
                ticks: {
                    display: false,
                },
            },
        },
        hover: {
            mode: 'index',
            intersect: false,
            onHover: (event, chartElement) => {
                event.native.target.style.cursor = chartElement[0] ? 'pointer' : 'default';
            },
        },
        animation: {
            duration: 50,
            easing: 'easeInOutQuad',
        },
        elements: {
            bar: {
                hoverBackgroundColor: '#438DB8',
            },
        },
    };

    return (
        <div className={'shadow-md'} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '30px' }}>
            <Bar data={data} options={options} style={{ width: '900px' }} />
        </div>
    );
};

const Dashboard = () => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['statistics_store'],
        queryFn: () => {
            const token = localStorage.getItem('duken');
            if (!token) {
                throw new Error('No token found');
            }
            return getStatistics(JSON.parse(token).token);
        },
    });

    const [chartData, setChartData] = useState(null);
    const pathname = usePathname();
    const role = pathname.startsWith("/distributor") ? "distributor" : "store";

    useEffect(() => {
        if (data) {
            const monthlyData = {};
            data.orders.forEach((order) => {
                const key = role === 'store' ? 'store_' + order.store_id : 'distributor_' + order.distributor_id;
                if (!monthlyData[key]) {
                    monthlyData[key] = {};
                }
                const month = new Date(order.timestamp).getMonth(); // Month is zero-based
                if (!monthlyData[key][month]) {
                    monthlyData[key][month] = 0;
                }
                monthlyData[key][month] += role === 'store' ? -order.total_price : order.total_price;
            });

            const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const datasets = Object.keys(monthlyData).map((key) => {
                const isStore = key.startsWith('store');
                const backgroundColor = '#C4E4FF';
                const data = labels.map((_, index) => monthlyData[key][index] || 0);
                return {
                    label: `${isStore ? 'Monthly Spending' : 'Monthly Earnings'}`,
                    data,
                    backgroundColor,
                    borderRadius: 10,
                };
            });

            setChartData({
                labels,
                datasets,
            });
        }
    }, [data, role]);

    if (isLoading) return <Loader color={"#9bb8c9"} loading={true} size={50} className="m-auto mt-7" />;
    if (isError) return null;

    return chartData ? <BarChart data={chartData} role={role} /> : null;
};

export default Dashboard;
