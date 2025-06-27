"use client"; // ✅ REQUIRED to use hooks like useEffect, localStorage

import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import PageTitle from "@/components/shared/PageTitle";
import SalesOverview from "./_components/SalesOverview";
import StatusOverview from "./_components/StatusOverview";
import DashboardCharts from "./_components/dashboard-charts";
import RecentOrders from "@/app/(dashboard)/orders/_components/orders-table";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true); // ✅ loader until login check
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      router.push("/login"); // ✅ if not logged in, redirect
    } else {
      setLoading(false); // ✅ allow render
    }
  }, [router]);

  if (loading) {
    return <div className="text-center mt-20 text-lg">Loading...</div>;
  }

  return (
    <Fragment>
      <section>
        <PageTitle>Dashboard Overview</PageTitle>

        <div className="space-y-8 mb-8">
          <SalesOverview />
          <StatusOverview />
          <DashboardCharts />
        </div>
      </section>

      <section>
        <PageTitle component="h2">Recent Orders</PageTitle>
        <RecentOrders />
      </section>
    </Fragment>
  );
}
