"use client";

import LayoutHandler from "./LayoutHandler";
import Sorting from "./Sorting";
import Listview from "./Listview";
import GridView from "./GridView";
import { useEffect, useReducer, useState } from "react";
import FilterModal from "./FilterModal";
import { initialState, reducer } from "@/reducer/filterReducer";
import { productMain } from "@/data/products";
import FilterMeta from "./FilterMeta";
import FilterSidebar from "./FilterSidebar";
import Pagination from "../common/Pagination";

export default function Products11() {
  const [activeLayout, setActiveLayout] = useState(4);
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    price,
    availability,
    color,
    size,
    brands,
    categories,
    filtered,
    sortingOption,
    sorted,
    activeFilterOnSale,
    currentPage,
    itemPerPage,
  } = state;

  const [categoriesData, setCategoriesData] = useState([]);
  const [colorsData, setColorsData] = useState([]);
  const allProps = {
    ...state,
    setPrice: (value) => dispatch({ type: "SET_PRICE", payload: value }),

    setColor: (value) => {
      value == color
        ? dispatch({ type: "SET_COLOR", payload: "All" })
        : dispatch({ type: "SET_COLOR", payload: value });
    },
    setSize: (value) => {
      value == size
        ? dispatch({ type: "SET_SIZE", payload: "All" })
        : dispatch({ type: "SET_SIZE", payload: value });
    },
    setAvailability: (value) => {
      dispatch({ type: "SET_AVAILABILITY", payload: value });
    },

    setBrands: (newBrand) => {
      const updated = [...brands].includes(newBrand)
        ? [...brands].filter((elm) => elm != newBrand)
        : [...brands, newBrand];
      dispatch({ type: "SET_BRANDS", payload: updated });
    },
    setCategories: (newCategories) => {
      dispatch({ type: "SET_CATEGORIES", payload: newCategories });
    },
    setCategoriesData: (data) => {
      setCategoriesData(data);
    },
    removeBrand: (newBrand) => {
      const updated = [...brands].filter((brand) => brand != newBrand);

      dispatch({ type: "SET_BRANDS", payload: updated });
    },
    setSortingOption: (value) =>
      dispatch({ type: "SET_SORTING_OPTION", payload: value }),
    toggleFilterWithOnSale: () => dispatch({ type: "TOGGLE_FILTER_ON_SALE" }),
    setCurrentPage: (value) =>
      dispatch({ type: "SET_CURRENT_PAGE", payload: value }),
    setItemPerPage: (value) => {
      dispatch({ type: "SET_CURRENT_PAGE", payload: 1 }),
        dispatch({ type: "SET_ITEM_PER_PAGE", payload: value });
    },
    clearFilter: () => {
      dispatch({ type: "CLEAR_FILTER" });
    },
  };

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Apply filters to products
  const applyFilters = (productsToFilter) => {
    let filteredProducts = [...productsToFilter];


    // Filter by price range
    if (price && price.length === 2) {
      const beforePriceFilter = filteredProducts.length;
      filteredProducts = filteredProducts.filter(
        product => {
          const productPrice = product.price || product.sellingPrice || 0;
          return productPrice >= price[0] && productPrice <= price[1];
        }
      );

    }

    // Filter by size
    if (size !== 'All') {
      const beforeSizeFilter = filteredProducts.length;
      filteredProducts = filteredProducts.filter(product => {
        // Check if product has sizes array (mapped structure)
        if (product.sizes && Array.isArray(product.sizes)) {
          return product.sizes.some(s => {
            const sizeName = s.name || s.value || s.title || '';
            const sizeValue = size || '';
            return sizeName.toLowerCase() === sizeValue.toLowerCase() || 
                   sizeName.toLowerCase().includes(sizeValue.toLowerCase()) ||
                   sizeValue.toLowerCase().includes(sizeName.toLowerCase());
          });
        }
        // Check if product has size field from backend (original structure)
        if (product.size && Array.isArray(product.size)) {
          return product.size.some(s => {
            const sizeName = s.name || s.value || s.title || '';
            const sizeValue = size || '';
            return sizeName.toLowerCase() === sizeValue.toLowerCase() || 
                   sizeName.toLowerCase().includes(sizeValue.toLowerCase()) ||
                   sizeValue.toLowerCase().includes(sizeName.toLowerCase());
          });
        }
        return false;
      });
    }

    // Filter by color
    if (color !== 'All') {
      const beforeColorFilter = filteredProducts.length;
      filteredProducts = filteredProducts.filter(product => {
        // Check if product has colors array (mapped structure)
        if (product.colors && Array.isArray(product.colors)) {
          const hasColor = product.colors.some(c => {
            const colorName = c.name || c.title || c.value || '';
            const colorValue = color || '';
            return colorName.toLowerCase() === colorValue.toLowerCase() || 
                   colorName.toLowerCase().includes(colorValue.toLowerCase()) ||
                   colorValue.toLowerCase().includes(colorName.toLowerCase());
          });
          return hasColor;
        }
        // Check if product has color field from backend (original structure)
        if (product.color && Array.isArray(product.color)) {
          const hasColor = product.color.some(c => {
            const colorName = c.name || c.title || c.value || '';
            const colorValue = color || '';
            return colorName.toLowerCase() === colorValue.toLowerCase() || 
                   colorName.toLowerCase().includes(colorValue.toLowerCase()) ||
                   colorValue.toLowerCase().includes(colorName.toLowerCase());
          });
          return hasColor;
        }
        // Check if product has single color object
        if (product.color && typeof product.color === 'object') {
          const colorName = product.color.name || product.color.title || product.color.value || '';
          const colorValue = color || '';
          return colorName.toLowerCase() === colorValue.toLowerCase() || 
                 colorName.toLowerCase().includes(colorValue.toLowerCase()) ||
                 colorValue.toLowerCase().includes(colorName.toLowerCase());
        }
        return false;
      });
    }

    // Filter by availability
    if (availability !== 'All') {
      const beforeAvailabilityFilter = filteredProducts.length;
      filteredProducts = filteredProducts.filter(product => {
        const productQuantity = product.quantity || 0;
        if (availability === 'In Stock') {
          return productQuantity > 0;
        } else if (availability === 'Out of Stock') {
          return productQuantity <= 0;
        }
        return true;
      });
    }

    // Filter by brands
    if (brands.length > 0) {
      const beforeBrandFilter = filteredProducts.length;
      filteredProducts = filteredProducts.filter(product => {
        const productBrand = product.brand?.title || product.brand?.name || product.brand;
        return productBrand && brands.includes(productBrand);
      });

    }

    // Filter by categories
    if (categories && categories.length > 0) {
      const beforeCategoryFilter = filteredProducts.length;
      filteredProducts = filteredProducts.filter(product => {
        if (product.categories && Array.isArray(product.categories)) {
          return product.categories.some(cat => 
            categories.includes(cat._id) || categories.includes(cat)
          );
        }
        return false;
      });

    }

    // Filter by sale items
    if (activeFilterOnSale) {
      const beforeSaleFilter = filteredProducts.length;
      filteredProducts = filteredProducts.filter(product => {
        const mrp = product.MRP || product.oldPrice || 0;
        const sellingPrice = product.sellingPrice || product.price || 0;
        return mrp > sellingPrice;
      });

    }

    
    return filteredProducts;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch all products using the correct endpoint
        const res = await fetch(`http://localhost:5000/api/frontend/product/lists`);
        const result = await res.json();
        
        let fetchedProducts = [];
        if (result.success && Array.isArray(result.data)) {
          fetchedProducts = result.data;
        } else if (Array.isArray(result)) {
          fetchedProducts = result;
        } else {
  
          fetchedProducts = [];
        }

        // Map backend data structure to frontend expected structure
        const mappedProducts = fetchedProducts.map(product => {
          const mappedProduct = {
            ...product,
            // Map _id to id for frontend compatibility
            id: product._id || product.id,
            // Ensure price fields are properly mapped
            price: product.sellingPrice || product.price || 0,
            oldPrice: product.MRP || product.oldPrice || 0,
            // Map title properly
            title: product.title || product.name || 'Product',
            // Map images properly
            imgSrc: product.images?.[0]?.url || product.imgSrc || '/images/products/womens/women-1.jpg',
            imgHover: product.images?.[1]?.url || product.imgHover || product.images?.[0]?.url || '/images/products/womens/women-1.jpg',
            // Map slug for product links
            slug: product.slug || product._id || product.id,
            // Map description
            shortDescription: product.shortDescription || product.description || 'Product description not available',
            // Map brand
            brand: product.brand?.title || product.brand || 'Unknown Brand',
            // Map category
            category: product.categories?.[0]?.name || product.category || 'General',
            // Map colors
            colors: product.color ? product.color.map(color => ({
              name: color.title || color.name,
              bgColor: color.title?.toLowerCase() || 'bg-gray',
              imgSrc: product.images?.[0]?.url || '/images/products/womens/women-1.jpg'
            })) : [],
            // Map sizes
            sizes: product.size ? product.size.map(size => ({
              name: size.name || size.value,
              isAvailable: true
            })) : [],
            // Calculate discount percentage
            discount: product.MRP && product.sellingPrice ? Math.round(((product.MRP - product.sellingPrice) / product.MRP) * 100) : 0,
            // Map quantity
            quantity: product.quantity || 0,
            // Map SKU
            sku: product.SKU || product.sku || '',
            // Map tags
            tags: product.tags || '',
            // Set sale status
            isOnSale: product.MRP && product.sellingPrice && product.MRP > product.sellingPrice,
            // Set hot sale status
            hotSale: false,
            // Set countdown (if any)
            countdown: null,
            // Set sale text
            saleText: product.MRP && product.sellingPrice && product.MRP > product.sellingPrice ? 
              `-${Math.round(((product.MRP - product.sellingPrice) / product.MRP) * 100)}%` : '',
            // Set wow delay for animations
            wowDelay: '0.1s'
          };
          return mappedProduct;
        });

        setProducts(mappedProducts);
        
        // Apply initial filters
        const filteredProducts = applyFilters(mappedProducts);
        dispatch({ type: "SET_FILTERED", payload: filteredProducts });
      } catch (err) {

        setError('Failed to fetch products');
        setProducts([]);
        dispatch({ type: "SET_FILTERED", payload: [] });
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Re-apply filters when filter state changes
  useEffect(() => {
    if (products.length > 0) {
      const filteredProducts = applyFilters(products);
      dispatch({ type: "SET_FILTERED", payload: filteredProducts });
    }
  }, [price, size, color, availability, brands, categories, activeFilterOnSale, products]);

  useEffect(() => {
    if (sortingOption === "Price Ascending") {
      dispatch({
        type: "SET_SORTED",
        payload: [...filtered].sort((a, b) => a.price - b.price),
      });
    } else if (sortingOption === "Price Descending") {
      dispatch({
        type: "SET_SORTED",
        payload: [...filtered].sort((a, b) => b.price - a.price),
      });
    } else if (sortingOption === "Title Ascending") {
      dispatch({
        type: "SET_SORTED",
        payload: [...filtered].sort((a, b) => a.title.localeCompare(b.title)),
      });
    } else if (sortingOption === "Title Descending") {
      dispatch({
        type: "SET_SORTED",
        payload: [...filtered].sort((a, b) => b.title.localeCompare(a.title)),
      });
    } else {
      dispatch({ type: "SET_SORTED", payload: filtered });
    }
    dispatch({ type: "SET_CURRENT_PAGE", payload: 1 });
  }, [filtered, sortingOption]);

  // Reset to page 1 when filters change
  useEffect(() => {
    dispatch({ type: "SET_CURRENT_PAGE", payload: 1 });
  }, [filtered, color, size, availability, brands, categories, price, activeFilterOnSale]);

  // Calculate pagination
  const totalPages = Math.ceil(sorted.length / itemPerPage);
  const startIndex = (currentPage - 1) * itemPerPage;
  const endIndex = startIndex + itemPerPage;
  const paginatedProducts = sorted.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page) => {
    dispatch({ type: "SET_CURRENT_PAGE", payload: page });
  };

  return (
    <>
      <section className="flat-spacing">
        <div className="container">
          <div className="tf-shop-control">
            <div className="tf-control-filter">
              <button 
                className="filterShop tf-btn-filter hidden-mx-1200"
                suppressHydrationWarning
              >
                <span className="icon icon-filter" />
                <span className="text">Filters</span>
              </button>
              <a
                href="#filterShop"
                data-bs-toggle="offcanvas"
                aria-controls="filterShop"
                className="tf-btn-filter show-mx-1200"
              >
                <span className="icon icon-filter" />
                <span className="text">Filters</span>
              </a>
              <div
                onClick={allProps.toggleFilterWithOnSale}
                className={`d-none d-lg-flex shop-sale-text ${
                  activeFilterOnSale ? "active" : ""
                }`}
              >
                <i className="icon icon-checkCircle" />
                <p className="text-caption-1">Shop sale items only</p>
              </div>
            </div>
            <ul className="tf-control-layout">
              <LayoutHandler
                setActiveLayout={setActiveLayout}
                activeLayout={activeLayout}
                hasSidebar
              />
            </ul>
            <div className="tf-control-sorting">
              <p className="d-none d-lg-block text-caption-1">Sort by:</p>
              <Sorting allProps={allProps} />
            </div>
          </div>
          <div className="wrapper-control-shop">
            <FilterMeta productLength={paginatedProducts.length} allProps={{...allProps, categoriesData, colorsData}} />
            <div className="row">
              <div className="col-xl-3">
                <FilterSidebar allProps={{...allProps, products, setCategoriesData, setColorsData}} />
              </div>
              <div className="col-xl-9">
                {loading ? (
                  <div style={{ textAlign: 'center', padding: '50px' }}>
                    <p>Loading products...</p>
                  </div>
                ) : error ? (
                  <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
                    <p>{error}</p>
                  </div>
                ) : activeLayout == 1 ? (
                  <div className="tf-list-layout wrapper-shop" id="listLayout">
                    <Listview products={paginatedProducts} pagination={false} />
                  </div>
                ) : (
                  <div
                    className={`tf-grid-layout wrapper-shop tf-col-${activeLayout}`}
                    id="gridLayout"
                  >
                    <GridView products={paginatedProducts} pagination={false} />
                  </div>
                )}
              </div>
            </div>
            {/* Pagination */}
            {totalPages > 1 && (
              <ul className="wg-pagination justify-content-center">
                <Pagination 
                  totalPages={totalPages}
                  currentPage={currentPage}
                  onPageChange={handlePageChange}
                />
              </ul>
            )}
          </div>
        </div>
      </section>{" "}
      <FilterModal allProps={allProps} />
    </>
  );
}
