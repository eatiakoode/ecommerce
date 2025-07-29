const Category = require("../../models/categoryModel");
const Product = require("../../models/productModel");
const asyncHandler = require("express-async-handler");
// const getCategoriesWithProductCount = async (req, res) => {
//   try {
//     const categories = await Category.aggregate([
//       {
//         $match: {
//           isActive: true,
//         },
//       },
//       {
//         $lookup: {
//           from: "products", 
//           localField: "_id",
//           foreignField: "category",
//           as: "products",
//         },
//       },
//       {
//         $project: {
//           _id: 1,
//           name: 1,
//           image: 1,
//           productCount: { $size: "$products" },
//         },
//       },
//     ]);

//     res.status(200).json({
//       success: true,
//       data: categories,
//     });
//   } catch (error) {
//     console.error("Error fetching categories with product count:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };
const getCategoriesWithProductCount = async (req, res) => {
  try {
    const categories = await Category.aggregate([
      {
        $match: {
          isActive: true,
        },
      },
      {
        $lookup: {
          from: "products",
          let: { categoryId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $in: ["$$categoryId", "$categories"] },
              },
            },
          ],
          as: "products",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          image: 1,
          productCount: { $size: "$products" },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("Error fetching categories with product count:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getAllCategories = asyncHandler(async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).select("name");
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch categories" 
    });
  }
});

const getFilteredProducts = asyncHandler(async (req, res) => {
  try {
    const { category } = req.query;
    
    let query = {};
    
    // If category is provided and not 'all', find the category first and then filter products
    if (category && category !== 'all') {
      // First, find the category by name (case-insensitive)
      const categoryDoc = await Category.findOne({
        name: { $regex: category, $options: 'i' }
      });
      
      if (categoryDoc) {
        // Filter products by category ID
        query = {
          categories: categoryDoc._id
        };
      } else {
        // If category not found, return empty array
        console.log(`Category "${category}" not found`);
        return res.status(200).json([]);
      }
    }
    
    // If no category specified or category is 'all', return all products
    const products = await Product.find(query)
      .select("title MRP sellingPrice images categories brand slug")
    .populate("categories", "name")
      .populate("brand", "title")
    .limit(8);
 
    console.log(`Found ${products.length} products for category: ${category || 'all'}`);
  res.status(200).json(products);
  } catch (error) {
    console.error("Error filtering products:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch filtered products" 
    });
  }
});
 


const getProductsByCategorySlug = asyncHandler(async (req, res) => {
  try {
    const { slug } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = 12;
    const skip = (page - 1) * limit;

    // Find category by slug (convert slug back to name)
    const categoryName = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const category = await Category.findOne({ 
      name: { $regex: new RegExp(categoryName, 'i') },
      isActive: true 
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }

    // Get total count of products in this category
    const totalProducts = await Product.countDocuments({ categories: category._id });

    // Get products for this category with pagination
    const products = await Product.find({ categories: category._id })
      .select("title MRP sellingPrice images categories brand slug shortDescription")
      .populate("categories", "name")
      .populate("brand", "title")
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(totalProducts / limit);

    res.status(200).json({
      success: true,
      category: category.name,
      products,
      totalProducts,
      currentPage: page,
      totalPages
    });
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products by category"
    });
  }
});

module.exports = {
  getCategoriesWithProductCount,
  getFilteredProducts,
  getAllCategories,
  getProductsByCategorySlug,
};