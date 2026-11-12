"use client";

import EmptyState from "@/components/ui/empty-state";
import PageHeading from "@/components/ui/page-heading";
import { UseUserContext } from "@/features/auth/context/UserContext";
import { UseLandlordContext } from "@/features/landlord/context/LandlordContext";
import {
  ArrowUpRight,
  Building2,
  CalendarDays,
  Plus,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

export default function LandlordDashboard() {
  const { user } = UseUserContext();
  const { landlordProperties, manageVisits } = UseLandlordContext();
  const pending = manageVisits.filter((visit) => visit.status === "pending");
  return (
    <div className="dashboard-page">
      <PageHeading
        eyebrow="Your landlord workspace"
        title={`Hello, ${user?.name?.split(" ")[0] || "there"}.`}
        description="Good homes bring people together. Here’s what’s happening with yours."
        action={
          <Link
            href="/dashboard/landlord/add-new-property"
            className="button-primary"
          >
            <Plus size={16} />
            List a property
          </Link>
        }
      />
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          {
            label: "Your properties",
            value: landlordProperties.length,
            icon: Building2,
            href: "/dashboard/landlord/properties",
          },
          {
            label: "Available spaces",
            value: landlordProperties.filter(
              (property) => property.status === "available",
            ).length,
            icon: Sparkles,
            href: "/dashboard/landlord/properties",
          },
          {
            label: "Pending visits",
            value: pending.length,
            icon: CalendarDays,
            href: "/dashboard/landlord/visits",
          },
        ].map(({ label, value, icon: Icon, href }) => (
          <Link
            key={label}
            href={href}
            className="surface group p-6 transition-colors hover:border-primary"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{label}</span>
              <Icon size={21} strokeWidth={1.2} />
            </div>
            <div className="mt-6 flex items-end justify-between">
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
      <div className="mt-10">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-3xl">The next hello.</h2>
          <Link href="/dashboard/landlord/visits" className="text-link text-xs">
            All visit requests <ArrowUpRight size={14} />
          </Link>
        </div>
        {pending.length ? (
          <div className="surface divide-y divide-border">
            {pending.slice(0, 5).map((visit) => (
              <Link
                key={visit._id}
                href="/dashboard/landlord/visits"
                className="flex flex-wrap items-center justify-between gap-4 px-6 py-5 hover:bg-secondary/40"
              >
                <div>
                  <p className="text-sm font-semibold">
                    {visit.tenantName || "A future tenant"}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {visit.propertyTitle ||
                      visit.propertyId?.title ||
                      "Property visit"}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-muted-foreground">
                    {new Date(visit.visitDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                  <span className="status-pill" data-status="pending">
                    Pending
                  </span>
                  <ArrowUpRight size={16} />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState
            title="A little quiet, for now."
            description="New visit requests will appear here. Keep your property listings complete so future tenants can picture their life there."
            href="/dashboard/landlord/properties"
            action="View your properties"
          />
        )}
      </div>
    </div>
  );
}
