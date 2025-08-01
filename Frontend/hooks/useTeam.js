import { useState, useEffect } from "react";
import { fetchTeamMembers } from "@/api/team";
import { teamMembers as staticTeamMembers } from "@/data/team";

export const useTeam = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getTeamMembers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const result = await fetchTeamMembers();
        
        if (result.success && result.data && result.data.length > 0) {
          // Transform the API data to match the expected format
          const transformedData = result.data.map((member, index) => ({
            imgSrc: `http://localhost:5000${member.image}`, // Add the base URL for images
            alt: `image-team-${member._id}`,
            name: member.title,
            position: member.designation,
            wowDelay: `${index * 0.1}s`,
            social: [{ href: "#", className: "social-facebook", icon: "icon icon-fb" }],
          }));
          
          setTeamMembers(transformedData);
        } else {
          // Fallback to static data if API returns empty or fails
          console.warn("API returned empty data, using static team members as fallback");
          setTeamMembers(staticTeamMembers);
        }
      } catch (err) {
        console.error("Error fetching team members, using static data as fallback:", err);
        setError(err.message);
        // Fallback to static data on error
        setTeamMembers(staticTeamMembers);
      } finally {
        setLoading(false);
      }
    };

    getTeamMembers();
  }, []);

  return { teamMembers, loading, error };
}; 