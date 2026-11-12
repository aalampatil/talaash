"use client";

import ResourceState from "@/components/feedback/ResourceState";
import RoleGuard from "@/features/auth/components/RoleGuard";
import { useTenantContext } from "@/features/tenant/context/TenantContext";

export default function TenantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loading, error, reload } = useTenantContext();
  return (
    <RoleGuard role="tenant">
      <ResourceState loading={loading} error={error} retry={reload}>
        {children}
      </ResourceState>
    </RoleGuard>
  );
}
