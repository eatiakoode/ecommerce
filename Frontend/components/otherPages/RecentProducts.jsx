"use client";

import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import ProductCard1 from "../productCards/ProductCard1";
import { Pagination } from "swiper/modules";

export default function RecentProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/frontend/product/lists');
        const data = await response.json();
        
        let fetchedProducts = [];
        if (data.success && Array.isArray(data.data)) {
          fetchedProducts = data.data;
        } else if (Array.isArray(data)) {
          fetchedProducts = data;
        }

        // Map backend data structure to frontend expected structure
        const mappedProducts = fetchedProducts.map(product => ({
          ...product,
          id: product._id || product.id,
          price: product.sellingPrice || product.price || 0,
          oldPrice: product.MRP || product.oldPrice || 0,
          title: product.title || product.name || 'Product',
          imgSrc: product.images?.[0]?.url || product.imgSrc || '/images/products/womens/women-1.jpg',
          imgHover: product.images?.[1]?.url || product.imgHover || product.images?.[0]?.url || '/images/products/womens/women-1.jpg',
          slug: product.slug || product._id || product.id,
          shortDescription: product.shortDescription || product.description || 'Product description not available',
          brand: product.brand?.title || product.brand || 'Unknown Brand',
          category: product.categories?.[0]?.name || product.category || 'General',
          colors: product.color ? product.color.map(color => ({
            name: color.title || color.name,
            bgColor: color.title?.toLowerCase() || 'bg-gray',
            imgSrc: product.images?.[0]?.url || '/images/products/womens/women-1.jpg'
          })) : [],
          sizes: product.size ? product.size.map(size => ({
            name: size.name || size.value,
            isAvailable: true
          })) : [],
          discount: product.MRP && product.sellingPrice ? Math.round(((product.MRP - product.sellingPrice) / product.MRP) * 100) : 0,
          quantity: product.quantity || 0,
          sku: product.SKU || product.sku || '',
          tags: product.tags || '',
          isOnSale: product.MRP && product.sellingPrice && product.MRP > product.sellingPrice,
          hotSale: false,
          countdown: null,
          saleText: product.MRP && product.sellingPrice && product.MRP > product.sellingPrice ? 
            `-${Math.round(((product.MRP - product.sellingPrice) / product.MRP) * 100)}%` : '',
          wowDelay: '0.1s'
        }));

        // Get random products for "You may also like" section
        const shuffled = mappedProducts.sort(() => 0.5 - Math.random());
        setProducts(shuffled.slice(0, 8)); // Show 8 products in the slider
      } catch (error) {

        // Fallback to static products if API fails
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section className="flat-spacing pt-0">
        <div className="container">
          <div className="heading-section text-center wow fadeInUp">
            <h4 className="heading">You may also like</h4>
          </div>
          <div className="text-center py-5">
            <p>Loading products...</p>
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null; // Don't show the section if no products
  }

  return (
    <section className="flat-spacing pt-0">
      <div className="container">
        <div className="heading-section text-center wow fadeInUp">
          <h4 className="heading">You may also like</h4>
        </div>
        <Swiper
          className="swiper tf-sw-latest"
          dir="ltr"
          spaceBetween={15}
          breakpoints={{
            0: { slidesPerView: 2, spaceBetween: 15 },
            768: { slidesPerView: 3, spaceBetween: 30 },
            1200: { slidesPerView: 4, spaceBetween: 30 },
          }}
          modules={[Pagination]}
          pagination={{
            clickable: true,
            el: ".spd79",
          }}
        >
          {products.map((product, i) => (
            <SwiperSlide key={product.id || i} className="swiper-slide">
              <ProductCard1 product={product} />
            </SwiperSlide>
          ))}

          <div className="sw-pagination-latest sw-dots type-circle justify-content-center spd79" />
        </Swiper>
      </div>
    </section>
  );
}
