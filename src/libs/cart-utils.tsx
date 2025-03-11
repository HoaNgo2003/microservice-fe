/**
 * Utility functions for cart operations
 */

// Base API URL
const API_BASE_URL = "http://127.0.0.1:8001";

// Function to add item to cart
export async function addToCart(
  productId: number,
  quantity: number,
  category: string
) {
  try {
    // Get the current user ID from localStorage
    const userData = localStorage.getItem("userData");
    let customerId = 1; // Default to 1 if not logged in

    if (userData) {
      try {
        const user = JSON.parse(userData);
        if (user.id) {
          customerId = Number.parseInt(user.id);
        }
      } catch (e) {
        console.error("Error parsing user data:", e);
      }
    }

    // Prepare the request data
    const cartData = {
      quantity,
      productId,
      customerId,
      category,
    };

    console.log("Adding to cart with data:", cartData);

    // Call the API with the correct endpoint
    const response = await fetch(`${API_BASE_URL}/cart/cart/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cartData),
    });

    // Log the response status
    console.log("Cart API response status:", response.status);

    // Check if response is OK
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response from cart API:", errorText);
      throw new Error(
        `Failed to add item to cart: ${response.status} ${response.statusText}`
      );
    }

    // Try to parse the response as JSON
    try {
      const data = await response.json();
      console.log("Cart API response data:", data);

      // Trigger cart update event
      window.dispatchEvent(new CustomEvent("cart-updated"));

      return data;
    } catch (parseError) {
      console.error("Error parsing cart API response:", parseError);
      throw new Error("Invalid response format from cart API");
    }
  } catch (error) {
    console.error("Error adding item to cart:", error);
    throw error;
  }
}

// Function to get cart data
export async function getCart() {
  try {
    // Get the current user ID from localStorage
    const userData = localStorage.getItem("userData");
    let customerId = 1; // Default to 1 if not logged in

    if (userData) {
      try {
        const user = JSON.parse(userData);
        if (user.id) {
          customerId = Number.parseInt(user.id);
        }
      } catch (e) {
        console.error("Error parsing user data:", e);
      }
    }

    console.log("Getting cart for customer ID:", customerId);

    // Call the API to get cart data with the correct endpoint
    const response = await fetch(`${API_BASE_URL}/cart/${customerId}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Get cart API response status:", response.status);

    // Check if response is OK
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response from get cart API:", errorText);
      return { items: [] };
    }

    // Try to parse the response as JSON
    try {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        console.log("Get cart API response data:", data);
        return data.cart || { items: [] };
      } else {
        // Not JSON, log the actual response for debugging
        const text = await response.text();
        console.error("Non-JSON response from get cart API:", text);
        return { items: [] };
      }
    } catch (parseError) {
      console.error("Error parsing get cart API response:", parseError);
      return { items: [] };
    }
  } catch (error) {
    console.error("Error getting cart:", error);
    return { items: [] }; // Return empty cart on error
  }
}

// Function to get cart count
export async function getCartCount() {
  try {
    const cart = await getCart();

    // Check if cart and items exist before reducing
    if (cart && cart.items && Array.isArray(cart.items)) {
      // Calculate total quantity of items in cart
      return cart.items.reduce(
        (total: any, item: { quantity: any }) => total + item.quantity,
        0
      );
    }
    return 0;
  } catch (error) {
    console.error("Error getting cart count:", error);
    return 0;
  }
}

// Function to update cart item quantity
export async function updateCartItemQuantity(
  customerId: number,
  productId: number,
  quantity: number,
  category: string
) {
  try {
    console.log(
      `Updating cart item: customer=${customerId}, product=${productId}, quantity=${quantity}, category = ${category}`
    );

    const response = await fetch(`${API_BASE_URL}/cart/cart-update/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customerId,
        productId,
        quantity,
        category,
      }),
    });

    console.log("Update cart item API response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response from update cart API:", errorText);
      throw new Error(
        `Failed to update cart item: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log("Update cart item API response data:", data);

    // Trigger cart update event
    window.dispatchEvent(new CustomEvent("cart-updated"));

    return data;
  } catch (error) {
    console.error("Error updating cart item:", error);
    throw error;
  }
}

// Function to remove cart item
export async function removeCartItem(
  customerId: number,
  productId: number,
  category: string
) {
  try {
    console.log(
      `Removing cart item: customer=${customerId}, product=${productId}, category=${category}`
    );

    const response = await fetch(
      `${API_BASE_URL}/cart/${customerId}/remove/${category}/${productId}/`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Remove cart item API response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response from remove cart item API:", errorText);
      throw new Error(
        `Failed to remove cart item: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log("Remove cart item API response data:", data);

    // Trigger cart update event
    window.dispatchEvent(new CustomEvent("cart-updated"));

    return data;
  } catch (error) {
    console.error("Error removing cart item:", error);
    throw error;
  }
}
