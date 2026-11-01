"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/layout/AppSidebar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function AppShell({ children, role = "tenant" }) {
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar role={role} />
      <div className="flex min-h-screen w-full flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </SidebarProvider>
  );
}

