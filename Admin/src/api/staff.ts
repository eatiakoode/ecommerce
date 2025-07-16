import api from "@/helpers/axiosInstance";

// TODO: Updated to match actual backend routes
export const getStaff = () => api.get("/staff");
export const getStaffMember = (id: string) => api.get(`/staff/${id}`);
export const createStaff = (data: any) => api.post("/staff", data);
export const updateStaff = (id: string, data: any) => api.put(`/staff/${id}`, data);
export const deleteStaff = (id: string) => api.delete(`/staff/${id}`); 