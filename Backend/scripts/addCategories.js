const mongoose = require('mongoose');
const Category = require('../models/categoryModel');
const slugify = require('slugify');

// MongoDB connection string - update this with your actual connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';

const categories = [
  {
    name: 'Lounge',
    description: 'Comfortable and stylish lounge wear for relaxation',
    image: '/uploads/default-category.jpg',
    isActive: true
  },
  {
    name: 'Yoga',
    description: 'Premium yoga wear for your practice',
    image: '/uploads/default-category.jpg',
    isActive: true
  },
  {
    name: 'Pilates',
    description: 'Functional and comfortable pilates clothing',
    image: '/uploads/default-category.jpg',
    isActive: true
  },
  {
    name: 'Train',
    description: 'High-performance training gear',
    image: '/uploads/default-category.jpg',
    isActive: true
  },
  {
    name: 'Run',
    description: 'Professional running apparel and accessories',
    image: '/uploads/default-category.jpg',
    isActive: true
  }
];

async function addCategories() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing categories (optional - remove this if you want to keep existing ones)
    // await Category.deleteMany({});
    // console.log('Cleared existing categories');

    // Add categories with slugs
    for (const categoryData of categories) {
      const slug = slugify(categoryData.name, { lower: true });
      
      // Check if category already exists
      const existingCategory = await Category.findOne({ slug });
      if (existingCategory) {
        console.log(`Category "${categoryData.name}" already exists, skipping...`);
        continue;
      }

      const category = new Category({
        ...categoryData,
        slug
      });

      await category.save();
      console.log(`Added category: ${categoryData.name} (slug: ${slug})`);
    }

    console.log('All categories added successfully!');
    
    // Display all categories
    const allCategories = await Category.find({});
    console.log('\nCurrent categories in database:');
    allCategories.forEach(cat => {
      console.log(`- ${cat.name} (${cat.slug})`);
    });

  } catch (error) {
    console.error('Error adding categories:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the script
addCategories(); 