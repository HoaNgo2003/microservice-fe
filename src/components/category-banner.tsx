import Link from "next/link";
import Image from "next/image";

interface CategoryBannerProps {
  title: string;
  description: string;
  imageSrc: string;
  link: string;
}

export default function CategoryBanner({
  title,
  description,
  imageSrc,
  link,
}: CategoryBannerProps) {
  return (
    <Link href={link} className="group relative overflow-hidden rounded-lg">
      <Image
        src={imageSrc || "/placeholder.svg"}
        alt={title}
        width={400}
        height={300}
        className="h-64 w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
      <div className="absolute bottom-0 left-0 p-6">
        <h3 className="text-2xl font-bold text-white">{title}</h3>
        <p className="text-sm text-gray-200">{description}</p>
      </div>
    </Link>
  );
}
