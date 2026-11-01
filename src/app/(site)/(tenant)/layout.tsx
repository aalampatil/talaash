import RoleGuard from "@/features/auth/components/RoleGuard";

export default function TenantLayout({ children }: { children: React.ReactNode }) {
  return <RoleGuard role="tenant">{children}</RoleGuard>;
}

