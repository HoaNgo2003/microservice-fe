"use client";

import { useState, useEffect } from "react";
import ClothesCard from "@/components/clothes/clothes-card";
import { Clothes, getClothes } from "@/libs/api";

export default function ClothesPage() {
  const [clothes, setClothes] = useState<Clothes[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchClothes() {
      try {
        const response = await getClothes();

        if (response.success && response.data) {
          setClothes(response.data);
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Clothes</h1>
        <p className="text-gray-600">
          Explore our collection of stylish clothes for all occasions.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      ) : clothes.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">
            No clothes available at the moment.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {clothes.map((item) => (
            <ClothesCard key={item.id} clothes={item} />
          ))}
        </div>
      )}
    </div>
  );
}
