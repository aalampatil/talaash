"use client";

import EmptyState from "@/components/ui/empty-state";
import PageHeading from "@/components/ui/page-heading";
import PropertyCard from "@/features/properties/components/PropertyCard";
import { useTenantContext } from "@/features/tenant/context/TenantContext";
import { ArrowUpRight, Heart } from "lucide-react";
import Link from "next/link";

export default function SavedProperties() {
  const { savedProperties } = useTenantContext();
  return (
    <div className="dashboard-page">
      <PageHeading
        eyebrow="Your personal collection"
        title="A few places you love."
        description="Keep the possibilities close. Your saved homes, ready when you are."
        action={
          <Link href="/filter-properties" className="button-secondary">
            Find more homes <ArrowUpRight size={16} />
          </Link>
        }
      />
      <div className="mb-7 flex items-center gap-2 border-b border-border pb-5 text-xs text-muted-foreground">
        <Heart size={15} />
        {savedProperties.length}{" "}
        {savedProperties.length === 1 ? "home" : "homes"} in your collection
      </div>
      {savedProperties.length ? (
        <div className="grid gap-x-7 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {savedProperties.map((property) => (
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
              status={property.status}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="Your favourites start here."
          description="See a place you can picture yourself in? Tap the heart to save it. You’ll find all your possibilities right here."
          href="/filter-properties"
          action="Discover your space"
        />
      )}
    </div>
  );
}
