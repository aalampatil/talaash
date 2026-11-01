"use client";


import { UseLandlordContext } from "@/features/landlord/context/LandlordContext";
import { getPropertyImageUrl } from "@/features/properties/utils/propertyImage";
import Link from "next/link";

function LandlordProperties() {
  const { landlordProperties } = UseLandlordContext();

  if (!landlordProperties || landlordProperties.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500 text-lg">
        No properties found. Add a new property.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-2xl font-semibold mb-8 border-b pb-3">
        My Properties
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {landlordProperties.map((property) => (
          <div
            key={property._id}
            className="border rounded-lg overflow-hidden hover:border-black transition"
          >
            {/* Property Image */}
            {property.images && property.images[0] && (
              <img
                src={getPropertyImageUrl(property.images[0])}
                alt={property.title}
                className="h-44 w-full object-cover"
              />
            )}

            {/* Info */}
            <div className="p-4 space-y-2">
              <h2 className="text-lg font-medium">{property.title}</h2>

              <p className="text-sm text-gray-500">
                {property.location?.city}, {property.location?.area}
              </p>

              <p className="text-sm text-gray-700 line-clamp-2">
                {property.description}
              </p>

              <p className="text-sm font-semibold">Rs{property.rent} / month</p>

              {/* Amenities */}
              {property.amenities && property.amenities.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {property.amenities.map((amenity, idx) => (
                    <span
                      key={idx}
                      className="text-xs border px-2 py-1 rounded"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Link
                  href={`/dashboard/landlord/properties/edit/${property._id}`}
                  className="text-sm border px-3 py-1.5 rounded hover:bg-black hover:text-white transition"
                >
                  Edit
                </Link>

                <Link
                  href={`/dashboard/landlord/properties/${property._id}/visits`}
                  className="text-sm border px-3 py-1.5 rounded hover:bg-black hover:text-white transition"
                >
                  Visits
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LandlordProperties;
