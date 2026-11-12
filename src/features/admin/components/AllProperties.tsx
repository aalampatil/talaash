"use client";

import EmptyState from "@/components/ui/empty-state";
import PageHeading from "@/components/ui/page-heading";
import { UseAdminContext } from "@/features/admin/context/AdminContext";
import { getPropertyImageUrl } from "@/features/properties/utils/propertyImage";
import { ArrowUpRight, Building2, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function AllProperties() {
  const { allProperties } = UseAdminContext();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const filtered = allProperties.filter(property => (!status || property.status === status) && `${property.title} ${property.location?.city} ${property.location?.area}`.toLowerCase().includes(query.toLowerCase()));
  return <div className="dashboard-page"><PageHeading eyebrow="Every listing, one place" title="Room for possibility." description="Explore the homes that make up the Talaash community." action={<span className="status-pill"><Building2 size={13} />{allProperties.length} properties</span>} /><div className="mb-6 flex flex-wrap items-center justify-between gap-3"><label className="surface flex w-full max-w-md items-center gap-3 px-4 py-3"><Search size={17} className="text-muted-foreground" /><span className="sr-only">Search listings</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search properties or neighbourhoods" className="min-w-0 flex-1 bg-transparent text-sm outline-none" /></label><label className="text-xs text-muted-foreground"><span className="sr-only">Filter by availability</span><select value={status} onChange={event => setStatus(event.target.value)} className="rounded-xl border border-border bg-background px-4 py-3"><option value="">All availability</option><option value="available">Available</option><option value="occupied">Occupied</option></select></label></div>{!filtered.length ? <EmptyState title="A little more room to grow." description="No properties match this view. Try another search or availability filter." /> : <div className="surface overflow-x-auto"><table className="data-table min-w-[800px]"><thead><tr><th scope="col">Property</th><th scope="col">Location</th><th scope="col">Type</th><th scope="col">Monthly rent</th><th scope="col">Status</th><th scope="col"><span className="sr-only">View listing</span></th></tr></thead><tbody>{filtered.map(property => <tr key={property._id}><td><div className="flex items-center gap-3"><img src={getPropertyImageUrl(property.images?.[0])} alt="" className="size-12 rounded-lg object-cover" loading="lazy" /><Link href={`/property/${property._id}`} className="max-w-56 font-semibold hover:text-terracotta">{property.title}</Link></div></td><td className="text-muted-foreground">{property.location?.city}<span className="mt-1 block text-[10px]">{property.location?.area}</span></td><td className="text-xs">{property.propertyType.replace('BHK', ' BHK')}</td><td>₹{property.rent.toLocaleString('en-IN')}</td><td><span className="status-pill" data-status={property.status}>{property.status}</span></td><td><Link href={`/property/${property._id}`} aria-label={`View ${property.title}`} className="inline-flex size-8 items-center justify-center rounded-full border border-border hover:border-primary"><ArrowUpRight size={15} /></Link></td></tr>)}</tbody></table></div>}</div>;
}
