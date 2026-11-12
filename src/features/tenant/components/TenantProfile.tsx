"use client";

import PageLoader from "@/components/feedback/PageLoader";
import PageHeading from "@/components/ui/page-heading";
import { useTenantContext } from "@/features/tenant/context/TenantContext";
import { tenantApi } from "@/features/tenant/services/tenant.api";
import { Check, Mail, Pencil, UserRound } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

const defaults = { householdType: 'single', city: '', location: '', minBudget: 1000, maxBudget: 100000, propertyType: '1BHK' };

export default function TenantProfile() {
  const { tenantProfile, fetchTenant } = useTenantContext();
  const [edit, setEdit] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(defaults);
  const profile = tenantProfile?.profile;
  const preferences = { ...defaults, ...tenantProfile?.preferences };
  if (!profile) return <PageLoader />;
  function change(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = event.target;
    setForm(previous => ({ ...previous, [name]: name === 'minBudget' || name === 'maxBudget' ? Number(value) : value }));
  }
  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (form.minBudget > form.maxBudget) { toast.error('Your maximum budget must be at least your minimum budget.'); return; }
    setSaving(true);
    try { const { data } = await tenantApi.updatePreferences(form); if (!data.success) throw new Error(); await fetchTenant(); setEdit(false); toast.success('Your preferences are saved'); }
    catch { toast.error('We couldn’t save your preferences. Please try again.'); }
    finally { setSaving(false); }
  }
  const values = edit ? form : preferences;
  return <div className="dashboard-page"><PageHeading eyebrow="A space that knows you" title="Make it yours." description="A few details about you, and what you’re looking for in your next home." /><div className="grid items-start gap-6 lg:grid-cols-[0.8fr_1.6fr]"><aside className="surface p-8"><div className="mb-6 flex size-20 items-center justify-center rounded-full bg-[#e6ebdc] font-display text-4xl">{profile.name?.slice(0, 1) || <UserRound />}</div><h2 className="font-display text-3xl">{profile.name}</h2><p className="mt-4 flex items-start gap-2 break-all text-xs text-muted-foreground"><Mail size={14} className="shrink-0" />{profile.email}</p>{profile.phone && <p className="mt-3 text-xs text-muted-foreground">{profile.phone}</p>}<div className="mt-7 border-t border-border pt-6"><span className="status-pill">Tenant account</span><p className="mt-4 text-xs leading-6 text-muted-foreground">Your next chapter should feel like you. Keep your preferences up to date to make the search a little easier.</p></div></aside><form onSubmit={save} className="surface p-6 sm:p-8"><div className="mb-7 flex flex-wrap items-start justify-between gap-4 border-b border-border pb-6"><div><h2 className="font-display text-3xl">Your kind of home.</h2><p className="mt-2 text-xs text-muted-foreground">The little details that make a difference.</p></div>{!edit && <button type="button" onClick={() => { setForm(preferences); setEdit(true); }} className="button-secondary min-h-10 px-4 py-2 text-xs"><Pencil size={13} />Edit preferences</button>}</div><div className="grid gap-6 sm:grid-cols-2"><label className="field">Household{edit ? <select className="form-input" name="householdType" value={values.householdType} onChange={change}><option value="single">Just me</option><option value="family">Family</option><option value="room">Shared home</option></select> : <ReadValue value={values.householdType} />}</label><label className="field">Your space{edit ? <select className="form-input" name="propertyType" value={values.propertyType} onChange={change}>{['1BHK', '2BHK', '3BHK', 'room'].map(type => <option key={type} value={type}>{type === 'room' ? 'Private room' : type.replace('BHK', ' BHK')}</option>)}</select> : <ReadValue value={values.propertyType.replace('BHK', ' BHK')} />}</label>{[{ key: 'city', label: 'Preferred city' }, { key: 'location', label: 'Neighbourhood' }, { key: 'minBudget', label: 'Minimum monthly rent' }, { key: 'maxBudget', label: 'Maximum monthly rent' }].map(({ key, label }) => <label key={key} className="field">{label}{edit ? <input className="form-input" name={key} type={key.includes('Budget') ? 'number' : 'text'} min={0} required={key.includes('Budget')} value={values[key as keyof typeof values]} onChange={change} /> : <ReadValue value={key.includes('Budget') ? `₹${Number(values[key as keyof typeof values]).toLocaleString('en-IN')}` : String(values[key as keyof typeof values])} />}</label>)}</div>{edit && <div className="mt-8 flex flex-wrap gap-3 border-t border-border pt-6"><button type="submit" disabled={saving} className="button-primary"><Check size={15} />{saving ? 'Saving…' : 'Save preferences'}</button><button type="button" disabled={saving} onClick={() => setEdit(false)} className="button-secondary">Cancel</button></div>}</form></div></div>;
}

function ReadValue({ value }: { value: string }) { return <span className="min-h-12 rounded-xl bg-secondary/60 px-4 py-3.5 text-sm font-normal capitalize text-muted-foreground">{value || 'Not set yet'}</span>; }
