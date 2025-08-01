const API_BASE_URL = "http://localhost:5000/api/contact";

// Submit contact form API
export const submitContactForm = async (formData) => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to submit contact form");
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error submitting contact form:", error);
    return { success: false, error: error.message };
  }
}; 