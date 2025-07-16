"use client";

import { useSearchParams } from "next/navigation";
import { getCouponColumns, skeletonColumns } from "./columns";
import CouponsTable from "./Table";
import TableSkeleton from "@/components/shared/TableSkeleton";
import TableError from "@/components/shared/TableError";
// TODO: Replaced mock data with real API call using useCoupons
import { useCoupons } from "@/hooks/useCoupons";
import { useQueryClient } from "@tanstack/react-query";
import { useUpdateCoupon } from "@/hooks/useCoupons";

type Props = {
  perPage?: number;
};

export default function AllCoupons({ perPage = 10 }: Props) {
  const couponsPage = useSearchParams().get("page");
  const page = Math.trunc(Number(couponsPage)) || 1;

  const { data: coupons, isLoading, error, refetch } = useCoupons();
  const queryClient = useQueryClient();
  const updateCouponMutation = useUpdateCoupon();

  if (isLoading) return <TableSkeleton perPage={perPage} columns={skeletonColumns} />;
  if (error) return <TableError errorMessage="Failed to load coupons" refetch={refetch} />;

  // Handle the case where coupons might be undefined or have a different structure
  const couponsData = Array.isArray(coupons) ? coupons : coupons?.data || [];
  const pagination = coupons?.pagination || { current: 1, pages: 1, total: 0 };

  const columns = getCouponColumns(queryClient, updateCouponMutation) || [];
  const data = Array.isArray(couponsData) ? couponsData : [];

  return (
    <CouponsTable
      columns={columns}
      data={data}
      pagination={pagination}
    />
  );
}
