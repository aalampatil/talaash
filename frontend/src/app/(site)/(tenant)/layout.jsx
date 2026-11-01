import RoleGuard from "@/features/auth/components/RoleGuard";

export default function TenantLayout({ children }) {
  return <RoleGuard role="tenant">{children}</RoleGuard>;
}

