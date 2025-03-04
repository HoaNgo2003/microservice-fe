"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useCart } from "../context/cart-context";
import { formatPrice } from "../lib/util";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Calculate totals
  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.07;
  const total = subtotal + shipping + tax;

  if (!isClient) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 py-12">
          <div className="container mx-auto px-4">
            <h1 className="mb-8 text-3xl font-bold">Loading cart...</h1>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <h1 className="mb-8 text-3xl font-bold">Your Shopping Cart</h1>

          {cart.length === 0 ? (
            <div className="rounded-lg bg-white p-8 text-center shadow-md">
              <h2 className="mb-4 text-xl font-semibold">Your cart is empty</h2>
              <p className="mb-6 text-gray-600">
                Looks like you haven&#39;t added any products to your cart yet.
              </p>
              <Link
                href="/"
                className="inline-block rounded-md bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="mb-4 overflow-hidden rounded-lg bg-white shadow-md">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                        >
                          Product
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                        >
                          Price
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                        >
                          Quantity
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                        >
                          Total
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                        >
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {cart.map((item) => (
                        <tr key={`${item.id}-${item.category}`}>
                          <td className="whitespace-nowrap px-6 py-4">
                            <div className="flex items-center">
                              <div className="relative h-16 w-16 flex-shrink-0">
                                <Image
                                  src={item.image || "/placeholder.svg"}
                                  alt={item.name}
                                  fill
                                  className="object-contain"
                                />
                              </div>
                              <div className="ml-4">
                                <Link
                                  href={`/product/${item.category.toLowerCase()}/${
                                    item.id
                                  }`}
                                  className="font-medium text-gray-900 hover:text-blue-600"
                                >
                                  {item.name}
                                </Link>
                                <div className="text-sm text-gray-500">
                                  {item.category}
                                  {item.color && <span> / {item.color}</span>}
                                  {item.size && <span> / {item.size}</span>}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                            {formatPrice(item.price)}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                            <div className="flex w-32 items-center">
                              <button
                                className="flex h-8 w-8 items-center justify-center rounded-l-md border border-r-0 border-gray-300 bg-gray-100 text-gray-600 hover:bg-gray-200"
                                onClick={() =>
                                  updateQuantity(
                                    item.id,
                                    item.category,
                                    Math.max(1, item.quantity - 1)
                                  )
                                }
                                aria-label="Decrease quantity"
                              >
                                <svg
                                  className="h-3 w-3"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M20 12H4"
                                  />
                                </svg>
                              </button>
                              <input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) =>
                                  updateQuantity(
                                    item.id,
                                    item.category,
                                    Number.parseInt(e.target.value) || 1
                                  )
                                }
                                className="h-8 w-12 border-y border-gray-300 bg-white text-center text-gray-700 focus:outline-none"
                              />
                              <button
                                className="flex h-8 w-8 items-center justify-center rounded-r-md border border-l-0 border-gray-300 bg-gray-100 text-gray-600 hover:bg-gray-200"
                                onClick={() =>
                                  updateQuantity(
                                    item.id,
                                    item.category,
                                    item.quantity + 1
                                  )
                                }
                                aria-label="Increase quantity"
                              >
                                <svg
                                  className="h-3 w-3"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 4v16m8-8H4"
                                  />
                                </svg>
                              </button>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                            {formatPrice(item.price * item.quantity)}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                            <button
                              onClick={() =>
                                removeFromCart(item.id, item.category)
                              }
                              className="text-red-600 hover:text-red-900"
                              aria-label="Remove item"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={clearCart}
                    className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Clear Cart
                  </button>
                  <Link
                    href="/"
                    className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="rounded-lg bg-white p-6 shadow-md">
                  <h2 className="mb-4 text-lg font-semibold">Order Summary</h2>

                  <div className="mb-6 space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">
                        {formatPrice(subtotal)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium">
                        {shipping === 0 ? "Free" : formatPrice(shipping)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax (7%)</span>
                      <span className="font-medium">{formatPrice(tax)}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between">
                        <span className="text-lg font-semibold">Total</span>
                        <span className="text-lg font-semibold">
                          {formatPrice(total)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Link
                    href="/checkout"
                    className="w-full rounded-md bg-blue-600 px-6 py-3 text-center text-white hover:bg-blue-700 block"
                  >
                    Proceed to Checkout
                  </Link>

                  <div className="mt-4 text-center text-sm text-gray-500">
                    <p>We accept</p>
                    <div className="mt-2 flex justify-center space-x-2">
                      <div className="h-8 w-12 rounded bg-gray-200"></div>
                      <div className="h-8 w-12 rounded bg-gray-200"></div>
                      <div className="h-8 w-12 rounded bg-gray-200"></div>
                      <div className="h-8 w-12 rounded bg-gray-200"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
