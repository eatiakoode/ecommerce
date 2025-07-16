import api from "@/helpers/axiosInstance";

// Use /order/recent for dashboard recent orders with improved error handling
export const getOrders = (params: { page?: number; perPage?: number; status?: string; search?: string; fromDate?: string; toDate?: string }) => {
  const query = new URLSearchParams();
  
  // Add all parameters with proper validation
  if (params.page) query.append("page", params.page.toString());
  if (params.perPage) query.append("perPage", params.perPage.toString());
  if (params.status) query.append("status", params.status);
  if (params.search) query.append("search", params.search);
  if (params.fromDate) query.append("fromDate", params.fromDate);
  if (params.toDate) query.append("toDate", params.toDate);
  
  const queryString = query.toString();
  const url = `/order/recent${queryString ? `?${queryString}` : ''}`;
  
  return api.get(url);
};

export const getOrder = (id: string) => api.get(`/order/single/${id}`);
export const createOrder = (data: any) => api.post("/order", data);
export const updateOrder = (id: string, data: any) => api.put(`/order/${id}`, data);
export const deleteOrder = (id: string) => api.delete(`/order/${id}`); 
export const updateOrderStatus = (id: string, status: string) =>
  api.put(`/order/status/${id}`, { status }); 