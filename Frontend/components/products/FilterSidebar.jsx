"use client";

import { useEffect, useState } from "react";
// import { productMain } from "@/data/products";
import "react-range-slider-input/dist/style.css";
const availabilityOptions = [
  { label: "All", value: "All" },
  { label: "In Stock", value: "In Stock" },
  { label: "Out of Stock", value: "Out of Stock" },
];

let RangeSlider;
try {
  RangeSlider = require("react-range-slider-input").default;
} catch (error) {
  
  RangeSlider = null;
}
export default function FilterSidebar({ allProps }) {
  const [mounted, setMounted] = useState(false);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [sliderError, setSliderError] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    if (!mounted) return;
    // Fetch categories
    fetch("/api/frontend/category/category-list")
      .then((res) => res.json())
      .then((data) => {
        const categoriesData = data?.data || [];
        setCategories(categoriesData);
        // Pass categories data to parent component
        if (allProps.setCategoriesData) {
          allProps.setCategoriesData(categoriesData);
        }
      });
    // Fetch brands
    fetch("/api/brand")
      .then((res) => res.json())
      .then((data) => setBrands(data?.data || []));
    // Fetch sizes
    fetch("/api/size")
      .then((res) => res.json())
      .then((data) => setSizes(data || []));
    // Fetch colors
    fetch("/api/color")
      .then((res) => res.json())
      .then((data) => {
        const colorsData = data || [];
        setColors(colorsData);
        // Pass colors data to parent component
        if (allProps.setColorsData) {
          allProps.setColorsData(colorsData);
        }
      });
  }, [mounted, allProps.setCategoriesData]);
  if (!mounted) return null;
  return (
    <div className="sidebar-filter canvas-filter left">
      <div className="canvas-wrapper">
        <div className="canvas-header d-flex d-xl-none">
          <h5>Filters</h5>
          <span className="icon-close close-filter" />
        </div>
        <div className="canvas-body">
          <div className="widget-facet facet-categories">
            <h6 className="facet-title">Product Categories</h6>
            <ul className="facet-content">
              {categories.map((category, index) => (
                <li key={category._id || index}>
                  <a
                    href="#"
                    className={`categories-item${allProps.categories && allProps.categories.includes(category._id) ? ' active' : ''}`}
                    onClick={e => {
                      e.preventDefault();
                      // Toggle category selection
                      if (allProps.setCategories) {
                        const currentCategories = allProps.categories || [];
                        const isSelected = currentCategories.includes(category._id);
                        if (isSelected) {
                          allProps.setCategories(currentCategories.filter(id => id !== category._id));
                        } else {
                          allProps.setCategories([...currentCategories, category._id]);
                        }
                      } else if (allProps.setCategory) {
                        allProps.setCategory(category._id);
                      }
                    }}
                  >
                    {category.name || category.title} {" "}
                    <span className="count-cate">({category.productCount || 0})</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="widget-facet facet-price">
            <h6 className="facet-title">Price</h6>

            {RangeSlider && !sliderError ? (
              <RangeSlider
                min={10}
                max={30000}
                value={allProps.price}
                onInput={(value) => allProps.setPrice(value)}
                onError={() => setSliderError(true)}
              />
            ) : (
              <div className="fallback-slider">
                <input
                  type="range"
                  min="10"
                  max="30000"
                  value={allProps.price[0]}
                  onChange={(e) => allProps.setPrice([parseInt(e.target.value), allProps.price[1]])}
                  style={{ width: '100%', marginBottom: '10px' }}
                  suppressHydrationWarning
                />
                <input
                  type="range"
                  min="10"
                  max="30000"
                  value={allProps.price[1]}
                  onChange={(e) => allProps.setPrice([allProps.price[0], parseInt(e.target.value)])}
                  style={{ width: '100%' }}
                  suppressHydrationWarning
                />
              </div>
            )}
            <div className="box-price-product mt-3">
              <div className="box-price-item">
                <span className="title-price">Min price</span>
                <div
                  className="price-val"
                  id="price-min-value"
                  data-currency="₹"
                >
                  ₹{allProps.price[0]}
                </div>
              </div>
              <div className="box-price-item">
                <span className="title-price">Max price</span>
                <div
                  className="price-val"
                  id="price-max-value"
                  data-currency="₹"
                >
                  ₹{allProps.price[1]}
                </div>
              </div>
            </div>
          </div>
          <div className="widget-facet facet-size">
            <h6 className="facet-title">Size</h6>
            <div className="facet-size-box size-box">
              {sizes.map((size, index) => (
                <span
                  key={size._id || index}
                  onClick={() => {
                    const sizeValue = size.value || size.name || size.title;
                    allProps.setSize(sizeValue);
                  }}
                  className={`size-item size-check ${
                    allProps.size === (size.value || size.name || size.title) ? "active" : ""
                  }`}
                >
                  {size.value || size.name || size.title}
                </span>
              ))}
            </div>
          </div>
          <div className="widget-facet facet-color">
            <h6 className="facet-title">Colors</h6>
            <div className="facet-color-box">
              {colors.map((color, index) => (
                <div
                  onClick={() => {
                    const colorValue = color.title || color.name;
                    
                    // Toggle color selection
                    if (allProps.color === colorValue) {
                      allProps.setColor('All');
                    } else {
                      allProps.setColor(colorValue);
                    }
                  }}
                  key={color._id || index}
                  className={`color-item color-check ${
                    (color.title || color.name) === allProps.color ? "active" : ""
                  }`}
                  title={color.name || color.title}
                >
                  <span
                    className="color"
                    style={{
                      backgroundColor: color.code || color.hex || color.value || color.name || color.title,
                      display: 'inline-block',
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      border: '1px solid #ccc',
                      marginRight: 8,
                      verticalAlign: 'middle',
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="widget-facet facet-fieldset">
            <h6 className="facet-title">Availability</h6>
            <div className="box-fieldset-item">
              {availabilityOptions.map((option, index) => {
                // Calculate count for each availability option
                let count = 0;
                if (allProps.products && Array.isArray(allProps.products)) {
                  if (option.value === 'All') {
                    count = allProps.products.length;
                  } else if (option.value === 'In Stock') {
                    count = allProps.products.filter(product => (product.quantity || 0) > 0).length;
                  } else if (option.value === 'Out of Stock') {
                    count = allProps.products.filter(product => (product.quantity || 0) <= 0).length;
                  }
                }
                
                return (
                  <fieldset
                    key={index}
                    className="fieldset-item"
                    onClick={() => allProps.setAvailability(option.value)}
                    suppressHydrationWarning
                  >
                    <input
                      type="radio"
                      name="availability"
                      className="tf-check"
                      readOnly
                      checked={allProps.availability === option.value}
                      suppressHydrationWarning
                    />
                    <label>
                      {option.label}{" "}
                      <span className="count-stock">
                        ({count})
                      </span>
                    </label>
                  </fieldset>
                );
              })}
            </div>
          </div>
          <div className="widget-facet facet-fieldset">
            <h6 className="facet-title">Brands</h6>
            <div className="box-fieldset-item">
              {brands.map((brand, index) => (
                <fieldset
                  key={brand._id || index}
                  className="fieldset-item"
                  onClick={() => allProps.setBrands(brand.title || brand.name || brand.label)}
                  suppressHydrationWarning
                >
                  <input
                    type="checkbox"
                    name="brand"
                    className="tf-check"
                    readOnly
                    checked={allProps.brands.includes(brand.title || brand.name || brand.label)}
                    suppressHydrationWarning
                  />
                  <label>
                    {brand.title || brand.name || brand.label} {" "}
                    {/* No count for now, or you can add if available from backend */}
                  </label>
                </fieldset>
              ))}
            </div>
          </div>
        </div>
        <div className="canvas-bottom d-block d-xl-none">
          <button
            id="reset-filter"
            onClick={allProps.clearFilter}
            className="tf-btn btn-reset"
            suppressHydrationWarning
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
}
