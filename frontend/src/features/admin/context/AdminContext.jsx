"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { axiosApi } from "@/lib/api/client.js";
import { UseUserContext } from "@/features/auth/context/UserContext.jsx";

const AdminContext = createContext();

export const AdminContextProvider = ({ children }) => {
  const { authStatus, user } = UseUserContext();
  const [allUsers, setAllUsers] = useState([]);
  const [allLandlords, setAllLandlords] = useState([]);
  const [allProperties, setAllProperties] = useState([]);

  const [totalUsers, setTotalUsers] = useState(0);
  const [totalProperties, setTotalProperties] = useState(0);
  const [totalLandlords, setTotalLandlords] = useState(0);

  // Fetch Users
  const fetchAllUsers = async () => {
    try {
      const response = await axiosApi.get("/admin/allUsers");

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
      const response = await axiosApi.get("/admin/allLandlords");

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
      const response = await axiosApi.get("/admin/allProperties");

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

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
};

export const UseAdminContext = () => {
  return useContext(AdminContext);
};
