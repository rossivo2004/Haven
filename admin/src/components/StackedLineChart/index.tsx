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

// Define a type for the data items
type DataItem = {
  month: string;
  successful: number;
  cancelled: number;
  total: number;
};

const StackedLineChart: React.FC<{ dataO: DataItem[] }> = ({ dataO }) => {

  const data = {
    labels: dataO.map((item: DataItem) => item.month),
    datasets: [
      {
        label: 'Thành công',
        data: dataO.map(item => item.successful),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        fill: true,
      },
      {
        label: 'Đã hủy',
        data: dataO.map(item => item.cancelled),
        backgroundColor: 'rgba(123, 97, 255, 0.5)',
        borderColor: '#7B61FF',
        fill: true,
      },
      {
        label: 'Tổng',
        data: dataO.map(item => item.total),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
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
        text: 'Biểu đồ đường - stacked=true',
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
