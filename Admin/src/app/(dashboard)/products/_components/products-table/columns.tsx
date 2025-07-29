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
  category: {
    _id: string;
    name: string;
    slug: string;
  };
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
  // You should inject these maps from props/context or fetch them globally
  // Example: const categoryMap = { [id]: name, ... }, brandMap = { [id]: title, ... }
  // For now, fallback to showing the ID if not found
  {
    header: "category",
    cell: ({ row }) => {
      // Try to get the name from category object or fallback to ID
      const cat = row.original.category;
      if (cat && typeof cat === 'object' && (cat.name || cat.title)) {
        return <Typography className="block max-w-52 truncate">{cat.name || cat.title}</Typography>;
      }
      if (Array.isArray(row.original.categories) && row.original.categories.length > 0) {
        const c = row.original.categories[0];
        return <Typography className="block max-w-52 truncate">{c.name || c.title || c}</Typography>;
      }
      return <Typography className="block max-w-52 truncate">{cat || '-'}</Typography>;
    },
  },
  {
    header: "MRP",
    cell: ({ row }) => {
      const mrp = Number(row.original.mrp || row.original.MRP);
      return isNaN(mrp) ? '-' : `₹${mrp.toLocaleString()}`;
    },
  },
  {
    header: "sale price",
    cell: ({ row }) => {
      const price = Number(row.original.salePrice || row.original.sellingPrice);
      return isNaN(price) ? '-' : `₹${price.toLocaleString()}`;
    },
  },
  {
    header: "brand",
    cell: ({ row }) => {
      const brand = row.original.brand;
      if (brand && typeof brand === 'object' && brand.title) {
        return <Typography className="block max-w-52 truncate">{brand.title}</Typography>;
      }
      if (brand && typeof brand === 'object' && brand.name) {
        return <Typography className="block max-w-52 truncate">{brand.name}</Typography>;
      }
      return <Typography className="block max-w-52 truncate">-</Typography>;
    },
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
