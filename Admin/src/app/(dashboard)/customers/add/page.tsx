"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useRegisterCustomer } from "@/hooks/useCustomers";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function AddCustomerPage() {
  const router = useRouter();
  const registerMutation = useRegisterCustomer();
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    mobile: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerMutation.mutateAsync(form);
      toast.success("Customer added successfully!");
      router.push("/customers");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || "Failed to add customer");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <Card className="w-full max-w-md p-8 shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Add Customer</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input name="firstname" placeholder="First Name" value={form.firstname} onChange={handleChange} required />
          <Input name="lastname" placeholder="Last Name" value={form.lastname} onChange={handleChange} required />
          <Input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
          <Input name="mobile" placeholder="Mobile" value={form.mobile} onChange={handleChange} />
          <Input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
          <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
            {registerMutation.isPending ? "Adding..." : "Add Customer"}
          </Button>
        </form>
      </Card>
    </div>
  );
} 