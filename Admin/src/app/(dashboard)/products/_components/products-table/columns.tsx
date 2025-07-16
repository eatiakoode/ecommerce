import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import Typography from "@/components/ui/typography";
import { formatAmount } from "@/helpers/formatAmount";
import { ProductBadgeVariants } from "@/constants/badge";
import { PenSquare, Trash2, ZoomIn } from "lucide-react";
import Link from "next/link";
import ProductImage from "@/components/shared/ProductImage";
import { useDeleteProduct } from "@/hooks/useProducts";
import { toast } from "sonner";
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

// Define the actual Product type based on your backend
type Product = {
  _id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  quantity: number;
  sold: number;
  images: Array<{ public_id: string; url: string }>;
  color: string[];
  tags: string;
  ratings: Array<{
    star: number;
    comment: string;
    postedby: string;
  }>;
  totalrating: number;
  createdAt: string;
  updatedAt: string;
};

type SkeletonColumn = {
  header: React.ReactNode;
  cell: React.ReactNode;
};

const handleSwitchChange = () => {};

// Delete Product Component
const DeleteProductButton = ({ productId }: { productId: string }) => {
  const deleteProductMutation = useDeleteProduct();

  const handleDelete = async () => {
    try {
      const response = await deleteProductMutation.mutateAsync(productId);
      console.log("Delete response:", response);
      toast.success("✅ Product deleted successfully!");
    } catch (error: any) {
      console.error("Delete failed", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to delete product";
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
              disabled={deleteProductMutation.isPending}
            >
              <Trash2 className="size-5" />
            </Button>
          </AlertDialogTrigger>
        </TooltipTrigger>

        <TooltipContent>
          <p>Delete Product</p>
        </TooltipContent>
      </Tooltip>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete
            this product and remove it from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete}
            disabled={deleteProductMutation.isPending}
            className="bg-red-600 hover:bg-red-700"
          >
            {deleteProductMutation.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export const columns: ColumnDef<Product>[] = [
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
    header: "product name",
    cell: ({ row }) => {
      // Safely extract image URL from different possible structures
      const imageUrl = row.original.images?.[0]?.url || 
                      row.original.images?.[0] || 
                      null;

      return (
        <div className="flex gap-2 items-center">
          {/*
          <ProductImage
            src={imageUrl}
            alt={row.original.title}
          />
          */}

          <Typography className="capitalize block truncate">
            {row.original.title}
          </Typography>
        </div>
      );
    },
  },
  {
    header: "category",
    cell: ({ row }) => (
      <Typography className="block max-w-52 truncate">
        {row.original.category}
      </Typography>
    ),
  },
  {
    header: "price",
    cell: ({ row }) => {
      return formatAmount(row.original.price);
    },
  },
  {
    header: "brand",
    cell: ({ row }) => (
      <Typography className="block max-w-52 truncate">
        {row.original.brand}
      </Typography>
    ),
  },
  {
    header: "stock",
    cell: ({ row }) => row.original.quantity,
  },
  {
    header: "sold",
    cell: ({ row }) => row.original.sold,
  },
  {
    header: "rating",
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <span className="text-yellow-500">★</span>
        <span>{row.original.totalrating}</span>
      </div>
    ),
  },
  {
    header: "actions",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-foreground"
                asChild
                  >
                <Link href={`/products/edit/${row.original.slug}`}>
                    <PenSquare className="size-5" />
                </Link>
                  </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit Product</p>
              </TooltipContent>
            </Tooltip>

          <DeleteProductButton productId={row.original._id} />
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
    header: "product name",
    cell: (
      <div className="flex gap-2 items-center">
        <Skeleton className="size-8 rounded-full" />

        <Skeleton className="w-28 h-8" />
      </div>
    ),
  },
  {
    header: "category",
    cell: <Skeleton className="w-32 h-8" />,
  },
  {
    header: "price",
    cell: <Skeleton className="w-20 h-8" />,
  },
  {
    header: "brand",
    cell: <Skeleton className="w-20 h-8" />,
  },
  {
    header: "stock",
    cell: <Skeleton className="w-20 h-8" />,
  },
  {
    header: "sold",
    cell: <Skeleton className="w-20 h-8" />,
  },
  {
    header: "rating",
    cell: <Skeleton className="w-20 h-8" />,
  },
  {
    header: "view",
    cell: <Skeleton className="w-8 h-8" />,
  },
  {
    header: "actions",
    cell: <Skeleton className="w-20 h-8" />,
  },
];
