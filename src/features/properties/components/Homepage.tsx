"use client";

import HeroSection from "@/features/properties/components/Hero";
import PopularHomes from "@/features/properties/components/PropertySlider";
import { UsePropertyContext } from "@/features/properties/context/PropertyContext";
import { UseUserContext } from "@/features/auth/context/UserContext";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  House,
  KeyRound,
  MapPin,
  Search,
} from "lucide-react";
import Link from "next/link";

const cities = [
  {
    name: "Pune",
    note: "A little calm. A lot of possibility.",
    image: "/images/editorial/interior.jpg",
    position: "center",
  },
  {
    name: "Mumbai",
    note: "Find your corner of the city.",
    image: "/images/editorial/living-room.jpg",
    position: "left",
  },
  {
    name: "Bengaluru",
    note: "New ideas. A place to recharge.",
    image: "/images/editorial/interior.jpg",
    position: "right",
  },
];

export default function Homepage() {
  const { allProperties, propertiesLoading, propertiesError } =
    UsePropertyContext();
  const { user, authStatus, becomeLandlord } = UseUserContext();
  const cityCount = new Set(
    allProperties.map((property) => property.location?.city).filter(Boolean),
  ).size;
  return (
    <>
      <HeroSection />
      <div className="border-b border-border">
        <div className="page-container grid gap-6 py-7 sm:grid-cols-3">
          <div className="flex items-center gap-3">
            <House size={22} strokeWidth={1.3} />
            <div>
              <p className="text-xs font-semibold">
                {propertiesLoading || propertiesError
                  ? "Spaces for every chapter"
                  : `${allProperties.length} places to begin again`}
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Real listings, ready to explore
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 sm:justify-center">
            <MapPin size={22} strokeWidth={1.3} />
            <div>
              <p className="text-xs font-semibold">
                {cityCount
                  ? `Discover ${cityCount} cities across India`
                  : "Your city. Your kind of life."}
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                From familiar lanes to fresh starts
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 sm:justify-end">
            <KeyRound size={22} strokeWidth={1.3} />
            <div>
              <p className="text-xs font-semibold">
                Meet your next home in person
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Connect with owners and plan a visit
              </p>
            </div>
          </div>
        </div>
      </div>
      <PopularHomes />
      <section id="neighborhoods" className="bg-[#f1f0e8] py-16 lg:py-20">
        <div className="page-container">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="eyebrow mb-3">The neighbourhood comes with it</p>
              <h2 className="display-title text-4xl sm:text-5xl">
                New city. Familiar feeling.
              </h2>
            </div>
            <p className="max-w-xs text-sm leading-7 text-muted-foreground">
              Your morning coffee, the walk home, the people next door. Find
              where you belong.
            </p>
          </div>
          <div className="mt-9 grid gap-5 md:grid-cols-3">
            {cities.map((city) => (
              <Link
                key={city.name}
                href={`/filter-properties?city=${encodeURIComponent(city.name)}`}
                className="group relative overflow-hidden rounded-2xl"
              >
                <img
                  src={city.image}
                  alt={`Interior inspiration for your next home in ${city.name}`}
                  style={{ objectPosition: city.position }}
                  width={1000}
                  height={800}
                  loading="lazy"
                  className="aspect-[5/4] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#142b24]/85 via-[#142b24]/10 to-transparent" />
                <div className="absolute inset-x-6 bottom-6 flex items-end justify-between text-white">
                  <div>
                    <p className="font-display text-3xl">{city.name}</p>
                    <p className="mt-2 text-xs text-white/80">{city.note}</p>
                  </div>
                  <ArrowUpRight size={24} strokeWidth={1.2} />
                </div>
              </Link>
            ))}
          </div>
          <p className="mt-4 text-[10px] text-muted-foreground">
            Interior images are inspiration; explore each city for current
            listings.
          </p>
        </div>
      </section>
      <section id="how-it-works" className="page-container py-16 lg:py-24">
        <div className="text-center">
          <p className="eyebrow mb-3">Less hassle. More home.</p>
          <h2 className="display-title text-4xl sm:text-5xl">
            From looking to belonging.
          </h2>
        </div>
        <div className="mt-12 grid gap-10 md:grid-cols-3">
          {[
            {
              icon: Search,
              title: "Find your kind of place",
              description:
                "Choose your city, budget, and the space you need. Explore homes at your own pace.",
            },
            {
              icon: CalendarDays,
              title: "Get a feel for it",
              description:
                "Save your favourites and request a visit. Meet the owner and see the space for yourself.",
            },
            {
              icon: KeyRound,
              title: "Start your next chapter",
              description:
                "Found the one? Connect with your landlord to agree on the details of your move.",
            },
          ].map(({ icon: Icon, title, description }, index) => (
            <div key={title} className="relative border-t border-border pt-7">
              <div className="mb-6 flex items-center justify-between">
                <Icon size={28} strokeWidth={1.1} />
                <span className="font-display text-4xl text-[#c4c9bb]">
                  0{index + 1}
                </span>
              </div>
              <h3 className="font-display text-2xl">{title}</h3>
              <p className="mt-3 max-w-sm text-sm leading-7 text-muted-foreground">
                {description}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <Link href="/filter-properties" className="text-link">
            Let’s find your place <ArrowRight size={16} />
          </Link>
        </div>
        <p className="mx-auto mt-8 max-w-2xl text-center text-[11px] leading-6 text-muted-foreground">
          Talaash connects tenants and property owners. Listings are not
          independently verified, and rental agreements and payments are
          arranged directly with the owner.
        </p>
      </section>
      <section className="page-container pb-16 lg:pb-24">
        <div className="relative overflow-hidden rounded-3xl bg-primary px-7 py-12 text-[#fcfbf7] sm:px-12 lg:flex lg:items-center lg:justify-between lg:gap-10 lg:px-16 lg:py-16">
          <div className="pointer-events-none absolute -right-10 -top-28 size-96 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -right-20 -top-36 size-[480px] rounded-full border border-white/10" />
          <div className="relative">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#c8d5bc]">
              A space to share. A story to start.
            </p>
            <h2 className="display-title mt-4 max-w-xl text-4xl sm:text-5xl">
              Your property. Someone’s
              <br />
              <span className="italic text-[#d4dfc2]">new beginning.</span>
            </h2>
            <p className="mt-5 max-w-md text-sm leading-7 text-white/70">
              Make room for the right people. List your property and manage
              visits, all in one thoughtful space.
            </p>
          </div>
          <div className="relative mt-8 shrink-0 lg:mt-0">
            {authStatus && user?.role === "tenant" ? (
              <button
                onClick={becomeLandlord}
                className="button-primary bg-[#e4ebd5] text-primary hover:bg-white"
              >
                List your property <ArrowUpRight size={17} />
              </button>
            ) : (
              <Link
                href={
                  user?.role === "landlord"
                    ? "/dashboard/landlord/add-new-property"
                    : "/login/landlord"
                }
                className="button-primary bg-[#e4ebd5] text-primary hover:bg-white"
              >
                List your property <ArrowUpRight size={17} />
              </Link>
            )}
            <p className="mt-3 text-center text-[10px] text-white/60">
              A good home deserves to be found.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
