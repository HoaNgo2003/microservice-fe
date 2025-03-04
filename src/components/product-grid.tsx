import { Product } from "@/app/lib/types";
import Link from "next/link";
import ProductCard from "./product-cart";

interface ProductGridProps {
  title: string;
  products: Product[];
  viewAllLink: string;
  bgColor?: string;
}

export default function ProductGrid({
  title,
  products,
  viewAllLink,
  bgColor = "bg-white",
}: ProductGridProps) {
  return (
    <section className={`py-12 ${bgColor}`}>
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold">{title}</h2>
          <Link
            href={viewAllLink}
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
