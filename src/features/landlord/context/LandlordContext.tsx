"use client";

import type { Landlord, Property, Visit } from "@/types/domain";
import { UseUserContext } from "@/features/auth/context/UserContext";
import { landlordApi } from "@/features/landlord/services/landlord.api";
import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "react-toastify";

const LandlordContext = createContext<ReturnType<
  typeof useLandlordContextValue
> | null>(null);
function useLandlordContextValue() {
  const { authStatus, user } = UseUserContext();
  const [landlordProperties, setLandlordProperties] = useState<Property[]>([]);
  const [landlordProfile, setLandlordProfile] = useState<Partial<Landlord>>({});
  const [manageVisits, setManageVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const reload = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [profile, properties, visits] = await Promise.all([
        landlordApi.profile(),
        landlordApi.properties(),
        landlordApi.visits(),
      ]);
      if (
        !profile.data.success ||
        !properties.data.success ||
        !visits.data.success
      )
        throw new Error("Incomplete workspace response");
      setLandlordProfile(profile.data.data);
      setLandlordProperties(properties.data.data);
      setManageVisits(visits.data.data);
    } catch {
      setError("We couldn’t load your workspace. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    if (authStatus && user?.role === "landlord") reload();
  }, [authStatus, user?._id, user?.role, reload]);
  const createLandlordProperty = async (data: FormData) => {
    const response = await landlordApi.createProperty(data);
    if (!response.data.success)
      throw new Error(response.data.message || "Property creation failed");
    toast.success(response.data.message);
    await reload();
    router.push("/dashboard/landlord/properties");
  };
  const deleteLandlordProperty = async (id: string) => {
    try {
      const response = await landlordApi.deleteProperty(id);
      if (!response.data.success) throw new Error();
      toast.success(response.data.message);
      await reload();
    } catch {
      toast.error("We couldn’t delete this property. Please try again.");
    }
  };
  const approveVisit = async (id: string) => {
    try {
      const response = await landlordApi.approveVisit(id);
      if (!response.data.success) throw new Error();
      toast.success("Visit approved");
      await reload();
    } catch {
      toast.error("We couldn’t approve this visit. Please try again.");
    }
  };
  const rejectVisit = async (id: string) => {
    try {
      const response = await landlordApi.rejectVisit(id);
      if (!response.data.success) throw new Error();
      toast.success("Visit declined");
      await reload();
    } catch {
      toast.error("We couldn’t decline this visit. Please try again.");
    }
  };
  return {
    approveVisit,
    rejectVisit,
    deleteLandlordProperty,
    createLandlordProperty,
    landlordProfile,
    landlordProperties,
    manageVisits,
    loading,
    error,
    reload,
  };
}
export function LandlordContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const value = useLandlordContextValue();
  return (
    <LandlordContext.Provider value={value}>
      {children}
    </LandlordContext.Provider>
  );
}
export function UseLandlordContext() {
  const value = useContext(LandlordContext);
  if (!value) throw new Error("Missing LandlordContext provider");
  return value;
}
