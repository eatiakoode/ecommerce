"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface CouponFiltersProps {
  onFilter: (query: string) => void;
  onReset: () => void;
}

export default function CouponFilters({ onFilter, onReset }: CouponFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // 🔁 Debounce logic: wait 500ms after user stops typing
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // ⏱️ Trigger filter when debouncedQuery changes
  useEffect(() => {
    onFilter(debouncedQuery.trim());
  }, [debouncedQuery, onFilter]);

  const handleReset = () => {
    setSearchQuery("");
    onReset();
  };

  return (
    <Card className="mb-5">
      <form className="flex flex-col md:flex-row gap-4 lg:gap-6" onSubmit={(e) => e.preventDefault()}>
        <Input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by coupon code or name"
          className="h-12 md:basis-1/2"
        />

        <div className="flex flex-wrap sm:flex-nowrap gap-4 md:basis-1/2">
          <Button size="lg" type="button" onClick={() => onFilter(searchQuery)} className="flex-grow">
            Filter
          </Button>
          <Button size="lg" type="button" variant="secondary" className="flex-grow" onClick={handleReset}>
            Reset
          </Button>
        </div>
      </form>
    </Card>
  );
}
