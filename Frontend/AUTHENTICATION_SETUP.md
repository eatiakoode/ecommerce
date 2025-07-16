# Authentication Setup Guide

This guide explains how to use the new authentication system implemented in your ecommerce frontend.

## Overview

The authentication system includes:
- **Login/Register API integration** with your backend
- **Authentication Context** for state management
- **Protected Routes** for secure pages
- **User-friendly forms** with validation
- **Automatic token management** and localStorage persistence

## Files Created/Modified

### New Files:
1. `api/auth.js` - Authentication API service
2. `context/AuthContext.jsx` - Authentication context provider
3. `components/common/ProtectedRoute.jsx` - Route protection component
4. `AUTHENTICATION_SETUP.md` - This guide

### Modified Files:
1. `components/otherPages/Login.jsx` - Updated with API integration
2. `components/otherPages/Register.jsx` - Updated with API integration
3. `components/headers/Header1.jsx` - Added user status display
4. `app/layout.js` - Added AuthProvider wrapper

## How to Use

### 1. Basic Authentication

The authentication context is now available throughout your app. You can use it in any component:

```jsx
import { useAuth } from "@/context/AuthContext";

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  if (isAuthenticated()) {
    return <div>Welcome, {user.firstname}!</div>;
  }
  
  return <div>Please log in</div>;
}
```

### 2. Protected Routes

Wrap any page that requires authentication:

```jsx
import ProtectedRoute from "@/components/common/ProtectedRoute";

function MyAccountPage() {
  return (
    <ProtectedRoute>
      <div>This content is only visible to authenticated users</div>
    </ProtectedRoute>
  );
}
```

### 3. Login/Register Forms

The login and register forms are now fully functional and will:
- Validate user input
- Show error messages
- Handle API responses
- Redirect users appropriately
- Store authentication tokens

## API Endpoints Used

The system connects to these backend endpoints:

- `POST /api/user/login` - User login
- `POST /api/user/register` - User registration
- `GET /api/user/logout` - User logout
- `POST /api/user/forgot-password-token` - Forgot password
- `PUT /api/user/reset-password/:token` - Reset password

## Features

### ✅ Implemented:
- User login with email/password
- User registration with validation
- Automatic token storage in localStorage
- User logout functionality
- Protected routes
- User status display in header
- Form validation and error handling
- Loading states during API calls

### 🔄 Available for Extension:
- Password reset functionality
- Email verification
- Social login (Google, Facebook, etc.)
- Remember me functionality
- Session timeout handling
- Multi-factor authentication

## Environment Variables

Make sure your backend is running on the correct port. The API base URL is set to:
```
http://localhost:5000/api/user
```

If your backend runs on a different port, update the `API_BASE_URL` in `api/auth.js`.

## Testing the Setup

1. **Start your backend server** (make sure MongoDB is connected)
2. **Start your frontend** with `npm run dev`
3. **Navigate to `/register`** and create a new account
4. **Navigate to `/login`** and test the login functionality
5. **Check the header** - it should show user info when logged in
6. **Test logout** - click the logout button in the header

## Troubleshooting

### Common Issues:

1. **"Login failed" error**
   - Check if your backend server is running
   - Verify MongoDB connection
   - Check browser console for detailed errors

2. **CORS errors**
   - Ensure your backend has CORS configured properly
   - Check if the API URL is correct

3. **Token not persisting**
   - Check if localStorage is enabled in your browser
   - Verify the token is being returned from the backend

4. **Protected routes not working**
   - Make sure AuthProvider is wrapping your app
   - Check if the authentication context is properly initialized

## Security Considerations

- Tokens are stored in localStorage (consider httpOnly cookies for production)
- Passwords are validated on both frontend and backend
- API calls include proper error handling
- Protected routes prevent unauthorized access

## Next Steps

To enhance the authentication system, consider:

1. **Adding refresh token logic** for better security
2. **Implementing email verification** for new registrations
3. **Adding social login options** (Google, Facebook)
4. **Creating user profile management** pages
5. **Adding password strength indicators**
6. **Implementing session timeout warnings**

## Support

If you encounter any issues:
1. Check the browser console for errors
2. Verify your backend API is working with tools like Postman
3. Ensure all environment variables are set correctly
4. Check the network tab for failed API requests 