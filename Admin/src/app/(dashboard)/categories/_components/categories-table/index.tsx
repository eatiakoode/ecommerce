"use client";

import { columns, skeletonColumns } from "./columns";
import CategoriesTable from "./Table";
import TableSkeleton from "@/components/shared/TableSkeleton";
import TableError from "@/components/shared/TableError";
import { usePaginatedCategories } from "@/hooks/useCategories";
import { Button } from "@/components/ui/button";

interface AllCategoriesProps {
  search: string;
  page: number;
  onPageChange: (page: number) => void;
  perPage?: number;
}

export default function AllCategories({ search, page, onPageChange, perPage = 10 }: AllCategoriesProps) {
  // Use paginated categories with search
  const { data: categoriesData, isLoading, error, refetch } = usePaginatedCategories({
    page,
    limit: perPage,
    search: search.trim() || undefined
  });
  
  if (isLoading) return <TableSkeleton perPage={perPage} columns={skeletonColumns} />;
  if (error) return <TableError errorMessage="Failed to load categories" refetch={refetch} />;

  // Handle the case where categories might be undefined or have a different structure
  const categories = categoriesData?.categories || [];
  const pagination = {
    current: page,
    pages: categoriesData?.pages || 1,
    total: categoriesData?.total || 0
  };

  return (
    <>
      <CategoriesTable
        columns={columns}
        data={categories}
        pagination={pagination}
      />
      {/* Pagination Controls */}
      {pagination.pages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page === 1 || isLoading}
          >
            Previous
          </Button>
          <span className="text-sm">
            Page {page} of {pagination.pages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.min(pagination.pages, page + 1))}
            disabled={page === pagination.pages || isLoading}
          >
            Next
          </Button>
        </div>
      )}
    </>
  );
}
