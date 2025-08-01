import Filters from "./filters";
import Actions from "./actions";
import React from "react";
import { useMemo, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { toast } from "sonner";
import { deleteFaq } from "@/api/faq";

interface FaqsTableProps {
  faqs: any[];
  isLoading: boolean;
  filter: string;
  setFilter: (val: string) => void;
  typeFilter: string;
  setTypeFilter: (val: string) => void;
}

export default function FaqsTable({
  faqs,
  isLoading,
  filter,
  setFilter,
  typeFilter,
  setTypeFilter,
}: FaqsTableProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  const router = useRouter();

  // Debounce filter input
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const handleFilterChange = useCallback((val: string) => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => setFilter(val), 300);
  }, [setFilter]);

  // Memoize Actions and Filters
  const MemoizedActions = React.memo(Actions);
  const MemoizedFilters = React.memo(Filters);

  const toggleGroup = (slug: string) => {
    setExpandedGroups(prev => 
      prev.includes(slug) 
        ? prev.filter(s => s !== slug)
        : [...prev, slug]
    );
  };

  const getAllFaqIds = () => {
    return faqs.flatMap(group => group.faqs.map((faq: any) => faq._id));
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(getAllFaqIds());
    } else {
      setSelectedIds([]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Card 1: Action Buttons */}
      <div className="bg-white dark:bg-[#181A20] rounded-2xl shadow-lg p-6 flex flex-col md:flex-row md:items-center md:justify-end gap-4">
        <div className="flex gap-2 items-center">
          <button
            disabled={selectedIds.length === 0}
            onClick={async () => {
              if (!window.confirm("Are you sure you want to delete the selected FAQs?")) return;
              try {
                await Promise.all(selectedIds.map(id => deleteFaq(id)));
                toast.success("Selected FAQs deleted");
                setSelectedIds([]);
                router.refresh();
              } catch {
                toast.error("Failed to delete selected FAQs");
              }
            }}
            className={`px-4 py-2 rounded font-medium flex items-center gap-2 border border-gray-200 dark:border-gray-700 ${selectedIds.length === 0 ? 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500 cursor-not-allowed' : 'bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900 dark:hover:bg-red-800 dark:text-red-300'}`}
          >
            Delete
          </button>
          <button
            onClick={() => router.push("/faq/add")}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold shadow flex items-center gap-2"
          >
            + Add FAQ
          </button>
        </div>
      </div>

      {/* Card 2: Filter Bar */}
      <div className="bg-white dark:bg-[#181A20] rounded-2xl shadow-lg p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <MemoizedFilters
          filter={filter}
          setFilter={handleFilterChange}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
        />
      </div>

      {/* Card 3: Table */}
      <div className="bg-white dark:bg-[#181A20] rounded-2xl shadow-lg p-6">
        {isLoading ? (
          <div className="grid gap-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full bg-gray-100 dark:bg-gray-800" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white dark:bg-[#181A20] border border-gray-200 dark:border-gray-700 rounded shadow-sm">
              <thead>
                <tr className="bg-gray-100 dark:bg-[#23242B] text-left text-gray-700 dark:text-gray-200">
                  <th className="p-3 border-b border-gray-200 dark:border-gray-700">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === getAllFaqIds().length && getAllFaqIds().length > 0}
                      onChange={e => handleSelectAll(e.target.checked)}
                    />
                  </th>
                  <th className="p-3 border-b border-gray-200 dark:border-gray-700">Category</th>
                  <th className="p-3 border-b border-gray-200 dark:border-gray-700">Questions</th>
                  <th className="p-3 border-b border-gray-200 dark:border-gray-700">Type</th>
                  <th className="p-3 border-b border-gray-200 dark:border-gray-700 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {faqs.map((group) => (
                  <React.Fragment key={group.slug}>
                    {/* Group Header Row */}
                    <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#23242B] bg-gray-50 dark:bg-[#1F2027]">
                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={group.faqs.every((faq: any) => selectedIds.includes(faq._id))}
                          onChange={e => {
                            const faqIds = group.faqs.map((faq: any) => faq._id);
                            if (e.target.checked) {
                              setSelectedIds(prev => [...prev, ...faqIds.filter(id => !prev.includes(id))]);
                            } else {
                              setSelectedIds(prev => prev.filter(id => !faqIds.includes(id)));
                            }
                          }}
                        />
                      </td>
                      <td className="p-3 font-semibold text-gray-900 dark:text-gray-100">
                        <button
                          onClick={() => toggleGroup(group.slug)}
                          className="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400"
                        >
                          <span className={`transform transition-transform ${expandedGroups.includes(group.slug) ? 'rotate-90' : ''}`}>
                            ▶
                          </span>
                          {group.title}
                        </button>
                      </td>
                      <td className="p-3 text-sm text-gray-500 dark:text-gray-400">
                        {group.faqs.length} question{group.faqs.length !== 1 ? 's' : ''}
                      </td>
                      <td className="p-3 text-sm text-gray-500 dark:text-gray-400">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded text-xs">
                          {group.title}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => router.push(`/faq/add?type=${group.type}`)}
                          className="px-3 py-1 bg-green-100 hover:bg-green-200 text-green-700 dark:bg-green-900 dark:hover:bg-green-800 dark:text-green-300 rounded text-xs"
                        >
                          + Add Question
                        </button>
                      </td>
                    </tr>
                    
                    {/* Individual FAQ Rows (when expanded) */}
                    {expandedGroups.includes(group.slug) && group.faqs.map((faq: any) => (
                      <tr key={faq._id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#23242B] bg-gray-25 dark:bg-[#1A1B22]">
                        <td className="p-3 pl-8">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(faq._id)}
                            onChange={e => {
                              if (e.target.checked) {
                                setSelectedIds(prev => [...prev, faq._id]);
                              } else {
                                setSelectedIds(prev => prev.filter(id => id !== faq._id));
                              }
                            }}
                          />
                        </td>
                        <td className="p-3 pl-8 font-medium text-gray-900 dark:text-gray-100">
                          {faq.title || ""}
                        </td>
                        <td className="p-3 pl-8 text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                          {faq.description}
                        </td>
                        <td className="p-3 pl-8 text-sm text-gray-500 dark:text-gray-400">
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 rounded text-xs">
                            Question
                          </span>
                        </td>
                        <td className="p-3 pl-8 text-center">
                          <MemoizedActions faq={faq} onRefresh={() => {}} />
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 