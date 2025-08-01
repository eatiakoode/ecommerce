import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as enquiryApi from "@/api/enquiry";

export const useEnquiries = () =>
  useQuery({
    queryKey: ["enquiries"],
    queryFn: async () => (await enquiryApi.getEnquiries()).data,
  });

export const useEnquiry = (id: string) =>
  useQuery({
    queryKey: ["enquiry", id],
    queryFn: async () => (await enquiryApi.getEnquiry(id)).data,
    enabled: !!id,
  });

export const useCreateEnquiry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: enquiryApi.createEnquiry,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["enquiries"] }),
  });
};

export const useUpdateEnquiry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => enquiryApi.updateEnquiry(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["enquiries"] }),
  });
};

export const useDeleteEnquiry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => enquiryApi.deleteEnquiry(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["enquiries"] }),
  });
}; 