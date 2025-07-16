"use client";

import { Pie } from "react-chartjs-2";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import axios from "axios";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Typography from "@/components/ui/typography";
import useGetMountStatus from "@/hooks/useGetMountStatus";

type BestSellerItem = {
  name: string;
  totalSold: number;
};

export default function BestSellers() {
  const mounted = useGetMountStatus();
  const { theme } = useTheme();

  const [bestSellers, setBestSellers] = useState<BestSellerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/api/order/best-sellers");
        
        if (res.data && Array.isArray(res.data)) {
          setBestSellers(res.data);
        } else {
          console.error("Invalid response format:", res.data);
          setError("Invalid data format received from server");
        }
      } catch (error) {
        console.error("Failed to fetch best sellers:", error);
        setError("Failed to load best sellers data");
      } finally {
        setLoading(false);
      }
    };

    fetchBestSellers();
  }, []);

  // Transform data for pie chart
  const chartData = {
    labels: bestSellers.map(item => item.name),
    datasets: [
      {
        label: "Units Sold",
        data: bestSellers.map(item => item.totalSold),
        backgroundColor: [
          "rgb(34, 197, 94)",   // Green
          "rgb(59, 130, 246)",  // Blue
          "rgb(249, 115, 22)",  // Orange
          "rgb(99, 102, 241)",  // Indigo
          "rgb(236, 72, 153)",  // Pink
          "rgb(168, 85, 247)",  // Purple
        ],
        borderColor:
          theme === "light" ? "rgb(255,255,255)" : "rgb(23,23,23)",
        borderWidth: 2,
      },
    ],
  };

  return (
    <Card className="shadow-lg transition-transform duration-200 hover:scale-105 hover:shadow-2xl bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-900 animate-fadeIn">
      <Typography variant="h3" className="mb-4 font-bold tracking-wide text-gray-800 dark:text-gray-100">
        Best Selling Products
      </Typography>
      <CardContent className="pb-2">
        <div className="relative h-[18.625rem] flex items-center justify-center">
          {mounted && !loading && !error ? (
            bestSellers.length > 0 ? (
              <Pie
                data={chartData}
                options={{
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      labels: {
                        color: theme === "light" ? "#222" : "#fff",
                        font: { size: 14, weight: "bold" },
                      },
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          const label = context.label || '';
                          const value = context.parsed;
                          return `${label}: ${value} units sold`;
                        }
                      }
                    }
                  },
                }}
              />
            ) : (
              <div className="text-center text-gray-500 dark:text-gray-400">
                <p>No best sellers data available</p>
                <p className="text-sm mt-2">No products have been sold yet</p>
              </div>
            )
          ) : loading ? (
            <Skeleton className="size-full" />
          ) : error ? (
            <div className="text-center text-red-500">
              <p>{error}</p>
              <p className="text-sm mt-2">Please try again later</p>
            </div>
          ) : (
            <Skeleton className="size-full" />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
