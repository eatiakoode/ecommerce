"use client";

import { Plus } from "lucide-react";
import Link from "next/link";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface StaffFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  role: string;
  setRole: (value: string) => void;
  onFilter: (search: string, role: string) => void;
}

export default function StaffFilters({ search, setSearch, role, setRole, onFilter }: StaffFiltersProps) {
  // Handle filter button
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter(search, role);
  };

  // Handle reset button
  const handleReset = () => {
    setSearch("");
    setRole("");
    onFilter("", "");
  };

  return (
    <Card className="mb-5">
      <form className="flex flex-col md:flex-row gap-4 lg:gap-6" onSubmit={handleSubmit}>
        <Input
          type="search"
          placeholder="Search by name, email or phone"
          className="h-12 md:basis-1/3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Select value={role} onValueChange={setRole}>
          <SelectTrigger className="md:basis-1/3">
            <SelectValue placeholder="Role" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="cashier">Cashier</SelectItem>
            <SelectItem value="super-admin">Super Admin</SelectItem>
          </SelectContent>
        </Select>

        <Sheet>
          <Link href="/staff/add">
            <Button size="lg" className="h-12 md:basis-1/3">
              <Plus className="mr-2 size-4" /> Add Staff
            </Button>
          </Link>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Edit profile</SheetTitle>
              <SheetDescription>
                Make changes to your profile here. Click save when you&apos;re
                done.
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input id="name" value="Pedro Duarte" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Username
                </Label>
                <Input id="username" value="@peduarte" className="col-span-3" />
              </div>
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <Button type="submit">Save changes</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>

        <div className="flex flex-wrap sm:flex-nowrap gap-4">
          <Button size="lg" className="flex-grow" type="submit">
            Filter
          </Button>
          <Button size="lg" variant="secondary" className="flex-grow" type="button" onClick={handleReset}>
            Reset
          </Button>
        </div>
      </form>
    </Card>
  );
}
