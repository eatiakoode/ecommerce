import React from "react";

export default function FilterMeta({ allProps, productLength }) {
  // Helper function to get category name by ID
  const getCategoryName = (categoryId) => {
    // Try to find category in the categories array from FilterSidebar
    if (allProps.categoriesData && Array.isArray(allProps.categoriesData)) {
      const category = allProps.categoriesData.find(cat => cat._id === categoryId);
      if (category) {
        return category.name || category.title;
      }
    }
    // Fallback to categoryId if no name found
    return categoryId;
  };

  // Helper function to get color name
  const getColorName = (colorValue) => {
    // Try to find color in the colors array passed from FilterSidebar
    if (allProps.colorsData && Array.isArray(allProps.colorsData)) {
      const color = allProps.colorsData.find(c => 
        (c.title || c.name || c.value) === colorValue
      );
      if (color) {
        return color.title || color.name || color.value;
      }
    }
    // Fallback to colorValue if no name found
    return colorValue;
  };

  return (
    <div className="meta-filter-shop" style={{}}>
      <div id="product-count-grid" className="count-text">
        <span className="count">{productLength}</span> Products Found
      </div>

      <div id="applied-filters">
        {allProps.availability !== "All" ? (
          <span
            className="filter-tag"
            onClick={() => allProps.setAvailability("All")}
          >
            {allProps.availability}
            <span className="remove-tag icon-close" />
          </span>
        ) : (
          ""
        )}
        {allProps.size !== "All" ? (
          <span className="filter-tag" onClick={() => allProps.setSize("All")}>
            {allProps.size}
            <span className="remove-tag icon-close" />
          </span>
        ) : (
          ""
        )}
        {allProps.color && allProps.color !== 'All' ? (
            <span
              className="filter-tag"
              onClick={() => allProps.setColor('All')}
            >
              {getColorName(allProps.color)}
              <span className="remove-tag icon-close" />
            </span>
          ) : null}

        {allProps.categories && allProps.categories.length > 0 ? (
          <React.Fragment>
            {allProps.categories.map((categoryId, i) => (
              <span
                key={i}
                className="filter-tag"
                onClick={() => {
                  const updatedCategories = allProps.categories.filter(id => id !== categoryId);
                  allProps.setCategories(updatedCategories);
                }}
              >
                {getCategoryName(categoryId)}
                <span className="remove-tag icon-close" />
              </span>
            ))}
          </React.Fragment>
        ) : (
          ""
        )}

        {allProps.brands.length ? (
          <React.Fragment>
            {allProps.brands.map((brand, i) => (
              <span
                key={i}
                className="filter-tag"
                onClick={() => allProps.removeBrand(brand)}
              >
                {brand}
                <span className="remove-tag icon-close" />
              </span>
            ))}
          </React.Fragment>
        ) : (
          ""
        )}
      </div>
      {allProps.availability !== "All" ||
      allProps.size !== "All" ||
      allProps.color !== "All" ||
      allProps.categories && allProps.categories.length > 0 ||
      allProps.brands.length ? (
        <button
          id="remove-all"
          className="remove-all-filters text-btn-uppercase"
          onClick={allProps.clearFilter}
          suppressHydrationWarning
        >
          REMOVE ALL <i className="icon icon-close" />
        </button>
      ) : (
        ""
      )}
    </div>
  );
}
