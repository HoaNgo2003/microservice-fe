import type { Product } from "./types";

export const products: Record<string, Product[]> = {
  phones: [
    {
      id: 1,
      name: "Smartphone Pro",
      price: 899,
      originalPrice: 999,
      image: "/placeholder.svg?height=300&width=300",
      category: "Phones",
      description:
        "The latest flagship smartphone with advanced camera system and all-day battery life.",
    },
    {
      id: 2,
      name: "Ultra Phone",
      price: 1099,
      image: "/placeholder.svg?height=300&width=300",
      category: "Phones",
      description:
        "Premium smartphone with the largest display and most powerful processor.",
    },
    {
      id: 3,
      name: "Budget Phone",
      price: 399,
      originalPrice: 449,
      image: "/placeholder.svg?height=300&width=300",
      category: "Phones",
      description:
        "Affordable smartphone with all the essential features you need.",
    },
    {
      id: 4,
      name: "Foldable Phone",
      price: 1499,
      image: "/placeholder.svg?height=300&width=300",
      category: "Phones",
      description:
        "Revolutionary foldable display that transforms from phone to tablet.",
    },
    {
      id: 5,
      name: "Mini Phone",
      price: 699,
      image: "/placeholder.svg?height=300&width=300",
      category: "Phones",
      description: "Compact smartphone that fits perfectly in your pocket.",
    },
    {
      id: 6,
      name: "Gaming Phone",
      price: 899,
      originalPrice: 999,
      image: "/placeholder.svg?height=300&width=300",
      category: "Phones",
      description:
        "Designed for mobile gaming with advanced cooling and high refresh rate.",
    },
    {
      id: 7,
      name: "Camera Phone",
      price: 799,
      image: "/placeholder.svg?height=300&width=300",
      category: "Phones",
      description:
        "Featuring the best camera system for professional-quality photos.",
    },
    {
      id: 8,
      name: "Business Phone",
      price: 699,
      image: "/placeholder.svg?height=300&width=300",
      category: "Phones",
      description: "Secure and reliable smartphone for business professionals.",
    },
  ],
  books: [
    {
      id: 1,
      name: "The Great Novel",
      price: 19.99,
      image: "/placeholder.svg?height=300&width=300",
      category: "Books",
      description:
        "Award-winning fiction that will keep you turning pages all night.",
    },
    {
      id: 2,
      name: "Business Strategy",
      price: 24.99,
      originalPrice: 29.99,
      image: "/placeholder.svg?height=300&width=300",
      category: "Books",
      description:
        "Learn the secrets of successful business leaders and entrepreneurs.",
    },
    {
      id: 3,
      name: "Cooking Masterclass",
      price: 29.99,
      image: "/placeholder.svg?height=300&width=300",
      category: "Books",
      description: "Over 100 recipes from a world-renowned chef.",
    },
    {
      id: 4,
      name: "Science Fiction",
      price: 15.99,
      originalPrice: 18.99,
      image: "/placeholder.svg?height=300&width=300",
      category: "Books",
      description: "Journey to distant worlds in this sci-fi bestseller.",
    },
    {
      id: 5,
      name: "History of Art",
      price: 45.99,
      image: "/placeholder.svg?height=300&width=300",
      category: "Books",
      description: "A comprehensive guide to art movements throughout history.",
    },
    {
      id: 6,
      name: "Self Improvement",
      price: 18.99,
      image: "/placeholder.svg?height=300&width=300",
      category: "Books",
      description: "Transform your life with practical advice and exercises.",
    },
    {
      id: 7,
      name: "Mystery Thriller",
      price: 14.99,
      originalPrice: 17.99,
      image: "/placeholder.svg?height=300&width=300",
      category: "Books",
      description:
        "A page-turning thriller that will keep you guessing until the end.",
    },
    {
      id: 8,
      name: "Poetry Collection",
      price: 12.99,
      image: "/placeholder.svg?height=300&width=300",
      category: "Books",
      description: "Beautiful verses from contemporary poets.",
    },
  ],
  clothes: [
    {
      id: 1,
      name: "Casual T-Shirt",
      price: 24.99,
      image: "/placeholder.svg?height=300&width=300",
      category: "Clothes",
      description: "Comfortable cotton t-shirt for everyday wear.",
    },
    {
      id: 2,
      name: "Denim Jeans",
      price: 49.99,
      originalPrice: 59.99,
      image: "/placeholder.svg?height=300&width=300",
      category: "Clothes",
      description: "Classic denim jeans with a modern fit.",
    },
    {
      id: 3,
      name: "Winter Jacket",
      price: 89.99,
      image: "/placeholder.svg?height=300&width=300",
      category: "Clothes",
      description: "Stay warm with this insulated winter jacket.",
    },
    {
      id: 4,
      name: "Summer Dress",
      price: 39.99,
      originalPrice: 49.99,
      image: "/placeholder.svg?height=300&width=300",
      category: "Clothes",
      description: "Light and breezy dress perfect for summer days.",
    },
    {
      id: 5,
      name: "Formal Shirt",
      price: 59.99,
      image: "/placeholder.svg?height=300&width=300",
      category: "Clothes",
      description: "Crisp formal shirt for business and special occasions.",
    },
    {
      id: 6,
      name: "Athletic Shorts",
      price: 29.99,
      image: "/placeholder.svg?height=300&width=300",
      category: "Clothes",
      description: "Breathable shorts designed for maximum performance.",
    },
    {
      id: 7,
      name: "Wool Sweater",
      price: 69.99,
      originalPrice: 79.99,
      image: "/placeholder.svg?height=300&width=300",
      category: "Clothes",
      description: "Cozy wool sweater for chilly days.",
    },
    {
      id: 8,
      name: "Leather Boots",
      price: 119.99,
      image: "/placeholder.svg?height=300&width=300",
      category: "Clothes",
      description: "Durable leather boots that will last for years.",
    },
  ],
};

export function getAllProducts(): Product[] {
  return Object.values(products).flat();
}

export function getProductsByCategory(category: string): Product[] {
  return products[category.toLowerCase()] || [];
}

export function getProductById(
  category: string,
  id: number
): Product | undefined {
  const categoryProducts = getProductsByCategory(category);
  return categoryProducts.find((product) => product.id === id);
}

export function getFeaturedProducts(category?: string, limit = 4): Product[] {
  if (category) {
    return getProductsByCategory(category).slice(0, limit);
  }

  // Get featured products from all categories
  const allProducts = getAllProducts();
  // Normally you'd filter by a featured flag, but for simplicity we'll just take a few from each
  return allProducts.filter((_, index) => index % 3 === 0).slice(0, limit);
}
