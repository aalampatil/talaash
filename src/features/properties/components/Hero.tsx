import Search from "@/features/properties/components/Search";
import { ArrowDown, ArrowUpRight, House, Leaf, Sparkles } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  return <section className="relative overflow-hidden border-b border-border bg-[#f2f1e8]">
    <div className="page-container relative pb-10 pt-10 lg:pb-14 lg:pt-14">
      <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.03fr] lg:gap-14">
        <div className="reveal relative z-10 py-2 lg:pb-12">
          <p className="eyebrow mb-6 flex items-center gap-2"><span className="size-1.5 rounded-full bg-[#9c7950]" />A place for your next chapter</p>
          <h1 className="display-title max-w-xl text-[clamp(3.4rem,6.1vw,6.1rem)]">Somewhere,<br />you’ll feel<br /><span className="italic text-primary">right at home.</span></h1>
          <p className="mt-6 max-w-sm text-sm leading-7 text-muted-foreground sm:text-base">A sunny corner. Your favourite neighbourhood. A little more room to be you. Find your next rental with Talaash.</p>
          <div className="mt-8 flex items-center gap-6"><Link href="/filter-properties" className="text-link">Discover your space <ArrowUpRight size={16} /></Link><span className="flex items-center gap-1.5 text-[11px] text-muted-foreground"><Leaf size={15} strokeWidth={1.5} />A fresh start awaits</span></div>
        </div>
        <div className="relative mx-auto w-full max-w-xl pb-6 lg:max-w-none">
          <div className="hero-photo relative h-[350px] overflow-hidden rounded-t-[180px] rounded-b-2xl sm:h-[480px] lg:h-[550px] lg:rounded-t-[240px]">
            <img src="/images/editorial/living-room.jpg" alt="Sunlit living room with natural wood, a soft sofa, and room to make yourself at home" fetchPriority="high" width={1800} height={1200} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
            <div className="absolute bottom-16 left-7 text-white"><p className="text-[10px] uppercase tracking-[0.18em]">Less searching. More living.</p><p className="mt-2 font-display text-3xl">Make room for life.</p></div>
          </div>
          <div className="absolute -right-2 top-10 flex size-20 -rotate-12 flex-col items-center justify-center rounded-full border border-[#d7deca] bg-[#e7ecd9] text-primary sm:-right-5 sm:size-24"><Sparkles size={19} strokeWidth={1.3} /><span className="mt-1 text-center text-[9px] font-semibold uppercase leading-4 tracking-wider">New keys.<br />New beginnings.</span></div>
          <div className="absolute -bottom-1 left-4 flex items-center gap-3 rounded-xl border border-border bg-background px-5 py-4 shadow-sm sm:-left-6"><span className="flex size-10 items-center justify-center rounded-full bg-[#e8ecde]"><House size={20} strokeWidth={1.4} /></span><div><p className="text-xs font-semibold">Your place is out there.</p><p className="mt-1 text-[11px] text-muted-foreground">Let’s help you find it.</p></div></div>
        </div>
      </div>
      <div className="reveal reveal-delay mt-9 lg:mt-1 lg:max-w-[1050px]"><Search /></div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-4 text-[11px] text-muted-foreground"><p>Popular searches: {['Pune', 'Bengaluru', 'Mumbai'].map((city, index) => <span key={city}>{index > 0 && <span className="mx-2">·</span>}<Link href={`/filter-properties?city=${city}`} className="underline decoration-border underline-offset-4 hover:text-primary">{city}</Link></span>)}</p><a href="#discover" className="hidden items-center gap-2 sm:flex">A little further, a little closer to home <ArrowDown size={13} /></a></div>
    </div>
  </section>;
}
