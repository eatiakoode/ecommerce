"use client";

import React, { useState, useEffect } from "react";
import { Loader2, ShieldAlert } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

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
import Typography from "@/components/ui/typography";

// TODO: Replaced mock data with real API call using useCategories
import { useCategories } from "@/hooks/useCategories";

// ✅ Accept filter update function from parent
export default function ProductFilters({
  onFilterChange,
}: {
  onFilterChange: (filters: {
    search: string;
    category: string;
    sort: string;
  }) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortOption, setSortOption] = useState("");

  const { data: categories, isLoading, error, refetch } = useCategories();
  // Find the selected category object for display
  const selectedCategoryObj = Array.isArray(categories)
    ? categories.find((cat: any) => cat.slug === selectedCategory)
    : null;

  // Trigger filter when category changes (must be at top level)
  useEffect(() => {
    if (selectedCategory) {
      onFilterChange({
        search: searchTerm,
        category: selectedCategory,
        sort: sortOption,
      });
    }
    // eslint-disable-next-line
  }, [selectedCategory]);

  if (isLoading) return <div>Loading categories...</div>;
  if (error) return <div>Error loading categories</div>;

  const handleFilter = () => {
    onFilterChange({
      search: searchTerm,
      category: selectedCategory,
      sort: sortOption,
    });
  };

  const handleReset = () => {
    // ✅ Reset all fields
    setSearchTerm("");
    setSelectedCategory("");
    setSortOption("");

    // ✅ Also reset parent filters
    onFilterChange({
      search: "",
      category: "",
      sort: "",
    });
  };

  return (
    <Card className="mb-5 shadow-lg rounded-xl bg-gradient-to-br from-white via-gray-50 to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950 border-0 animate-fadeIn">
      <form
        className="flex flex-col md:flex-row gap-6 lg:gap-8 p-6 items-center"
        onSubmit={(e) => {
          e.preventDefault(); // ✅ Prevent page reload
          handleFilter();
        }}
      >
        <Input
          type="search"
          placeholder="Search product..."
          value={searchTerm} // ✅ Controlled
          onChange={(e) => setSearchTerm(e.target.value)} // ✅ Update state
          className="h-12 md:basis-[30%] rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
        />

        {/*
        <Select
          value={selectedCategory || ""} // Always a string
          onValueChange={(value) => {
            setSelectedCategory(value);
            onFilterChange({
              search: searchTerm,
              category: value,
              sort: sortOption,
            });
          }}
        >
          <SelectTrigger className="md:basis-1/5 rounded-lg shadow-sm">
            <SelectValue placeholder="Category">
              {selectedCategoryObj ? selectedCategoryObj.name : "Category"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {isLoading ? (
              <div className="flex flex-col gap-2 items-center px-2 py-6">
                <Loader2 className="size-4 animate-spin" />
                <Typography>Loading...</Typography>
              </div>
            ) : error || !categories ? (
              <div className="flex flex-col gap-2 items-center px-2 py-6 max-w-full">
                <ShieldAlert className="size-6" />
                <Typography>
                  Sorry, something went wrong while fetching categories
                </Typography>
              </div>
            ) : (
              Array.isArray(categories) && categories.map((category: any) => (
                <SelectItem key={category.slug} value={category.slug}>
                  {category.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="ml-2"
          onClick={() => refetch()}
          title="Refresh Categories"
        >
          <Loader2 className="size-4" />
        </Button>
        */}

        {/* RESTORE CATEGORY FILTER */}
        {/*
        <Select
          value={selectedCategory || ""}
          onValueChange={(value) => {
            setSelectedCategory(value);
            onFilterChange({
              search: searchTerm,
              category: value,
              sort: sortOption,
            });
          }}
        >
          <SelectTrigger className="md:basis-1/5 rounded-lg shadow-sm">
            <SelectValue placeholder="Category">
              {selectedCategoryObj ? selectedCategoryObj.name : "Category"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {isLoading ? (
              <div className="flex flex-col gap-2 items-center px-2 py-6">
                <Loader2 className="size-4 animate-spin" />
                <Typography>Loading...</Typography>
              </div>
            ) : error || !categories ? (
              <div className="flex flex-col gap-2 items-center px-2 py-6 max-w-full">
                <ShieldAlert className="size-6" />
                <Typography>
                  Sorry, something went wrong while fetching categories
                </Typography>
              </div>
            ) : (
              Array.isArray(categories) && categories.map((category: any) => (
                <SelectItem key={category.slug} value={category.slug}>
                  {category.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
        */}

        <Select
          value={sortOption} // ✅ Controlled
          onValueChange={setSortOption} // ✅ Update state
        >
          <SelectTrigger className="md:basis-1/5 rounded-lg shadow-sm">
            <SelectValue placeholder="Sort/Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low to High</SelectItem>
            <SelectItem value="high">High to Low</SelectItem>
            <SelectItem value="ratings">Ratings</SelectItem>
            <SelectItem value="stock">Stock</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex flex-wrap sm:flex-nowrap gap-4 md:basis-[30%]">
          <Button
            type="submit"
            size="lg"
            className="flex-grow rounded-lg shadow-sm transition-all hover:scale-105 hover:bg-blue-100 dark:hover:bg-blue-900"
          >
            Filter
          </Button>
          <Button
            type="button"
            onClick={handleReset} // ✅ Reset
            size="lg"
            variant="secondary"
            className="flex-grow rounded-lg shadow-sm transition-all hover:scale-105 hover:bg-gray-200 dark:hover:bg-gray-800"
          >
            Reset
          </Button>
        </div>
      </form>
    </Card>
  );
}
