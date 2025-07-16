"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";





export default function AddStaffPage() {
    const router = useRouter();
    // Inside your component
    const searchParams = useSearchParams();
    const roleFromQuery = searchParams.get("role");

    useEffect(() => {
        if (roleFromQuery && !form.role) {
            setForm((prev) => ({
                ...prev,
                role: roleFromQuery.charAt(0).toUpperCase() + roleFromQuery.slice(1), // 'admin' → 'Admin'
            }));
        }
    }, [roleFromQuery]);
    const [form, setForm] = useState({ name: "", email: "", phone: "", role: "Admin" });

    const handleChange = (e: any) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        try {
            const res = await fetch("http://localhost:5000/api/staff", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify(form),
            });
            if (res.ok) {
                router.push("/staff");
            } else {
                const errorData = await res.json();
                alert(errorData.message || errorData.error || "Failed to add staff");
            }
        } catch (err) {
            alert("Network error: " + err);
        }
    };

    return (
        <Card className="p-6 max-w-xl mx-auto mt-10">
            <h2 className="text-2xl font-bold mb-4">Add New Staff</h2>
            <form onSubmit={handleSubmit} className="grid gap-4">
                <div>
                    <Label htmlFor="name">Name</Label>
                    <Input name="name" onChange={handleChange} value={form.name} required />
                </div>
                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input name="email" type="email" onChange={handleChange} value={form.email} required />
                </div>
                <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input name="phone" onChange={handleChange} value={form.phone} required />
                </div>
                <div>
                    <Label htmlFor="role">Role</Label>
                    <Select value={form.role} onValueChange={(value) => setForm({ ...form, role: value })} required>
                        <SelectTrigger id="role">
                            <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Admin">Admin</SelectItem>
                            <SelectItem value="Cashier">Cashier</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Button type="submit">Add Staff</Button>
            </form>
        </Card>
    );
}
