"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { UseUserContext } from "@/features/auth/context/UserContext";
import { tenantApi } from "@/features/tenant/services/tenant.api";

const TenantContext = createContext(null);

export function TenantContextProvider({ children }) {
  const { authStatus, user } = UseUserContext();
  const [tenantProfile, setTenantProfile] = useState({});
  const [visits, setVisits] = useState([]);
  const [savedProperties, setSavedProperties] = useState([]);
  const isTenant = authStatus && user?.role === "tenant";

  const fetchTenant = useCallback(async () => {
    const response = await tenantApi.profile();
    if (response.data.success) {
      setTenantProfile(response.data.data);
      setSavedProperties(response.data.data.savedProperties || []);
    }
  }, []);

  const fetchVisits = useCallback(async () => {
    const response = await tenantApi.visits();
    if (response.data.success) setVisits(response.data.data);
  }, []);

  useEffect(() => {
    if (!isTenant) {
      setTenantProfile({});
      setVisits([]);
      setSavedProperties([]);
      return;
    }
    Promise.all([fetchTenant(), fetchVisits()]).catch(console.error);
  }, [isTenant, user?._id, fetchTenant, fetchVisits]);

  const saveProp = async (id) => {
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

  const removeProp = async (id) => {
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

  const requestVisit = async (propertyId, visitDate) => {
    await tenantApi.requestVisit(propertyId, visitDate);
    await fetchVisits();
  };

  const cancelVisit = async (id) => {
    try {
      await tenantApi.cancelVisit(id);
      await fetchVisits();
    } catch (error) {
      console.error(error);
      toast.error("Could not cancel visit");
    }
  };

  return (
    <TenantContext.Provider value={{
      tenantProfile: isTenant ? tenantProfile : {},
      visits: isTenant ? visits : [],
      savedProperties: isTenant ? savedProperties : [],
      fetchTenant, fetchVisits, saveProp, removeProp, requestVisit, cancelVisit,
    }}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenantContext() {
  const context = useContext(TenantContext);
  if (!context) throw new Error("useTenantContext requires TenantContextProvider");
  return context;
}
