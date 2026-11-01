"use client";

import RoleGuard from "@/features/auth/components/RoleGuard";
import AppShell from "@/components/layout/AppShell";
import { AdminContextProvider } from "@/features/admin/context/AdminContext";

export default function AdminLayout({ children }) {
  return (
    <RoleGuard role="admin">
      <AdminContextProvider>
        <AppShell role="admin">{children}</AppShell>
      </AdminContextProvider>
    </RoleGuard>
  );
}

