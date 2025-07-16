"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useCoupon, useUpdateCoupon } from "@/hooks/useCoupons";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

export default function EditCouponPage() {
  const router = useRouter();
  const params = useParams();
  const couponId = params.id as string;
  const { data: coupon, isLoading, error } = useCoupon(couponId);
  const updateMutation = useUpdateCoupon();
  const [form, setForm] = useState({
    code: "",
    discount: "",
    startDate: "",
    expiry: "",
  });

  useEffect(() => {
    if (coupon) {
      setForm({
        code: coupon.code || coupon.name || "",
        discount: coupon.discount || "",
        startDate: coupon.startDate ? coupon.startDate.slice(0, 10) : "",
        expiry: coupon.expiry ? coupon.expiry.slice(0, 10) : "",
      });
    }
  }, [coupon]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: form.code,
        discount: form.discount,
        expiry: form.expiry,
        startDate: form.startDate,
      };
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/coupon/${couponId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update coupon");
      }
      toast.success("Coupon updated successfully!");
      router.push("/coupons");
    } catch (err: any) {
      toast.error(err?.message || "Failed to update coupon");
    }
  };

  if (isLoading) return <div className="flex justify-center items-center min-h-[80vh]">Loading...</div>;
  if (error) return <div className="flex justify-center items-center min-h-[80vh] text-red-500">Failed to load coupon</div>;

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <Card className="w-full max-w-md p-8 shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Edit Coupon</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="code">Code</Label>
            <Input name="code" value={form.code} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="discount">Discount</Label>
            <Input name="discount" value={form.discount} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="startDate">Start Date</Label>
            <Input name="startDate" type="date" value={form.startDate} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="expiry">Expiry Date</Label>
            <Input name="expiry" type="date" value={form.expiry} onChange={handleChange} />
          </div>
          <div className="flex gap-2">
            <Button type="submit" className="w-full" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
            <Button type="button" variant="secondary" className="w-full" onClick={() => router.push("/coupons")}>Cancel</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}