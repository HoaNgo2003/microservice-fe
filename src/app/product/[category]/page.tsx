import { notFound } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { getProductsByCategory } from "@/app/lib/data";
import { Link } from "lucide-react";

interface CategoryPageProps {
  params: {
    category: string;
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { category } = params;
  const products = getProductsByCategory(category);

  if (!products || products.length === 0) {
    notFound();
  }

  // Format category name for display (e.g., "phones" -> "Phones")
  const formattedCategory =
    category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <div className="bg-gray-100 py-8">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold">{formattedCategory}</h1>
            <div className="flex items-center text-sm text-gray-500">
              <Link href="/" className="hover:text-blue-600">
                Home
              </Link>
              <span className="mx-2">/</span>
              <span>{formattedCategory}</span>
            </div>
          </div>
        </div>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="overflow-hidden rounded-lg bg-white shadow-md transition-transform hover:scale-105"
                >
                  <div className="relative h-48">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="mb-2 text-lg font-medium">{product.name}</h3>
                    <p className="mb-4 text-xl font-bold text-blue-600">
                      ${product.price.toFixed(2)}
                    </p>
                    <button className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
