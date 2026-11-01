"use client";

import { ToastContainer } from "react-toastify";
import { UserContextProvider } from "@/features/auth/context/UserContext";
import { PropertyContextProvider } from "@/features/properties/context/PropertyContext";
import { TenantContextProvider } from "@/features/tenant/context/TenantContext";

export default function AppProviders({ children }) {
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

