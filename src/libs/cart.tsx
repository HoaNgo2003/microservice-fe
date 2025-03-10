"use client";

import type { Product } from "@/components/home/product-card";

// Extended Product interface to include book, clothes, and phone specific fields
export interface ExtendedProduct extends Product {
  // Book specific fields
  author?: string;
  isbn?: string;

  // Clothes specific fields
  size?: string;
  color?: string;
  material?: string;

  // Phone specific fields
  brand?: string;
  model?: string;
  os?: string;
}

export interface CartItem extends ExtendedProduct {
  quantity: number;
}

// Get cart from localStorage
export function getCart(): CartItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  const cart = localStorage.getItem("cart");
  if (!cart) {
    return [];
  }

  try {
    return JSON.parse(cart);
  } catch (e) {
    console.error("Error parsing cart data:", e);
    return [];
  }
}

// Add item to cart
export function addToCart(product: ExtendedProduct, quantity = 1): void {
  if (typeof window === "undefined") {
    return;
  }

  const cart = getCart();

  // Check if product already exists in cart
  const existingItemIndex = cart.findIndex((item) => item.id === product.id);

  if (existingItemIndex !== -1) {
    // Update quantity if product already exists
    cart[existingItemIndex].quantity += quantity;
  } else {
    // Add new product to cart
    cart.push({ ...product, quantity });
  }

  // Save updated cart to localStorage
  localStorage.setItem("cart", JSON.stringify(cart));

  // Dispatch custom event for components to listen to
  window.dispatchEvent(new CustomEvent("cart-updated"));
}

// Remove item from cart
export function removeFromCart(productId: string): void {
  if (typeof window === "undefined") {
    return;
  }

  const cart = getCart();
  const updatedCart = cart.filter((item) => item.id !== productId);

  // Save updated cart to localStorage
  localStorage.setItem("cart", JSON.stringify(updatedCart));

  // Dispatch custom event for components to listen to
  window.dispatchEvent(new CustomEvent("cart-updated"));
}

// Update item quantity
export function updateCartItemQuantity(
  productId: string,
  quantity: number
): void {
  if (typeof window === "undefined") {
    return;
  }

  const cart = getCart();

  const updatedCart = cart.map((item) => {
    if (item.id === productId) {
      return { ...item, quantity: Math.max(1, quantity) };
    }
    return item;
  });

  // Save updated cart to localStorage
  localStorage.setItem("cart", JSON.stringify(updatedCart));

  // Dispatch custom event for components to listen to
  window.dispatchEvent(new CustomEvent("cart-updated"));
}

// Get cart total
export function getCartTotal(): number {
  const cart = getCart();
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

// Get cart item count
export function getCartItemCount(): number {
  const cart = getCart();
  return cart.reduce((count, item) => count + item.quantity, 0);
}

// Clear cart
export function clearCart(): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem("cart", JSON.stringify([]));

  // Dispatch custom event for components to listen to
  window.dispatchEvent(new CustomEvent("cart-updated"));
}
