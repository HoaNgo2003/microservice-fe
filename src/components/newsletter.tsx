export default function Newsletter() {
  return (
    <section className="bg-blue-600 py-12 text-white">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold">
            Subscribe to Our Newsletter
          </h2>
          <p className="mb-6">
            Get the latest updates on new products and upcoming sales.
          </p>
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 rounded-md border-0 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <button className="rounded-md bg-gray-900 px-6 py-3 font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2 focus:ring-offset-blue-600">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
