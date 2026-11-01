"use client";


import AppSidebar from "@/components/layout/AppSidebar";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function AppShell({ children, role = "tenant" }: { children: React.ReactNode; role?: import("@/types/domain").Role }) {
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

