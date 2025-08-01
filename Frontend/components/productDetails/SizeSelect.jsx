"use client";

import { useState } from "react";

export default function SizeSelect({ sizes = [], selectedSize, setSelectedSize }) {
  const handleChange = (value) => {
    setSelectedSize(value);
  };

  // If no sizes are available, don't render the component
  if (!sizes || sizes.length === 0) {
    return null;
  }

  // Transform backend sizes to match expected format
  const transformedSizes = sizes.map((size, index) => {
    // Handle different backend size structures
    if (size._id) {
      // Backend size structure: { _id, name, value, etc. }
      return {
        _id: size._id,
        name: size.name || `Size ${index + 1}`,
        value: size.value || size.name || `size-${index + 1}`,
        disabled: size.disabled || false,
        originalSize: size
      };
    } else if (size.id) {
      // Already in correct format
      return size;
    } else {
      // Fallback for other structures
      return {
        _id: `size-${index}`,
        name: size.name || size.value || `Size ${index + 1}`,
        value: size.value || size.name || `size-${index}`,
        disabled: size.disabled || false,
        originalSize: size
      };
    }
  });

  

  return (
    <div className="variant-picker-item">
      <div className="d-flex justify-content-between mb_12">
        <div className="variant-picker-label">
          selected size:
          <span className="text-title variant-picker-label-value">
            {selectedSize || transformedSizes[0]?.value || "Select Size"}
          </span>
        </div>
        <a
          href="#size-guide"
          data-bs-toggle="modal"
          className="size-guide text-title link"
        >
          Size Guide
        </a>
      </div>
      <div className="variant-picker-values gap12">
        {transformedSizes.map((size) => (
          <div key={size._id || size.value} onClick={() => handleChange(size.value)}>
            <input
              type="radio"
              id={`size-${size._id || size.value}`}
              checked={selectedSize === size.value}
              disabled={size.disabled || false}
              readOnly
            />
            <label
              className={`style-text size-btn ${
                size.disabled ? "type-disable" : ""
              }`}
              htmlFor={`size-${size._id || size.value}`}
              data-value={size.value}
            >
              <span className="text-title">{size.value || size.name || size.value}</span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
