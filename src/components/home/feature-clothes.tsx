"use client";

import { useState, useEffect } from "react";
import ClothesCard from "@/components/clothes/clothes-card";
import Link from "next/link";
import { Clothes, getClothes } from "@/libs/api";

export default function FeaturedClothes() {
  const [clothes, setClothes] = useState<Clothes[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchClothes() {
      try {
        const response = await getClothes();

        if (response.success && response.data) {
          // Get up to 5 clothes for the featured section
          setClothes(response.data.slice(0, 5));
        } else {
          setError(response.error || "Failed to fetch clothes");
        }
      } catch (err) {
        setError("An unexpected error occurred");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchClothes();
  }, []);

  if (isLoading) {
    return (
      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Featured Clothes
            </h2>
            <Link
              href="/category/clothes"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              View All
            </Link>
          </div>

          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Featured Clothes
            </h2>
            <Link
              href="/category/clothes"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              View All
            </Link>
          </div>

          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        </div>
      </section>
    );
  }

  if (clothes.length === 0) {
    return null;
  }

  return (
    <section className="py-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Featured Clothes</h2>
          <Link
            href="/category/clothes"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            View All
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {clothes.map((item) => (
            <ClothesCard key={item.id} clothes={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
