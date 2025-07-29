import api from "@/helpers/axiosInstance";

// TODO: Updated to match actual backend routes
export const getProducts = () => api.get("/product");
export const getProduct = (id: string) => api.get(`/product/${id}`);
export const createProduct = (data: any) => api.post("/product", data);
export const updateProduct = (id: string, data: any) => api.put(`/product/${id}`, data);
export const deleteProduct = (id: string) => api.delete(`/product/${id}`);

// Import/Export functionality
export const exportProducts = () => api.get("/product/export");

export const importProducts = (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  return api.post("/product/import", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getProductBySlug = (slug: string) => api.get(`/product/slug/${slug}`); 