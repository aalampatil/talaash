"use client";

import Brand from "@/components/ui/brand";
import { Show, SignIn, SignUp, useAuth } from "@clerk/nextjs";
import type { Role } from "@/types/domain";
import { ArrowLeft, ArrowUpRight, KeyRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const roleRedirects = { tenant: '/', landlord: '/dashboard/landlord', admin: '/dashboard/admin' };

export default function Login({ role }: { role: Role }) {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const [mode, setMode] = useState('signin');
  const redirectUrl = roleRedirects[role];
  const unsafeMetadata = useMemo(() => ({ role }), [role]);
  useEffect(() => { if (isSignedIn) router.replace(redirectUrl); }, [isSignedIn, redirectUrl, router]);
  return <div className="grid min-h-screen lg:grid-cols-2">
    <aside className="relative hidden overflow-hidden bg-primary lg:flex lg:flex-col lg:justify-between lg:p-12">
      <img src="/images/editorial/living-room.jpg" alt="A bright, welcoming living space" width={1800} height={1200} className="absolute inset-0 h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-b from-[#102d22]/45 via-[#102d22]/5 to-[#102d22]/90" />
      <div className="relative"><Brand light /></div><div className="relative max-w-lg pb-7 text-white"><KeyRound size={32} strokeWidth={1.1} className="mb-6 text-[#d4dfc2]" /><p className="mb-5 text-[10px] uppercase tracking-[0.2em] text-white/75">Every new beginning starts somewhere</p><h1 className="display-title text-6xl">{role === 'landlord' ? <>A good place.<br />A great new story.</> : role === 'admin' ? <>A thoughtful space.<br />Behind the scenes.</> : <>Your next chapter<br />starts <span className="italic text-[#e3ebd3]">at home.</span></>}</h1><p className="mt-6 max-w-sm text-sm leading-7 text-white/75">{role === 'landlord' ? 'Share your space, connect with future tenants, and keep every visit in one place.' : 'A place for your everyday rituals, big plans, and everything in between.'}</p></div>
    </aside>
    <main className="flex min-w-0 flex-col px-5 py-7 sm:px-12 lg:px-16">
      <div className="flex items-center justify-between"><div className="lg:hidden"><Brand /></div><Link href="/" className="ml-auto inline-flex items-center gap-2 text-xs text-muted-foreground"><ArrowLeft size={14} />Back to Talaash</Link></div>
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-12">
        <p className="eyebrow mb-3">{role === 'admin' ? 'Administration' : role === 'landlord' ? 'For property owners' : 'A little closer to home'}</p><h2 className="display-title text-4xl sm:text-5xl">{mode === 'signin' ? 'Welcome home.' : 'Make yourself at home.'}</h2><p className="mb-7 mt-4 text-sm leading-7 text-muted-foreground">{role === 'landlord' ? 'Your properties, visits, and new beginnings. All here.' : role === 'admin' ? 'Sign in to your authorised administrator account.' : 'Save the places you love. Plan a visit. Find your people.'}</p>
        <Show when="signed-out">
          {role !== 'admin' && <div aria-label="Account action" className="mb-6 flex rounded-xl border border-border bg-secondary p-1">{[{ value: 'signin', label: 'Sign in' }, { value: 'signup', label: 'Create an account' }].map(item => <button key={item.value} onClick={() => setMode(item.value)} aria-pressed={mode === item.value} className={`flex-1 rounded-lg px-4 py-3 text-xs font-semibold transition-colors ${mode === item.value ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground'}`}>{item.label}</button>)}</div>}
          <div className="flex w-full justify-center">{mode === 'signup' && role !== 'admin' ? <SignUp routing="hash" unsafeMetadata={unsafeMetadata} forceRedirectUrl={redirectUrl} signInUrl={`/login/${role}`} signInForceRedirectUrl={redirectUrl} /> : <SignIn routing="hash" forceRedirectUrl={redirectUrl} signUpUrl={`/login/${role}`} signUpForceRedirectUrl={redirectUrl} />}</div>
        </Show>
        <Show when="signed-in"><p role="status" className="surface p-6 text-sm text-muted-foreground">Taking you to your space…</p></Show>
        {role !== 'admin' && <p className="mt-7 text-center text-xs text-muted-foreground">{role === 'landlord' ? 'Looking for your own place?' : 'Have a property to share?'} <Link href={role === 'landlord' ? '/login/tenant' : '/login/landlord'} className="inline-flex items-center gap-1 font-semibold text-primary">{role === 'landlord' ? 'Find a home' : 'Join as a landlord'}<ArrowUpRight size={12} /></Link></p>}
      </div>
      <p className="text-center text-[10px] text-muted-foreground">Talaash · The search ends here.</p>
    </main>
  </div>;
}
