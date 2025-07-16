"use client";

import { useEffect, useState } from "react"; // ✅ Add-on
import axios from "axios"; // ✅ Add-on

import {
  HiOutlineShoppingCart,
  HiOutlineRefresh,
  HiOutlineCheck,
} from "react-icons/hi";
import { BsTruck } from "react-icons/bs";

import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import Typography from "@/components/ui/typography";

type StatusData = {
  totalOrders: number;
  ordersPending: number;
  ordersProcessing: number;
  ordersDelivered: number;
}; // ✅ Add-on: API response type

export default function StatusOverview() {
  const [data, setData] = useState<StatusData | null>(null);
  const [pendingCount, setPendingCount] = useState<number | null>(null);
  const [processingCount, setProcessingCount] = useState<number | null>(null);
  const [deliveredCount, setDeliveredCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStatusData = async () => {
      try {
        // Fetch total orders and delivered from dashboard
        const dashboardRes = await axios.get("http://localhost:5000/api/order/dashboard");
        setData(dashboardRes.data);

        // Fetch pending orders count
        const pendingRes = await axios.get("http://localhost:5000/api/order/pending");
        setPendingCount(Array.isArray(pendingRes.data) ? pendingRes.data.length : 0);

        // Fetch processing orders count
        const processingRes = await axios.get("http://localhost:5000/api/order/processing");
        setProcessingCount(Array.isArray(processingRes.data) ? processingRes.data.length : 0);

        // Fetch delivered orders count
        const deliveredRes = await axios.get("http://localhost:5000/api/order/delivered");
        setDeliveredCount(Array.isArray(deliveredRes.data) ? deliveredRes.data.length : 0);

        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load status data.");
        setLoading(false);
      }
    };

    fetchStatusData();
  }, []);

  const cards = [
    {
      icon: <HiOutlineShoppingCart />,
      title: "Total Orders",
      value: data?.totalOrders ?? "--",
      className:
        "text-orange-600 dark:text-orange-100 bg-orange-100 dark:bg-orange-500",
    },
    {
      icon: <HiOutlineRefresh />,
      title: "Orders Pending",
      value: pendingCount !== null ? pendingCount : "--",
      className:
        "text-teal-600 dark:text-teal-100 bg-teal-100 dark:bg-teal-500",
    },
    {
      icon: <BsTruck />,
      title: "Orders Processing",
      value: processingCount !== null ? processingCount : "--",
      className:
        "text-blue-600 dark:text-blue-100 bg-blue-100 dark:bg-blue-500",
    },
    {
      icon: <HiOutlineCheck />,
      title: "Orders Delivered",
      value: deliveredCount !== null ? deliveredCount : "--",
      className:
        "text-emerald-600 dark:text-emerald-100 bg-emerald-100 dark:bg-emerald-500",
    },
  ];

  if (loading) {
    return <div className="text-center mt-4">Loading Status Data...</div>; // ✅ Add-on
  }

  if (error) {
    return <div className="text-red-500 text-center mt-4">{error}</div>; // ✅ Add-on
  }

  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card) => (
        <Card key={card.title} className="shadow-lg transition-transform duration-200 hover:scale-105 hover:shadow-2xl bg-gradient-to-br from-gray-100 via-gray-50 to-white dark:from-gray-800 dark:via-gray-700 dark:to-gray-900 animate-fadeIn">
          <CardContent className="flex items-center gap-4 p-4">
            <div
              className={cn(
                "size-14 rounded-full grid place-items-center [&>svg]:size-6 opacity-90 bg-white/80 dark:bg-gray-900/80 shadow-md",
                card.className
              )}
            >
              {card.icon}
            </div>
            <div className="flex flex-col gap-y-1">
              <Typography className="text-sm text-muted-foreground font-medium opacity-80">
                {card.title}
              </Typography>
              <Typography className="text-3xl font-bold text-popover-foreground drop-shadow">
                {card.value}
              </Typography>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
