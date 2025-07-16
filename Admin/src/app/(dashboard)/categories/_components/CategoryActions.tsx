"use client";

import { useState, useRef } from "react";
import { Upload, Download, PenSquare, Trash2, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { toast } from "sonner";
import { 
  useExportCategories, 
  useImportCategories, 
  useBulkDeleteCategories, 
  useBulkEditCategories, 
  useCreateCategory 
} from "@/hooks/useCategories";
import { useCategoryContext } from "../page";

// ✅ Main Component: Handles all category actions
export default function CategoryActions() {
  // Context
  const { selectedIds, setSelectedIds } = useCategoryContext();

  // State management
  const [open, setOpen] = useState(false); // Modal visibility
  const [categoryName, setCategoryName] = useState(""); // New category input
  const [categoryDescription, setCategoryDescription] = useState(""); // New category description
  const [bulkActionType, setBulkActionType] = useState<"delete" | "edit">("delete");
  const [bulkEditData, setBulkEditData] = useState({ name: "", description: "" });

  // API hooks
  const exportMutation = useExportCategories();
  const importMutation = useImportCategories();
  const bulkDeleteMutation = useBulkDeleteCategories();
  const bulkEditMutation = useBulkEditCategories();
  const createMutation = useCreateCategory();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // ✅ Export categories to CSV
  const handleExport = async () => {
    try {
      const response = await exportMutation.mutateAsync();
      
      // Create blob and download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "categories.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Categories exported successfully!");
    } catch (error) {
      toast.error("Export failed. Please try again.");
      console.error("Export error:", error);
    }
  };

  // ✅ Import categories from CSV file
  const handleImport = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      await importMutation.mutateAsync(formData);
      toast.success("Categories imported successfully!");
    } catch (error) {
      toast.error("Import failed. Please check your CSV file format.");
      console.error("Import error:", error);
    }
  };

  // ✅ Bulk delete categories
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) {
      toast.error("Please select at least one category.");
      return;
    }

    try {
      await bulkDeleteMutation.mutateAsync(selectedIds);
      setSelectedIds([]);
      toast.success(`${selectedIds.length} categories deleted successfully!`);
    } catch (error) {
      toast.error("Bulk delete failed. Please try again.");
      console.error("Bulk delete error:", error);
    }
  };

  // ✅ Bulk edit categories
  const handleBulkEdit = async () => {
    if (selectedIds.length === 0) {
      toast.error("Please select at least one category.");
      return;
    }

    if (!bulkEditData.name.trim() && !bulkEditData.description.trim()) {
      toast.error("Please provide at least one field to update.");
      return;
    }

    try {
      const updates = selectedIds.map(id => ({
        _id: id,
        ...(bulkEditData.name.trim() && { name: bulkEditData.name.trim() }),
        ...(bulkEditData.description.trim() && { description: bulkEditData.description.trim() })
      }));

      await bulkEditMutation.mutateAsync(updates);
      setSelectedIds([]);
      setBulkEditData({ name: "", description: "" });
      toast.success(`${selectedIds.length} categories updated successfully!`);
    } catch (error) {
      toast.error("Bulk edit failed. Please try again.");
      console.error("Bulk edit error:", error);
    }
  };

  // ✅ Add new category
  const handleAddCategory = async () => {
    if (!categoryName.trim()) {
      toast.error("Category name is required.");
      return;
    }

    try {
      await createMutation.mutateAsync({
        name: categoryName.trim(),
        description: categoryDescription.trim(),
        isActive: true
      });
      
      setCategoryName("");
      setCategoryDescription("");
      setOpen(false);
      toast.success("Category added successfully!");
    } catch (error) {
      toast.error("Failed to add category. Please try again.");
      console.error("Add category error:", error);
    }
  };

  // ✅ Trigger file explorer for import
  const triggerFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Card className="mb-5">
      <div className="flex flex-col xl:flex-row xl:justify-between gap-4 p-4">
        {/* ✅ Left-side buttons */}
        <div className="flex flex-wrap gap-3">
          {/* Export Button */}
          <Button 
            variant="outline" 
            onClick={handleExport} 
            disabled={exportMutation.isPending}
          >
            <Upload className="mr-2 size-4" /> 
            {exportMutation.isPending ? "Exporting..." : "Export"}
          </Button>

          {/* Import Button */}
          <Button
            variant="outline"
            onClick={triggerFileSelect}
            disabled={importMutation.isPending}
          >
            <Download className="mr-2 size-3" />
            {importMutation.isPending ? "Importing..." : "Import"}
          </Button>
          <input
            type="file"
            accept=".csv"
            ref={fileInputRef}
            onChange={(e) => {
              if (e.target.files?.[0]) handleImport(e.target.files[0]);
            }}
            className="hidden"
          />
        </div>

        {/* ✅ Right-side buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Bulk Edit Button */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="secondary"
                size="lg"
                className="sm:flex-grow xl:flex-grow-0"
                disabled={selectedIds.length === 0}
              >
                <PenSquare className="mr-2 size-3" /> Bulk Edit
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Bulk Edit Categories</AlertDialogTitle>
                <AlertDialogDescription>
                  Update {selectedIds.length} selected categories. Leave fields empty to keep current values.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <Input
                    placeholder="New category name (optional)"
                    value={bulkEditData.name}
                    onChange={(e) => setBulkEditData({ ...bulkEditData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Input
                    placeholder="New description (optional)"
                    value={bulkEditData.description}
                    onChange={(e) => setBulkEditData({ ...bulkEditData, description: e.target.value })}
                  />
                </div>
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleBulkEdit}>
                  Update Categories
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Bulk Delete Button */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="lg"
                className="sm:flex-grow xl:flex-grow-0"
                disabled={selectedIds.length === 0}
              >
                <Trash2 className="mr-2 size-3" /> Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Categories</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete {selectedIds.length} selected categories? 
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleBulkDelete} className="bg-destructive text-destructive-foreground">
                  Delete Categories
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Add Category Modal */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                variant="default"
                size="lg"
                className="sm:flex-grow xl:flex-grow-0"
              >
                <Plus className="mr-2 size-4" /> Add Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Name *</label>
                  <Input
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    placeholder="Enter category name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Input
                    value={categoryDescription}
                    onChange={(e) => setCategoryDescription(e.target.value)}
                    placeholder="Enter category description (optional)"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddCategory} disabled={createMutation.isPending}>
                  {createMutation.isPending ? "Adding..." : "Add Category"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </Card>
  );
}
