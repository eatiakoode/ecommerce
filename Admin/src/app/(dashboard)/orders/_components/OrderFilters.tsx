"use client"; // ✅ Mark: Enables client-side interactivity

import { useState } from "react";
import { DownloadCloud } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import DatePicker from "@/components/shared/DatePicker";
import { ORDER_STATUSES, ORDER_METHODS } from "@/constants/orders";
import Papa from "papaparse"; // ✅ Mark: Used for CSV export
import { saveAs } from "file-saver"; // ✅ Mark: Triggers CSV download
// import DatePicker from "./DatePicker";

// ✅ Mark: Add props to set filtered orders in parent component
export default function OrderFilters({ onFilter }: { onFilter: (filters: any) => void }) {
  // ✅ Mark: Define all filter states
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [method, setMethod] = useState("");
  const [limit, setLimit] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  // ✅ Mark: Dummy orders (replace with API data)
  const dummyOrders = [
    {
      orderTime: "2024-03-25 5:59 AM",
      customerName: "Debbie Dietrich",
      method: "Card",
      amount: "$905.17",
      status: "Delivered",
    },
    {
      orderTime: "2024-03-25 4:46 PM",
      customerName: "Heidi Feest",
      method: "Card",
      amount: "$2011.22",
      status: "Delivered",
    },
  ];

  // ✅ Mark: Handle Download as CSV
  const handleDownload = () => {
    const csv = Papa.unparse(dummyOrders); // Replace with filtered orders
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "orders.csv");
  };

  // ✅ Mark: Handle Filter submission
  const handleFilter = () => {
    const filters = { search, status, method, limit, startDate, endDate };
    onFilter(filters); // 🔁 Pass to parent to filter orders
  };

  // ✅ Mark: Handle Reset
  const handleReset = () => {
    setSearch("");
    setStatus("");
    setMethod("");
    setLimit("");
    setStartDate(undefined);
    setEndDate(undefined);
    onFilter({}); // 🔁 Clear filters
  };

  return (
    <Card className="mb-5">
      <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
        <div className="flex flex-col md:flex-row gap-4 lg:gap-6">
          <Input
            type="search"
            placeholder="Search by customer name"
            className="h-12 md:basis-1/5"
            value={search}
            onChange={(e) => setSearch(e.target.value)} // ✅ Controlled input
          />

          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="capitalize md:basis-1/5">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {ORDER_STATUSES.map((s) => (
                <SelectItem key={s} value={s} className="capitalize">
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={limit} onValueChange={setLimit}>
            <SelectTrigger className="md:basis-1/5">
              <SelectValue placeholder="Limit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">Last 5 days</SelectItem>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="14">Last 14 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
            </SelectContent>
          </Select>

          <Select value={method} onValueChange={setMethod}>
            <SelectTrigger className="capitalize md:basis-1/5">
              <SelectValue placeholder="Method" />
            </SelectTrigger>
            <SelectContent>
              {ORDER_METHODS.map((m) => (
                <SelectItem key={m} value={m} className="capitalize">
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            type="button"
            onClick={handleDownload}
            className="h-12 flex-shrink-0 md:basis-1/5"
          >
            Download <DownloadCloud className="ml-2 size-4" />
          </Button>
        </div>

        <div className="flex flex-col md:flex-row md:items-end gap-4 lg:gap-6">
          <div className="md:basis-[35%]">
            <Label className="text-muted-foreground font-normal">Start date</Label>
            <DatePicker date={startDate} setDate={setStartDate} />
          </div>

          <div className="md:basis-[35%]">
            <Label className="text-muted-foreground font-normal">End date</Label>
            <DatePicker date={endDate} setDate={setEndDate} />
          </div>

          <div className="flex flex-wrap sm:flex-nowrap gap-4 md:basis-[30%]">
            <Button size="lg" className="h-12 flex-grow" onClick={handleFilter}>
              Filter
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="h-12 flex-grow"
              onClick={handleReset}
            >
              Reset
            </Button>
          </div>
        </div>
      </form>
    </Card>
  );
}
