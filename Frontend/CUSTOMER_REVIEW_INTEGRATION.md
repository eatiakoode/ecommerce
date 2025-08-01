# Customer Review Component Dynamic Integration

## Overview
The Customer Review component has been created to display customer testimonials dynamically from the backend API, matching the design shown in the About Us page.

## Files Created/Modified

### 1. `frontend/api/testimonials.js`
- New API file for testimonials data fetching
- Endpoint: `http://localhost:5000/api/frontend/testimonials/lists`
- Handles error cases and returns structured response

### 2. `frontend/hooks/useTestimonials.js`
- Custom hook for managing testimonials data
- Handles loading states, error handling, and data transformation
- Includes fallback to static data if API fails
- Transforms API response to match expected component format

### 3. `frontend/components/otherPages/CustomerReview.jsx`
- New component for About Us page customer reviews
- Uses dynamic data from `useTestimonials` hook
- Added loading and error states
- Shows fallback warning when using static data
- Matches the design from the image with quote icons and star ratings

## API Response Format
The API returns data in this format:
```json
[
  {
    "_id": "testimonial_id",
    "title": "Variety of Styles!",
    "description": "Fantastic shop! Great selection, fair prices, and friendly staff...",
    "author": "Sybil Sharp",
    "rating": 5,
    "image": "/uploads/testimonial-image.jpg"
  }
]
```

## Data Transformation
The hook transforms API data to match the component's expected format:
```javascript
{
  title: testimonial.title || "Customer Review",
  text: testimonial.description || testimonial.review || "",
  author: testimonial.author || testimonial.name || "Anonymous",
  delay: `${index * 0.1}s`,
  stars: testimonial.rating || 5,
  image: testimonial.image ? `http://localhost:5000${testimonial.image}` : null,
}
```

## Component Features
- **Quote Icon**: Large quotation mark at top-left of each card
- **Title**: Bold heading for each review category
- **Content**: Detailed review text
- **Author**: Customer name
- **Stars**: 5-star rating display in red
- **Responsive**: 3 cards per row on desktop, responsive on mobile
- **Animations**: Fade-in animations with staggered delays

## Error Handling
- If API fails, falls back to static data from `@/data/testimonials` (testimonials6)
- Shows warning message when using fallback data
- Displays loading state while fetching
- Handles empty API responses gracefully

## Image Handling
- Images are served from `http://localhost:5000/uploads/`
- Next.js configuration already supports this domain
- Images are properly proxied through Next.js rewrites

## Usage
The component automatically fetches data on mount and handles all states:
- Loading: Shows loading message
- Error: Shows warning and uses fallback data
- Success: Displays customer reviews from API
- Empty: Shows "No customer reviews found" message

## Design Features
- Clean white cards with subtle shadow
- Black quotation marks for visual appeal
- Red star ratings
- Responsive grid layout
- Consistent typography and spacing 