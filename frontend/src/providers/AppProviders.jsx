"use client";

import { ToastContainer } from "react-toastify";
import { UserContextProvider } from "@/features/auth/context/UserContext";
import { PropertyContextProvider } from "@/features/properties/context/PropertyContext";

export default function AppProviders({ children }) {
  return (
    <UserContextProvider>
      <PropertyContextProvider>
        {children}
        <ToastContainer />
      </PropertyContextProvider>
    </UserContextProvider>
  );
}

