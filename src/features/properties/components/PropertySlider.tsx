"use client";

import EmptyState from "@/components/ui/empty-state";
import PropertyCard from "@/features/properties/components/PropertyCard";
import { UsePropertyContext } from "@/features/properties/context/PropertyContext";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function PropertySlider() {
  const {
    allProperties,
    propertiesLoading,
    propertiesError,
    fetchAllProperties,
  } = UsePropertyContext();
  const [type, setType] = useState("");
  const filtered = allProperties
    .filter((property) => !type || property.propertyType === type)
    .slice(0, 6);
  return (
    <section id="discover" className="page-container py-16 lg:py-24">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="eyebrow mb-3">Find your everyday extraordinary</p>
          <h2 className="display-title text-4xl sm:text-5xl">
            Spaces to make your own.
          </h2>
          <p className="mt-4 text-sm text-muted-foreground">
            A few places where your next chapter could begin.
          </p>
        </div>
        <Link href="/filter-properties" className="text-link">
          Explore all homes <ArrowUpRight size={16} />
        </Link>
      </div>
      <div
        role="group"
        aria-label="Filter featured homes by type"
        className="mb-8 mt-8 flex flex-wrap gap-2"
      >
        {[
          { value: "", label: "All spaces" },
          { value: "1BHK", label: "1 BHK" },
          { value: "2BHK", label: "2 BHK" },
          { value: "3BHK", label: "3 BHK" },
          { value: "room", label: "Private rooms" },
        ].map((item) => (
          <button
            key={item.value}
            onClick={() => setType(item.value)}
            aria-pressed={type === item.value}
            className={`rounded-full border px-5 py-2.5 text-xs transition-colors ${type === item.value ? "border-primary bg-primary text-white" : "border-border hover:border-primary"}`}
          >
            {item.label}
          </button>
        ))}
      </div>
      {propertiesLoading ? (
        <div
          role="status"
          aria-label="Loading homes"
          className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3"
        >
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i}>
              <div className="skeleton aspect-[4/3]" />
              <div className="skeleton mt-5 h-4 w-3/4" />
              <div className="skeleton mt-3 h-3 w-1/2" />
            </div>
          ))}
        </div>
      ) : propertiesError ? (
        <div role="alert" className="surface p-10 text-center">
          <p className="text-sm text-muted-foreground">{propertiesError}</p>
          <button onClick={fetchAllProperties} className="button-primary mt-5">
            Try again
          </button>
        </div>
      ) : filtered.length ? (
        <div className="grid gap-x-7 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((property) => (
            <PropertyCard
              key={property._id}
              id={property._id}
              image={property.images?.[0]}
              title={property.title}
              price={`₹${property.rent.toLocaleString("en-IN")}`}
              city={property.location?.city}
              area={property.location?.area}
              type={property.propertyType}
              amenities={property.amenities}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="A little more room to discover."
          description="No homes of this type are listed right now. Try another kind of space, or explore all homes."
          href="/filter-properties"
          action="Explore homes"
        />
      )}
    </section>
  );
}
