const API_BASE_URL = "http://localhost:5000/api/frontend/testimonials/lists";

// Fetch testimonials API
export const fetchTestimonials = async () => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch testimonials");
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return { success: false, error: error.message, data: [] };
  }
}; 