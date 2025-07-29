
"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";
import slugify from "slugify";
import { getSizes } from "@/api/size";
// TODO: Import getColors API when available
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import axiosInstance from "@/helpers/axiosInstance";
import { X, Plus, Upload, ChevronDown, Check } from "lucide-react";
import { updateProduct } from "@/api/product";
import { useBrands } from "@/hooks/useBrands";
import { getCategories } from "@/api/category";
// import { getSizes } from "@/api/size";

export default function EditProduct({
  product,
  onClose,
  categories: initialCategories = [],
}: {
  product?: any;
  onClose?: () => void;
  categories?: any[];
}) {
  const [colors, setColors] = useState<any[]>([]);
  const [sizes, setSizes] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>(initialCategories);
  const { brands, loading: brandsLoading, refreshBrands } = useBrands();
  const [selectedColors, setSelectedColors] = useState<any[]>(product?.color || []);
  const [selectedSizes, setSelectedSizes] = useState<any[]>(product?.size || []);
  const [selectedCategories, setSelectedCategories] = useState<any[]>(product?.categories || []);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [customColorName, setCustomColorName] = useState("");
  const [sizeDropdownOpen, setSizeDropdownOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [isLoadingColors, setIsLoadingColors] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isSubmitting, errors },
  } = useForm({
    defaultValues: {
    title: product?.title || "",
    slug: product?.slug || "",
      SKU: product?.SKU || "",
      brand: product?.brand?._id || product?.brand || "",
      MRP: product?.MRP || product?.mrp || "",
      sellingPrice: product?.sellingPrice || product?.salePrice || "",
    quantity: product?.quantity || "",
    shortDescription: product?.shortDescription || "",
      longDescription: product?.longDescription || product?.description || "",
    tags: product?.tags || "",
    },
  });
  const titleValue = watch("title");
  // Default color palette
  const defaultColors = [
    { _id: 'default-1', title: 'Red' },
    { _id: 'default-2', title: 'Blue' },
    { _id: 'default-3', title: 'Green' },
    { _id: 'default-4', title: 'Yellow' },
    { _id: 'default-5', title: 'Black' },
    { _id: 'default-6', title: 'White' },
    { _id: 'default-7', title: 'Gray' },
    { _id: 'default-8', title: 'Cyan' },
    { _id: 'default-9', title: 'Orange' },
    { _id: 'default-10', title: 'Pink' }
  ];
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setIsLoadingColors(true);
        const [colorRes, sizeRes, categoryRes] = await Promise.all([
          axiosInstance.get("/color"),
          axiosInstance.get("/size"),
          axiosInstance.get("/category"),
        ]);
        const apiColors = Array.isArray(colorRes.data) ? colorRes.data : [];
        setColors(apiColors.length > 0 ? apiColors : defaultColors);
        setSizes(Array.isArray(sizeRes.data) ? sizeRes.data : []);
        let catData = categoryRes.data;
        if (Array.isArray(catData)) {
          setCategories(catData);
        } else if (Array.isArray(catData.categories)) {
          setCategories(catData.categories);
        } else if (catData && catData._id) {
          setCategories([catData]);
        } else {
          setCategories([]);
        }
      } catch (error) {
        setColors(defaultColors);
        toast.error("Failed to fetch dropdown data");
      } finally {
        setIsLoadingColors(false);
      }
    };
    fetchOptions();
  }, []);
  useEffect(() => {
    if (titleValue) {
      const slug = titleValue
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9\-]/g, "");
      setValue("slug", slug);
      // Auto-generate SKU from title
      const sku = titleValue
        .toUpperCase()
        .replace(/\s+/g, "")
        .replace(/[^A-Z0-9]/g, "")
        .substring(0, 10) + Date.now().toString().slice(-4);
      setValue("SKU", sku);
    }
  }, [titleValue, setValue]);
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const selectedFiles = Array.from(files);
      setImages([...images, ...selectedFiles]);
      selectedFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreviews((prev) => [...prev, e.target?.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };
  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImages(newImages);
    setImagePreviews(newPreviews);
  };
  const handleColorSelect = (color: any) => {
    if (!selectedColors.find((c) => c._id === color._id)) {
      setSelectedColors([...selectedColors, color]);
    }
  };
  const removeSelectedColor = (colorId: string) => {
    setSelectedColors(selectedColors.filter((c) => c._id !== colorId));
  };
  const handleSizeSelect = (size: any) => {
    if (selectedSizes.find((s) => s._id === size._id)) {
      setSelectedSizes(selectedSizes.filter((s) => s._id !== size._id));
    } else {
      setSelectedSizes([...selectedSizes, size]);
    }
  };
  const handleCategorySelect = (category: any) => {
    if (selectedCategories.find((c) => c._id === category._id)) {
      setSelectedCategories(selectedCategories.filter((c) => c._id !== category._id));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };
  const handleAddCustomColor = async () => {
    if (!customColorName.trim()) {
      toast.error("Please enter a color name");
      return;
    }
    if (colors.find(c => (c.title || '').toLowerCase() === customColorName.toLowerCase())) {
      toast.error("Color name already exists");
      return;
    }
    try {
      setIsLoadingColors(true);
      const response = await axiosInstance.post("/color", { title: customColorName.trim() });
      const newColor = response.data;
      setColors((prev) => [...prev, newColor]);
      setSelectedColors((prev) => [...prev, newColor]);
      toast.success(`Color "${customColorName}" added successfully!`);
      setCustomColorName("");
    } catch (error: any) {
      toast.error("Failed to add color");
    } finally {
      setIsLoadingColors(false);
    }
  };
  const onSubmit = async (data: any) => {
    if (selectedColors.length === 0) {
      toast.error("Please select at least one color");
      return;
    }
    if (selectedSizes.length === 0) {
      toast.error("Please select at least one size");
      return;
    }
    if (selectedCategories.length === 0) {
      toast.error("Please select at least one category");
      return;
    }
    setLoading(true);
    try {
      // Ensure all selected colors exist in the backend and have an _id
      const colorIds: string[] = [];
      for (const color of selectedColors) {
        if (!color._id || color._id.startsWith('default-')) {
          const res = await axiosInstance.post("/color", { title: color.title || color.name });
          colorIds.push(res.data._id);
        } else {
          colorIds.push(color._id);
        }
      }
      const formData = new FormData();
      images.forEach((img) => formData.append("images", img));
      colorIds.forEach(id => formData.append("color", id));
      selectedSizes.map(s => s._id).forEach(id => formData.append("size", id));
      selectedCategories.map(c => c._id).forEach(id => formData.append("categories", id));
      formData.append("title", data.title);
      formData.append("slug", data.slug);
      formData.append("shortDescription", data.shortDescription);
      formData.append("longDescription", data.longDescription || "");
      formData.append("SKU", data.SKU);
      formData.append("MRP", data.MRP);
      formData.append("sellingPrice", data.sellingPrice);
      formData.append("brand", data.brand);
      formData.append("quantity", data.quantity);
      formData.append("tags", data.tags || "");
      await updateProduct(product._id, formData);
      toast.success("Product updated successfully");
      router.push("/products");
    } catch (err: any) {
      toast.error("Error updating product");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
            <h1 className="text-3xl font-bold text-white">Edit Product</h1>
            <p className="text-blue-100 mt-2">Update the details of your product</p>
        </div>
          <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8">
            {/* Basic Information */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <div className="w-2 h-6 bg-blue-500 rounded-full mr-3"></div>
                Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Product Title <span className="text-red-500">*</span>
                  </Label>
                  <Input {...register("title", { required: "Title is required" })} className="mt-1 h-11" />
                  {errors.title && <p className="text-red-500 text-sm mt-1">{String(errors.title.message)}</p>}
        </div>
        <div>
                  <Label className="text-sm font-medium text-gray-700">Product Slug</Label>
                  <Input {...register("slug")}
                    readOnly
                    className="mt-1 h-11 bg-gray-100 cursor-not-allowed"
                  />
        </div>
        <div>
                  <Label className="text-sm font-medium text-gray-700">SKU <span className="text-red-500">*</span></Label>
                  <Input {...register("SKU", { required: "SKU is required" })} className="mt-1 h-11" />
                  {errors.SKU && <p className="text-red-500 text-sm mt-1">{String(errors.SKU.message)}</p>}
        </div>
        <div>
                  <Label className="text-sm font-medium text-gray-700">Brand <span className="text-red-500">*</span></Label>
                  <select {...register("brand", { required: "Brand is required" })} className="w-full mt-1 h-11 border border-gray-300 rounded-md px-3">
                    <option value="">Select Brand</option>
                    {brands.map((b) => (
                      <option key={b._id} value={b._id}>{b.title}</option>
            ))}
          </select>
                  {errors.brand && <p className="text-red-500 text-sm mt-1">{String(errors.brand.message)}</p>}
                </div>
              </div>
            </div>
            {/* Categories */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <div className="w-2 h-6 bg-teal-500 rounded-full mr-3"></div>
                Categories
              </h2>
              <div className="relative mb-4">
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Select Categories <span className="text-red-500">*</span>
                </Label>
                <button
                  type="button"
                  onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                  className="w-full h-11 px-3 py-2 bg-white border border-gray-300 rounded-md text-left flex items-center justify-between hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <span className="text-gray-700">
                    {selectedCategories.length > 0
                      ? `${selectedCategories.length} category(ies) selected`
                      : 'Select categories'}
                  </span>
                  <ChevronDown className={`h-4 w-4 text-gray-400 transform transition-transform ${categoryDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {categoryDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    {categories.map((category) => (
                      <button
                        key={category._id}
                        type="button"
                        onClick={() => handleCategorySelect(category)}
                        className="w-full px-3 py-2 text-left hover:bg-gray-100 flex items-center justify-between"
                      >
                        <span>{category.name}</span>
                        {selectedCategories.find((c) => c._id === category._id) && (
                          <Check className="h-4 w-4 text-blue-600" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
        </div>
              {selectedCategories.length > 0 && (
        <div>
                  <Label className="text-sm font-medium text-gray-700 mb-3 block">Selected Categories</Label>
          <div className="flex flex-wrap gap-2">
                    {selectedCategories.map((category) => (
                      <span
                        key={category._id}
                        className="flex items-center bg-white border border-gray-300 px-3 py-1 rounded-full text-sm"
                      >
                        {category.name}
              <button
                type="button"
                          onClick={() => handleCategorySelect(category)}
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
            ))}
          </div>
        </div>
              )}
      </div>
            {/* Pricing & Inventory */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <div className="w-2 h-6 bg-green-500 rounded-full mr-3"></div>
                Pricing & Inventory
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
                  <Label className="text-sm font-medium text-gray-700">MRP <span className="text-red-500">*</span></Label>
                  <Input type="number" {...register("MRP", { required: "MRP is required", min: 0 })} className="mt-1 h-11" />
                  {errors.MRP && <p className="text-red-500 text-sm mt-1">{String(errors.MRP.message)}</p>}
        </div>
        <div>
                  <Label className="text-sm font-medium text-gray-700">Selling Price <span className="text-red-500">*</span></Label>
                  <Input type="number" {...register("sellingPrice", { required: "Selling price is required", min: 0 })} className="mt-1 h-11" />
                  {errors.sellingPrice && <p className="text-red-500 text-sm mt-1">{String(errors.sellingPrice.message)}</p>}
        </div>
        <div>
                  <Label className="text-sm font-medium text-gray-700">Stock Quantity <span className="text-red-500">*</span></Label>
                  <Input type="number" {...register("quantity", { required: "Quantity is required", min: 0 })} className="mt-1 h-11" />
                  {errors.quantity && <p className="text-red-500 text-sm mt-1">{String(errors.quantity.message)}</p>}
        </div>
        </div>
      </div>
            {/* Description */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <div className="w-2 h-6 bg-purple-500 rounded-full mr-3"></div>
                Product Description
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
      <div>
                  <Label className="text-sm font-medium text-gray-700">Short Description <span className="text-red-500">*</span></Label>
                  <Textarea {...register("shortDescription", { required: "Short description is required" })} rows={4} className="mt-1" />
                  {errors.shortDescription && <p className="text-red-500 text-sm mt-1">{String(errors.shortDescription.message)}</p>}
      </div>
      <div>
                  <Label className="text-sm font-medium text-gray-700">Long Description <span className="text-red-500">*</span></Label>
                  <Textarea {...register("longDescription", { required: "Long description is required" })} rows={4} className="mt-1" />
                  {errors.longDescription && <p className="text-red-500 text-sm mt-1">{String(errors.longDescription.message)}</p>}
                </div>
              </div>
      </div>
            {/* Tags */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <div className="w-2 h-6 bg-yellow-500 rounded-full mr-3"></div>
                Tags
              </h2>
      <div>
                <Label className="text-sm font-medium text-gray-700">Product Tags</Label>
                <Input {...register("tags")} className="mt-1 h-11" />
                <p className="text-gray-500 text-sm mt-1">Add relevant tags to help customers find your product</p>
              </div>
      </div>
            {/* Images */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <div className="w-2 h-6 bg-orange-500 rounded-full mr-3"></div>
                Product Images
              </h2>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-400 transition-colors">
                  <div className="flex flex-col items-center">
                    <Upload className="h-12 w-12 text-gray-400 mb-4" />
                    <label className="cursor-pointer">
                      <span className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
                        Choose Images
                      </span>
        <input
          type="file"
                        multiple
          accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                    <p className="text-gray-500 text-sm mt-2">Upload multiple images (JPG, PNG, GIF)</p>
                  </div>
                </div>
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {/* Colors */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <div className="w-2 h-6 bg-pink-500 rounded-full mr-3"></div>
                Colors
              </h2>
              <div className="mb-6">
                <Label className="text-sm font-medium text-gray-700 mb-3 block">
                  Available Colors {isLoadingColors && <span className="text-sm text-gray-500">(Loading...)</span>}
                </Label>
                <div className="flex flex-wrap gap-4 items-end">
                  {colors.length > 0 ? (
                    colors.map((color) => (
                      <div key={color._id} className="flex flex-col items-center">
                        <button
                          type="button"
                          onClick={() => handleColorSelect(color)}
                          className={`w-10 h-10 rounded-full border-2 mb-1 transition-transform ${
                            selectedColors.find((c) => c._id === color._id)
                              ? 'border-green-500 ring-2 ring-green-200 scale-110'
                              : 'border-gray-300 hover:scale-110'
                          }`}
                          style={{ backgroundColor: color.title || color.name || '#f3f3f3' }}
                          title={color.name}
                        />
                        <span className="text-xs text-gray-700 mt-1 truncate w-12 text-center">{color.title || color.name}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">
                      {isLoadingColors ? "Loading colors..." : "No colors available. Add a custom color below."}
                    </p>
                  )}
                </div>
              </div>
              {selectedColors.length > 0 && (
                <div className="mb-6">
                  <Label className="text-sm font-medium text-gray-700 mb-3 block">Selected Colors</Label>
                  <div className="flex flex-wrap gap-2">
                    {selectedColors.map((color) => (
                      <span
                        key={color._id}
                        className="flex items-center bg-white border border-gray-300 px-3 py-1 rounded-full text-sm"
                      >
                        <div
                          className="w-5 h-5 rounded-full mr-2 border border-gray-300"
                          style={{ backgroundColor: color.title || color.name || '#f3f3f3' }}
                        />
                        <span className="mr-2">{color.title || color.name}</span>
                        <button
                          type="button"
                          onClick={() => removeSelectedColor(color._id)}
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <Label className="text-sm font-medium text-gray-700 mb-3 block">Add Custom Color</Label>
                <div className="mb-4">
                  <Input
                    type="text"
                    value={customColorName}
                    onChange={(e) => setCustomColorName(e.target.value)}
                    placeholder="e.g., Royal Blue, Emerald Green"
                    className="w-full"
        />
      </div>
                <div className="flex justify-end items-center">
                  <Button
                    type="button"
                    onClick={handleAddCustomColor}
                    disabled={isLoadingColors}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    {isLoadingColors ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Adding...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" />
                        Add Color
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
            {/* Sizes */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <div className="w-2 h-6 bg-indigo-500 rounded-full mr-3"></div>
                Sizes
              </h2>
              <div className="relative mb-4">
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Select Sizes <span className="text-red-500">*</span>
                </Label>
                <button
                  type="button"
                  onClick={() => setSizeDropdownOpen(!sizeDropdownOpen)}
                  className="w-full h-11 px-3 py-2 bg-white border border-gray-300 rounded-md text-left flex items-center justify-between hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <span className="text-gray-700">
                    {selectedSizes.length > 0
                      ? `${selectedSizes.length} size(s) selected`
                      : 'Select sizes'}
                  </span>
                  <ChevronDown className={`h-4 w-4 text-gray-400 transform transition-transform ${sizeDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {sizeDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    {sizes.map((size) => (
                      <button
                        key={size._id}
                        type="button"
                        onClick={() => handleSizeSelect(size)}
                        className="w-full px-3 py-2 text-left hover:bg-gray-100 flex items-center justify-between"
                      >
                        <span>{size.name}</span>
                        {selectedSizes.find((s) => s._id === size._id) && (
                          <Check className="h-4 w-4 text-blue-600" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {selectedSizes.length > 0 && (
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-3 block">Selected Sizes</Label>
                  <div className="flex flex-wrap gap-2">
                    {selectedSizes.map((size) => (
                      <span
                        key={size._id}
                        className="flex items-center bg-white border border-gray-300 px-3 py-1 rounded-full text-sm"
                      >
                        {size.name}
                        <button
                          type="button"
                          onClick={() => handleSizeSelect(size)}
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          <X className="h-3 w-3" />
        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="bg-white border-t border-gray-200 px-8 py-6 flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose || (() => router.push("/products"))}
                className="px-6 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
            Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || loading}
                className="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Saving Product...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Save Product
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
