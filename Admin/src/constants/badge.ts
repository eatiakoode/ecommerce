import { OrderStatus } from "@/types/order";
import { ProductStatus } from "@/types/product";
import { CouponStatus } from "@/types/coupon";
import { StaffStatus } from "@/types/staff";

import { BadgeVariantProps } from "@/components/ui/badge";

export const OrderBadgeVariants: Record<OrderStatus, BadgeVariantProps> = {
  Ordered: "success",
  Pending: "success",
  Processing: "success",
  Delivered: "success",
  Cancelled: "destructive",
  Failed: "destructive",
};

export const ProductBadgeVariants: Record<ProductStatus, BadgeVariantProps> = {
  selling: "success",
  "out-of-stock": "destructive",
};

export const CouponBadgeVariants: Record<CouponStatus, BadgeVariantProps> = {
  active: "success",
  expired: "destructive",
};

export const StaffBadgeVariants: Record<StaffStatus, BadgeVariantProps> = {
  active: "success",
  inactive: "warning",
};
