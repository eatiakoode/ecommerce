'use client';

import React, { useState } from 'react';
import { ArrowLeft, Plus, Tag, Percent, Calendar, Eye, Code, CheckCircle } from 'lucide-react';

export default function CreateCouponPage() {
  const [campaignName, setCampaignName] = useState('');
  const [code, setCode] = useState('');
  const [discount, setDiscount] = useState('');
  const [startDate, setStartDate] = useState('');
  const [expiry, setExpiry] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Handle form submission logic here
      const newCoupon = {
        campaignName,
        code,
        discount,
        startDate,
        expiry,
      };
      // send newCoupon to backend here
      console.log('Form submitted:', newCoupon);
      
      alert('Coupon created successfully!');
    } catch (error) {
      console.error('Failed to create coupon:', error);
      alert('Something went wrong. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    // Add navigation logic here
    console.log('Going back to coupons list');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-8 px-4">
      <div className="max-w-4xl mx-auto relative">
        {/* Header Section */}
        <div className="mb-8">
          <button
            onClick={handleGoBack}
            className="mb-4 flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800/50 rounded-lg transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Coupons
          </button>
          
          <div className="flex items-center gap-4 mb-2">
            <div className="flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg">
              <Plus className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                Create New Coupon
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Set up a new discount campaign for your customers
              </p>
            </div>
          </div>
        </div>

        {/* Main Form Card */}
        <div className="relative overflow-hidden border-0 shadow-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl">
          {/* Header decoration */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
          
          <div className="p-8">
            {/* Form Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg">
                  <Tag className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Coupon Details
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Fill in the information below to create your new coupon campaign
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Campaign Name and Code Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <Tag className="w-4 h-4" />
                    Campaign Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Enter campaign name"
                      value={campaignName}
                      onChange={(e) => setCampaignName(e.target.value)}
                      className="w-full h-12 px-4 bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      required
                    />
                    {campaignName && (
                      <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <Code className="w-4 h-4" />
                    Code
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Enter coupon code"
                      value={code}
                      onChange={(e) => setCode(e.target.value.toUpperCase())}
                      className="w-full h-12 px-4 bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 dark:focus:ring-purple-400/20 transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 font-mono"
                      required
                    />
                    {code && (
                      <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
                    )}
                  </div>
                </div>
              </div>

              {/* Discount and Published Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <Percent className="w-4 h-4" />
                    Discount (%)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="Enter discount percentage"
                      value={discount}
                      onChange={(e) => setDiscount(e.target.value)}
                      min="0"
                      max="100"
                      className="w-full h-12 px-4 bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-green-500 dark:focus:border-green-400 focus:ring-2 focus:ring-green-500/20 dark:focus:ring-green-400/20 transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      required
                    />
                    {discount && (
                      <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
                    )}
                  </div>
                </div>

                {/* Remove the published status section entirely */}
              </div>

              {/* Start Date and End Date Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <Calendar className="w-4 h-4" />
                    Start Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full h-12 px-4 bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-orange-500 dark:focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20 dark:focus:ring-orange-400/20 transition-all duration-300 text-gray-900 dark:text-white"
                      required
                    />
                    {startDate && (
                      <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <Calendar className="w-4 h-4" />
                    Expiry Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      min={startDate}
                      className="w-full h-12 px-4 bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-red-500 dark:focus:border-red-400 focus:ring-2 focus:ring-red-500/20 dark:focus:ring-red-400/20 transition-all duration-300 text-gray-900 dark:text-white"
                      required
                    />
                    {expiry && (
                      <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
                    )}
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white border-0 shadow-xl hover:shadow-emerald-500/25 transition-all duration-300 h-12 flex-1 rounded-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                  <span className="relative flex items-center justify-center gap-2 font-semibold">
                    <Plus className="w-5 h-5" />
                    {isLoading ? "Creating Coupon..." : "Create Coupon"}
                  </span>
                  <div className="absolute inset-0 -top-2 -left-2 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-lg blur opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
                </button>

                <button
                  type="button"
                  onClick={handleGoBack}
                  className="border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-slate-800 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-300 h-12 flex-1 sm:flex-none sm:px-8 rounded-xl hover:scale-105 text-gray-700 dark:text-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>

            {/* Progress Indicator */}
            <div className="mt-8 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-700 border border-blue-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg">
                  <span className="text-white text-sm font-bold">1</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Step 1 of 1: Coupon Configuration
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Fill in all required fields to create your coupon
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-6 border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Tag className="w-5 h-5 text-yellow-500" />
              Coupon Creation Tips
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                Use memorable and descriptive campaign names for easy identification
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                Create unique, easy-to-type coupon codes (avoid confusing characters)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                Set appropriate start and end dates to control campaign duration
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 mt-1">•</span>
                Toggle published status to control when the coupon becomes active
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}