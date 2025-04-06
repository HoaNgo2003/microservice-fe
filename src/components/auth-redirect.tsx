"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface AuthRedirectProps {
  children: React.ReactNode;
  redirectTo: string;
  whenAuthenticated?: boolean;
}

/**
 * Component that redirects based on authentication state
 *
 * @param children - The content to render if no redirect happens
 * @param redirectTo - The path to redirect to
 * @param whenAuthenticated - If true, redirects when user is authenticated; if false, redirects when not authenticated
 */
export default function AuthRedirect({
  children,
  redirectTo,
  whenAuthenticated = false,
}: AuthRedirectProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if we're in the browser
    if (typeof window !== "undefined") {
      const hasToken = !!localStorage.getItem("authToken");

      // Redirect logic
      if (whenAuthenticated && hasToken) {
        // Redirect authenticated users away from this page
        router.replace(redirectTo);
      } else if (!whenAuthenticated && !hasToken) {
        // Redirect unauthenticated users away from this page
        router.replace(redirectTo);
      } else {
        // No redirect needed, show the children
        setIsLoading(false);
      }
    }
  }, [router, redirectTo, whenAuthenticated]);

  // Show nothing while checking authentication
  if (isLoading) {
    return null;
  }

  // Show children if no redirect happened
  return <>{children}</>;
}
