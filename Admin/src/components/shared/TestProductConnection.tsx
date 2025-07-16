"use client";

import { useProducts } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TestProductConnection() {
  const { data: products, isLoading, error, refetch } = useProducts();

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Product API Connection Test</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="text-blue-600">
            <p>🔄 Loading products from API...</p>
          </div>
        )}
        
        {error && (
          <div className="text-red-600 mb-4">
            <p>❌ Error: {error.message}</p>
            <Button onClick={() => refetch()} className="mt-2">
              Retry
            </Button>
          </div>
        )}
        
        {products && (
          <div className="text-green-600 mb-4">
            <p>✅ API Connection Successful!</p>
            <p>📊 Products loaded: {products.length}</p>
          </div>
        )}
        
        {products && products.length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Sample Products:</h3>
            <div className="space-y-2">
              {products.slice(0, 3).map((product: any) => (
                <div key={product._id} className="p-2 border rounded">
                  <p><strong>Name:</strong> {product.title}</p>
                  <p><strong>Price:</strong> ${product.price}</p>
                  <p><strong>Category:</strong> {product.category}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <Button onClick={() => refetch()} className="mt-4">
          Test Connection
        </Button>
      </CardContent>
    </Card>
  );
} 