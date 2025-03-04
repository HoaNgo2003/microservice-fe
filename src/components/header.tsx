"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, Search, Menu, X } from "lucide-react";
import { useCart } from "@/app/context/cart-context";

export default function Header() {
  const { getCartCount } = useCart();
  const [cartCount, setCartCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setCartCount(getCartCount());
  }, [getCartCount]);

  // Update cart count whenever it changes
  useEffect(() => {
    if (isClient) {
      const interval = setInterval(() => {
        setCartCount(getCartCount());
      }, 500);

      return () => clearInterval(interval);
    }
  }, [getCartCount, isClient]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <button
              className="mr-2 block md:hidden"
              onClick={toggleMenu}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-gray-700" />
              ) : (
                <Menu className="h-6 w-6 text-gray-700" />
              )}
            </button>

            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">ShopEasy</span>
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for products..."
                className="w-80 rounded-full border border-gray-300 px-4 py-2 pl-10 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <Search className="h-5 w-5" />
              </div>
            </div>
          </div>

          <nav className="flex items-center space-x-6">
            <Link
              href="/cart"
              className="flex items-center text-gray-700 hover:text-blue-600"
            >
              <div className="relative">
                <ShoppingBag className="h-6 w-6" />
                {cartCount > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="ml-1 text-sm font-medium">Cart</span>
            </Link>
            <Link
              href="/login"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Login
            </Link>
          </nav>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="block border-t border-gray-100 py-2 md:hidden">
            <div className="mb-4 mt-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for products..."
                  className="w-full rounded-full border border-gray-300 px-4 py-2 pl-10 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <Search className="h-5 w-5" />
                </div>
              </div>
            </div>
            <nav className="flex flex-col space-y-2">
              <Link
                href="/product/phones"
                className="text-sm font-medium text-gray-700 hover:text-blue-600"
              >
                Phones
              </Link>
              <Link
                href="/product/books"
                className="text-sm font-medium text-gray-700 hover:text-blue-600"
              >
                Books
              </Link>
              <Link
                href="/product/clothes"
                className="text-sm font-medium text-gray-700 hover:text-blue-600"
              >
                Clothes
              </Link>
              <Link
                href="/deals"
                className="text-sm font-medium text-gray-700 hover:text-blue-600"
              >
                Deals
              </Link>
              <Link
                href="/new-arrivals"
                className="text-sm font-medium text-gray-700 hover:text-blue-600"
              >
                New Arrivals
              </Link>
            </nav>
          </div>
        )}

        <div className="hidden border-t border-gray-100 py-2 md:flex md:items-center md:justify-center">
          <nav className="flex space-x-8">
            <Link
              href="/product/phones"
              className="text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              Phones
            </Link>
            <Link
              href="/product/books"
              className="text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              Books
            </Link>
            <Link
              href="/product/clothes"
              className="text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              Clothes
            </Link>
            <Link
              href="/deals"
              className="text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              Deals
            </Link>
            <Link
              href="/new-arrivals"
              className="text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              New Arrivals
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
