"use client";

import React, { useState } from "react";

const colorOptionsDefault = [
  {
    id: "values-beige",
    value: "Beige",
    color: "beige",
  },
  {
    id: "values-gray",
    value: "Gray",
    color: "gray",
  },
  {
    id: "values-grey",
    value: "Grey",
    color: "grey",
  },
];

export default function ColorSelect({
  activeColor = "",
  setActiveColor,
  colorOptions = colorOptionsDefault,
  colors = [],
}) {
  const [activeColorDefault, setActiveColorDefault] = useState("gray");

  // Color mapping for common colors
  const colorMap = {
    'red': '#ff0000',
    'green': '#00ff00',
    'blue': '#0000ff',
    'yellow': '#ffff00',
    'black': '#000000',
    'white': '#ffffff',
    'gray': '#808080',
    'grey': '#808080',
    'pink': '#ffc0cb',
    'purple': '#800080',
    'orange': '#ffa500',
    'brown': '#a52a2a',
    'navy': '#000080',
    'olive': '#808000',
    'teal': '#008080',
    'maroon': '#800000',
    'lime': '#00ff00',
    'aqua': '#00ffff',
    'silver': '#c0c0c0',
    'fuchsia': '#ff00ff'
  };

  const handleSelectColor = (value) => {
    if (setActiveColor) {
      setActiveColor(value);
    } else {
      setActiveColorDefault(value);
    }
  };

  // Use colors from backend if available, otherwise use default colorOptions
  const availableColors = colors.length > 0 ? colors : colorOptions;

  // Transform backend colors to match expected format
  const transformedColors = availableColors.map((color, index) => {
    // Handle different backend color structures
    if (color._id) {
      // Backend color structure: { _id, title, name, value, color }
      const colorName = color.title || color.name || `Color ${index + 1}`;
      const colorValue = color.color || color.title?.toLowerCase() || color.name?.toLowerCase() || `color-${index + 1}`;
      
      return {
        id: color._id,
        value: colorName,
        color: colorValue,
        originalColor: color
      };
    } else if (color.id) {
      // Already in correct format
      return color;
    } else {
      // Fallback for other structures
      const colorName = color.value || color.title || color.name || `Color ${index + 1}`;
      const colorValue = (color.color || color.value || color.title || color.name || `color-${index}`).toLowerCase();
      
      return {
        id: `color-${index}`,
        value: colorName,
        color: colorValue,
        originalColor: color
      };
    }
  });

  

  return (
    <div className="variant-picker-item">
      <div className="variant-picker-label mb_12">
        Colors:
        <span
          className="text-title variant-picker-label-value value-currentColor"
          style={{ textTransform: "capitalize" }}
        >
          {activeColor || activeColorDefault}
        </span>
      </div>
      <div className="variant-picker-values">
        {transformedColors.map(({ id, value, color }) => {
          // Get the actual color value for display
          let displayColor = colorMap[color];
          
          // If not in colorMap, try to use the color value directly
          if (!displayColor) {
            // Check if it's already a hex color
            if (color.startsWith('#')) {
              displayColor = color;
            } else {
              // Try to convert common color names to hex
              const colorName = color.toLowerCase();
              displayColor = colorMap[colorName] || '#cccccc'; // Default gray if not found
            }
          }
          
  
          
          return (
            <React.Fragment key={id}>
              <input
                id={id}
                type="radio"
                readOnly
                checked={
                  activeColor ? activeColor === color : activeColorDefault === color
                }
              />
              <label
                onClick={() => {
                  handleSelectColor(color);
                }}
                className={`hover-tooltip tooltip-bot radius-60 color-btn ${
                  activeColor
                    ? activeColor === color
                      ? "active"
                      : ""
                    : activeColorDefault === color
                    ? "active"
                    : ""
                }`}
                htmlFor={id}
              >
                <span 
                  className="btn-checkbox"
                  style={{
                    backgroundColor: displayColor,
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    display: 'inline-block',
                    border: '2px solid #ddd',
                    cursor: 'pointer',
                    marginRight: '5px'
                  }}
                />
                <span className="tooltip">{value}</span>
              </label>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
