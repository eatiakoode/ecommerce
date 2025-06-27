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
  const [data, setData] = useState<StatusData | null>(null); // ✅ Add-on
  const [loading, setLoading] = useState(true); // ✅ Add-on
  const [error, setError] = useState(""); // ✅ Add-on

useEffect(() => {
  const fetchStatusData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/order/dashboard"); // ✅ FIXED URL
      setData(res.data); // ✅
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
      value: data?.totalOrders ?? "--", // ✅ Dynamic
      className:
        "text-orange-600 dark:text-orange-100 bg-orange-100 dark:bg-orange-500",
    },
    {
      icon: <HiOutlineRefresh />,
      title: "Orders Pending",
      value: data?.ordersPending ?? "--", // ✅ Dynamic
      className:
        "text-teal-600 dark:text-teal-100 bg-teal-100 dark:bg-teal-500",
    },
    {
      icon: <BsTruck />,
      title: "Orders Processing",
      value: data?.ordersProcessing ?? "--", // ✅ Dynamic
      className:
        "text-blue-600 dark:text-blue-100 bg-blue-100 dark:bg-blue-500",
    },
    {
      icon: <HiOutlineCheck />,
      title: "Orders Delivered",
      value: data?.ordersDelivered ?? "--", // ✅ Dynamic
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
        <Card key={card.title}>
          <CardContent className="flex items-center gap-3 p-0">
            <div
              className={cn(
                "size-12 rounded-full grid place-items-center [&>svg]:size-5",
                card.className
              )}
            >
              {card.icon}
            </div>

            <div className="flex flex-col gap-y-1">
              <Typography className="text-sm text-muted-foreground">
                {card.title}
              </Typography>

              <Typography className="text-2xl font-semibold text-popover-foreground">
                {card.value} {/* ✅ Add-on: Show fetched value */}
              </Typography>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
