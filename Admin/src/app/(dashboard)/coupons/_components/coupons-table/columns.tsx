import Image from "next/image";
import { PenSquare, Trash2 } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import Typography from "@/components/ui/typography";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { CouponBadgeVariants } from "@/constants/badge";
import { SkeletonColumn } from "@/types/skeleton";
import { Coupon, CouponStatus } from "@/types/coupon";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { useDeleteCoupon, useUpdateCoupon } from "@/hooks/useCoupons";
import { toast } from "sonner";

export function getCouponColumns(queryClient, updateCouponMutation): ColumnDef<Coupon>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
    },
    {
      header: "campaign name",
      cell: ({ row }) => (
        <Typography className="capitalize block truncate">
          {row.original.title || row.original.name}
        </Typography>
      ),
    },
    {
      header: "code",
      cell: ({ row }) => (
        <Typography className="uppercase">{row.original.couponCode || row.original.code}</Typography>
      ),
    },
    {
      header: "discount",
      cell: ({ row }) => {
        const discount = row.original.discount;
        let percent = discount;
        if (discount > 100) {
          percent = discount / 100;
        }
        return `${percent}%`;
      },
    },
    {
      header: "start date",
      cell: ({ row }) => {
        const value = row.original.startTime || row.original.startDate;
        if (!value) return "-";
        const date = new Date(value);
        return isNaN(date.getTime()) ? "-" : format(date, "PP");
      },
    },
    {
      header: "end date",
      cell: ({ row }) => {
        const value = row.original.expiry;
        if (!value) return "-";
        const date = new Date(value);
        return isNaN(date.getTime()) ? "-" : format(date, "PP");
      },
    },
    {
      header: "status",
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Badge
            variant={status === "active" ? CouponBadgeVariants["active"] : CouponBadgeVariants["expired"]}
            className="flex-shrink-0 text-xs capitalize"
          >
            {status}
          </Badge>
        );
      },
    },
    {
      header: "actions",
      cell: ({ row }) => {
        const couponId = row.original._id;
        const router = useRouter();
        const deleteCouponMutation = useDeleteCoupon();
        const handleDelete = () => {
          if (window.confirm("Are you sure you want to delete this coupon?")) {
            deleteCouponMutation.mutate(couponId, {
              onSuccess: () => toast.success("Coupon deleted!"),
              onError: (err) => toast.error(err?.response?.data?.message || "Delete failed"),
            });
          }
        };
        return (
          <div className="flex gap-2">
            <button
              className="text-blue-600 hover:underline"
              onClick={() => router.push(`/coupons/edit/${couponId}`)}
            >
              Edit
            </button>
            <button
              className="text-red-600 hover:underline"
              onClick={handleDelete}
              disabled={deleteCouponMutation.isPending}
            >
              {deleteCouponMutation.isPending ? "Deleting..." : "Delete"}
            </button>
          </div>
        );
      },
    },
  ];
}

export const skeletonColumns: SkeletonColumn[] = [
  {
    header: <Checkbox disabled checked={false} />,
    cell: <Skeleton className="size-4 rounded-sm" />,
  },
  {
    header: "campaign name",
    cell: (
      <div className="flex gap-2 items-center">
        <Skeleton className="size-8 rounded-full" />

        <Skeleton className="w-28 h-8" />
      </div>
    ),
  },
  {
    header: "code",
    cell: <Skeleton className="w-20 h-8" />,
  },
  {
    header: "discount",
    cell: <Skeleton className="w-20 h-8" />,
  },
  {
    header: "published",
    cell: <Skeleton className="w-16 h-10" />,
  },
  {
    header: "start date",
    cell: <Skeleton className="w-20 h-8" />,
  },
  {
    header: "end date",
    cell: <Skeleton className="w-20 h-8" />,
  },
  {
    header: "status",
    cell: <Skeleton className="w-20 h-10" />,
  },
  {
    header: "actions",
    cell: <Skeleton className="w-20 h-8" />,
  },
];
