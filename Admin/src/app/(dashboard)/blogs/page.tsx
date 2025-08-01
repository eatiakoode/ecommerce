"use client";
import { useMemo, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import BlogsTable from "./_components/blogs-table";
import { getBlogs } from "@/api/blog";
import { toast } from "sonner";

export default function BlogsPage() {
  const [filter, setFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const {
    data: blogsRaw = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["blogs"],
    queryFn: getBlogs,
  });

  // Always use an array for blogs
  const blogs = Array.isArray(blogsRaw) ? blogsRaw : blogsRaw?.data || [];

  useEffect(() => {
    if (isError) {
      toast.error("Failed to load blogs");
    }
  }, [isError]);

  const filteredBlogs = useMemo(() => {
    return blogs.filter((b: any) => {
      const search = filter.toLowerCase();
      const titleOrDescMatch = (b.title || "").toLowerCase().includes(search) || (b.description || "").toLowerCase().includes(search);
      const authorMatch = (b.author || "").toLowerCase().includes(search);
      const categoryMatch =
        categoryFilter === "all" ||
        (b.category && (
          b.category._id === categoryFilter || 
          b.category.title?.toLowerCase().includes(categoryFilter.toLowerCase())
        ));
      return (titleOrDescMatch || authorMatch) && categoryMatch;
    });
  }, [blogs, filter, categoryFilter]);

  return (
    <BlogsTable
      blogs={filteredBlogs}
      isLoading={isLoading}
      filter={filter}
      setFilter={setFilter}
      categoryFilter={categoryFilter}
      setCategoryFilter={setCategoryFilter}
    />
  );
} 