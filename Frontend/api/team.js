const API_BASE_URL = "http://localhost:5000/api/frontend/aboutus/teams";

// Fetch team members API
export const fetchTeamMembers = async () => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch team members");
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching team members:", error);
    return { success: false, error: error.message, data: [] };
  }
}; 