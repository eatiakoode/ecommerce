const API_BASE_URL = "http://localhost:5000/api/frontend/faq/";

// Fetch FAQs API
export const fetchFAQs = async () => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch FAQs");
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    return { success: false, error: error.message, data: {} };
  }
}; 