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

const handleSwitchChange = () => { };

export const columns: ColumnDef<Category>[] = [
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
    header: "id",
    cell: ({ row }) => (
      <Typography className="uppercase">
        {row.original._id.slice(-4)}
      </Typography>
    ),
  },
  {
    header: "icon",
    cell: ({ row }) => (
      <Image
        src={`/temp/notification-img.jpg`}
        alt={row.original.name}
        width={32}
        height={32}
        className="size-8 rounded-full"
      />
    ),
  },
  {
    header: "name",
    cell: ({ row }) => row.original.name,
  },
  {
    header: "description",
    cell: ({ row }) => row.original.description,
  },
  {
    header: "published",
    cell: ({ row }) => (
      <div className="pl-5">
        <Switch
          checked={row.original.published}
          onCheckedChange={(value) => handleSwitchChange()}
        />
      </div>
    ),
  },
  {
    header: "actions",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-1">
          {/* <Sheet> 
             <Tooltip>
              <TooltipTrigger asChild>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-foreground"
                  >
                    <PenSquare className="size-5" />
                  </Button>
                </SheetTrigger>
              </TooltipTrigger>

              <TooltipContent>
                <p>Edit Product</p>
              </TooltipContent>
            </Tooltip>

            <SheetContent>
              <SheetHeader>
                <SheetTitle>Edit profile</SheetTitle>
                <SheetDescription>
                  Make changes to your profile here. Click save when you&apos;re
                  done.
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value="Pedro Duarte"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-right">
                    Username
                  </Label>
                  <Input
                    id="username"
                    value="@peduarte"
                    className="col-span-3"
                  />
                </div>
              </div>
              <SheetFooter>
                <SheetClose asChild>
                  <Button type="submit">Save changes</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent> 
          </Sheet> */}

          <Sheet>
            {/* // ✅ [CHANGED] Replaced sheet edit with link to edit page */}
            {/* <Link href={`/categories/edit/${row.original._id}`}> */}
            <Link href={`/dashboard/categories/edit/${row.original._id}`}>

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

          </Sheet>

          {/* <AlertDialog>
            <Tooltip>
              <TooltipTrigger asChild>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-foreground"
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
                  your account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog> */}

              {/* // ✅ [CHANGED] Added delete functionality using API */}
            <AlertDialog>
              <Tooltip>
                <TooltipTrigger asChild>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-foreground"
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
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete this category.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={async () => {
                      try {
                        await fetch(`http://localhost:5000/api/category/${row.original._id}`, {
                          method: "DELETE",
                        });
                        // ✅ Optional: force refresh the page or call a data refetch
                        window.location.reload(); // Or use router.refresh() if using App Router
                      } catch (err) {
                        console.error("Delete failed", err);
                      }
                    }}
                  >
                    Delete
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
    header: "published",
    cell: <Skeleton className="w-16 h-10" />,
  },
  {
    header: "actions",
    cell: <Skeleton className="w-20 h-8" />,
  },
];
