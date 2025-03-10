"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/libs/api";

export default function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form validation errors
  const [errors, setErrors] = useState<{
    email?: string;
    username?: string;
    password?: string;
    password2?: string;
    phone_number?: string;
  }>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const password2 = formData.get("password2") as string;
    const customer_type =
      (formData.get("customer_type") as string) || "regular";
    const phone_number = formData.get("phone_number") as string;

    // Basic validation
    const newErrors: {
      email?: string;
      username?: string;
      password?: string;
      password2?: string;
      phone_number?: string;
    } = {};

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!username || username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!password || password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (password !== password2) {
      newErrors.password2 = "Passwords do not match";
    }

    if (!phone_number) {
      newErrors.phone_number = "Phone number is required";
    }

    // If there are validation errors, stop submission
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    // Prepare registration data
    const registrationData = {
      email,
      username,
      password,
      password2,
      customer_type,
      phone_number,
    };

    try {
      const response = await registerUser(registrationData);

      if (response.success && response.data) {
        // Registration successful
        // Optionally auto-login the user or redirect to login
        router.push("/registration-success");
      } else {
        // Handle API error response
        if (response.error) {
          setError(response.error);
        } else {
          setError("Registration failed. Please try again.");
        }

        // Handle field-specific errors if the API returns them
        if (response.data && typeof response.data === "object") {
          const fieldErrors: {
            email?: string;
            username?: string;
            password?: string;
            password2?: string;
            phone_number?: string;
          } = {};

          for (const [key, value] of Object.entries(response.data)) {
            if (
              key === "email" ||
              key === "username" ||
              key === "password" ||
              key === "password2" ||
              key === "phone_number"
            ) {
              fieldErrors[key] = Array.isArray(value) ? value[0] : value;
            }
          }

          if (Object.keys(fieldErrors).length > 0) {
            setErrors(fieldErrors);
          }
        }
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-1">Create an Account</h2>
        <p className="text-gray-600 text-sm">
          Fill in the form below to register
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className={`w-full px-3 py-2 border ${
              errors.email ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="Enter your email"
            required
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="username" className="block text-sm font-medium mb-1">
            Username
          </label>
          <input
            id="username"
            name="username"
            className={`w-full px-3 py-2 border ${
              errors.username ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="Choose a username"
            required
          />
          {errors.username && (
            <p className="mt-1 text-sm text-red-600">{errors.username}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            className={`w-full px-3 py-2 border ${
              errors.password ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="Create a password"
            required
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}
        </div>

        <div>
          <label htmlFor="password2" className="block text-sm font-medium mb-1">
            Confirm Password
          </label>
          <input
            id="password2"
            name="password2"
            type="password"
            className={`w-full px-3 py-2 border ${
              errors.password2 ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="Confirm your password"
            required
          />
          {errors.password2 && (
            <p className="mt-1 text-sm text-red-600">{errors.password2}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="customer_type"
            className="block text-sm font-medium mb-1"
          >
            Customer Type
          </label>
          <select
            id="customer_type"
            name="customer_type"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            defaultValue="regular"
          >
            <option value="regular">Regular</option>
            <option value="premium">Premium</option>
            <option value="business">Business</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="phone_number"
            className="block text-sm font-medium mb-1"
          >
            Phone Number
          </label>
          <input
            id="phone_number"
            name="phone_number"
            className={`w-full px-3 py-2 border ${
              errors.phone_number ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="Enter your phone number"
            required
          />
          {errors.phone_number && (
            <p className="mt-1 text-sm text-red-600">{errors.phone_number}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}
