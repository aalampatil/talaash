"use client";

import type { Property, User } from "@/types/domain";
import { adminApi } from "@/features/admin/services/admin.api";
import { UseUserContext } from "@/features/auth/context/UserContext";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const AdminContext = createContext<ReturnType<
  typeof useAdminContextValue
> | null>(null);
function useAdminContextValue() {
  const { authStatus, user } = UseUserContext();
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [allLandlords, setAllLandlords] = useState<User[]>([]);
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const reload = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [users, landlords, properties] = await Promise.all([
        adminApi.users(),
        adminApi.landlords(),
        adminApi.properties(),
      ]);
      if (
        !users.data.success ||
        !landlords.data.success ||
        !properties.data.success
      )
        throw new Error("Incomplete administration response");
      setAllUsers(users.data.data);
      setAllLandlords(landlords.data.data);
      setAllProperties(properties.data.data);
    } catch {
      setError("We couldn’t load the community overview. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    if (authStatus && user?.role === "admin") reload();
  }, [authStatus, user?._id, user?.role, reload]);
  return {
    allUsers,
    allLandlords,
    allProperties,
    totalUsers: allUsers.length,
    totalProperties: allProperties.length,
    totalLandlords: allLandlords.length,
    loading,
    error,
    reload,
  };
}
export function AdminContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const value = useAdminContextValue();
  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
}
export function UseAdminContext() {
  const value = useContext(AdminContext);
  if (!value) throw new Error("Missing AdminContext provider");
  return value;
}
