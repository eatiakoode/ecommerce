const mongoose = require('mongoose');
const Category = require('../models/categoryModel');
const Product = require('../models/productModel');
const slugify = require('slugify');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/ecommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const fixCategories = async () => {
  try {
    console.log('Starting category fix...');

    // Create or update categories
    const categories = [
      { name: 'Lounge', description: 'Comfortable lounge wear for relaxation' },
      { name: 'Yoga', description: 'Yoga and fitness clothing' },
      { name: 'Activewear', description: 'Active and sports clothing' },
      { name: 'Casual', description: 'Casual everyday wear' },
      { name: 'Formal', description: 'Formal and business attire' }
    ];

    const createdCategories = [];

    for (const catData of categories) {
      const slug = slugify(catData.name, { lower: true });
      
      let category = await Category.findOne({ name: catData.name });
      
      if (!category) {
        category = new Category({
          name: catData.name,
          slug: slug,
          description: catData.description,
          image: `/images/categories/${slug}.jpg`,
          isActive: true
        });
        await category.save();
        console.log(`Created category: ${catData.name}`);
      } else {
        category.slug = slug;
        category.description = catData.description;
        category.isActive = true;
        await category.save();
        console.log(`Updated category: ${catData.name}`);
      }
      
      createdCategories.push(category);
    }

    // Get all products
    const products = await Product.find({});
    console.log(`Found ${products.length} products`);

    // Assign products to different categories
    const categoryIds = createdCategories.map(cat => cat._id);
    
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      
      // Assign products to different categories based on index
      let categoryIndex;
      if (i % 5 === 0) {
        categoryIndex = 0; // Lounge
      } else if (i % 5 === 1) {
        categoryIndex = 1; // Yoga
      } else if (i % 5 === 2) {
        categoryIndex = 2; // Activewear
      } else if (i % 5 === 3) {
        categoryIndex = 3; // Casual
      } else {
        categoryIndex = 4; // Formal
      }

      // Update product categories
      product.categories = [categoryIds[categoryIndex]];
      await product.save();
      
      console.log(`Assigned product "${product.title}" to category "${createdCategories[categoryIndex].name}"`);
    }

    // Verify the assignments
    for (const category of createdCategories) {
      const productCount = await Product.countDocuments({ categories: category._id });
      console.log(`Category "${category.name}" has ${productCount} products`);
    }

    console.log('Category fix completed successfully!');
    
  } catch (error) {
    console.error('Error fixing categories:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the script
fixCategories(); 