import api from "@/helpers/axiosInstance";

// Basic CRUD operations
export const getCategories = () => api.get("/category");
export const getCategory = (id: string) => api.get(`/category/${id}`);
export const updateCategory = (id: string, data: any, config?: any) => api.put(`/category/${id}`, data, config);
export const deleteCategory = (id: string) => api.delete(`/category/${id}`);
export const getCategoryById = getCategory;

// ✅ Fixed: Properly handle FormData with headers
export const createCategory = (data: FormData) => 
  api.post("/category", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

// Import/Export operations
export const exportCategories = () => api.get("/category/export", { responseType: "blob" });
export const importCategories = (formData: FormData) => api.post("/category/import", formData, {
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

// Bulk operations
export const bulkDeleteCategories = (ids: string[]) => api.post("/category/bulk-delete", { ids });
export const bulkEditCategories = (updates: any[]) => api.post("/category/bulk-edit", { updates });

// Paginated listing with search
export const getPaginatedCategories = (params: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  const query = new URLSearchParams();
  if (params.page) query.append("page", params.page.toString());
  if (params.limit) query.append("limit", params.limit.toString());
  if (params.search) query.append("search", params.search);

  return api.get(`/category/paginated?${query.toString()}`);
};

export const addCategory = createCategory;
