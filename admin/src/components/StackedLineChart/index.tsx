import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register required components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const StackedLineChart: React.FC = () => {
  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [

      {
        label: 'My Second dataset',
        data: [28, 48, 40, 19, 86, 27, 90],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        fill: true,
      },
      {
        label: 'My Third dataset',
        data: [18, 48, 77, 9, 100, 27, 40],
        backgroundColor: '#7B61FF',
        borderColor: '#7B61FF',
        fill: true,
      },
      {
        label: 'My Fourth dataset',
        data: [40, 20, 30, 40, 30, 90, 100],
        backgroundColor: 'rgba(255, 206, 86, 0.5)',
        borderColor: 'rgba(255, 206, 86, 1)',
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
        text: 'Chart.js Line Chart - stacked=true',
      },
    },
    scales: {
      y: {
        stacked: true,
        beginAtZero: true,
      },
      x: {
        stacked: true,
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default StackedLineChart;
