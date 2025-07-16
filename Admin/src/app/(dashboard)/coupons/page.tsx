"use client";

import { useState } from "react";
import PageTitle from "@/components/shared/PageTitle";
import CouponActions from "./_components/CouponActions";
import CouponFilters from "./_components/CouponFilters";
import AllCoupons from "./_components/coupons-table";

export default function CouponsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleFilter = (query: string) => {
    setSearchQuery(query);
  };

  const handleReset = () => {
    setSearchQuery("");
  };

  return (
    <section>
      <PageTitle>Coupons</PageTitle>

      <CouponActions />
      <CouponFilters onFilter={handleFilter} onReset={handleReset} />
      <AllCoupons query={searchQuery} />
    </section>
  );
}
