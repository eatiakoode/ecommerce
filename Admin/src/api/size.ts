import axios from "@/helpers/axiosInstance";

const API_BASE = "/size";

export async function getSizes() {
  const res = await axios.get(API_BASE);
  return res.data;
}

export async function addSize(data: any) {
  const res = await axios.post(API_BASE, data);
  return res.data;
}

export async function getSizeById(id: string) {
  const res = await axios.get(`${API_BASE}/${id}`);
  return res.data;
}

export async function updateSize(id: string, data: any) {
  const res = await axios.put(`${API_BASE}/${id}`, data);
  return res.data;
}

export async function deleteSize(id: string) {
  const res = await axios.delete(`${API_BASE}/${id}`);
  return res.data;
}

export async function checkSku(sku: string) {
  const res = await axios.post(`${API_BASE}/check-sku`, { SKU: sku });
  return res.data;
}

export async function importSizes(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    const res = await axios.post(`${API_BASE}/import`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return res.data;
}

export async function exportSizes() {
    const res = await axios.get(`${API_BASE}/export`, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'sizes_export.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
} 