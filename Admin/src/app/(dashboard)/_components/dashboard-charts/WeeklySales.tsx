"use client";

import React, { useState, useEffect } from 'react';
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const WeeklySales = () => {
  const [activeTab, setActiveTab] = useState('sales');
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Generate past 7 days
  const getPastDates = (days) => {
    const dates = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
    }
    return dates;
  };

  const labels = getPastDates(7);
  const salesData = [400, 300, 100, 250, 200, 300, 1000];
  const ordersData = [3, 3, 1, 4, 1, 1, 2];
  
  const gridColor = 'rgba(229, 231, 235, 0.5)';
  const textColor = '#6b7280';

  const salesChartData = {
    labels,
    datasets: [
      {
        label: "Sales",
        data: salesData,
        borderColor: "rgb(16, 185, 129)",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        borderWidth: 3,
        pointBackgroundColor: "rgb(16, 185, 129)",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const ordersChartData = {
    labels,
    datasets: [
      {
        label: "Orders",
        data: ordersData,
        borderColor: "rgb(249, 115, 22)",
        backgroundColor: "rgba(249, 115, 22, 0.1)",
        borderWidth: 3,
        pointBackgroundColor: "rgb(249, 115, 22)",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index',
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1f2937',
        bodyColor: '#1f2937',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: (context) => {
            if (activeTab === 'sales') {
              return `Sales: $${context.parsed.y}`;
            } else {
              return `Orders: ${context.parsed.y}`;
            }
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
        ticks: {
          color: textColor,
          padding: 10,
          font: {
            size: 12,
            weight: '500',
          },
        },
      },
      y: {
        grid: {
          color: gridColor,
          drawBorder: false,
        },
        border: {
          display: false,
        },
        ticks: {
          color: textColor,
          padding: 15,
          font: {
            size: 12,
          },
          callback: function (value) {
            if (activeTab === 'sales') {
              return '$' + value;
            }
            return value;
          },
        },
        ...(activeTab === 'orders' && {
          min: 0,
          max: Math.max(...ordersData) + 1,
          ticks: {
            ...this?.scales?.y?.ticks,
            stepSize: 1,
          },
        }),
      },
    },
  };

  const Skeleton = () => (
    <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded-lg bg-[length:200%_100%] animate-[shimmer_2s_infinite]"></div>
  );

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden h-[600px] flex flex-col">
        {/* Header */}
        <div className="p-6 pb-4 bg-gradient-to-r from-blue-50 to-indigo-50 flex-shrink-0">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">📊</span>
            </div>
            Weekly Sales Analytics
          </h3>
          
          {/* Custom Tabs */}
          <div className="flex space-x-1 bg-white p-1 rounded-xl shadow-inner">
            <button
              onClick={() => setActiveTab('sales')}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                activeTab === 'sales'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg transform translate-y-[-2px]'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <span className="text-lg">💰</span>
              Sales Revenue
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                activeTab === 'orders'
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg transform translate-y-[-2px]'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <span className="text-lg">📦</span>
              Orders Count
            </button>
          </div>
        </div>

        {/* Chart Content */}
        <div className="p-6 flex-1 flex flex-col">
          <div className="h-64 w-full relative flex-shrink-0">
            {mounted ? (
              <Line
                data={activeTab === 'sales' ? salesChartData : ordersChartData}
                options={chartOptions}
              />
            ) : (
              <Skeleton />
            )}
          </div>
          
          {/* Stats Summary */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 flex-shrink-0">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Total Sales</p>
                  <p className="text-xl font-bold text-green-600">
                    ${salesData.reduce((sum, val) => sum + val, 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-green-500 mt-1">This week</p>
                </div>
                <div className="text-2xl opacity-80">💰</div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 rounded-xl border border-orange-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Total Orders</p>
                  <p className="text-xl font-bold text-orange-600">
                    {ordersData.reduce((sum, val) => sum + val, 0)}
                  </p>
                  <p className="text-xs text-orange-500 mt-1">This week</p>
                </div>
                <div className="text-2xl opacity-80">📦</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Avg Order Value</p>
                  <p className="text-xl font-bold text-blue-600">
                    ${Math.round(salesData.reduce((sum, val) => sum + val, 0) / ordersData.reduce((sum, val) => sum + val, 0))}
                  </p>
                  <p className="text-xs text-blue-500 mt-1">Per order</p>
                </div>
                <div className="text-2xl opacity-80">📈</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
};

export default WeeklySales;