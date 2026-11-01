"use client";

import { useEffect, useState } from "react";
import { UsePropertyContext } from "@/features/properties/context/PropertyContext.jsx";
import PropertyCard from "@/features/properties/components/PropertyCard.jsx";

const PropertySlider = () => {
  const { allProperties } = UsePropertyContext();
  const [randomProps, setRandomProps] = useState([]);

  useEffect(() => {
    if (allProperties?.length) {
      const shuffled = [...allProperties].sort(() => 0.5 - Math.random());
      setRandomProps(shuffled.slice(0, 6));
    }
  }, [allProperties]);

  if (!randomProps.length) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 text-lg">Loading properties...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-6">
        Hot Properties around the Country
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {randomProps.map((property) => (
          <PropertyCard
            key={property._id}
            id={property._id}
            image={property.images?.[0]}
            title={property.title}
            price={`Rs ${property.rent.toLocaleString()} / month`}
          />
        ))}
      </div>
    </div>
  );
};

export default PropertySlider;
