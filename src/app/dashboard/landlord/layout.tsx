"use client";


import AppShell from "@/components/layout/AppShell";
import RoleGuard from "@/features/auth/components/RoleGuard";
import { LandlordContextProvider } from "@/features/landlord/context/LandlordContext";

export default function LandlordLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard role="landlord">
      <LandlordContextProvider>
        <AppShell role="landlord">{children}</AppShell>
      </LandlordContextProvider>
    </RoleGuard>
  );
}

