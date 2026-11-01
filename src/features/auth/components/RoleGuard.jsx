"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { UseUserContext } from "@/features/auth/context/UserContext";
import PageLoader from "@/components/feedback/PageLoader";

const homeByRole = { tenant: "/", landlord: "/dashboard/landlord", admin: "/dashboard/admin" };

export default function RoleGuard({ children, role }) {
  const { authStatus, loading, user } = UseUserContext();
  const router = useRouter();
  const allowed = authStatus && user?.role === role;

  useEffect(() => {
    if (loading || allowed) return;
    router.replace(authStatus ? homeByRole[user?.role] || "/" : `/login/${role}`);
  }, [allowed, authStatus, loading, role, router, user?.role]);

  if (loading || !allowed) return <PageLoader />;
  return children;
}

