"use client";


import { getPropertyImageUrl } from "@/features/properties/utils/propertyImage";
import Link from "next/link";

function PropertyCard({ id, image, title, price }: { id: string; image?: import("@/types/domain").PropertyImage; title: string; price: string }) {
  return (
    <Link
      href={`/property/${id}`}
      className="w-full md:min-w-[48%] cursor-pointer"
    >
      <div className="relative">
        <img
          src={getPropertyImageUrl(image)}
          alt={title}
          className="w-full h-48 md:h-72 object-cover rounded-xl"
        />
      </div>

      <div className="mt-2 text-xs md:text-sm">
        <p className="font-semibold">{title}</p>
        <p className="text-gray-500">Starting from just {price}</p>
      </div>
    </Link>
  );
}

export default PropertyCard;
