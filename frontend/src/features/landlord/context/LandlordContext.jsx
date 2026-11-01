"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { landlordApi } from "@/features/landlord/services/landlord.api";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { UseUserContext } from "@/features/auth/context/UserContext.jsx";

const LandlordContext = createContext();

export const LandlordContextProvider = ({ children }) => {
  const { authStatus, user } = UseUserContext();
  const [landlordProperties, setLandlordProperties] = useState([]);
  const [landlordProfile, setLandlordProfile] = useState({});
  const [manageVisits, setManageVisits] = useState([]);
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

  const createLandlordProperty = async (data) => {
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

  const deleteLandlordProperty = async (id) => {
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

  const approveVisit = async (id) => {
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

  const rejectVisit = async (id) => {
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

  //   const extractIndividualProperty = (id) => {
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
  return (
    <LandlordContext.Provider value={value}>
      {children}
    </LandlordContext.Provider>
  );
};

export const UseLandlordContext = () => {
  return useContext(LandlordContext);
};
