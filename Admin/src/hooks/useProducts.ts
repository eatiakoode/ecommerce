import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as productApi from "@/api/product";

export const useProducts = () =>
  useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await productApi.getProducts();
      // Your backend returns an array directly, not wrapped in data property
      return response.data;
    },
  });

export const useProduct = (id: string) =>
  useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const response = await productApi.getProduct(id);
      return response.data;
    },
    enabled: !!id,
  });

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: productApi.createProduct,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => productApi.updateProduct(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => productApi.deleteProduct(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
  });
};

// Import/Export hooks
export const useExportProducts = () => {
  return useMutation({
    mutationFn: productApi.exportProducts,
  });
};

export const useImportProducts = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => productApi.importProducts(file),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
  });
};

export const useProductBySlug = (slug: string) =>
  useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const response = await productApi.getProductBySlug(slug);
      return response.data;
    },
    enabled: !!slug,
  }); 