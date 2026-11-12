import Brand from "@/components/ui/brand";
import { ArrowUpRight, MapPin } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return <footer className="border-t border-border bg-[#f2f1e9]">
    <div className="page-container grid gap-10 py-14 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
      <div><Brand /><p className="mt-5 max-w-60 text-sm leading-7 text-muted-foreground">Good places. New beginnings.<br />Find a space that feels like you.</p><span className="mt-6 inline-flex items-center gap-2 text-xs text-muted-foreground"><MapPin size={14} />Made for the way India lives.</span></div>
      <div><h2 className="eyebrow mb-5">Find your place</h2><div className="flex flex-col items-start gap-4 text-sm text-muted-foreground"><Link href="/filter-properties" className="hover:text-primary">Explore all homes</Link><Link href="/saved-properties" className="hover:text-primary">Your saved homes</Link><Link href="/my-visits" className="hover:text-primary">Plan a visit</Link></div></div>
      <div><h2 className="eyebrow mb-5">For property owners</h2><div className="flex flex-col items-start gap-4 text-sm text-muted-foreground"><Link href="/login/landlord" className="hover:text-primary">List your property</Link><Link href="/dashboard/landlord" className="hover:text-primary">Landlord workspace</Link><Link href="/#how-it-works" className="hover:text-primary">How Talaash works</Link></div></div>
      <div><h2 className="eyebrow mb-5">A little help</h2><p className="text-sm leading-7 text-muted-foreground">Questions about your next move? We’re a message away.</p><a href="mailto:aalam.workacc@gmail.com" className="text-link mt-4">Get in touch <ArrowUpRight size={15} /></a></div>
    </div>
    <div className="page-container flex flex-wrap justify-between gap-4 border-t border-border py-6 text-[11px] text-muted-foreground"><p>© {new Date().getFullYear()} Talaash. The search ends here.</p><p>Discover thoughtfully. Visit in person. Feel at home.</p></div>
  </footer>;
}
