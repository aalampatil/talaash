"use client";

import EmptyState from "@/components/ui/empty-state";
import PageHeading from "@/components/ui/page-heading";
import { UseLandlordContext } from "@/features/landlord/context/LandlordContext";
import { getPropertyImageUrl } from "@/features/properties/utils/propertyImage";
import { ArrowUpRight, CalendarDays, MapPin, Plus } from "lucide-react";
import Link from "next/link";

export default function LandlordProperties() {
  const { landlordProperties } = UseLandlordContext();
  return (
    <div className="dashboard-page">
      <PageHeading
        eyebrow="Places with possibility"
        title="Your spaces. Their next chapter."
        description="Keep an eye on your listings and help the right people find their way home."
        action={
          <Link
            href="/dashboard/landlord/add-new-property"
            className="button-primary"
          >
            <Plus size={16} />
            Add a property
          </Link>
        }
      />
      {!landlordProperties.length ? (
        <EmptyState
          title="Every story starts with a space."
          description="Your first property could be someone’s favourite place. Add a few details and photos to get started."
          href="/dashboard/landlord/add-new-property"
          action="List your first property"
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {landlordProperties.map((property) => (
            <article key={property._id} className="surface overflow-hidden">
              <div className="relative">
                <img
                  src={getPropertyImageUrl(property.images?.[0])}
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src =
                      "/images/property-placeholder.svg";
                  }}
                  alt={property.title}
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover"
                />
                <span
                  className="status-pill absolute left-3 top-3"
                  data-status={property.status}
                >
                  {property.status}
                </span>
              </div>
              <div className="p-5">
                <span className="eyebrow">
                  {property.propertyType.replace("BHK", " BHK")}
                </span>
                <h2 className="mt-2 text-base font-semibold">
                  {property.title}
                </h2>
                <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin size={12} />
                  {[property.location?.area, property.location?.city]
                    .filter(Boolean)
                    .join(", ")}
                </p>
                <p className="mt-4 text-xl font-semibold">
                  ₹{property.rent.toLocaleString("en-IN")}
                  <span className="ml-1 text-[10px] font-normal text-muted-foreground">
                    / month
                  </span>
                </p>
                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
                  <Link
                    href={`/property/${property._id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold"
                  >
                    View listing <ArrowUpRight size={14} />
                  </Link>
                  <Link
                    href="/dashboard/landlord/visits"
                    className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"
                  >
                    <CalendarDays size={14} />
                    Visits
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
