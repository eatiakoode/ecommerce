import axiosInstance from "@/helpers/axiosInstance";

const API_BASE = "http://localhost:5000/api/brand";

export async function getBrands() {
  const res = await axiosInstance.get("/brand");
  return res.data;
}

export async function addBrand(data: any) {
  const res = await axiosInstance.post("/brand", data);
  return res.data;
}

export async function updateBrand(id: string, data: any) {
  const res = await axiosInstance.put(`/brand/${id}`, data);
  return res.data;
}

export async function deleteBrand(id: string) {
  const res = await axiosInstance.delete(`/brand/${id}`);
  return res.data;
}

export async function getBrandById(id: string) {
  const res = await axiosInstance.get(`/brand/${id}`);
  return res.data.data; // Return the actual brand object
}

// The importBrands and exportBrands can remain as is or be updated if you have endpoints for them.
export async function importBrands(file: any) {
  // TODO: Implement if backend supports
  return true;
}

export async function exportBrands() {
  // TODO: Implement if backend supports
  return true;
} 