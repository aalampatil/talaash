"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { axiosApi } from "@/lib/api/client.js";
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
      const response = await axiosApi.get("/landlord/profile");
      if (response.data.success) {
        setLandlordProfile(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchLandlordProperties = async () => {
    try {
      const response = await axiosApi.get("/landlord/property");
      if (response.data.success) {
        setLandlordProperties(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchVisits = async () => {
    try {
      const response = await axiosApi.get("/landlord/visits");
      if (response.data.success) {
        setManageVisits(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const createLandlordProperty = async (data) => {
    try {
      const response = await axiosApi.post("/landlord/property", data);
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
      const response = await axiosApi.delete(`/landlord/property/${id}`);
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
      const response = await axiosApi.patch(`/landlord/visit/approve/${id}`);
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
      const response = await axiosApi.patch(`/landlord/visit/reject/${id}`);
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
