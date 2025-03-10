"use client";

import { useState, useEffect } from "react";
import PhoneCard from "@/components/phones/phone-card";
import { Phone, getPhones } from "@/libs/api";

export default function PhonesPage() {
  const [phones, setPhones] = useState<Phone[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPhones() {
      try {
        const response = await getPhones();

        if (response.success && response.data) {
          setPhones(response.data);
        } else {
          setError(response.error || "Failed to fetch phones");
        }
      } catch (err) {
        setError("An unexpected error occurred");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPhones();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Phones</h1>
        <p className="text-gray-600">
          Explore our collection of the latest smartphones and mobile devices.
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
      ) : phones.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">
            No phones available at the moment.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {phones.map((phone) => (
            <PhoneCard key={phone.id} phone={phone} />
          ))}
        </div>
      )}
    </div>
  );
}
