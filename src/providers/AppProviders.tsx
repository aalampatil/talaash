"use client";


import { UserContextProvider } from "@/features/auth/context/UserContext";
import { PropertyContextProvider } from "@/features/properties/context/PropertyContext";
import { TenantContextProvider } from "@/features/tenant/context/TenantContext";
import { ToastContainer } from "react-toastify";

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <UserContextProvider>
      <TenantContextProvider>
        <PropertyContextProvider>
          {children}
          <ToastContainer />
        </PropertyContextProvider>
      </TenantContextProvider>
    </UserContextProvider>
  );
}

