"use client";

import { useRef, useState } from "react";
import { Upload, Download, PenSquare, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useCoupons, useCreateCoupon, useImportCoupons, useExportCoupons } from "@/hooks/useCoupons";
import { toast } from "sonner";

export default function CouponActions() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Remove published state and switch from the form UI

  // React Query hooks
  const { data: coupons = [], refetch } = useCoupons();
  const createCouponMutation = useCreateCoupon();
  const importMutation = useImportCoupons();
  const exportMutation = useExportCoupons();

  // Export to CSV
  const handleExport = async () => {
    try {
      const response = await exportMutation.mutateAsync();
      const blob = new Blob([response.data], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `coupons_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("✅ Export successful!");
    } catch (err: any) {
      toast.error(err?.response?.data?.error || err?.message || "Export failed");
    }
  };

  // Import CSV
  const handleImportClick = () => fileInputRef.current?.click();
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith('.csv')) {
      toast.error("❌ Please select a CSV file!");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("❌ File size too large! Please select a file smaller than 5MB.");
      return;
    }
    try {
      await importMutation.mutateAsync(file);
      toast.success("✅ Coupons imported successfully!");
      refetch();
    } catch (err: any) {
      toast.error(err?.response?.data?.error || err?.message || "Import failed");
    }
  };

  // Select coupon
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Add coupon
  const handleAddCoupon = async (e: any) => {
    e.preventDefault();
    const form = e.target;
    const newCoupon = {
      name: form.name.value,
      expiry: form.expiry.value,
      code: form.code.value,
      discount: form.discount.value,
      startDate: form.startDate.value,
    };
    try {
      await createCouponMutation.mutateAsync(newCoupon);
      toast.success("Coupon created successfully!");
      setShowModal(false);
      refetch();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || "Failed to add coupon.");
    }
  };

  return (
    <Card className="mb-5 p-4">
      <div className="flex flex-col xl:flex-row xl:justify-between gap-4">
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={handleExport} disabled={exportMutation.isPending}>
            <Upload className="mr-2 size-4" />
            {exportMutation.isPending ? "Exporting..." : "Export"}
          </Button>
          <Button variant="outline" onClick={handleImportClick} disabled={importMutation.isPending}>
            <Download className="mr-2 size-4" />
            {importMutation.isPending ? "Importing..." : "Import"}
          </Button>
          <input
            type="file"
            accept=".csv"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Dialog open={showModal} onOpenChange={setShowModal}>
            <DialogTrigger asChild>
              <Button variant="default" size="lg">
                <Plus className="mr-2 size-4" /> Add Coupon
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleAddCoupon} className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input name="name" required />
                </div>
                <div>
                  <Label htmlFor="expiry">Expiry</Label>
                  <Input name="expiry" type="date" required />
                </div>
                <div>
                  <Label htmlFor="code">Code</Label>
                  <Input name="code" required />
                </div>
                <div>
                  <Label htmlFor="discount">Discount</Label>
                  <Input name="discount" required />
                </div>
                {/* <div className="flex items-center gap-2">
                  <Label htmlFor="published">Published</Label>
                  <Switch
                    id="published"
                    checked={published}
                    onCheckedChange={setPublished}
                  />
                  <span className="ml-2 text-xs">{published ? "Active" : "Deactive"}</span>
                </div> */}
                {/* <div>
                  <Label htmlFor="status">Status</Label>
                  <Input name="status" required defaultValue="Active" />
                </div> */}
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input name="startDate" type="date" />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input name="endDate" type="date" />
                </div>
                <Button type="submit" variant="default" className="w-full" disabled={createCouponMutation.isPending}>
                  {createCouponMutation.isPending ? "Adding..." : "Add"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </Card>
  );
}
