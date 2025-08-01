# FAQ Component Dynamic Integration

## Overview
The FAQ component has been updated to fetch FAQ data dynamically from the backend API instead of using static data.

## Files Created/Modified

### 1. `frontend/api/faq.js`
- New API file for FAQ data fetching
- Endpoint: `http://localhost:5000/api/frontend/faq/`
- Handles error cases and returns structured response

### 2. `frontend/hooks/useFAQs.js`
- Custom hook for managing FAQ data
- Handles loading states, error handling, and data transformation
- Includes fallback to static data if API fails
- Transforms API response to match expected component format

### 3. `frontend/components/otherPages/Faqs.jsx`
- Updated to use dynamic data from `useFAQs` hook
- Added loading and error states
- Shows fallback warning when using static data
- Maintains all existing functionality and styling

## API Response Format
The API returns data in this format:
```json
{
  "how-to-buy": {
    "type": "how to buy",
    "faqs": [
      {
        "_id": "6889ca0a1490dce07808febd",
        "title": "How do I place an order?",
        "description": "To place an order, simply browse the products, add to cart, and proceed to checkout."
      }
    ]
  }
}
```

## Data Structure
The component expects FAQ data organized by categories:
- Each category has a `type` (display name) and `faqs` array
- Each FAQ has `_id`, `title`, and `description` fields
- Categories are dynamically rendered based on API response

## Component Features
- **Dynamic Categories**: Renders FAQ categories based on API data
- **Accordion Functionality**: Bootstrap accordion with proper IDs
- **Loading States**: Shows loading message while fetching
- **Error Handling**: Falls back to static data if API fails
- **Responsive Design**: Maintains existing responsive behavior
- **Contact Form**: Preserves the "Ask Your Question" form

## Error Handling
- If API fails, falls back to static FAQ data
- Shows warning message when using fallback data
- Displays loading state while fetching
- Handles empty API responses gracefully

## Usage
The component automatically fetches data on mount and handles all states:
- Loading: Shows "Loading FAQs..." message
- Error: Shows warning and uses fallback data
- Success: Displays FAQs from API organized by categories
- Empty: Shows "No FAQs available" message

## Bootstrap Accordion Integration
- Uses Bootstrap 5 accordion classes
- Dynamic ID generation for proper functionality
- Maintains accessibility attributes
- Preserves existing styling and animations

## Contact Form
The "Ask Your Question" form remains unchanged and functional:
- Name input field
- Category selection dropdown
- Message textarea
- Submit button with proper styling 