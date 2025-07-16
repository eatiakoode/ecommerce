"use client";

import { Pie } from "react-chartjs-2";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react"; // ✅ [ADD-ON] for API call
import axios from "axios"; // ✅ [ADD-ON] for HTTP request

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Typography from "@/components/ui/typography";
import useGetMountStatus from "@/hooks/useGetMountStatus";

export default function BestSellers() {
  const mounted = useGetMountStatus();
  const { theme } = useTheme();

  // ✅ [ADD-ON] Local state to store dynamic labels and data
  const [labels, setLabels] = useState<string[]>([]);
  const [data, setData] = useState<number[]>([]);
  const [loading, setLoading] = useState(true); // ✅ Optional: show Skeleton while loading

  // ✅ [ADD-ON] Fetch best selling products from backend
  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/dashboard");
        setLabels(res.data.labels);
        setData(res.data.data);
      } catch (error) {
        console.error("Failed to fetch best sellers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBestSellers();
  }, []);

  //  useEffect(() => {
  //   // ✅ Dummy data test (no API call)
  //   const dummy = {
  //     labels: ["Green Leaf Lettuce", "Rainbow Chard", "Clementine", "Mint"],
  //     data: [270, 238, 203, 153],
  //   };

  //   setLabels(dummy.labels);
  //   setData(dummy.data);
  //   setLoading(false);
  // }, []);


  return (
    <Card>
      <Typography variant="h3" className="mb-4">
        Best Selling Products
      </Typography>

      <CardContent className="pb-2">
        <div className="relative h-[18.625rem]">
          {mounted && !loading ? (
            <Pie
              data={{
                labels, // ✅ from backend
                datasets: [
                  {
                    label: "Orders",
                    data, // ✅ from backend
                    backgroundColor: [
                      "rgb(34, 197, 94)",
                      "rgb(59, 130, 246)",
                      "rgb(249, 115, 22)",
                      "rgb(99, 102, 241)",
                    ],
                    borderColor:
                      theme === "light" ? "rgb(255,255,255)" : "rgb(23,23,23)",
                    borderWidth: 2,
                  },
                ],
              }}
              options={{
                maintainAspectRatio: false,
              }}
            />
          ) : (
            <Skeleton className="size-full" />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
