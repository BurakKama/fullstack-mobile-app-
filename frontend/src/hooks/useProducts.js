import { useState, useEffect } from "react";
import api from "../api/api";

export default function useProducts(params = {}) {
  const { category = null, search = null } = params || {};
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const queryParams = {};
        if (category) queryParams.category = category;
        if (search) queryParams.search = search;

        const res = await api.get("/products", { params: queryParams });
        setProducts(res.data.products);
      } catch (err) {
        setError(err.message || "Ürünler yüklenirken hata oluştu");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, search]);

  return { products, loading, error };
}
