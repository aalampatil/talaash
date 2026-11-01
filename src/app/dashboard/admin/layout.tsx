"use client";


import AppShell from "@/components/layout/AppShell";
import { AdminContextProvider } from "@/features/admin/context/AdminContext";
import RoleGuard from "@/features/auth/components/RoleGuard";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard role="admin">
      <AdminContextProvider>
        <AppShell role="admin">{children}</AppShell>
      </AdminContextProvider>
    </RoleGuard>
  );
}

