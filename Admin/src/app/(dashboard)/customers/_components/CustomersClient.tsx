// CustomersClient.tsx
"use client";

import { useState } from "react";
import CustomerActions from "./CustomerActions";
import CustomerFilters from "./CustomerFilters";
import AllCustomers from "./customers-table";

export default function CustomersClient() {
  const [customers, setCustomers] = useState([]);

  return (
    <>
      <CustomerActions setCustomers={setCustomers} />
      <CustomerFilters setCustomers={setCustomers} />
      <AllCustomers customers={customers} />
    </>
  );
}
