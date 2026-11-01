"use client";
import type { User } from "@/types/domain";


import { authApi } from "@/features/auth/services/auth.api";
import { axiosApi } from "@/lib/api/client";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { createContext,useContext,useEffect,useState } from "react";
import { toast } from "react-toastify";

const UserContext = createContext<ReturnType<typeof useUserContextValue> | null>(null);

function useUserContextValue() {
  const { getToken, isLoaded, isSignedIn, signOut, userId } = useAuth();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = axiosApi.interceptors.request.use(async (config) => {
      const token = await getToken();
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    });
    return () => { axiosApi.interceptors.request.eject(id); };
  }, [getToken]);

  useEffect(() => {
    let cancelled = false;
    if (!isLoaded) return;
    if (!isSignedIn) {
      setUser(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    authApi.me()
      .then(({ data }) => { if (!cancelled) setUser(data.success ? data.data : null); })
      .catch((error) => { if (!cancelled) setUser(null); console.error(error); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [isLoaded, isSignedIn, userId]);

  const logoutUser = async () => {
    try {
      await signOut();
      setUser(null);
      router.replace("/");
      toast.success("Logged out");
    } catch (error) {
      console.error(error);
    }
  };

  const becomeLandlord = async () => {
    try {
      const response = await authApi.becomeLandlord();
      if (response.data.success) {
        setUser(response.data.data);
        toast.success(response.data.message);
        router.push("/dashboard/landlord");
      }
    } catch (error) {
      console.error(error);
      toast.error("Could not activate landlord account");
    }
  };

  const currentUser = isSignedIn ? user : null;
  return {
      user: currentUser,
      authStatus: Boolean(currentUser),
      loading: !isLoaded || loading,
      logoutUser,
      becomeLandlord,
    };
}

export function UserContextProvider({ children }: { children: React.ReactNode }) { const value = useUserContextValue(); return <UserContext.Provider value={value}>{children}</UserContext.Provider>; }

export function UseUserContext() {
  const context = useContext(UserContext);
  if (!context) throw new Error("UseUserContext requires UserContextProvider");
  return context;
}
