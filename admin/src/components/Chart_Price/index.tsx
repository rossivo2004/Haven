import React, { useEffect, useRef, useState } from 'react';
import { Chart, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend, BarController } from 'chart.js';
import axios from 'axios';
import apiConfig from '@/configs/api';

// Register the required Chart.js components
Chart.register(BarController, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

interface StaticDataItem {
  month_year: string;
  revenue: string;
}

const Chart_Price = () => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const [staticData, setStaticData] = useState<StaticDataItem[]>([]);
  const [monthsTK, setMonthsTK] = useState<string[]>([]);
  const [revenueTK, setRevenueTK] = useState<number[]>([]);
  const [chartInstance, setChartInstance] = useState<Chart | null>(null);

  useEffect(() => {
    const fetchStaticData = async () => {
      const response = await axios.get(apiConfig.static.getAll);
      const data = response.data.revenue;

      setStaticData(data);
      setMonthsTK(data.map((item: StaticDataItem) => item.month_year));
      setRevenueTK(data.map((item: StaticDataItem) => parseFloat(item.revenue)));
    };
    fetchStaticData();
  }, []);

  useEffect(() => {
    if (!chartRef.current || monthsTK.length === 0 || revenueTK.length === 0) return;

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    // Destroy the existing chart instance if it exists
    if (chartInstance) chartInstance.destroy();

    const newChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: monthsTK,
        datasets: [
          {
            label: 'Doanh thu',
            data: revenueTK,
            backgroundColor: '#696CFF',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false,
            position: 'top',
          },
          title: {
            display: false,
            text: 'Monthly Revenue',
          },
        },
        scales: {
          x: {
            beginAtZero: true,
          },
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    setChartInstance(newChartInstance);

    return () => {
      newChartInstance.destroy();
    };
  }, [monthsTK, revenueTK]); // Depend on monthsTK and revenueTK to re-render when data is available

  return <div className=''>
<div className='text-[18px] font-bold text-[#333333] mb-2'>Doanh thu theo tháng</div>
<canvas ref={chartRef} />
  </div>;
};

export default Chart_Price;
