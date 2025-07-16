"use client";

import { useState } from "react";
import { useImportProducts, useExportProducts } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Download, Upload } from "lucide-react";

export default function ProductImportExport() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const importMutation = useImportProducts();
  const exportMutation = useExportProducts();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleImport = () => {
    if (selectedFile) {
      importMutation.mutate(selectedFile);
    }
  };

  const handleExport = () => {
    exportMutation.mutate();
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Product Import/Export</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Import Section */}
        <div className="space-y-2">
          <h3 className="font-semibold">Import Products</h3>
          <div className="flex gap-2">
            <Input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="flex-1"
            />
            <Button
              onClick={handleImport}
              disabled={!selectedFile || importMutation.isPending}
              className="flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Import
            </Button>
          </div>
          {importMutation.isPending && (
            <p className="text-blue-600">🔄 Importing products...</p>
          )}
          {importMutation.isSuccess && (
            <p className="text-green-600">✅ Products imported successfully!</p>
          )}
          {importMutation.isError && (
            <p className="text-red-600">❌ Import failed: {importMutation.error?.message}</p>
          )}
        </div>

        {/* Export Section */}
        <div className="space-y-2">
          <h3 className="font-semibold">Export Products</h3>
          <Button
            onClick={handleExport}
            disabled={exportMutation.isPending}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
          {exportMutation.isPending && (
            <p className="text-blue-600">🔄 Exporting products...</p>
          )}
          {exportMutation.isSuccess && (
            <p className="text-green-600">✅ Products exported successfully!</p>
          )}
          {exportMutation.isError && (
            <p className="text-red-600">❌ Export failed: {exportMutation.error?.message}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 