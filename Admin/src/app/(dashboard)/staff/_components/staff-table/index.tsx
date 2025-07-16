"use client";

import { columns, skeletonColumns } from "./columns";
import StaffTable from "./Table";
import TableSkeleton from "@/components/shared/TableSkeleton";
import TableError from "@/components/shared/TableError";
import { useStaff } from "@/hooks/useStaff";

type Props = {
  perPage?: number;
  search?: string;
  role?: string;
};

export default function AllStaff({ perPage = 10, search = "", role = "" }: Props) {
  const { data: staff, isLoading, error, refetch } = useStaff();
  
  if (isLoading) return <TableSkeleton perPage={perPage} columns={skeletonColumns} />;
  if (error) return <TableError errorMessage="Failed to load staff" refetch={refetch} />;

  // Handle the case where staff might be undefined or have a different structure
  let staffData = Array.isArray(staff) ? staff : staff?.data || [];
  const pagination = staff?.pagination || { current: 1, pages: 1, total: 0 };

  // Client-side filtering if search or role is provided
  if (search.trim()) {
    const lower = search.trim().toLowerCase();
    staffData = staffData.filter((s: any) =>
      s.name?.toLowerCase().includes(lower) ||
      s.email?.toLowerCase().includes(lower) ||
      s.phone?.toLowerCase().includes(lower)
    );
  }
  if (role) {
    const roleLower = role.trim().toLowerCase();
    staffData = staffData.filter((s: any) => (s.role?.trim().toLowerCase() === roleLower));
  }

  return (
    <StaffTable
      columns={columns}
      data={staffData}
      pagination={pagination}
    />
  );
}
