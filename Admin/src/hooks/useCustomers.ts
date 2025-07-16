import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as customerApi from "@/api/customer";

export const useCustomers = () =>
  useQuery({
    queryKey: ["customers"],
    queryFn: async () => (await customerApi.getCustomers()).data,
  });

export const useCustomer = (id: string) =>
  useQuery({
    queryKey: ["customer", id],
    queryFn: async () => (await customerApi.getCustomer(id)).data.data,
    enabled: !!id,
  });

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: customerApi.createCustomer,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["customers"] }),
  });
};

export const useRegisterCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: customerApi.registerCustomer,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["customers"] }),
  });
};

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => customerApi.updateCustomer(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["customers"] }),
  });
};

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => customerApi.deleteCustomer(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["customers"] }),
  });
};

// Import/Export hooks
export const useExportCustomers = () => {
  return useMutation({
    mutationFn: customerApi.exportCustomers,
  });
};

export const useImportCustomers = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => customerApi.importCustomers(file),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["customers"] }),
  });
}; 