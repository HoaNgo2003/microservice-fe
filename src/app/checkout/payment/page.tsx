/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import { CreditCard, CheckCircle, Tickets } from "lucide-react";
import { useCart } from "@/components/context/cart-context";
import { formatPrice } from "@/libs/util";
import { useRouter, useSearchParams } from "next/navigation";
import { isAuthenticated } from "@/libs/auth";

declare global {
  interface Window {
    paypal?: {
      Buttons: (config: any) => {
        render: (target: string) => void;
      };
    };
  }
}

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('orderId');
  const { cart, getCartCount, clearCart } = useCart();
  const [isClient, setIsClient] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"Credit Card" | "Paypal">(
    "Credit Card"
  );
  const [isPaypalReady, setIsPaypalReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const paypalButtonRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<any>(null);

  // Calculate totals
  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.07;
  const total = subtotal + shipping + tax;

  useEffect(() => {
    setIsClient(true);

    // Redirect to cart if cart is empty
    // if (getCartCount() === 0) {
    //   router.push("/cart");
    // }
  }, [getCartCount, router]);

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

  // Initialize PayPal buttons when the SDK is loaded and the container is ready
  // useEffect(() => {
  //   if (isPaypalReady && paypalButtonRef.current && window.paypal) {
  //     // Clear any existing buttons
  //     paypalButtonRef.current.innerHTML = "";

  //     window.paypal
  //       .Buttons({
  //         createOrder: (data: any, actions: any) => {
  //           return actions.order.create({
  //             purchase_units: [
  //               {
  //                 amount: {
  //                   value: total.toFixed(2),
  //                   currency_code: "USD",
  //                   breakdown: {
  //                     item_total: {
  //                       value: subtotal.toFixed(2),
  //                       currency_code: "USD",
  //                     },
  //                     shipping: {
  //                       value: shipping.toFixed(2),
  //                       currency_code: "USD",
  //                     },
  //                     tax_total: {
  //                       value: tax.toFixed(2),
  //                       currency_code: "USD",
  //                     },
  //                   },
  //                 },
  //                 items: cart.map((item) => ({
  //                   name: item.name,
  //                   unit_amount: {
  //                     value: item.price.toFixed(2),
  //                     currency_code: "USD",
  //                   },
  //                   quantity: item.quantity,
  //                   category: "PHYSICAL_GOODS",
  //                 })),
  //               },
  //             ],
  //           });
  //         },
  //         onApprove: (data: any, actions: any) => {
  //           setIsProcessing(true);

  //           // This would normally call your backend to process the payment
  //           return actions.order.capture().then(() => {
  //             // Payment successful - redirect to success page
  //             clearCart();
  //             router.push("/checkout/confirmation");
  //           });
  //         },
  //         onError: (err: any) => {
  //           console.error("PayPal Error:", err);
  //           alert(
  //             "There was an error processing your payment. Please try again."
  //           );
  //           setIsProcessing(false);
  //         },
  //       })
  //       .render(`#${paypalButtonRef.current.id}`);
  //   }
  // }, [isPaypalReady, cart, subtotal, shipping, tax, total, clearCart, router]);

  const handlePaypalLoad = () => {
    setIsPaypalReady(true);
  };

  const handleCreditCardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    const response = await fetch(`http://127.0.0.1:8001/payment/payment/payments/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        order_id: id,
        method: paymentMethod,
        customer_id: user?.id
      }),
    });

    console.log("Add payment API response status:", response.status);

    // Simulate payment processing
    if (response.status >= 200 && response.status < 299) {
      setTimeout(() => {
        clearCart();
        router.push("/checkout/confirmation");
      }, 2000);
    }

  };

  if (!isClient) {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 py-12">
          <div className="container mx-auto px-4">
            <h1 className="mb-8 text-3xl font-bold">
              Loading payment options...
            </h1>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">


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
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white">
                  2
                </div>
                <span className="ml-2 font-medium">Payment</span>
              </div>
              <div className="mx-4 h-1 w-8 bg-gray-300"></div>
              <div className="flex items-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300 text-gray-600">
                  3
                </div>
                <span className="ml-2 text-gray-600">Confirmation</span>
              </div>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Payment Options */}
            <div className="lg:col-span-2">
              <div className="rounded-lg bg-white p-6 shadow-md">
                <h2 className="mb-6 text-xl font-semibold">Payment Method</h2>

                <div className="mb-6">
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("Credit Card")}
                      className={`flex flex-1 items-center justify-center rounded-md border p-4 ${paymentMethod === "Credit Card"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 bg-white"
                        }`}
                    >
                      <CreditCard className="mr-2 h-5 w-5" />
                      <span>Credit Card</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("Paypal")}
                      className={`flex flex-1 items-center justify-center rounded-md border p-4 ${paymentMethod === "Paypal"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 bg-white"
                        }`}
                    >
                      <Tickets className="mr-2 h-5 w-5" />
                      <span>PayPal</span>
                    </button>
                  </div>
                </div>

                {paymentMethod === "Credit Card" ? (
                  <form onSubmit={handleCreditCardSubmit}>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="md:col-span-2">
                        <label
                          htmlFor="cardName"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Name on card
                        </label>
                        <input
                          type="text"
                          id="cardName"
                          name="cardName"
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                          placeholder="John Smith"
                          required
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label
                          htmlFor="cardNumber"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Card number
                        </label>
                        <input
                          type="text"
                          id="cardNumber"
                          name="cardNumber"
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                          placeholder="4242 4242 4242 4242"
                          required
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="expDate"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Expiration date
                        </label>
                        <input
                          type="text"
                          id="expDate"
                          name="expDate"
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                          placeholder="MM/YY"
                          required
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="cvv"
                          className="block text-sm font-medium text-gray-700"
                        >
                          CVV
                        </label>
                        <input
                          type="text"
                          id="cvv"
                          name="cvv"
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                          placeholder="123"
                          required
                        />
                      </div>
                    </div>

                    <div className="mt-8">
                      <button
                        type="submit"
                        disabled={isProcessing}
                        className="w-full rounded-md bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                      >
                        {isProcessing
                          ? "Processing..."
                          : `Pay ${formatPrice(total)}`}
                      </button>
                    </div>
                  </form>
                ) : (
                  // <div>
                  //   <Script
                  //     src="https://www.paypal.com/sdk/js?client-id=test&currency=USD"
                  //     onLoad={handlePaypalLoad}
                  //   />
                  //   <div ref={paypalButtonRef} className="mt-4">
                  //     {!isPaypalReady && (
                  //       <div className="flex justify-center py-4">
                  //         <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
                  //       </div>
                  //     )}
                  //   </div>
                  // </div>
                  <form onSubmit={handleCreditCardSubmit}>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="md:col-span-2">
                        <label
                          htmlFor="cardName"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Name on card
                        </label>
                        <input
                          type="text"
                          id="cardName"
                          name="cardName"
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                          placeholder="John Smith"
                          required
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label
                          htmlFor="cardNumber"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Card number
                        </label>
                        <input
                          type="text"
                          id="cardNumber"
                          name="cardNumber"
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                          placeholder="4242 4242 4242 4242"
                          required
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="expDate"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Expiration date
                        </label>
                        <input
                          type="text"
                          id="expDate"
                          name="expDate"
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                          placeholder="MM/YY"
                          required
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="cvv"
                          className="block text-sm font-medium text-gray-700"
                        >
                          CVV
                        </label>
                        <input
                          type="text"
                          id="cvv"
                          name="cvv"
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                          placeholder="123"
                          required
                        />
                      </div>
                    </div>

                    <div className="mt-8">
                      <button
                        type="submit"
                        disabled={isProcessing}
                        className="w-full rounded-md bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                      >
                        {isProcessing
                          ? "Processing..."
                          : `Pay ${formatPrice(total)}`}
                      </button>
                    </div>
                  </form>
                )}

                <div className="mt-6 border-t border-gray-200 pt-6">
                  <p className="text-sm text-gray-500">
                    By completing your purchase, you agree to our{" "}
                    <Link href="#" className="text-blue-600 hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="#" className="text-blue-600 hover:underline">
                      Privacy Policy
                    </Link>
                    .
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  href="/checkout"
                  className="text-sm font-medium text-blue-600 hover:underline"
                >
                  ← Return to shipping
                </Link>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="rounded-lg bg-white p-6 shadow-md">
                <h2 className="mb-6 text-xl font-semibold">Order Summary</h2>

                <div className="max-h-80 overflow-y-auto">
                  {cart.map((item) => (
                    <div
                      key={`${item.id}-${item.product_type}`}
                      className="mb-4 flex items-center"
                    >
                      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                        <img src={item.image_urls || "/placeholder.svg"}
                          alt={item.name}
                          className="object-contain p-1" />
                        <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                          {item.quantity}
                        </div>
                      </div>
                      <div className="ml-4 flex-1">
                        <h3 className="text-sm font-medium text-gray-900">
                          {item.name}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {item.color && `${item.color} / `}
                          {item.size && `${item.size} / `}
                          {formatPrice(item.price)}
                        </p>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 border-t border-gray-200 pt-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Subtotal</span>
                    <span className="text-sm font-medium">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  <div className="mt-2 flex justify-between">
                    <span className="text-sm text-gray-600">Shipping</span>
                    <span className="text-sm font-medium">
                      {shipping === 0 ? "Free" : formatPrice(shipping)}
                    </span>
                  </div>
                  <div className="mt-2 flex justify-between">
                    <span className="text-sm text-gray-600">Tax (7%)</span>
                    <span className="text-sm font-medium">
                      {formatPrice(tax)}
                    </span>
                  </div>
                  <div className="mt-4 flex justify-between border-t border-gray-200 pt-4">
                    <span className="text-base font-medium">Total</span>
                    <span className="text-base font-medium">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="rounded-md bg-gray-50 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <CheckCircle className="h-5 w-5 text-green-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-gray-700">
                          Your order qualifies for free shipping! Select this
                          option at checkout.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>


    </div>
  );
}
