"use client";

import EmptyState from "@/components/ui/empty-state";
import PageHeading from "@/components/ui/page-heading";
import type { User } from "@/types/domain";
import { Search, Users } from "lucide-react";
import { useState } from "react";

export default function PeopleTable({ people, landlords = false }: { people: User[]; landlords?: boolean }) {
  const [query, setQuery] = useState('');
  const filtered = people.filter(person => `${person.name} ${person.email}`.toLowerCase().includes(query.toLowerCase()));
  return <div className="dashboard-page"><PageHeading eyebrow={landlords ? 'The people opening doors' : 'The Talaash community'} title={landlords ? 'Good places start with people.' : 'People make a place.'} description={landlords ? 'Property owners sharing a little space for someone’s next chapter.' : 'A view of the people finding, sharing, and managing homes on Talaash.'} action={<span className="status-pill"><Users size={13} />{people.length} {landlords ? 'owners' : 'members'}</span>} /><label className="surface mb-6 flex max-w-md items-center gap-3 px-4 py-3"><Search size={17} className="text-muted-foreground" /><span className="sr-only">Search by name or email</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search by name or email" className="min-w-0 flex-1 bg-transparent text-sm outline-none" /></label>{!filtered.length ? <EmptyState title={query ? 'No familiar names here yet.' : 'The community starts here.'} description={query ? 'Try a different name or email address.' : 'Members will appear here when they join Talaash.'} /> : <div className="surface overflow-x-auto"><table className="data-table"><thead><tr><th scope="col">Member</th><th scope="col">Email address</th><th scope="col">{landlords ? 'Phone' : 'Account type'}</th></tr></thead><tbody>{filtered.map(person => <tr key={person._id}><td><div className="flex items-center gap-3"><span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary font-display text-lg">{person.name?.slice(0, 1) || 'T'}</span><span className="font-semibold">{person.name || 'Talaash member'}</span></div></td><td className="text-muted-foreground">{person.email}</td><td>{landlords ? <span className="text-muted-foreground">{person.phone || person.mobile || 'Not provided'}</span> : <span className="status-pill">{person.role}</span>}</td></tr>)}</tbody></table></div>}</div>;
}
