"use client";

import AuthRedirect from "@/components/auth-redirect";
import { logout, useRequireAuth } from "@/libs/auth";

export default function Dashboard() {
  const { user, loading } = useRequireAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <AuthRedirect redirectTo="/" whenAuthenticated={false}>
      <main className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Welcome back, {user?.username || "User"}!
            </p>
          </div>

          <div className="bg-white rounded-lg border p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-4">Account Information</h2>
            <div className="space-y-2">
              {user && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Username:</span>
                    <span className="font-medium">{user.username}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">User ID:</span>
                    <span className="font-medium">{user.id}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            Logout
          </button>
        </div>
      </main>
    </AuthRedirect>
  );
}
