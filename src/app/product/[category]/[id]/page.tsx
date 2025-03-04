"use client";

import type React from "react";

import { useState } from "react";
import { notFound, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { getFeaturedProducts, getProductById } from "@/app/lib/data";
import { useCart } from "@/app/context/cart-context";
import { Tabs } from "@/components/tabs";
import ProductCard from "@/components/product-cart";
import { Product } from "@/app/lib/types";

interface ProductPageProps {
  params: {
    category: string;
    id: string;
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  const router = useRouter();
  const { category, id } = params;
  const product = getProductById(category, Number.parseInt(id));
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  if (!product) {
    notFound();
  }

  // Get related products from the same category
  const relatedProducts = getFeaturedProducts(category, 4).filter(
    (p) => p.id !== product.id
  );

  const handleAddToCart = () => {
    addToCart(
      {
        ...product,
        color: selectedColor || undefined,
        size: selectedSize || undefined,
      },
      quantity
    );

    // Show confirmation and navigate to cart
    if (confirm("Product added to cart. View cart now?")) {
      router.push("/cart");
    }
  };

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => setQuantity((prev) => Math.max(1, prev - 1));
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };

  // Color options for clothes
  const colorOptions = [
    { name: "Red", class: "bg-red-500" },
    { name: "Blue", class: "bg-blue-500" },
    { name: "Green", class: "bg-green-500" },
    { name: "Yellow", class: "bg-yellow-500" },
    { name: "Purple", class: "bg-purple-500" },
  ];

  // Size options for clothes
  const sizeOptions = ["XS", "S", "M", "L", "XL"];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-gray-100 py-4">
          <div className="container mx-auto px-4">
            <div className="flex items-center text-sm text-gray-500">
              <Link href="/" className="hover:text-blue-600">
                Home
              </Link>
              <span className="mx-2">/</span>
              <Link
                href={`/product/${category}`}
                className="hover:text-blue-600"
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Link>
              <span className="mx-2">/</span>
              <span className="text-gray-700">{product.name}</span>
            </div>
          </div>
        </div>

        {/* Product Overview */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 md:grid-cols-2">
              {/* Product Images */}
              <div className="space-y-4">
                <div className="overflow-hidden rounded-lg bg-white p-6 shadow-md">
                  <div className="relative h-80 w-full">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>

                {/* Thumbnails */}
                <div className="grid grid-cols-4 gap-2">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="cursor-pointer overflow-hidden rounded-md border-2 border-transparent hover:border-blue-500"
                    >
                      <div className="relative h-20 w-full bg-white">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={`${product.name} thumbnail ${i + 1}`}
                          fill
                          className="object-contain p-2"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Product Info */}
              <div className="flex flex-col">
                <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

                {/* Ratings */}
                <div className="mb-4 flex items-center">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="ml-2 text-gray-600">(24 reviews)</span>
                </div>

                {/* Price & Stock */}
                <div className="mb-6">
                  <div className="flex items-center">
                    <p className="text-3xl font-bold text-blue-600">
                      ${product.price.toFixed(2)}
                    </p>
                    {product.originalPrice && (
                      <p className="ml-3 text-lg text-gray-500 line-through">
                        ${product.originalPrice.toFixed(2)}
                      </p>
                    )}
                  </div>
                  <p className="text-sm text-green-600 mt-1">
                    <span className="inline-flex items-center">
                      <svg
                        className="h-4 w-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      In Stock
                    </span>
                  </p>
                </div>

                {/* Short Description */}
                <p className="mb-6 text-gray-700">
                  {product.description || "No description available."}
                </p>

                {/* Color Options (if applicable) */}
                {category === "clothes" && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      Color
                    </h3>
                    <div className="flex space-x-2">
                      {colorOptions.map((color) => (
                        <button
                          key={color.name}
                          className={`h-8 w-8 rounded-full ${
                            color.class
                          } focus:outline-none ${
                            selectedColor === color.name
                              ? "ring-2 ring-offset-2 ring-blue-500"
                              : ""
                          }`}
                          onClick={() => setSelectedColor(color.name)}
                          aria-label={`Select ${color.name} color`}
                        />
                      ))}
                    </div>
                    {selectedColor && (
                      <p className="mt-1 text-sm text-gray-500">
                        Selected: {selectedColor}
                      </p>
                    )}
                  </div>
                )}

                {/* Size Options (if applicable) */}
                {category === "clothes" && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      Size
                    </h3>
                    <div className="grid grid-cols-5 gap-2">
                      {sizeOptions.map((size) => (
                        <button
                          key={size}
                          className={`border py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            selectedSize === size
                              ? "border-blue-500 bg-blue-50 text-blue-600"
                              : "border-gray-300 hover:border-blue-500 hover:text-blue-500"
                          }`}
                          onClick={() => setSelectedSize(size)}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                    {selectedSize && (
                      <p className="mt-1 text-sm text-gray-500">
                        Selected: {selectedSize}
                      </p>
                    )}
                  </div>
                )}

                {/* Quantity Selector */}
                <div className="mb-6">
                  <label
                    htmlFor="quantity"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Quantity
                  </label>
                  <div className="flex w-32 items-center">
                    <button
                      className="flex h-10 w-10 items-center justify-center rounded-l-md border border-r-0 border-gray-300 bg-gray-100 text-gray-600 hover:bg-gray-200"
                      onClick={decrementQuantity}
                    >
                      <svg
                        className="h-4 w-4"
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
                      id="quantity"
                      min="1"
                      value={quantity}
                      onChange={handleQuantityChange}
                      className="h-10 w-12 border-y border-gray-300 bg-white text-center text-gray-700 focus:outline-none"
                    />
                    <button
                      className="flex h-10 w-10 items-center justify-center rounded-r-md border border-l-0 border-gray-300 bg-gray-100 text-gray-600 hover:bg-gray-200"
                      onClick={incrementQuantity}
                    >
                      <svg
                        className="h-4 w-4"
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
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
                  <button
                    className="flex-1 rounded-md bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    onClick={handleAddToCart}
                  >
                    Add to Cart
                  </button>
                  <button className="flex items-center justify-center rounded-md border border-gray-300 px-6 py-3 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    Add to Wishlist
                  </button>
                </div>

                {/* Additional Info */}
                <div className="mt-8 border-t border-gray-200 pt-6">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <svg
                      className="h-5 w-5 mr-2 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>Free delivery on orders over $50</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <svg
                      className="h-5 w-5 mr-2 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    <span>30-day return policy</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <svg
                      className="h-5 w-5 mr-2 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                    <span>Secure payment</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Product Details Tabs */}
        <section className="py-8 bg-gray-50">
          <div className="container mx-auto px-4">
            <Tabs
              product={product}
              specifications={[
                { name: "Brand", value: "ShopEasy" },
                { name: "Model", value: product.name },
                { name: "Release Year", value: "2023" },
                { name: "Warranty", value: "1 Year" },
                { name: "Country of Origin", value: "United States" },
              ]}
              reviews={[
                {
                  id: 1,
                  author: "John D.",
                  rating: 5,
                  date: "2 months ago",
                  comment: "Excellent product! Exactly what I was looking for.",
                },
                {
                  id: 2,
                  author: "Sarah M.",
                  rating: 4,
                  date: "1 month ago",
                  comment: "Great quality and fast shipping. Would buy again.",
                },
                {
                  id: 3,
                  author: "Michael R.",
                  rating: 5,
                  date: "3 weeks ago",
                  comment: "Exceeded my expectations. Highly recommend!",
                },
              ]}
            />
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="py-12">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-bold mb-8">You May Also Like</h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {relatedProducts.map((product: Product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
