"use client";

import { useSearchParams } from "next/navigation";
import { columns, skeletonColumns } from "./columns";
import OrdersTable from "./Table";
import TableSkeleton from "@/components/shared/TableSkeleton";
import TableError from "@/components/shared/TableError";
import { useOrders } from "@/hooks/useOrders";

type Props = {
  perPage?: number;
  filters?: any;
};

export default function AllOrders({ perPage = 10, filters = {} }: Props) {
  const ordersPage = useSearchParams().get("page");
  const page = filters.page || Math.trunc(Number(ordersPage)) || 1;
  const params = { ...filters, page, perPage };
  const { data: orders, isLoading, error, refetch } = useOrders(params);

  if (isLoading) return <TableSkeleton perPage={perPage} columns={skeletonColumns} />;
  if (error) return <TableError errorMessage="Failed to load orders" refetch={refetch} />;

  // Map backend data to table structure with improved error handling
  const ordersData = (orders?.data || []).map((order: any) => ({
    id: order._id || order.id || "",
    invoiceNo: order._id?.slice(-6) || order.invoiceNo || "-",
    orderTime: order.createdAt || order.orderTime,
    createdAt: order.createdAt || order.orderTime,
    customerName: order.user?.firstname
      ? `${order.user.firstname} ${order.user.lastname || ""}`.trim()
      : order.user?.email || order.customerName || "N/A",
    method: order.paymentInfo?.method || order.method || "N/A",
    amount: order.totalPriceAfterDiscount || order.totalPrice || order.amount || 0,
    status: order.orderStatus || "N/A", // Only use orderStatus
  }));

  const pagination = {
    current: page,
    pages: orders?.pages || 1,
    total: orders?.total || ordersData.length,
  };

  // Show empty state if no orders
  if (ordersData.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500 dark:text-gray-400">
          <p className="text-lg font-medium">No orders found</p>
          <p className="text-sm mt-2">There are no orders matching your criteria</p>
        </div>
      </div>
    );
  }

  return (
    <OrdersTable
      columns={columns}
      data={ordersData}
      pagination={pagination}
    />
  );
}
