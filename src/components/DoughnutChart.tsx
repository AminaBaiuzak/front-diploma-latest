// components/DoughnutChart.js
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useRef } from 'react';
import { GoStarFill } from "react-icons/go";


ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = ({ rating }) => {
    const chartRef = useRef(null);
    const value = rating * 20

    const data = {
        labels: ['Rating', 'Remaining'],
        datasets: [
            {
                data: value === 0 ? [0, 100] : [value, 100 - value],
                backgroundColor: ['#8CD6AE', '#E5E5E5'],
                hoverBackgroundColor: ['#E5E5E5', '#E5E5E5'],
                borderWidth: 0,
            },
        ],
    };

    const options = {
        cutout: '70%',
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: function (tooltipItem) {
                        const dataset = tooltipItem.dataset;
                        const index = tooltipItem.dataIndex;
                        const value = dataset.data[index];
                        return `${dataset.labels[index]}: ${value}%`;
                    },
                },
            },
        },
        onClick: (event) => {
            const elements = chartRef.current.getElementsAtEventForMode(event, 'nearest', { intersect: true }, false);
            if (elements.length) {
                const firstElement = elements[0];
                const label = data.labels[firstElement.index];
                const value = data.datasets[firstElement.datasetIndex].data[firstElement.index];
                alert(`${label}: ${value}%`);
            }
        },
    };

    return (
        <div className="bg-white px-10 py-5 rounded-[30px] shadow-md w-[400px]">
            <div className="text-center">
                <div className="flex flex-col items-center justify-center">
                    <h2 className="text-xl font-bold flex items-center justify-center">
                        Customer satisfaction <GoStarFill size={24} color="#FFC350CC" className="ml-2" />
                    </h2>
                    <p className="text-gray-600 mb-10">Shop representatives that buy products</p>
                </div>
            </div>
            <div className="relative">
                <Doughnut ref={chartRef} data={data} options={options} className={'w-[300px]'} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    {value === 0 ? (
                        <span className="text-[20px] text-gray-600">You have not received reviews yet</span>
                    ) : (
                        <>
                            <span className="text-[45px] font-semibold border-b">
                                {rating.toFixed(2)}
                                <span className="text-[45px] font-semibold text-[#7D7C7C]">/</span>
                                5
                            </span>
                            <span className="text-[20px] text-gray-600">Average rate</span>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DoughnutChart;
