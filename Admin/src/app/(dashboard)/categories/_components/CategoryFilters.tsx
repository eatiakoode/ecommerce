"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDebouncedCallback } from "use-debounce";

interface CategoryFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  onFilter: (value: string) => void;
}

export default function CategoryFilters({ search, setSearch, onFilter }: CategoryFiltersProps) {
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
    onFilter("");
  };

  return (
    <Card className="p-4 mb-4">
      <form
        className="flex flex-col md:flex-row gap-4 lg:gap-6"
        onSubmit={handleSubmit}
      >
        <Input
          type="search"
          placeholder="Search by category name"
          className="h-12 md:basis-1/2"
          value={search}
          onChange={(e) => debouncedSearch(e.target.value)}
        />

        <div className="flex flex-wrap sm:flex-nowrap gap-4 md:basis-1/2">
          <Button type="submit" size="lg" className="flex-grow">
            Filter
          </Button>
          <Button
            type="button"
            size="lg"
            variant="secondary"
            className="flex-grow"
            onClick={handleReset}
          >
            Reset
          </Button>
        </div>
      </form>
    </Card>
  );
}
