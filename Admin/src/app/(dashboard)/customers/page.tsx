"use client";

import { useState } from "react";
import PageTitle from "@/components/shared/PageTitle";
import CustomerActions from "./_components/CustomerActions";
import CustomerFilters from "./_components/CustomerFilters";
import AllCustomers from "./_components/customers-table";

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const handleFilter = (value: string) => {
    setSearch(value);
  };
  return (
    <section>
      <PageTitle>Customers</PageTitle>
      <CustomerActions />
      <CustomerFilters
        search={search}
        setSearch={setSearch}
        onFilter={handleFilter}
      />
      <AllCustomers search={search} />
    </section>
  );
}
