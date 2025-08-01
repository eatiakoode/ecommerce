import Footer1 from "@/components/footers/Footer1";
import Breadcumb from "@/components/productDetails/Breadcumb";
import Descriptions1 from "@/components/productDetails/descriptions/Descriptions1";
import Details1 from "@/components/productDetails/details/Details1";
import RelatedProducts from "@/components/productDetails/RelatedProducts";
import { redirect } from "next/navigation";
import React from "react";

export const metadata = {
  title:
    "Product Detail || Modave - Multipurpose React Nextjs eCommerce Template",
  description: "Modave - Multipurpose React Nextjs eCommerce Template",
};

export default async function ProductDetailPage({ params }) {
  const { id } = await params;
  
  // Check if this is a valid product route
  // If the ID matches known non-product routes, redirect to the correct route
  const routeMappings = {
    'my-account': '/my-account',
    'my-account-cart': '/my-account-cart',
    'my-account-wishlist': '/my-account-wishlist',
    'my-account-orders': '/my-account-orders',
    'my-account-address': '/my-account-address',
    'login': '/login',
    'register': '/register',
    'forgot-password': '/forgot-password',
    'reset-password': '/reset-password',
    'category': '/category',
    'blog': '/blog'
  };
  
  if (routeMappings[id]) {
    // Redirect to the correct route
    redirect(routeMappings[id]);
  }
  
  try {
    const res = await fetch(`http://localhost:5000/api/frontend/product/${id}`, {
      cache: "no-store",
    });
    
    if (!res.ok) {
      // Handle 404 more gracefully
      if (res.status === 404) {
        return (
          <>
            <div className="container">
              <div className="text-center py-5">
                <h2>Product Not Found</h2>
                <p>The product you're looking for doesn't exist or has been removed.</p>
                <p>Product ID: {id}</p>
                <a href="/" className="btn btn-primary">Go to Home</a>
              </div>
            </div>
            <Footer1 hasPaddingBottom />
          </>
        );
      }
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const apiProduct = await res.json();
    console.log("API Product data:", apiProduct); // Debug log
    console.log("API Product _id:", apiProduct._id); // Debug log

    // Transform backend data to match frontend expectations
    const product = {
      ...apiProduct,
      id: apiProduct._id || id, // Use URL parameter as fallback
      price: Number(apiProduct.sellingPrice),
      oldPrice: Number(apiProduct.MRP),
      discount: apiProduct.MRP && apiProduct.sellingPrice
        ? Math.round(100 - (apiProduct.sellingPrice / apiProduct.MRP) * 100)
        : 0,
      // Transform images array to match frontend expectations
      images: apiProduct.images ? apiProduct.images.map((img, index) => ({
        id: index + 1,
        color: "gray", // Default color
        src: img.url.startsWith('/uploads/') ? `http://localhost:5000${img.url}` : img.url,
        alt: apiProduct.title || "Product Image",
        width: 600,
        height: 800,
      })) : [],
      // Keep original images for backend compatibility
      originalImages: apiProduct.images || [],
      // Transform color array to match frontend expectations
      color: apiProduct.color ? apiProduct.color.map(color => ({
        _id: color._id,
        title: color.title,
        name: color.title, // Add name property for compatibility
        value: color.title, // Add value property for compatibility
        color: color.title.toLowerCase(), // Add color property for compatibility
      })) : [],
      // Transform size array to match frontend expectations
      size: apiProduct.size ? apiProduct.size.map(size => ({
        _id: size._id,
        name: size.name,
        value: size.value,
      })) : [],
      // Keep brand information as populated from backend
      brand: apiProduct.brand,
    };

    return (
      <>
        <Breadcumb product={product} />
        <Details1 product={product} />
        <Descriptions1 />
        <RelatedProducts product={product} />
        <Footer1 hasPaddingBottom />
      </>
    );
  } catch (error) {
    console.error("Error fetching product:", error);
    // Return a fallback page or error component
    return (
      <>
        <div className="container">
          <div className="text-center py-5">
            <h2>Product Not Found</h2>
            <p>The product you're looking for doesn't exist or has been removed.</p>
            <p>Error: {error.message}</p>
            <p>Product ID: {id}</p>
            <a href="/" className="btn btn-primary">Go to Home</a>
          </div>
        </div>
        <Footer1 hasPaddingBottom />
      </>
    );
  }
}
