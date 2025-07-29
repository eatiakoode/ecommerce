"use client";

import { useEffect, useState } from "react";
// import { productMain } from "@/data/products";
import "react-range-slider-input/dist/style.css";
const availabilityOptions = [
  { label: "In stock", value: true },
  { label: "Out of stock", value: false },
];

let RangeSlider;
try {
  RangeSlider = require("react-range-slider-input").default;
} catch (error) {
  console.warn("RangeSlider component could not be loaded:", error);
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
      .then((data) => setCategories(data?.data || []));
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
      .then((data) => setColors(data || []));
  }, [mounted]);
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
                      if (allProps.setCategories) {
                        allProps.setCategories([category._id]);
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
                max={450}
                value={allProps.price}
                onInput={(value) => allProps.setPrice(value)}
                onError={() => setSliderError(true)}
              />
            ) : (
              <div className="fallback-slider">
                <input
                  type="range"
                  min="10"
                  max="450"
                  value={allProps.price[0]}
                  onChange={(e) => allProps.setPrice([parseInt(e.target.value), allProps.price[1]])}
                  style={{ width: '100%', marginBottom: '10px' }}
                  suppressHydrationWarning
                />
                <input
                  type="range"
                  min="10"
                  max="450"
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
                  data-currency="$"
                >
                  {allProps.price[0]}
                </div>
              </div>
              <div className="box-price-item">
                <span className="title-price">Max price</span>
                <div
                  className="price-val"
                  id="price-max-value"
                  data-currency="$"
                >
                  {allProps.price[1]}
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
                  onClick={() => allProps.setSize(size.value || size.name || size.title || size)}
                  className={`size-item size-check ${
                    allProps.size === (size.value || size.name || size.title || size) ? "active" : ""
                  }`}
                >
                  {size.value || size.name || size.title || size}
                </span>
              ))}
              <span
                className={`size-item size-check free-size ${
                  allProps.size == "Free Size" ? "active" : ""
                } `}
                onClick={() => allProps.setSize("Free Size")}
              >
                Free Size
              </span>
            </div>
          </div>
          <div className="widget-facet facet-color">
            <h6 className="facet-title">Colors</h6>
            <div className="facet-color-box">
              {colors.map((color, index) => (
                <div
                  onClick={() => allProps.setColor(color)}
                  key={color._id || index}
                  className={`color-item color-check ${
                    color == allProps.color ? "active" : ""
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
              {availabilityOptions.map((option, index) => (
                <fieldset
                  key={index}
                  className="fieldset-item"
                  onClick={() => allProps.setAvailability(option)}
                  suppressHydrationWarning
                >
                  <input
                    type="radio"
                    name="availability"
                    className="tf-check"
                    readOnly
                    checked={allProps.availability === option}
                    suppressHydrationWarning
                  />
                  <label>
                    {option.label}{" "}
                    <span className="count-stock">
                      (
                      {
                        // productMain.filter((el) => el.inStock == option.value)
                        //   .length
                      }
                      )
                    </span>
                  </label>
                </fieldset>
              ))}
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
