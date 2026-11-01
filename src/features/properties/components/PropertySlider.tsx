"use client";
import type { Property } from "@/types/domain";


import PropertyCard from "@/features/properties/components/PropertyCard";
import { UsePropertyContext } from "@/features/properties/context/PropertyContext";
import { useEffect,useState } from "react";

const PropertySlider = () => {
  const { allProperties, propertiesLoading, propertiesError, fetchAllProperties } = UsePropertyContext();
  const [randomProps, setRandomProps] = useState<Property[]>([]);

  useEffect(() => {
    if (allProperties?.length) {
      const shuffled = [...allProperties].sort(() => 0.5 - Math.random());
      setRandomProps(shuffled.slice(0, 6));
    } else {
      setRandomProps([]);
    }
  }, [allProperties]);

  if (propertiesLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 text-lg">Loading properties...</p>
      </div>
    );
  }

  if (propertiesError) {
    return (
      <div role="alert" className="flex min-h-64 flex-col items-center justify-center gap-4 p-6">
        <p>{propertiesError}</p>
        <button onClick={fetchAllProperties} className="rounded bg-black px-4 py-2 text-white">Try again</button>
      </div>
    );
  }

  if (!allProperties.length) {
    return <p className="p-10 text-center text-gray-500">No properties are available yet.</p>;
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
