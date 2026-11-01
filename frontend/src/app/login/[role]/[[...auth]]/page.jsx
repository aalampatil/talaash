import { notFound } from "next/navigation";
import Login from "@/features/auth/components/Login";

export default async function LoginPage({ params }) {
  const { role } = await params;
  if (!["tenant", "landlord", "admin"].includes(role)) notFound();
  return <Login role={role} />;
}

