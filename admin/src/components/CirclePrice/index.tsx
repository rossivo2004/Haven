import React, { useEffect, useRef } from 'react';
import { Chart, ChartItem, Plugin, ArcElement, Tooltip, Legend, DoughnutController } from 'chart.js';

// Register the necessary components
Chart.register(ArcElement, Tooltip, Legend, DoughnutController);

interface HalfDoughnutChartProps {
    percentage: 
    {
        current_month_revenue: {
            month: string;
            revenue: string;
        },
        previous_month_revenue: {
            month: string;
            revenue: string;
        },
        percentage_change: number;
    }      // Phần trăm tăng trưởng
    canvasId?: string;         // ID của canvas (mặc định là 'growthChart')
}

const CreateHalfDoughnutChart: React.FC<HalfDoughnutChartProps> = ({
    percentage,
    canvasId = "growthChart"
}) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    console.log(percentage);

    useEffect(() => {
        if (!canvasRef.current) return;

        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;

        // Plugin để vẽ văn bản ở giữa biểu đồ
        const centerTextPlugin: Plugin = {
            id: 'centerText',
            beforeDraw(chart) {
                const { width, height, ctx } = chart;
                if (!ctx) return;

                ctx.save();
                ctx.restore();

                // Điều chỉnh kích thước phông chữ
                const fontSize = (height / 150).toFixed(2);
                ctx.font = `${fontSize}em sans-serif`;
                ctx.textBaseline = "middle";

                const text = `${percentage.percentage_change}%`;
                const textX = Math.round((width - ctx.measureText(text).width) / 2);
                const textY = height / 2 - 10;
                ctx.fillText(text, textX, textY);

                ctx.save();
            }
        };

        // Khởi tạo biểu đồ Chart.js
        const chartInstance = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Tháng Hiện Tại', 'Tháng Trước'], // Cập nhật nhãn cho rõ ràng
                datasets: [{
                    data: [percentage.percentage_change, 100 - percentage.percentage_change],
                    backgroundColor: ['#7B61FF', '#E0E7FF'],
                    borderWidth: 0
                }]
            },
            options: {
                plugins: {
                    tooltip: {
                        enabled: true, // Bật tooltip
                        callbacks: {
                            label: (tooltipItem) => {
                                const label = tooltipItem.label || '';
                                const value = tooltipItem.raw as number; // Ép kiểu thành số
                                const total = 100; // Giả sử tổng là 100 cho tính toán phần trăm
                                const percentage = (value / total) * 100; // Tính phần trăm
                                return `${label}: ${percentage.toFixed(2)}%`; // Hiển thị phần trăm trong tooltip
                            }
                        }
                    },
                    legend: { display: false }
                }
            },
            plugins: [centerTextPlugin]
        });

        // Hủy biểu đồ khi component unmount
        return () => {
            chartInstance.destroy();
        };
    }, [percentage]);

    return (
        <canvas id={canvasId} ref={canvasRef} width="200" height="200"></canvas>
    );
};

export default CreateHalfDoughnutChart;