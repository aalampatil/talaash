"use client";

import AppShell from "@/components/layout/AppShell";
import ResourceState from "@/components/feedback/ResourceState";
import RoleGuard from "@/features/auth/components/RoleGuard";
import {
  LandlordContextProvider,
  UseLandlordContext,
} from "@/features/landlord/context/LandlordContext";

export default function LandlordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard role="landlord">
      <LandlordContextProvider>
        <LandlordWorkspace>{children}</LandlordWorkspace>
      </LandlordContextProvider>
    </RoleGuard>
  );
}

function LandlordWorkspace({ children }: { children: React.ReactNode }) {
  const { loading, error, reload } = UseLandlordContext();
  return (
    <AppShell role="landlord">
      <ResourceState loading={loading} error={error} retry={reload}>
        {children}
      </ResourceState>
    </AppShell>
  );
}
