# Team Component Dynamic Integration

## Overview
The Team component has been updated to fetch team member data dynamically from the backend API instead of using static data.

## Files Created/Modified

### 1. `frontend/api/team.js`
- New API file for team data fetching
- Endpoint: `http://localhost:5000/api/frontend/aboutus/teams`
- Handles error cases and returns structured response

### 2. `frontend/hooks/useTeam.js`
- Custom hook for managing team data
- Handles loading states, error handling, and data transformation
- Includes fallback to static data if API fails
- Transforms API response to match expected component format

### 3. `frontend/components/otherPages/Team.jsx`
- Updated to use dynamic data from `useTeam` hook
- Added loading and error states
- Shows fallback warning when using static data
- Maintains all existing functionality

## API Response Format
The API returns data in this format:
```json
[
  {
    "_id": "6889bbce440507e8837d412b",
    "title": "Sonal",
    "designation": "Intern",
    "image": "/uploads/upload-1753856974138-516455676.jpeg"
  }
]
```

## Data Transformation
The hook transforms API data to match the component's expected format:
```javascript
{
  imgSrc: `http://localhost:5000${member.image}`,
  alt: `image-team-${member._id}`,
  name: member.title,
  position: member.designation,
  wowDelay: `${index * 0.1}s`,
  social: [{ href: "#", className: "social-facebook", icon: "icon icon-fb" }]
}
```

## Error Handling
- If API fails, falls back to static data from `@/data/team`
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
- Success: Displays team members from API
- Empty: Shows "No team members found" message 