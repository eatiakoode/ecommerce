import axiosInstance from "@/helpers/axiosInstance";

import { Product } from "@/types/product";
import { PaginationData, PaginationQueryProps } from "@/types/pagination";

export const fetchProducts = async ({
  page,
  perPage = 10,
}: PaginationQueryProps) => {
  await new Promise((resolve, reject) => setTimeout(resolve, 500));
  const { data } = await axiosInstance.get(
    `/products?_page=${page}&_per_page=${perPage}`
  );
  return data as PaginationData<Product>;
};

export const fetchProductBySlug = async (slug: string) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const { data } = await axiosInstance.get(`/products?slug=${slug}`);
  return Array.isArray(data) ? data[0] : null;
};

// Delete product by ID
export const deleteProduct = async (id: string) => {
  await axiosInstance.delete(`/products/${id}`);
};

// Update product by ID
export const updateProduct = async (id: string, updatedData: Partial<Product>) => {
  await axiosInstance.put(`/products/${id}`, updatedData);
};
