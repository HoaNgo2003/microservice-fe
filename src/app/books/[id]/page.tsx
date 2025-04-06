"use client";

import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
import Link from "next/link";
import { Book, getBookById } from "@/libs/api";
import { addToCart } from "@/libs/cart-utils";

export default function BookDetailPage({ params }: { params: { id: string } }) {
  //   const router = useRouter();
  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    async function fetchBook() {
      try {
        const bookId = Number.parseInt(params.id);

        if (isNaN(bookId)) {
          setError("Invalid book ID");
          setIsLoading(false);
          return;
        }

        const response = await getBookById(bookId);

        if (response.success && response.data) {
          setBook(response.data);
        } else {
          setError(response.error || "Failed to fetch book details");
        }
      } catch (err) {
        setError("An unexpected error occurred");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchBook();
  }, [params.id]);

  const handleAddToCart = async () => {
    if (!book) return;

    setIsAddingToCart(true);

    try {
      await addToCart(book.id, quantity, "books");
      alert(`${book.name} added to cart!`);
    } catch (error) {
      console.error("Failed to add to cart:", error);
      alert("Failed to add item to cart. Please try again.");
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error || "Book not found"}
        </div>
        <div className="mt-4">
          <Link
            href="/category/books"
            className="text-blue-600 hover:underline"
          >
            &larr; Back to Books
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <Link href="/category/books" className="text-blue-600 hover:underline">
          &larr; Back to Books
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          <div className="flex justify-center">
            <img
              src={book.url || "/placeholder.svg?height=500&width=400"}
              alt={book.name}
              className="max-h-[500px] object-contain"
            />
          </div>

          <div className="space-y-4">
            <h1 className="text-3xl font-bold">{book.name}</h1>
            <p className="text-lg text-gray-600">By {book.author}</p>

            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-gray-900">
                ${book.price.toFixed(2)}
              </span>

              {book.stock > 0 ? (
                <span className="inline-block px-2 py-1 text-sm bg-green-100 text-green-800 rounded-full">
                  In Stock ({book.stock})
                </span>
              ) : (
                <span className="inline-block px-2 py-1 text-sm bg-red-100 text-red-800 rounded-full">
                  Out of Stock
                </span>
              )}
            </div>

            <div className="border-t border-b py-4 my-4">
              <p className="text-gray-700">{book.description}</p>
            </div>

            <div className="space-y-2">
              <p className="text-gray-700">
                <span className="font-medium">ISBN:</span> {book.isbn}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Published:</span>{" "}
                {new Date(book.created_at).toLocaleDateString()}
              </p>
            </div>

            <div className="pt-4">
              <div className="flex items-center space-x-4 mb-4">
                <label htmlFor="quantity" className="font-medium">
                  Quantity:
                </label>
                <div className="flex items-center">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-l-md"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <input
                    id="quantity"
                    type="number"
                    min="1"
                    max={book.stock}
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Number.parseInt(e.target.value) || 1)
                    }
                    className="w-12 h-8 border-t border-b border-gray-300 text-center"
                  />
                  <button
                    onClick={() =>
                      setQuantity(Math.min(book.stock, quantity + 1))
                    }
                    className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-r-md"
                    disabled={quantity >= book.stock}
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                disabled={book.stock <= 0 || isAddingToCart}
              >
                {isAddingToCart ? (
                  <>
                    <div className="h-5 w-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                    Adding to Cart...
                  </>
                ) : book.stock > 0 ? (
                  "Add to Cart"
                ) : (
                  "Out of Stock"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
