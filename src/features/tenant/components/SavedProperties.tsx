"use client";


import { getPropertyImageUrl } from "@/features/properties/utils/propertyImage";
import { useTenantContext } from "@/features/tenant/context/TenantContext";
import Link from "next/link";

function SavedProperties() {
  const { savedProperties } = useTenantContext();

  if (!savedProperties || savedProperties.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        No saved properties yet
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen mx-auto px-10 py-10">
      <h1 className="text-2xl font-semibold mb-6">Saved Properties</h1>

      <div className="flex flex-col gap-6">
        {savedProperties.map((property) => (
          <div
            key={property._id}
            className="border rounded-lg overflow-hidden flex gap-6 p-4 hover:shadow-md transition"
          >
            {/* Property Image */}
            <img
              src={getPropertyImageUrl(property.images?.[0])}
              alt={property.title}
              className="w-48 h-32 object-cover rounded-md"
            />

            {/* Property Details */}
            <div className="flex flex-col justify-between flex-1">
              <div>
                <h2 className="text-lg font-semibold">{property.title}</h2>

                <p className="text-sm text-gray-600">
                  {property.location?.area}, {property.location?.city}
                </p>

                <p className="text-sm text-gray-600">
                  Type: {property.propertyType}
                </p>

                <p className="text-sm text-gray-600">
                  Rating: {property.ratings || "N/A"}
                </p>

                <p
                  className={`text-xs mt-1 ${
                    property.status === "available"
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {property.status}
                </p>
              </div>

              {/* Right Section */}
              <div className="flex items-center justify-between mt-4">
                <p className="text-lg font-semibold">₹{property.rent}/month</p>

                <Link
                  href={`/property/${property._id}`}
                  className="border border-black px-4 py-1 text-sm hover:bg-black hover:text-white transition"
                >
                  View
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SavedProperties;
