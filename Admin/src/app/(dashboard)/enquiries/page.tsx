"use client";

import { useState } from "react";
import PageTitle from "@/components/shared/PageTitle";
import EnquiryFilters from "./_components/EnquiryFilters";
import AllEnquiries from "./_components/enquiries-table";

export default function EnquiriesPage() {
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  
  const handleFilter = (value: string) => {
    setSearch(value);
  };

  const handleDateFilter = (value: string) => {
    setDateFilter(value);
  };

  return (
    <section>
      <PageTitle>Enquiries</PageTitle>
      <EnquiryFilters
        search={search}
        setSearch={setSearch}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        onFilter={handleFilter}
        onDateFilter={handleDateFilter}
      />
      <AllEnquiries search={search} dateFilter={dateFilter} />
    </section>
  );
}
