"use client";

import { useState, createContext, useContext } from "react";

import PageTitle from "@/components/shared/PageTitle";
import CategoryActions from "./_components/CategoryActions";
import CategoryFilters from "./_components/CategoryFilters";
import AllCategories from "./_components/categories-table";

// Context for sharing selected IDs
type CategoryContextType = {
  selectedIds: string[];
  setSelectedIds: (ids: string[]) => void;
};

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const useCategoryContext = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error("useCategoryContext must be used within CategoryProvider");
  }
  return context;
};

export default function CategoriesPage() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const handleFilter = (value: string) => {
    setSearch(value);
    setPage(1);
  };
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <CategoryContext.Provider value={{ selectedIds, setSelectedIds }}>
      <section>
        <PageTitle>Categories</PageTitle>

        <CategoryActions />
        <CategoryFilters
          search={search}
          setSearch={setSearch}
          onFilter={handleFilter}
        />
        <AllCategories
          search={search}
          page={page}
          onPageChange={handlePageChange}
        />
      </section>
    </CategoryContext.Provider>
  );
}
