import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React from "react";

interface FiltersProps {
  search: string;
  setSearch: (value: string) => void;
}

export default function Filters({ search, setSearch }: FiltersProps) {
  return (
    <Card className="shadow-lg rounded-xl bg-gradient-to-br from-white via-gray-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950 border-0">
      <form
        className="flex flex-col md:flex-row gap-6 items-center p-4"
        onSubmit={e => e.preventDefault()}
      >
        <Input
          type="text"
          placeholder="Search by name, email or phone"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="h-12 md:basis-1/2"
        />
        <div className="flex gap-4 md:basis-1/2">
          <Button size="lg" type="submit" className="flex-grow">
            Filter
          </Button>
          <Button
            size="lg"
            variant="secondary"
            type="button"
            onClick={() => setSearch("")}
            className="flex-grow"
          >
            Reset
          </Button>
        </div>
      </form>
    </Card>
  );
} 