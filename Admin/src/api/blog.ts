import axiosInstance from "@/helpers/axiosInstance";

// Blog Endpoints
export async function getBlogs() {
  const res = await axiosInstance.get("/frontend/blog/list");
  return res.data;
}

export async function getBlogById(id: string) {
  const res = await axiosInstance.get(`/blog/${id}`);
  return res.data;
}

export async function getBlogBySlug(slug: string) {
  const res = await axiosInstance.get(`/frontend/blog/${slug}`);
  return res.data;
}

export async function getRelatedBlogs(slug: string) {
  const res = await axiosInstance.get(`/frontend/blog/related/${slug}`);
  return res.data;
}

export async function addBlog(data: any) {
  // If data is FormData, set headers for multipart
  const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;
  const config = isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
  const res = await axiosInstance.post("/blog", data, config);
  return res.data;
}

export async function updateBlog(id: string, data: any) {
  const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;
  const config = isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
  const res = await axiosInstance.put(`/blog/${id}`, data, config);
  return res.data;
}

export async function deleteBlog(id: string) {
  const res = await axiosInstance.delete(`/blog/${id}`);
  return res.data;
}

// Blog Category Endpoints
export async function getBlogCategories() {
  const res = await axiosInstance.get("/blogcategory");
  return res.data;
}

export async function createBlogCategory(title: string) {
  const res = await axiosInstance.post("/blogcategory", { title });
  return res.data;
} 