"use client";

import { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface ChartData {
  type: 'line' | 'bar' | 'doughnut' | 'pie';
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor?: string | string[];
      borderColor?: string | string[];
      borderWidth?: number;
    }[];
  };
  options?: any;
}

interface ChartDisplayProps {
  chartData: ChartData;
  title?: string;
  width?: string;
  height?: string;
}

export default function ChartDisplay({ chartData, title, width = "100%", height = "400px" }: ChartDisplayProps) {
  const chartRef = useRef<HTMLDivElement>(null);

  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            family: 'Vazirmatn, IRANSans, Tahoma, Arial, sans-serif',
          },
        },
      },
      title: {
        display: !!title,
        text: title,
        font: {
          family: 'Vazirmatn, IRANSans, Tahoma, Arial, sans-serif',
          size: 16,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          font: {
            family: 'Vazirmatn, IRANSans, Tahoma, Arial, sans-serif',
          },
        },
      },
      y: {
        ticks: {
          font: {
            family: 'Vazirmatn, IRANSans, Tahoma, Arial, sans-serif',
          },
        },
      },
    },
  };

  const renderChart = () => {
    const options = { ...defaultOptions, ...chartData.options };

    switch (chartData.type) {
      case 'line':
        return <Line data={chartData.data} options={options} />;
      case 'bar':
        return <Bar data={chartData.data} options={options} />;
      case 'doughnut':
        return <Doughnut data={chartData.data} options={options} />;
      case 'pie':
        return <Pie data={chartData.data} options={options} />;
      default:
        return <Line data={chartData.data} options={options} />;
    }
  };

  return (
    <div className="my-8">
      <div 
        ref={chartRef}
        style={{ width, height }}
        className="bg-white rounded-lg shadow-lg p-4"
      >
        {renderChart()}
      </div>
    </div>
  );
} 