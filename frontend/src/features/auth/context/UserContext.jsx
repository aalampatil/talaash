"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { axiosApi } from "@/lib/api/client.js";
import { toast } from "react-toastify";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const { getToken, isLoaded, isSignedIn, signOut } = useAuth();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [authStatus, setAuthStatus] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tenantProfile, setTenantProfile] = useState({});
  const [visits, setVisits] = useState([]);
  const [savedProperties, setSavedProperties] = useState([]);

  const verified = useCallback(async () => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      setUser(null);
      setAuthStatus(false);
      setTenantProfile({});
      setVisits([]);
      setSavedProperties([]);
      setLoading(false);
      return;
    }

    try {
      const response = await axiosApi.get("/user/me");
      if (response.data.success) {
        setUser(response.data.data);
        setAuthStatus(true);
      }
    } catch (error) {
      setUser(null);
      setAuthStatus(false);
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [isLoaded, isSignedIn]);

  const fetchTenant = async () => {
    try {
      const response = await axiosApi.get("/tenant/profile");
      if (response.data.success) {
        setTenantProfile(response.data.data);
        setSavedProperties(response.data.data.savedProperties);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchVisits = async () => {
    try {
      const response = await axiosApi.get("/tenant/visits");
      if (response.data.success) {
        setVisits(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const logoutUser = async () => {
    try {
      await signOut();
      setUser(null);
      setAuthStatus(false);
      toast.success("logged out");
    } catch (error) {
      console.error(error);
    }
  };

  const becomeLandlord = async () => {
    try {
      const response = await axiosApi.post("/user/become-landlord");
      if (response.data.success) {
        setUser(response.data.data);
        setAuthStatus(true);
        toast.success(response.data.message);
        router.push("/dashboard/landlord");
      }
    } catch (error) {
      toast.error("Could not activate landlord account");
      console.error(error);
    }
  };

  const saveProp = async (id) => {
    try {
      const response = await axiosApi.post(`tenant/save-property/${id}`);

      if (response.data.success) {
        toast.success(response.data.message);
        await fetchTenant();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const removeProp = async (id) => {
    try {
      const response = await axiosApi.post(`tenant/remove-property/${id}`);
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchTenant();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const requestVisit = async (propertyId, visitDate) => {
    try {
      await axiosApi.post(`tenant/request-visit`, { propertyId, visitDate });
      await fetchVisits();
    } catch (error) {
      console.error(error);
    }
  };
  const cancelVisit = async (id) => {
    try {
      await axiosApi.post(`tenant/cancel-visit/${id}`);
      await fetchVisits();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const interceptorId = axiosApi.interceptors.request.use(async (config) => {
      const token = await getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    return () => {
      axiosApi.interceptors.request.eject(interceptorId);
    };
  }, [getToken]);

  useEffect(() => {
    if (!isLoaded) return;
    verified();
  }, [isLoaded, verified]);

  useEffect(() => {
    if (!authStatus || user?.role !== "tenant") return;
    fetchTenant();
    fetchVisits();
  }, [authStatus, user]);

  const value = {
    user,
    authStatus,
    loading,
    tenantProfile,
    setTenantProfile,
    visits,
    setVisits,
    savedProperties,
    setSavedProperties,
    fetchTenant,
    fetchVisits,
    logoutUser,
    becomeLandlord,
    saveProp,
    removeProp,
    requestVisit,
    cancelVisit,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const UseUserContext = () => {
  return useContext(UserContext);
};
