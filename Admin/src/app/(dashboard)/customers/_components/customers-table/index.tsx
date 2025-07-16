"use client";

import { columns, skeletonColumns } from "./columns";
import CustomersTable from "./Table";
import TableSkeleton from "@/components/shared/TableSkeleton";
import TableError from "@/components/shared/TableError";
import { useCustomers } from "@/hooks/useCustomers";

type Props = {
  perPage?: number;
  search?: string;
};

export default function AllCustomers({ perPage = 10, search = "" }: Props) {
  const { data: customers, isLoading, error, refetch } = useCustomers();
  
  if (isLoading) return <TableSkeleton perPage={perPage} columns={skeletonColumns} />;
  if (error) return <TableError errorMessage="Failed to load customers" refetch={refetch} />;

  // Handle the case where customers might be undefined or have a different structure
  let customersData = customers?.data || [];
  const pagination = customers?.pagination || { current: 1, pages: 1, total: 0 };

  // Client-side filtering if search is provided
  if (search.trim()) {
    const lower = search.trim().toLowerCase();
    customersData = customersData.filter((c: any) =>
      c.name?.toLowerCase().includes(lower) ||
      c.email?.toLowerCase().includes(lower) ||
      c.phone?.toLowerCase().includes(lower)
    );
  }

  return (
    <CustomersTable
      columns={columns}
      data={customersData}
      pagination={pagination}
    />
  );
}
