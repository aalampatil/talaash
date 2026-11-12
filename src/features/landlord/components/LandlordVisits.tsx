"use client";

import EmptyState from "@/components/ui/empty-state";
import PageHeading from "@/components/ui/page-heading";
import { UseLandlordContext } from "@/features/landlord/context/LandlordContext";
import { CalendarDays, Check, X } from "lucide-react";
import { useState } from "react";

export default function LandlordVisits() {
  const { manageVisits, approveVisit, rejectVisit } = UseLandlordContext();
  const [filter, setFilter] = useState('all');
  const [busy, setBusy] = useState('');
  const filtered = manageVisits.filter(visit => filter === 'all' || visit.status === filter);
  async function respond(id: string, approve: boolean) { setBusy(id); try { await (approve ? approveVisit(id) : rejectVisit(id)); } finally { setBusy(''); } }
  return <div className="dashboard-page"><PageHeading eyebrow="Open the door to a new beginning" title="The next hello." description="A visit is the first step. Review requests and find a time to show your space." action={<span className="status-pill"><CalendarDays size={13} />{manageVisits.filter(visit => visit.status === 'pending').length} pending</span>} /><div role="group" aria-label="Filter visit requests" className="mb-7 flex flex-wrap gap-2">{['all', 'pending', 'approved', 'rejected'].map(value => <button key={value} onClick={() => setFilter(value)} aria-pressed={filter === value} className={`rounded-full border px-5 py-2.5 text-xs capitalize ${filter === value ? 'border-primary bg-primary text-white' : 'border-border hover:border-primary'}`}>{value === 'all' ? 'All requests' : value}</button>)}</div>{!filtered.length ? <EmptyState title="No visits in this chapter yet." description="When someone requests a visit, you’ll find the details here. You can then approve or decline their request." /> : <div className="space-y-4">{filtered.map(visit => <article key={visit._id} className="surface flex flex-col gap-5 p-5 sm:p-6 xl:flex-row xl:items-center"><div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-secondary font-display text-xl">{(visit.tenantName || 'T').slice(0, 1)}</div><div className="min-w-0 flex-1"><h2 className="text-sm font-semibold">{visit.tenantName || 'Future tenant'}</h2><p className="mt-1 break-all text-xs text-muted-foreground">{visit.tenantEmail}</p><p className="mt-3 text-xs">{visit.propertyTitle || visit.propertyId?.title || 'Property visit'}</p></div><div className="space-y-3"><p className="flex items-center gap-2 text-xs text-muted-foreground"><CalendarDays size={14} />{new Date(visit.visitDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p><span className="status-pill" data-status={visit.status}>{visit.status}</span></div>{visit.status === 'pending' && <div className="flex gap-2"><button disabled={busy === visit._id} onClick={() => respond(visit._id, true)} className="button-primary min-h-10 px-4 py-2 text-xs"><Check size={14} />{busy === visit._id ? 'Updating…' : 'Approve'}</button><button disabled={busy === visit._id} onClick={() => respond(visit._id, false)} className="button-danger min-h-10 px-4 py-2 text-xs"><X size={14} />Decline</button></div>}</article>)}</div>}</div>;
}
