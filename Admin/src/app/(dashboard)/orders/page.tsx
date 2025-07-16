"use client";
import PageTitle from "@/components/shared/PageTitle";
import AllOrders from "./_components/orders-table";
import OrderFilters from "./_components/OrderFilters";
import { useState } from 'react';

export default function OrdersPage() {
  const [filters, setFilters] = useState({});
  const handleFilter = (filters: any) => {
    setFilters(filters);
  };

  return (
    <section>
      <PageTitle>Orders</PageTitle>
      <OrderFilters onFilter={handleFilter} />
      <AllOrders perPage={10} filters={filters} />
    </section>
  );
}
