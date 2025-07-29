
"use client";
import { useMemo, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import BrandsTable from "./_components/brands-table";
import { getBrands } from "@/api/brand";
import { toast } from "sonner";

export default function BrandsPage() {
  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const {
    data: brandsRaw = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["brands"],
    queryFn: getBrands,
  });

  // Always use an array for brands
  const brands = Array.isArray(brandsRaw) ? brandsRaw : brandsRaw?.data || [];

  useEffect(() => {
    if (isError) {
      toast.error("Failed to load brands");
    }
  }, [isError]);

  const filteredBrands = useMemo(() => {
    return brands.filter((b: any) => {
      const search = filter.toLowerCase();
      const nameOrDescMatch = (b.title || "").toLowerCase().includes(search) || (b.description || "").toLowerCase().includes(search);
      const statusMatch =
        statusFilter === "all" ||
        (statusFilter === "active" && b.status === "active") ||
        (statusFilter === "inactive" && b.status === "inactive");
      return nameOrDescMatch && statusMatch;
    });
  }, [brands, filter, statusFilter]);

  return (
    <BrandsTable
      brands={filteredBrands}
      isLoading={isLoading}
      filter={filter}
      setFilter={setFilter}
      statusFilter={statusFilter}
      setStatusFilter={setStatusFilter}
    />
  );
}
