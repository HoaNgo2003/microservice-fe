import Header from "@/components/header";
import Footer from "@/components/footer";
import HeroBanner from "@/components/hero-banner";
import CategoryBanner from "@/components/category-banner";
import ProductGrid from "@/components/product-grid";
import Newsletter from "@/components/newsletter";
import { getFeaturedProducts } from "./lib/data";

export default function Home() {
  const featuredPhones = getFeaturedProducts("phones", 4);
  const featuredBooks = getFeaturedProducts("books", 4);
  const featuredClothes = getFeaturedProducts("clothes", 4);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <HeroBanner
          title="Summer Sale"
          description="Up to 50% off on selected items. Limited time offer!"
          buttonText="Shop Now"
          buttonLink="/deals"
          imageSrc="/placeholder.svg?height=400&width=600"
        />

        {/* Category Highlights */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="mb-8 text-center text-3xl font-bold">
              Shop by Category
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <CategoryBanner
                title="Phones"
                description="Latest models and accessories"
                imageSrc="/placeholder.svg?height=300&width=400"
                link="/product/phones"
              />

              <CategoryBanner
                title="Books"
                description="Bestsellers and new releases"
                imageSrc="/placeholder.svg?height=300&width=400"
                link="/product/books"
              />

              <CategoryBanner
                title="Clothes"
                description="Trendy styles for all seasons"
                imageSrc="/placeholder.svg?height=300&width=400"
                link="/product/clothes"
              />
            </div>
          </div>
        </section>

        <ProductGrid
          title="Featured Phones"
          products={featuredPhones}
          viewAllLink="/product/phones"
          bgColor="bg-gray-50"
        />

        <ProductGrid
          title="Featured Books"
          products={featuredBooks}
          viewAllLink="/product/books"
        />

        <ProductGrid
          title="Featured Clothes"
          products={featuredClothes}
          viewAllLink="/product/clothes"
          bgColor="bg-gray-50"
        />

        <Newsletter />
      </main>

      <Footer />
    </div>
  );
}
