"use client";
import type { Property,User } from "@/types/domain";


import { adminApi } from "@/features/admin/services/admin.api";
import { UseUserContext } from "@/features/auth/context/UserContext";
import { createContext,useContext,useEffect,useState } from "react";

const AdminContext = createContext<ReturnType<typeof useAdminContextValue> | null>(null);

function useAdminContextValue() {
  const { authStatus, user } = UseUserContext();
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [allLandlords, setAllLandlords] = useState<User[]>([]);
  const [allProperties, setAllProperties] = useState<Property[]>([]);

  const [totalUsers, setTotalUsers] = useState(0);
  const [totalProperties, setTotalProperties] = useState(0);
  const [totalLandlords, setTotalLandlords] = useState(0);

  // Fetch Users
  const fetchAllUsers = async () => {
    try {
      const response = await adminApi.users();

      if (response.data.success) {
        setAllUsers(response.data.data);
        setTotalUsers(response.data.data.length);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch Landlords
  const fetchAllLandlords = async () => {
    try {
      const response = await adminApi.landlords();

      if (response.data.success) {
        setAllLandlords(response.data.data);
        setTotalLandlords(response.data.data.length);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch Properties
  const fetchAllProperties = async () => {
    try {
      const response = await adminApi.properties();

      if (response.data.success) {
        setAllProperties(response.data.data);
        setTotalProperties(response.data.data.length);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // fetch everything when admin dashboard loads
  useEffect(() => {
    if (!authStatus || user?.role !== "admin") return;

    fetchAllUsers();
    fetchAllLandlords();
    fetchAllProperties();
  }, [authStatus, user]);

  const value = {
    allUsers,
    allLandlords,
    allProperties,
    totalUsers,
    totalProperties,
    totalLandlords,
  };

  return value;
}

export function AdminContextProvider({ children }: { children: React.ReactNode }) { const value = useAdminContextValue(); return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>; }

export const UseAdminContext = () => {
  const value = useContext(AdminContext); if (!value) throw new Error("Missing AdminContext provider"); return value;
};
