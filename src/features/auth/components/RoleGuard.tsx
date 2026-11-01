"use client";


import PageLoader from "@/components/feedback/PageLoader";
import { UseUserContext } from "@/features/auth/context/UserContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const homeByRole = { tenant: "/", landlord: "/dashboard/landlord", admin: "/dashboard/admin" };

export default function RoleGuard({ children, role }: { children: React.ReactNode; role: import("@/types/domain").Role }) {
  const { authStatus, loading, user } = UseUserContext();
  const router = useRouter();
  const allowed = authStatus && user?.role === role;

  useEffect(() => {
    if (loading || allowed) return;
    router.replace(authStatus ? (user?.role ? homeByRole[user.role] : "/") || "/" : `/login/${role}`);
  }, [allowed, authStatus, loading, role, router, user?.role]);

  if (loading || !allowed) return <PageLoader />;
  return children;
}

