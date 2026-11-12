"use client";

import EmptyState from "@/components/ui/empty-state";
import PageHeading from "@/components/ui/page-heading";
import { useTenantContext } from "@/features/tenant/context/TenantContext";
import { ArrowUpRight, CalendarDays, MapPin } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function TenantVisits() {
  const { visits, cancelVisit } = useTenantContext();
  const [busy, setBusy] = useState('');
  async function cancel(id: string) { setBusy(id); try { await cancelVisit(id); } finally { setBusy(''); } }
  return <div className="dashboard-page"><PageHeading eyebrow="Make time for a new beginning" title="Meet your next home." description="There’s nothing like walking through the door. Keep track of your requests and upcoming visits here." action={<span className="status-pill"><CalendarDays size={13} />{visits.length} visits</span>} />{!visits.length ? <EmptyState title="Something to look forward to." description="Find a home you love and request a visit. Your next chapter might be just around the corner." href="/filter-properties" action="Explore homes" /> : <div className="space-y-4">{visits.map(visit => { const date = new Date(visit.visitDate); return <article key={visit._id} className="surface flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:p-6"><div className="flex size-16 shrink-0 flex-col items-center justify-center rounded-xl bg-secondary text-primary"><span className="text-[10px] uppercase tracking-wider">{date.toLocaleDateString('en-IN', { month: 'short' })}</span><span className="font-display text-3xl">{date.getDate()}</span></div><div className="min-w-0 flex-1"><h2 className="text-base font-semibold">{visit.propertyId?.title || 'Property visit'}</h2><p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground"><MapPin size={12} />{[visit.propertyId?.location?.area, visit.propertyId?.location?.city].filter(Boolean).join(', ') || 'Location details with owner'}</p>{visit.propertyId && <Link href={`/property/${visit.propertyId._id}`} className="mt-3 inline-flex items-center gap-1 text-xs font-semibold">View home <ArrowUpRight size={12} /></Link>}</div><span className="status-pill self-start sm:self-center" data-status={visit.status}>{visit.status}</span>{['pending', 'approved'].includes(visit.status) && <button type="button" disabled={busy === visit._id} onClick={() => cancel(visit._id)} className="button-secondary min-h-10 px-4 py-2 text-xs">{busy === visit._id ? 'Cancelling…' : 'Cancel request'}</button>}</article>; })}</div>}</div>;
}
