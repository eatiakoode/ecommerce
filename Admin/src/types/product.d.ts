import { Category } from "./category";

export type ProductStatus = "selling" | "out-of-stock";

type Variant = {
  _id: string;
  name: string;
  slug: string;
  mrp: number;
  salePrice: number;
  images: string[];
  status: Status;
  stock: number;
  sku: string;
};

export type Product = {
  _id: string;
  name: string;
  description: string;
  categories: Category[];
  mrp: number;
  salePrice: number;
  stock: number;
  sales: number;
  sku: string;
  status: ProductStatus;
  images: string[];
  published: boolean;
  slug: string;
  createdAt: string;
  updatedAt: string;
  variants: Variant[];
};
