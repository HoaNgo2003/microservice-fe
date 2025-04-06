"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle } from "lucide-react";
import { useCart } from "@/components/context/cart-context";
// import { formatPrice } from "@/libs/util" // Removed as it's being defined locally

interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  saveInfo: boolean;
}

// Utility function for formatting prices
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
};

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, getCartCount } = useCart();
  const [cartData, setCartData] = useState([]);
  const [isClient, setIsClient] = useState(false);
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US",
    saveInfo: false,
  });
  const [errors, setErrors] = useState<Record<keyof ShippingInfo, string>>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    saveInfo: "",
  });

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
    const fetchCartData = async () => {
      const cart = await fetch('')
    }
    // Redirect to cart if cart is empty
    // if (getCartCount() === 0) {
    //   router.push("/cart");
    // }
  }, [getCartCount, router]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    setShippingInfo((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when field is edited
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<keyof ShippingInfo, string> = {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      apartment: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      saveInfo: "",
    };

    // Required fields
    const requiredFields: (keyof ShippingInfo)[] = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "address",
      "city",
      "state",
      "zipCode",
      "country",
    ];

    requiredFields.forEach((field) => {
      if (!shippingInfo[field]) {
        newErrors[field] = `${
          field.charAt(0).toUpperCase() +
          field.slice(1).replace(/([A-Z])/g, " $1")
        } is required`;
      }
    });

    // Email validation
    if (shippingInfo.email && !/\S+@\S+\.\S+/.test(shippingInfo.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone validation
    if (
      shippingInfo.phone &&
      !/^\d{10,}$/.test(shippingInfo.phone.replace(/\D/g, ""))
    ) {
      newErrors.phone = "Please enter a valid phone number";
    }

    // Zip code validation
    // if (
    //   shippingInfo.zipCode &&
    //   !/^\d{5}(-\d{4})?$/.test(shippingInfo.zipCode)
    // ) {
    //   newErrors.zipCode = "Please enter a valid zip code";
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      // Save shipping info to localStorage
      if (shippingInfo.saveInfo) {
        localStorage.setItem("shippingInfo", JSON.stringify(shippingInfo));
      }

      try {
        // First create the address
        const addressResponse = await fetch(
          "http://127.0.0.1:8005/api/addresses/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              street: shippingInfo.address,
              city: shippingInfo.city,
              state: shippingInfo.state,
              country: shippingInfo.country,
              postal_code: shippingInfo.zipCode,
              customer: 3, // Using the customer ID from the example
            }),
          }
        );

        if (!addressResponse.ok) {
          throw new Error("Failed to create address");
        }

        const addressData = await addressResponse.json();
        console.log("Address created:", addressData);

        // Then create the order
        const orderItems = cart.map((item) => ({
          category: item.category || "books", // Default to books if category is missing
          product_id: item.id,
          product_name: item.name,
          quantity: item.quantity,
        }));

        const orderResponse = await fetch(
          "http://127.0.0.1:8006/order/orders/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              customer_id: 3, // Using the customer ID from the example
              items: orderItems,
            }),
          }
        );

        if (!orderResponse.ok) {
          throw new Error("Failed to create order");
        }

        const orderData = await orderResponse.json();
        console.log("Order created:", orderData);

        // Proceed to payment
        router.push("/checkout/payment");
      } catch (error) {
        console.error("Error during checkout:", error);
        alert("There was an error processing your order. Please try again.");
      }
    }
  };

  if (!isClient) {
    return (
      <div className="flex min-h-screen flex-col">
        {/* <Header /> */}
        <main className="flex-1 py-12">
          <div className="container mx-auto px-4">
            <h1 className="mb-8 text-3xl font-bold">Loading checkout...</h1>
          </div>
        </main>
        {/* <Footer /> */}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* <Header /> */}

      <main className="flex-1 bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Checkout</h1>
            <div className="mt-4 flex items-center">
              <div className="flex items-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white">
                  1
                </div>
                <span className="ml-2 font-medium">Shipping</span>
              </div>
              <div className="mx-4 h-1 w-8 bg-gray-300"></div>
              <div className="flex items-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300 text-gray-600">
                  2
                </div>
                <span className="ml-2 text-gray-600">Payment</span>
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
            {/* Shipping Form */}
            <div className="lg:col-span-2">
              <div className="rounded-lg bg-white p-6 shadow-md">
                <h2 className="mb-6 text-xl font-semibold">
                  Shipping Information
                </h2>

                <form onSubmit={handleSubmit}>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label
                        htmlFor="firstName"
                        className="block text-sm font-medium text-gray-700"
                      >
                        First Name *
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={shippingInfo.firstName}
                        onChange={handleChange}
                        className={`mt-1 block w-full rounded-md border ${
                          errors.firstName
                            ? "border-red-500"
                            : "border-gray-300"
                        } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500`}
                      />
                      {errors.firstName && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.firstName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="lastName"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Last Name *
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={shippingInfo.lastName}
                        onChange={handleChange}
                        className={`mt-1 block w-full rounded-md border ${
                          errors.lastName ? "border-red-500" : "border-gray-300"
                        } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500`}
                      />
                      {errors.lastName && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.lastName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={shippingInfo.email}
                        onChange={handleChange}
                        className={`mt-1 block w-full rounded-md border ${
                          errors.email ? "border-red-500" : "border-gray-300"
                        } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500`}
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Phone *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={shippingInfo.phone}
                        onChange={handleChange}
                        className={`mt-1 block w-full rounded-md border ${
                          errors.phone ? "border-red-500" : "border-gray-300"
                        } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500`}
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label
                        htmlFor="address"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Address *
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={shippingInfo.address}
                        onChange={handleChange}
                        className={`mt-1 block w-full rounded-md border ${
                          errors.address ? "border-red-500" : "border-gray-300"
                        } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500`}
                      />
                      {errors.address && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.address}
                        </p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label
                        htmlFor="apartment"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Apartment, suite, etc. (optional)
                      </label>
                      <input
                        type="text"
                        id="apartment"
                        name="apartment"
                        value={shippingInfo.apartment}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="city"
                        className="block text-sm font-medium text-gray-700"
                      >
                        City *
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={shippingInfo.city}
                        onChange={handleChange}
                        className={`mt-1 block w-full rounded-md border ${
                          errors.city ? "border-red-500" : "border-gray-300"
                        } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500`}
                      />
                      {errors.city && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.city}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="state"
                        className="block text-sm font-medium text-gray-700"
                      >
                        State/Province *
                      </label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={shippingInfo.state}
                        onChange={handleChange}
                        className={`mt-1 block w-full rounded-md border ${
                          errors.state ? "border-red-500" : "border-gray-300"
                        } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500`}
                      />
                      {errors.state && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.state}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="zipCode"
                        className="block text-sm font-medium text-gray-700"
                      >
                        ZIP / Postal code *
                      </label>
                      <input
                        type="text"
                        id="zipCode"
                        name="zipCode"
                        value={shippingInfo.zipCode}
                        onChange={handleChange}
                        className={`mt-1 block w-full rounded-md border ${
                          errors.zipCode ? "border-red-500" : "border-gray-300"
                        } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500`}
                      />
                      {errors.zipCode && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.zipCode}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="country"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Country *
                      </label>
                      <select
                        id="country"
                        name="country"
                        value={shippingInfo.country}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                      >
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="MX">Mexico</option>
                        <option value="UK">United Kingdom</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="flex items-center">
                      <input
                        id="saveInfo"
                        name="saveInfo"
                        type="checkbox"
                        checked={shippingInfo.saveInfo}
                        onChange={handleChange}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label
                        htmlFor="saveInfo"
                        className="ml-2 block text-sm text-gray-700"
                      >
                        Save this information for next time
                      </label>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-between">
                    <Link
                      href="/cart"
                      className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Return to Cart
                    </Link>
                    <button
                      type="submit"
                      className="rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Continue to Payment
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="rounded-lg bg-white p-6 shadow-md">
                <h2 className="mb-6 text-xl font-semibold">Order Summary</h2>

                <div className="max-h-80 overflow-y-auto">
                  {cart.map((item) => (
                    <div
                      key={`${item.id}-${item.category}`}
                      className="mb-4 flex items-center"
                    >
                      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          className="object-contain p-1"
                        />
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

      {/* <Footer /> */}
    </div>
  );
}
