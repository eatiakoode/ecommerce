import { useState, useCallback, useEffect } from "react";
import axiosInstance from "@/helpers/axiosInstance";

export function useBrands() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBrands = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/brand");
      const brandList = Array.isArray(res.data.data) ? res.data.data : [];
      setBrands(brandList);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  return { brands, loading, refreshBrands: fetchBrands };
} 