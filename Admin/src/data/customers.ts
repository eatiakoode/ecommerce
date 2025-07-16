import axiosInstance from "@/helpers/axiosInstance";
import { Customer } from "@/types/customer";
import { PaginationData, PaginationQueryProps } from "@/types/pagination";

// ✅ Extended query props to include optional 'search'
type ExtendedQueryProps = PaginationQueryProps & {
  search?: string;
};

export const fetchCustomers = async ({
  page,
  perPage = 10,
  search = "", // ✅ Added search with default empty string
}: ExtendedQueryProps) => {
  await new Promise((resolve, reject) => setTimeout(resolve, 500));

  // ✅ Added search to the query parameters
  const { data } = await axiosInstance.get(
    `/customers?_page=${page}&_per_page=${perPage}&_search=${search}`
  );

  return data as PaginationData<Customer>;
};
