import Link from "next/link";
import { Printer, ZoomIn } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatAmount } from "@/helpers/formatAmount";

import { ORDER_STATUSES } from "@/constants/orders";
import { OrderBadgeVariants } from "@/constants/badge";
import { Order, OrderStatus } from "@/types/order";
import { SkeletonColumn } from "@/types/skeleton";
import { useUpdateOrderStatus } from "@/hooks/useOrders";
import { useState } from "react";

const changeStatus = (value: OrderStatus, invoiceNo: string) => {};
const printInvoice = (invoiceNo: string) => {};

export const columns: ColumnDef<Order>[] = [
  {
    header: "invoice no",
    cell: ({ row }) => row.original.invoiceNo,
  },
  {
    header: "order time",
    cell: ({ row }) => {
      const date = row.original.createdAt || row.original.orderTime;
      if (!date) return "N/A";
      try {
        return `${format(new Date(date), "PP")} ${format(new Date(date), "p")}`;
      } catch {
        return "Invalid date";
      }
    },
  },
  {
    header: "customer name",
    cell: ({ row }) => (
      <span className="block max-w-52 truncate">
        {row.original.customerName}
      </span>
    ),
  },
  {
    header: "method",
    cell: ({ row }) => (
      <span className="capitalize">{row.original.method}</span>
    ),
  },
  {
    header: "amount",
    cell: ({ row }) => formatAmount(row.original.amount),
  },
  {
    header: "status",
    cell: ({ row }) => {
      const status = row.original.status;

      return (
        <Badge
          variant={OrderBadgeVariants[status]}
          className="flex-shrink-0 text-xs capitalize"
        >
          {status}
        </Badge>
      );
    },
  },
  {
    header: "action",
    cell: ({ row }) => {
      // Use local state to show optimistic update
      const [localStatus, setLocalStatus] = useState(row.original.status);
      const { mutate: updateStatus, isLoading } = useUpdateOrderStatus();
      const id = row.original.id;
      return (
        <Select
          value={localStatus}
          onValueChange={(value: OrderStatus) => {
            setLocalStatus(value);
            updateStatus({ id, status: value });
          }}
          disabled={isLoading}
        >
          <SelectTrigger className="capitalize">
            <SelectValue placeholder={localStatus} />
          </SelectTrigger>
          <SelectContent>
            {ORDER_STATUSES.map((badgeStatus) => (
              <SelectItem
                value={badgeStatus}
                key={badgeStatus}
                className="capitalize"
              >
                {badgeStatus}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    },
  },
  {
    header: "invoice",
    cell: ({ row }) => {
      const id = row.original.id;
      return (
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => window.open(`/orders/${id}/invoice?print=true`, '_blank')}
                className="text-foreground"
              >
                <Printer className="size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Print Invoice</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-foreground"
                onClick={() => window.open(`/orders/${id}/invoice`, '_blank')}
              >
                <ZoomIn className="size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>View Invoice</p>
            </TooltipContent>
          </Tooltip>
        </div>
      );
    },
  },
];

export const skeletonColumns: SkeletonColumn[] = [
  {
    header: "invoice no",
    cell: <Skeleton className="w-20 h-8" />,
  },
  {
    header: "order time",
    cell: <Skeleton className="w-32 h-8" />,
  },
  {
    header: "customer name",
    cell: <Skeleton className="w-32 h-8" />,
  },
  {
    header: "method",
    cell: <Skeleton className="w-14 h-8" />,
  },
  {
    header: "amount",
    cell: <Skeleton className="w-16 h-8" />,
  },
  {
    header: "status",
    cell: <Skeleton className="w-16 h-8" />,
  },
  {
    header: "action",
    cell: <Skeleton className="w-24 h-10" />,
  },
  {
    header: "invoice",
    cell: <Skeleton className="w-20 h-8" />,
  },
];
