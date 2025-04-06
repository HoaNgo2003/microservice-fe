"use client";

import { Book } from "@/libs/api";
import { addToCart } from "@/libs/cart-utils";
import Link from "next/link";
import { useState } from "react";

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Function to add item to cart
  const handleAddToCart = async () => {
    setIsAddingToCart(true);

    try {
      await addToCart(book.id, 1, "books");
      alert(`${book.name} added to cart!`);
    } catch (error) {
      console.error("Failed to add to cart:", error);
      alert("Failed to add item to cart. Please try again.");
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg hover:-translate-y-1">
      <div className="aspect-square overflow-hidden">
        <img
          src={book.url || "/placeholder.svg?height=300&width=300"}
          alt={book.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-medium text-gray-900 mb-1 truncate">{book.name}</h3>
        <p className="text-sm text-gray-500 mb-2">By {book.author}</p>

        {book.stock > 0 ? (
          <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full mb-2">
            In Stock ({book.stock})
          </span>
        ) : (
          <span className="inline-block px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full mb-2">
            Out of Stock
          </span>
        )}

        <div className="flex items-center justify-between mt-2">
          <span className="text-lg font-bold text-gray-900">
            ${book.price.toFixed(2)}
          </span>

          <div className="flex space-x-2">
            <Link
              href={`/books/${book.id}`}
              className="p-2 text-blue-600 hover:text-blue-800"
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
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </Link>

            <button
              onClick={handleAddToCart}
              className="p-2 text-blue-600 hover:text-blue-800 relative"
              disabled={book.stock <= 0 || isAddingToCart}
            >
              {isAddingToCart ? (
                <div className="h-5 w-5 border-t-2 border-b-2 border-blue-600 rounded-full animate-spin"></div>
              ) : (
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
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
