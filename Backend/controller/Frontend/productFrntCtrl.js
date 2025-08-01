const asyncHandler = require("express-async-handler");
const Product = require("../../models/productModel");
const Brand = require('../../models/brandModel');
const Category = require('../../models/categoryModel')
const Color = require('../../models/colorModel');
const Size = require('../../models/sizeModel')


const getProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({})
      .select("title MRP sellingPrice images categories brand slug shortDescription description quantity color size")
      .populate("categories", "name")
      .populate("brand", "title")
      .populate("color", "title")
      .populate("size", "name value title");

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products", error });
  }
});

const getProductBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  // Try to find by slug first, then by ID if slug doesn't work
  let product = await Product.findOne({ slug })
    .populate("categories", "name _id")
    .populate("color", "title _id")
    .populate("size", "name value _id")
    .populate("brand", "title _id");

  // If not found by slug, try to find by ID
  if (!product) {
    // Check if the slug parameter is actually an ObjectId
    const mongoose = require('mongoose');
    if (mongoose.Types.ObjectId.isValid(slug)) {
      product = await Product.findById(slug)
        .populate("categories", "name _id")
        .populate("color", "title _id")
        .populate("size", "name value _id")
        .populate("brand", "title _id");
    }
  }

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.status(200).json({
    _id: product._id, // Add the product ID
    slug: product.slug, // Add the slug
    // categories: {
    //   _id: product.categories?._id,
    //   name: product.categories?.name,
    // },
    categories: product.categories,
    title: product.title,
    longDescription: product.longDescription,
    MRP: product.MRP,
    sellingPrice: product.sellingPrice,
    color: product.color,
    size: product.size,
    quantity: product.quantity,
    SKU: product.SKU,
    brand: product.brand,
    images: product.images,
  });
});

const getRelatedProducts = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const currentProduct = await Product.findOne({ slug });

  if (!currentProduct) {
    return res.status(404).json({ message: "Product not found" });
  }

  const categoryId = currentProduct.categories;

  const relatedProducts = await Product.find({
    categories: { $in: categoryId },
    _id: { $ne: currentProduct._id },
  })
    .select("title MRP sellingPrice images")
    .limit(4);

  res.status(200).json(relatedProducts);
});

const getFilteredProducts = asyncHandler(async (req, res) => {
  const {
    category,
    brand,
    color,
    size,
    minPrice,
    maxPrice,
    search,
    sort,
    page = 1,
    limit = 12,
  } = req.query;

  let query = {};
  let filter = {};

  if (search) {
    query.title = { $regex: search, $options: "i" };
  }

  // if (category) {
  //   query.categories = { $in: Array.isArray(category) ? category : [category] };
  // }
   if (category) {
      const categoryDoc = await Category.findOne({ name: category.trim() });
      if (!categoryDoc) {
        return res.status(400).json({
          status: "fail",
          message: "Category not found",
        });
      }
      filter.categories = categoryDoc._id;
    }

  // if (category) {
  //   const categoryIds = Array.isArray(category)
  //     ? category
  //     : category.split(",");
  //   query.categories = { $in: categoryIds };
  // }


  // if (brand) {
  //   query.brand = brand;
  // }
  if (brand) {
    const brandDoc = await Brand.findOne({ title: brand });
    if (brandDoc) {
      query.brand = brandDoc._id;
    } else {
      return res.status(404).json({ message: "Brand not found" });
    }
  }

  // if (color) {
  //   query.color = { $in: Array.isArray(color) ? color : [color] };
  // }
  if (color) {
    // First try to find exact match
    let colorDocs = await Color.find({
      title: { $in: Array.isArray(color) ? color : [color] }
    });

    // If no exact match found, try to find partial matches
    if (colorDocs.length === 0) {
      colorDocs = await Color.find({
        $or: [
          { title: { $regex: color, $options: 'i' } },
          { name: { $regex: color, $options: 'i' } },
          { value: { $regex: color, $options: 'i' } }
        ]
      });
    }

    // If still no matches, try to find colors that contain the search term
    if (colorDocs.length === 0) {
      colorDocs = await Color.find({
        $or: [
          { title: { $regex: `.*${color}.*`, $options: 'i' } },
          { name: { $regex: `.*${color}.*`, $options: 'i' } },
          { value: { $regex: `.*${color}.*`, $options: 'i' } }
        ]
      });
    }

    if (colorDocs.length > 0) {
      const colorIds = colorDocs.map(c => c._id);
      query.color = { $in: colorIds };
    } else {
      // If no color matches found, return empty result
      return res.status(200).json({
        total: 0,
        page: parseInt(page),
        pages: 0,
        data: []
      });
    }
  }

  // if (size) {
  //   query.size = { $in: Array.isArray(size) ? size : [size] };
  // }
  if (size) {
    // First try to find exact match
    let sizeDocs = await Size.find({
      name: { $in: Array.isArray(size) ? size : [size] }
    });

    // If no exact match found, try to find partial matches
    if (sizeDocs.length === 0) {
      sizeDocs = await Size.find({
        $or: [
          { name: { $regex: size, $options: 'i' } },
          { value: { $regex: size, $options: 'i' } },
          { title: { $regex: size, $options: 'i' } }
        ]
      });
    }

    // If still no matches, try to find sizes that contain the search term
    if (sizeDocs.length === 0) {
      sizeDocs = await Size.find({
        $or: [
          { name: { $regex: `.*${size}.*`, $options: 'i' } },
          { value: { $regex: `.*${size}.*`, $options: 'i' } },
          { title: { $regex: `.*${size}.*`, $options: 'i' } }
        ]
      });
    }

    if (sizeDocs.length > 0) {
      const sizeIds = sizeDocs.map(s => s._id);
      query.size = { $in: sizeIds };
    } else {
      // If no size matches found, return empty result
      return res.status(200).json({
        total: 0,
        page: parseInt(page),
        pages: 0,
        data: []
      });
    }
  }

  if (minPrice || maxPrice) {
    query.sellingPrice = {};
    if (minPrice) query.sellingPrice.$gte = parseFloat(minPrice);
    if (maxPrice) query.sellingPrice.$lte = parseFloat(maxPrice);
  }


  let sortOption = {};
  if (sort === "price-asc") sortOption.sellingPrice = 1;
  else if (sort === "price-desc") sortOption.sellingPrice = -1;
  else sortOption.createdAt = -1;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const total = await Product.countDocuments(query);
  const products = await Product.find(query)
    .select("title MRP sellingPrice images categories brand color size quantity sold tags shortDescription")
    .populate("brand", "title")
    .populate("categories", "name")
    .populate("color", "title")
    .populate("size", "name value")
    .sort(sortOption)
    .skip(skip)
    .limit(parseInt(limit));

  res.status(200).json({
    total,
    page: parseInt(page),
    pages: Math.ceil(total / limit),
    data: products,
  });
});

const getCompareProducts = asyncHandler(async (req, res) => {
  const ids = req.query.ids?.split(",");

  if (!ids || ids.length === 0) {
    return res.status(400).json({ message: "No product IDs provided" });
  }

  const products = await Product.find({ _id: { $in: ids } })
    .populate("color", "title")
    .populate("size", "name value");

  res.status(200).json(products);
});


module.exports = { getProducts, getProductBySlug, getRelatedProducts, getFilteredProducts, getCompareProducts };