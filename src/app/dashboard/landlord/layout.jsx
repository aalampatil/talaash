"use client";

import RoleGuard from "@/features/auth/components/RoleGuard";
import AppShell from "@/components/layout/AppShell";
import { LandlordContextProvider } from "@/features/landlord/context/LandlordContext";

export default function LandlordLayout({ children }) {
  return (
    <RoleGuard role="landlord">
      <LandlordContextProvider>
        <AppShell role="landlord">{children}</AppShell>
      </LandlordContextProvider>
    </RoleGuard>
  );
}

