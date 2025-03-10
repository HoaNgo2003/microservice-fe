import Link from "next/link";

export default function HeroBanner() {
  return (
    <div className="relative bg-blue-600 text-white">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Shop the Latest Products at Amazing Prices
            </h1>
            <p className="text-lg md:text-xl text-blue-100">
              Discover our wide range of phones, books, and clothes. Quality
              products delivered to your doorstep.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/category/phones"
                className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-md font-medium transition-colors"
              >
                Shop Phones
              </Link>
              <Link
                href="/category/all"
                className="bg-transparent border border-white text-white hover:bg-white hover:text-blue-600 px-6 py-3 rounded-md font-medium transition-colors"
              >
                Browse All
              </Link>
            </div>
          </div>
          <div className="hidden md:block">
            <img
              src="/placeholder.svg?height=400&width=600"
              alt="Shopping Banner"
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* Wave shape divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 120"
          className="w-full h-auto"
        >
          <path
            fill="#ffffff"
            fillOpacity="1"
            d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
          ></path>
        </svg>
      </div>
    </div>
  );
}
