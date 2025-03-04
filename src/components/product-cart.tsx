"use client";

import type React from "react";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/app/context/cart-context";
import { Product } from "@/app/lib/types";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart(product, 1);
  };

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-md transition-transform hover:scale-105">
      <Link href={`/product/${product.category.toLowerCase()}/${product.id}`}>
        <div className="relative h-48">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-contain"
          />
        </div>
      </Link>
      <div className="p-4">
        <Link href={`/product/${product.category.toLowerCase()}/${product.id}`}>
          <h3 className="mb-2 text-lg font-medium">{product.name}</h3>
        </Link>
        <div className="mb-4 flex items-center">
          <p className="text-xl font-bold text-blue-600">
            ${product.price.toFixed(2)}
          </p>
          {product.originalPrice && (
            <p className="ml-2 text-sm text-gray-500 line-through">
              ${product.originalPrice.toFixed(2)}
            </p>
          )}
        </div>
        <button
          className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
