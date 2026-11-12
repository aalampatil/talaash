"use client";

import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, useSidebar } from "@/components/ui/sidebar";
import Brand from "@/components/ui/brand";
import { UseUserContext } from "@/features/auth/context/UserContext";
import type { Role } from "@/types/domain";
import { ArrowUpRight, Building2, CalendarDays, Heart, House, LayoutDashboard, LogOut, Plus, UserRound, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = {
  tenant: [{ href: "/filter-properties", label: "Explore homes", icon: House }, { href: "/saved-properties", label: "Saved homes", icon: Heart }, { href: "/my-visits", label: "My visits", icon: CalendarDays }, { href: "/account", label: "My account", icon: UserRound }],
  landlord: [{ href: "/dashboard/landlord", label: "Overview", icon: LayoutDashboard }, { href: "/dashboard/landlord/properties", label: "My properties", icon: Building2 }, { href: "/dashboard/landlord/visits", label: "Visit requests", icon: CalendarDays }, { href: "/dashboard/landlord/add-new-property", label: "Add a property", icon: Plus }],
  admin: [{ href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard }, { href: "/dashboard/admin/all-users", label: "All users", icon: Users }, { href: "/dashboard/admin/all-landlords", label: "Landlords", icon: UserRound }, { href: "/dashboard/admin/all-properties", label: "Properties", icon: Building2 }],
};

export default function AppSidebar({ role }: { role: Role }) {
  const { authStatus, user, becomeLandlord, logoutUser } = UseUserContext();
  const { setOpenMobile } = useSidebar();
  const pathname = usePathname();
  const activeRole = role === "tenant" ? user?.role || "tenant" : role;
  return <Sidebar className="border-r border-border">
    <SidebarHeader className="px-6 pb-8 pt-7"><Brand /><p className="mt-2 text-xs text-muted-foreground">The search ends here.</p></SidebarHeader>
    <SidebarContent className="px-4">
      <p className="eyebrow px-3 pb-4">{activeRole === "tenant" ? "Your next chapter" : `${activeRole} workspace`}</p>
      <nav aria-label="Workspace navigation" className="space-y-1.5">
        {links[activeRole].map(({ href, label, icon: Icon }) => <Link key={href} href={href} onClick={() => setOpenMobile(false)} aria-current={pathname === href ? "page" : undefined} className={`flex items-center gap-3 rounded-xl px-3 py-3.5 text-sm transition-colors ${pathname === href ? "bg-primary text-white" : "text-muted-foreground hover:bg-secondary hover:text-primary"}`}><Icon size={18} strokeWidth={1.5} />{label}</Link>)}
      </nav>
      <div className="mx-2 mt-10 rounded-xl bg-[#e7ebde] p-5">
        <House size={23} strokeWidth={1.3} className="mb-4 text-primary" />
        <p className="font-display text-xl">{activeRole === "tenant" ? "Have a place to share?" : "A new place, a new story."}</p>
        <p className="mt-2 text-xs leading-6 text-muted-foreground">{activeRole === "tenant" ? "Help someone find their next home." : "See what’s waiting beyond your workspace."}</p>
        {authStatus && activeRole === "tenant" ? <button onClick={becomeLandlord} className="mt-4 inline-flex items-center gap-2 text-xs font-semibold">Become a landlord <ArrowUpRight size={14} /></button> : <Link href="/filter-properties" onClick={() => setOpenMobile(false)} className="mt-4 inline-flex items-center gap-2 text-xs font-semibold">Explore homes <ArrowUpRight size={14} /></Link>}
      </div>
    </SidebarContent>
    <SidebarFooter className="border-t border-border p-5">
      {authStatus ? <><p className="truncate px-2 text-sm font-semibold">{user?.name}</p><p className="truncate px-2 text-xs text-muted-foreground">{user?.email}</p><button onClick={logoutUser} className="mt-3 flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-muted-foreground hover:bg-secondary"><LogOut size={17} />Sign out</button></> : <Link href="/login/tenant" onClick={() => setOpenMobile(false)} className="button-primary">Sign in to your account <ArrowUpRight size={16} /></Link>}
    </SidebarFooter>
  </Sidebar>;
}
