"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { propertiesApi } from "@/features/properties/services/properties.api";
import { useRouter } from "next/navigation";

const PropertyContext = createContext();

export const PropertyContextProvider = ({ children }) => {
  const router = useRouter();
  const [properties, setProperties] = useState([]);
  const [property, setProperty] = useState({});
  const [allProperties, setAllProperties] = useState([]);
  const [propertiesLoading, setPropertiesLoading] = useState(true);
  const [propertiesError, setPropertiesError] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");

  const fetchAllProperties = useCallback(async () => {
    setPropertiesLoading(true);
    setPropertiesError("");
    try {
      const response = await propertiesApi.all();
      if (response.data.success) {
        setAllProperties(response.data.data);
      }
    } catch {
      setPropertiesError("Unable to load properties. Please try again.");
    } finally {
      setPropertiesLoading(false);
    }
  }, []);

  //filter
  const handleSearch = async (city, rent, propertyType) => {
    setSearchLoading(true);
    setSearchError("");
    try {
      const response = await propertiesApi.search({ city, rent, propertyType });
      if (response.data.success) {
        setProperties(response.data.data);
      }
      router.push("/filter-properties");
    } catch {
      setSearchError("Unable to search properties. Please try again.");
    } finally {
      setSearchLoading(false);
    }
  };
  //inividual property
  const searchProperty = async (id) => {
    try {
      const response = await propertiesApi.byId(id);
      if (response.data.success) {
        setProperty(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAllProperties();
  }, [fetchAllProperties]);

  const value = {
    handleSearch,
    properties,
    searchProperty,
    property,
    setProperty,
    allProperties,
    propertiesLoading,
    propertiesError,
    fetchAllProperties,
    searchLoading,
    searchError,
  };
  return (
    <PropertyContext.Provider value={value}>
      {children}
    </PropertyContext.Provider>
  );
};

export const UsePropertyContext = () => {
  return useContext(PropertyContext);
};
