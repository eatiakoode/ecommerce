"use client";

import Image from "next/image";
import { useState } from "react";

interface ProductImageProps {
  src: string | undefined | null;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

export default function ProductImage({ 
  src, 
  alt, 
  width = 32, 
  height = 32, 
  className = "size-8 rounded-full object-cover" 
}: ProductImageProps) {
  const [imageError, setImageError] = useState(false);

  // Handle different image URL formats
  const getImageSrc = () => {
    // If no src, image error, or src is not a string, use placeholder
    if (!src || imageError || typeof src !== 'string') {
      return "/placeholder-image.jpg";
    }
    
    // If it's already a full URL, use it
    if (src.startsWith('http')) {
      return src;
    }
    
    // If it's a relative path, make it absolute
    if (src.startsWith('/')) {
      return `http://localhost:5000${src}`;
    }
    
    // Default fallback
    return "/placeholder-image.jpg";
  };

  return (
    <Image
      src={getImageSrc()}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => setImageError(true)}
    />
  );
} 