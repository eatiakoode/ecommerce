"use client";

import { useProducts } from "@/hooks/useProducts";
import ProductImage from "./ProductImage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TestImageConnection() {
  const { data: products, isLoading, error } = useProducts();

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Image Connection Test</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="text-blue-600">
            <p>🔄 Loading products...</p>
          </div>
        )}
        
        {error && (
          <div className="text-red-600 mb-4">
            <p>❌ Error: {error.message}</p>
          </div>
        )}
        
        {products && products.length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold mb-4">Product Images Test:</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.slice(0, 8).map((product: any) => (
                <div key={product._id} className="border rounded p-2">
                  <ProductImage
                    src={product.images?.[0]?.url || product.images?.[0]}
                    alt={product.title}
                    width={100}
                    height={100}
                    className="w-full h-24 object-cover rounded"
                  />
                  <p className="text-sm mt-2 truncate">{product.title}</p>
                  <p className="text-xs text-gray-500">
                    Image URL: {product.images?.[0]?.url || product.images?.[0] || 'No image'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 