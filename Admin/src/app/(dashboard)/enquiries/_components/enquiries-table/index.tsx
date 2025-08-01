"use client";

import { columns, skeletonColumns } from "./columns";
import EnquiriesTable from "./Table";
import TableSkeleton from "@/components/shared/TableSkeleton";
import TableError from "@/components/shared/TableError";
import { useEnquiries } from "@/hooks/useEnquiries";
import { Enquiry } from "@/types/enquiry";

type Props = {
  perPage?: number;
  search?: string;
  dateFilter?: string;
};

export default function AllEnquiries({ perPage = 10, search = "", dateFilter = "" }: Props) {
  const { data: enquiries, isLoading, error, refetch } = useEnquiries();
  
  if (isLoading) return <TableSkeleton perPage={perPage} columns={skeletonColumns} />;
  if (error) return <TableError errorMessage="Failed to load enquiries" refetch={refetch} />;

  // Handle the case where enquiries might be undefined or have a different structure
  let enquiriesData = enquiries?.data || enquiries || [];

  // Client-side filtering if search is provided
  if (search.trim()) {
    const lower = search.trim().toLowerCase();
    enquiriesData = enquiriesData.filter((e: Enquiry) =>
      e.name?.toLowerCase().includes(lower) ||
      e.email?.toLowerCase().includes(lower) ||
      e.comment?.toLowerCase().includes(lower)
    );
  }

  // Client-side date filtering
  if (dateFilter) {
    const filterDate = new Date(dateFilter);
    filterDate.setHours(0, 0, 0, 0);
    
    enquiriesData = enquiriesData.filter((e: Enquiry) => {
      if (!e.createdAt) {
        return false; // Skip entries without createdAt
      }
      try {
        const enquiryDate = new Date(e.createdAt);
        if (isNaN(enquiryDate.getTime())) {
          return false; // Skip invalid dates
        }
        enquiryDate.setHours(0, 0, 0, 0);
        return enquiryDate.getTime() === filterDate.getTime();
      } catch (error) {
        return false; // Skip invalid dates
      }
    });
  }

  const pagination = { current: 1, pages: 1, total: enquiriesData.length };

  return (
    <EnquiriesTable
      columns={columns}
      data={enquiriesData}
      pagination={pagination}
    />
  );
} 