import { OrderMethod, OrderStatus } from "@/types/order";

export const ORDER_STATUSES: OrderStatus[] = [
  "Ordered",
  "Pending",
  "Processing",
  "Delivered",
  "Cancelled",
  "Failed"
];

export const ORDER_METHODS: OrderMethod[] = ["card", "cash", "credit"];
