import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as categoryApi from "@/api/category";

// Get all categories
export const useCategories = () =>
  useQuery({
    queryKey: ["categories"],
    queryFn: async () => (await categoryApi.getCategories()).data,
    staleTime: 0, // Always fetch fresh data
    cacheTime: 0, // Do not cache
  });

// Get single category
export const useCategory = (id: string) =>
  useQuery({
    queryKey: ["category", id],
    queryFn: async () => (await categoryApi.getCategory(id)).data,
    enabled: !!id,
  });

// Get paginated categories with search
export const usePaginatedCategories = (params: { 
  page?: number; 
  limit?: number; 
  search?: string; 
} = {}) =>
  useQuery({
    queryKey: ["categories", "paginated", params],
    queryFn: async () => (await categoryApi.getPaginatedCategories(params)).data,
  });

// Create category
export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: categoryApi.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

// Update category
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      categoryApi.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

// Delete category
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => categoryApi.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

// Export categories
export const useExportCategories = () => {
  return useMutation({
    mutationFn: categoryApi.exportCategories,
  });
};

// Import categories
export const useImportCategories = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => categoryApi.importCategories(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

// Bulk delete categories
export const useBulkDeleteCategories = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) => categoryApi.bulkDeleteCategories(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

// Bulk edit categories
export const useBulkEditCategories = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updates: any[]) => categoryApi.bulkEditCategories(updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}; 