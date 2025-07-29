"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { products } from "@/data/products";
import { usePathname } from "next/navigation";
import { fetchCategories } from "@/api/category";
import {
  blogLinks,
  demoItems,
  otherPageLinks,
  otherShopMenus,
  productFeatures,
  productLinks,
  productStyles,
  shopFeatures,
  shopLayout,
  swatchLinks,
} from "@/data/menu";

export default function Nav() {
  const pathname = usePathname();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error loading categories:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  return (
    <>
      {/* Home Mega Menu */}
      <li
        className={`menu-item ${
          demoItems.some(
            (elm) => elm.href.split("/")[1] === pathname.split("/")[1]
          )
            ? "active"
            : ""
        }`}
      >
        <a href="/" className="item-link">
          Home
          {/* <i className="icon icon-arrow-down" /> */}
        </a>
        {/* <div className="sub-menu mega-menu">
          <div className="container">
            <div className="row-demo">
              {demoItems.slice(0, 12).map((item) => (
                <div
                  className={`demo-item ${
                    pathname.split("/")[1] === item.href.split("/")[1]
                      ? "active"
                      : ""
                  }`}
                  key={item.href}
                >
                  <Link href={item.href}>
                    <div className="demo-image position-relative">
                      <Image
                        className="lazyload"
                        data-src={item.src}
                        alt={item.alt}
                        src={item.src}
                        width={273}
                        height={300}
                      />
                      {item.label.length > 0 && (
                        <div className="demo-label">
                          {item.label.map((label, i) => (
                            <span
                              key={i}
                              className={`demo-${label.toLowerCase()}`}
                            >
                              {label}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className="demo-name">{item.name}</span>
                  </Link>
                </div>
              ))}
            </div>
            <div className="text-center view-all-demo">
              <a href="#modalDemo" data-bs-toggle="modal" className="tf-btn">
                <span className="text">View All Demos</span>
              </a>
            </div>
          </div>
        </div> */}
      </li>

      {/* About us vala page  */}
      <li className={`menu-item ${pathname === "/about" ? "active" : ""}`}>
        <Link href="/about-us" className="item-link">
          About Us
        </Link>
      </li>

      {/* Shop Mega Menu */}
      <li className={`menu-item ${pathname === "/shop-left-sidebar" ? "active" : ""}`}>
        <Link href="/shop-left-sidebar" className="item-link">
          Shop
        </Link>
      </li>

      {/* Products Mega Menu */}
      {/* <li
        className={`menu-item ${
          [...productLinks, ...swatchLinks, ...productFeatures].some(
            (elm) => elm.href.split("/")[1] === pathname.split("/")[1]
          )
            ? "active"
            : ""
        }`}
      > */}
        {/* <a href="#" className="item-link">
          Products
          <i className="icon icon-arrow-down" />
        </a> */}
        {/* <div className="sub-menu mega-menu">
          <div className="container">
            <div className="row">
              <div className="col-lg-3">
                <div className="mega-menu-item">
                  <div className="menu-heading">Products Layout</div>
                  <ul className="menu-list">
                    {productLinks.map((link, index) => (
                      <li
                        key={index}
                        className={`menu-item-li ${
                          pathname.split("/")[1] === link.href.split("/")[1]
                            ? "active"
                            : ""
                        }`}
                      >
                        <Link href={link.href} className="menu-link-text">
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="col-lg-3">
                <div className="mega-menu-item">
                  <div className="menu-heading">Colors Swatched</div>
                  <ul className="menu-list">
                    {swatchLinks.map((link, index) => (
                      <li
                        key={index}
                        className={`menu-item-li ${
                          pathname.split("/")[1] === link.href.split("/")[1]
                            ? "active"
                            : ""
                        }`}
                      >
                        <Link href={link.href} className="menu-link-text">
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="col-lg-3">
                <div className="mega-menu-item">
                  <div className="menu-heading">Products Features</div>
                  <ul className="menu-list">
                    {productFeatures.map((link, index) => (
                      <li
                        key={index}
                        className={`menu-item-li ${
                          pathname.split("/")[1] === link.href.split("/")[1]
                            ? "active"
                            : ""
                        }`}
                      >
                        <Link
                          href={link.href}
                          className={`menu-link-text ${
                            link.badge ? "position-relative" : ""
                          }`}
                        >
                          {link.name}
                          {link.badge && (
                            <div className="demo-label">
                              <span className="demo-new">{link.badge}</span>
                            </div>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="col-lg-3">
                <div className="menu-heading">Best seller</div>
                <div className="sec-cls-header">
                  <div className="collection-position hover-img">
                    <Link href={`/shop-collection`} className="img-style">
                      <Image
                        className="lazyload"
                        data-src="/images/collections/cls-header.jpg"
                        alt="banner-cls"
                        src="/images/collections/cls-header.jpg"
                        width={300}
                        height={400}
                      />
                    </Link>
                    <div className="content">
                      <h4 className="title">
                        <Link
                          href={`/shop-collection`}
                          className="link text-white"
                        >
                          Shop our top picks
                        </Link>
                      </h4>
                      <p className="desc text-white">
                        Reserved for special occasions
                      </p>
                      <Link
                        href={`/shop-collection`}
                        className="tf-btn btn-md btn-white"
                      >
                        <span className="text">Shop Now</span>
                        <i className="icon icon-arrowUpRight" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </li> */}

      {/* ✅ Dynamic Category Dropdown */}
      <li
        className={`menu-item position-relative ${
          pathname.includes("/category") ? "active" : ""
        }`}
      >
        <a href="#" className="item-link">
          Category
          <i className="icon icon-arrow-down" />
        </a>
        <div className="sub-menu submenu-default">
          <ul className="menu-list">
            {loading ? (
              <li className="menu-item-li">
                <span className="menu-link-text">Loading...</span>
              </li>
            ) : categories.length > 0 ? (
              categories.map((category, index) => (
                <li
                  key={index}
                  className={`menu-item-li ${
                    pathname === `/category/${category.slug}` ? "active" : ""
                  }`}
                >
                  {category.image && typeof category.image === "string" && category.image.trim() !== "" ? (
                    <Image
                      src={category.image}
                      alt={category.name}
                      width={40}
                      height={40}
                    />
                  ) : (
                    <div style={{ width: 40, height: 40, background: '#eee', borderRadius: '50%' }} />
                  )}
                  <Link href={`/category/${category.slug}`} className="menu-link-text">
                    {category.name}
                  </Link>
                </li>
              ))
            ) : (
              <li className="menu-item-li">
                <span className="menu-link-text">No categories found</span>
              </li>
            )}
          </ul>
        </div>
      </li>

      {/* Blog Menu */}
      <li
        className={`menu-item position-relative ${
          blogLinks.some(
            (elm) => elm.href.split("/")[1] === pathname.split("/")[1]
          )
            ? "active"
            : ""
        }`}
      >
        <a href="/blog-grid" className="item-link">
          Blog
          {/* <i className="icon icon-arrow-down" /> */}
        </a>
        {/* <div className="sub-menu submenu-default">
          <ul className="menu-list">
            {blogLinks.map((link, index) => (
              <li
                key={index}
                className={`menu-item-li ${
                  pathname.split("/")[1] === link.href.split("/")[1]
                    ? "active"
                    : ""
                }`}
              >
                <Link href={link.href} className="menu-link-text">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div> */}
      </li>

      {/* Other Pages Dropdown */}
      <li
        className={`menu-item position-relative ${
          otherPageLinks.some(
            (elm) => elm.href.split("/")[1] === pathname.split("/")[1]
          )
            ? "active"
            : ""
        }`}
      >
        {/* <a href="#" className="item-link">
          Pages
          <i className="icon icon-arrow-down" />
        </a> */}
        <div className="sub-menu submenu-default">
          <ul className="menu-list">
            {otherPageLinks.map((link, index) => (
              <li
                key={index}
                className={`menu-item-li ${
                  pathname.split("/")[1] === link.href.split("/")[1]
                    ? "active"
                    : ""
                }`}
              >
                <Link href={link.href} className="menu-link-text">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </li>

      {/* ✅ Static Pages */}
      {/* <li className={`menu-item ${pathname === "/about" ? "active" : ""}`}>
        <Link href="/about" className="item-link">
          About Us
        </Link>
      </li> */}
      {/* <li className={`menu-item ${pathname === "/category" ? "active" : ""}`}>
        <Link href="/category" className="item-link">
          Category
        </Link>
      </li> */}
      <li className={`menu-item ${pathname === "/faq" ? "active" : ""}`}>
        <Link href="/FAQs" className="item-link">
          FAQ
        </Link>
      </li>
      <li
        className={`menu-item ${
          pathname === "/contact-us" ? "active" : ""
        }`}
      >
        <Link href="/contact" className="item-link">
          Contact Us
        </Link>
      </li>
      {/* <li className={`menu-item ${pathname === "/shop" ? "active" : ""}`}>
        <Link href="/shop" className="item-link">
          Shop
        </Link>
      </li> */}

      {/* Buy Theme */}
      {/* <li className="menu-item">
        <a href="https://themeforest.net/user/themesflat" className="item-link">
          Buy Theme
        </a>
      </li> */}
    </>
  );
}
