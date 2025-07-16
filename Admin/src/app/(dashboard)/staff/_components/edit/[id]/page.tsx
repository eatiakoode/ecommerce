"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";


export default function EditStaffPage() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    username: "",
  });
//    console.log("ID from route:", id);

//   return <div>Testing Page for ID: {id}</div>;

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await axios.get(`/api/staff/${id}`);
        setForm({
          name: res.data.name,
          username: res.data.username,
        });
      } catch (err) {
        console.error("Failed to load staff", err);
      }
    };

    fetchStaff();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
  try {
    await axios.put(`/api/staff/${id}`, form);

    toast({
      title: "Profile updated",
      description: "Staff profile has been successfully updated.",
    });

    router.push("/dashboard/staff"); // 👈 Navigate after toast
  } catch (err) {
    console.error("Failed to update", err);
    toast({
      variant: "destructive",
      title: "Update failed",
      description: "Something went wrong while updating the profile.",
    });
  }
};


  return (
    <div className="max-w-xl mx-auto mt-10 space-y-6">
      <h1 className="text-2xl font-semibold">Edit Staff Profile</h1>

      <div className="grid gap-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">Name</Label>
          <Input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="username" className="text-right">Username</Label>
          <Input
            id="username"
            name="username"
            value={form.username}
            onChange={handleChange}
            className="col-span-3"
          />
        </div>
        <Button onClick={handleSubmit}>Save Changes</Button>
        
      </div>
    </div>
  );
}
