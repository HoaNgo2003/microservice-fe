/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { getOrdersByCustomerId } from "@/libs/api";
import { isAuthenticated, useRequireAuth } from "@/libs/auth";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function OrdersPage() {
  const { loading } = useRequireAuth();
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const [orders, setOrders] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      if (isAuthenticated()) {
        const userData = localStorage.getItem("userData");
        if (userData) {
          try {
            setUser(JSON.parse(userData));
          } catch (e) {
            console.error("Error parsing user data:", e);
          }
        }
      } else {
        setUser(null);
      }
    };

    checkAuth();
  }, [])

  useEffect(() => {
    async function fetchOrders() {
      if (user?.id) {
        try {
          const response = await getOrdersByCustomerId(user?.id);

          if (response.success && response.data) {
            // Get up to 5 Orders for the featured section
            setOrders(response.data);
          } else {
            setError(response.error || "Failed to fetch orders");
          }

        } catch (err) {
          setError("An unexpected error occurred");
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      }
    }

    fetchOrders();
  }, [user]);

  if (loading || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  const toggleOrderDetails = (orderId: string) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {orders.length === 0 ? (
          <div className="p-8 text-center">
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
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
            <p className="text-gray-600 mb-6">
              You haven&apos;t placed any orders yet.
            </p>
            <Link
              href="/"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div>
            <div className="hidden md:grid grid-cols-5 gap-4 p-4 bg-gray-50 border-b border-gray-200 font-medium">
              <div>Order ID</div>
              <div>Date</div>
              <div>Status</div>
              <div>Total</div>
              <div></div>
            </div>

            <div className="divide-y divide-gray-200">
              {orders.map((order: any) => (
                <div key={order.id} className="p-4">
                  <div className="md:grid md:grid-cols-5 md:gap-4 flex flex-col space-y-2 md:space-y-0 md:items-center">
                    <div className="font-medium">{order.id}</div>
                    <div className="text-gray-600">
                      {new Date(order.created_at).toLocaleDateString()}
                    </div>
                    <div>
                      <span
                        className={`inline-block px-2 py-1 text-xs rounded-full ${order.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : order.status === "Pending"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                          }`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <div className="font-medium">${Number(order.total_price).toFixed(2)}</div>
                    <div className="text-right">
                      <button
                        onClick={() => toggleOrderDetails(order.id)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center justify-end"
                      >
                        {expandedOrder === order.id
                          ? "Hide Details"
                          : "View Details"}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className={`h-4 w-4 ml-1 transition-transform ${expandedOrder === order.id ? "rotate-180" : ""
                            }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {expandedOrder === order.id && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <h3 className="font-medium mb-2">Order Items</h3>
                      <div className="space-y-3">
                        {order.items.map((item: any) => (
                          <div key={item.id} className="flex items-center">
                            <img
                              src={item.product_image || "/placeholder.svg"}
                              alt={item.product_name}
                              className="w-16 h-16 object-cover rounded-md mr-4"
                            />
                            <div className="flex-grow">
                              <h4 className="font-medium">{item.product_name}</h4>
                              <p className="text-sm text-gray-600">
                                Qty: {item.quantity} × ${Number(item.price).toFixed(2)}
                              </p>
                            </div>
                            <div className="font-medium">
                              ${(item.price * item.quantity).toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
