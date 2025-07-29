"use client";
import { useMemo, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import FaqsTable from "./_components/faqs-table";
import { getFaqs } from "@/api/faq";
import { toast } from "sonner";

export default function FaqsPage() {
  const [filter, setFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const {
    data: faqsRaw = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["faqs"],
    queryFn: getFaqs,
  });

  // Always use an array for faqs
  const faqs = Array.isArray(faqsRaw) ? faqsRaw : faqsRaw?.data || [];

  useEffect(() => {
    if (isError) {
      toast.error("Failed to load FAQs");
    }
  }, [isError]);

  const filteredFaqs = useMemo(() => {
    return faqs.filter((f: any) => {
      const search = filter.toLowerCase();
      const titleOrDescMatch = (f.title || "").toLowerCase().includes(search) || (f.description || "").toLowerCase().includes(search);
      const typeMatch =
        typeFilter === "all" ||
        (f.type && f.type === typeFilter);
      return titleOrDescMatch && typeMatch;
    });
  }, [faqs, filter, typeFilter]);

  return (
    <FaqsTable
      faqs={filteredFaqs}
      isLoading={isLoading}
      filter={filter}
      setFilter={setFilter}
      typeFilter={typeFilter}
      setTypeFilter={setTypeFilter}
    />
  );
} 