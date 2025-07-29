  import Footer1 from "@/components/footers/Footer1";
  import Header1 from "@/components/headers/Header1";
  import Topbar6 from "@/components/headers/Topbar6";
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
    const { id } = params;
    
    try {
      // Use the correct backend endpoint that expects a slug
      const res = await fetch(`http://localhost:5000/api/frontend/product/${id}`, {
      cache: "no-store",
    });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
    const apiProduct = await res.json();
    console.log("API Product Response:", apiProduct);

    const product = {
      ...apiProduct,
      price: Number(apiProduct.sellingPrice),
      oldPrice: Number(apiProduct.MRP),
      discount: apiProduct.MRP && apiProduct.sellingPrice
        ? Math.round(100 - (apiProduct.sellingPrice / apiProduct.MRP) * 100)
        : 0,
    };

    if (!product) {
      return <div>Product not found or failed to load.</div>;
    }

    return (
      <>
        <Topbar6 bgColor="bg-main" />
        <Header1 />
        <Breadcumb product={product} />
        <Details1 product={product} />
        <Descriptions1 product={product} />
        <RelatedProducts slug={id} />
        <Footer1 hasPaddingBottom />
      </>
    );
    } catch (error) {
      console.error("Error fetching product:", error);
      return (
        <>
          <Topbar6 bgColor="bg-main" />
          <Header1 />
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
              <p className="text-gray-600">The product you're looking for doesn't exist or failed to load.</p>
            </div>
          </div>
          <Footer1 hasPaddingBottom />
        </>
      );
    }
  }
