import HeroBanner from "@/components/home/hero-banner";
import CategorySection from "@/components/home/category-section";
import FeaturedPhones from "@/components/home/feature-phones";
import FeaturedBooks from "@/components/home/feature-books";
import FeaturedClothes from "@/components/home/feature-clothes";

// Mock data for categories
const categories = [
  {
    id: "phones",
    name: "Phones",
    image: "https://cdn.viettelstore.vn/Images/Product/ProductImage/400291111.jpeg",
    productCount: 24,
  },
  {
    id: "books",
    name: "Books",
    image: "https://upload.wikimedia.org/wikipedia/vi/4/4f/Dragon_Ball_Super_artwork.jpg",
    productCount: 36,
  },
  {
    id: "clothes",
    name: "Clothes",
    image: "https://ruza.vn/wp-content/uploads/2022/10/quan-tay-ong-suong-qts-22-14.jpg",
    productCount: 42,
  },
];

export default function Home() {
  return (
    <>
      <HeroBanner />

      <CategorySection categories={categories} />

      {/* Featured Phones from API */}
      <FeaturedPhones />

      {/* Featured Books from API */}
      <FeaturedBooks />

      {/* Featured Clothes from API */}
      <FeaturedClothes />

      <section className="py-12 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Stay updated with our latest products and exclusive offers.
            Subscribe to our newsletter.
          </p>
          <form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-grow px-4 py-2 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            />
            <button
              type="submit"
              className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-2 rounded-md font-medium transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
