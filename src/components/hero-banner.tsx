import Link from "next/link";
import Image from "next/image";

interface HeroBannerProps {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  imageSrc: string;
}

export default function HeroBanner({
  title,
  description,
  buttonText,
  buttonLink,
  imageSrc,
}: HeroBannerProps) {
  return (
    <section className="bg-gradient-to-r from-blue-500 to-indigo-600 py-12 text-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center md:flex-row md:justify-between">
          <div className="mb-8 max-w-lg md:mb-0">
            <h1 className="mb-4 text-4xl font-bold leading-tight md:text-5xl">
              {title}
            </h1>
            <p className="mb-6 text-lg">{description}</p>
            <Link
              href={buttonLink}
              className="inline-block rounded-md bg-white px-6 py-3 text-base font-medium text-blue-600 shadow-md hover:bg-gray-100"
            >
              {buttonText}
            </Link>
          </div>
          <div className="relative h-64 w-full max-w-md md:h-80">
            <Image
              src={imageSrc || "/placeholder.svg"}
              alt={title}
              fill
              className="rounded-lg object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
