"use client";

import { useRef, useState } from "react";
import { Upload, Download, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useImportCustomers, useExportCustomers } from "@/hooks/useCustomers";
import { toast } from "sonner";

export default function CustomerActions() {
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  // Import/Export hooks
  const importMutation = useImportCustomers();
  const exportMutation = useExportCustomers();

  // ✅ Trigger file explorer
  const triggerFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // ✅ Handle file selection and import
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    // Validate file type
    if (!selected.name.endsWith('.csv')) {
      toast.error("❌ Please select a CSV file!");
      return;
    }

    // Validate file size (max 5MB)
    if (selected.size > 5 * 1024 * 1024) {
      toast.error("❌ File size too large! Please select a file smaller than 5MB.");
      return;
    }

    setFile(selected);
    
    try {
      const response = await importMutation.mutateAsync(selected);
      console.log("Import response:", response);
      toast.success(`✅ ${response.data.count || 0} customers imported successfully!`);
      router.refresh();
    } catch (err: any) {
      console.error("Import failed", err);
      const errorMessage = err?.response?.data?.error || err?.message || "Import failed";
      toast.error(`❌ ${errorMessage}`);
    }
  };

  // ✅ Export CSV
  const handleExport = async () => {
    try {
      const response = await exportMutation.mutateAsync();
      
      // Create blob and download
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `customers_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success("✅ Export successful!");
    } catch (err: any) {
      console.error("Export failed", err);
      const errorMessage = err?.response?.data?.error || err?.message || "Export failed";
      toast.error(`❌ ${errorMessage}`);
    }
  };

  return (
    <Card className="mb-5 shadow-lg rounded-xl bg-gradient-to-br from-white via-gray-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950 border-0 animate-fadeIn">
      <div className="flex flex-col xl:flex-row xl:justify-between gap-6 p-6">
        <div className="flex flex-wrap gap-4 items-center">
          {/* ✅ Export Button */}
          <Button
            variant="outline"
            className="transition-all hover:scale-105 hover:bg-blue-100 dark:hover:bg-blue-900"
            onClick={handleExport}
            disabled={exportMutation.isPending}
          >
            <Download className="mr-2 size-4" /> 
            {exportMutation.isPending ? "Exporting..." : "Export"}
          </Button>

          {/* ✅ Import Button */}
          <Button
            variant="outline"
            className="transition-all hover:scale-105 hover:bg-green-100 dark:hover:bg-green-900"
            onClick={triggerFileSelect}
            disabled={importMutation.isPending}
          >
            <Upload className="mr-2 size-4" /> 
            {importMutation.isPending ? "Importing..." : "Import"}
          </Button>

          {/* ✅ Hidden file input */}
          <input
            type="file"
            accept=".csv"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          {/* ✅ Add Customer Button */}
          <Button
            variant="default"
            size="lg"
            onClick={() => router.push("/customers/add")}
            className="sm:flex-grow xl:flex-grow-0 transition-all hover:scale-105 hover:bg-blue-600/90"
          >
            <Plus className="mr-2 size-4" /> Add Customer
          </Button>
        </div>
      </div>
    </Card>
  );
}
