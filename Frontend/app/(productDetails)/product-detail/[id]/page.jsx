  import Footer1 from "@/components/footers/Footer1";
  import Breadcumb from "@/components/productDetails/Breadcumb";
  import Descriptions1 from "@/components/productDetails/descriptions/Descriptions1";
  import Details1 from "@/components/productDetails/details/Details1";
  import RelatedProducts from "@/components/productDetails/RelatedProducts";
  import React from "react";

  export const metadata = {
    title:
      "Product Detail || Modave - Multipurpose React Nextjs eCommerce Template",
    description: "Modave - Multipurpose React Nextjs eCommerce Template",
  };

  export default async function ProductDetailPage({ params }) {
    const { id } = await params;
    
    console.log("Product detail page - ID:", id);
    
    try {
      const res = await fetch(`http://localhost:5000/api/frontend/product/${id}`, {
        cache: "no-store",
      });
      
      console.log("Product detail API response status:", res.status);
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const apiProduct = await res.json();
      console.log("API Product Response:", apiProduct);

      // Transform backend data to match frontend expectations
      const product = {
        ...apiProduct,
        id: apiProduct._id,
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
            </div>
          </div>
          <Footer1 hasPaddingBottom />
        </>
      );
    }
  }
