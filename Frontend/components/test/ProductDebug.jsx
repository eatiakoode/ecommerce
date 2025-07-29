"use client";
import React, { useEffect, useState } from "react";

export default function ProductDebug() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:5000/api/frontend/product/lists");
        const result = await res.json();
        
        let fetchedProducts = [];
        if (result.success && Array.isArray(result.data)) {
          fetchedProducts = result.data;
        } else if (Array.isArray(result)) {
          fetchedProducts = result;
        }
        
        setProducts(fetchedProducts.slice(0, 3)); // Show first 3 products
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div>Loading products...</div>;
  }

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px', borderRadius: '8px' }}>
      <h3>Product Data Debug</h3>
      <p>Showing first 3 products from API:</p>
      
      {products.map((product, index) => (
        <div key={index} style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}>
          <h4>Product {index + 1}</h4>
          <pre style={{ fontSize: '12px', overflow: 'auto', maxHeight: '200px' }}>
            {JSON.stringify(product, null, 2)}
          </pre>
          
          <div style={{ marginTop: '10px' }}>
            <strong>Key Fields:</strong>
            <ul>
              <li>ID: {product._id || product.id || 'Missing'}</li>
              <li>Title: {product.title || product.name || 'Missing'}</li>
              <li>Price: {product.sellingPrice || product.price || 'Missing'}</li>
              <li>MRP: {product.MRP || 'Missing'}</li>
              <li>Slug: {product.slug || 'Missing'}</li>
              <li>Images: {product.images ? `${product.images.length} images` : 'No images'}</li>
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
} 