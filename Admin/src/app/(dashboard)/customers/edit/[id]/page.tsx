"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useCustomer, useUpdateCustomer } from "@/hooks/useCustomers";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function EditCustomerPage() {
  const router = useRouter();
  const params = useParams();
  const customerId = params.id as string;
  const { data: customer, isLoading, error } = useCustomer(customerId);
  const updateMutation = useUpdateCustomer();
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    mobile: "",
    isBlocked: false,
  });

  useEffect(() => {
    if (customer) {
      setForm({
        firstname: customer.firstname || "",
        lastname: customer.lastname || "",
        email: customer.email || "",
        mobile: customer.mobile || "",
        isBlocked: customer.isBlocked || false,
      });
    }
  }, [customer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateMutation.mutateAsync({ id: customerId, data: form });
      toast.success("Customer updated successfully!");
      router.push("/customers");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || "Failed to update customer");
    }
  };

  if (isLoading) return <div className="flex justify-center items-center min-h-[80vh]">Loading...</div>;
  if (error) return <div className="flex justify-center items-center min-h-[80vh] text-red-500">Failed to load customer</div>;

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <Card className="w-full max-w-md p-8 shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Edit Customer</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="firstname" className="text-sm font-medium flex items-center gap-2">
                First Name
              </label>
              <Input
                id="firstname"
                name="firstname"
                value={form.firstname}
                onChange={handleChange}
                placeholder="First Name"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="lastname" className="text-sm font-medium flex items-center gap-2">
                Last Name
              </label>
              <Input
                id="lastname"
                name="lastname"
                value={form.lastname}
                onChange={handleChange}
                placeholder="Last Name"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="mobile" className="text-sm font-medium flex items-center gap-2">
                Mobile
              </label>
              <Input
                id="mobile"
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
                placeholder="Mobile"
              />
            </div>
          </div>
          <label className="flex items-center gap-2 mt-4">
            <input type="checkbox" name="isBlocked" checked={form.isBlocked} onChange={handleChange} />
            Blocked
          </label>
          <div className="flex gap-2 mt-6">
            <Button type="submit" className="w-full" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
            <Button type="button" variant="secondary" className="w-full" onClick={() => router.push("/customers")}>Cancel</Button>
          </div>
        </form>
      </Card>
    </div>
  );
} 