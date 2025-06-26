"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const ProtectedRoute = ({ children, redirectTo = "/login" }) => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated()) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, loading, router, redirectTo]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh" 
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  // Don't render children if not authenticated
  if (!isAuthenticated()) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 