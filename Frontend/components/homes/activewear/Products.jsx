"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function Products() {
  const [categories, setCategories] = useState([]);
  const [activeItem, setActiveItem] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  // Fetch available categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      setCategoriesLoading(true);
      try {
        const response = await fetch('http://localhost:5000/api/frontend/category/all');
        console.log("Categories API response status:", response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log("Available categories:", data);
          
          if (Array.isArray(data) && data.length > 0) {
            setCategories(data);
            setActiveItem(data[0].name);
          } else {
            throw new Error("No categories found in database");
          }
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        const defaultCategories = ["Yoga", "Run", "Tennis", "Train", "Lounge", "Pilates"];
        setCategories(defaultCategories.map(name => ({ name })));
        setActiveItem(defaultCategories[0]);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (!activeItem) return;

    const fetchFilteredProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const apiUrl = `http://localhost:5000/api/frontend/category/filter?category=${encodeURIComponent(activeItem)}`;
        console.log("Fetching products from:", apiUrl);
        
        const res = await fetch(apiUrl);

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        console.log("Filtered Products Response:", data);

        if (Array.isArray(data)) {
          setSelectedItems(data);
          console.log("Products found:", data.length);
        } else if (data.success && Array.isArray(data.data)) {
          setSelectedItems(data.data);
          console.log("Products found:", data.data.length);
        } else {
          console.error("API Error:", data.message || "Invalid response");
          setSelectedItems([]);
          setError(data.message || "Failed to fetch products");
        }
      } catch (err) {
        console.error("Fetch Error:", err);
        setSelectedItems([]);
        setError("Failed to fetch products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredProducts();
  }, [activeItem]);

  const handleTabClick = (item) => {
    setActiveItem(item);
  };

  return (
    <div style={{ 
      padding: '40px 20px', 
      backgroundColor: '#f8f9fa', 
      minHeight: '400px',
      marginBottom: '40px'
    }}>
      <h2 style={{ 
        textAlign: 'center', 
        color: 'black', 
        fontSize: '28px', 
        marginBottom: '30px', 
        fontWeight: 'bold' 
      }}>
        Today's Top Picks
      </h2>
      
      {/* Category Tabs */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '30px', flexWrap: 'wrap' }}>
        {categories.map((category, i) => (
          <button
            key={i}
            onClick={() => handleTabClick(category.name)}
            style={{
              padding: '12px 24px',
              backgroundColor: 'transparent',
              color: 'black',
              border: 'none',
              borderBottom: activeItem === category.name ? '3px solid #111' : '3px solid transparent',
              borderRadius: 0,
              cursor: 'pointer',
              fontSize: '18px',
              fontWeight: activeItem === category.name ? '700' : '500',
              transition: 'all 0.2s',
              outline: 'none',
              marginBottom: activeItem === category.name ? '-3px' : '0'
            }}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div style={{ textAlign: 'center', color: 'black', fontSize: '18px' }}>
          <p>Loading {activeItem} products...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div style={{ textAlign: 'center', color: 'red', fontSize: '18px' }}>
          <p>{error}</p>
        </div>
      )}

      {/* Products Grid */}
      {!loading && !error && selectedItems.length > 0 && (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 300px))',
          gap: '30px',
          padding: '20px 0 40px 0',
          justifyContent: 'center',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {selectedItems.map((product) => (
            <div key={product._id} style={{ 
              backgroundColor: 'white',
              borderRadius: '15px',
              padding: '0',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              border: 'none',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              overflow: 'hidden',
              position: 'relative',
              width: '100%',
              maxWidth: '280px',
              margin: '0 auto'
            }}>
              {/* Product Image */}
              {product.images && product.images[0] && (
                <div style={{ 
                  width: '100%', 
                  height: '200px', 
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <img
                    src={`http://localhost:5000${product.images[0].url}`}
                    alt={product.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease'
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}

              {/* Product Info */}
              <div style={{ 
                padding: '15px',
                backgroundColor: 'white'
              }}>
                {/* Product Title */}
                <h3 style={{ 
                  color: '#333', 
                  fontSize: '16px',
                  fontWeight: '600',
                  marginBottom: '12px',
                  lineHeight: '1.3',
                  textAlign: 'center',
                  minHeight: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {product.title}
                </h3>

                {/* Product Price */}
                <div style={{ 
                  textAlign: 'center',
                  marginBottom: '15px'
                }}>
                  <div style={{ fontWeight: 'bold', fontSize: '22px', color: '#222', margin: '10px 0 0 0', textAlign: 'center' }}>
                    ₹{product.sellingPrice}
                  </div>
                  {product.MRP && product.MRP > product.sellingPrice && (
                    <div style={{ color: '#999', textDecoration: 'line-through', fontSize: '16px', textAlign: 'center', marginBottom: '10px' }}>
                      ₹{product.MRP}
                    </div>
                  )}
                </div>

                {/* View Details Button */}
                <Link 
                  href={`/product-detail/${product.slug || product._id}`}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '12px 16px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '8px',
                    textAlign: 'center',
                    fontSize: '14px',
                    fontWeight: '600',
                    transition: 'all 0.3s ease',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Products State */}
      {!loading && !error && selectedItems.length === 0 && (
        <div style={{ textAlign: 'center', color: 'black', fontSize: '18px' }}>
          <p>No products found for {activeItem} category.</p>
          <p style={{ color: '#666', marginTop: '10px' }}>Try selecting a different category.</p>
        </div>
      )}
    </div>
  );
}
