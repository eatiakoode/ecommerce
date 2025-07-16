"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Plus, Sparkles, Tag, FileText, CheckCircle } from "lucide-react";

export default function AddCategoryPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await axios.post("/api/categories", {
        name,
        description,
      });

      alert("Category added successfully!");
      router.push("/categories"); // go back to category list page
    } catch (error) {
      console.error("Failed to add category:", error);
      alert("Something went wrong. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    router.push("/categories");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-8 px-4">


      <div className="max-w-2xl mx-auto relative">
        {/* Header Section */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={handleGoBack}
            className="mb-4 hover:bg-white/50 dark:hover:bg-slate-800/50 transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Categories
          </Button>
          
          <div className="flex items-center gap-4 mb-2">
            <div className="flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg">
              <Plus className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                Add New Category
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Create a new category to organize your content
              </p>
            </div>
          </div>
        </div>

        {/* Main Form Card */}
        <Card className="relative overflow-hidden border-0 shadow-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl">
          
          {/* Header decoration */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
          
          <CardContent className="p-8">
            {/* Form Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Category Details
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Fill in the information below to create your new category
              </p>
            </div>

            {/* Form Fields */}
            <div className="space-y-6">
              {/* Category Name Field */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Tag className="w-4 h-4" />
                  Category Name
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Enter a descriptive category name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-12 bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  />
                  {name && (
                    <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
                  )}
                </div>
              </div>

              {/* Category Description Field */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <FileText className="w-4 h-4" />
                  Description
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Provide a brief description of this category"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="h-12 bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 dark:focus:ring-purple-400/20 transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  />
                  {description && (
                    <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
                  )}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button
                  onClick={handleSubmit}
                  disabled={!name || isLoading}
                  className="group relative overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white border-0 shadow-xl hover:shadow-emerald-500/25 transition-all duration-300 h-12 flex-1 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                  <Plus className="relative mr-2 w-5 h-5" />
                  <span className="relative font-semibold">
                    {isLoading ? "Adding Category..." : "Add Category"}
                  </span>
                  <div className="absolute inset-0 -top-2 -left-2 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-lg blur opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
                </Button>

                <Button
                  variant="outline"
                  onClick={handleGoBack}
                  className="border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-slate-800 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-300 h-12 flex-1 sm:flex-none sm:px-8 hover:scale-105"
                >
                  Cancel
                </Button>
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="mt-8 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-700 border border-blue-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg">
                  <span className="text-white text-sm font-bold">1</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Step 1 of 1: Basic Information
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {name ? "Ready to create your category!" : "Enter the category name to continue"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tips Section */}
        <Card className="mt-6 border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              Tips for Creating Categories
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                Use clear, descriptive names that are easy to understand
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                Keep descriptions concise but informative
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                Consider how this category fits into your overall organization
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}