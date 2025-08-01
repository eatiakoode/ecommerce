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

  // Group FAQs by slug
  const groupedFaqs = useMemo(() => {
    const groups: { [key: string]: any[] } = {};
    
    faqs.forEach((faq: any) => {
      const slug = faq.slug || faq.type;
      if (!groups[slug]) {
        groups[slug] = [];
      }
      groups[slug].push(faq);
    });
    
    return Object.entries(groups).map(([slug, faqs]) => ({
      slug,
      type: faqs[0]?.type || slug,
      faqs,
      title: slug === "how-to-buy" ? "How to Buy" : 
             slug === "exchange-and-return" ? "Exchange and Return" : 
             slug === "refund-question" ? "Refund Question" : slug
    }));
  }, [faqs]);

  const filteredFaqs = useMemo(() => {
    return groupedFaqs.filter((group) => {
      const search = filter.toLowerCase();
      const titleMatch = group.title.toLowerCase().includes(search);
      const questionsMatch = group.faqs.some((f: any) => 
        (f.title || "").toLowerCase().includes(search) || 
        (f.description || "").toLowerCase().includes(search)
      );
      const typeMatch = typeFilter === "all" || group.type === typeFilter;
      return (titleMatch || questionsMatch) && typeMatch;
    });
  }, [groupedFaqs, filter, typeFilter]);

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