"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "sonner";
import axios from "@/helpers/axiosInstance";

export default function TestAPI() {
  const [loading, setLoading] = useState(false);
  const [testResult, setTestResult] = useState<string>("");

  const testConnection = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/product");
      setTestResult(`✅ Connection successful! Found ${response.data.length} products`);
      toast.success("API connection successful!");
    } catch (error: any) {
      setTestResult(`❌ Connection failed: ${error.message}`);
      toast.error("API connection failed!");
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const testCreateProduct = async () => {
    setLoading(true);
    try {
      const testProduct = {
        title: "Test Product",
        slug: "test-product",
        description: "This is a test product",
        price: 99.99,
        category: "Electronics",
        brand: "Test Brand",
        quantity: 10,
        sold: 0,
        totalrating: 0,
        tags: "test, product",
        images: [],
        color: [],
        ratings: [],
      };

      const response = await axios.post("/product", testProduct);
      setTestResult(`✅ Product created successfully! ID: ${response.data._id}`);
      toast.success("Test product created successfully!");
    } catch (error: any) {
      setTestResult(`❌ Create product failed: ${error.response?.data?.message || error.message}`);
      toast.error("Create product failed!");
      console.error("Create Product Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <h2 className="text-xl font-semibold">API Connection Test</h2>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4">
          <Button onClick={testConnection} disabled={loading}>
            {loading ? "Testing..." : "Test Connection"}
          </Button>
          <Button onClick={testCreateProduct} disabled={loading} variant="secondary">
            {loading ? "Creating..." : "Test Create Product"}
          </Button>
        </div>
        {testResult && (
          <div className="p-4 bg-gray-100 rounded-md">
            <p className="text-sm">{testResult}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 