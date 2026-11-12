"use client";

import PageHeading from "@/components/ui/page-heading";
import { UseAdminContext } from "@/features/admin/context/AdminContext";
import { ArrowUpRight, Building2, UserRound, Users } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  const { totalUsers, totalProperties, totalLandlords, allProperties } =
    UseAdminContext();
  return (
    <div className="dashboard-page">
      <PageHeading
        eyebrow="The Talaash overview"
        title="A little perspective."
        description="People, places, and the connections between them. Your community at a glance."
      />
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          {
            label: "Community members",
            value: totalUsers,
            icon: Users,
            href: "/dashboard/admin/all-users",
          },
          {
            label: "Properties listed",
            value: totalProperties,
            icon: Building2,
            href: "/dashboard/admin/all-properties",
          },
          {
            label: "Property owners",
            value: totalLandlords,
            icon: UserRound,
            href: "/dashboard/admin/all-landlords",
          },
        ].map(({ label, value, icon: Icon, href }) => (
          <Link
            key={label}
            href={href}
            className="surface group p-6 hover:border-primary"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{label}</span>
              <Icon size={21} strokeWidth={1.3} />
            </div>
            <div className="mt-7 flex items-end justify-between">
              <span className="font-display text-5xl">{value}</span>
              <ArrowUpRight
                size={20}
                strokeWidth={1.2}
                className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
              />
            </div>
          </Link>
        ))}
      </div>
      <section className="surface mt-10 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 p-6">
          <h2 className="font-display text-2xl">Places in the community.</h2>
          <Link
            href="/dashboard/admin/all-properties"
            className="text-link text-xs"
          >
            All properties <ArrowUpRight size={14} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">Property</th>
                <th scope="col">City</th>
                <th scope="col">Monthly rent</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {allProperties.slice(0, 6).map((property) => (
                <tr key={property._id}>
                  <td>
                    <Link
                      href={`/property/${property._id}`}
                      className="font-semibold hover:text-terracotta"
                    >
                      {property.title}
                    </Link>
                  </td>
                  <td className="text-muted-foreground">
                    {property.location?.city}
                  </td>
                  <td>₹{property.rent.toLocaleString("en-IN")}</td>
                  <td>
                    <span className="status-pill" data-status={property.status}>
                      {property.status}
                    </span>
                  </td>
                </tr>
              ))}
              {!allProperties.length && (
                <tr>
                  <td colSpan={4} className="text-center text-muted-foreground">
                    Property listings will appear here as the community grows.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
      <div className="mt-7 rounded-2xl bg-[#e7ebde] p-6 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-2xl">Keep the community connected.</p>
          <p className="mt-2 text-xs text-muted-foreground">
            Explore the people behind the places.
          </p>
        </div>
        <Link
          href="/dashboard/admin/all-users"
          className="text-link mt-5 text-xs sm:mt-0"
        >
          View community <ArrowUpRight size={14} />
        </Link>
      </div>
    </div>
  );
}
