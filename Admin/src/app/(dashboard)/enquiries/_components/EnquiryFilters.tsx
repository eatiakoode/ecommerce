"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDebouncedCallback } from "use-debounce";

interface EnquiryFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  dateFilter: string;
  setDateFilter: (value: string) => void;
  onFilter: (value: string) => void;
  onDateFilter: (value: string) => void;
}

export default function EnquiryFilters({ 
  search, 
  setSearch, 
  dateFilter, 
  setDateFilter, 
  onFilter, 
  onDateFilter 
}: EnquiryFiltersProps) {
  // Debounced search input
  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
  }, 300);

  // Handle filter button
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter(search);
  };

  // Handle reset button
  const handleReset = () => {
    setSearch("");
    setDateFilter("");
    onFilter("");
    onDateFilter("");
  };

  return (
    <Card className="mb-5 shadow-lg rounded-xl bg-gradient-to-br from-white via-gray-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950 border-0">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col md:flex-row gap-4 lg:gap-6 p-6"
      >
        {/* 🔍 Search input */}
        <Input
          type="search"
          placeholder="Search by name, email or message"
          className="h-12 md:basis-1/3"
          value={search}
          onChange={(e) => debouncedSearch(e.target.value)}
        />

        {/* 📅 Date filter */}
        <Input
          type="date"
          className="h-12 md:basis-1/3"
          value={dateFilter}
          onChange={(e) => {
            setDateFilter(e.target.value);
            onDateFilter(e.target.value);
          }}
        />

        {/* ✅ Filter & Reset buttons */}
        <div className="flex flex-wrap sm:flex-nowrap gap-4 md:basis-1/3">
          <Button size="lg" type="submit" className="flex-grow">
            Filter
          </Button>
          <Button
            size="lg"
            variant="secondary"
            type="button"
            onClick={handleReset}
            className="flex-grow"
          >
            Reset
          </Button>
        </div>
      </form>
    </Card>
  );
} 