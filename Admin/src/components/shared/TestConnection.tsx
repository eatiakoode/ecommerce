"use client";

import { useProducts } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";

export default function TestConnection() {
  const { data: products, isLoading, error, refetch } = useProducts();

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">API Connection Test</h3>
      
      {isLoading && <p>Loading products...</p>}
      
      {error && (
        <div className="text-red-500">
          <p>Error: {error.message}</p>
          <Button onClick={() => refetch()} className="mt-2">
            Retry
          </Button>
        </div>
      )}
      
      {products && (
        <div className="text-green-500">
          <p>✅ API Connection Successful!</p>
          <p>Products loaded: {products.data?.length || 0}</p>
        </div>
      )}
      
      <Button onClick={() => refetch()} className="mt-2">
        Test Connection
      </Button>
    </div>
  );
} 