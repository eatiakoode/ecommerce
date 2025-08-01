import { ZoomIn, Trash2 } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Typography from "@/components/ui/typography";
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

import { Enquiry } from "@/types/enquiry";
import { SkeletonColumn } from "@/types/skeleton";
import { useDeleteEnquiry } from "@/hooks/useEnquiries";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Delete Enquiry Component
const DeleteEnquiryButton = ({ enquiryId }: { enquiryId: string }) => {
  const deleteEnquiryMutation = useDeleteEnquiry();

  const handleDelete = async () => {
    try {
      const response = await deleteEnquiryMutation.mutateAsync(enquiryId);
      console.log("Delete response:", response);
      toast.success("✅ Enquiry deleted successfully!");
    } catch (error: any) {
      console.error("Delete failed", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to delete enquiry";
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
              disabled={deleteEnquiryMutation.isPending}
            >
              <Trash2 className="size-5" />
            </Button>
          </AlertDialogTrigger>
        </TooltipTrigger>

        <TooltipContent>
          <p>Delete Enquiry</p>
        </TooltipContent>
      </Tooltip>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete
            this enquiry and remove their data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete}
            disabled={deleteEnquiryMutation.isPending}
            className="bg-red-600 hover:bg-red-700"
          >
            {deleteEnquiryMutation.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

// View Enquiry Component
const ViewEnquiryButton = ({ enquiryId }: { enquiryId: string }) => {
  const router = useRouter();
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-foreground"
          onClick={() => router.push(`/enquiries/${enquiryId}`)}
        >
          <ZoomIn className="size-5" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>View Details</p>
      </TooltipContent>
    </Tooltip>
  );
};

export const columns: ColumnDef<Enquiry>[] = [
  {
    header: "id",
    cell: ({ row }) => (
      <Typography className="uppercase">
        {row.original._id.slice(-4)}
      </Typography>
    ),
  },
  {
    header: "name",
    cell: ({ row }) => (
      <Typography className="font-medium">
        {row.original.name}
      </Typography>
    ),
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
    header: "message",
    cell: ({ row }) => (
      <Typography className="block max-w-52 xl:max-w-60 truncate">
        {row.original.comment}
      </Typography>
    ),
  },
  {
    header: "date",
    cell: ({ row }) => {
      if (!row.original.createdAt) {
        return "N/A";
      }
      try {
        const date = new Date(row.original.createdAt);
        if (isNaN(date.getTime())) {
          return "Invalid Date";
        }
        return format(date, "PP");
      } catch (error) {
        return "Invalid Date";
      }
    },
  },
  {
    header: "status",
    cell: ({ row }) => (
      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
        row.original.status === "Submitted" 
          ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
          : row.original.status === "Contacted"
          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
          : row.original.status === "In Progress"
          ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
          : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      }`}>
        {row.original.status}
      </div>
    ),
  },
  {
    header: "actions",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-1">
          <ViewEnquiryButton enquiryId={row.original._id} />
          <DeleteEnquiryButton enquiryId={row.original._id} />
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
    header: "name",
    cell: <Skeleton className="w-24 h-8" />,
  },
  {
    header: "email",
    cell: <Skeleton className="w-32 h-8" />,
  },
  {
    header: "message",
    cell: <Skeleton className="w-32 h-8" />,
  },
  {
    header: "date",
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