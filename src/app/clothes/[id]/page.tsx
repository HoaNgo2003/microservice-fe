/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
import Link from "next/link";
import { Clothes, fetchComments, getClothesById, postComment } from "@/libs/api";
import { addToCart } from "@/libs/cart-utils";
import { isAuthenticated } from "@/libs/auth";

export default function ClothesDetailPage({
  params,
}: {
  readonly params: { readonly id: string };
}) {
  //   const router = useRouter();
  const [clothes, setClothes] = useState<Clothes | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>("");

  const [user, setUser] = useState<any>(null);

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);
  const [loadingComment, setLoadingComment] = useState(false);


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
    async function fetchClothes() {
      try {
        const clothesId = Number.parseInt(params.id);

        if (isNaN(clothesId)) {
          setError("Invalid clothes ID");
          setIsLoading(false);
          return;
        }

        const response = await getClothesById(clothesId);

        if (response.success && response.data) {
          setClothes(response.data);
          // Set the first size as default selected size
          if (response.data.size) {
            const sizes = response.data.size
              .split(",")
              .map((size) => size.trim());
            if (sizes.length > 0) {
              setSelectedSize(sizes[0]);
            }
          }
        } else {
          setError(response.error || "Failed to fetch clothes details");
        }
      } catch (err) {
        setError("An unexpected error occurred");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchClothes();
  }, [params.id]);


  useEffect(() => {
    if (clothes) {
      const fetchCommentsData = async () => {
        setLoadingComments(true); // bắt đầu loading
        const data = await fetchComments(clothes.id, "clothes");
        setComments(data);
        setLoadingComments(false); // kết thúc loading
      };

      fetchCommentsData();
    }
  }, [clothes])

  const handleAddToCart = () => {
    if (!clothes) return;

    const product = {
      id: clothes.id,
      name: clothes.name,
      price: clothes.price,
      image: clothes.url || "/placeholder.svg?height=300&width=300",
      category: "clothes",
      rating: 4.5, // Default rating since API doesn't provide one
      size: selectedSize || clothes.size,
      color: clothes.color,
      material: clothes.material,
    };

    addToCart(product.id, quantity, "clothes");

    // Show a toast or notification
    alert(`${clothes.name} added to cart!`);
  };

  // Get available sizes as an array
  const sizes = clothes?.size
    ? clothes.size.split(",").map((size) => size.trim())
    : [];


  const handleComment = async () => {

    if (!newComment.trim() || !clothes) return;
    setLoadingComment(true); // bật loading
    await postComment({
      user_id: user?.id, // có thể lấy từ localStorage nếu có auth
      username: user?.username,
      product_id: clothes.id,
      category: "clothes",
      content: newComment,
    });

    // reload lại comment
    const updated = await fetchComments(clothes.id, "clothes");
    setComments(updated);
    setNewComment("");

    setLoadingComment(false); // tắt loading
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error || !clothes) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error || "Clothes not found"}
        </div>
        <div className="mt-4">
          <Link
            href="/category/clothes"
            className="text-blue-600 hover:underline"
          >
            &larr; Back to Clothes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <Link
          href="/category/clothes"
          className="text-blue-600 hover:underline"
        >
          &larr; Back to Clothes
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          <div className="flex justify-center">
            <img
              src={clothes.url || "/placeholder.svg?height=500&width=400"}
              alt={clothes.name}
              className="max-h-[500px] object-contain"
            />
          </div>

          <div className="space-y-4">
            <h1 className="text-3xl font-bold">{clothes.name}</h1>

            <div className="flex items-center space-x-4">
              <span className="text-2xl font-bold text-gray-900">
                ${clothes.price.toFixed(2)}
              </span>

              {clothes.stock > 0 ? (
                <span className="inline-block px-2 py-1 text-sm bg-green-100 text-green-800 rounded-full">
                  In Stock ({clothes.stock})
                </span>
              ) : (
                <span className="inline-block px-2 py-1 text-sm bg-red-100 text-red-800 rounded-full">
                  Out of Stock
                </span>
              )}
            </div>

            <div className="border-t border-b py-4 my-4">
              <p className="text-gray-700">{clothes.description}</p>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Color</h3>
                <div className="flex items-center space-x-2">
                  <span
                    className="inline-block w-6 h-6 rounded-full border border-gray-300"
                    style={{ backgroundColor: clothes.color.toLowerCase() }}
                  ></span>
                  <span>{clothes.color}</span>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Material</h3>
                <p>{clothes.material}</p>
              </div>

              <div>
                <h3 className="font-medium mb-2">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size, index) => (
                    <button
                      key={index}
                      className={`px-3 py-1 border rounded-md ${selectedSize === size
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-800 border-gray-300 hover:border-blue-600"
                        }`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
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
                    max={clothes.stock}
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Number.parseInt(e.target.value) || 1)
                    }
                    className="w-12 h-8 border-t border-b border-gray-300 text-center"
                  />
                  <button
                    onClick={() =>
                      setQuantity(Math.min(clothes.stock, quantity + 1))
                    }
                    className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-r-md"
                    disabled={quantity >= clothes.stock}
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={clothes.stock <= 0 || !selectedSize}
              >
                {clothes.stock > 0 ? "Add to Cart" : "Out of Stock"}
              </button>

              {clothes.stock > 0 && !selectedSize && (
                <p className="text-red-500 text-sm mt-2">
                  Please select a size
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="mt-8 mx-[20px]">
          <h2 className="text-xl font-semibold mb-4">Customer Comments</h2>

          {loadingComments ? (
            <div className="text-gray-500 italic">Loading comments...</div>
          ) : comments.length === 0 ? (
            <p className="text-gray-500">No comments yet.</p>
          ) : (
            <ul className="space-y-4">
              {comments?.map((c: any) => (
                <li key={c.id} className="bg-gray-100 p-4 rounded-md shadow-sm">
                  <p className="text-gray-800">{c.username}: {c.content}</p>
                  <p className={`text-sm ${c.sentiment === 'Tích cực' ? 'text-green-500' : (c.sentiment === 'Tiêu cực' ? 'text-red-500' : 'text-gray-500')} mt-1`}>Sentiment: {c.sentiment}</p>
                  <p className="text-sm text-gray-500 mt-1">Confidence: {c.confidence}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="mt-6 mx-[20px] mb-[20px]">
          <h3 className="text-lg font-medium mb-2">Leave a Comment</h3>
          <textarea
            className="w-full border border-gray-300 rounded-md p-2"
            rows={3}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write your comment here..."
          ></textarea>

          <button
            onClick={handleComment}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            disabled={loadingComment}
          >
            {loadingComment ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}
