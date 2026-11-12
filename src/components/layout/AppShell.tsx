"use client";

import AppSidebar from "@/components/layout/AppSidebar";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { SidebarProvider } from "@/components/ui/sidebar";
import type { Role } from "@/types/domain";

export default function AppShell({ children, role = "tenant" }: { children: React.ReactNode; role?: Role }) {
  const dashboard = role !== "tenant";
  return (
    <SidebarProvider defaultOpen={dashboard}>
      <a href="#main-content" className="sr-only fixed left-4 top-4 z-50 rounded-full bg-primary px-5 py-3 text-white focus:not-sr-only">Skip to content</a>
      <AppSidebar role={role} />
      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <Header />
        <main id="main-content" className="min-w-0 flex-1">{children}</main>
        {!dashboard && <Footer />}
        {dashboard && <div className="border-t border-border px-6 py-5 text-xs text-muted-foreground">Talaash workspace · A little more room to manage.</div>}
      </div>
    </SidebarProvider>
  );
}
