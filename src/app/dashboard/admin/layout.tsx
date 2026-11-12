"use client";

import AppShell from "@/components/layout/AppShell";
import ResourceState from "@/components/feedback/ResourceState";
import {
  AdminContextProvider,
  UseAdminContext,
} from "@/features/admin/context/AdminContext";
import RoleGuard from "@/features/auth/components/RoleGuard";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard role="admin">
      <AdminContextProvider>
        <AdminWorkspace>{children}</AdminWorkspace>
      </AdminContextProvider>
    </RoleGuard>
  );
}

function AdminWorkspace({ children }: { children: React.ReactNode }) {
  const { loading, error, reload } = UseAdminContext();
  return (
    <AppShell role="admin">
      <ResourceState loading={loading} error={error} retry={reload}>
        {children}
      </ResourceState>
    </AppShell>
  );
}
