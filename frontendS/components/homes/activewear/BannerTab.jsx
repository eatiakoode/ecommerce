"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useContextElement } from "@/context/Context";

export default function BannerTab() {
  const { setQuickViewItem } = useContextElement();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("/api/frontend/product/lists")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const formatted = data.map((item, index) => ({
            id: item._id,
            title: item.title,
            price: item.price / 100,
            oldPrice: (item.price / 100) + 20,
            imgSrc: item.images?.[0]?.url
              ? `http://localhost:5000${item.images[0].url}`
              : "/images/default.jpg",
            active: index === 0,
            delay: `${0.1 * index}s`,
          }));
          setProducts(formatted);
        } else {
          console.error("Invalid response format", data);
        }
      })
      .catch((err) => console.error("Failed to fetch products", err));
  }, []);

  useEffect(() => {
    const offsetX = 20;
    const offsetY = 20;

    const handleMouseMove = (e) => {
      const hoverImage = e.currentTarget.querySelector(".hover-image");
      if (hoverImage) {
        hoverImage.style.top = `${e.clientY + offsetY}px`;
        hoverImage.style.left = `${e.clientX + offsetX}px`;
      }
    };

    const handleMouseEnter = (e) => {
      const hoverImage = e.currentTarget.querySelector(".hover-image");
      if (hoverImage) {
        hoverImage.style.transform = "scale(1)";
        hoverImage.style.opacity = "1";
      }
    };

    const handleMouseLeave = (e) => {
      const hoverImage = e.currentTarget.querySelector(".hover-image");
      if (hoverImage) {
        hoverImage.style.transform = "scale(0)";
        hoverImage.style.opacity = "0";
      }
    };

    const elements = document.querySelectorAll(".hover-cursor-img");
    elements.forEach((el) => {
      el.addEventListener("mousemove", handleMouseMove);
      el.addEventListener("mouseenter", handleMouseEnter);
      el.addEventListener("mouseleave", handleMouseLeave);
    });

    return () => {
      elements.forEach((el) => {
        el.removeEventListener("mousemove", handleMouseMove);
        el.removeEventListener("mouseenter", handleMouseEnter);
        el.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  }, []);

  return (
    <section className="flat-spacing pt-0">
      <div className="container">
        <div className="row flat-img-with-text-v2">
          <div className="col-lg-7 col-md-6">
            <div className="banner-left">
              <div className="box-title wow fadeInUp">
                <h3>Stay Active in Style: Explore the Latest Activewear Collection</h3>
                <p>Browse our Top Trending: the hottest picks loved by all.</p>
              </div>
              <ul className="tab-banner" role="tablist">
                {products.map((item) => (
                  <li
                    key={item.id}
                    className="nav-tab-item wow fadeInUp"
                    data-wow-delay={item.delay}
                    role="presentation"
                  >
                    <a
                      href={`#tabBannerCls${item.id}`}
                      className={`nav-tab-link hover-cursor-img ${item.active ? "active" : ""}`}
                      data-bs-toggle="tab"
                    >
                      <h5 className="title text-line-clamp-1">{item.title}</h5>
                      <div className="arr-link">
                        <span className="text-btn-uppercase text-more">More</span>
                        <i className="icon icon-arrowUpRight" />
                      </div>
                      <div className="hover-image">
                        <Image
                          alt="Hover Image"
                          src={item.imgSrc}
                          width={710}
                          height={945}
                        />
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
              <div className="wow fadeInUp">
                <Link href={`/shop-default-grid`} className="btn-line">
                  View All Collection
                </Link>
              </div>
            </div>
          </div>
          <div className="col-lg-5 col-md-6">
            <div className="banner-right flat-animate-tab">
              <div className="tab-content">
                {products.map((item) => (
                  <div
                    key={item.id}
                    className={`tab-pane ${item.active ? "active show" : ""}`}
                    id={`tabBannerCls${item.id}`}
                    role="tabpanel"
                  >
                    <div className="collection-position-2 hover-img">
                      <a className="img-style">
                        <Image
                          className="lazyload"
                          src={item.imgSrc}
                          alt="banner-cls"
                          width={710}
                          height={945}
                        />
                        <div className="on-sale-wrap">
                          <span className="on-sale-item">-25%</span>
                        </div>
                      </a>
                      <div className="content cls-content">
                        <div className="cls-info">
                          <Link
                            href={`/product-detail/${item.id}`}
                            className="text-title link text-line-clamp-1"
                          >
                            {item.title}
                          </Link>
                          <div className="price">
                            <span className="old-price">${item.oldPrice.toFixed(2)}</span>
                            <span className="new-price">${item.price.toFixed(2)}</span>
                          </div>
                        </div>
                        <a
                          href="#quickView"
                          onClick={() => setQuickViewItem(item)}
                          data-bs-toggle="modal"
                          className="cls-btn text-btn-uppercase"
                        >
                          Quick View
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
