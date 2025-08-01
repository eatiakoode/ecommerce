import api from "@/helpers/axiosInstance";

// Enquiry CRUD operations
export const getEnquiries = () => api.get("/enquiry");
export const getEnquiry = (id: string) => api.get(`/enquiry/${id}`);
export const createEnquiry = (data: any) => api.post("/enquiry", data);
export const updateEnquiry = (id: string, data: any) => api.put(`/enquiry/${id}`, data);
export const deleteEnquiry = (id: string) => api.delete(`/enquiry/${id}`); 