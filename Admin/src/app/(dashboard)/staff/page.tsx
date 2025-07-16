"use client";

import { useState } from "react";
import PageTitle from "@/components/shared/PageTitle";
import StaffFilters from "./_components/StaffFilters";
import StaffTable from "./_components/staff-table";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function StaffPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const handleFilter = (searchValue: string, roleValue: string) => {
    setSearch(searchValue);
    setRole(roleValue);
  };
  return (
    <section>
      <PageTitle>All Staff</PageTitle>
      <StaffFilters
        search={search}
        setSearch={setSearch}
        role={role}
        setRole={setRole}
        onFilter={handleFilter}
      />
      <StaffTable search={search} role={role} />
    </section>
  );
}
