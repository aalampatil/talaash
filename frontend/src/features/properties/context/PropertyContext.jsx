"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { propertiesApi } from "@/features/properties/services/properties.api";
import { useRouter } from "next/navigation";

const PropertyContext = createContext();

export const PropertyContextProvider = ({ children }) => {
  const router = useRouter();
  const [properties, setProperties] = useState([]);
  const [property, setProperty] = useState({});
  const [allProperties, setAllProperties] = useState([]);

  const fetchAllProperties = async () => {
    try {
      const response = await propertiesApi.all();
      if (response.data.success) {
        setAllProperties(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  //filter
  const handleSearch = async (city, rent, propertyType) => {
    try {
      const response = await propertiesApi.search({ city, rent, propertyType });
      if (response.data.success) {
        setProperties(response.data.data);
      }
      router.push("/filter-properties");
    } catch (error) {
      console.error(error);
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
  }, []);

  const value = {
    handleSearch,
    properties,
    searchProperty,
    property,
    setProperty,
    allProperties,
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
