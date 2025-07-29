import axiosInstance from "@/helpers/axiosInstance";

// FAQ Endpoints
export async function getFaqs() {
  const res = await axiosInstance.get("/faq");
  return res.data;
}

export async function getFaqById(id: string) {
  const res = await axiosInstance.get(`/faq/${id}`);
  return res.data;
}

export async function addFaq(data: any) {
  const res = await axiosInstance.post("/faq", data);
  return res.data;
}

export async function updateFaq(id: string, data: any) {
  const res = await axiosInstance.put(`/faq/${id}`, data);
  return res.data;
}

export async function deleteFaq(id: string) {
  const res = await axiosInstance.delete(`/faq/${id}`);
  return res.data;
} 