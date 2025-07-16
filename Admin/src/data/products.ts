// data/products.ts
import { PaginationData, PaginationQueryProps } from "@/types/pagination";
import { Product } from "@/types/product";

export const fetchProducts = async ({
  page = 1,
  perPage = 10,
  search = "",
  category = "",
  sort = "",
}: PaginationQueryProps): Promise<PaginationData<Product>> => {
  const params = new URLSearchParams({
    page: String(page),
    perPage: String(perPage),
    search,
    category,
    sort,
  });

  const response = await fetch(`http://localhost:5000/api/product?${params}`);

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return response.json();
};
