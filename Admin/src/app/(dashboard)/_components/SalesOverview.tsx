"use client";

import { useEffect, useState } from "react"; // ✅ Add-on: State and lifecycle hook
import axios from "axios"; // ✅ Add-on: For API request

import { HiOutlineRefresh } from "react-icons/hi";
import { HiOutlineSquare3Stack3D, HiCalendarDays } from "react-icons/hi2";

import { cn } from "@/lib/utils";
import Typography from "@/components/ui/typography";

type SalesData = {
  todayOrders: number;
  yesterdayOrders: number;
  thisMonth: number;
  lastMonth: number;
  allTimeSales: number;
}; // ✅ Add-on: Define type for API response

export default function SalesOverview() {
  const [data, setData] = useState<SalesData | null>(null); // ✅ Add-on: State to store API data
  const [loading, setLoading] = useState(true); // ✅ Add-on: Loading indicator
  const [error, setError] = useState(""); // ✅ Add-on: Error message state

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/order/dashboard"); // ✅ Add-on: Fetch data from backend
        setData(res.data); // ✅ Add-on: Store in state
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load sales data."); // ✅ Add-on: Set error message
        setLoading(false);
      }
    };

    fetchSalesData(); // ✅ Add-on: Call function
  }, []);

  const cards = [
    {
      icon: <HiOutlineSquare3Stack3D />,
      title: "Today Orders",
      value: data?.todayOrders ?? "--", // ✅ Add-on: Dynamic value
      className: "bg-teal-600",
    },
    {
      icon: <HiOutlineSquare3Stack3D />,
      title: "Yesterday Orders",
      value: data?.yesterdayOrders ?? "--", // ✅
      className: "bg-orange-400",
    },
    {
      icon: <HiOutlineRefresh />,
      title: "This Month",
      value: data?.thisMonth ?? "--", // ✅
      className: "bg-blue-500",
    },
    {
      icon: <HiCalendarDays />,
      title: "Last Month",
      value: data?.lastMonth ?? "--", // ✅
      className: "bg-cyan-600",
    },
    {
      icon: <HiCalendarDays />,
      title: "All-Time Sales",
      value: data?.allTimeSales ?? "--", // ✅
      className: "bg-emerald-600",
    },
  ];

  if (loading) {
    return <div className="text-center mt-4">Loading Data...</div>; // ✅ Add-on: Show while loading
  }

  if (error) {
    return <div className="text-red-500 text-center mt-4">{error}</div>; // ✅ Add-on: Show on error
  }

  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-2">
      {cards.map((card, index) => (
        <div
          key={`sales-overview-${index}`}
          className={cn(
            "p-6 rounded-lg flex flex-col items-center justify-center space-y-3 text-white text-center",
            card.className
          )}
        >
          <div className="[&>svg]:size-8">{card.icon}</div>
          <Typography className="text-base">{card.title}</Typography>
          <Typography className="text-2xl font-semibold">
            ${card.value} {/* ✅ Add-on: Dynamically show value */}
          </Typography>
        </div>
      ))}
    </div>
  );
}
