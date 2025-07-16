import Image from "next/image";
import { PenSquare, Trash2 } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import Typography from "@/components/ui/typography";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
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

import { StaffBadgeVariants } from "@/constants/badge";
import { Staff } from "@/types/staff";
import { SkeletonColumn } from "@/types/skeleton";
import { format } from "date-fns";
import { useUpdateStaff, useDeleteStaff } from "@/hooks/useStaff";
import { useQueryClient } from "@tanstack/react-query";

const handleSwitchChange = () => { };

export const columns: ColumnDef<Staff>[] = [
  {
    header: "name",
    cell: ({ row }) => (
      <Typography className="capitalize block truncate">
        {row.original.name}
      </Typography>
    ),
  },
  {
    header: "email",
    cell: ({ row }) => (
      <Typography className="block max-w-52 truncate">
        {row.original.email}
      </Typography>
    ),
  },
  {
    header: "phone",
    cell: ({ row }) => row.original.phone,
  },
  {
    header: "joining date",
    cell: ({ row }) => format(row.original.createdAt, "PP"),
  },
  {
    header: "role",
    cell: ({ row }) => (
      <Typography className="capitalize font-medium">
        {row.original.role === "super-admin"
          ? "Super Admin"
          : row.original.role}
      </Typography>
    ),
  },
  {
    header: "status",
    cell: ({ row }) => {
      const status = row.original.status || "Active";
      const badgeClass = status === "Deactive"
        ? "bg-red-500 hover:bg-red-600 text-white"
        : "bg-green-500 hover:bg-green-600 text-white";
      return (
        <Badge
          className={`flex-shrink-0 text-xs capitalize ${badgeClass}`}
        >
          {status}
        </Badge>
      );
    },
  },
  {
    header: "actions",
    cell: ({ row }) => {
      const queryClient = useQueryClient();
      const deleteStaffMutation = useDeleteStaff();
      const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete this staff member?")) {
          deleteStaffMutation.mutate(row.original._id, {
            onSuccess: () => queryClient.invalidateQueries(["staff"]),
          });
        }
      };
      return (
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href={`/staff/edit/${row.original._id}`}>
                <Button variant="ghost" size="icon" className="text-foreground">
                  <PenSquare className="size-5" />
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit Profile</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-foreground"
                onClick={handleDelete}
                disabled={deleteStaffMutation.isPending}
              >
                <Trash2 className="size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete Profile</p>
            </TooltipContent>
          </Tooltip>
        </div>
      );
    },
  },
];

export const skeletonColumns: SkeletonColumn[] = [
  {
    header: "name",
    cell: (
      <div className="flex gap-2 items-center">
        <Skeleton className="size-8 rounded-full" />

        <Skeleton className="w-28 h-8" />
      </div>
    ),
  },
  {
    header: "email",
    cell: <Skeleton className="w-32 h-8" />,
  },
  {
    header: "phone",
    cell: <Skeleton className="w-20 h-10" />,
  },
  {
    header: "joining date",
    cell: <Skeleton className="w-20 h-8" />,
  },
  {
    header: "role",
    cell: <Skeleton className="w-20 h-8" />,
  },
  {
    header: "status",
    cell: <Skeleton className="w-24 h-8" />,
  },
  {
    header: "published",
    cell: <Skeleton className="w-16 h-10" />,
  },
  {
    header: "actions",
    cell: <Skeleton className="w-20 h-8" />,
  },
];
