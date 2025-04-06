/**
 * API utility functions for making requests to the backend
 */

// Base URL for the API
const API_BASE_URL = "http://127.0.0.1:8001";

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  password2: string;
  customer_type: string;
  phone_number: string;
}

// Types for API responses
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Types for specific API endpoints
export interface LoginResponse {
  access?: string;
  refresh: string;
  user?: {
    id: string;
    username: string;
    // Add other user properties as needed
  };
}

/**
 * Generic function to make API requests
 */
export async function apiRequest<T>(
  endpoint: string,
  method = "GET",
  data?: unknown,
  headers: HeadersInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;

  const requestHeaders: HeadersInit = {
    "Content-Type": "application/json",
    ...headers,
  };

  // Get auth token from localStorage if available (for authenticated requests)
  const token =
    typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
  if (token && method !== "GET") {
    requestHeaders["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      method,
      headers: requestHeaders,
      body: data ? JSON.stringify(data) : undefined,
    });

    const responseData = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error:
          responseData.message || responseData.error || "An error occurred",
      };
    }

    return {
      success: true,
      data: responseData,
    };
  } catch (error) {
    console.error("API request failed:", error);
    return {
      success: false,
      error: "Network error. Please check your connection and try again.",
    };
  }
}

/**
 * Authentication API functions
 */
export async function loginUser(
  username: string,
  password: string
): Promise<ApiResponse<LoginResponse>> {
  return apiRequest<LoginResponse>("/customer/api/login/", "POST", {
    username,
    password,
  });
}

export async function registerUser(
  data: RegisterData
): Promise<ApiResponse<any>> {
  return apiRequest<any>("/customer/api/register/", "POST", data);
}

export interface Book {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  created_at: string;
  updated_at: string;
  url: string;
  author: string;
  isbn: string;
}

export interface Clothes {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  created_at: string;
  updated_at: string;
  url: string;
  size: string;
  color: string;
  material: string;
}

export interface Phone {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  created_at: string;
  updated_at: string;
  url: string;
  brand: string;
  model: string;
  os: string;
}

export async function getBooks(): Promise<ApiResponse<Book[]>> {
  return apiRequest<Book[]>("/book/api/books/", "GET");
}

export async function getBookById(id: number): Promise<ApiResponse<Book>> {
  return apiRequest<Book>(`/book/api/books/${id}/`, "GET");
}

export async function getClothes(): Promise<ApiResponse<Clothes[]>> {
  return apiRequest<Clothes[]>("/clothes/api/clothes/", "GET");
}

export async function getClothesById(
  id: number
): Promise<ApiResponse<Clothes>> {
  return apiRequest<Clothes>(`/clothes/api/clothes/${id}/`, "GET");
}

export async function getPhones(): Promise<ApiResponse<Phone[]>> {
  return apiRequest<Phone[]>("/phone/api/phones/", "GET");
}

export async function getPhoneById(id: number): Promise<ApiResponse<Phone>> {
  return apiRequest<Phone>(`/phone/api/phones/${id}/`, "GET");
}
/**
 * Example of how to add other API functions
 */
// export async function getUserProfile(
//   userId: string
// ): Promise<ApiResponse<unknown>> {
//   return apiRequest<unknown>(`/customer/api/users/${userId}/`, "GET");
// }

// export async function updateUserProfile(
//   userId: string,
//   data: unknown
// ): Promise<ApiResponse<unknown>> {
//   return apiRequest<unknown>(`/customer/api/users/${userId}/`, "PUT", data);
// }

// Add more API functions as needed
