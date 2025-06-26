"use client";

import React, { useState, useEffect } from 'react';
import { Pie, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const BestSellers = () => {
  const [mounted, setMounted] = useState(false);
  const [chartType, setChartType] = useState('doughnut');
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const productData = [
    { name: "Green Leaf Lettuce", orders: 270, color: "rgb(34, 197, 94)", emoji: "🥬" },
    { name: "Rainbow Chard", orders: 238, color: "rgb(59, 130, 246)", emoji: "🌈" },
    { name: "Clementine", orders: 203, color: "rgb(249, 115, 22)", emoji: "🍊" },
    { name: "Mint", orders: 153, color: "rgb(99, 102, 241)", emoji: "🌿" },
  ];

  const totalOrders = productData.reduce((sum, item) => sum + item.orders, 0);

  const chartData = {
    labels: productData.map(item => item.name),
    datasets: [
      {
        label: "Orders",
        data: productData.map(item => item.orders),
        backgroundColor: productData.map(item => item.color),
        borderColor: "#ffffff",
        borderWidth: 3,
        hoverBorderWidth: 4,
        hoverBackgroundColor: productData.map(item => item.color),
        hoverBorderColor: "#ffffff",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
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
        cornerRadius: 12,
        padding: 16,
        displayColors: false,
        callbacks: {
          label: (context) => {
            const percentage = ((context.parsed / totalOrders) * 100).toFixed(1);
            return `${context.label}: ${context.parsed} orders (${percentage}%)`;
          },
        },
      },
    },
    cutout: chartType === 'doughnut' ? '60%' : '0%',
    animation: {
      animateScale: true,
      animateRotate: true,
      duration: 1000,
    },
  };

  const Skeleton = () => (
    <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded-full bg-[length:200%_100%]"></div>
  );

  const ChartComponent = chartType === 'doughnut' ? Doughnut : Pie;

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="p-6 pb-4 bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">🏆</span>
              </div>
              Best Selling Products
            </h3>
            
            {/* Chart Type Toggle */}
            <div className="flex bg-white rounded-lg p-1 shadow-inner">
              <button
                onClick={() => setChartType('doughnut')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                  chartType === 'doughnut'
                    ? 'bg-purple-500 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Doughnut
              </button>
              <button
                onClick={() => setChartType('pie')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                  chartType === 'pie'
                    ? 'bg-purple-500 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Pie
              </button>
            </div>
          </div>
        </div>

        {/* Chart and Legend Container */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-8">
            {/* Chart */}
            <div className="relative h-64 lg:h-72">
              {mounted ? (
                <>
                  <ChartComponent data={chartData} options={chartOptions} />
                  {chartType === 'doughnut' && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">{totalOrders}</div>
                        <div className="text-sm text-gray-600">Total Orders</div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <Skeleton />
              )}
            </div>

            {/* Legend & Stats */}
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Product Rankings</h4>
              {productData.map((product, index) => {
                const percentage = ((product.orders / totalOrders) * 100).toFixed(1);
                return (
                  <div key={product.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: product.color }}></div>
                        <span className="text-lg">{product.emoji}</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 text-sm">{product.name}</div>
                        <div className="text-xs text-gray-600">Rank #{index + 1}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900 text-sm">{product.orders}</div>
                      <div className="text-xs text-gray-600">{percentage}%</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 font-medium mb-1">Top Product</p>
                  <p className="text-sm font-bold text-green-600">{productData[0].name}</p>
                  <p className="text-xs text-green-500">{productData[0].orders} orders</p>
                </div>
                <div className="text-2xl">{productData[0].emoji}</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 font-medium mb-1">Total Orders</p>
                  <p className="text-sm font-bold text-blue-600">{totalOrders}</p>
                  <p className="text-xs text-blue-500">All products</p>
                </div>
                <div className="text-2xl">📊</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 rounded-lg border border-orange-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 font-medium mb-1">Market Share</p>
                  <p className="text-sm font-bold text-orange-600">
                    {((productData[0].orders / totalOrders) * 100).toFixed(1)}%
                  </p>
                  <p className="text-xs text-orange-500">Top product</p>
                </div>
                <div className="text-2xl">🎯</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 font-medium mb-1">Avg Orders</p>
                  <p className="text-sm font-bold text-purple-600">
                    {Math.round(totalOrders / productData.length)}
                  </p>
                  <p className="text-xs text-purple-500">Per product</p>
                </div>
                <div className="text-2xl">📈</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BestSellers;