"use client";
import type { Property } from "@/types/domain";


import { propertiesApi } from "@/features/properties/services/properties.api";
import { useRouter } from "next/navigation";
import { createContext,useCallback,useContext,useEffect,useState } from "react";

const PropertyContext = createContext<ReturnType<typeof usePropertyContextValue> | null>(null);

function usePropertyContextValue() {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [property, setProperty] = useState<Partial<Property>>({});
  const [allProperties, setAllProperties] = useState<Property[]>([]);
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
  const handleSearch = async (city: string, rent: string | number, propertyType: string) => {
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
  const searchProperty = async (id: string) => {
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
  return value;
}

export function PropertyContextProvider({ children }: { children: React.ReactNode }) { const value = usePropertyContextValue(); return <PropertyContext.Provider value={value}>{children}</PropertyContext.Provider>; }

export const UsePropertyContext = () => {
  const value = useContext(PropertyContext); if (!value) throw new Error("Missing PropertyContext provider"); return value;
};
