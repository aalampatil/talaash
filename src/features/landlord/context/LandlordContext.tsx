"use client";
import type { Landlord,Property,Visit } from "@/types/domain";


import { UseUserContext } from "@/features/auth/context/UserContext";
import { landlordApi } from "@/features/landlord/services/landlord.api";
import { useRouter } from "next/navigation";
import { createContext,useContext,useEffect,useState } from "react";
import { toast } from "react-toastify";

const LandlordContext = createContext<ReturnType<typeof useLandlordContextValue> | null>(null);

function useLandlordContextValue() {
  const { authStatus, user } = UseUserContext();
  const [landlordProperties, setLandlordProperties] = useState<Property[]>([]);
  const [landlordProfile, setLandlordProfile] = useState<Partial<Landlord>>({});
  const [manageVisits, setManageVisits] = useState<Visit[]>([]);
  // const [llProperty, setLlProperty] = useState({})
  const router = useRouter();

  const fetchLandlordProfile = async () => {
    try {
      const response = await landlordApi.profile();
      if (response.data.success) {
        setLandlordProfile(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchLandlordProperties = async () => {
    try {
      const response = await landlordApi.properties();
      if (response.data.success) {
        setLandlordProperties(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchVisits = async () => {
    try {
      const response = await landlordApi.visits();
      if (response.data.success) {
        setManageVisits(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const createLandlordProperty = async (data: FormData) => {
    try {
      const response = await landlordApi.createProperty(data);
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchLandlordProperties(); // refresh list
        router.push("/dashboard/landlord/properties");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteLandlordProperty = async (id: string) => {
    try {
      const response = await landlordApi.deleteProperty(id);
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchLandlordProperties();
        setLandlordProperties((prev) =>
          prev.filter((property) => property._id !== id),
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("request failed, retry after some time");
    }
  };

  const approveVisit = async (id: string) => {
    try {
      const response = await landlordApi.approveVisit(id);
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchVisits();
      }
    } catch (error) {
      console.error(error);
      toast.error("request failed, retry after some time");
    }
  };

  const rejectVisit = async (id: string) => {
    try {
      const response = await landlordApi.rejectVisit(id);
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchVisits();
      }
    } catch (error) {
      console.error(error);
      toast.error("request failed, retry after some time");
    }
  };

  //   const extractIndividualProperty = (id: string) => {
  //   const property = landlordProperties.find((item) => item._id === id)
  //   setLlProperty(property)
  // }

  useEffect(() => {
    if (!authStatus || user?.role !== "landlord") return;

    fetchLandlordProfile();
    fetchLandlordProperties();
    fetchVisits();
  }, [authStatus, user]);

  const value = {
    approveVisit,
    rejectVisit,
    deleteLandlordProperty,
    createLandlordProperty,
    landlordProfile,
    landlordProperties,
    manageVisits,
  };
  return value;
}

export function LandlordContextProvider({ children }: { children: React.ReactNode }) { const value = useLandlordContextValue(); return <LandlordContext.Provider value={value}>{children}</LandlordContext.Provider>; }

export const UseLandlordContext = () => {
  const value = useContext(LandlordContext); if (!value) throw new Error("Missing LandlordContext provider"); return value;
};
