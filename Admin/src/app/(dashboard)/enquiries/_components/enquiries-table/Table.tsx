"use client";

import { getCoreRowModel, useReactTable } from "@tanstack/react-table";

import DataTable from "@/components/shared/DataTable";
import { Enquiry } from "@/types/enquiry";
import { DataTableProps } from "@/types/data-table";

export default function EnquiriesTable({
  data,
  columns,
  pagination,
}: DataTableProps<Enquiry>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return <DataTable table={table} pagination={pagination} />;
} 