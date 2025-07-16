import api from "@/helpers/axiosInstance";

// Customer CRUD operations
export const getCustomers = () => api.get("/customer/customers");
export const getCustomer = (id: string) => api.get(`/customer/fetchCustomer/${id}`);
export const createCustomer = (data: any) => api.post("/customer", data);
export const updateCustomer = (id: string, data: any) => api.put(`/customer/updateCustomer/${id}`, data);
export const deleteCustomer = (id: string) => api.delete(`/customer/deleteCustomer/${id}`);

// Register customer (for add page)
export const registerCustomer = (data: any) => api.post("/user/register", data);

// Import/Export functionality
export const exportCustomers = () => {
  const axios = require("axios");
  return axios.get("http://localhost:5000/api/customer/export");
};

export const importCustomers = (file: File) => {
  const axios = require("axios");
  const formData = new FormData();
  formData.append("file", file);
  return axios.post("http://localhost:5000/api/customer/import", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}; 