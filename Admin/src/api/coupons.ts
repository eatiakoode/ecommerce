import api from "@/helpers/axiosInstance";

// TODO: Updated to match actual backend routes
export const getCoupons = () => api.get("/coupon");
export const getCoupon = (id: string) => api.get(`/coupon/${id}`);
export const createCoupon = (data: any) => api.post("/coupon", data);
export const updateCoupon = (id: string, data: any) => api.put(`/coupon/${id}`, data);
export const deleteCoupon = (id: string) => api.delete(`/coupon/${id}`);

export const exportCoupons = () => {
  return api.get("/coupon/export", { responseType: "blob" });
};

export const importCoupons = (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  return api.post("/coupon/import", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}; 