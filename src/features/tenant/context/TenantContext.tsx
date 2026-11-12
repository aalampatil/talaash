"use client";
import type { Property, TenantProfile, Visit } from "@/types/domain";

import { UseUserContext } from "@/features/auth/context/UserContext";
import { tenantApi } from "@/features/tenant/services/tenant.api";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "react-toastify";

const TenantContext = createContext<ReturnType<
  typeof useTenantContextValue
> | null>(null);

function useTenantContextValue() {
  const { authStatus, user } = UseUserContext();
  const [tenantProfile, setTenantProfile] = useState<TenantProfile>({});
  const [visits, setVisits] = useState<Visit[]>([]);
  const [savedProperties, setSavedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const isTenant = authStatus && user?.role === "tenant";

  const fetchTenant = useCallback(async () => {
    const response = await tenantApi.profile();
    if (!response.data.success)
      throw new Error("Unable to load tenant profile");
    if (response.data.success) {
      setTenantProfile(response.data.data);
      setSavedProperties(response.data.data.savedProperties || []);
    }
  }, []);

  const fetchVisits = useCallback(async () => {
    const response = await tenantApi.visits();
    if (!response.data.success) throw new Error("Unable to load tenant visits");
    if (response.data.success) setVisits(response.data.data);
  }, []);

  const reload = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      await Promise.all([fetchTenant(), fetchVisits()]);
    } catch {
      setError("We couldn’t load your account. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [fetchTenant, fetchVisits]);

  useEffect(() => {
    if (!isTenant) {
      setTenantProfile({});
      setVisits([]);
      setSavedProperties([]);
      setLoading(false);
      setError("");
      return;
    }
    reload();
  }, [isTenant, user?._id, reload]);

  const saveProp = async (id: string) => {
    try {
      const response = await tenantApi.saveProperty(id);
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchTenant();
      }
    } catch (error) {
      console.error(error);
      toast.error("Could not save property");
    }
  };

  const removeProp = async (id: string) => {
    try {
      const response = await tenantApi.removeProperty(id);
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchTenant();
      }
    } catch (error) {
      console.error(error);
      toast.error("Could not remove property");
    }
  };

  const requestVisit = async (propertyId: string, visitDate: string) => {
    await tenantApi.requestVisit(propertyId, visitDate);
    await fetchVisits();
  };

  const cancelVisit = async (id: string) => {
    try {
      await tenantApi.cancelVisit(id);
      await fetchVisits();
    } catch (error) {
      console.error(error);
      toast.error("Could not cancel visit");
    }
  };

  return {
    tenantProfile: isTenant ? tenantProfile : {},
    visits: isTenant ? visits : [],
    savedProperties: isTenant ? savedProperties : [],
    loading,
    error,
    reload,
    fetchTenant,
    fetchVisits,
    saveProp,
    removeProp,
    requestVisit,
    cancelVisit,
  };
}

export function TenantContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const value = useTenantContextValue();
  return (
    <TenantContext.Provider value={value}>{children}</TenantContext.Provider>
  );
}

export function useTenantContext() {
  const context = useContext(TenantContext);
  if (!context)
    throw new Error("useTenantContext requires TenantContextProvider");
  return context;
}
