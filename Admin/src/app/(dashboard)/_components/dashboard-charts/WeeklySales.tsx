"use client";

import { Line } from "react-chartjs-2";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import axios from "axios";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Typography from "@/components/ui/typography";
import useGetMountStatus from "@/hooks/useGetMountStatus";

export default function MonthlySales() {
  const { theme } = useTheme();
  const mounted = useGetMountStatus();

  const [labels, setLabels] = useState<string[]>([]);
  const [sales, setSales] = useState<number[]>([]);
  const [orders, setOrders] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  const gridColor = `rgba(161, 161, 170, ${theme === "light" ? "0.5" : "0.3"})`;

  // ✅ [CHANGED] Monthly sales data fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/order/monthly-summary"); // ✅ [CHANGED]
        setLabels(res.data.labels);  // Should be: ["Jan", "Feb", ..., "Dec"]
        setSales(res.data.sales);
        setOrders(res.data.orders);
      } catch (err) {
        console.error("Error fetching monthly data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

//   useEffect(() => {
//   const dummy = {
//     labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
//     sales: [1000, 1200, 1100, 1300, 1250, 1500, 1700, 1600, 1400, 1800, 2000, 2100],
//     orders: [10, 12, 14, 16, 15, 20, 18, 22, 19, 25, 28, 30]
//   };

//   setLabels(dummy.labels);
//   setSales(dummy.sales);
//   setOrders(dummy.orders);
//   setLoading(false);
// }, []);


  return (
    <Card>
      <Typography variant="h3" className="mb-4">
        Monthly Sales {/* ✅ [CHANGED] Title */}
      </Typography>

      <CardContent className="pb-2">
        <Tabs defaultValue="sales">
          <TabsList className="mb-6">
            <TabsTrigger value="sales" className="data-[state=active]:text-primary">
              Sales
            </TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:text-orange-500">
              Orders
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sales" className="relative h-60">
            {mounted && !loading ? (
              <Line
                data={{
                  labels,
                  datasets: [
                    {
                      label: "Sales",
                      data: sales,
                      borderColor: "rgb(34, 197, 94)",
                      backgroundColor: "rgb(34, 197, 94)",
                    },
                  ],
                }}
                options={{
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      grid: { color: gridColor },
                      border: { color: gridColor },
                      ticks: {
                        stepSize: 1000, // 📌 Adjust based on your monthly sales range
                        callback: (value) => "$" + value,
                        padding: 4,
                      },
                    },
                    x: {
                      grid: { display: false },
                    },
                  },
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      callbacks: {
                        label: (context) =>
                          `${context.dataset.label}: $${context.parsed.y}`,
                      },
                    },
                  },
                }}
              />
            ) : (
              <Skeleton className="size-full" />
            )}
          </TabsContent>

          <TabsContent value="orders" className="relative h-60">
            {mounted && !loading ? (
              <Line
                data={{
                  labels,
                  datasets: [
                    {
                      label: "Orders",
                      data: orders,
                      borderColor: "rgb(249, 115, 22)",
                      backgroundColor: "rgb(249, 115, 22)",
                    },
                  ],
                }}
                options={{
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      grid: { color: gridColor },
                      border: { color: gridColor },
                      ticks: {
                        stepSize: 5, // Adjust based on expected monthly orders
                        padding: 4,
                      },
                      min: 0,
                    },
                    x: {
                      grid: { display: false },
                    },
                  },
                  plugins: {
                    legend: { display: false },
                  },
                }}
              />
            ) : (
              <Skeleton className="size-full" />
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
