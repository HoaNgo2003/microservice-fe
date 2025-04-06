"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  getCart,
  removeCartItem,
  updateCartItemQuantity,
} from "@/libs/cart-utils";
import { CartItem } from "@/libs/cart";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const router = useRouter();
  useEffect(() => {
    // Load cart items
    async function loadCart() {
      setIsLoading(true);
      try {
        // Import the getCart function
        let cart = await fetch(`http://127.0.0.1:8001/cart/1/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        cart = await cart.json();
        // Debug log to see what's coming back from the API
        console.log("Cart data from API:", cart);

        // Convert API cart items to CartItem format

        setCartItems(cart?.items);
      } catch (error) {
        console.error("Failed to load cart:", error);
        setCartItems([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadCart();

    // Listen for cart updates
    const handleCartUpdate = () => {
      loadCart();
    };

    window.addEventListener("cart-updated", handleCartUpdate);

    return () => {
      window.removeEventListener("cart-updated", handleCartUpdate);
    };
  }, []);

  const handleQuantityChange = async (
    productId: string,
    newQuantity: number,
    category: string,
    cartId: string
  ) => {
    setIsUpdating(cartId);
    try {
      // Import the updateCartItemQuantity function

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

      await updateCartItemQuantity(
        customerId,
        Number.parseInt(productId),
        newQuantity,
        category
      );

      // Trigger cart update event
      window.dispatchEvent(new CustomEvent("cart-updated"));
    } catch (error) {
      console.error("Failed to update quantity:", error);
    } finally {
      setIsUpdating(null);
    }
  };

  const handleRemoveItem = async (
    productId: string,
    category: string,
    cartId: string
  ) => {
    setIsUpdating(cartId);
    try {
      // Import the removeCartItem function

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

      await removeCartItem(customerId, Number.parseInt(productId), category);

      // Trigger cart update event
      window.dispatchEvent(new CustomEvent("cart-updated"));
    } catch (error) {
      console.error("Failed to remove item:", error);
    } finally {
      setIsUpdating(null);
    }
  };

  // Function to calculate cart total
  const calculateCartTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  // Function to render product-specific details
  const renderProductDetails = (item: CartItem) => {
    if (item.category === "books" && item.author) {
      return <p className="text-sm text-gray-500">By {item.author}</p>;
    } else if (item.category === "clothes" && item.size) {
      return (
        <div className="text-sm text-gray-500">
          <p>Size: {item.size}</p>
          {item.color && <p>Color: {item.color}</p>}
        </div>
      );
    } else if (item.category === "phones" && item.brand) {
      return (
        <div className="text-sm text-gray-500">
          <p>Brand: {item.brand}</p>
          <p>Model: {item.model}</p>
        </div>
      );
    }
    return <p className="text-sm text-gray-500 capitalize">{item.category}</p>;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">
            Looks like you haven&lsquo;t added any products to your cart yet.
          </p>
          <Link
            href="/"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const cartTotal = calculateCartTotal();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left pb-4">Product</th>
                    <th className="text-center pb-4">Quantity</th>
                    <th className="text-right pb-4">Price</th>
                    <th className="text-right pb-4">Total</th>
                    <th className="pb-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="py-4">
                        <div className="flex items-center">
                          <img
                            src={
                              item.image_urls ||
                              "/placeholder.svg?height=80&width=80"
                            }
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-md mr-4"
                          />
                          <div>
                            <h3 className="font-medium">{item.name}</h3>
                            {renderProductDetails(item)}
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center justify-center">
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                item.product_id ?? "1",
                                item.quantity - 1,
                                item.product_type || "",
                                item.id
                              )
                            }
                            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-l-md"
                            disabled={
                              item.quantity <= 1 || isUpdating === item.id
                            }
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) =>
                              handleQuantityChange(
                                item.product_id ?? "1",
                                Number.parseInt(e.target.value) || 1,
                                item.product_type || "",
                                item.id
                              )
                            }
                            className="w-12 h-8 border-t border-b border-gray-300 text-center"
                            disabled={isUpdating === item.id}
                          />
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                item.product_id ?? "1",
                                item.quantity + 1,
                                item.product_type || "",
                                item.id
                              )
                            }
                            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-r-md"
                            disabled={isUpdating === item.id}
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="py-4 text-right">
                        ${item.price.toFixed(2)}
                      </td>
                      <td className="py-4 text-right font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </td>
                      <td className="py-4 text-right">
                        {isUpdating === item.id ? (
                          <div className="inline-block h-5 w-5 border-t-2 border-b-2 border-blue-600 rounded-full animate-spin"></div>
                        ) : (
                          <button
                            onClick={() =>
                              handleRemoveItem(
                                item.product_id ?? "1",
                                item.product_type ?? "",
                                item.id
                              )
                            }
                            className="text-red-500 hover:text-red-700"
                            disabled={isUpdating === item.id}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-bold mb-4">Order Summary</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span>${(cartTotal * 0.1).toFixed(2)}</span>
              </div>
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${(cartTotal * 1.1).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => router.push("/checkout")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Proceed to Checkout
            </button>

            <div className="mt-4">
              <Link
                href="/"
                className="text-blue-600 hover:text-blue-800 text-sm flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
