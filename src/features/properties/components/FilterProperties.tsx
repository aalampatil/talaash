"use client";


import PropertyCard from "@/features/properties/components/PropertyCard";
import { UsePropertyContext } from "@/features/properties/context/PropertyContext";

function FilterProperties() {
  const { properties } = UsePropertyContext();

  return (
    <div className="min-h-screen px-6 py-10">
      {/* Heading */}
      <h1 className="text-2xl font-semibold mb-6">Filtered Properties</h1>

      {/* Property List */}
      {properties.length === 0 ? (
        <div>
          <p className="text-gray-500">No properties found</p>
          <p className="text-gray-500">Search to proceed</p>{" "}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard
              key={property._id}
              id={property._id}
              image={property.images?.[0]}
              title={`${property.propertyType} in ${property.location.city}`}
              price={`Rs ${property.rent}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default FilterProperties;
