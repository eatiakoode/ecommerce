"use client";
import { useState, useEffect } from "react";
import ActionBar from "./_components/sizes-table/ActionBar";
import FilterBar from "./_components/sizes-table/FilterBar";
import SizesTable from "./_components/sizes-table/SizesTable";
import { getSizes } from "@/api/size";

export default function SizesPage() {
  const [sizes, setSizes] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    async function fetchSizes() {
      setLoading(true);
      try {
        const data = await getSizes();
        setSizes(data);
      } catch (e) {
        setError("Failed to load sizes");
      } finally {
        setLoading(false);
      }
    }
    fetchSizes();
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-8 w-full space-y-6">
      <ActionBar selectedIds={selectedIds} setSelectedIds={setSelectedIds} setSizes={setSizes} sizes={sizes} />
      <FilterBar filter={filter} setFilter={setFilter} />
      <SizesTable sizes={sizes} loading={loading} error={error} selectedIds={selectedIds} setSelectedIds={setSelectedIds} setSizes={setSizes} />
      {/*
        Button functionalities for demo:
        - Export: Shows an alert 'Export'.
        - Import: Shows an alert 'Import'.
        - Bulk Edit: Shows an alert 'Bulk Action' (enabled only if at least one size is selected).
        - Delete: Shows an alert 'Bulk Delete' (enabled only if at least one size is selected).
        - Add Size: Shows an alert 'Add Size'.
      */}
    </div>
  );
}
