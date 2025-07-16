"use client";

import { useSearchParams } from "next/navigation";
import { columns, skeletonColumns } from "./columns";
import ProductsTable from "./AllProducts";
import TableSkeleton from "@/components/shared/TableSkeleton";
import TableError from "@/components/shared/TableError";
import { Product } from "@/types/product";

type Props = {
  perPage?: number;
  products: Product[];
};

export default function AllProducts({ perPage = 10, products }: Props) {
  const productsPage = useSearchParams().get("page");
  const page = Math.trunc(Number(productsPage)) || 1;

  // Create a simple pagination structure since your backend doesn't return pagination
  const pagination = {
    current: page,
    pages: Math.ceil(products.length / perPage),
    total: products.length,
  };

  return (
    <ProductsTable
      columns={columns}
      data={products}
      pagination={pagination}
    />
  );
}
