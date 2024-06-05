import React, { useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarController, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarController,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sepr', 'Oct', 'Nov', 'Dec'],
    datasets: [{
        label: 'Monthly earning',
        data: [1100, 200, 300, 1400, 500, 600, 700, 1000, 900, 1000, 1100, 1200],
        backgroundColor: '#d1e4ef',
        borderRadius: 5
    }]
};

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
            }
        },
    },
    scales: {
        x: {
            grid: {
                display: false, // Hide x-axis grid lines
            },
            ticks: {
                display: true, // Show x-axis labels
                color: '#000' // Ensure x-axis labels are visible
            },
            border: {
                display: false // Hide x-axis line
            }
        },
        y: {
            beginAtZero: true, // Ensure y-axis starts at zero
            grid: {
                display: false, // Show y-axis grid lines
            },
            ticks: {
                display: false // Show y-axis labels
            }
        },
    },
    hover: {
        mode: 'index',
        intersect: false,
        onHover: (event, chartElement) => {
            event.native.target.style.cursor = chartElement[0] ? 'pointer' : 'default';
        }
    },
    animation: {
        duration: 50,
        easing: 'easeInOutQuad'
    },
    elements: {
        bar: {
            hoverBackgroundColor: '#438DB8',
        }
    }
};

const BarChart = () => {
    return (
        <div className={'shadow-md'} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '30px'}}>
            <Bar data={data} options={options} style={{width: '900px'}}/>
        </div>
    );
};

export default BarChart;
