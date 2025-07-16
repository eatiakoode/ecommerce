import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as ordersApi from "@/api/orders";
import { toast } from "sonner";

export const useOrders = (params: { page?: number; perPage?: number; status?: string; search?: string; fromDate?: string; toDate?: string } = {}) =>
  useQuery({
    queryKey: ["orders", params],
    queryFn: async () => {
      try {
        const response = await ordersApi.getOrders(params);
        return response.data;
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        throw new Error("Failed to load orders. Please try again.");
      }
    },
    retry: 2,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

export const useOrder = (id: string) =>
  useQuery({
    queryKey: ["order", id],
    queryFn: async () => {
      try {
        const response = await ordersApi.getOrder(id);
        // The new endpoint returns the order object directly
        return response.data;
      } catch (error) {
        console.error("Failed to fetch order:", error);
        throw new Error("Failed to load order details.");
      }
    },
    enabled: !!id,
    retry: 2,
    retryDelay: 1000,
  });

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ordersApi.createOrder,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["orders"] }),
    onError: (error) => {
      console.error("Failed to create order:", error);
    },
  });
};

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => ordersApi.updateOrder(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["orders"] }),
    onError: (error) => {
      console.error("Failed to update order:", error);
    },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => ordersApi.updateOrderStatus(id, status),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Order status updated!");
      console.log("Order status update response:", data);
    },
    onError: (error) => {
      toast.error("Failed to update order status.");
      console.error("Failed to update order status:", error);
    },
  });
};

export const useDeleteOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ordersApi.deleteOrder(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["orders"] }),
    onError: (error) => {
      console.error("Failed to delete order:", error);
    },
  });
}; 