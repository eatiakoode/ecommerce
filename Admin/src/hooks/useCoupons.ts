import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as couponsApi from "@/api/coupons";

export const useCoupons = () =>
  useQuery({
    queryKey: ["coupons"],
    queryFn: async () => (await couponsApi.getCoupons()).data,
  });

export const useCoupon = (id: string) =>
  useQuery({
    queryKey: ["coupon", id],
    queryFn: async () => (await couponsApi.getCoupon(id)).data,
    enabled: !!id,
  });

export const useCreateCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: couponsApi.createCoupon,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["coupons"] }),
  });
};

export const useUpdateCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => couponsApi.updateCoupon(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["coupons"] }),
  });
};

export const useDeleteCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => couponsApi.deleteCoupon(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["coupons"] }),
  });
};

export const useExportCoupons = () => {
  return useMutation({
    mutationFn: couponsApi.exportCoupons,
  });
};

export const useImportCoupons = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => couponsApi.importCoupons(file),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["coupons"] }),
  });
}; 