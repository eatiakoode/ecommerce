"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Footer1 from "@/components/footers/Footer1";
import { fetchProductsByCategory } from "@/api/category";
import Link from "next/link";
import Image from "next/image";
import { formatToINR } from "@/utils/currencyConverter";

// Add custom styles to prevent full-window image display
const categoryStyles = `
  .category-product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
    max-width: 100%;
    width: 100%;
  }
  
  .category-product-card {
    background: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    max-width: 100%;
    width: 100%;
  }
  
  .category-product-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }
  
  .category-product-image-container {
    position: relative;
    width: 100%;
    height: 256px;
    overflow: hidden;
    background-color: #f3f4f6;
  }
  
  .category-product-image {
    width: 100% !important;
    height: 100% !important;
    object-fit: cover !important;
    object-position: center !important;
    max-width: 100% !important;
    max-height: 100% !important;
  }
  
  .category-product-info {
    padding: 1rem;
  }
  
  .category-product-title {
    font-size: 0.875rem;
    font-weight: 500;
    color: #111827;
    margin-bottom: 0.5rem;
    line-height: 1.25;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .category-product-price {
    font-size: 1.125rem;
    font-weight: 700;
    color: #111827;
  }
  
  .category-product-original-price {
    font-size: 0.875rem;
    color: #6b7280;
    text-decoration: line-through;
  }
  
  .category-discount-badge {
    position: absolute;
    top: 0.5rem;
    left: 0.5rem;
    background-color: #ef4444;
    color: white;
    font-size: 0.75rem;
    font-weight: 700;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    z-index: 10;
  }
  
  .category-quick-view-overlay {
    position: absolute;
    inset: 0;
    background-color: rgba(0, 0, 0, 0);
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
  }
  
  .category-product-card:hover .category-quick-view-overlay {
    background-color: rgba(0, 0, 0, 0.2);
    opacity: 1;
  }
  
  .category-quick-view-button {
    background: white;
    color: #374151;
    padding: 0.5rem 1rem;
    border-radius: 9999px;
    font-size: 0.875rem;
    font-weight: 500;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  .category-product-card:hover .category-quick-view-button {
    opacity: 1;
  }
  
  .category-add-to-cart-button {
    background-color: #2563eb;
    color: white;
    padding: 0.5rem;
    border-radius: 50%;
    transition: all 0.2s ease;
    opacity: 0;
  }
  
  .category-product-card:hover .category-add-to-cart-button {
    opacity: 1;
  }
  
  .category-add-to-cart-button:hover {
    background-color: #1d4ed8;
  }
  
  .category-product-meta {
    margin-top: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.75rem;
    color: #6b7280;
  }
  
  .category-rating {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }
  
  .category-star-icon {
    width: 1rem;
    height: 1rem;
    color: #fbbf24;
  }
  
  @media (max-width: 640px) {
    .category-product-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }
    
    .category-product-image-container {
      height: 200px;
    }
  }
  
  @media (max-width: 480px) {
    .category-product-grid {
      grid-template-columns: 1fr;
    }
  }
`;

export default function CategoryPage() {
  const { slug } = useParams();
  const [categoryData, setCategoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const loadCategoryProducts = async () => {
      try {
        setLoading(true);
        const response = await fetchProductsByCategory(slug, currentPage);
        setCategoryData(response);
        setTotalPages(response.totalPages || 0);
      } catch (error) {

      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadCategoryProducts();
    }
  }, [slug, currentPage]);

  // Add styles to document head
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = categoryStyles;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  if (loading) {
    return (
      <>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        </div>
        <Footer1 hasPaddingBottom />
      </>
    );
  }

  if (!categoryData || !categoryData.products) {
    return (
      <>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Category Not Found</h1>
            <p className="text-gray-600">The category you're looking for doesn't exist.</p>
            <Link href="/" className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
              Go Home
            </Link>
          </div>
        </div>
        <Footer1 hasPaddingBottom />
      </>
    );
  }

  const { category, products, totalProducts, currentPage: page } = categoryData;

  // Helper function to get the correct image URL
  const getImageUrl = (product) => {
    if (product.images && product.images.length > 0) {
      const image = product.images[0];
      // If the image has a url property, use it
      if (image.url) {
        // If it's already a full URL, use it as is
        if (image.url.startsWith('http')) {
          return image.url;
        }
        // If it's a relative path, prepend the backend URL
        return `http://localhost:5000${image.url}`;
      }
      // If it's a string directly
      if (typeof image === 'string') {
        if (image.startsWith('http')) {
          return image;
        }
        return `http://localhost:5000${image}`;
      }
    }
    return null;
  };

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link href="/" className="text-gray-700 hover:text-gray-900">
                  Home
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="mx-2 text-gray-400">/</span>
                  <span className="text-gray-500 capitalize">{category}</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Category Header */}
      <div className="bg-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 capitalize">{category}</h1>
          <p className="text-gray-600">{totalProducts} products found</p>
        </div>
      </div>

      {/* Products Grid - Fixed Layout */}
      <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          {products.length > 0 ? (
            <>
              {/* Fixed Grid Layout with Proper Constraints */}
              <div className="category-product-grid">
                {products.map((product) => {
                  const imageUrl = getImageUrl(product);
                  return (
                    <div key={product._id} className="category-product-card">
                      <Link href={`/product-detail/${product.slug}`} className="block w-full">
                        {/* Product Image Container - Fixed Height */}
                        <div className="category-product-image-container">
                          {imageUrl ? (
                            <Image
                              src={imageUrl}
                              alt={product.title}
                              fill
                              className="category-product-image"
                              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                          
                          {/* Discount Badge */}
                          {product.MRP && product.MRP > product.sellingPrice && (
                            <div className="category-discount-badge">
                              {Math.round(((product.MRP - product.sellingPrice) / product.MRP) * 100)}% OFF
                            </div>
                          )}
                          
                          {/* Quick View Overlay */}
                          <div className="category-quick-view-overlay">
                            <div className="category-quick-view-button">
                              View Details
                            </div>
                          </div>
                        </div>
                        
                        {/* Product Info */}
                        <div className="category-product-info">
                          {/* Product Title */}
                          <h3 className="category-product-title">
                            {product.title}
                          </h3>
                          
                          {/* Price Section */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="category-product-price">
                                {formatToINR(product.sellingPrice)}
                              </span>
                              {product.MRP && product.MRP > product.sellingPrice && (
                                <span className="category-product-original-price">
                                  {formatToINR(product.MRP)}
                                </span>
                              )}
                            </div>
                            
                            {/* Add to Cart Button */}
                            <button 
                              className="category-add-to-cart-button"
                              onClick={(e) => {
                                e.preventDefault();
                                // Add to cart functionality here
                        
                              }}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                              </svg>
                            </button>
                          </div>
                          
                          {/* Product Meta */}
                          <div className="category-product-meta">
                            <span>Free Shipping</span>
                            <div className="category-rating">
                              <svg className="category-star-icon" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              <span>4.5</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <nav className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-2 text-sm font-medium rounded-md ${
                          currentPage === pageNum
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600">There are no products in this category yet.</p>
            </div>
          )}
        </div>
      </div>

      <Footer1 hasPaddingBottom />
    </>
  );
} 