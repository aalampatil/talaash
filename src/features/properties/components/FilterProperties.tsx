"use client";

import EmptyState from "@/components/ui/empty-state";
import PropertyCard from "@/features/properties/components/PropertyCard";
import Search from "@/features/properties/components/Search";
import { propertiesApi } from "@/features/properties/services/properties.api";
import type { Property } from "@/types/domain";
import { ArrowLeft, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function FilterProperties({
  city = "",
  rent = "",
  propertyType = "",
}: {
  city?: string;
  rent?: string;
  propertyType?: string;
}) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [sort, setSort] = useState("recent");
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    propertiesApi
      .search({ city, rent, propertyType }, { signal: controller.signal })
      .then(({ data }) => {
        if (data.success) setProperties(data.data);
        else setError("We couldn’t load these homes. Please try again.");
      })
      .catch(() => {
        if (!controller.signal.aborted)
          setError("We couldn’t load these homes. Please try again.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [city, rent, propertyType, attempt]);
  const sorted = [...properties].sort((a, b) =>
    sort === "price-low"
      ? a.rent - b.rent
      : sort === "price-high"
        ? b.rent - a.rent
        : (b.createdAt || "").localeCompare(a.createdAt || ""),
  );
  return (
    <>
      <section className="border-b border-border bg-[#f1f0e8] py-10 sm:py-14">
        <div className="page-container">
          <Link
            href="/"
            className="mb-7 inline-flex items-center gap-2 text-xs text-muted-foreground"
          >
            <ArrowLeft size={14} />
            Back to the beginning
          </Link>
          <p className="eyebrow mb-3">Your search, a little closer</p>
          <h1 className="display-title text-4xl sm:text-6xl">
            {city
              ? `Find your place in ${city}.`
              : "A space that feels like you."}
          </h1>
          <p className="mt-4 text-sm text-muted-foreground">
            Different spaces. Endless possibilities. One place to call home.
          </p>
          <div className="mt-8">
            <Search
              initialCity={city}
              initialRent={rent}
              initialType={propertyType}
            />
          </div>
        </div>
      </section>
      <section className="page-container py-10 lg:py-14">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p aria-live="polite" className="text-sm font-medium">
              {loading
                ? "Finding your next chapter…"
                : error
                  ? "Let’s try that again"
                  : `${properties.length} ${properties.length === 1 ? "home" : "homes"} to explore`}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {[
                city,
                rent ? `Up to ₹${Number(rent).toLocaleString("en-IN")}` : "",
                propertyType,
              ]
                .filter(Boolean)
                .map((filter) => (
                  <span key={filter} className="status-pill">
                    {filter}
                  </span>
                ))}
              {(city || rent || propertyType) && (
                <Link
                  href="/filter-properties"
                  className="py-1.5 text-[11px] text-muted-foreground underline underline-offset-4"
                >
                  Clear filters
                </Link>
              )}
            </div>
          </div>
          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            <SlidersHorizontal size={15} />
            <span className="sr-only">Sort homes</span>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="rounded-lg border border-border bg-transparent px-3 py-2.5"
            >
              <option value="recent">Newest first</option>
              <option value="price-low">Rent: low to high</option>
              <option value="price-high">Rent: high to low</option>
            </select>
          </label>
        </div>
        {loading ? (
          <div
            role="status"
            aria-label="Loading search results"
            className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3"
          >
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i}>
                <div className="skeleton aspect-[4/3]" />
                <div className="skeleton mt-5 h-4 w-3/4" />
                <div className="skeleton mt-3 h-3 w-1/2" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div role="alert" className="surface p-12 text-center">
            <h2 className="font-display text-3xl">A small detour.</h2>
            <p className="mt-3 text-sm text-muted-foreground">{error}</p>
            <button
              onClick={() => setAttempt((value) => value + 1)}
              className="button-primary mt-6"
            >
              Try again
            </button>
          </div>
        ) : sorted.length ? (
          <div className="grid gap-x-7 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {sorted.map((property) => (
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
            title="The right place is still out there."
            description="We couldn’t find homes that match this search. Try a nearby city, a different budget, or another kind of space."
            href="/filter-properties"
            action="Explore all homes"
          />
        )}
      </section>
    </>
  );
}
