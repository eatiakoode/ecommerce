import { ColumnDef } from "@tanstack/react-table";
import { PaginationProps } from "./pagination";

export interface DataTableProps<Data> {
  columns: ColumnDef<Data>[];
  data: Data[];
  pagination: PaginationProps;
//    pagination?: {
//     pages: number;
//     current: number;
//     perPage: number;
//     items: number;
//     first: number;
//     last: number;
//     next: number | null;
//     prev: number | null;
//   };
 }
