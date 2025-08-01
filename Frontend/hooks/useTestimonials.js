import { useState, useEffect } from "react";
import { fetchTestimonials } from "@/api/testimonials";
import { testimonials6 as staticTestimonials } from "@/data/testimonials";

export const useTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getTestimonials = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const result = await fetchTestimonials();
        
        if (result.success && result.data && result.data.length > 0) {
          // Transform the API data to match the expected format
          const transformedData = result.data.map((testimonial, index) => ({
            title: testimonial.title || "Customer Review",
            text: testimonial.description || testimonial.review || "",
            author: testimonial.author || testimonial.name || "Anonymous",
            delay: `${index * 0.1}s`,
            stars: testimonial.rating || 5,
            image: testimonial.image ? `http://localhost:5000${testimonial.image}` : null,
          }));
          
          setTestimonials(transformedData);
        } else {
          // Fallback to static data if API returns empty or fails
          console.warn("API returned empty data, using static testimonials as fallback");
          setTestimonials(staticTestimonials);
        }
      } catch (err) {
        console.error("Error fetching testimonials, using static data as fallback:", err);
        setError(err.message);
        // Fallback to static data on error
        setTestimonials(staticTestimonials);
      } finally {
        setLoading(false);
      }
    };

    getTestimonials();
  }, []);

  return { testimonials, loading, error };
}; 