/**
 * Utility functions for cart operations
 */

// Function to add item to cart
export async function addToCart(
  productId: string,
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

    // Call the API
    const response = await fetch("/cart/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cartData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to add item to cart");
    }

    // Trigger cart update event
    window.dispatchEvent(new CustomEvent("cart-updated"));

    return data;
  } catch (error) {
    console.error("Error adding item to cart:", error);
    throw error;
  }
}

// Function to get cart count
export function getCartCount() {
  // This would typically fetch the cart from the API
  // For now, we'll return a placeholder value
  return 0;
}
