import Image from "next/image";
import { PenSquare, Trash2 } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

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

import { SkeletonColumn } from "@/types/skeleton";
import { Category } from "@/types/category";
import { useDeleteCategory } from "@/hooks/useCategories";
import { useCategoryContext } from "../../page";
import { toast } from "sonner";

const handleSwitchChange = () => { };

export const columns: ColumnDef<Category>[] = [
  {
    id: "select",
    header: ({ table }) => {
      const { selectedIds, setSelectedIds } = useCategoryContext();
      const allSelected = table.getIsAllPageRowsSelected();
      const someSelected = table.getIsSomePageRowsSelected();

      return (
        <Checkbox
          checked={allSelected || (someSelected && "indeterminate")}
          onCheckedChange={(value) => {
            if (value) {
              const pageIds = table.getFilteredSelectedRowModel().rows.map(row => row.original._id);
              setSelectedIds([...selectedIds, ...pageIds]);
            } else {
              const pageIds = table.getFilteredSelectedRowModel().rows.map(row => row.original._id);
              setSelectedIds(selectedIds.filter(id => !pageIds.includes(id)));
            }
            table.toggleAllPageRowsSelected(!!value);
          }}
          aria-label="Select all"
        />
      );
    },
    cell: ({ row }) => {
      const { selectedIds, setSelectedIds } = useCategoryContext();
      const isSelected = selectedIds.includes(row.original._id);

      return (
        <Checkbox
          checked={isSelected}
          onCheckedChange={(value) => {
            if (value) {
              setSelectedIds([...selectedIds, row.original._id]);
            } else {
              setSelectedIds(selectedIds.filter(id => id !== row.original._id));
            }
            row.toggleSelected(!!value);
          }}
          aria-label="Select row"
        />
      );
    },
  },
  {
    header: "id",
    cell: ({ row }) => (
      <Typography className="uppercase">
        {row.original._id.slice(-6)}
      </Typography>
    ),
  },
  // {
  //   header: "icon",
  //   cell: ({ row }) => (
  //     <Image
  //       src={`/temp/notification-img.jpg`}
  //       alt={row.original.name}
  //       width={32}
  //       height={32}
  //       className="size-8 rounded-full"
  //     />
  //   ),
  // },
  {
    header: "name",
    cell: ({ row }) => row.original.name,
  },
  {
    header: "description",
    cell: ({ row }) => row.original.description || "No description",
  },
  {
    header: "status",
    cell: ({ row }) => (
      <div className="pl-5">
        <Switch
          checked={row.original.isActive}
          onCheckedChange={(value) => handleSwitchChange()}
        />
      </div>
    ),
  },
  {
    header: "actions",
    cell: ({ row }) => {
      const deleteMutation = useDeleteCategory();

      const handleDelete = async () => {
        try {
          await deleteMutation.mutateAsync(row.original._id);
          toast.success("Category deleted successfully!");
        } catch (error) {
          toast.error("Failed to delete category. Please try again.");
          console.error("Delete error:", error);
        }
      };

      return (
        <div className="flex items-center gap-1">
          {/* Edit Button */}
          <Link href={`/categories/edit/${row.original._id}`}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="text-foreground">
                  <PenSquare className="size-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit Category</p>
              </TooltipContent>
            </Tooltip>
          </Link>

          {/* Delete Button */}
          <AlertDialog>
            <Tooltip>
              <TooltipTrigger asChild>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-foreground"
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="size-5" />
                  </Button>
                </AlertDialogTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete Category</p>
              </TooltipContent>
            </Tooltip>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Category</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{row.original.name}"? 
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground"
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      );
    },
  },
];

export const skeletonColumns: SkeletonColumn[] = [
  {
    header: <Checkbox disabled checked={false} />,
    cell: <Skeleton className="size-4 rounded-sm" />,
  },
  {
    header: "id",
    cell: <Skeleton className="w-16 h-8" />,
  },
  {
    header: "icon",
    cell: <Skeleton className="w-8 h-8 rounded-full" />,
  },
  {
    header: "name",
    cell: <Skeleton className="w-20 h-8" />,
  },
  {
    header: "description",
    cell: <Skeleton className="w-32 h-8" />,
  },
  {
    header: "status",
    cell: <Skeleton className="w-16 h-10" />,
  },
  {
    header: "actions",
    cell: <Skeleton className="w-20 h-8" />,
  },
];
