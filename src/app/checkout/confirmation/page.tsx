"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { CheckCircle, Package, Truck, Home } from "lucide-react";
import { useCart } from "@/app/context/cart-context";

export default function ConfirmationPage() {
  const router = useRouter();
  const { getCartCount } = useCart();
  const [orderNumber, setOrderNumber] = useState("");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    // Generate a random order number
    const randomOrderNumber = Math.floor(
      100000000 + Math.random() * 900000000
    ).toString();
    setOrderNumber(randomOrderNumber);

    // If someone tries to access this page directly and they have items in their cart,
    // they probably didn't complete checkout, so redirect them
    if (getCartCount() > 0) {
      router.push("/cart");
    }
  }, [getCartCount, router]);

  if (!isClient) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 py-12">
          <div className="container mx-auto px-4">
            <h1 className="mb-8 text-3xl font-bold">
              Processing your order...
            </h1>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Checkout</h1>
            <div className="mt-4 flex items-center">
              <div className="flex items-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-white">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <span className="ml-2 font-medium">Shipping</span>
              </div>
              <div className="mx-4 h-1 w-8 bg-blue-600"></div>
              <div className="flex items-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-white">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <span className="ml-2 font-medium">Payment</span>
              </div>
              <div className="mx-4 h-1 w-8 bg-blue-600"></div>
              <div className="flex items-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white">
                  3
                </div>
                <span className="ml-2 font-medium">Confirmation</span>
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-3xl">
            <div className="rounded-lg bg-white p-8 shadow-md">
              <div className="mb-6 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Thank you for your order!
                </h2>
                <p className="mt-2 text-gray-600">
                  Your order has been received and is now being processed.
                </p>
              </div>

              <div className="mb-8 rounded-md bg-gray-50 p-4">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">
                    Order Number:
                  </span>
                  <span className="text-sm font-bold">{orderNumber}</span>
                </div>
                <div className="mt-2 flex justify-between">
                  <span className="text-sm font-medium text-gray-500">
                    Order Date:
                  </span>
                  <span className="text-sm">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
                <div className="mt-2 flex justify-between">
                  <span className="text-sm font-medium text-gray-500">
                    Estimated Delivery:
                  </span>
                  <span className="text-sm">
                    {new Date(
                      Date.now() + 7 * 24 * 60 * 60 * 1000
                    ).toLocaleDateString()}{" "}
                    -
                    {new Date(
                      Date.now() + 10 * 24 * 60 * 60 * 1000
                    ).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="mb-4 text-lg font-semibold">Order Status</h3>
                <div className="relative">
                  <div className="absolute left-4 top-0 h-full w-0.5 bg-gray-200"></div>

                  <div className="relative mb-8 flex">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
                      <CheckCircle className="h-5 w-5" />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-md font-medium">Order Confirmed</h4>
                      <p className="text-sm text-gray-500">
                        Your order has been placed
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date().toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="relative mb-8 flex">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-500">
                      <Package className="h-5 w-5" />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-md font-medium text-gray-500">
                        Processing
                      </h4>
                      <p className="text-sm text-gray-500">
                        Your order is being prepared
                      </p>
                    </div>
                  </div>

                  <div className="relative mb-8 flex">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-500">
                      <Truck className="h-5 w-5" />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-md font-medium text-gray-500">
                        Shipped
                      </h4>
                      <p className="text-sm text-gray-500">
                        Your order is on the way
                      </p>
                    </div>
                  </div>

                  <div className="relative flex">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-500">
                      <Home className="h-5 w-5" />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-md font-medium text-gray-500">
                        Delivered
                      </h4>
                      <p className="text-sm text-gray-500">
                        Package arrived at your doorstep
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-8 rounded-md bg-blue-50 p-4 text-blue-800">
                <p className="text-sm">
                  <strong>Note:</strong> You will receive an email confirmation
                  with your order details and tracking information once your
                  order ships.
                </p>
              </div>

              <div className="text-center">
                <Link
                  href="/"
                  className="inline-block rounded-md bg-blue-600 px-6 py-3 text-center text-sm font-medium text-white hover:bg-blue-700"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
