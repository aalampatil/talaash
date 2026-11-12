"use client";

import { indianCities } from "@/data/indianCities";
import { Building2, MapPin, Search, Wallet } from "lucide-react";
import { useRouter } from "next/navigation";
import { useId, useState, useTransition } from "react";

export default function SearchFilter({
  initialCity = "",
  initialRent = "",
  initialType = "",
}: {
  initialCity?: string;
  initialRent?: string;
  initialType?: string;
}) {
  const [city, setCity] = useState(initialCity);
  const [rent, setRent] = useState(initialRent);
  const [propertyType, setPropertyType] = useState(initialType);
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const id = useId();
  function search(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (city.trim()) params.set("city", city.trim());
    if (rent) params.set("rent", rent);
    if (propertyType) params.set("propertyType", propertyType);
    startTransition(() =>
      router.push(`/filter-properties${params.size ? `?${params}` : ""}`),
    );
  }
  return (
    <form
      onSubmit={search}
      aria-label="Find a rental home"
      className="relative z-10 grid w-full gap-3 rounded-2xl border border-border bg-white p-3 shadow-[0_12px_50px_-25px_#244b3b55] sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_auto] lg:gap-0"
    >
      <label className="flex items-center gap-3 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-primary/25 lg:border-r">
        <MapPin className="shrink-0 text-primary" size={20} strokeWidth={1.4} />
        <span className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider">
            Where to?
          </span>
          <input
            list={`${id}-cities`}
            value={city}
            onChange={(event) => setCity(event.target.value)}
            placeholder="Choose a city"
            className="w-full bg-transparent text-sm text-muted-foreground outline-none"
          />
          <datalist id={`${id}-cities`}>
            {indianCities.map((name) => (
              <option key={name} value={name} />
            ))}
          </datalist>
        </span>
      </label>
      <label className="flex items-center gap-3 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-primary/25 lg:border-r">
        <Wallet className="shrink-0 text-primary" size={20} strokeWidth={1.4} />
        <span className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider">
            Monthly budget
          </span>
          <select
            value={rent}
            onChange={(event) => setRent(event.target.value)}
            className="w-full bg-transparent text-sm text-muted-foreground outline-none"
          >
            <option value="">Any budget</option>
            {[5000, 10000, 20000, 30000, 40000, 50000, 100000].map((value) => (
              <option key={value} value={value}>
                Up to ₹{value.toLocaleString("en-IN")}
              </option>
            ))}
          </select>
        </span>
      </label>
      <label className="flex items-center gap-3 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-primary/25">
        <Building2
          className="shrink-0 text-primary"
          size={20}
          strokeWidth={1.4}
        />
        <span className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider">
            Your kind of space
          </span>
          <select
            value={propertyType}
            onChange={(event) => setPropertyType(event.target.value)}
            className="w-full bg-transparent text-sm text-muted-foreground outline-none"
          >
            <option value="">All home types</option>
            {["1BHK", "2BHK", "3BHK", "room"].map((type) => (
              <option key={type} value={type}>
                {type === "room" ? "Private room" : type.replace("BHK", " BHK")}
              </option>
            ))}
          </select>
        </span>
      </label>
      <button
        disabled={pending}
        type="submit"
        className="button-primary rounded-xl sm:col-span-2 lg:col-span-1 lg:ml-3"
      >
        <Search size={17} />
        <span>{pending ? "Searching…" : "Find a home"}</span>
      </button>
    </form>
  );
}
