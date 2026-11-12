"use client";

import { UseUserContext } from "@/features/auth/context/UserContext";
import { getPropertyImageUrl } from "@/features/properties/utils/propertyImage";
import { useTenantContext } from "@/features/tenant/context/TenantContext";
import type { PropertyImage } from "@/types/domain";
import { ArrowUpRight, BedDouble, Heart, MapPin } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function PropertyCard({ id, image, title, price, city, area, type, amenities = [], status }: { id: string; image?: PropertyImage; title: string; price: string; city?: string; area?: string; type?: string; amenities?: string[]; status?: string }) {
  const { authStatus, user } = UseUserContext();
  const { savedProperties, saveProp, removeProp } = useTenantContext();
  const [saving, setSaving] = useState(false);
  const saved = savedProperties.some(property => property._id === id);
  async function toggleSaved() {
    setSaving(true);
    try { await (saved ? removeProp(id) : saveProp(id)); } finally { setSaving(false); }
  }
  return <article className="group min-w-0">
    <div className="relative overflow-hidden rounded-2xl bg-secondary">
      <Link href={`/property/${id}`} tabIndex={-1} aria-hidden="true"><img src={getPropertyImageUrl(image)} onError={event => { event.currentTarget.onerror = null; event.currentTarget.src = '/images/property-placeholder.svg'; }} alt="" loading="lazy" width={800} height={600} className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105" /></Link>
      <span className="absolute left-3 top-3 rounded-full bg-background/95 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-wider text-primary">{status === "occupied" ? "Occupied" : type === "room" ? "Private room" : type?.replace("BHK", " BHK") || "A place to call home"}</span>
      {authStatus && user?.role === "tenant" ? <button aria-label={saved ? `Remove ${title} from saved homes` : `Save ${title}`} aria-pressed={saved} disabled={saving} onClick={toggleSaved} className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-background/95 text-primary transition-colors hover:bg-white"><Heart size={16} fill={saved ? 'currentColor' : 'none'} strokeWidth={1.6} /></button> : <Link href={authStatus ? `/property/${id}` : "/login/tenant"} aria-label={authStatus ? `View ${title}` : `Sign in to save ${title}`} className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-background/95 text-primary"><Heart size={16} strokeWidth={1.6} /></Link>}
    </div>
    <div className="px-0.5 pb-2 pt-4">
      <div className="flex items-start justify-between gap-3"><h3 className="text-base font-semibold leading-6"><Link href={`/property/${id}`} className="hover:text-terracotta">{title}</Link></h3><ArrowUpRight size={18} strokeWidth={1.3} className="mt-1 shrink-0 text-primary" /></div>
      {(city || area) && <p className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground"><MapPin size={12} />{[area, city].filter(Boolean).join(', ')}</p>}
      <div className="mt-4 flex min-h-5 flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-muted-foreground">{type && <span className="flex items-center gap-1.5"><BedDouble size={13} />{type.replace("BHK", " BHK")}</span>}{amenities.slice(0, 2).map(amenity => <span key={amenity} className="border-l border-border pl-3">{amenity}</span>)}</div>
      <div className="mt-4 border-t border-border pt-3"><span className="text-lg font-semibold tracking-tight">{price}</span><span className="ml-1 text-[11px] text-muted-foreground">/ month</span></div>
    </div>
  </article>;
}
