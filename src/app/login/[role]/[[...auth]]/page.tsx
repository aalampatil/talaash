import Login from "@/features/auth/components/Login";
import { notFound } from "next/navigation";

export default async function LoginPage({ params }: { params: Promise<{ role: string }> }) {
  const { role } = await params;
  if (!["tenant", "landlord", "admin"].includes(role)) notFound();
  return <Login role={role as import("@/types/domain").Role} />;
}

