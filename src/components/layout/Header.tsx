"use client";

import Brand from "@/components/ui/brand";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { UseUserContext } from "@/features/auth/context/UserContext";
import { ArrowUpRight, Heart, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const { authStatus, user, loading } = UseUserContext();
  const dashboard = pathname.startsWith("/dashboard");
  const accountHref = user?.role === "landlord" ? "/dashboard/landlord" : user?.role === "admin" ? "/dashboard/admin" : "/account";
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur-xl">
      <div className={`flex h-20 items-center justify-between gap-5 ${dashboard ? "px-5 lg:px-10" : "page-container"}`}>
        <div className="flex items-center gap-4">
          {dashboard && <SidebarTrigger className="size-10 rounded-full border border-border" />}
          <Brand />
          {dashboard && <span className="ml-5 hidden border-l border-border pl-6 text-xs capitalize text-muted-foreground sm:block">{user?.role} workspace</span>}
        </div>
        {!dashboard && <nav aria-label="Main navigation" className="hidden items-center gap-8 text-xs font-medium lg:flex">
          <Link href="/filter-properties" aria-current={pathname === "/filter-properties" ? "page" : undefined} className="transition-colors hover:text-terracotta">Find a home</Link>
          <Link href="/#neighborhoods" className="transition-colors hover:text-terracotta">Explore cities</Link>
          <Link href="/#how-it-works" className="transition-colors hover:text-terracotta">How it works</Link>
        </nav>}
        <div className="flex items-center gap-3 sm:gap-5">
          {!dashboard && <Link href={user?.role === "landlord" ? "/dashboard/landlord/add-new-property" : "/login/landlord"} className="hidden items-center gap-1.5 text-xs font-semibold sm:flex">List your property <ArrowUpRight size={14} /></Link>}
          {authStatus ? <>
            {user?.role === "tenant" && <Link href="/saved-properties" aria-label="Saved homes" className="hidden rounded-full p-2 hover:bg-secondary sm:block"><Heart size={19} strokeWidth={1.5} /></Link>}
            <Link href={accountHref} aria-label="Your account" className="flex size-10 items-center justify-center rounded-full bg-[#e5eadb] text-sm font-semibold text-primary">{user?.name?.slice(0, 1).toUpperCase() || <UserRound size={18} />}</Link>
          </> : <Link href="/login/tenant" className="button-primary min-h-10 px-5 py-2.5 text-xs">{loading ? "Welcome" : "Sign in"}<ArrowUpRight size={14} /></Link>}
          {!dashboard && <SidebarTrigger className="size-10 rounded-full border border-border lg:hidden" />}
          {!dashboard && authStatus && <SidebarTrigger className="hidden size-10 rounded-full border border-border lg:flex" />}
        </div>
      </div>
    </header>
  );
}
