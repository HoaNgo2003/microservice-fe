import Link from "next/link";

interface Category {
  id: string;
  name: string;
  image: string;
  // productCount: number;
}

interface CategorySectionProps {
  categories: Category[];
}

export default function CategorySection({ categories }: CategorySectionProps) {
  return (
    <section className="py-10 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Shop by Category
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.id}`}
              className="group relative overflow-hidden rounded-lg shadow-md"
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={category.image || "/placeholder.svg"}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                <h3 className="text-xl font-bold text-white">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-200">
                  {/* {category.productCount} Products */}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
