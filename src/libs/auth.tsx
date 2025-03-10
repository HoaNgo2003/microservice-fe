"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Type for user data
export interface User {
  id: string;
  username: string;
  // Add other user properties as needed
}

// Custom event for auth state changes
export const AUTH_STATE_CHANGE_EVENT = "auth-state-change";

// Function to notify components about auth state changes
export function notifyAuthStateChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(AUTH_STATE_CHANGE_EVENT));
  }
}

// Hook to get the current user
export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if we're in the browser
    if (typeof window === "undefined") {
      setLoading(false);
      return;
    }

    // Get user data from localStorage
    const userData = localStorage.getItem("userData");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error("Error parsing user data:", e);
      }
    }
    setLoading(false);
  }, []);

  return { user, loading };
}

// Hook to protect routes
export function useRequireAuth() {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Check if we're in the browser and not loading
    if (typeof window !== "undefined" && !loading) {
      const hasToken = !!localStorage.getItem("authToken");

      if (!hasToken) {
        router.replace("/");
      }
    }
  }, [loading, router]);

  return { user, loading };
}

// Function to check if user is authenticated
export function isAuthenticated(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  return !!localStorage.getItem("authToken");
}

// Function to log out
export function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    notifyAuthStateChange();
    window.location.href = "/";
  }
}
