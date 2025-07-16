import Link from "next/link";
import { ZoomIn, PenSquare, Trash2 } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
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

import { Customer } from "@/types/customer";
import { SkeletonColumn } from "@/types/skeleton";
import { useDeleteCustomer } from "@/hooks/useCustomers";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Delete Customer Component
const DeleteCustomerButton = ({ customerId }: { customerId: string }) => {
  const deleteCustomerMutation = useDeleteCustomer();

  const handleDelete = async () => {
    try {
      const response = await deleteCustomerMutation.mutateAsync(customerId);
      console.log("Delete response:", response);
      toast.success("✅ Customer deleted successfully!");
    } catch (error: any) {
      console.error("Delete failed", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to delete customer";
      toast.error(`❌ ${errorMessage}`);
    }
  };

  return (
    <AlertDialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-foreground"
              disabled={deleteCustomerMutation.isPending}
            >
              <Trash2 className="size-5" />
            </Button>
          </AlertDialogTrigger>
        </TooltipTrigger>

        <TooltipContent>
          <p>Delete Customer</p>
        </TooltipContent>
      </Tooltip>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete
            this customer and remove their data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete}
            disabled={deleteCustomerMutation.isPending}
            className="bg-red-600 hover:bg-red-700"
          >
            {deleteCustomerMutation.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export const columns: ColumnDef<Customer>[] = [
  {
    header: "id",
    cell: ({ row }) => (
      <Typography className="uppercase">
        {row.original._id.slice(-4)}
      </Typography>
    ),
  },
  {
    header: "joining date",
    cell: ({ row }) => format(new Date(row.original.createdAt), "PP"),
  },
  {
    header: "name",
    cell: ({ row }) => `${row.original.firstname} ${row.original.lastname}`,
  },
  {
    header: "email",
    cell: ({ row }) => (
      <Typography className="block max-w-52 xl:max-w-60 truncate">
        {row.original.email}
      </Typography>
    ),
  },
  {
    header: "phone",
    cell: ({ row }) => row.original.mobile || "N/A",
  },
  {
    header: "status",
    cell: ({ row }) => (
      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
        row.original.isBlocked 
          ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" 
          : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      }`}>
        {row.original.isBlocked ? "Blocked" : "Active"}
      </div>
    ),
  },
  {
    header: "actions",
    cell: ({ row }) => {
      const customerId = row.original._id;
      const router = useRouter();
      return (
        <div className="flex items-center gap-1">
          <Button
            size="icon"
            asChild
            variant="ghost"
            className="text-foreground"
          >
            {/* <Link href={`/customer-orders/${row.original._id}`}>
              <ZoomIn className="size-5" />
            </Link> */}
          </Button>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-foreground"
                onClick={() => router.push(`/customers/edit/${customerId}`)}
              >
                <PenSquare className="size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit Profile</p>
            </TooltipContent>
          </Tooltip>

          <DeleteCustomerButton customerId={row.original._id} />
        </div>
      );
    },
  },
];

export const skeletonColumns: SkeletonColumn[] = [
  {
    header: "id",
    cell: <Skeleton className="w-10 h-8" />,
  },
  {
    header: "joining date",
    cell: <Skeleton className="w-20 h-8" />,
  },
  {
    header: "name",
    cell: <Skeleton className="w-24 h-8" />,
  },
  {
    header: "email",
    cell: <Skeleton className="w-32 h-8" />,
  },
  {
    header: "phone",
    cell: <Skeleton className="w-20 h-8" />,
  },
  {
    header: "status",
    cell: <Skeleton className="w-16 h-6" />,
  },
  {
    header: "actions",
    cell: <Skeleton className="w-24 h-8" />,
  },
];
