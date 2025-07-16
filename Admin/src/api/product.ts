import api from "@/helpers/axiosInstance";

// TODO: Updated to match actual backend routes
export const getProducts = () => api.get("/product");
export const getProduct = (id: string) => api.get(`/product/${id}`);
export const createProduct = (data: any) => {
  const axios = require("axios");
  return axios.post("http://localhost:5000/api/product", data);
};
export const updateProduct = (id: string, data: any) => api.put(`/product/${id}`, data);
export const deleteProduct = (id: string) => {
  // Create a new axios instance without auth for this specific request
  const axios = require("axios");
  const url = `http://localhost:5000/api/product/${id}`;
  console.log("Deleting product with URL:", url);
  return axios.delete(url);
};

// Import/Export functionality
export const exportProducts = () => {
  const axios = require("axios");
  return axios.get("http://localhost:5000/api/product/export");
};

export const importProducts = (file: File) => {
  const axios = require("axios");
  const formData = new FormData();
  formData.append("file", file);
  return axios.post("http://localhost:5000/api/product/import", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getProductBySlug = (slug: string) => api.get(`/product/slug/${slug}`); 