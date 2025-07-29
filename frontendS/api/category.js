const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const fetchCategories = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/frontend/category/category-list', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    // Add slug property if missing
    return (data.data || []).map(cat => ({
      ...cat,
      slug: cat.name.toLowerCase().replace(/\s+/g, '-')
    }));
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

export const fetchProductsByCategory = async (slug, page = 1) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/frontend/category/${slug}?page=${page}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return { products: [], category: '', totalProducts: 0, totalPages: 0 };
  }
};

  
  