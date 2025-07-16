import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as staffApi from "@/api/staff";

export const useStaff = () =>
  useQuery({
    queryKey: ["staff"],
    queryFn: async () => (await staffApi.getStaff()).data,
  });

export const useStaffMember = (id: string) =>
  useQuery({
    queryKey: ["staff", id],
    queryFn: async () => (await staffApi.getStaffMember(id)).data,
    enabled: !!id,
  });

export const useCreateStaff = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: staffApi.createStaff,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["staff"] }),
  });
};

export const useUpdateStaff = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => staffApi.updateStaff(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["staff"] }),
  });
};

export const useDeleteStaff = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => staffApi.deleteStaff(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["staff"] }),
  });
}; 