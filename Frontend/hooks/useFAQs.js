import { useState, useEffect } from "react";
import { fetchFAQs } from "@/api/faq";

export const useFAQs = () => {
  const [faqs, setFaqs] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getFAQs = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const result = await fetchFAQs();
        
        if (result.success && result.data) {
          setFaqs(result.data);
        } else {
          // Fallback to static data if API fails
          console.warn("API returned empty data, using static FAQs as fallback");
          setFaqs({
            "how-to-buy": {
              type: "How To Buy",
              faqs: [
                {
                  _id: "1",
                  title: "How does COVID-19 affect my online orders and store purchases?",
                  description: "The courier companies have adapted their procedures to guarantee the safety of our employees and our community. We thank you for your patience, as there may be some delays to deliveries."
                },
                {
                  _id: "2", 
                  title: "I have a promotional or discount code. How do I use it for an online purchase?",
                  description: "You can apply promotional codes during checkout. Enter the code in the designated field and click apply to see the discount reflected in your total."
                }
              ]
            },
            "exchanges-returns": {
              type: "Exchanges & Returns",
              faqs: [
                {
                  _id: "3",
                  title: "Can I cancel or change my order?",
                  description: "Orders can be cancelled or modified within 24 hours of placement. Contact our customer service team for assistance."
                },
                {
                  _id: "4",
                  title: "What are the delivery types?",
                  description: "We offer standard delivery (3-5 business days) and express delivery (1-2 business days) depending on your location."
                }
              ]
            },
            "refund-questions": {
              type: "Refund Questions", 
              faqs: [
                {
                  _id: "5",
                  title: "I cannot find my size or the colour I like. What should I do?",
                  description: "If your preferred size or color is not available, you can set up notifications for when it becomes available or contact our customer service."
                },
                {
                  _id: "6",
                  title: "I have not received all the items in my order. What should I do?",
                  description: "If you haven't received all items, please contact our customer service team with your order number for assistance."
                }
              ]
            }
          });
        }
      } catch (err) {
        console.error("Error fetching FAQs, using static data as fallback:", err);
        setError(err.message);
        // Fallback to static data on error
        setFaqs({
          "how-to-buy": {
            type: "How To Buy",
            faqs: [
              {
                _id: "1",
                title: "How does COVID-19 affect my online orders and store purchases?",
                description: "The courier companies have adapted their procedures to guarantee the safety of our employees and our community. We thank you for your patience, as there may be some delays to deliveries."
              }
            ]
          }
        });
      } finally {
        setLoading(false);
      }
    };

    getFAQs();
  }, []);

  return { faqs, loading, error };
}; 